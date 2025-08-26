import { useState } from 'react';
import { sentencesApi, type AudioGenerationResponse } from '@/lib/sentences-api';
import { useToast } from '@/hooks/useToast';

export function useSentenceAudioGeneration() {
  const [generating, setGenerating] = useState(false);
  const { addToast } = useToast();

  const generateSentenceAudio = async (
    sentenceId: string,
    voice: string = 'female',
    onSuccess?: (response: AudioGenerationResponse) => void
  ) => {
    try {
      setGenerating(true);
      const response = await sentencesApi.generateExampleAudio(sentenceId, voice);
      
      addToast({
        title: '音訊生成成功',
        description: response.message,
        variant: 'success',
      });

      onSuccess?.(response);
      return response;
    } catch (error) {
      console.error('音訊生成失敗:', error);
      addToast({
        title: '音訊生成失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setGenerating(false);
    }
  };

  const generateChapterAudio = async (
    chapterId: string,
    voice: string = 'female',
    onSuccess?: (response: AudioGenerationResponse) => void
  ) => {
    try {
      setGenerating(true);
      const response = await sentencesApi.generateSentencesAudio(chapterId, voice);
      
      addToast({
        title: '批次音訊生成成功',
        description: response.message || `已生成 ${response.generated_count || 0} 個音訊檔案`,
        variant: 'success',
      });

      onSuccess?.(response);
      return response;
    } catch (error) {
      console.error('批次音訊生成失敗:', error);
      addToast({
        title: '批次音訊生成失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setGenerating(false);
    }
  };

  return {
    generating,
    generateSentenceAudio,
    generateChapterAudio,
  };
}