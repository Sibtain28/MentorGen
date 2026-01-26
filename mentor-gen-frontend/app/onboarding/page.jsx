"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    preferred_domain: "",
    preferred_tech_stack: [],
    preferred_goal: "",
    skillLevel: ""
  });

  const domains = [
    { id: "web", label: "Web Development", icon: "🌐", desc: "Build websites and web apps" },
    { id: "mobile", label: "Mobile App", icon: "📱", desc: "iOS and Android apps" },
    { id: "backend", label: "Backend/API", icon: "⚙️", desc: "Server-side development" },
    { id: "ml", label: "Machine Learning", icon: "🤖", desc: "AI and data science" },
    { id: "fullstack", label: "Full Stack", icon: "🚀", desc: "End-to-end development" }
  ];

  const goals = [
    { id: "learning", label: "Learning", icon: "🌱", desc: "Practice new skills" },
    { id: "resume", label: "Resume Builder", icon: "📚", desc: "Impress employers" },
    { id: "college", label: "College Project", icon: "🎓", desc: "Academic submission" },
    { id: "portfolio", label: "Portfolio", icon: "💼", desc: "Showcase your work" }
  ];

  const skillLevels = [
    { id: "Beginner", label: "Beginner", icon: "🌱", desc: "Just starting my coding journey" },
    { id: "Intermediate", label: "Intermediate", icon: "🚀", desc: "Comfortable with basics, ready for more" },
    { id: "Advanced", label: "Advanced", icon: "⭐", desc: "Experienced developer looking for challenges" }
  ];

  const handleSubmit = async () => {
    try {
      await api.post("/users/preferences", form);
      router.replace("/dashboard");
    } catch (err) {
      console.error("Failed to save preferences", err);
      alert("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-teal-400 p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="font-bold text-lg">BuildPath</span>
          </div>
        </div>
      </div>

      {/* Progress Tracker - Centered */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s < step ? "bg-teal-500 text-white" :
                  s === step ? "bg-teal-500 text-white ring-4 ring-teal-100" :
                    "bg-gray-200 text-gray-500"
                }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-1 transition-all ${s < step ? "bg-teal-500" : "bg-gray-200"
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">

          {/* Step 1: Skill Level */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-16 h-1 bg-teal-500 mx-auto mb-6 rounded-full"></div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">What's your experience level?</h2>
                <p className="text-gray-600">This helps us tailor project complexity</p>
              </div>

              <div className="space-y-4 mb-8">
                {skillLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setForm({ ...form, skillLevel: level.id })}
                    className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex items-start gap-4 ${form.skillLevel === level.id
                        ? "border-teal-500 bg-teal-50 shadow-lg"
                        : "border-gray-200 hover:border-teal-200 hover:shadow-md"
                      }`}
                  >
                    <div className="text-4xl">{level.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-xl text-gray-900 mb-1">{level.label}</div>
                      <div className="text-gray-600">{level.desc}</div>
                    </div>
                    {form.skillLevel === level.id && (
                      <div className="text-teal-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.skillLevel}
                className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2: Domain */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose a domain</h2>
                <p className="text-gray-600">What type of project interests you?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setForm({ ...form, preferred_domain: domain.label })}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${form.preferred_domain === domain.label
                        ? "border-teal-500 bg-teal-50 shadow-md"
                        : "border-gray-200 hover:border-teal-200 hover:shadow-sm"
                      }`}
                  >
                    <div className="text-3xl mb-2">{domain.icon}</div>
                    <div className="font-semibold text-lg text-gray-900 mb-1">{domain.label}</div>
                    <div className="text-sm text-gray-600">{domain.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!form.preferred_domain}
                  className="flex-1 bg-teal-500 text-white py-4 rounded-xl font-semibold hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Goal */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your goal?</h2>
                <p className="text-gray-600">This helps us recommend the right project scope</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setForm({ ...form, preferred_goal: goal.label })}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${form.preferred_goal === goal.label
                        ? "border-teal-500 bg-teal-50 shadow-md"
                        : "border-gray-200 hover:border-teal-200 hover:shadow-sm"
                      }`}
                  >
                    <div className="text-3xl mb-2">{goal.icon}</div>
                    <div className="font-semibold text-lg text-gray-900 mb-1">{goal.label}</div>
                    <div className="text-sm text-gray-600">{goal.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.preferred_goal}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Started →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
