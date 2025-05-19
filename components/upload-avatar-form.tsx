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
import Link from "next/link";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, video: file });
    setFileName(file ? file.name : "No file chosen");

    // Clear related errors
    if (file) {
      const newErrors = { ...errors };
      delete newErrors.video;
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user types
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, side: value });

    // Clear side error
    const newErrors = { ...errors };
    delete newErrors.side;
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Avatar Type is always required
    if (!formData.side) {
      newErrors.side = "Avatar Type is required";
    }

    // Check Avatar name and Video file relationship
    if (formData.avatar_name && !formData.video) {
      newErrors.video = "Video file is required when Avatar name is provided";
    }

    if (formData.video && !formData.avatar_name) {
      newErrors.avatar_name =
        "Avatar name is required when Video file is provided";
    }

    // Check Voice name and Element labs voice ID relationship
    if (formData.voice_name && !formData.elevenlabs_voice_id) {
      newErrors.elevenlabs_voice_id =
        "Element labs voice ID is required when Voice name is provided";
    }

    if (formData.elevenlabs_voice_id && !formData.voice_name) {
      newErrors.voice_name =
        "Voice name is required when Element labs voice ID is provided";
    }

    // Check if either Avatar name + Video OR Voice name + ID is provided
    if (
      !formData.avatar_name &&
      !formData.video &&
      !formData.voice_name &&
      !formData.elevenlabs_voice_id
    ) {
      newErrors.general =
        "You must provide either Avatar details or Voice details";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the validation errors", {
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

      if (formData.avatar_name) {
        avatarFormData.append("avatar_name", formData.avatar_name);
      }

      if (formData.voice_name) {
        avatarFormData.append("voice_name", formData.voice_name);
      }

      if (formData.elevenlabs_voice_id) {
        avatarFormData.append(
          "elevenlabs_voice_id",
          formData.elevenlabs_voice_id
        );
      }

      if (formData.video) {
        avatarFormData.append("video", formData.video);
      }

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

      // Show success toast
      toast.success("Avatar created successfully", {
        description: `${
          formData.avatar_name || formData.voice_name
        } has been added to your avatars.`,
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

      // Add specific handling for different error types
      if (error.response?.status === 413) {
        toast.error("Upload failed", {
          description: "File size is too large. Please use a smaller file.",
          style: {
            background: "#ff5757",
            color: "white",
            border: "none",
          },
        });
      } else if (error.code === "ERR_NETWORK") {
        toast.error("Network error", {
          description:
            "Cannot connect to the server. Please check your internet connection.",
          style: {
            background: "#ff5757",
            color: "white",
            border: "none",
          },
        });
      } else {
        // Extract error message from API response if available
        const errorMessage =
          error.response?.data?.message ||
          "File size is too large. Please use a smaller file.";

        toast.error("Upload failed", {
          description: errorMessage || "Please try again.",
          style: {
            background: "#ff5757",
            color: "white",
            border: "none",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 relative overflow-hidden flex items-center justify-center">
        <BackgroundDecoration />

        {/* Header */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <Image
              src="/logo-1.png"
              alt="Logo"
              width={99}
              height={80}
              className="w-[60px] md:w-[80px] lg:w-[99px] h-10 md:h-16 lg:h-20 object-contain"
              priority
            />
          </Link>

          {/* empty to balance */}
          <div></div>

          {/* empty to balance */}
          <div></div>
        </div>

        <div className="w-full max-w-md mx-auto bg-[#FFFFFF66] backdrop-blur-sm rounded-xl p-10 px-6">
          <h1 className="text-2xl font-bold text-center text-[#141b34] mb-6">
            Upload New Avatar
          </h1>

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="side">
                Select Avatar Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.side} onValueChange={handleSelectChange}>
                <SelectTrigger
                  id="side"
                  className={`w-full ${errors.side ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select Avatar Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="USER">USER</SelectItem>
                </SelectContent>
              </Select>
              {errors.side && (
                <p className="text-red-500 text-xs">{errors.side}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_name">Avatar name</Label>
              <Input
                id="avatar_name"
                name="avatar_name"
                value={formData.avatar_name}
                onChange={handleInputChange}
                placeholder="Enter avatar name"
                className={errors.avatar_name ? "border-red-500" : ""}
              />
              {errors.avatar_name && (
                <p className="text-red-500 text-xs">{errors.avatar_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice_name">Voice name</Label>
              <Input
                id="voice_name"
                name="voice_name"
                value={formData.voice_name}
                onChange={handleInputChange}
                placeholder="Enter voice name"
                className={errors.voice_name ? "border-red-500" : ""}
              />
              {errors.voice_name && (
                <p className="text-red-500 text-xs">{errors.voice_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="elevenlabs_voice_id">Element labs voice ID</Label>
              <Input
                id="elevenlabs_voice_id"
                name="elevenlabs_voice_id"
                value={formData.elevenlabs_voice_id}
                onChange={handleInputChange}
                placeholder="Enter voice ID"
                className={errors.elevenlabs_voice_id ? "border-red-500" : ""}
              />
              {errors.elevenlabs_voice_id && (
                <p className="text-red-500 text-xs">
                  {errors.elevenlabs_voice_id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Choose Video File</Label>
              <div className="flex items-center">
                <Input
                  ref={fileInputRef}
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  className={`flex-1 border rounded-l-md bg-white p-2 text-sm truncate ${
                    errors.video ? "border-red-500" : ""
                  }`}
                >
                  {fileName}
                </div>
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
              {errors.video && (
                <p className="text-red-500 text-xs">{errors.video}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple hover:bg-purple/90 text-white mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Submit"}
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
    </RequireAuth>
  );
}
