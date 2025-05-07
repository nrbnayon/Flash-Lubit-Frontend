"use client";

import errorImage from "@/public/error.png";
import Image from "next/image";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";
import "./globals.css";
export const metadata = {
  title:
    "Internal dialogue: Your AI-Powered internal dialogue and avatar management for Efficient Communication",
  description:
    "Internal dialogue is your AI-powered ai assistant that streamlines communication, organizes your stress, and boosts productivity!",
  keywords:
    "AI Avatar assistant, Internal dialogue, mental health management, productivity, communication",
  robots: "index, follow",
  openGraph: {
    title: "Internal dialogue: Your AI-Powered Ai with Avatar Assistant",
    description:
      "Streamline your communication with Internal dialogue, the AI assistant that organizes your communication and enhances productivity.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    width: 1000,
    height: 600,
    type: "website",
    images: "https://i.postimg.cc/d1mw0tv9/logo-1.png",
  },
};
export default function GlobalError({ error, reset }) {
  const handleReset = () => {
    reset();
  };
  return (
    <html>
      <body>
        <div className="flex flex-col items-center w-4/5 mx-auto container my-8 py-9">
          <div className="w-1/4">
            <Image src={errorImage} alt="error" />
          </div>
          <div className="py-4">
            <h1 className="text-center text-2xl font-semibold text-red-500">
              {error.message}
            </h1>
            <div className="flex gap-3 justify-center my-4">
              <Link
                href="/"
                className="bg-teal-500 px-3 py-2 rounded text-white flex gap-2 items-center cursor-pointer"
              >
                <IoMdArrowBack />
                To Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}