"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';

export default function ProjectCard({ project }) {
  const router = useRouter();

  const totalSteps = project.totalSteps ?? (project.steps ? project.steps.length : 0);
  const completedSteps = project.completedSteps ?? (project.steps ? project.steps.filter(s => s.completed).length : 0);
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : project.progress ?? 0;

  const difficultyClass = project.difficulty === 'Beginner'
    ? 'bg-green-100 text-green-700'
    : project.difficulty === 'Intermediate'
      ? 'bg-yellow-100 text-yellow-700'
      : 'bg-red-100 text-red-700';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">{project.icon ?? '🚀'}</div>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyClass}`}>{project.difficulty}</div>
          </div>

          <h3 className="font-bold text-lg mb-2 text-gray-900">{project.title}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

          <div className="mb-4">
            <ProgressBar value={progress} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="text-xs text-gray-500">{completedSteps}/{totalSteps} steps</div>
          <button
            onClick={() => router.push(`/projects/${project.id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
