import { ArrowDownIcon, ChevronRightIcon, MicIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const HomeExtra = () => {
  // State for chat messages
  const [leftChatMessages, setLeftChatMessages] = useState([
    { text: "Hi", isShort: true },
    { text: "How are your?", isShort: false },
    { text: "I am fine. What are you doing?", isShort: false },
  ]);

  const [rightChatMessages, setRightChatMessages] = useState([
    { text: "Hi", isShort: true },
    { text: "Fine. What about you?", isShort: false },
    { text: "Write now I talking you.", isShort: false },
  ]);

  return (
    <div className="bg-white flex flex-col items-center w-full min-h-screen">
      <div className="w-full max-w-screen-2xl flex flex-col">
        <div className="relative w-full min-h-screen bg-[url(/background1.png)] bg-cover bg-center px-4 md:px-8 lg:px-16 py-8">
          {/* Header Section */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-8 md:mb-16">
            {/* Logo */}
            <img
              className="w-20 h-16 md:w-24 md:h-20 object-cover mb-4 md:mb-0"
              alt="Logo"
              src="/logo-1.png"
            />

            {/* Title */}
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#101010] text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center flex-1">
              Internal Dialogue
            </h1>
            
            {/* Empty div for spacing */}
            <div className="w-20 md:w-24 invisible"></div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8 md:mb-16">
            {/* Left Character and Chat */}
            <div className="flex flex-col md:flex-row gap-6 w-full lg:w-1/2">
              {/* Left Character Avatar */}
              <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
                <div className="w-full aspect-[5/6] relative">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    alt="Left Character"
                    src="/rectangle-2.png"
                  />
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-4">
                  {/* User Selection */}
                  <Select>
                    <SelectTrigger className="h-12 flex-1 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="User 01"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>

                  {/* Voice Selection */}
                  <Select>
                    <SelectTrigger className="h-12 flex-1 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="AI voice 01"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>

              {/* Left Character Chat Bubbles */}
              <div className="flex flex-col w-full md:w-1/2 h-[300px] md:h-full overflow-y-auto p-4 bg-white bg-opacity-20 rounded-lg">
                <div className="flex flex-col gap-6">
                  {leftChatMessages.map((message, index) => (
                    <div
                      key={`left-message-${index}`}
                      className={`flex flex-col ${message.isShort ? "w-20" : "w-full max-w-xs"} items-start gap-2.5 p-2.5 bg-[#7630b599] rounded-[20px_20px_20px_4px]`}
                    >
                      <div className="font-['Inter',Helvetica] font-medium text-white text-sm md:text-base">
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Controls for Mobile */}
            <div className="flex flex-col items-center gap-4 lg:hidden">
              <Button className="h-12 w-full sm:w-64 max-w-full bg-[#7630b5] rounded-xl font-medium text-base">
                Upload New Avatar
              </Button>

              <Button className="w-12 h-12 p-3 bg-[#7630b5] rounded-full">
                <ChevronRightIcon className="w-6 h-6" />
              </Button>
            </div>

            {/* Right Character and Chat */}
            <div className="flex flex-col md:flex-row-reverse gap-6 w-full lg:w-1/2">
              {/* Right Character Avatar */}
              <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
                <div className="w-full aspect-[5/6] relative">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    alt="Right Character"
                    src="/rectangle-2-1.png"
                  />
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-4">
                  {/* User Selection */}
                  <Select>
                    <SelectTrigger className="h-12 flex-1 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="User 01"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>

                  {/* Voice Selection */}
                  <Select>
                    <SelectTrigger className="h-12 flex-1 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="AI voice 01"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>

              {/* Right Character Chat Bubbles */}
              <div className="flex flex-col w-full md:w-1/2 h-[300px] md:h-full overflow-y-auto p-4 bg-white bg-opacity-20 rounded-lg">
                <div className="flex flex-col items-end gap-6">
                  {rightChatMessages.map((message, index) => (
                    <div
                      key={`right-message-${index}`}
                      className={`flex flex-col ${message.isShort ? "w-20" : "w-full max-w-xs"} items-end gap-2.5 p-2.5 bg-white rounded-[20px_20px_4px_20px]`}
                    >
                      <div className="font-['Inter',Helvetica] font-medium text-[#7630b5] text-sm md:text-base text-right">
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Controls for Desktop */}
          <div className="hidden lg:flex flex-col items-center gap-6 mb-16">
            <Button className="h-14 w-64 bg-[#7630b5] rounded-xl font-medium text-base">
              Upload New Avatar
            </Button>

            <Button className="w-14 h-14 p-3 bg-[#7630b5] rounded-full">
              <ChevronRightIcon className="w-6 h-6" />
            </Button>
          </div>

          {/* Bottom Controls and AI Analysis */}
          <div className="flex flex-col w-full gap-8 mb-8">
            {/* Chat Controls */}
            <Card className="bg-white bg-opacity-30 rounded-xl p-4">
              <CardContent className="flex flex-col md:flex-row gap-4 p-0">
                <Button className="h-12 md:h-14 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base">
                  Start New Conversation
                </Button>

                {/* Left User Input */}
                <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-white bg-opacity-20 rounded-xl">
                  <Input
                    className="h-12 flex-1 bg-white rounded-full border border-solid border-[#7630b5] px-4 py-2.5 font-medium text-[#101010] text-xs"
                    placeholder="User says..."
                  />

                  <div className="flex gap-2">
                    <Button className="w-12 h-12 p-3 bg-[#7630b5] rounded-full">
                      <MicIcon className="w-5 h-5" />
                    </Button>

                    <Button className="h-12 px-6 py-2 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base">
                      Send
                    </Button>
                  </div>
                </div>

                {/* Style and AI Selection - Hidden on small screens */}
                <div className="hidden md:flex gap-4">
                  {/* Style Selection */}
                  <Select>
                    <SelectTrigger className="w-32 h-12 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="Friendly"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>

                  {/* AI Reply Selection */}
                  <Select>
                    <SelectTrigger className="w-32 h-12 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="Reply as AI"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>
                </div>

                {/* Right User Input */}
                <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 sm:p-3 bg-white bg-opacity-20 rounded-xl">
                  <Input
                    className="h-12 flex-1 bg-white rounded-full border border-solid border-[#7630b5] px-4 py-2.5 font-medium text-[#101010] text-xs"
                    placeholder="User says..."
                  />

                  <div className="flex gap-2">
                    <Button className="w-12 h-12 p-3 bg-[#7630b5] rounded-full">
                      <MicIcon className="w-5 h-5" />
                    </Button>

                    <Button className="h-12 px-6 py-2 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base">
                      Send
                    </Button>
                  </div>
                </div>

                {/* Style and AI Selection - For small screens */}
                <div className="flex md:hidden gap-4 justify-center">
                  {/* Style Selection */}
                  <Select>
                    <SelectTrigger className="w-32 h-12 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="Friendly"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>

                  {/* AI Reply Selection */}
                  <Select>
                    <SelectTrigger className="w-32 h-12 bg-white bg-opacity-30 rounded-xl border border-solid border-[#7630b5] px-4 py-2.5">
                      <SelectValue
                        placeholder="Reply as AI"
                        className="font-medium text-[#101010] text-xs"
                      />
                      <ArrowDownIcon className="w-5 h-5" />
                    </SelectTrigger>
                  </Select>
                </div>

                {/* Stop Button */}
                <Button className="h-12 md:h-14 gap-2 px-6 py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base">
                  <ChevronRightIcon className="w-5 h-5" />
                  Stop Mic
                </Button>
              </CardContent>
            </Card>

            {/* Hide AI Analysis Button */}
            <div className="flex justify-center">
              <Button className="w-48 h-12 md:h-14 gap-2.5 px-6 py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base">
                Hide AI Analysis
              </Button>
            </div>

            {/* AI Analysis Section */}
            <Card className="bg-white bg-opacity-20 rounded-xl p-4 md:p-6">
              <CardContent className="flex flex-col gap-5 p-0">
                <div className="flex flex-col gap-5 w-full">
                  <div className="flex items-center gap-4">
                    <img
                      className="w-8 h-8 md:w-10 md:h-10"
                      alt="AI Icon"
                      src="/frame.svg"
                    />

                    <h2 className="font-['Inter',Helvetica] font-semibold text-[#101010] text-lg md:text-xl">
                      AI Analysis
                    </h2>
                  </div>

                  <Textarea
                    className="min-h-[150px] md:min-h-[244px] p-4 md:p-5 bg-white rounded-xl border border-solid border-[#7630b5] font-medium text-[#707070] text-sm md:text-base"
                    placeholder="Paste chat history or any text here..."
                  />
                </div>

                <Button className="w-32 md:w-40 h-12 md:h-14 px-6 py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base self-start">
                  Analyze
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};