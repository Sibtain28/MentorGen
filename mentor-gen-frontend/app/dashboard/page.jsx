"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";

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

          {/* Hero Section */}
          <div className="text-center mb-16 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Your coding mentor, always available
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6">
              Turn Your Ideas Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">
                Real Projects
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Generate personalized project ideas, get step-by-step implementation guides,
              and build your portfolio with confidence. No more tutorial hell.
            </p>

            {isGenerating ? (
              <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-xl shadow-lg border border-teal-100">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                <span className="text-teal-700 font-medium">Crafting your project roadmap...</span>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={projects.length > 0}
                className={`bg-black  text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all
                  ${projects.length > 0 ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {projects.length > 0 ? "Projects Generated ✅" : "🚀 Generate My Project"}
              </button>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 mt-12 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
                <span>💡</span> AI-Powered Ideas
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
                <span>🎯</span> Step-by-Step Guides
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm">
                <span>📚</span> Resume Ready
              </div>
            </div>
          </div>

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
                  <div
                    key={project.id}
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        {project.title.includes("React") ? "⚛️" : "🚀"}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {project.difficulty}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {project.estimatedTime}
                      </div>
                      <div className="bg-gray-100 h-1.5 w-16 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-0 group-hover:w-1/3 transition-all duration-1000"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
