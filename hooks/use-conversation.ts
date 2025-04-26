"use client"

import { useState, useEffect } from "react"
import type { Conversation, Message } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { generateUniqueId } from "@/lib/utils"

// Mock initial conversation
const initialConversation: Conversation = {
  id: "1",
  title: "New Conversation",
  messages: [
    {
      id: "1",
      text: "Hi",
      sender: "left",
      timestamp: new Date(),
      userId: "user1",
    },
    {
      id: "2",
      text: "Hi",
      sender: "right",
      timestamp: new Date(),
      userId: "user2",
    },
  ],
  participants: [
    {
      id: "user1",
      name: "User 01",
      avatarUrl: "/placeholder.svg?height=300&width=300",
    },
    {
      id: "user2",
      name: "User 02",
      avatarUrl: "/placeholder.svg?height=300&width=300",
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
}

export function useConversation() {
  const { toast } = useToast()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchConversation = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        \
          this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setConversation(initialConversation)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load conversation")
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load conversation",
          variant: "destructive",
        })
      }
    }

    fetchConversation()
  }, [toast])

  const addMessage = (text: string, sender: "left" | "right", userId: string) => {
    if (!conversation) return

    const newMessage: Message = {
      id: generateUniqueId(),
      text,
      sender,
      timestamp: new Date(),
      userId,
    }

    setConversation((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date(),
      }
    })

    return newMessage
  }

  const createNewConversation = async () => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newConversation: Conversation = {
        ...initialConversation,
        id: generateUniqueId(),
        title: "New Conversation",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setConversation(newConversation)
      toast({
        title: "Success",
        description: "New conversation created",
      })

      return newConversation
    } catch (err) {
      setError("Failed to create conversation")
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    conversation,
    isLoading,
    error,
    addMessage,
    createNewConversation,
  }
}
