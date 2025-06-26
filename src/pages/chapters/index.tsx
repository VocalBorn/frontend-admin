import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { ChapterDialog } from "@/components/chapters/ChapterDialog";
import { SentenceDialog } from "@/components/sentences/SentenceDialog";
import { ArrowLeft, Plus, Edit, Trash2, PlayCircle, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChapters } from "@/hooks/useChapters";
import { useSentences } from "@/hooks/useSentences";
import { situationsApi } from "@/lib/situations-api";
import type { SituationResponse } from "@/lib/situations-api";
import type { ChapterResponse, ChapterCreate, ChapterUpdate } from "@/lib/chapters-api";
import type { SentenceResponse, SentenceCreate, SentenceUpdate } from "@/lib/sentences-api";

const ChapterManagementPage = () => {
  const { situationId } = useParams<{ situationId: string }>();
  const navigate = useNavigate();
  const [situation, setSituation] = useState<SituationResponse | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterResponse | null>(null);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [sentenceDialogOpen, setSentenceDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<ChapterResponse | undefined>();
  const [editingSentence, setEditingSentence] = useState<SentenceResponse | undefined>();

  const {
    chapters,
    isLoading: chaptersLoading,
    loadChapters,
    createChapter,
    updateChapter,
    deleteChapter,
  } = useChapters(situationId);

  const {
    sentences,
    isLoading: sentencesLoading,
    loadSentences,
    createSentence,
    updateSentence,
    deleteSentence,
  } = useSentences(selectedChapter?.chapter_id);

  useEffect(() => {
    if (situationId) {
      loadChapters();
      // 載入情境資訊
      situationsApi.get(situationId).then(setSituation).catch(console.error);
    }
  }, [situationId, loadChapters]);

  useEffect(() => {
    if (selectedChapter) {
      loadSentences(selectedChapter.chapter_id);
    }
  }, [selectedChapter, loadSentences]);

  const handleChapterSubmit = async (data: ChapterCreate | ChapterUpdate) => {
    if (editingChapter) {
      await updateChapter(editingChapter.chapter_id, data as ChapterUpdate);
      setEditingChapter(undefined);
    } else {
      await createChapter(data as ChapterCreate);
    }
    setChapterDialogOpen(false);
  };

  const handleChapterEdit = (chapter: ChapterResponse) => {
    setEditingChapter(chapter);
    setChapterDialogOpen(true);
  };

  const handleChapterDelete = async (chapterId: string) => {
    if (!window.confirm("確定要刪除此章節嗎？這將會同時刪除所有相關的語句。")) return;
    await deleteChapter(chapterId);
    if (selectedChapter?.chapter_id === chapterId) {
      setSelectedChapter(null);
    }
  };

  const handleSentenceSubmit = async (data: SentenceCreate | SentenceUpdate) => {
    if (editingSentence) {
      await updateSentence(editingSentence.sentence_id, data as SentenceUpdate);
      setEditingSentence(undefined);
    } else {
      await createSentence(data as SentenceCreate);
    }
    setSentenceDialogOpen(false);
  };

  const handleSentenceEdit = (sentence: SentenceResponse) => {
    setEditingSentence(sentence);
    setSentenceDialogOpen(true);
  };

  const handleSentenceDelete = async (sentenceId: string) => {
    if (!window.confirm("確定要刪除此語句嗎？")) return;
    await deleteSentence(sentenceId);
  };

  const maxSequenceNumber = Math.max(0, ...chapters.map(c => c.sequence_number));

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return `${minutes}:${remainingSeconds.padStart(4, '0')}`;
  };

  const getSpeakerRoleDisplay = (role: string) => {
    return role === 'self' ? '自己' : '對方';
  };

  if (!situationId) {
    return <div>情境 ID 不存在</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
        {/* 頁面標題 */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/courses")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回課程列表
          </Button>
          <div>
            <h1 className="text-3xl font-bold">章節管理</h1>
            {situation && (
              <p className="text-muted-foreground mt-1">
                情境：{situation.situation_name}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 章節列表 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>章節列表</CardTitle>
              <Button
                onClick={() => setChapterDialogOpen(true)}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                新增章節
              </Button>
            </CardHeader>
            <CardContent>
              {chaptersLoading ? (
                <div>載入中...</div>
              ) : (
                <div className="space-y-3">
                  {chapters.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      尚未建立任何章節
                    </p>
                  ) : (
                    chapters
                      .sort((a, b) => a.sequence_number - b.sequence_number)
                      .map((chapter) => (
                        <div
                          key={chapter.chapter_id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedChapter?.chapter_id === chapter.chapter_id
                              ? "border-blue-500 bg-blue-50"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedChapter(chapter)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  第 {chapter.sequence_number} 章
                                </Badge>
                                <h3 className="font-medium">
                                  {chapter.chapter_name}
                                </h3>
                              </div>
                              {chapter.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {chapter.description}
                                </p>
                              )}
                              {chapter.video_url && (
                                <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                                  <PlayCircle className="w-4 h-4" />
                                  <span>包含影片</span>
                                </div>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChapterEdit(chapter);
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  編輯
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChapterDelete(chapter.chapter_id);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  刪除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 語句列表 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  語句列表
                </div>
              </CardTitle>
              {selectedChapter && (
                <Button
                  onClick={() => setSentenceDialogOpen(true)}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增語句
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!selectedChapter ? (
                <p className="text-muted-foreground text-center py-8">
                  請先選擇一個章節
                </p>
              ) : sentencesLoading ? (
                <div>載入中...</div>
              ) : (
                <div className="space-y-3">
                  {sentences.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      此章節尚未建立任何語句
                    </p>
                  ) : (
                    sentences.map((sentence) => (
                      <div
                        key={sentence.sentence_id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  sentence.speaker_role === "self"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {getSpeakerRoleDisplay(sentence.speaker_role)}
                              </Badge>
                              <span className="font-medium">
                                {sentence.sentence_name}
                              </span>
                              {sentence.role_description && (
                                <span className="text-sm text-gray-500">
                                  ({sentence.role_description})
                                </span>
                              )}
                            </div>
                            <p className="text-sm mb-2">{sentence.content}</p>
                            {(sentence.start_time || sentence.end_time) && (
                              <div className="text-xs text-gray-500">
                                時間：{formatTime(sentence.start_time)} - {formatTime(sentence.end_time)}
                              </div>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleSentenceEdit(sentence)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                編輯
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSentenceDelete(sentence.sentence_id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                刪除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 章節對話框 */}
        <ChapterDialog
          open={chapterDialogOpen}
          onOpenChange={(open) => {
            setChapterDialogOpen(open);
            if (!open) setEditingChapter(undefined);
          }}
          onSubmit={handleChapterSubmit}
          chapter={editingChapter}
          mode={editingChapter ? "edit" : "create"}
          maxSequenceNumber={maxSequenceNumber}
        />

        {/* 語句對話框 */}
        <SentenceDialog
          open={sentenceDialogOpen}
          onOpenChange={(open) => {
            setSentenceDialogOpen(open);
            if (!open) setEditingSentence(undefined);
          }}
          onSubmit={handleSentenceSubmit}
          sentence={editingSentence}
          mode={editingSentence ? "edit" : "create"}
        />
      </div>
    </div>
  );
};

export default ChapterManagementPage;
