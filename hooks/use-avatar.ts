"use client"

import { useState, useEffect } from "react"
import type { Avatar } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

// Mock data
const mockAvatars: Avatar[] = [
  {
    id: "1",
    name: "Default Avatar",
    type: "human",
    imageUrl: "/placeholder.svg?height=300&width=300",
    voiceName: "Default Voice",
    voiceId: "default-voice-id",
    createdAt: new Date(),
  },
]

export function useAvatar() {
  const { toast } = useToast()
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchAvatars = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setAvatars(mockAvatars)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load avatars")
        setIsLoading(false)
        toast({
          title: "Error",
          description: "Failed to load avatars",
          variant: "destructive",
        })
      }
    }

    fetchAvatars()
  }, [toast])

  const addAvatar = async (newAvatar: Omit<Avatar, "id" | "createdAt">) => {
    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const avatar: Avatar = {
        ...newAvatar,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
      }

      setAvatars((prev) => [...prev, avatar])
      toast({
        title: "Success",
        description: "Avatar added successfully",
      })

      return avatar
    } catch (err) {
      setError("Failed to add avatar")
      toast({
        title: "Error",
        description: "Failed to add avatar",
        variant: "destructive",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    avatars,
    isLoading,
    error,
    addAvatar,
  }
}
