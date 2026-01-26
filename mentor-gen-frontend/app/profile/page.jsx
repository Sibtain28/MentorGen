"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/profile");
                setUser(res.data.user);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                router.replace("/login");
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar user={user} />

            <main className="min-h-screen pt-24 pb-12 px-6 bg-[#FAF9F6]">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full font-medium text-sm ${user.skillLevel === 'Beginner' ? 'bg-green-100 text-green-700' :
                                    user.skillLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-purple-100 text-purple-700'
                                }`}>
                                {user.skillLevel === 'Beginner' ? '🌱' : user.skillLevel === 'Intermediate' ? '🚀' : '⭐'} {user.skillLevel}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Primary Domain</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">
                                        {user.preferred_domain?.includes('Web') ? '🌐' :
                                            user.preferred_domain?.includes('Mobile') ? '📱' :
                                                user.preferred_domain?.includes('Backend') ? '⚙️' :
                                                    user.preferred_domain?.includes('Machine') ? '🤖' : '🚀'}
                                    </span>
                                    <span className="text-lg font-semibold text-gray-900">{user.preferred_domain}</span>
                                </div>
                            </div>

                            {user.preferred_tech_stack && user.preferred_tech_stack.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">Tech Stack</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.preferred_tech_stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Goal</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">
                                        {user.preferred_goal?.includes('Learning') ? '🌱' :
                                            user.preferred_goal?.includes('Resume') ? '📚' :
                                                user.preferred_goal?.includes('College') ? '🎓' : '💼'}
                                    </span>
                                    <span className="text-lg font-semibold text-gray-900">{user.preferred_goal}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                            <button
                                onClick={() => router.push("/onboarding")}
                                className="px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition"
                            >
                                Edit Preferences
                            </button>
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                        <p className="text-sm text-gray-600">
                            Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
