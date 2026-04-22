import type { KnowledgeDocument, Page } from '@/services/api/knowledgeApi';

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
