import { useState, useCallback } from 'react';
import { chaptersApi, type ChapterResponse, type ChapterCreate, type ChapterUpdate, type ChapterReorder } from '@/lib/chapters-api';
import { useToast } from './useToast';
import { getErrorMessage } from '@/lib/api';

export function useChapters(situationId?: string) {
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const loadChapters = useCallback(async (targetSituationId?: string) => {
    const id = targetSituationId || situationId;
    if (!id) return;
    
    try {
      setIsLoading(true);
      const response = await chaptersApi.list(id);
      setChapters(response.chapters);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [situationId, showError]);

  const createChapter = useCallback(async (data: ChapterCreate, targetSituationId?: string) => {
    const id = targetSituationId || situationId;
    if (!id) return;
    
    try {
      await chaptersApi.create(id, data);
      await loadChapters(id);
      showSuccess('章節新增成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [situationId, loadChapters, showError, showSuccess]);

  const updateChapter = useCallback(async (chapterId: string, data: ChapterUpdate) => {
    try {
      await chaptersApi.update(chapterId, data);
      await loadChapters();
      showSuccess('章節更新成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [loadChapters, showError, showSuccess]);

  const deleteChapter = useCallback(async (chapterId: string) => {
    try {
      await chaptersApi.delete(chapterId);
      await loadChapters();
      showSuccess('章節刪除成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [loadChapters, showError, showSuccess]);

  const reorderChapters = useCallback(async (data: ChapterReorder, targetSituationId?: string) => {
    const id = targetSituationId || situationId;
    if (!id) return;
    
    try {
      await chaptersApi.reorder(id, data);
      await loadChapters(id);
      showSuccess('章節順序更新成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [situationId, loadChapters, showError, showSuccess]);

  return {
    chapters,
    isLoading,
    loadChapters,
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
  };
}
