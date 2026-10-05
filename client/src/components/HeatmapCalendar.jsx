import React from 'react';

export const HeatmapCalendar = ({ streakDays = 12 }) => {
  // Generate 52 weeks x 7 days grid representation
  const weeks = 28; // Display last 28 weeks for clean desktop layout
  const daysPerWeek = 7;
  const totalCells = weeks * daysPerWeek;

  const cells = Array.from({ length: totalCells }, (_, idx) => {
    // Generate realistic heat intensity (0: none, 1: low, 2: medium, 3: high)
    const activeThreshold = totalCells - streakDays;
    let intensity = 0;
    if (idx >= activeThreshold) {
      intensity = (idx % 3) + 1;
    } else if (idx % 5 === 0) {
      intensity = 1;
    } else if (idx % 7 === 2) {
      intensity = 2;
    }
    return intensity;
  });

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 1:
        return 'bg-emerald-900/60 border-emerald-800/40';
      case 2:
        return 'bg-emerald-600 border-emerald-500';
      case 3:
        return 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
      default:
        return 'bg-slate-900 border-slate-800/60';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Coding Practice Activity Heatmap</span>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-900/60" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
          <span className="w-2.5 h-2.5 rounded bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[500px]">
          {cells.map((intensity, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-sm border transition-all hover:scale-125 ${getIntensityColor(
                intensity
              )}`}
              title={`Day ${idx + 1}: ${intensity > 0 ? `${intensity * 2} problems solved` : 'No submissions'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
