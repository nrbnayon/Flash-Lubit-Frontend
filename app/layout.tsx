import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

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
    images: "https://i.postimg.cc/wB2VKYqx/logo-1.png",
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
