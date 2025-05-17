"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BackgroundDecoration } from "./ui/background-decoration";
import api, { saveTokens } from "@/lib/axios";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Incorrect credentials", {
        description: "Email and password are required.",
        style: {
          background: "#ff5757",
          color: "white",
          border: "none",
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      if (response.data) {
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
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Invalid credentials";

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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          className="mb-4"
          disabled={isLoading}
        />
        <div className="relative mb-4">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
        <Button
          onClick={handleLogin}
          className="w-full bg-purple hover:bg-purple/90 mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
