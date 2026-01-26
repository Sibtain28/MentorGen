"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.user;

      // Check if onboarding is completed
      if (!user.onboarding_completed) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6">Welcome back</h1>

        <input
          className="w-full mb-4 p-3 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 border rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white py-3 rounded"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-teal-600 font-semibold hover:text-teal-700">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
