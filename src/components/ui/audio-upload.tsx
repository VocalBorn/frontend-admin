import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Volume2, Sparkles, Play, Pause, Trash2 } from 'lucide-react';
import { sentencesApi } from '@/lib/sentences-api';
import type { SentenceAudioUploadResponse } from '@/lib/sentences-api';
import { useToast } from '@/hooks/useToast';
import { useSentenceAudioGeneration } from '@/hooks/useSentenceAudioGeneration';

interface AudioUploadProps {
  sentenceId?: string;
  currentAudio?: {
    path: string | null;
    duration: number | null;
    size: number | null;
    contentType: string | null;
  };
  onUploadSuccess?: (response: SentenceAudioUploadResponse) => void;
  disabled?: boolean;
}

export function AudioUpload({
  sentenceId,
  currentAudio,
  onUploadSuccess,
  disabled = false,
}: AudioUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { addToast } = useToast();
  const { generating, generateSentenceAudio } = useSentenceAudioGeneration();

  const supportedFormats = ['mp3', 'wav', 'm4a', 'ogg', 'webm', 'flac', 'aac'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '未知';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 檢查檔案類型
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !supportedFormats.includes(extension)) {
      addToast({
        title: '不支援的檔案格式',
        description: `請選擇以下格式的音訊檔案：${supportedFormats.join(', ').toUpperCase()}`,
        variant: 'destructive',
      });
      return;
    }

    // 檢查檔案大小
    if (file.size > maxFileSize) {
      addToast({
        title: '檔案過大',
        description: '檔案大小不能超過 50MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !sentenceId) return;

    try {
      setUploading(true);
      const response = await sentencesApi.uploadExampleAudio(sentenceId, selectedFile);
      
      addToast({
        title: '上傳成功',
        description: response.message,
        variant: 'success',
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadSuccess?.(response);
    } catch (error) {
      console.error('上傳失敗:', error);
      addToast({
        title: '上傳失敗',
        description: '請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };


  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerateAudio = async () => {
    if (!sentenceId) return;
    
    try {
      await generateSentenceAudio(sentenceId, 'female', () => {
        // 音訊生成成功後，觸發上傳成功回調來重新載入語句資料
        onUploadSuccess?.({
          sentence_id: sentenceId,
          audio_path: 'generated',
          audio_duration: null,
          file_size: 0,
          content_type: 'audio/wav',
          message: '音訊已自動生成'
        });
      });
    } catch (error) {
      // 錯誤處理已在 hook 中處理
    }
  };

  const handlePlayAudio = async () => {
    if (!sentenceId || !currentAudio?.path) return;

    if (isPlaying) {
      // 如果正在播放，暫停音訊
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsLoadingUrl(true);
      const response = await sentencesApi.getExampleAudioUrl(sentenceId, 15);
      
      if (response.status === 'success' && response.url) {
        // 設定音訊URL並播放
        if (audioRef.current) {
          audioRef.current.src = response.url;
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        addToast({
          title: '無法播放音訊',
          description: response.message || '音訊檔案不存在',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('播放音訊失敗:', error);
      addToast({
        title: '播放失敗',
        description: '無法載入音訊檔案，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleDeleteAudio = async () => {
    if (!sentenceId || !currentAudio?.path) return;

    // 確認刪除
    if (!confirm('確定要刪除這個示範音訊嗎？此操作無法復原。')) {
      return;
    }

    try {
      setIsDeleting(true);
      // 停止播放音訊（如果正在播放）
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }

      const response = await sentencesApi.deleteExampleAudio(sentenceId);
      
      addToast({
        title: '刪除成功',
        description: response.message || '示範音訊已刪除',
        variant: 'success',
      });

      // 觸發上傳成功回調來重新載入語句資料
      onUploadSuccess?.({
        sentence_id: sentenceId,
        audio_path: '',
        audio_duration: null,
        file_size: 0,
        content_type: '',
        message: '音訊已刪除'
      });
    } catch (error) {
      console.error('刪除音訊失敗:', error);
      addToast({
        title: '刪除失敗',
        description: '無法刪除音訊檔案，請稍後再試',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">示範音訊</Label>
        {/* 自動生成按鈕 */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGenerateAudio}
          disabled={disabled || !sentenceId || generating || uploading}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? '生成中...' : '自動生成'}
        </Button>
      </div>
      
      {/* 現有音訊顯示 */}
      {currentAudio?.path && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">目前有示範音訊</p>
                  <p className="text-xs text-green-600">
                    時長：{formatDuration(currentAudio.duration)} | 
                    大小：{currentAudio.size ? formatFileSize(currentAudio.size) : '未知'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* 播放按鈕 */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePlayAudio}
                  disabled={disabled || isLoadingUrl || isDeleting}
                >
                  {isLoadingUrl ? (
                    <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                {/* 刪除按鈕 */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAudio}
                  disabled={disabled || isLoadingUrl || isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 檔案上傳區域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Volume2 className="w-6 h-6 text-blue-600" />
              <span className="font-medium">{selectedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFile}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              大小：{formatFileSize(selectedFile.size)}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading || disabled}
                size="sm"
              >
                {uploading ? '上傳中...' : '上傳音訊'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearFile}
                disabled={uploading || disabled}
                size="sm"
              >
                取消
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm font-medium">
                拖放音訊檔案到此處，或
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-medium text-blue-600"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                >
                  點擊選擇
                </Button>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                支援格式：{supportedFormats.map(f => f.toUpperCase()).join(', ')}
              </p>
              <p className="text-xs text-gray-500">
                最大檔案大小：50MB
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={supportedFormats.map(f => `.${f}`).join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* 音訊播放元素 */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          addToast({
            title: '播放錯誤',
            description: '音訊檔案可能已損壞或無法播放',
            variant: 'destructive',
          });
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}