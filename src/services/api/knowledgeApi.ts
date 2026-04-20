import api from './apiClient';

export type KnowledgeType = 'INFORMATION' | 'SYSTEM_PROMPT';

export interface KnowledgeDocument {
    id: string;
    title: string;
    content: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    knowledgeType?: KnowledgeType;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export type KnowledgeDocumentPayload = {
    title: string;
    content: string;
    knowledgeType?: KnowledgeType;
    isActive?: boolean;
};

export const knowledgeApi = {
    getDocuments: async (page = 0, size = 20, filters?: { knowledgeType?: KnowledgeType }) => {
        return await api.get<Page<KnowledgeDocument> | KnowledgeDocument[]>(`/knowledge`, {
            params: { page, size, ...filters },
        });
    },

    getDocument: async (id: string) => {
        return await api.get<KnowledgeDocument>(`/knowledge/${id}`);
    },

    createDocument: async (data: KnowledgeDocumentPayload) => {
        return await api.post<KnowledgeDocument>(`/knowledge`, data);
    },

    updateDocument: async (id: string, data: KnowledgeDocumentPayload) => {
        return await api.put<KnowledgeDocument>(`/knowledge/${id}`, data);
    },

    deleteDocument: async (id: string) => {
        await api.delete(`/knowledge/${id}`);
    },

    /** PATCH `/api/knowledge/{id}/visibility` — body: `{ "isActive": true | false }` */
    toggleVisibility: async (id: string, isActive: boolean) => {
        await api.patch(`/knowledge/${id}/visibility`, { isActive });
    },

    uploadDocument: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return await api.post<KnowledgeDocument>(`/knowledge/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};
