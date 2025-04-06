"use client"

import { useAuth } from "@/lib/hooks/useAuth"; // You'll need to create this hook
import {
  ArrowLeft,
  Book,
  ChevronRight,
  Edit,
  Plus,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ChatInterface } from '@/components/chat/chat-interface';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  vehicleId?: number;
}

// Initial notes
const initialNotes: Note[] = [
  {
    id: 1,
    title: "Tesla Model 3 Notes",
    content: "Looking for a white Tesla Model 3 with less than 20,000 miles. Budget around $35,000.",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    vehicleId: 1,
  }
]

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [editingNote, setEditingNote] = useState<number | null>(null)
  const { user } = useAuth() // Get the authenticated user

  // Handle creating a new note
  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const note: Note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      timestamp: new Date().toISOString(),
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
          <Book className="h-5 w-5" />
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
              {user ? (
                <ChatInterface userId={user.uid} />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">Please sign in to use the AI assistant</p>
                    <Button className="mt-4" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
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
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium">Market Trend</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Electric vehicle prices have decreased 8% in the last month. Now might be a good time to place bids on
                  Tesla models.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-4 w-4 text-teal-600" />
                  <h4 className="font-medium">Auction Alert</h4>
                </div>
                <p className="text-sm text-gray-700">
                  The Tesla Model 3 you're watching ends in 2 days. Based on similar auctions, expect increased bidding
                  activity in the final 24 hours.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-4 w-4 text-teal-600" />
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

