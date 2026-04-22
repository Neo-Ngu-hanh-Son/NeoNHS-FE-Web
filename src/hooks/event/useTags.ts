/**
 * Custom Hook: useTags
 * Fetches the full list of active tags (public endpoint) for dropdowns
 */

import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { tagService } from '@/services/api/tagService';
import type { TagResponse } from '@/types/tag';

interface UseTagsReturn {
    tags: TagResponse[];
    loading: boolean;
    fetchTags: () => Promise<void>;
}

export function useTags(): UseTagsReturn {
    const [tags, setTags] = useState<TagResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTags = useCallback(async () => {
        setLoading(true);
        try {
            const response = await tagService.getAllTagsList();
            if (response.success) {
                setTags(response.data);
            } else {
                message.error(response.message || 'Lấy thẻ thất bại');
            }
        } catch (error: unknown) {
            const err = error as Error;
            message.error('Lấy thẻ thất bại: ' + (err.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    return { tags, loading, fetchTags };
}
