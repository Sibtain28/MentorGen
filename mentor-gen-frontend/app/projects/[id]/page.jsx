"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function ProjectDetailPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${id}`);
                setProject(res.data.project);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch project", err);
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const toggleStep = async (stepId, completed) => {
        try {
            // Backend expects POST /api/progress/step/:stepId
            // It toggles the status, so simply calling it matches the user action 
            // if state was synced.
            await api.post(`/progress/step/${stepId}`);

            setProject(prev => ({
                ...prev,
                steps: prev.steps.map(step =>
                    step.id === stepId ? { ...step, completed } : step
                )
            }));
        } catch (err) {
            console.error("Failed to toggle step", err);
            // Revert optimistic update on error
            setProject(prev => ({
                ...prev,
                steps: prev.steps.map(step =>
                    step.id === stepId ? { ...step, completed: !completed } : step
                )
            }));
        }
    };

    if (loading) return <div className="p-8">Loading project...</div>;
    if (!project) return <div className="p-8">Project not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                <p className="text-gray-600 mb-8">{project.description}</p>

                <div className="space-y-4">
                    {project.steps.map(step => (
                        <div
                            key={step.id}
                            className={`flex items-start gap-4 p-4 border rounded-lg transition ${step.completed ? "bg-green-50 border-green-200" : "bg-white"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={step.completed}
                                onChange={e => toggleStep(step.id, e.target.checked)}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                            />

                            <div>
                                <h3 className={`font-medium ${step.completed ? "text-green-800 line-through" : ""}`}>
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
