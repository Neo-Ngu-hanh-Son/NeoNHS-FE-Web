export const formatTime = (isoString?: string | null) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
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
    return 'Hôm qua';
  }

  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
};

export const formatDateTime = (isoString?: string | null) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();

  const timeStr = formatTime(isoString);

  if (date.toDateString() === now.toDateString()) {
    return `Hôm nay lúc ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Hôm qua lúc ${timeStr}`;
  }

  const dateOpts: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };
  if (date.getFullYear() !== now.getFullYear()) {
    dateOpts.year = 'numeric';
  }
  const dateStr = date.toLocaleDateString('vi-VN', dateOpts);
  return `${dateStr}, ${timeStr}`;
};
