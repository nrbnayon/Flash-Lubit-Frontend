"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

interface UseSpeechProps {
  onTranscript?: (text: string) => void
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export function useSpeech({ onTranscript }: UseSpeechProps = {}) {
  const { toast } = useToast()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition",
        variant: "destructive",
      })
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognitionInstance = new SpeechRecognition()

    recognitionInstance.continuous = true
    recognitionInstance.interimResults = true
    recognitionInstance.lang = "en-US"

    recognitionInstance.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      setTranscript(currentTranscript)

      if (finalTranscript && onTranscript) {
        onTranscript(finalTranscript)
      }
    }

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      toast({
        title: "Speech Recognition Error",
        description: `Error: ${event.error}`,
        variant: "destructive",
      })
      setIsListening(false)
    }

    recognitionInstance.onend = () => {
      if (isListening) {
        recognitionInstance.start()
      }
    }

    setRecognition(recognitionInstance)

    return () => {
      recognitionInstance.stop()
    }
  }, [toast, onTranscript, isListening])

  const startListening = useCallback(() => {
    if (!recognition) return

    try {
      recognition.start()
      setIsListening(true)
      setTranscript("")
      toast({
        title: "Listening",
        description: "Speech recognition started",
      })
    } catch (error) {
      console.error("Failed to start speech recognition", error)
      toast({
        title: "Error",
        description: "Failed to start speech recognition",
        variant: "destructive",
      })
    }
  }, [recognition, toast])

  const stopListening = useCallback(() => {
    if (!recognition) return

    recognition.stop()
    setIsListening(false)
    toast({
      title: "Stopped Listening",
      description: "Speech recognition stopped",
    })
  }, [recognition, toast])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  }
}
