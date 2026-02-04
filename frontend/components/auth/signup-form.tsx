"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail, validatePassword } from "@/lib/utils";

export function SignUpForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Validate
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join(". ");
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signUp({ email, password });
    } catch (error: any) {
      console.error("Signup error:", error);
      
      // Handle Axios errors with response data
      if (error.response?.data) {
        const errorData = error.response.data;
        const newErrors: typeof errors = {};
        
        // Handle field-specific errors
        if (errorData.email) {
          newErrors.email = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
        }
        if (errorData.password) {
          newErrors.password = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
        }
        
        // Handle general errors
        if (!newErrors.email && !newErrors.password) {
          newErrors.general = error.response?.data?.detail || "Failed to sign up. Please try again.";
        }
        
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setErrors({ general: error.message || "Failed to sign up. Please try again." });
      } else {
        setErrors({ general: "Failed to sign up. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf1e3] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Illustration */}
        <div className="flex justify-center mb-10">
          <img 
            src="https://www.figma.com/api/mcp/asset/23675775-f5ea-485f-96f6-823b648e26cd"
            alt="Welcome illustration"
            className="w-32 h-24 object-contain"
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold text-[#88642a]">
            Yay, New Friend!
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
              autoComplete="email"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {errors.general && (
            <div className="text-sm text-red-500 text-center mt-5">{errors.general}</div>
          )}

          <div style={{ marginTop: '48px' }}>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/signin"
            className="text-xs text-[#957139] underline hover:no-underline"
          >
            We&apos;re already friends!
          </Link>
        </div>
      </div>
    </div>
  );
}
