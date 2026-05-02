import type { RagKnowledgeType } from '@/services/api/knowledgeApi';

/** Tiêu đề mặc định khi tạo document SYSTEM_PROMPT (khớp gợi ý backend) */
export const DEFAULT_SYSTEM_PROMPT_TITLE = 'AI System Prompt';

export const RAG_KNOWLEDGE_TYPE_OPTIONS: { value: RagKnowledgeType; label: string }[] = [
  { value: 'INFORMATION', label: 'Thông tin' },
  { value: 'REGULATION', label: 'Quy định' },
  { value: 'GUIDE', label: 'Hướng dẫn' },
];
