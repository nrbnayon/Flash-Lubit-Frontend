// app\page.tsx
import { HomeScreen } from "@/components/HomeScreen";

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
export default function HomePage() {
  return <HomeScreen />;
}
