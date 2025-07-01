import { api } from './api';

// 治療師申請狀態
export const ApplicationStatus = {
  PENDING: 'pending',
  ACTION_REQUIRED: 'action_required',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

// 文件類型
export const DocumentType = {
  ID_CARD_FRONT: 'id_card_front',
  ID_CARD_BACK: 'id_card_back',
  THERAPIST_CERTIFICATE: 'therapist_certificate'
} as const;

export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

// 上傳文件資訊
export interface UploadedDocument {
  id: string;
  document_type: DocumentType;
  created_at: string;
}

// 治療師申請詳細資訊
export interface TherapistApplication {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  documents: UploadedDocument[];
  rejection_reason: string | null;
  reviewed_by_id: string | null;
  created_at: string;
  updated_at: string;
}

// 治療師申請摘要（列表用）
export interface TherapistApplicationSummary {
  id: string;
  user_id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  // 用戶資訊（可能需要額外查詢）
  user_name?: string;
  user_email?: string;
}

// 申請拒絕/補件請求
export interface ApplicationActionRequest {
  reason: string;
}

// 文件上傳表單
export interface DocumentUploadForm {
  document_type: DocumentType;
  file: File;
}

/**
 * 取得當前用戶的最新治療師申請
 */
export const getMyLatestApplication = async (): Promise<TherapistApplication> => {
  const response = await api.get('/verification/therapist-applications/me');
  return response.data;
};

/**
 * 上傳驗證文件
 */
export const uploadDocument = async (
  applicationId: string,
  formData: FormData
): Promise<UploadedDocument> => {
  const response = await api.post(
    `/verification/therapist-applications/${applicationId}/documents/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * 管理員：列出所有待處理的治療師申請
 */
export const listPendingApplications = async (): Promise<TherapistApplicationSummary[]> => {
  const response = await api.get('/verification/admin/therapist-applications/');
  return response.data;
};

/**
 * 管理員：取得指定申請的詳細資訊
 */
export const getApplicationDetails = async (applicationId: string): Promise<TherapistApplication> => {
  const response = await api.get(`/verification/admin/therapist-applications/${applicationId}`);
  return response.data;
};

/**
 * 管理員：取得文件檢視 URL
 */
export const getDocumentViewUrl = async (documentId: string): Promise<string> => {
  const response = await api.get(`/verification/admin/documents/${documentId}/view`);
  return response.data;
};

/**
 * 管理員：批准治療師申請
 */
export const approveApplication = async (applicationId: string): Promise<TherapistApplication> => {
  const response = await api.post(`/verification/admin/therapist-applications/${applicationId}/approve`);
  return response.data;
};

/**
 * 管理員：拒絕治療師申請
 */
export const rejectApplication = async (
  applicationId: string,
  request: ApplicationActionRequest
): Promise<TherapistApplication> => {
  const response = await api.post(
    `/verification/admin/therapist-applications/${applicationId}/reject`,
    request
  );
  return response.data;
};

/**
 * 管理員：要求治療師補件
 */
export const requestApplicationAction = async (
  applicationId: string,
  request: ApplicationActionRequest
): Promise<TherapistApplication> => {
  const response = await api.post(
    `/verification/admin/therapist-applications/${applicationId}/request-action`,
    request
  );
  return response.data;
};

// 輔助函式：取得狀態顯示文字
export const getStatusText = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return '待審核';
    case ApplicationStatus.ACTION_REQUIRED:
      return '需補件';
    case ApplicationStatus.APPROVED:
      return '已核准';
    case ApplicationStatus.REJECTED:
      return '已拒絕';
    default:
      return '未知狀態';
  }
};

// 輔助函式：取得狀態對應的顏色
export const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case ApplicationStatus.ACTION_REQUIRED:
      return 'bg-orange-100 text-orange-800';
    case ApplicationStatus.APPROVED:
      return 'bg-green-100 text-green-800';
    case ApplicationStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 輔助函式：取得文件類型顯示文字
export const getDocumentTypeText = (type: DocumentType): string => {
  switch (type) {
    case DocumentType.ID_CARD_FRONT:
      return '身分證正面';
    case DocumentType.ID_CARD_BACK:
      return '身分證反面';
    case DocumentType.THERAPIST_CERTIFICATE:
      return '治療師證書';
    default:
      return '未知文件';
  }
};
