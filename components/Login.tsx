"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BackgroundDecoration } from "./ui/background-decoration";
import api, { saveTokens } from "@/lib/axios";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/login", {
        username,
        password,
      });

      if (response.data) {
        console.log("Response.data:", response.data);
        // Save tokens to cookies
        saveTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        toast.success("Login successful", {
          description: "Welcome back!",
          style: {
            background: "#4caf50",
            color: "white",
            border: "none",
          },
        });

        // Redirect to home page
        router.push("/");
        router.refresh(); // Refresh to update authentication state
      }
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message || (error as any)?.message || "Invalid credentials";

      toast.error("Login failed", {
        description: errorMessage,
        style: {
          background: "#ff5757",
          color: "white",
          border: "none",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200">
      <BackgroundDecoration />

      <div className="bg-[#FFFFFF66] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#141b34] mb-6">
          🔐 Login
        </h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          className="mb-4"
          disabled={isLoading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="mb-4"
          disabled={isLoading}
        />
        <Button
          onClick={handleLogin}
          className="w-full bg-[#7630b5] hover:bg-[#7630b5]/90"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
