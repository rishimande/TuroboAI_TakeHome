"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { authApi } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpFormData) {
    setIsLoading(true);
    setServerError(null);

    try {
      await authApi.signup(data);
      // Redirect to notes workspace on success
      router.push("/workspace");
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        const errorData = error.response.data;
        
        // Handle field-specific errors
        if (errorData.email) {
          setError("email", {
            type: "server",
            message: Array.isArray(errorData.email)
              ? errorData.email[0]
              : errorData.email,
          });
        }
        if (errorData.password) {
          setError("password", {
            type: "server",
            message: Array.isArray(errorData.password)
              ? errorData.password[0]
              : errorData.password,
          });
        }
        
        // Handle general errors
        if (errorData.detail || errorData.non_field_errors) {
          setServerError(errorData.detail || errorData.non_field_errors[0]);
        }
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Yay, New Friend!
            </h1>
            <p className="text-gray-600">
              Create your account to start taking notes
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a secure password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Sign Up
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              We&apos;re already friends?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Password Requirements */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Password requirements:
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
