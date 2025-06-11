import { useState, useCallback } from 'react';
import { sentencesApi, type SentenceResponse, type SentenceCreate, type SentenceUpdate } from '@/lib/sentences-api';
import { useToast } from './useToast';
import { getErrorMessage } from '@/lib/api';

export function useSentences(chapterId?: string) {
  const [sentences, setSentences] = useState<SentenceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const loadSentences = useCallback(async (targetChapterId?: string) => {
    const id = targetChapterId || chapterId;
    if (!id) return;
    
    try {
      setIsLoading(true);
      const response = await sentencesApi.list(id);
      setSentences(response.sentences);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [chapterId, showError]);

  const createSentence = useCallback(async (data: SentenceCreate, targetChapterId?: string) => {
    const id = targetChapterId || chapterId;
    if (!id) return;
    
    try {
      await sentencesApi.create(id, data);
      await loadSentences(id);
      showSuccess('語句新增成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [chapterId, loadSentences, showError, showSuccess]);

  const updateSentence = useCallback(async (sentenceId: string, data: SentenceUpdate) => {
    try {
      await sentencesApi.update(sentenceId, data);
      await loadSentences();
      showSuccess('語句更新成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [loadSentences, showError, showSuccess]);

  const deleteSentence = useCallback(async (sentenceId: string) => {
    try {
      await sentencesApi.delete(sentenceId);
      await loadSentences();
      showSuccess('語句刪除成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [loadSentences, showError, showSuccess]);

  return {
    sentences,
    isLoading,
    loadSentences,
    createSentence,
    updateSentence,
    deleteSentence,
  };
}
