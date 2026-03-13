import { useCallback, useEffect, useState } from 'react';
import { TAG_PAGE_SIZE, TAG_SORT_OPTIONS } from '@/constants/tag';
import { tagService } from '@/services/api/tagService';
import { workshopTagService } from '@/services/api/workshopTagService';
import type { TagResponse } from '@/types/tag';

export type AdminTagKind = 'event' | 'workshop';
export type AdminTagModalMode = 'create' | 'edit' | 'delete' | 'restore' | null;

interface UseAdminTagsOptions {
  kind: AdminTagKind;
}

export interface UseAdminTagsReturn {
  tags: TagResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
  sortIndex: number;
  setSortIndex: (index: number) => void;
  goToPage: (page: number) => void;
  retryFetch: () => void;
  modalMode: AdminTagModalMode;
  modalTag: TagResponse | null;
  openModal: (mode: NonNullable<AdminTagModalMode>, tag?: TagResponse) => void;
  closeModal: () => void;
  handleModalSuccess: () => void;
}

export function useAdminTags({ kind }: UseAdminTagsOptions): UseAdminTagsReturn {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortIndex, setSortIndexRaw] = useState(0);

  const [modalMode, setModalMode] = useState<AdminTagModalMode>(null);
  const [modalTag, setModalTag] = useState<TagResponse | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const sort = TAG_SORT_OPTIONS[sortIndex];
      const params = {
        page: currentPage,
        size: TAG_PAGE_SIZE,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir,
      };

      const response =
        kind === 'event'
          ? await tagService.getAllTags(params)
          : await workshopTagService.getAllWorkshopTags(params);

      const page = response.data;
      setTags(page.content);
      setTotalElements(page.totalElements);
      setTotalPages(page.totalPages);
    } catch {
      setError(`Unable to load ${kind === 'event' ? 'event tags' : 'workshop tags'}. Please try again later.`);
      setTags([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, kind, sortIndex]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const setSortIndex = useCallback((index: number) => {
    setSortIndexRaw(index);
    setCurrentPage(0);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages],
  );

  const openModal = useCallback((mode: NonNullable<AdminTagModalMode>, tag?: TagResponse) => {
    setModalMode(mode);
    setModalTag(tag ?? null);
  }, []);

  const closeModal = useCallback(() => {
    setModalMode(null);
    setModalTag(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    setModalMode(null);
    setModalTag(null);
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    currentPage,
    totalElements,
    totalPages,
    pageSize: TAG_PAGE_SIZE,
    sortIndex,
    setSortIndex,
    goToPage,
    retryFetch: fetchTags,
    modalMode,
    modalTag,
    openModal,
    closeModal,
    handleModalSuccess,
  };
}
