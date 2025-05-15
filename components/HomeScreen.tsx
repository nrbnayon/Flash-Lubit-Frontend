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
import api from "@/lib/axios";
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    stopReplay?: () => void;
  }
}

interface Message {
  text: string;
  reply_text?: string;
  sender: "user" | "ai";
  audioUrl?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_ASSETS_URL || "https://flashapi.lubitsh.com/api";

const getFullUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
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
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null
  );
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [personality, setPersonality] = useState<string>("friendly");
  const [userVoice, setUserVoice] = useState<string>("");
  const [aiVoice, setAiVoice] = useState<string>("");
  const [replyAs, setReplyAs] = useState<string>("ai");
  const [leftUserInput, setLeftUserInput] = useState<string>("");
  const [rightUserInput, setRightUserInput] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<{ recognition: any; stop: () => void } | null>(
    null
  );
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentVideoRef = useRef<HTMLVideoElement | null>(null);
  const [activeMic, setActiveMic] = useState<"user" | "ai" | null>(null);
  const [showSaveChatDialog, setShowSaveChatDialog] = useState<boolean>(false);
  const [moodOptionsData, setMoodOptionsData] = useState<SavedChat[]>([]);
  const [chatTitle, setChatTitle] = useState<string>("");
  const leftMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const rightMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const leftMessagesRef = useRef<HTMLDivElement>(null);
  const rightMessagesRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = leftMessagesRef.current;
    const right = rightMessagesRef.current;

    if (!left || !right) return;

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      if (target.scrollTop !== source.scrollTop) {
        target.scrollTop = source.scrollTop;
      }
    };

    const handleLeftScroll = () => syncScroll(left, right);
    const handleRightScroll = () => syncScroll(right, left);

    left.addEventListener("scroll", handleLeftScroll);
    right.addEventListener("scroll", handleRightScroll);

    return () => {
      left.removeEventListener("scroll", handleLeftScroll);
      right.removeEventListener("scroll", handleRightScroll);
    };
  }, []);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scrolling up or at the top, show header
        setIsHeaderVisible(true);
      } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        // Scrolling down and not at the top, hide header
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToBottom = (sender: "user" | "ai") => {
    const messagesContainer =
      sender === "user" ? leftMessagesRef.current : rightMessagesRef.current;

    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  // const handleSendMessage = async (text: string, sender: "user" | "ai") => {
  //   if (!text.trim()) return;
  //   if (!selectedLeftAvatar || !selectedRightAvatar) {
  //     toast.error("Please select both user and AI avatars.");
  //     return;
  //   }

  //   if (sender === "ai" && replyAs === "ai") return;

  //   const effectiveReplyAs = sender === "user" ? "ai" : "user";
  //   const payload: SpeakPayload = {
  //     conversation_id: conversationId,
  //     text,
  //     sender_type: sender.toUpperCase(),
  //     user_voice_name: userVoice || selectedLeftAvatar.voice_name,
  //     ai_voice_name: aiVoice || selectedRightAvatar.voice_name,
  //     reply_as: effectiveReplyAs.toUpperCase(),
  //     mode: personality.toLowerCase(),
  //     reply_text: text,
  //   };

  //   // console.log("Send message payload:::", payload)

  //   try {
  //     const response = await speakApi(payload);
  //     const newMessage: Message = {
  //       text,
  //       sender,
  //       audioUrl: getFullUrl(
  //         sender === "user" ? response.user_audio : response.ai_audio
  //       ),
  //     };

  //     setChatMessages((prev) => [...prev, newMessage]);

  //     setTimeout(() => {
  //       scrollToBottom(sender);
  //     }, 100);

  //     await playAudioWithVideo(
  //       sender === "user" ? leftVideoRef : rightVideoRef,
  //       newMessage.audioUrl || ""
  //     );
  //     if (sender === "user") setLeftUserInput("");
  //     else setRightUserInput("");

  //     if (replyAs === "ai" && sender === "user" && response.reply) {
  //       const replySender = "ai";
  //       const replyMessage: Message = {
  //         text: response.reply,
  //         sender: replySender,
  //         audioUrl: getFullUrl(response.ai_audio),
  //       };
  //       setChatMessages((prev) => [...prev, replyMessage]);

  //       setTimeout(() => {
  //         scrollToBottom("ai");
  //       }, 100);

  //       await playAudioWithVideo(rightVideoRef, replyMessage.audioUrl || "");
  //     }
  //   } catch (error) {
  //     toast.error("Failed to send message. Please try again.");
  //   }
  // };

  const handleSendMessage = async (text: string, sender: "user" | "ai") => {
    if (!text.trim()) return;
    if (!selectedLeftAvatar || !selectedRightAvatar) {
      toast.error("Please select both user and AI avatars.");
      return;
    }

    // Use the replyAs state directly instead of deriving it from the sender
    const payload: SpeakPayload = {
      conversation_id: conversationId,
      text,
      sender_type: sender.toUpperCase(),
      user_voice_name: userVoice || selectedLeftAvatar.voice_name,
      ai_voice_name: aiVoice || selectedRightAvatar.voice_name,
      reply_as: replyAs.toUpperCase(), 
      mode: personality.toLowerCase(),
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

      setTimeout(() => {
        scrollToBottom(sender);
      }, 100);

      await playAudioWithVideo(
        sender === "user" ? leftVideoRef : rightVideoRef,
        newMessage.audioUrl || ""
      );
      if (sender === "user") setLeftUserInput("");
      else setRightUserInput("");

      if (replyAs === "ai" && sender === "user" && response.reply) {
        const replySender = "ai";
        const replyMessage: Message = {
          text: response.reply,
          sender: replySender,
          audioUrl: getFullUrl(response.ai_audio),
        };
        setChatMessages((prev) => [...prev, replyMessage]);

        setTimeout(() => {
          scrollToBottom("ai");
        }, 100);

        await playAudioWithVideo(rightVideoRef, replyMessage.audioUrl || "");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleReplayDialogue = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentPlayingIndex(null);
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
      toast.success("Replay stopped.", {
        style: { background: "#4caf50", color: "white", border: "none" },
      });
      return;
    }

    if (chatMessages.length === 0) {
      toast.error("No dialogue to replay.");
      return;
    }

    let replayActive = true;
    setIsPlaying(true);
    toast.success("Starting replay...");

    try {
      const response = await replayDialogueApi({
        conversation_id: conversationId,
      });
      const { chat_list, audio_list } = response;

      if (!chat_list || !audio_list || chat_list.length === 0) {
        throw new Error("Invalid replay data received");
      }

      for (let i = 0; i < chat_list.length && replayActive; i++) {
        const msg = chat_list[i];
        const audio = audio_list[i];
        const sender = msg.user ? "user" : "ai";
        if (!sender) continue;
        const audioPath = sender === "user" ? audio.user : audio.ai;

        if (!audioPath) {
          console.warn(`Missing audio path for message ${i}`);
          continue;
        }

        const audioUrl = getFullUrl(audioPath);
        const videoRef = sender === "user" ? leftVideoRef : rightVideoRef;

        const messageEl = messageRefs.current[i];
        if (messageEl && headerRef.current) {
          const headerHeight = headerRef.current.getBoundingClientRect().height;

          const messageContainer =
            sender === "user"
              ? leftMessagesRef.current
              : rightMessagesRef.current;
          if (messageContainer) {
            const messageRect = messageEl.getBoundingClientRect();
            const containerRect = messageContainer.getBoundingClientRect();

            if (
              messageRect.bottom > containerRect.bottom ||
              messageRect.top < containerRect.top
            ) {
              messageEl.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              });
            }
            const scrollOffset =
              messageRect.top -
              containerRect.top +
              messageContainer.scrollTop -
              headerHeight -
              10;
            messageContainer.scrollTo({
              top: scrollOffset,
              behavior: "smooth",
            });
          }
        }

        setCurrentPlayingIndex(i);

        try {
          await new Promise((resolve, reject) => {
            const audioElement = new Audio(audioUrl);
            currentAudioRef.current = audioElement;

            audioElement.addEventListener("canplaythrough", () => {
              if (!replayActive) {
                resolve(undefined);
                return;
              }

              if (videoRef.current) {
                currentVideoRef.current = videoRef.current;
                videoRef.current.currentTime = 0;
                videoRef.current.loop = true;
                videoRef.current.play().catch((err) => {
                  console.error(`Video playback that error: ${err.message}`);
                });
              }

              audioElement.play().catch((err) => {
                console.error(`Audio playback error: ${err.message}`);
                reject(err);
              });
            });

            audioElement.addEventListener("ended", () => {
              if (videoRef.current) {
                videoRef.current.loop = false;
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
              setCurrentPlayingIndex(null);
              resolve(undefined);
            });

            audioElement.addEventListener("error", (e) => {
              console.error(`Audio loading error for ${audioUrl}:`, e);
              reject(new Error(`Failed to load audio: ${audioUrl}`));
            });

            audioElement.load();
          });

          if (replayActive) {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
        } catch (error) {
          console.error(`Error playing message ${i}:`, error);
        }
      }

      toast.success("Replay finished successfully!", {
        description: "All messages have been replayed.",
        style: { background: "#4caf50", color: "white", border: "none" },
      });
    } catch (error) {
      console.error("Replay error:", error);
      toast.error(`Failed to replay dialogue`, {
        description: (error as Error)?.message || "Please try again.",
        style: { background: "#ff5757", color: "white", border: "none" },
      });
    } finally {
      setIsPlaying(false);
      setCurrentPlayingIndex(null);
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
  };

  const playAudioWithVideo = async (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    audioUrl: string
  ) => {
    if (!audioUrl || !videoRef.current)
      return Promise.reject(new Error("Invalid audio or video"));

    const video = videoRef.current;

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

    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    currentVideoRef.current = video;

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error("Audio loading timed out")),
        10000
      );

      audio.addEventListener("canplaythrough", () => {
        clearTimeout(timeoutId);
        video.currentTime = 0;
        video.loop = true;
        video.play().catch(reject);
        audio.play().catch(reject);
      });

      audio.addEventListener("ended", () => {
        clearTimeout(timeoutId);
        video.loop = false;
        video.pause();
        video.currentTime = 0;
        currentAudioRef.current = null;
        currentVideoRef.current = null;
        resolve();
      });

      audio.addEventListener("error", () => {
        clearTimeout(timeoutId);
        video.loop = false;
        video.pause();
        video.currentTime = 0;
        reject(new Error("Audio failed to load"));
      });

      audio.load();
    });
  };

  const handleSaveChat = async () => {
    if (chatMessages.length === 0) {
      toast.success("No chat to save.");
      return;
    }
    setTimeout(() => setShowSaveChatDialog(true), 0);
  };

  const submitSaveChat = async () => {
    if (!chatTitle.trim()) {
      toast.error("Please enter a title for this chat.");
      return;
    }

    try {
      await saveChatApi({ title: chatTitle, conversation_id: conversationId });
      toast.success("Chat saved successfully!", {
        description: `Chat "${chatTitle}" has been saved.`,
        style: { background: "#4caf50", color: "white", border: "none" },
      });
      const chats = await getSavedChatsApi();
      setSavedChats(chats);
      setShowSaveChatDialog(false);
      setChatTitle("");
    } catch (error) {
      toast.error("Failed to save chat. Please try again.");
    }
  };

  const handleLoadChat = async (uid: string) => {
    try {
      const chatDetails = await getSavedChatApi(uid);
      setConversationId(chatDetails.conversation_id);
      const messages = chatDetails.chat_dict.map((msg, index) => {
        const sender = msg.user ? "user" : "ai";
        const text = msg.user || msg.ai || "";
        const audioUrl = getFullUrl(
          chatDetails.audio_dict[index][sender] || ""
        );
        return { text, sender, audioUrl };
      });
      setChatMessages(messages as Message[]);

      setTimeout(() => {
        if (
          leftMessagesEndRef.current &&
          rightMessagesEndRef.current &&
          headerRef.current
        ) {
          const headerHeight = headerRef.current.getBoundingClientRect().height;
          [leftMessagesRef.current, rightMessagesRef.current].forEach(
            (container) => {
              if (container) {
                const endRect =
                  leftMessagesEndRef.current!.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const scrollOffset =
                  endRect.top -
                  containerRect.top +
                  container.scrollTop -
                  headerHeight -
                  10; // 10px buffer
                container.scrollTo({
                  top: scrollOffset,
                  behavior: "smooth",
                });
              }
            }
          );
        }
      }, 100);

      setTimeout(() => {
        if (leftMessagesRef.current && rightMessagesRef.current) {
          leftMessagesRef.current.scrollTop =
            leftMessagesRef.current.scrollHeight;
          rightMessagesRef.current.scrollTop =
            rightMessagesRef.current.scrollHeight;
        }
      }, 100);

      toast.success("Chat loaded successfully!", {
        description: `Loaded chat: ${chatDetails?.title}`,
        style: { background: "#4caf50", color: "white", border: "none" },
      });
    } catch (error) {
      toast.error("Failed to load chat. Please try again.");
    }
  };

  const handleAnalyzeText = async () => {
    if (!analyzeText.trim()) {
      toast.error("Please enter text to analyze.");
      return;
    }
    try {
      const response = await analyzeTextApi({ text: analyzeText });
      setAnalysisResult(response.summary || "No summary available");
    } catch (error) {
      toast.error("Failed to analyze text. Please try again.");
    }
  };

  // startMic  improved versions

  // const startMic = (sender: "user" | "ai") => {
  //   if (activeMic === sender) {
  //     stopMic();
  //     return;
  //   }

  //   const SpeechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (!SpeechRecognition) {
  //     toast.error("Speech recognition is not supported in this browser.");
  //     return;
  //   }

  //   stopMic();

  //   // Create and configure the recognition object
  //   const recognition = new SpeechRecognition();
  //   recognition.lang = "en-US";
  //   recognition.interimResults = true;
  //   recognition.continuous = true;

  //   let fullTranscript = "";
  //   let isRecognitionActive = true;

  //   // Auto-restart mechanism
  //   const restartRecognition = () => {
  //     if (isRecognitionActive) {
  //       try {
  //         recognition.start();
  //       } catch (error) {
  //         console.error("Error restarting speech recognition:", error);
  //         setTimeout(restartRecognition, 1000); // Try again after a short delay
  //       }
  //     }
  //   };

  //   recognition.onstart = () => {
  //     setActiveMic(sender);
  //     toast.success("Microphone is active. Start speaking...");
  //   };

  //   recognition.onresult = (event: any) => {
  //     let transcript = "";
  //     for (let i = event.resultIndex; i < event.results.length; ++i) {
  //       transcript += event.results[i][0].transcript;
  //       if (event.results[i].isFinal) {
  //         fullTranscript = transcript;
  //         if (sender === "user") setLeftUserInput(fullTranscript);
  //         else setRightUserInput(fullTranscript);
  //         handleSendMessage(fullTranscript, sender);
  //         fullTranscript = "";
  //       }
  //     }
  //   };

  //   recognition.onerror = (event: any) => {
  //     console.warn(`Speech recognition error: ${event.error}`);

  //     // Don't stop for most errors, especially "no-speech" errors
  //     if (event.error === "aborted" || event.error === "not-allowed") {
  //       isRecognitionActive = false;
  //       setActiveMic(null);
  //       toast.error(`Speech recognition error: ${event.error}`);
  //     }
  //   };

  //   recognition.onend = () => {
  //     console.log("Speech recognition service disconnected");
  //     // Immediately restart if still active
  //     if (isRecognitionActive) {
  //       console.log("Restarting speech recognition...");
  //       setTimeout(restartRecognition, 300);
  //     } else {
  //       setActiveMic(null);
  //       toast.success("Microphone stopped.");
  //     }
  //   };

  //   // Store the reference and status
  //   recognitionRef.current = {
  //     recognition,
  //     stop: () => {
  //       isRecognitionActive = false;
  //       try {
  //         recognition.stop();
  //       } catch (e) {
  //         console.error("Error stopping recognition:", e);
  //       }
  //     },
  //   };

  //   // Start the recognition
  //   try {
  //     recognition.start();
  //   } catch (error) {
  //     console.error("Error starting speech recognition:", error);
  //     toast.error("Failed to start speech recognition. Please try again.");
  //     isRecognitionActive = false;
  //     setActiveMic(null);
  //   }
  // };

  const startMic = (sender: "user" | "ai", autoSend: boolean = true) => {
    if (activeMic === sender) {
      stopMic();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    stopMic();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    let fullTranscript = "";
    let isRecognitionActive = true;

    const restartRecognition = () => {
      if (isRecognitionActive && fullTranscript.trim() === "") {
        try {
          recognition.start();
        } catch (error) {
          console.error("Error restarting speech recognition:", error);
          setTimeout(restartRecognition, 100);
        }
      }
    };

    recognition.onstart = () => {
      setActiveMic(sender);
      // toast.success("Microphone is active. Start speaking...");
    };

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      if (sender === "user") setLeftUserInput(transcript); // Real-time feedback
      else setRightUserInput(transcript);
      if (event.results[event.results.length - 1].isFinal && autoSend) {
        fullTranscript = transcript;
        recognitionRef.current?.stop();
        handleSendMessage(fullTranscript, sender);
        fullTranscript = "";
        if (sender === "user") setLeftUserInput("");
        else setRightUserInput("");
      }
    };

    recognition.onerror = (event: any) => {
      console.warn(`Speech recognition error: ${event.error}`);
      if (event.error === "aborted" || event.error === "not-allowed") {
        isRecognitionActive = false;
        setActiveMic(null);
        toast.error(`Speech recognition error: ${event.error}`);
      } else if (event.error === "no-speech") {
        toast.info("No speech detected. Keep speaking...");
      } else {
        toast.info(`Speech recognition issue: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // console.log("Speech recognition service disconnected");
      if (isRecognitionActive && fullTranscript.trim() === "") {
        // console.log("Restarting speech recognition...");
        setTimeout(restartRecognition, 100);
      } else {
        setActiveMic(null);
        // toast.success("Microphone stopped.");
      }
    };

    recognitionRef.current = {
      recognition,
      stop: () => {
        isRecognitionActive = false;
        try {
          recognition.stop();
        } catch (e) {
          console.error("Error stopping recognition:", e);
          toast.error("Failed to stop microphone. Please try again.");
        }
      },
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast.error("Failed to start speech recognition. Please try again.");
      isRecognitionActive = false;
      setActiveMic(null);
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setActiveMic(null);
      // toast.success("Microphone stopped.", {
      //   style: { background: "#4caf50", color: "white", border: "none" },
      // });
    }
  };

  const handleCopyChat = () => {
    if (chatMessages.length === 0) {
      toast.error("No messages to copy.");
      return;
    }

    const chatText = chatMessages
      .map((msg) => {
        const sender =
          msg.sender === "user"
            ? selectedLeftAvatar?.avatar_name || "User"
            : selectedRightAvatar?.avatar_name || "AI";
        return `${sender}: ${msg.text}`;
      })
      .join("\n\n");

    // Fallback copy method using a temporary textarea element
    try {
      // Try modern clipboard API first
      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        navigator.clipboard
          .writeText(chatText)
          .then(() => {
            toast.success("Chat copied to clipboard!", {
              description: "All messages have been copied.",
              style: { background: "#4caf50", color: "white", border: "none" },
            });
          })
          .catch((err) => {
            throw err; // Will be caught by outer try/catch
          });
      } else {
        // Fallback for browsers without clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = chatText;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (successful) {
          toast.success("Chat copied to clipboard!", {
            description: "All messages have been copied.",
            style: { background: "#4caf50", color: "white", border: "none" },
          });
        } else {
          throw new Error("Copy command was unsuccessful");
        }
      }
    } catch (err) {
      console.error("Failed to copy chat: ", err);
      toast.error("Failed to copy chat. Please try again.");
    }
  };

  useEffect(() => {
    const fetchMoodOptions = async () => {
      try {
        const response = await api.get("/moods");
        // console.log("Get Mood::", response.data);
        setMoodOptionsData(response.data);
      } catch (error) {
        console.error("Error fetching moods:", error);
        toast.error("Failed to fetch saved chats", {
          style: {
            background: "#ff5757",
            color: "white",
            border: "none",
          },
        });
      }
    };

    fetchMoodOptions();
  }, []);

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="w-full max-w-[1920px]">
        <div className="relative min-h-screen bg-[url(/background1.webp)] bg-cover bg-[50%_0%] px-4 md:px-6 lg:px-10">
          {/* Header */}
          <div
            ref={headerRef}
            className={`flex justify-between items-center p-4 sticky top-0 z-10 transition-transform duration-300 ${
              isHeaderVisible ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <Image
              src="/logo-1.png"
              alt="Logo"
              width={60}
              height={60}
              className="w-[60px] md:w-[60px] lg:w-[60px] h-8 lg:h-12 object-cover"
            />
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#101010] text-2xl md:text-2xl lg:text-3xl text-center tracking-[0] leading-[normal]">
              Internal Dialogue
            </h1>
            <Button
              className="w-[140px] md:w-[200px] h-10 md:h-12 gap-2.5 px-4 md:px-4 py-2 md:py-2.5 bg-purple rounded-xl font-medium text-sm md:text-base"
              onClick={() => setShowAnalysisModal(!showAnalysisModal)}
            >
              {showAnalysisModal ? "Hide AI Analysis" : "Show AI Analysis"}
            </Button>
          </div>

          <div className="pt-2 pb-6 px-2 md:px-6 lg:px-12 max-w-full mx-auto custom-scrollbar">
            <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 lg:gap-12">
              <div className="flex flex-col md:flex-row lg:flex-row items-center md:items-start lg:items-start gap-4 md:gap-6 lg:gap-8 w-full lg:w-1/2">
                <div className="flex flex-col w-full md:w-[300px] lg:w-[400px] items-center gap-4">
                  <video
                    ref={leftVideoRef}
                    src={selectedLeftAvatar?.video}
                    className="w-full h-auto md:h-[300px] lg:h-[400px] object-cover rounded-lg"
                    muted
                    playsInline
                  />
                  <div className="flex w-full md:w-[280px] lg:w-[300px] items-center gap-2 md:gap-4 lg:gap-5">
                    <Select
                      value={selectedLeftAvatar?.uid}
                      onValueChange={(value) =>
                        setSelectedLeftAvatar(
                          leftAvatars.find((a) => a.uid === value) || null
                        )
                      }
                    >
                      <SelectTrigger className="h-8 md:h-10 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-purple px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue placeholder="Select User" />
                      </SelectTrigger>
                      <SelectContent>
                        {leftAvatars.map((avatar) => (
                          <SelectItem key={avatar.uid} value={avatar.uid}>
                            {avatar.avatar_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={userVoice} onValueChange={setUserVoice}>
                      <SelectTrigger className="h-8 md:h-10 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-purple px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue placeholder="Select Voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {leftAvatars.map((voice) => (
                          <SelectItem
                            key={voice.uid}
                            value={
                              voice?.voice_name ||
                              leftAvatars[0]?.voice_name ||
                              selectedLeftAvatar?.voice_name ||
                              "N/A"
                            }
                          >
                            {voice?.voice_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div
                  ref={leftMessagesRef}
                  className="flex flex-col w-full md:max-w-[250px] lg:max-w-[300px] items-start gap-6 md:gap-8 lg:gap-10 px-0 py-4 md:py-6 lg:py-10 overflow-y-auto max-h-[400px] custom-scrollbar"
                >
                  {chatMessages.map((msg, originalIndex) =>
                    msg.sender === "user" ? (
                      <div
                        key={`left-message-${originalIndex}`}
                        ref={(el) => {
                          messageRefs.current[originalIndex] = el;
                        }}
                        className={`flex flex-col w-auto max-w-full items-start justify-center gap-2.5 p-2.5 bg-[#7630b599] rounded-[20px_20px_20px_4px] self-start ${
                          originalIndex === currentPlayingIndex ? "active" : ""
                        }`}
                      >
                        <p className="self-stretch font-['Inter',Helvetica] font-medium text-white text-sm md:text-base tracking-[0] leading-[normal]">
                          {msg.text}
                        </p>
                      </div>
                    ) : null
                  )}
                  <div ref={leftMessagesEndRef} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse lg:flex-row-reverse items-center md:items-start lg:items-start gap-4 md:gap-6 lg:gap-8 w-full lg:w-1/2">
                <div className="flex flex-col w-full md:w-[300px] lg:w-[400px] items-center gap-4">
                  <video
                    ref={rightVideoRef}
                    src={selectedRightAvatar?.video}
                    className="w-full h-auto md:h-[360px] lg:h-[400px] object-cover rounded-lg"
                    muted
                    playsInline
                  />
                  <div className="flex w-full md:w-[280px] lg:w-[300px] items-center gap-2 md:gap-4 lg:gap-5">
                    <Select
                      value={selectedRightAvatar?.uid}
                      onValueChange={(value) =>
                        setSelectedRightAvatar(
                          rightAvatars.find((a) => a.uid === value) || null
                        )
                      }
                    >
                      <SelectTrigger className="h-8 md:h-10 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-purple px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue placeholder="Select AI Avatar" />
                      </SelectTrigger>
                      <SelectContent>
                        {rightAvatars.map((avatar) => (
                          <SelectItem key={avatar.uid} value={avatar.uid}>
                            {avatar.avatar_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={aiVoice} onValueChange={setAiVoice}>
                      <SelectTrigger className="h-8 md:h-10 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-purple px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue placeholder="Select Voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {rightAvatars.map((voice) => (
                          <SelectItem
                            key={voice.uid}
                            value={
                              voice?.voice_name ||
                              rightAvatars[0]?.voice_name ||
                              selectedLeftAvatar?.voice_name ||
                              "N/A"
                            }
                          >
                            {voice?.voice_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div
                  ref={rightMessagesRef}
                  className="flex flex-col w-full md:max-w-[250px] lg:max-w-[300px] items-end gap-8 md:gap-10 lg:gap-10 pt-4 md:pt-10 lg:pt-20 pb-0 px-0 overflow-y-auto max-h-[400px]"
                >
                  {chatMessages.map((msg, originalIndex) =>
                    msg.sender === "ai" ? (
                      <div
                        key={`right-message-${originalIndex}`}
                        ref={(el) => {
                          messageRefs.current[originalIndex] = el;
                        }}
                        className={`flex flex-col w-auto max-w-full items-center justify-center gap-2.5 p-2.5 bg-white rounded-[20px_20px_4px_20px] self-end ${
                          originalIndex === currentPlayingIndex ? "active" : ""
                        }`}
                      >
                        <p className="self-stretch font-['Inter',Helvetica] font-medium text-[#7630b5] text-sm md:text-base tracking-[0] leading-[normal]">
                          {msg.text}
                        </p>
                      </div>
                    ) : null
                  )}
                  <div ref={rightMessagesEndRef} />
                </div>
              </div>
            </div>

            <div className="flex flex-col max-w-[400px] items-center gap-2 mt-8 md:-mt-4 md:gap-2 mx-auto p-0">
              <Link
                href="/upload-avatar"
                className="bg-purple rounded-xl text-white font-medium text-xs md:text-sm h-8 md:h-10 px-4 flex justify-center items-center"
              >
                Upload New Avatar
              </Link>
              <Button
                onClick={handleSaveChat}
                className="bg-purple rounded-xl text-white font-medium text-xs md:text-sm h-8 md:h-10 px-4 flex justify-center items-center"
              >
                💾 Save This Chat
              </Button>
              <div className="flex justify-center max-w-[400px] items-center gap-2">
                <Button
                  onClick={handleReplayDialogue}
                  className="bg-purple rounded-xl text-white font-medium text-xs md:text-sm h-8 md:h-10 px-4 flex justify-center items-center"
                >
                  {isPlaying ? "⏸️ Pause Dialogue" : "⏯️ Replay Dialogue"}
                </Button>
                <Button
                  onClick={handleCopyChat}
                  className="bg-purple rounded-xl text-white font-medium text-xs md:text-sm h-8 md:h-10 px-4 flex justify-center items-center"
                >
                  📋 Copy Chat
                </Button>
              </div>
              <Select onValueChange={handleLoadChat}>
                <SelectTrigger className="bg-purple rounded-xl border-none text-white font-medium text-xs md:text-sm h-8 md:h-10 px-4 flex justify-between items-center">
                  <SelectValue placeholder="📂 Select Conversation" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black border border-purple rounded-xl">
                  {savedChats.map((chat) => (
                    <SelectItem key={chat.uid} value={chat.uid}>
                      {chat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Card className="flex flex-col md:flex-row items-center gap-2 p-1 md:p-2 lg:p-4 relative self-stretch w-full bg-[#ffffff4c] mt-6 md:mt-8 rounded-[20px]">
              <CardContent className="flex flex-col md:flex-row items-center gap-3 p-0 w-full">
                <Button
                  onClick={() => {
                    setConversationId(uuidv4());
                    setChatMessages([]);
                    toast.success("New conversation started!", {
                      description: "You can now start a new conversation.",
                      style: {
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                      },
                    });
                  }}
                  className="h-10 md:h-12 bg-purple rounded-xl font-medium text-xs md:text-sm w-full md:w-auto"
                >
                  Start New Conversation
                </Button>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                  <div className="flex items-center gap-1 md:gap-4 px-1 md:px-2 py-1 md:py-2 relative flex-1 bg-[#ffffff33] rounded-xl w-full md:w-auto">
                    <Input
                      className="h-8 md:h-10 flex-1 bg-white rounded-2xl border border-solid border-purple px-4 py-2 font-medium text-[#101010] text-xs"
                      placeholder="User says..."
                      value={leftUserInput}
                      onChange={(e) => setLeftUserInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handleSendMessage(leftUserInput, "user")
                      }
                    />
                    <Button
                      onClick={() => startMic("user")}
                      className={`w-8 md:w-10 p-2 md:p-3 ${
                        activeMic === "user"
                          ? "bg-red-500 mic-active-glow"
                          : "bg-purple"
                      } rounded-[40px]`}
                    >
                      <Image
                        src={
                          activeMic === "user" ? "/mic-off.png" : "/mic-01.svg"
                        }
                        alt={activeMic === "user" ? "mic off" : "mic"}
                        width={24}
                        height={24}
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage(leftUserInput, "user")}
                      className="h-8 md:h-10 px-2 md:px-4 py-2 md:py-4 bg-purple rounded-xl font-medium text-sm md:text-base"
                    >
                      Send
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    <Select value={personality} onValueChange={setPersonality}>
                      <SelectTrigger className="max-w-32 md:max-w-40 h-8 md:h-10 bg-[#ffffff4c] rounded-xl border border-solid border-purple p-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptionsData && moodOptionsData.length > 0 ? (
                          moodOptionsData.map((option: any) => (
                            <SelectItem
                              key={option.id}
                              value={option.mood_name}
                            >
                              {option.mood_name.charAt(0).toUpperCase() +
                                option.mood_name.slice(1) || "N/A"}
                            </SelectItem>
                          ))
                        ) : (
                          // Fallback options in case API fails
                          <>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <Select value={replyAs} onValueChange={setReplyAs}>
                      <SelectTrigger className="max-w-48 md:min-w-28 h-8 md:h-10 bg-[#ffffff4c] rounded-xl border border-solid border-purple p-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai">Reply as AI</SelectItem>
                        <SelectItem value="user">Reply as User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 relative flex-1 bg-[#ffffff33] rounded-xl w-full md:w-auto mt-3 md:mt-0">
                    <Input
                      className="h-8 md:h-10 flex-1 bg-white rounded-2xl border border-solid border-purple px-4 py-2 font-medium text-[#101010] text-xs"
                      placeholder="AI says..."
                      value={rightUserInput}
                      onChange={(e) => setRightUserInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        handleSendMessage(rightUserInput, "ai")
                      }
                    />
                    <Button
                      onClick={() => startMic("ai")}
                      disabled={replyAs === "ai"}
                      className={`w-8 md:w-10 p-2 md:p-3 ${
                        activeMic === "ai"
                          ? "bg-red-500 mic-active-glow"
                          : "bg-purple"
                      } rounded-[40px]`}
                    >
                      <Image
                        src={
                          activeMic === "ai" ? "/mic-off.png" : "/mic-01.svg"
                        }
                        alt={activeMic === "ai" ? "mic off" : "mic"}
                        width={24}
                        height={24}
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
                    </Button>
                    <Button
                      onClick={() => handleSendMessage(rightUserInput, "ai")}
                      disabled={replyAs === "ai"}
                      className="h-8 md:h-10 px-2 md:px-4 py-2 md:py-4 bg-purple rounded-xl font-medium text-sm md:text-base"
                    >
                      Send
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={stopMic}
                  disabled={!activeMic}
                  className={`h-8 md:h-10 gap-2 px-6 py-2 ${
                    activeMic ? "bg-red-500" : "bg-purple opacity-60"
                  } rounded-xl font-medium text-sm md:text-base mt-3 md:mt-0 w-full md:w-auto`}
                >
                  <Image
                    src="/mic-off.png"
                    alt="mic off"
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  {/* {activeMic
                    ? `Stop ${activeMic === "user" ? "User" : "AI"} Mic`
                    : "Stop Mic"} */}
                  Stop Mic
                </Button>
              </CardContent>
            </Card>

            <Dialog
              open={showAnalysisModal}
              onOpenChange={setShowAnalysisModal}
            >
              <DialogContent className="flex flex-col items-start gap-3 md:gap-5 p-4 md:p-6 bg-[#ffffff33] rounded-[20px] border border-purple sm:max-w-[800px] max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 md:gap-6 font-['Inter',Helvetica] font-semibold text-white text-lg md:text-xl">
                    <img
                      className="relative w-8 h-8 md:w-10 md:h-10"
                      alt="AI Analysis Icon"
                      src="/frame.svg"
                    />
                    AI Analysis
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-start gap-3 md:gap-5 relative self-stretch w-full">
                  <Textarea
                    className="h-[100px] md:h-[150px] p-3 md:p-5 bg-white rounded-xl border border-solid border-purple font-medium text-[#707070] text-sm md:text-base w-full"
                    placeholder="Paste chat history or any text here..."
                    value={analyzeText}
                    onChange={(e) => setAnalyzeText(e.target.value)}
                  />
                </div>
                {analysisResult && (
                  <div className="mt-4 p-4 bg-white rounded-xl w-full">
                    <h3 className="font-semibold text-lg text-[#7630b5]">
                      Analysis Result:
                    </h3>
                    <p className="text-[#101010]">{analysisResult}</p>
                  </div>
                )}
                <Button
                  onClick={handleAnalyzeText}
                  className="w-28 md:w-40 h-8 md:h-10 px-4 md:px-6 py-2 md:py-2 kış5 bg-purple rounded-xl font-medium text-sm md:text-base"
                >
                  Analyze
                </Button>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showSaveChatDialog}
              onOpenChange={(open) => {
                setShowSaveChatDialog(open);
                if (!open) setChatTitle("");
              }}
            >
              <DialogContent className="flex flex-col items-start gap-4 p-6 bg-white rounded-xl border border-purple sm:max-w-[500px]">
                <DialogHeader className="w-full">
                  <DialogTitle className="font-['Inter',Helvetica] font-semibold text-[#7630b5] text-xl text-center">
                    Save Conversation
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-start gap-3 w-full">
                  <label className="font-medium text-[#101010]">
                    Conversation Title
                  </label>
                  <Input
                    className="h-12 p-4 bg-white rounded-xl border border-solid border-purple font-medium text-[#101010] w-full"
                    placeholder="Enter a title for this conversation"
                    value={chatTitle}
                    onChange={(e) => setChatTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-4 w-full mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveChatDialog(false)}
                    className="h-12 px-6 py-2.5 border border-solid border-purple text-[#7630b5] rounded-xl font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submitSaveChat}
                    className="h-12 px-6 py-2.5 bg-purple rounded-xl font-medium"
                    disabled={!chatTitle.trim()}
                  >
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <style jsx>{`
          .active {
            border: 2px solid #7630b5;
            box-shadow: 0 0 10px rgba(118, 48, 181, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
};

export default HomeScreen;
