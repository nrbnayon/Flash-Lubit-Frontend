"use client";
import { ArrowDownIcon, ChevronRightIcon, MicIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
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

export const HomeScreen = () => {
  // State for user inputs
  const [leftUserInput, setLeftUserInput] = useState("");
  const [rightUserInput, setRightUserInput] = useState("");
  const [analyzeText, setAnalyzeText] = useState("");
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Chat messages data
  const [leftChatMessages, setLeftChatMessages] = useState([
    { text: "Hi", isShort: true },
    { text: "How are you?", isShort: false },
    { text: "I am fine. What are you doing?", isShort: false },
  ]);

  const [rightChatMessages, setRightChatMessages] = useState([
    { text: "Hi", isShort: true },
    { text: "Fine. What about you?", isShort: false },
    { text: "Right now I am talking to you.", isShort: false },
  ]);

  // Handle sending messages from either side
  const handleSendLeftMessage = () => {
    if (leftUserInput.trim()) {
      setLeftChatMessages([
        ...leftChatMessages,
        {
          text: leftUserInput,
          isShort: leftUserInput.length < 10,
        },
      ]);
      setLeftUserInput("");
    }
  };

  const handleSendRightMessage = () => {
    if (rightUserInput.trim()) {
      setRightChatMessages([
        ...rightChatMessages,
        {
          text: rightUserInput,
          isShort: rightUserInput.length < 10,
        },
      ]);
      setRightUserInput("");
    }
  };

  // Toggle analysis visibility
  const toggleAnalysis = () => {
    setShowAnalysisModal(!showAnalysisModal);
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1920px]">
        <div className="relative min-h-screen bg-[url(/background1.png)] bg-cover bg-[50%_0%] px-4 md:px-6 lg:px-10">
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            {/* Logo */}
            <Image
              src="/logo-1.png"
              alt="Logo"
              width={32}
              height={20}
              className="w-[60px] md:w-[80px] lg:w-[99px] h-10 md:h-16 lg:h-20 top-4 object-cover"
            />

            {/* Title */}
            <h1 className="font-['Inter',Helvetica] font-semibold text-[#101010] text-2xl md:text-4xl lg:text-[56px] text-center tracking-[0] leading-[normal]">
              Internal Dialogue
            </h1>

            {/* Ai Analysis Modal open button */}
            <div>
              <Button
                className="w-[160px] md:w-[220px] h-10 md:h-14 gap-2.5 px-4 md:px-6 py-2 md:py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base"
                onClick={toggleAnalysis}
              >
                {showAnalysisModal ? "Hide AI Analysis" : "Show AI Analysis"}
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="pt-10 pb-8 px-2 md:px-6 lg:px-12 max-w-full mx-auto">
            <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 lg:gap-12">
              {/* Left Character and Chat */}
              <div className="flex flex-col md:flex-row lg:flex-row items-center md:items-start lg:items-start gap-4 md:gap-8 lg:gap-12 w-full lg:w-1/2">
                {/* Left Character Avatar */}
                <div className="flex flex-col w-full md:w-[300px] lg:w-[401px] items-center gap-[15px]">
                  <img
                    className="w-full h-auto md:h-[360px] lg:h-[482px] object-cover rounded-lg"
                    alt="Left Character"
                    src="/rectangle-2.png"
                  />

                  <div className="flex w-full md:w-[280px] lg:w-[312px] items-center gap-3 md:gap-5 lg:gap-7">
                    {/* User Selection */}
                    <Select>
                      <SelectTrigger className="h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue
                          placeholder="User 01"
                          className="font-medium text-[#101010] text-xs"
                        />
                        <ArrowDownIcon className="w-4 h-4 md:w-6 md:h-6" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user01">User 01</SelectItem>
                        <SelectItem value="user02">User 02</SelectItem>
                        <SelectItem value="user03">User 03</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Voice Selection */}
                    <Select>
                      <SelectTrigger className="h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue
                          placeholder="AI voice 01"
                          className="font-medium text-[#101010] text-xs"
                        />
                        <ArrowDownIcon className="w-4 h-4 md:w-6 md:h-6" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="voice01">AI voice 01</SelectItem>
                        <SelectItem value="voice02">AI voice 02</SelectItem>
                        <SelectItem value="voice03">AI voice 03</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Left Character Chat Bubbles */}
                <div className="flex flex-col w-full md:w-[250px] lg:w-[299px] items-start gap-8 md:gap-12 lg:gap-20 px-0 py-4 md:py-6 lg:py-10">
                  {leftChatMessages.map((message, index) => (
                    <div
                      key={`left-message-${index}`}
                      className={`flex flex-col ${
                        message.isShort ? "w-[60px]" : "self-stretch w-full"
                      } items-center justify-center gap-2.5 p-2.5 relative bg-[#7630b599] rounded-[20px_20px_20px_4px]`}
                    >
                      <div className="relative self-stretch mt-[-1.00px] font-['Inter',Helvetica] font-medium text-white text-sm md:text-base tracking-[0] leading-[normal]">
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Character and Chat */}
              <div className="flex flex-col md:flex-row-reverse lg:flex-row-reverse items-center md:items-start lg:items-start gap-4 md:gap-8 lg:gap-12 w-full lg:w-1/2">
                {/* Right Character Avatar */}
                <div className="flex flex-col w-full md:w-[300px] lg:w-[402px] items-center gap-[15px]">
                  <img
                    className="w-full h-auto md:h-[360px] lg:h-[482px] object-cover rounded-lg"
                    alt="Right Character"
                    src="/rectangle-2-1.png"
                  />

                  <div className="flex w-full md:w-[280px] lg:w-[312px] items-center gap-3 md:gap-5 lg:gap-7">
                    {/* User Selection */}
                    <Select>
                      <SelectTrigger className="h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue
                          placeholder="User 01"
                          className="font-medium text-[#101010] text-xs"
                        />
                        <ArrowDownIcon className="w-4 h-4 md:w-6 md:h-6" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user01">User 01</SelectItem>
                        <SelectItem value="user02">User 02</SelectItem>
                        <SelectItem value="user03">User 03</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Voice Selection */}
                    <Select>
                      <SelectTrigger className="h-10 md:h-12 flex-1 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 py-2 md:px-4 md:py-2.5">
                        <SelectValue
                          placeholder="AI voice 01"
                          className="font-medium text-[#101010] text-xs"
                        />
                        <ArrowDownIcon className="w-4 h-4 md:w-6 md:h-6" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="voice01">AI voice 01</SelectItem>
                        <SelectItem value="voice02">AI voice 02</SelectItem>
                        <SelectItem value="voice03">AI voice 03</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Character Chat Bubbles */}
                <div className="flex flex-col w-full md:w-[250px] lg:w-[350px] items-end gap-8 md:gap-12 lg:gap-20 pt-4 md:pt-10 lg:pt-20 pb-0 px-0">
                  {rightChatMessages.map((message, index) => (
                    <div
                      key={`right-message-${index}`}
                      className={`flex flex-col ${
                        message.isShort ? "w-[60px]" : "self-stretch w-full"
                      } items-center justify-center gap-2.5 p-2.5 relative bg-white rounded-[20px_20px_4px_20px] ml-auto`}
                    >
                      <div className="relative self-stretch mt-[-1.00px] font-['Inter',Helvetica] font-medium text-[#7630b5] text-sm md:text-base text-center tracking-[0] leading-[normal]">
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Upload Avatar and Next buttons */}
            <div className="flex flex-col w-full md:w-[300px] lg:w-[424px] items-center gap-4 mt-8 md:-mt-12 md:gap-6 mx-auto mb-4">
              <Button className="h-10 md:h-14 w-full bg-[#7630b5] rounded-xl font-medium text-sm md:text-base">
                Upload New Avatar
              </Button>

              <Button className="w-[50px] md:w-[60px] p-2 md:p-3 bg-[#7630b5] rounded-[50px]">
                <Image
                  src="/mic-off.svg"
                  alt="mic off"
                  width={32}
                  height={20}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              </Button>
            </div>

            {/* Bottom Controls and AI Analysis */}
            <div className="flex flex-col w-full items-center gap-4 md:gap-6 lg:gap-8">
              {/* Chat Controls */}
              <Card className="flex flex-col md:flex-row items-center gap-3 p-3 md:p-4 lg:p-6 relative self-stretch w-full bg-[#ffffff4c] rounded-[20px]">
                <CardContent className="flex flex-col md:flex-row items-center gap-3 p-0 w-full">
                  <Button className="h-10 md:h-14 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base w-full md:w-auto">
                    Start New Conversation
                  </Button>

                  {/* Controls Flex Container */}
                  <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                    {/* Left User Input */}
                    <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 relative flex-1 bg-[#ffffff33] rounded-xl w-full md:w-auto">
                      <Input
                        className="h-10 md:h-12 flex-1 bg-white rounded-[50px] border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5 font-medium text-[#101010] text-xs"
                        placeholder="User says..."
                        value={leftUserInput}
                        onChange={(e) => setLeftUserInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendLeftMessage()
                        }
                      />

                      <Button className="w-10 md:w-12 p-2 md:p-3 bg-[#7630b5] rounded-[50px]">
                        <Image
                          src="/mic-01.svg"
                          alt="mic off"
                          width={32}
                          height={20}
                          className="w-5 h-5 md:w-6 md:h-6"
                        />
                      </Button>

                      <Button
                        className="h-10 md:h-12 px-4 md:px-6 py-2 md:py-[7px] bg-[#7630b5] rounded-xl font-medium text-sm md:text-base"
                        onClick={handleSendLeftMessage}
                      >
                        Send
                      </Button>
                    </div>

                    {/* Center Controls */}
                    <div className="flex items-center gap-2 mt-3 md:mt-0">
                      {/* Style Selection */}
                      <Select>
                        <SelectTrigger className="w-[110px] md:w-[142px] h-10 md:h-12 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5">
                          <SelectValue
                            placeholder="Friendly"
                            className="font-medium text-[#101010] text-xs"
                          />
                          <ArrowDownIcon className="w-4 h-4 md:w-6 md:h-6" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* AI Reply Selection */}
                      <Select>
                        <SelectTrigger className="w-[110px] md:w-[142px] h-10 md:h-12 bg-[#ffffff4c] rounded-xl border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5">
                          <SelectValue
                            placeholder="Reply as AI"
                            className="font-medium text-[#101010] text-xs"
                          />
                          <ArrowDownIcon className="w-4 h-4 md:w-6 md:h-6" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ai">Reply as AI</SelectItem>
                          <SelectItem value="human">Reply as Human</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Right User Input */}
                    <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 relative flex-1 bg-[#ffffff33] rounded-xl w-full md:w-auto mt-3 md:mt-0">
                      <Input
                        className="h-10 md:h-12 flex-1 bg-white rounded-[50px] border border-solid border-[#7630b5] px-3 md:px-4 py-2 md:py-2.5 font-medium text-[#101010] text-xs"
                        placeholder="User says..."
                        value={rightUserInput}
                        onChange={(e) => setRightUserInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendRightMessage()
                        }
                      />

                      <Button className="w-10 md:w-12 p-2 md:p-3 bg-[#7630b5] rounded-[50px]">
                        <Image
                          src="/mic-01.svg"
                          alt="mic off"
                          width={32}
                          height={20}
                          className="w-5 h-5 md:w-6 md:h-6"
                        />
                      </Button>

                      <Button
                        className="h-10 md:h-12 px-4 md:px-6 py-2 md:py-[7px] bg-[#7630b5] rounded-xl font-medium text-sm md:text-base"
                        onClick={handleSendRightMessage}
                      >
                        Send
                      </Button>
                    </div>
                  </div>

                  {/* Stop Mic Button */}
                  <Button className="h-10 md:h-14 gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base mt-3 md:mt-0 w-full md:w-auto">
                    <Image
                      src="/mic-off.svg"
                      alt="mic off"
                      width={32}
                      height={20}
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                    Stop Mic
                  </Button>
                </CardContent>
              </Card>

              {/* AI Analysis Modal */}
              {showAnalysisModal && (
                <Card className="flex flex-col items-start gap-3 md:gap-5 p-4 md:p-6 relative self-stretch w-full bg-[#ffffff33] rounded-[20px]">
                  <CardContent className="flex flex-col items-start gap-3 md:gap-5 p-0 w-full">
                    <div className="flex flex-col items-start gap-3 md:gap-5 relative self-stretch w-full">
                      <div className="inline-flex items-center gap-3 md:gap-6 relative">
                        <img
                          className="relative w-8 h-8 md:w-10 md:h-10"
                          alt="AI Analysis Icon"
                          src="/frame.svg"
                        />

                        <h2 className="font-['Inter',Helvetica] font-semibold text-[#101010] text-lg md:text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
                          AI Analysis
                        </h2>
                      </div>

                      <Textarea
                        className="h-[150px] md:h-[244px] p-3 md:p-5 bg-white rounded-xl border border-solid border-[#7630b5] font-medium text-[#707070] text-sm md:text-base"
                        placeholder="Paste chat history or any text here..."
                        value={analyzeText}
                        onChange={(e) => setAnalyzeText(e.target.value)}
                      />
                    </div>

                    <Button className="w-28 md:w-40 h-10 md:h-14 px-4 md:px-6 py-2 md:py-2.5 bg-[#7630b5] rounded-xl font-medium text-sm md:text-base">
                      Analyze
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
