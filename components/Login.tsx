"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BackgroundDecoration } from "./ui/background-decoration";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/");
      } else {
        const errorData = await res.json();
        toast({
          title: "Login failed",
          description: errorData.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
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
