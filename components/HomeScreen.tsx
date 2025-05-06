"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getAvatarsApi,
  speakApi,
  saveChatApi,
  getSavedChatsApi,
  getSavedChatApi,
  replayDialogueApi,
  analyzeTextApi,
  Avatar,
  SavedChat,
  SpeakPayload,
} from "@/lib/services/api";
import { v4 as uuidv4 } from "uuid";
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  text: string;
  sender: "user" | "ai";
  audioUrl?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ASSETS_URL || "http://192.168.10.251:8000";

const getFullUrl = (path: string): string => {
  if (path.startsWith("http")) return path;
  // console.log("Get audio::", `${API_BASE_URL}/media/${path}`);
  return `${API_BASE_URL}/media/${path}`;
};

export const HomeScreen = () => {
  const [leftAvatars, setLeftAvatars] = useState<Avatar[]>([]);
  const [rightAvatars, setRightAvatars] = useState<Avatar[]>([]);
  const [selectedLeftAvatar, setSelectedLeftAvatar] = useState<Avatar | null>(
    null
  );
  const [selectedRightAvatar, setSelectedRightAvatar] = useState<Avatar | null>(
    null
  );
  const [conversationId, setConversationId] = useState<string>(uuidv4());
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [analyzeText, setAnalyzeText] = useState<string>("");
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [personality, setPersonality] = useState<string>("friendly");
  const [replyAs, setReplyAs] = useState<string>("ai");
  const [leftUserInput, setLeftUserInput] = useState<string>("");
  const [rightUserInput, setRightUserInput] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentVideoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch avatars and saved chats on mount
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const avatars = await getAvatarsApi();
        const userAvatars = avatars.filter((a) => a.side === "USER");
        const aiAvatars = avatars.filter((a) => a.side === "AI");
        setLeftAvatars(userAvatars);
        setRightAvatars(aiAvatars);
        if (userAvatars.length > 0) setSelectedLeftAvatar(userAvatars[0]);
        if (aiAvatars.length > 0) setSelectedRightAvatar(aiAvatars[0]);
      } catch (error) {
        toast.error("Failed to load avatars. Please try again.");
      }
    };

    const fetchSavedChats = async () => {
      try {
        const chats = await getSavedChatsApi();
        setSavedChats(chats);
      } catch (error) {
        toast.error("Failed to load saved chats. Please try again.");
      }
    };

    fetchAvatars();
    fetchSavedChats();
  }, []);

  // Handle sending messages
  const handleSendMessage = async (text: string, sender: "user" | "ai") => {
    if (!text.trim()) return;
    if (!selectedLeftAvatar || !selectedRightAvatar) {
      toast.error("Please select both user and AI avatars.");
      return;
    }

    // Prevent AI side from sending when "Reply as" is "ai"
    if (sender === "ai" && replyAs === "ai") return;

    const effectiveReplyAs = sender === "user" ? "ai" : "user";
    const payload: SpeakPayload = {
      conversation_id: conversationId,
      text,
      sender_type: sender.toUpperCase(),
      user_voice_name: selectedLeftAvatar.voice_name,
      ai_voice_name: selectedRightAvatar.voice_name,
      reply_as: effectiveReplyAs.toUpperCase(),
      reply_text: text,
    };

    try {
      const response = await speakApi(payload);
      const newMessage: Message = {
        text,
        sender,
        audioUrl: getFullUrl(
          sender === "user" ? response.user_audio : response.ai_audio
        ),
      };

      setChatMessages((prev) => [...prev, newMessage]);
      await playAudioWithVideo(
        sender === "user" ? leftVideoRef : rightVideoRef,
        newMessage.audioUrl || ""
      );
      if (sender === "user") setLeftUserInput("");
      else setRightUserInput("");

      // Process automatic AI reply only when "Reply as" is "ai" and sender is "user"
      if (replyAs === "ai" && sender === "user" && response.reply) {
        const replySender = "ai";
        const replyMessage: Message = {
          text: response.reply,
          sender: replySender,
          audioUrl: getFullUrl(response.ai_audio),
        };
        setChatMessages((prev) => [...prev, replyMessage]);
        await playAudioWithVideo(rightVideoRef, replyMessage.audioUrl || "");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Fixed handleReplayDialogue function
  const handleReplayDialogue = async () => {
    // Stop playback if already playing
    if (isPlaying) {
      setIsPlaying(false);
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (currentVideoRef.current) {
        currentVideoRef.current.loop = false;
        currentVideoRef.current.pause();
        currentVideoRef.current.currentTime = 0;
        currentVideoRef.current = null;
      }
      return;
    }

    if (chatMessages.length === 0) {
      toast.info("No dialogue to replay.");
      return;
    }

    // Use a local variable to track playback state, avoiding React state delay
    let replayActive = true;
    setIsPlaying(true);
    toast.info("Starting replay...");

    try {
      const response = await replayDialogueApi({
        conversation_id: conversationId,
      });
      // console.log("Starting replay with response:", response);
      const { chat_list, audio_list } = response;

      if (!chat_list || !audio_list || chat_list.length === 0) {
        throw new Error("Invalid replay data received");
      }

      for (let i = 0; i < chat_list.length && replayActive; i++) {
        const msg = chat_list[i];
        const audio = audio_list[i];
        const sender = msg.user ? "user" : "ai";
        const audioPath = sender === "user" ? audio.user : audio.ai;

        if (!audioPath) {
          console.warn(`Missing audio path for message ${i}`);
          continue;
        }

        const audioUrl = getFullUrl(audioPath);
        // console.log(`Preparing to play message ${i} from ${sender}: ${audioUrl}`);
        const videoRef = sender === "user" ? leftVideoRef : rightVideoRef;

        try {
          await new Promise((resolve, reject) => {
            const audioElement = new Audio(audioUrl);
            currentAudioRef.current = audioElement;

            audioElement.addEventListener("canplaythrough", () => {
              // console.log(`Audio can play through: ${audioUrl}`);
              if (!replayActive) {
                resolve(undefined); // Exit if stopped during loading
                return;
              }

              if (videoRef.current) {
                currentVideoRef.current = videoRef.current;
                videoRef.current.currentTime = 0;
                videoRef.current.loop = true;
                videoRef.current.play().catch((err) => {
                  console.error(`Video playback error: ${err.message}`);
                });
              }

              audioElement
                .play()
                .then(() => {
                  // console.log(`Audio started playing: ${audioUrl}`);
                })
                .catch((err) => {
                  console.error(`Audio playback error: ${err.message}`);
                  reject(err);
                });
            });

            audioElement.addEventListener("ended", () => {
              // console.log(`Audio finished: ${audioUrl}`);
              if (videoRef.current) {
                videoRef.current.loop = false;
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
              resolve();
            });

            audioElement.addEventListener("error", (e) => {
              console.error(`Audio loading error for ${audioUrl}:`, e);
              reject(new Error(`Failed to load audio: ${audioUrl}`));
            });

            audioElement.load();
          });

          // Add a small delay between messages for natural flow
          if (replayActive) {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
        } catch (error) {
          console.error(`Error playing message ${i}:`, error);
          // Continue to next message on error
        }
      }

      // console.log("Replay complete");
      toast.success("Replay finished successfully!", {
        description: "All messages have been replayed.",
        style: {
          background: "#4caf50",
          color: "white",
          border: "none",
        },
      });
    } catch (error) {
      console.error("Replay error:", error);
      toast.error(`Failed to replay dialogue`, {
        description: (error as Error)?.message || "Please try again.",
        style: {
          background: "#ff5757",
          color: "white",
          border: "none",
        },
      });
    } finally {
      setIsPlaying(false);
      replayActive = false;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (currentVideoRef.current) {
        currentVideoRef.current.loop = false;
        currentVideoRef.current.pause();
        currentVideoRef.current.currentTime = 0;
        currentVideoRef.current = null;
      }
    }

    // Update isPlaying when stopping playback
    const stopPlayback = () => {
      replayActive = false;
      setIsPlaying(false);
    };

    // Expose stop functionality if needed elsewhere
    if (isPlaying) {
      window.stopReplay = stopPlayback; // Optional: for debugging via console
    }
  };

  // Improved playAudioWithVideo function
  const playAudioWithVideo = async (
    videoRef: React.RefObject<HTMLVideoElement>,
    audioUrl: string
  ) => {
    if (!audioUrl) {
      console.error("No audio URL provided");
      return Promise.reject(new Error("No audio URL provided"));
    }

    if (!videoRef.current) {
      console.error("Video reference is not available");
      return Promise.reject(new Error("Video reference is not available"));
    }

    const video = videoRef.current;

    // Clear any existing audio/video playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    if (currentVideoRef.current) {
      currentVideoRef.current.loop = false;
      currentVideoRef.current.pause();
      currentVideoRef.current.currentTime = 0;
      currentVideoRef.current = null;
    }

    // console.log("Creating new audio element for:", audioUrl);
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    currentVideoRef.current = video;

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        console.warn("Audio loading timed out:", audioUrl);
        reject(new Error("Audio loading timed out"));
      }, 10000); // 10 second timeout

      // Set up audio event handlers
      audio.addEventListener("canplaythrough", () => {
        clearTimeout(timeoutId);
        // console.log("Audio ready to play:", audioUrl);

        // Reset and prepare video
        video.currentTime = 0;
        video.loop = true;

        // Start video playback
        video.play().catch((err) => {
          console.error("Video playback failed:", err);
          reject(err);
        });

        // Start audio playback
        audio.play().catch((err) => {
          console.error("Audio playback failed:", err);
          reject(err);
        });
      });

      audio.addEventListener("ended", () => {
        // console.log("Audio ended:", audioUrl);
        clearTimeout(timeoutId);

        // Stop video looping and reset
        video.loop = false;
        video.pause();
        video.currentTime = 0;

        // Clear references
        currentAudioRef.current = null;
        currentVideoRef.current = null;
        resolve();
      });

      audio.addEventListener("error", (event) => {
        clearTimeout(timeoutId);
        console.error("Audio error for:", audioUrl, event);
        toast.error("Failed to load audio.");

        // Clean up
        video.loop = false;
        video.pause();
        video.currentTime = 0;
        reject(new Error("Audio failed to load"));
      });

      // Start loading the audio
      audio.load();
    });
  };

  // Save chat
  const handleSaveChat = async () => {
    if (chatMessages.length === 0) {
      toast.info("No chat to save.");
      return;
    }
    const title = prompt("Enter a title for this chat:");
    if (!title) return;
    try {
      await saveChatApi({ title, conversation_id: conversationId });
      toast.success("Chat saved successfully!", {
        description: `Chat "${title}" has been saved.`,
        style: {
          background: "#7630b5",
          color: "white",
          border: "none",
        },
      });
      const chats = await getSavedChatsApi();
      setSavedChats(chats);
    } catch (error) {
      toast.error("Failed to save chat. Please try again.");
    }
  };

  // Load saved chat
  const handleLoadChat = async (uid: string) => {
    try {
      const chatDetails = await getSavedChatApi(uid);
      setConversationId(chatDetails.conversation_id);
      const messages = chatDetails.chat_dict.map((msg, index) => {
        const sender = msg.user ? "user" : "ai";
        const text = msg.user || msg.ai;
        const audioUrl = getFullUrl(chatDetails.audio_dict[index][sender]);
        return { text, sender, audioUrl };
      });
      setChatMessages(messages);
      toast.success("Chat loaded successfully!", {
        description: `Loaded chat: ${chatDetails?.title}`,
        style: {
          background: "#7630b5",
          color: "white",
          border: "none",
        },
      });
    } catch (error) {
      toast.error("Failed to load chat. Please try again.");
    }
  };

  // Analyze text
  const handleAnalyzeText = async () => {
    if (!analyzeText.trim()) {
      toast.info("Please enter text to analyze.");
      return;
    }
    try {
      const response = await analyzeTextApi({ text: analyzeText });
      setAnalysisResult(response.summary || "No summary available");
    } catch (error) {
      console.error("Analyze text error:", error);
      toast.error("Failed to analyze text. Please try again.");
    }
  };

  // Voice input
  const startMic = (sender: "user" | "ai") => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      toast.info("Microphone is active. Start speaking...");
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      if (sender === "user") setLeftUserInput(text);
      else setRightUserInput(text);
      await handleSendMessage(text, sender);
    };

    recognition.onerror = (event) => {
      toast.error(`Speech recognition error: ${event.error}`);
      recognition.stop();
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      toast.info("Microphone stopped.");
    };

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      toast.info("Microphone stopped manually.");
    }
  };

  return (
    <div className='bg-white flex flex-row justify-center w-full'>
      <div className='bg-white w-full max-w-[1920px]'>
        <div className='relative min-h-screen bg-[url(/background1.webp)] bg-cover bg-[50%_0%] px-4 md:px-6 lg:px-10'>
          {/* Header */}
          <div className='flex justify-between items-center p-4'>
            <Image
              src='/logo-1.png'
              alt='Logo'
              width={99}
              height={80}
              className='w-[60px] md:w-[80px] lg:w-[99px] h-10 md:h-16 lg:h-20 object-cover'
            />
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#101010] text-2xl md:text-4xl lg:text-[56px] text-center tracking-[0] leading-[normal]">
              Internal Dialogue
            </h1>
            <Button
              className='w-[160px] md:w-[220px] h-10 md:h-14 gap-2.5 px-4 md:px-6 py-2 md:py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base'
              onClick={() => setShowAnalysisModal(!showAnalysisModal)}
            >
              {showAnalysisModal ? "Hide AI Analysis" : "Show AI Analysis"}
            </Button>
          </div>

          {/* Main Content Area */}
          <div className='pt-10 pb-8 px-2 md:px-6 lg:px-12 max-w-full mx-auto'>
            <div className='flex flex-col lg:flex-row justify-between gap-6 md:gap-8 lg:gap-12'>
              {/* Left Character and Chat (USER) */}
              <div className='flex flex-col md:flex-row lg:flex-row items-center md:items-start lg:items-start gap-4 md:gap-8 lg:gap-12 w-full lg:w-1/2'>
                <div className='flex flex-col w-full md:w-[300px] lg:w-[401px] items-center gap-[15px]'>
                  <video
                    ref={leftVideoRef}
                    src={selectedLeftAvatar?.video}
                    className='w-full h-auto md:h-[360px] lg:h-[482px] object-cover rounded-lg'
                    muted
                    playsInline
                  />
                  <div className='flex w-full md:w-[280px] lg:w-[312px] items-center gap-3 md:gap-5 lg:gap-7'>
                    <Select
                      value={selectedLeftAvatar?.uid}
                      onValueChange={(value) =>
                        setSelectedLeftAvatar(
                          leftAvatars.find((a) => a.uid === value) || null
                        )
                      }
                    >
                      <SelectTrigger className='h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5'>
                        <SelectValue placeholder='Select User' />
                      </SelectTrigger>
                      <SelectContent>
                        {leftAvatars.map((avatar) => (
                          <SelectItem key={avatar.uid} value={avatar.uid}>
                            {avatar.avatar_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className='h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5'>
                        <SelectValue placeholder='Voice' />
                      </SelectTrigger>
                      <SelectContent>
                        {leftAvatars.map((voice) => (
                          <SelectItem
                            key={voice.uid}
                            value={voice?.voice_name || "N/A"}
                          >
                            {voice?.voice_name || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='flex flex-col w-full md:w-[250px] lg:w-[299px] items-start gap-8 md:gap-12 lg:gap-20 px-0 py-4 md:py-6 lg:py-10 overflow-y-auto max-h-[482px]'>
                  {chatMessages
                    .filter((msg) => msg.sender === "user")
                    .map((msg, index) => (
                      <div
                        key={`left-message-${index}`}
                        className='flex flex-col self-stretch w-full items-center justify-center gap-2.5 p-2.5 bg-[#7630b599] rounded-[20px_20px_20px_4px]'
                      >
                        <p className="self-stretch mt-[-1.00px] font-['Inter',Helvetica] font-medium text-white text-sm md:text-base tracking-[0] leading-[normal]">
                          {msg.text}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Character and Chat (AI) */}
              <div className='flex flex-col md:flex-row-reverse lg:flex-row-reverse items-center md:items-start lg:items-start gap-4 md:gap-8 lg:gap-12 w-full lg:w-1/2'>
                <div className='flex flex-col w-full md:w-[300px] lg:w-[402px] items-center gap-[15px]'>
                  <video
                    ref={rightVideoRef}
                    src={selectedRightAvatar?.video}
                    className='w-full h-auto md:h-[360px] lg:h-[482px] object-cover rounded-lg'
                    muted
                    playsInline
                  />
                  <div className='flex w-full md:w-[280px] lg:w-[312px] items-center gap-3 md:gap-5 lg:gap-7'>
                    <Select
                      value={selectedRightAvatar?.voice_name}
                      onValueChange={(value) =>
                        setSelectedRightAvatar((prev) =>
                          prev ? { ...prev, voice_name: value } : prev
                        )
                      }
                    >
                      <SelectTrigger className='h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5'>
                        <SelectValue placeholder='Select AI Voice' />
                      </SelectTrigger>
                      <SelectContent>
                        {rightAvatars.map((avatar) => (
                          <SelectItem
                            key={avatar.uid}
                            value={avatar.voice_name}
                          >
                            {avatar.voice_name || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className='h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5'>
                        <SelectValue placeholder='Voice' />
                      </SelectTrigger>
                      <SelectContent>
                        {rightAvatars.map((voice) => (
                          <SelectItem
                            key={voice.uid}
                            value={voice?.voice_name || "N/A"}
                          >
                            {voice?.voice_name || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='flex flex-col w-full md:w-[250px] lg:w-[350px] items-end gap-8 md:gap-12 lg:gap-20 pt-4 md:pt-10 lg:pt-20 pb-0 px-0 overflow-y-auto max-h-[482px]'>
                  {chatMessages
                    .filter((msg) => msg.sender === "ai")
                    .map((msg, index) => (
                      <div
                        key={`right-message-${index}`}
                        className='flex flex-col self-stretch w-full items-center justify-center gap-2.5 p-2.5 bg-white rounded-[20px_20px_4px_20px] ml-auto'
                      >
                        <p className="self-stretch mt-[-1.00px] font-['Inter',Helvetica] font-medium text-[#7630b5] text-sm md:text-base text-center tracking-[0] leading-[normal]">
                          {msg.text}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Center Controls */}
            <div className='flex flex-col max-w-[424px] items-center gap-4 mt-8 md:-mt-12 md:gap-6 mx-auto mb-4 p-0'>
              <Link
                href='/upload-avatar'
                className='bg-[#7630b5] rounded-xl font-medium flex justify-center items-center text-white text-sm md:text-base h-12 md:h-14 px-6'
              >
                Upload New Avatar
              </Link>
              <Button
                onClick={handleReplayDialogue}
                className='bg-[#7630b5] rounded-xl text-white font-medium text-sm md:text-base h-12 md:h-14 px-6 flex justify-center items-center'
              >
                {isPlaying ? "⏸️ Pause Dialogue" : "⏯️ Replay Dialogue"}
              </Button>
              <Select onValueChange={handleLoadChat}>
                <SelectTrigger className='bg-[#7630b5] rounded-xl border-none text-white font-medium text-sm md:text-base h-12 md:h-14 px-6 flex items-center justify-between gap-2'>
                  <SelectValue placeholder='📂 Select Conversation' />
                </SelectTrigger>
                <SelectContent className='bg-white text-black border border-[#7630b5] rounded-xl'>
                  {savedChats.map((chat) => (
                    <SelectItem key={chat.uid} value={chat.uid}>
                      {chat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleSaveChat}
                className='bg-[#7630b5] rounded-xl text-white font-medium text-sm md:text-base h-12 md:h-14 px-6 flex justify-center items-center'
              >
                💾 Save This Chat
              </Button>
            </div>

            {/* Bottom Controls */}
            <Card className='flex flex-col md:flex-row items-center gap-3 p-3 md:p-4 lg:p-6 relative self-stretch w-full bg-[#ffffff4c] rounded-[20px]'>
              <CardContent className='flex flex-col md:flex-row items-center gap-3 p-0 w-full'>
                <Button
                  onClick={() => {
                    setConversationId(uuidv4());
                    setChatMessages([]);
                    toast.success(
                      "New conversation started!",

                      {
                        description: "You can now start a new conversation.",
                        style: {
                          background: "#7630b5",
                          color: "white",
                          border: "none",
                        },
                      }
                    );
                  }}
                  className='h-10 md:h-14 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base w-full md:w-auto'
                >
                  Start New Conversation
                </Button>
                <div className='flex flex-col md:flex-row items-center gap-3 w-full'>
                  <div className='flex items-center gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 relative flex-1 bg-[#ffffff33] rounded-xl w-full md:w-auto'>
                    <Input
                      className='h-10 md:h-12 flex-1 bg-white rounded-[50px] border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5 font-medium text-[#101010] text-xs'
                      placeholder='User says...'
                      value={leftUserInput}
                      onChange={(e) => setLeftUserInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handleSendMessage(leftUserInput, "user")
                      }
                    />
                    <Button
                      onClick={() => startMic("user")}
                      className='w-10 md:w-12 p-2 md:p-3 bg-[#7630b5] rounded-[50px]'
                    >
                      <Image
                        src='/mic-01.svg'
                        alt='mic'
                        width={24}
                        height={24}
                        className='w-5 h-5 md:w-6 md:h-6'
                      />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage(leftUserInput, "user")}
                      className='h-10 md:h-12 px-4 md:px-6 py-2 md:py-[7px] bg-[#7630b5] rounded-xl font-medium text-sm md:text-base'
                    >
                      Send
                    </Button>
                  </div>
                  <div className='flex items-center gap-2 mt-3 md:mt-0'>
                    <Select value={personality} onValueChange={setPersonality}>
                      <SelectTrigger className='w-[110px] md:w-[142px] h-10 md:h-12 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='friendly'>Friendly</SelectItem>
                        <SelectItem value='formal'>Formal</SelectItem>
                        <SelectItem value='casual'>Casual</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={replyAs} onValueChange={setReplyAs}>
                      <SelectTrigger className='w-[110px] md:w-[142px] h-10 md:h-12 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ai'>Reply as AI</SelectItem>
                        <SelectItem value='user'>Reply as User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex items-center gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 relative flex-1 bg-[#ffffff33] rounded-xl w-full md:w-auto mt-3 md:mt-0'>
                    <Input
                      className='h-10 md:h-12 flex-1 bg-white rounded-[50px] border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5 font-medium text-[#101010] text-xs'
                      placeholder='AI says...'
                      value={rightUserInput}
                      onChange={(e) => setRightUserInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handleSendMessage(rightUserInput, "ai")
                      }
                    />
                    <Button
                      onClick={() => startMic("ai")}
                      className='w-10 md:w-12 p-2 md:p-3 bg-[#7630b5] rounded-[50px]'
                    >
                      <Image
                        src='/mic-01.svg'
                        alt='mic'
                        width={24}
                        height={24}
                        className='w-5 h-5 md:w-6 md:h-6'
                      />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage(rightUserInput, "ai")}
                      disabled={replyAs === "ai"} // Disable the button if "Reply as AI"
                      className='h-10 md:h-12 px-4 md:px-6 py-2 md:py-[7px] bg-[#7630b5] rounded-xl font-medium text-sm md:text-base'
                    >
                      Send
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={stopMic}
                  className='h-10 md:h-14 gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base mt-3 md:mt-0 w-full md:w-auto'
                >
                  <Image
                    src='/mic-off.svg'
                    alt='mic off'
                    width={24}
                    height={24}
                    className='w-5 h-5 md:w-6 md:h-6'
                  />
                  Stop Mic
                </Button>
              </CardContent>
            </Card>

            {/* AI Analysis Modal */}
            <Dialog
              open={showAnalysisModal}
              onOpenChange={setShowAnalysisModal}
            >
              <DialogContent className='flex flex-col items-start gap-3 md:gap-5 p-4 md:p-6 bg-[#ffffff33] rounded-[20px] border border-[#7630b5] sm:max-w-[800px] max-h-[90vh] overflow-auto'>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 md:gap-6 font-['Inter',Helvetica] font-semibold text-white text-lg md:text-xl">
                    <img
                      className='relative w-8 h-8 md:w-10 md:h-10'
                      alt='AI Analysis Icon'
                      src='/frame.svg'
                    />
                    AI Analysis
                  </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col items-start gap-3 md:gap-5 relative self-stretch w-full'>
                  <Textarea
                    className='h-[150px] md:h-[244px] p-3 md:p-5 bg-white rounded-xl border border-solid border-[#7630b5] font-medium text-[#707070] text-sm md:text-base w-full'
                    placeholder='Paste chat history or any text here...'
                    value={analyzeText}
                    onChange={(e) => setAnalyzeText(e.target.value)}
                  />
                </div>
                {analysisResult && (
                  <div className='mt-4 p-4 bg-white rounded-xl w-full'>
                    <h3 className='font-semibold text-lg text-[#7630b5]'>
                      Analysis Result:
                    </h3>
                    <p className='text-[#101010]'>{analysisResult}</p>
                  </div>
                )}
                <Button
                  onClick={handleAnalyzeText}
                  className='w-28 md:w-40 h-10 md:h-14 px-4 md:px-6 py-2 md:py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base'
                >
                  Analyze
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
