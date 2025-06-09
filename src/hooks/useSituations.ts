import { useState, useCallback } from 'react';
import { situationService } from '@/services/situations';
import type { SituationResponse, SituationCreate, SituationUpdate } from '@/lib/api';

export function useSituations() {
  const [situations, setSituations] = useState<SituationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSituations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await situationService.list();
      setSituations(response.situations);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('未知錯誤'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSituation = useCallback(async (data: SituationCreate) => {
    try {
      await situationService.create(data);
      await loadSituations();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('新增情境失敗'));
      throw err;
    }
  }, [loadSituations]);

  const updateSituation = useCallback(async (id: string, data: SituationUpdate) => {
    try {
      await situationService.update(id, data);
      await loadSituations();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('更新情境失敗'));
      throw err;
    }
  }, [loadSituations]);

  const deleteSituation = useCallback(async (id: string) => {
    try {
      await situationService.delete(id);
      await loadSituations();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('刪除情境失敗'));
      throw err;
    }
  }, [loadSituations]);

  return {
    situations,
    isLoading,
    error,
    loadSituations,
    createSituation,
    updateSituation,
    deleteSituation,
  };
}
