"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BackgroundDecoration } from "./ui/background-decoration";
import api from "@/lib/axios";
import { Eye, EyeOff } from "lucide-react";

export function Register() {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    // Basic validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.password2
    ) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
        style: {
          background: "#ff5757",
          color: "white",
          border: "none",
        },
      });
      return;
    }

    if (formData.password !== formData.password2) {
      toast.error("Passwords don't match", {
        description: "Please make sure both passwords are the same.",
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
      const response = await api.post("/users", formData);

      if (response.data) {
        toast.success("Registration successful", {
          description: "Your account has been created. You can now log in.",
          style: {
            background: "#4caf50",
            color: "white",
            border: "none",
          },
        });

        // Redirect to login page
        router.push("/login");
      }
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Registration failed";

      toast.error("Registration failed", {
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
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200">
      <BackgroundDecoration />

      <div className="bg-[#FFFFFF66] backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#141b34] mb-6">
          ✨ Create Account
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>

        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="mb-4"
          disabled={isLoading}
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="mb-4"
          disabled={isLoading}
        />

        <div className="relative mb-4">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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

        <div className="relative mb-4">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <Button
          onClick={handleRegister}
          className="w-full bg-purple hover:bg-purple/90 mb-4"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
