export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString, timeString = '') => {
  if (!dateString) return 'N/A';
  const dateFormatted = formatDate(dateString);
  return timeString ? `${dateFormatted} at ${timeString}` : dateFormatted;
};

export const getDaysRemaining = (dateString) => {
  if (!dateString) return null;
  const target = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
  } else if (diffDays === 0) {
    return { text: 'Today', isUrgent: true };
  } else if (diffDays === 1) {
    return { text: 'Tomorrow', isUrgent: true };
  } else {
    return { text: `In ${diffDays} days`, isUrgent: diffDays <= 3 };
  }
};

export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Saved':
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    case 'Applied':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Under Review':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Shortlisted':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'Interview':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse-glow';
    case 'Offer':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 glow-emerald';
    case 'Rejected':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  }
};

export const getWorkModeBadgeStyle = (mode) => {
  switch (mode) {
    case 'Remote':
      return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    case 'Hybrid':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'On-site':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
