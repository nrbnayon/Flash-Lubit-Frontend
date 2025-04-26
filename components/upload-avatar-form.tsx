"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Logo } from "@/components/ui/logo"
import { BackgroundDecoration } from "@/components/ui/background-decoration"

export function UploadAvatarForm() {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    avatarType: "",
    avatarName: "",
    voiceName: "",
    voiceId: "",
    file: null as File | null,
  })

  const [fileName, setFileName] = useState("No file choose")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, file })
    setFileName(file ? file.name : "No file choose")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, avatarType: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.avatarType || !formData.avatarName || !formData.voiceName || !formData.voiceId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Avatar uploaded successfully",
        description: `Avatar "${formData.avatarName}" has been created`,
      })

      // Navigate back to chat
      router.push("/")
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your avatar",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 relative overflow-hidden flex items-center justify-center">
      <BackgroundDecoration />

      {/* Logo */}
      <Logo className="absolute top-6 left-6" />

      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-center text-[#141b34] mb-6">Upload New Avatar</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatarType">Select Avatar</Label>
              <Select value={formData.avatarType} onValueChange={handleSelectChange}>
                <SelectTrigger id="avatarType" className="w-full">
                  <SelectValue placeholder="Select Avatar Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="animal">Animal</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarName">Avatar name</Label>
              <Input
                id="avatarName"
                name="avatarName"
                value={formData.avatarName}
                onChange={handleInputChange}
                placeholder="Enter avatar name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voiceName">Voice name</Label>
              <Input
                id="voiceName"
                name="voiceName"
                value={formData.voiceName}
                onChange={handleInputChange}
                placeholder="Enter voice name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voiceId">Elevent labs voice ID</Label>
              <Input
                id="voiceId"
                name="voiceId"
                value={formData.voiceId}
                onChange={handleInputChange}
                placeholder="Enter voice ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Choose File</Label>
              <div className="flex items-center">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex-1 border rounded-l-md bg-white p-2 text-sm truncate">{fileName}</div>
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-l-none"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#7630b5] hover:bg-[#7630b5]/90 text-white mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-[#7630b5] flex items-center justify-center"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chat
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
