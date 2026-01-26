"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = () => {
        // Clear cookies/tokens logic here (if handled by frontend)
        // For now, just redirect to login which might handle cleanup or overwrite
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.replace("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-50 px-6 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-8">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-1.5 rounded-lg">
                        <svg
                            className="w-5 h-5 text-white"
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
                    <span className="font-bold text-lg tracking-tight">BuildPath</span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
                    <Link href="/dashboard" className="hover:text-black transition">
                        Generator
                    </Link>
                    <button className="hover:text-black transition cursor-not-allowed opacity-50">
                        Roadmaps
                    </button>
                </div>
            </div>

            {/* Right: User Profile */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                                <span>🌱</span>
                                <span>{user?.skillLevel || "Beginner"}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/profile")}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            View Profile
                        </button>

                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Edit Skill Level
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
