export const formatTime = (isoString?: string | null) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (isoString?: string | null) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return formatTime(isoString);
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const formatDateTime = (isoString?: string | null) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  
  const timeStr = formatTime(isoString);

  if (date.toDateString() === now.toDateString()) {
    return `Today at ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  return `${dateStr}, ${timeStr}`;
};
