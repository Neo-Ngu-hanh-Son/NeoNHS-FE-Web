import type { WorkshopSessionResponse } from '../types'
import { parseSessionInstant, vietnamDateKey } from './formatters'

/** Các ngày (YYYY-MM-DD, giờ VN) có phiên, mới nhất trước */
export function distinctVietnamDateKeysNewestFirst(
  sessions: WorkshopSessionResponse[],
): string[] {
  const best = new Map<string, number>()
  for (const s of sessions) {
    const k = vietnamDateKey(s.startTime)
    const t = parseSessionInstant(s.startTime).getTime()
    best.set(k, Math.max(best.get(k) ?? 0, t))
  }
  return [...best.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
}

export function applySessionFilters(
  sessions: WorkshopSessionResponse[],
  searchQuery: string,
  statusFilter: string,
): WorkshopSessionResponse[] {
  let filtered = sessions
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.workshopTemplate.name.toLowerCase().includes(q) ||
        s.workshopTemplate.shortDescription.toLowerCase().includes(q),
    )
  }
  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter((s) => s.status === statusFilter)
  }
  return filtered
}

export function sessionsVisibleForDaySlice(
  baseFiltered: WorkshopSessionResponse[],
  dateKeysNewestFirst: string[],
  visibleDayCount: number,
): WorkshopSessionResponse[] {
  const allowed = new Set(dateKeysNewestFirst.slice(0, visibleDayCount))
  if (allowed.size === 0) return []
  return baseFiltered.filter((s) => allowed.has(vietnamDateKey(s.startTime)))
}
