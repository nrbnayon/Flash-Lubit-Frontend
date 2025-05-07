import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Internal Dialogue: Your AI-Powered Internal Dialogue and Avatar Management for Efficient Communication",
  description:
    "Internal Dialogue is your AI-powered assistant that streamlines communication, organizes your thoughts, reduces stress, and boosts productivity!",
  keywords:
    "AI Avatar assistant, Internal dialogue, mental health management, productivity, communication, digital assistant, stress management, AI chat, personal assistant",
  robots: "index, follow",
  authors: [{ name: "Internal Dialogue Team" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ||
      "https://flash-lubit-frontend.vercel.app/" ||
      "https://example.com"
  ),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Internal Dialogue: Your AI-Powered Avatar Assistant",
    description:
      "Streamline your communication with Internal Dialogue, the AI assistant that organizes your thoughts and enhances productivity.",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Internal Dialogue",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://i.postimg.cc/d1mw0tv9/logo-1.png",
        width: 1000,
        height: 600,
        alt: "Internal Dialogue Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Internal Dialogue: AI-Powered Communication Assistant",
    description:
      "Enhance productivity with our AI avatar assistant for streamlined communication",
    images: ["https://i.postimg.cc/d1mw0tv9/logo-1.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "verification_token", // Replace with your actual Google verification token
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
