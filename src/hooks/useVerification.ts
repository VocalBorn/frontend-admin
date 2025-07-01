import { useState, useEffect, useCallback } from 'react';
import {
  listPendingApplications,
  getApplicationDetails,
  approveApplication,
  rejectApplication,
  requestApplicationAction,
  getDocumentViewUrl,
} from '../lib/verification-api';
import type {
  TherapistApplicationSummary,
  TherapistApplication,
  ApplicationActionRequest,
} from '../lib/verification-api';
import { useToast } from './useToast';

export const useVerification = () => {
  const [applications, setApplications] = useState<TherapistApplicationSummary[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<TherapistApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();

  /**
   * 載入待處理的申請列表
   */
  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPendingApplications();
      setApplications(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入申請列表失敗';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  /**
   * 載入指定申請的詳細資訊
   */
  const loadApplicationDetails = async (applicationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplicationDetails(applicationId);
      setSelectedApplication(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '載入申請詳情失敗';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 批准申請
   */
  const handleApprove = async (applicationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await approveApplication(applicationId);
      showSuccess('申請已批准');
      await loadApplications();
      if (selectedApplication?.id === applicationId) {
        await loadApplicationDetails(applicationId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '批准申請失敗';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 拒絕申請
   */
  const handleReject = async (applicationId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const request: ApplicationActionRequest = { reason };
      await rejectApplication(applicationId, request);
      showSuccess('申請已拒絕');
      await loadApplications();
      if (selectedApplication?.id === applicationId) {
        await loadApplicationDetails(applicationId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '拒絕申請失敗';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 要求補件
   */
  const handleRequestAction = async (applicationId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      const request: ApplicationActionRequest = { reason };
      await requestApplicationAction(applicationId, request);
      showSuccess('已要求補件');
      await loadApplications();
      if (selectedApplication?.id === applicationId) {
        await loadApplicationDetails(applicationId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '要求補件失敗';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 取得文件檢視 URL
   */
  const getDocumentUrl = async (documentId: string): Promise<string | null> => {
    try {
      return await getDocumentViewUrl(documentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '取得文件連結失敗';
      showError(errorMessage);
      return null;
    }
  };

  /**
   * 清除選中的申請
   */
  const clearSelectedApplication = () => {
    setSelectedApplication(null);
  };

  // 初始載入
  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return {
    applications,
    selectedApplication,
    loading,
    error,
    loadApplications,
    loadApplicationDetails,
    handleApprove,
    handleReject,
    handleRequestAction,
    getDocumentUrl,
    clearSelectedApplication,
  };
};
