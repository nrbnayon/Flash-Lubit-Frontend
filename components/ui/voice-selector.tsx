"use client"

import { useState, useEffect } from "react"
import { Mic, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface Voice {
  id: string
  name: string
}

interface VoiceSelectorProps {
  onVoiceSelect?: (voiceId: string) => void
  className?: string
}

// Mock voices data
const mockVoices: Voice[] = [
  { id: "voice-1", name: "Female Voice 1" },
  { id: "voice-2", name: "Male Voice 1" },
  { id: "voice-3", name: "Female Voice 2" },
  { id: "voice-4", name: "Male Voice 2" },
]

export function VoiceSelector({ onVoiceSelect, className = "" }: VoiceSelectorProps) {
  const { toast } = useToast()
  const [voices, setVoices] = useState<Voice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    // Simulate API fetch for voices
    const fetchVoices = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setVoices(mockVoices)
        setSelectedVoice(mockVoices[0].id)
        setIsLoading(false)
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load voices",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchVoices()
  }, [toast])

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value)
    if (onVoiceSelect) {
      onVoiceSelect(value)
    }
  }

  const playVoiceSample = () => {
    setIsPlaying(true)

    // Simulate voice playback
    toast({
      title: "Playing voice sample",
      description: `Playing sample for ${voices.find((v) => v.id === selectedVoice)?.name}`,
    })

    // Simulate playback duration
    setTimeout(() => {
      setIsPlaying(false)
    }, 2000)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Select value={selectedVoice} onValueChange={handleVoiceChange} disabled={isLoading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={isLoading || isPlaying || !selectedVoice}
        onClick={playVoiceSample}
      >
        {isPlaying ? <Mic className="h-4 w-4 animate-pulse" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
