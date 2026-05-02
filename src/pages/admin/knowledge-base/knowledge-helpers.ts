import type { KnowledgeDocument, Page, RagKnowledgeType } from '@/services/api/knowledgeApi';

/** API đôi khi trả `isActive` dạng string hoặc thiếu — chuẩn hoá để Switch hiển thị đúng. */
export function coerceKnowledgeIsActive(value: unknown): boolean {
  if (value === false || value === 'false') return false;
  if (value === true || value === 'true') return true;
  if (value === null || value === undefined) return true;
  return Boolean(value);
}

export function extractDocuments(
  res: Page<KnowledgeDocument> | KnowledgeDocument[],
): KnowledgeDocument[] {
  const raw = Array.isArray(res) ? res : res.content || [];
  return raw.map((doc) => ({
    ...doc,
    isActive: coerceKnowledgeIsActive(doc.isActive),
  }));
}

/** Tài liệu dùng cho RAG — loại trừ system prompt */
export function isInformationKnowledge(doc: KnowledgeDocument): boolean {
  return (doc.knowledgeType ?? 'INFORMATION') !== 'SYSTEM_PROMPT';
}

export function isSystemPromptKnowledge(doc: KnowledgeDocument): boolean {
  return doc.knowledgeType === 'SYSTEM_PROMPT';
}

const RAG_TYPE_LABELS: Record<RagKnowledgeType, string> = {
  INFORMATION: 'Thông tin',
  REGULATION: 'Quy định',
  GUIDE: 'Hướng dẫn',
};

/** Nhãn loại tài liệu cho cột bảng / UI (RAG, không bao gồm System Prompt). */
export function getRagKnowledgeTypeLabel(doc: KnowledgeDocument): string {
  const t = (doc.knowledgeType ?? 'INFORMATION') as string;
  if (t in RAG_TYPE_LABELS) {
    return RAG_TYPE_LABELS[t as RagKnowledgeType];
  }
  return t;
}

const RAG_TYPE_BADGE_CLASS: Record<RagKnowledgeType, string> = {
  INFORMATION: 'border-none bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200',
  REGULATION: 'border-none bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  GUIDE: 'border-none bg-sky-50 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200',
};

export function getRagKnowledgeTypeBadgeClass(doc: KnowledgeDocument): string {
  const t = (doc.knowledgeType ?? 'INFORMATION') as string;
  if (t in RAG_TYPE_BADGE_CLASS) {
    return RAG_TYPE_BADGE_CLASS[t as RagKnowledgeType];
  }
  return 'border-none bg-slate-100 text-slate-700';
}
