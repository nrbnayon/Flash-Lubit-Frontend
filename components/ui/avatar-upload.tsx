"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

interface AvatarUploadProps {
  initialImage?: string
  onImageChange?: (file: File | null) => void
  className?: string
}

export function AvatarUpload({ initialImage, onImageChange, className = "" }: AvatarUploadProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(initialImage || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Call callback
    if (onImageChange) {
      onImageChange(file)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (onImageChange) {
      onImageChange(null)
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <Avatar className="w-24 h-24 border-2 border-primary/20">
          <AvatarImage src={preview || "/placeholder.svg?height=96&width=96"} alt="Avatar preview" />
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>

        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-4 w-4 mr-2" />
        {preview ? "Change" : "Upload"}
      </Button>
    </div>
  )
}
