import { useState, useCallback } from 'react';
import { situationService } from '@/services/situations';
import { getErrorMessage } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { SituationResponse, SituationCreate, SituationUpdate } from '@/lib/api';

export function useSituations() {
  const [situations, setSituations] = useState<SituationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  const loadSituations = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await situationService.list();
      setSituations(response.situations);
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  const createSituation = useCallback(async (data: SituationCreate) => {
    try {
      await situationService.create(data);
      await loadSituations();
      showSuccess('情境新增成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [loadSituations, showError, showSuccess]);

  const updateSituation = useCallback(async (id: string, data: SituationUpdate) => {
    try {
      await situationService.update(id, data);
      await loadSituations();
      showSuccess('情境更新成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [loadSituations, showError, showSuccess]);

  const deleteSituation = useCallback(async (id: string) => {
    try {
      await situationService.delete(id);
      await loadSituations();
      showSuccess('情境刪除成功');
    } catch (err) {
      showError(getErrorMessage(err));
      throw err;
    }
  }, [loadSituations, showError, showSuccess]);

  return {
    situations,
    isLoading,
    loadSituations,
    createSituation,
    updateSituation,
    deleteSituation,
  };
}
