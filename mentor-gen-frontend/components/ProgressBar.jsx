import React from 'react';

export default function ProgressBar({ value = 0, size = 'md' }) {
  const percent = Math.max(0, Math.min(100, Math.round(value)));

  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-500">Progress</div>
        <div className="text-xs font-medium text-gray-700">{percent}%</div>
      </div>

      <div className={`bg-gray-100 rounded-full ${heightClass} w-full overflow-hidden`}>
        <div
          className="bg-blue-500 h-full transition-all"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
