import { db } from '@/lib/firebase';
import { addDoc, collection, DocumentData, getDocs, limit, orderBy, query, Query, where } from 'firebase/firestore';
import fs from 'fs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to read the prompt file
async function readPromptFile(): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'app/api/chat/content-p.txt');
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Error reading prompt file:', error);
    throw new Error('Failed to read prompt file');
  }
}

// Function to fetch vehicles from Firestore with filters
async function fetchVehicles(filters: { 
  type?: string; 
  color?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
} = {}): Promise<any[]> {
  try {
    let q: Query<DocumentData> = collection(db, 'vehicles');
    
    // Build the query based on filters
    const conditions = [];
    if (filters.type) conditions.push(where('type', '==', filters.type.toLowerCase()));
    if (filters.color) conditions.push(where('color', '==', filters.color.toLowerCase()));
    if (filters.brand) conditions.push(where('brand', '==', filters.brand.toLowerCase()));
    if (filters.status) conditions.push(where('status', '==', filters.status.toLowerCase()));
    if (filters.minPrice) conditions.push(where('currentBid', '>=', filters.minPrice));
    if (filters.maxPrice) conditions.push(where('currentBid', '<=', filters.maxPrice));
    
    // Add ordering and limit
    conditions.push(orderBy('createdAt', 'desc'));
    conditions.push(limit(10));
    
    q = query(q, ...conditions);
    
    const snapshot = await getDocs(q);
    const vehicles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return vehicles;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
}

// Function to extract filters from user message
function extractFilters(message: string) {
  const filters: any = {};
  
  // Vehicle types
  const types = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'convertible', 'van'];
  types.forEach(type => {
    if (message.toLowerCase().includes(type)) filters.type = type;
  });
  
  // Colors
  const colors = ['black', 'white', 'red', 'blue', 'green', 'silver', 'gray'];
  colors.forEach(color => {
    if (message.toLowerCase().includes(color)) filters.color = color;
  });
  
  // Brands
  const brands = ['toyota', 'honda', 'ford', 'bmw', 'mercedes', 'tesla', 'audi'];
  brands.forEach(brand => {
    if (message.toLowerCase().includes(brand)) filters.brand = brand;
  });
  
  // Price ranges
  const priceMatch = message.match(/\$(\d+)(?:-\$(\d+))?/);
  if (priceMatch) {
    filters.minPrice = parseInt(priceMatch[1]);
    if (priceMatch[2]) filters.maxPrice = parseInt(priceMatch[2]);
  }
  
  // Status
  if (message.toLowerCase().includes('active')) filters.status = 'active';
  if (message.toLowerCase().includes('sold')) filters.status = 'sold';
  
  return filters;
}

// Function to add entry to logbook
async function addToLogbook(content: string, userId: string) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const logbookRef = collection(db, 'logbook');
    const docRef = await addDoc(logbookRef, {
      content,
      userId,
      timestamp: new Date().toISOString(),
      type: 'note',
      title: content.substring(0, 50) + (content.length > 50 ? '...' : ''), // Create a title from content
      status: 'active',
      tags: extractTags(content), // Extract any hashtags from content
      vehicleId: extractVehicleId(content) // Extract any vehicle references
    });

    console.log('Logbook entry created with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding to logbook:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

// Helper function to extract hashtags from content
function extractTags(content: string): string[] {
  const tags = content.match(/#\w+/g) || [];
  return tags.map(tag => tag.substring(1)); // Remove the # symbol
}

// Helper function to extract vehicle references
function extractVehicleId(content: string): string | null {
  const vehicleMatch = content.match(/vehicle\s*#?(\w+)/i);
  return vehicleMatch ? vehicleMatch[1] : null;
}

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const systemPrompt = await readPromptFile();
    
    // Check if this is a logbook entry request
    if (message.toLowerCase().startsWith('add to log')) {
      const content = message.substring('add to log'.length).trim();
      if (!content) {
        return NextResponse.json({ 
          response: "Please provide content to add to your logbook." 
        });
      }

      const result = await addToLogbook(content, userId);
      
      if (result.success) {
        return NextResponse.json({ 
          response: "I've added that to your logbook successfully! You can view it in your logbook tab." 
        });
      } else {
        console.error('Logbook error details:', result.details);
        return NextResponse.json({ 
          response: `I'm sorry, I couldn't add that to your logbook: ${result.error}` 
        });
      }
    }
    
    // Extract filters from the message
    const filters = extractFilters(message);
    const vehicles = await fetchVehicles(filters);

    // Create a context string from the vehicles data
    const vehicleContext = vehicles.length > 0 
      ? vehicles.map(vehicle => `
        Vehicle: ${vehicle.brand} ${vehicle.model} (${vehicle.year})
        Type: ${vehicle.type}
        Color: ${vehicle.color}
        Mileage: ${vehicle.mileage.toLocaleString()} miles
        Current Bid: $${vehicle.currentBid?.toLocaleString() || vehicle.startingPrice.toLocaleString()}
        Status: ${vehicle.status}
        Description: ${vehicle.description}
        Auction Ends: ${vehicle.endTime ? new Date(vehicle.endTime).toLocaleString() : 'No end time set'}
      `).join('\n')
      : 'There are currently no vehicles matching your criteria in the inventory.';

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nHere are the vehicles matching your criteria:\n${vehicleContext}\n\nUse this information to answer questions about available vehicles. If there are no vehicles available, inform the user and suggest they try different search criteria.`,
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 