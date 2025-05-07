// components\upload-avatar-form.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { BackgroundDecoration } from "@/components/ui/background-decoration";
import Image from "next/image";
import api from "@/lib/axios";
import { RequireAuth } from "./RequireAuth";

interface AvatarResponse {
  id: number;
  uid: string;
  side: string;
  avatar_name: string;
  voice_name: string;
  elevenlabs_voice_id: string;
  video: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export function UploadAvatarForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    side: "",
    avatar_name: "",
    voice_name: "",
    elevenlabs_voice_id: "",
    video: null as File | null,
  });

  const [fileName, setFileName] = useState("No file chosen");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, video: file });
    setFileName(file ? file.name : "No file chosen");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, side: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log("Form submission started with data:", formData);

    // Validate form
    if (
      !formData.side ||
      !formData.avatar_name ||
      !formData.voice_name ||
      !formData.elevenlabs_voice_id ||
      !formData.video
    ) {
      // console.log("Validation failed - missing fields");
      toast.error("Please fill in all required fields and select a file", {
        style: {
          background: "#ff5757",
          color: "white",
          border: "none",
        },
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const avatarFormData = new FormData();
      avatarFormData.append("side", formData.side);
      avatarFormData.append("avatar_name", formData.avatar_name);
      avatarFormData.append("voice_name", formData.voice_name);
      avatarFormData.append(
        "elevenlabs_voice_id",
        formData.elevenlabs_voice_id
      );
      avatarFormData.append("video", formData.video);

      // console.log("Form data prepared for submission:", avatarFormData);

      // console.log("Sending API request to create avatar");

      // Use axios to post the form data
      const response = await api.post<AvatarResponse>(
        "/avatar",
        avatarFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Avatar created successfully:", response.data);

      // console.log("API response received:", response.data);

      // Show success toast
      toast.success("Avatar created successfully", {
        description: `${formData.avatar_name} has been added to your avatars.`,
        style: {
          background: "#7630b5",
          color: "white",
          border: "none",
        },
      });

      // Navigate back to chat after short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      console.error("Avatar upload failed:", error);

      // Extract error message from API response if available
      const errorMessage =
        error.response?.data?.message ||
        "There was an error uploading your avatar";

      toast.error("Upload failed", {
        description: errorMessage || "Please try again.",
        style: {
          background: "#ff5757",
          color: "white",
          border: "none",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <div className='min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 relative overflow-hidden flex items-center justify-center'>
        <BackgroundDecoration />

        {/* Header */}
        <div className='absolute top-0 left-0 w-full flex justify-between items-center p-4'>
          {/* Logo */}
          <div className='relative z-10'>
            <Image
              src='/logo-1.png'
              alt='Logo'
              width={99}
              height={80}
              className='w-[60px] md:w-[80px] lg:w-[99px] h-10 md:h-16 lg:h-20 object-contain'
              priority
            />
          </div>

          {/* empty to balance */}
          <div></div>

          {/* empty to balance */}
          <div></div>
        </div>

        <div className='w-full max-w-md mx-auto bg-[#FFFFFF66] backdrop-blur-sm rounded-xl p-10 px-6'>
          <h1 className='text-2xl font-bold text-center text-[#141b34] mb-6'>
            Upload New Avatar
          </h1>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='side'>Select Avatar Type</Label>
              <Select value={formData.side} onValueChange={handleSelectChange}>
                <SelectTrigger id='side' className='w-full'>
                  <SelectValue placeholder='Select Avatar Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='AI'>AI</SelectItem>
                  <SelectItem value='USER'>USER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='avatar_name'>Avatar name</Label>
              <Input
                id='avatar_name'
                name='avatar_name'
                value={formData.avatar_name}
                onChange={handleInputChange}
                placeholder='Enter avatar name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='voice_name'>Voice name</Label>
              <Input
                id='voice_name'
                name='voice_name'
                value={formData.voice_name}
                onChange={handleInputChange}
                placeholder='Enter voice name'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='elevenlabs_voice_id'>Element labs voice ID</Label>
              <Input
                id='elevenlabs_voice_id'
                name='elevenlabs_voice_id'
                value={formData.elevenlabs_voice_id}
                onChange={handleInputChange}
                placeholder='Enter voice ID'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='video'>Choose Video File</Label>
              <div className='flex items-center'>
                <Input
                  ref={fileInputRef}
                  id='video'
                  type='file'
                  accept='video/*'
                  onChange={handleFileChange}
                  className='hidden'
                />
                <div className='flex-1 border rounded-l-md bg-white p-2 text-sm truncate'>
                  {fileName}
                </div>
                <Button
                  type='button'
                  variant='secondary'
                  className='rounded-l-none'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className='h-4 w-4 mr-2' />
                  Browse
                </Button>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-[#7630b5] hover:bg-[#7630b5]/90 text-white mt-6'
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Submit"}
            </Button>

            <Button
              type='button'
              variant='ghost'
              className='w-full text-[#7630b5] flex items-center justify-center'
              onClick={() => router.push("/")}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Chat
            </Button>
          </form>
        </div>
      </div>
    </RequireAuth>
  );
}
