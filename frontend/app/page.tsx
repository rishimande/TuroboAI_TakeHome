import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Notes App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A simple, beautiful way to organize your thoughts
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button variant="primary" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Slice 1: Authentication Complete ✅
          </h2>
          <p className="text-sm text-gray-600">
            Backend and frontend authentication is fully implemented.
            Try signing up or logging in to test the integration!
          </p>
        </div>
      </div>
    </div>
  );
}
