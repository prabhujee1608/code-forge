import React from 'react';
import { getStatusBadgeStyle, getWorkModeBadgeStyle } from '../utils/formatters';

export const Badge = ({ text, type = 'status', className = '' }) => {
  let styleClass = 'bg-slate-800 text-slate-300 border-slate-700';

  if (type === 'status') {
    styleClass = getStatusBadgeStyle(text);
  } else if (type === 'workMode') {
    styleClass = getWorkModeBadgeStyle(text);
  } else if (type === 'jobType') {
    styleClass = text === 'Internship'
      ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
      : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass} ${className}`}
    >
      {text}
    </span>
  );
};
