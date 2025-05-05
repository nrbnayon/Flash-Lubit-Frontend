"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BackgroundDecoration } from "./ui/background-decoration";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Login successful", {
          description: "Welcome back!",
          style: {
            background: "#4caf50",
            color: "white",
            border: "none",
          },
        });
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.message || "Invalid credentials";
        toast.error("Login failed", {
          description: errorMessage,
          style: {
            background: "#ff5757",
            color: "white",
            border: "none",
          },
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      toast.error("An error occurred", {
        description: errorMessage,
        style: {
          background: "#ff5757",
          color: "white",
          border: "none",
        },
      });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200'>
      <BackgroundDecoration />

      <div className='bg-[#FFFFFF66] backdrop-blur-sm rounded-xl p-8 w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center text-[#141b34] mb-6'>
          🔐 Login
        </h2>
        <Input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mb-4'
        />
        <Input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-4'
        />
        <Button
          onClick={handleLogin}
          className='w-full bg-[#7630b5] hover:bg-[#7630b5]/90'
        >
          Login
        </Button>
      </div>
    </div>
  );
}
