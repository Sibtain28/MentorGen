"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", form);
            router.push("/onboarding");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-2 rounded-xl">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                />
                            </svg>
                        </div>
                        <span className="font-bold text-2xl tracking-tight">BuildPath</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Start your coding journey today</p>
                </div>

                {/* Form */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-teal-600 font-semibold hover:text-teal-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-8">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
