"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";

function StatisticCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchProjects = async () => {
    try {
      const projectRes = await api.get("/projects");
      setProjects(projectRes.data.projects);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await api.post("/projects/generate");
      await fetchProjects();
    } catch (err) {
      console.error("Failed to generate projects", err);
      alert("Failed to generate projects. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        const fetchedUser = userRes.data.user;

        // Check if onboarding is completed
        if (!fetchedUser.onboarding_completed) {
          router.replace("/onboarding");
          return;
        }

        setUser(fetchedUser);

        // Fetch projects
        await fetchProjects();

        setLoading(false);
      } catch {
        router.replace("/login");
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />

      <main className="min-h-screen pt-24 pb-12 px-6 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          {/* Top personalization + empty hero */}
          {projects.length === 0 ? (
            <div className="text-center mb-16 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Your coding mentor, always available
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''} — let's build something great
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Generate personalized project ideas, get step-by-step guides, and build your portfolio.
              </p>

              <div className="flex items-center justify-center gap-3">
                {isGenerating ? (
                  <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow border">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600" />
                    <span className="text-teal-700 font-medium">Crafting your project roadmap...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerate}
                    className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-base shadow hover:opacity-95"
                  >
                    🚀 Generate Projects
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
                  <p className="text-sm text-gray-500 mt-1">Here's your personalized project workspace.</p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">{user?.experience_level ?? '—'}</span>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">{user?.domain ?? '—'}</span>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">{user?.goal ?? '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="bg-white border px-3 py-2 rounded-md text-sm">New Project</button>
                  <button className="bg-white border px-3 py-2 rounded-md text-sm">Settings</button>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatisticCard label="Total Projects" value={projects.length} />
                <StatisticCard label="Completed Steps" value={projects.reduce((acc, p) => acc + (p.completedSteps ?? (p.steps ? p.steps.filter(s=>s.completed).length : 0)), 0)} />
                <StatisticCard label="Overall Progress" value={`${Math.round(projects.reduce((acc, p) => {
                  const total = p.totalSteps ?? (p.steps ? p.steps.length : 0);
                  const done = p.completedSteps ?? (p.steps ? p.steps.filter(s=>s.completed).length : 0);
                  return acc + (total > 0 ? (done / total) : (p.progress ?? 0)/100);
                },0) / projects.length * 100) || 0}%`} />
              </div>
            </div>
          )}

          {/* Project List */}
          {projects.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Your Roadmaps</h2>
                <div className="bg-white border rounded-lg p-1 flex items-center gap-1">
                  <button className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-900">Active</button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900">Completed</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard project={project} key={project.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
