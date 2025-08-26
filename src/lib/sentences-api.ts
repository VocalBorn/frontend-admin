import { api } from './api';

// 語句相關介面
export type SpeakerRole = 'self' | 'other';

export interface SentenceCreate {
  sentence_name: string;
  speaker_role: SpeakerRole;
  role_description?: string;
  content: string;
  start_time?: number;
  end_time?: number;
}

export interface SentenceUpdate {
  sentence_name?: string;
  speaker_role?: SpeakerRole;
  role_description?: string;
  content?: string;
  start_time?: number;
  end_time?: number;
}

export interface SentenceResponse {
  sentence_id: string;
  chapter_id: string;
  sentence_name: string;
  speaker_role: SpeakerRole;
  role_description: string | null;
  content: string;
  start_time: number | null;
  end_time: number | null;
  example_audio_path: string | null;
  example_audio_duration: number | null;
  example_file_size: number | null;
  example_content_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface SentenceListResponse {
  total: number;
  sentences: SentenceResponse[];
}

export interface SentenceAudioUploadResponse {
  sentence_id: string;
  audio_path: string;
  audio_duration: number | null;
  file_size: number;
  content_type: string;
  message: string;
}

export interface AudioGenerationResponse {
  sentence_id?: string;
  chapter_id?: string;
  message: string;
  generated_count?: number;
}

export interface SentenceAudioUrlResponse {
  sentence_id: string;
  status: string;
  message: string;
  url: string | null;
}

export interface SentenceAudioDeleteResponse {
  sentence_id: string;
  status: string;
  message: string;
}

// 語句相關 API
export const sentencesApi = {
  // 取得語句列表
  list: async (chapterId: string, params?: { skip?: number; limit?: number }): Promise<SentenceListResponse> => {
    const response = await api.get<SentenceListResponse>(`/situations/chapters/${chapterId}/sentences`, { params });
    return response.data;
  },

  // 新增語句
  create: async (chapterId: string, data: SentenceCreate): Promise<SentenceResponse> => {
    const response = await api.post<SentenceResponse>(`/situations/chapters/${chapterId}/sentences`, data);
    return response.data;
  },

  // 取得單一語句
  get: async (sentenceId: string): Promise<SentenceResponse> => {
    const response = await api.get<SentenceResponse>(`/situations/sentence/${sentenceId}`);
    return response.data;
  },

  // 更新語句
  update: async (sentenceId: string, data: SentenceUpdate): Promise<SentenceResponse> => {
    const response = await api.patch<SentenceResponse>(`/situations/sentence/${sentenceId}`, data);
    return response.data;
  },

  // 刪除語句
  delete: async (sentenceId: string): Promise<void> => {
    await api.delete(`/situations/sentence/${sentenceId}`);
  },

  // 上傳語句示範音訊
  uploadExampleAudio: async (sentenceId: string, audioFile: File): Promise<SentenceAudioUploadResponse> => {
    const formData = new FormData();
    formData.append('file', audioFile);
    
    const response = await api.post<SentenceAudioUploadResponse>(
      `/situations/sentence/${sentenceId}/upload-example-audio`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // 自動生成語句示範音訊
  generateExampleAudio: async (sentenceId: string, voice: string = 'female'): Promise<AudioGenerationResponse> => {
    const response = await api.post<AudioGenerationResponse>(
      `/situations/sentence/${sentenceId}/generate-example-audio`,
      null,
      {
        params: { voice },
      }
    );
    return response.data;
  },

  // 批次生成章節中所有語句示範音訊
  generateSentencesAudio: async (chapterId: string, voice: string = 'female'): Promise<AudioGenerationResponse> => {
    const response = await api.post<AudioGenerationResponse>(
      `/situations/chapter/${chapterId}/generate-sentences-audio`,
      null,
      {
        params: { voice },
      }
    );
    return response.data;
  },

  // 取得語句示範音訊聆聽網址
  getExampleAudioUrl: async (sentenceId: string, expiresMinutes: number = 15): Promise<SentenceAudioUrlResponse> => {
    const response = await api.get<SentenceAudioUrlResponse>(
      `/situations/sentence/${sentenceId}/example-audio-url`,
      {
        params: { expires_minutes: expiresMinutes },
      }
    );
    return response.data;
  },

  // 刪除語句示範音訊
  deleteExampleAudio: async (sentenceId: string): Promise<SentenceAudioDeleteResponse> => {
    const response = await api.delete<SentenceAudioDeleteResponse>(
      `/situations/sentence/${sentenceId}/example-audio`
    );
    return response.data;
  },
};
