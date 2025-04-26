// components\Home.tsx
"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Logo } from "@/components/ui/logo";
import { BackgroundDecoration } from "@/components/ui/background-decoration";
import { useRouter } from "next/navigation";
import BGImage from "@/assets/background1.png";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Message {
  sender: "left" | "right";
  text: string;
  time: string;
}

export function Home() {
  const { toast } = useToast();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    { sender: "left", text: "Hi", time: "" },
    { sender: "right", text: "Hi", time: "" },
    { sender: "left", text: "How are you?", time: "" },
    { sender: "right", text: "Fine. What about you?", time: "" },
    { sender: "left", text: "I am fine. What are you doing?", time: "" },
    { sender: "right", text: "Write now I talking you.", time: "" },
  ]);

  const [leftInput, setLeftInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);

  const handleUploadAvatar = () => {
    router.push("/upload-avatar");
  };

  const handleSendMessage = (sender: "left" | "right", text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      sender,
      text,
      time: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);

    if (sender === "left") {
      setLeftInput("");
    } else {
      setRightInput("");
    }

    toast({
      title: "Message sent",
      description: `Message sent from ${sender} user`,
      duration: 2000,
    });
  };

  const toggleMic = () => {
    setMicActive(!micActive);
    toast({
      title: micActive ? "Microphone disabled" : "Microphone enabled",
      duration: 2000,
    });
  };

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Background Image */}
      <Image
        src={BGImage}
        alt='Background'
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
        priority
      />

      {/* Logo */}
      <Logo className='absolute top-6 left-6' />

      {/* Main title */}
      <div className='text-center pt-10 pb-4'>
        <h1 className='text-4xl font-bold text-[#141b34]'>Internal Dialogue</h1>
      </div>

      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between gap-8 mb-6'>
          {/* Left user */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg p-2 shadow-md mb-3'>
              <div className='aspect-square rounded-lg overflow-hidden'>
                <Avatar className='w-full h-full'>
                  <AvatarImage
                    src='/placeholder.svg?height=300&width=300'
                    alt='Left user avatar'
                  />
                  <AvatarFallback>LU</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className='flex gap-2'>
              <Select defaultValue='user01'>
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder='User 01' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='user01'>User 01</SelectItem>
                  <SelectItem value='user02'>User 02</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue='voice01'>
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder='AI voice 01' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='voice01'>AI voice 01</SelectItem>
                  <SelectItem value='voice02'>AI voice 02</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Center content */}
          <div className='flex-1 flex flex-col items-center justify-between'>
            <div className='flex-1 w-full flex flex-col justify-center space-y-4'>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "left" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-full py-2 px-4 max-w-[80%] ${
                      message.sender === "left"
                        ? "bg-[#7630b5] text-white"
                        : "bg-white text-[#141b34]"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className='w-full mt-4 space-y-3'>
              <Button
                className='w-full bg-[#7630b5] hover:bg-[#7630b5]/90 text-white'
                onClick={handleUploadAvatar}
              >
                Upload New Avatar
              </Button>

              <div className='flex justify-center'>
                <Button
                  variant='outline'
                  size='icon'
                  className='rounded-full h-12 w-12 bg-[#7630b5] text-white border-none hover:bg-[#7630b5]/90'
                  onClick={toggleMic}
                >
                  {micActive ? (
                    <MicOff className='h-6 w-6' />
                  ) : (
                    <Mic className='h-6 w-6' />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right user */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg p-2 shadow-md mb-3'>
              <div className='aspect-square rounded-lg overflow-hidden'>
                <Avatar className='w-full h-full'>
                  <AvatarImage
                    src='/placeholder.svg?height=300&width=300'
                    alt='Right user avatar'
                  />
                  <AvatarFallback>RU</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className='flex gap-2'>
              <Select defaultValue='user01'>
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder='User 01' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='user01'>User 01</SelectItem>
                  <SelectItem value='user02'>User 02</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue='voice01'>
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder='AI voice 01' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='voice01'>AI voice 01</SelectItem>
                  <SelectItem value='voice02'>AI voice 02</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        <div className='bg-white/80 backdrop-blur-sm rounded-xl p-3 mb-6'>
          <div className='flex flex-wrap gap-3 items-center'>
            <Button
              className='bg-[#7630b5] hover:bg-[#7630b5]/90 text-white whitespace-nowrap'
              onClick={() => {
                setMessages([]);
                toast({
                  title: "New conversation started",
                  duration: 2000,
                });
              }}
            >
              Start New Conversation
            </Button>

            <div className='flex-1 min-w-[200px]'>
              <div className='flex gap-2 items-center'>
                <Textarea
                  placeholder='User says...'
                  className='min-h-[40px] resize-none py-2'
                  value={leftInput}
                  onChange={(e) => setLeftInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage("left", leftInput);
                    }
                  }}
                />
                <Button
                  size='icon'
                  variant='ghost'
                  className='rounded-full h-8 w-8 bg-[#7630b5] text-white hover:bg-[#7630b5]/90'
                >
                  <Mic className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <Button
              className='bg-[#7630b5] hover:bg-[#7630b5]/90 text-white'
              onClick={() => handleSendMessage("left", leftInput)}
            >
              Send
            </Button>

            <Select defaultValue='friendly'>
              <SelectTrigger className='w-[120px] bg-white'>
                <SelectValue placeholder='Friendly' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='friendly'>Friendly</SelectItem>
                <SelectItem value='formal'>Formal</SelectItem>
                <SelectItem value='casual'>Casual</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue='ai'>
              <SelectTrigger className='w-[120px] bg-white'>
                <SelectValue placeholder='Reply as AI' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ai'>Reply as AI</SelectItem>
                <SelectItem value='human'>Reply as Human</SelectItem>
              </SelectContent>
            </Select>

            <div className='flex-1 min-w-[200px]'>
              <div className='flex gap-2 items-center'>
                <Textarea
                  placeholder='User says...'
                  className='min-h-[40px] resize-none py-2'
                  value={rightInput}
                  onChange={(e) => setRightInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage("right", rightInput);
                    }
                  }}
                />
                <Button
                  size='icon'
                  variant='ghost'
                  className='rounded-full h-8 w-8 bg-[#7630b5] text-white hover:bg-[#7630b5]/90'
                >
                  <Mic className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <Button
              className='bg-[#7630b5] hover:bg-[#7630b5]/90 text-white'
              onClick={() => handleSendMessage("right", rightInput)}
            >
              Send
            </Button>

            <Button
              className='bg-[#7630b5] hover:bg-[#7630b5]/90 text-white flex gap-2 items-center'
              onClick={toggleMic}
            >
              {micActive ? (
                <MicOff className='h-4 w-4' />
              ) : (
                <Mic className='h-4 w-4' />
              )}
              Stop Mic
            </Button>
          </div>
        </div>

        {/* AI Analysis section */}
        {showAnalysis && (
          <>
            <div className='flex justify-center mb-4'>
              <Button
                className='bg-[#7630b5] hover:bg-[#7630b5]/90 text-white'
                onClick={() => setShowAnalysis(false)}
              >
                Hide AI Analysis
              </Button>
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='bg-orange-500 text-white p-1 rounded'>
                  <span className='text-xl'>📊</span>
                </div>
                <h2 className='text-xl font-bold text-[#141b34]'>AI Analyze</h2>
              </div>

              <Textarea
                placeholder='Paste chat history or any text here...'
                className='min-h-[150px] mb-4'
              />

              <Button
                className='bg-[#7630b5] hover:bg-[#7630b5]/90 text-white'
                onClick={() => {
                  toast({
                    title: "Analysis started",
                    description: "Your text is being analyzed",
                    duration: 2000,
                  });
                }}
              >
                Analyze
              </Button>
            </div>
          </>
        )}

        {!showAnalysis && (
          <div className='flex justify-center mb-4'>
            <Button
              className='bg-[#7630b5] hover:bg-[#7630b5]/90 text-white'
              onClick={() => setShowAnalysis(true)}
            >
              Show AI Analysis
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
