import { useState, useCallback } from 'react';
import { chaptersApi } from '@/lib/chapters-api';
import { useToast } from './useToast';
import { getErrorMessage } from '@/lib/api';

export function useSituationStats() {
  const [chapterCounts, setChapterCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();

  const loadChapterCount = useCallback(async (situationId: string) => {
    try {
      const response = await chaptersApi.list(situationId);
      setChapterCounts(prev => ({
        ...prev,
        [situationId]: response.total
      }));
      return response.total;
    } catch (err) {
      showError(getErrorMessage(err));
      return 0;
    }
  }, [showError]);

  const loadChapterCounts = useCallback(async (situationIds: string[]) => {
    try {
      setIsLoading(true);
      const promises = situationIds.map(id => loadChapterCount(id));
      await Promise.all(promises);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [loadChapterCount, showError]);

  return {
    chapterCounts,
    isLoading,
    loadChapterCount,
    loadChapterCounts,
  };
}
