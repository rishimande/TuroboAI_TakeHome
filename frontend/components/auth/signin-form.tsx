"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/utils";

export function SignInForm() {
  const { signIn } = useAuth();
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
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ email, password });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message || "Invalid email or password" });
      } else {
        setErrors({ general: "Invalid email or password" });
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
            src="https://www.figma.com/api/mcp/asset/a40abb6d-58d4-47ed-8cce-2adc549c2d4a"
            alt="Welcome cactus illustration"
            className="w-24 h-28 object-contain"
          />
        </div>

        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-heading)] text-5xl font-bold text-[#88642a]">
            Yay, You&apos;re Back!
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
              autoComplete="current-password"
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
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/signup"
            className="text-xs text-[#957139] underline hover:no-underline"
          >
            Oops! I&apos;ve never been here before
          </Link>
        </div>
      </div>
    </div>
  );
}
