"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Book,
  Car,
  ChevronRight,
  Clock,
  DollarSign,
  Edit,
  MessageSquare,
  Plus,
  Send,
  Trash,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Mock data for the AI assistant page
const mockVehicles = [
  {
    id: 1,
    title: "2021 Tesla Model 3",
    image: "/placeholder.svg?height=400&width=600",
    description: "Electric • White • 15,000 miles",
    currentBid: 32500,
    bids: 12,
    endTime: "2 days",
  },
  {
    id: 2,
    title: "2019 BMW X5",
    image: "/placeholder.svg?height=400&width=600",
    description: "SUV • Black • 28,500 miles",
    currentBid: 29800,
    bids: 8,
    endTime: "4 days",
  },
]

// Initial chat messages
const initialMessages = [
  {
    role: "assistant",
    content:
      "Hello! I'm your Carlink AI assistant. I can help you find vehicles, track auctions, and provide insights on the car market. What can I help you with today?",
    timestamp: new Date().toISOString(),
  },
]

// Initial notes
const initialNotes = [
  {
    id: 1,
    title: "Tesla Model 3 Notes",
    content: "Looking for a white Tesla Model 3 with less than 20,000 miles. Budget around $35,000.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    vehicleId: 1,
  },
  {
    id: 2,
    title: "Auction Strategy",
    content:
      "Wait until the last day to place bids. Research shows most auctions see significant activity in the final 24 hours.",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message to the AI
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }
    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      let response

      // Simple keyword matching for demo purposes
      if (input.toLowerCase().includes("tesla") || input.toLowerCase().includes("model 3")) {
        response = {
          role: "assistant",
          content:
            "I found a 2021 Tesla Model 3 in our auctions. It's white with 15,000 miles and the current bid is $32,500. Would you like more details about this vehicle?",
          timestamp: new Date().toISOString(),
        }
      } else if (input.toLowerCase().includes("bmw") || input.toLowerCase().includes("x5")) {
        response = {
          role: "assistant",
          content:
            "I found a 2019 BMW X5 in our auctions. It's a black SUV with 28,500 miles and the current bid is $29,800. Would you like more details about this vehicle?",
          timestamp: new Date().toISOString(),
        }
      } else if (input.toLowerCase().includes("auction") || input.toLowerCase().includes("bid")) {
        response = {
          role: "assistant",
          content:
            "Based on your auction history, you might be interested in the Tesla Model 3 ending in 2 days. The current bid is $32,500 with 12 bids so far. Would you like me to set a reminder before it ends?",
          timestamp: new Date().toISOString(),
        }
      } else if (input.toLowerCase().includes("note") || input.toLowerCase().includes("logbook")) {
        response = {
          role: "assistant",
          content:
            "I can help you manage your notes. You currently have 2 notes in your logbook. Would you like to create a new note, view existing ones, or search through them?",
          timestamp: new Date().toISOString(),
        }
      } else {
        response = {
          role: "assistant",
          content:
            "I can help you find vehicles, track auctions, and provide insights on the car market. Feel free to ask about specific models, auction strategies, or market trends.",
          timestamp: new Date().toISOString(),
        }
      }

      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  // Handle creating a new note
  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      timestamp: new Date().toISOString(),
      vehicleId: null,
    }

    setNotes([note, ...notes])
    setNewNote({ title: "", content: "" })
  }

  // Handle updating a note
  const handleUpdateNote = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id
        ? { ...note, title: newNote.title, content: newNote.content, timestamp: new Date().toISOString() }
        : note,
    )
    setNotes(updatedNotes)
    setNewNote({ title: "", content: "" })
    setEditingNote(null)
  }

  // Handle editing a note
  const handleEditNote = (id: number) => {
    const note = notes.find((note) => note.id === id)
    if (note) {
      setNewNote({ title: note.title, content: note.content })
      setEditingNote(id)
    }
  }

  // Handle deleting a note
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id))
    if (editingNote === id) {
      setEditingNote(null)
      setNewNote({ title: "", content: "" })
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date for notes
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-gray-500">Get personalized help with your vehicle search and keep track of your notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="chat" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="logbook">Logbook</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-teal-600" />
                    Carlink AI Assistant
                  </CardTitle>
                  <CardDescription>Ask about vehicles, auctions, or get personalized recommendations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] px-4">
                    <div className="space-y-4 pt-2 pb-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === "user" ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="mt-1 text-xs opacity-70 text-right">{formatTimestamp(message.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                              <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 pt-2">
                  <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-teal-600 hover:bg-teal-700"
                      disabled={isTyping || !input.trim()}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="logbook" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Book className="h-5 w-5 text-teal-600" />
                    Vehicle Logbook
                  </CardTitle>
                  <CardDescription>Keep track of your thoughts, research, and auction strategies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <label htmlFor="note-title" className="text-sm font-medium">
                        Note Title
                      </label>
                      <Input
                        id="note-title"
                        placeholder="Enter a title for your note"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="note-content" className="text-sm font-medium">
                        Note Content
                      </label>
                      <Textarea
                        id="note-content"
                        placeholder="Write your note here..."
                        className="min-h-[120px]"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end">
                      {editingNote ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingNote(null)
                              setNewNote({ title: "", content: "" })
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="bg-teal-600 hover:bg-teal-700"
                            onClick={() => handleUpdateNote(editingNote)}
                            disabled={!newNote.title.trim() || !newNote.content.trim()}
                          >
                            Update Note
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="bg-teal-600 hover:bg-teal-700"
                          onClick={handleCreateNote}
                          disabled={!newNote.title.trim() || !newNote.content.trim()}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="font-medium">Your Notes</h3>
                    {notes.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Book className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>You don't have any notes yet</p>
                        <p className="text-sm">Add your first note to keep track of your thoughts</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notes.map((note) => (
                          <Card key={note.id} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{note.title}</CardTitle>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEditNote(note.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500"
                                    onClick={() => handleDeleteNote(note.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                              <CardDescription>{formatDate(note.timestamp)}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
                            </CardContent>
                            {note.vehicleId && (
                              <CardFooter className="p-4 pt-0">
                                <Link
                                  href={`/vehicles/${note.vehicleId}`}
                                  className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                                >
                                  View related vehicle
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </CardFooter>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Watched Vehicles</CardTitle>
              <CardDescription>Vehicles you're tracking</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-4 hover:bg-gray-50">
                    <Link href={`/vehicles/${vehicle.id}`} className="flex gap-4">
                      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium line-clamp-1">{vehicle.title}</h4>
                        <p className="text-sm text-gray-500">{vehicle.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-teal-600 text-sm font-medium">
                            <DollarSign className="h-3 w-3" />
                            <span>${vehicle.currentBid.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{vehicle.endTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/vehicles">View All Auctions</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium">Market Trend</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Electric vehicle prices have decreased 8% in the last month. Now might be a good time to place bids on
                  Tesla models.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium">Auction Alert</h4>
                </div>
                <p className="text-sm text-gray-700">
                  The Tesla Model 3 you're watching ends in 2 days. Based on similar auctions, expect increased bidding
                  activity in the final 24 hours.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium">For You</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Based on your search history, you might be interested in the 2019 BMW X5 that was recently listed. It
                  matches your preferred specifications.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

