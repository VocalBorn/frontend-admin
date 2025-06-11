import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ChapterResponse, ChapterCreate, ChapterUpdate } from "@/lib/chapters-api";

interface ChapterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ChapterCreate | ChapterUpdate) => Promise<void>;
  chapter?: ChapterResponse;
  mode: "create" | "edit";
  maxSequenceNumber: number;
}

export function ChapterDialog({
  open,
  onOpenChange,
  onSubmit,
  chapter,
  mode,
  maxSequenceNumber,
}: ChapterDialogProps) {
  const [formData, setFormData] = useState<Partial<ChapterCreate & ChapterUpdate>>({
    chapter_name: "",
    description: "",
    sequence_number: maxSequenceNumber + 1,
    video_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && chapter) {
      setFormData({
        chapter_name: chapter.chapter_name,
        description: chapter.description || "",
        sequence_number: chapter.sequence_number,
        video_url: chapter.video_url || "",
      });
    } else {
      setFormData({
        chapter_name: "",
        description: "",
        sequence_number: maxSequenceNumber + 1,
        video_url: "",
      });
    }
  }, [mode, chapter, maxSequenceNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chapter_name?.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData as ChapterCreate | ChapterUpdate);
      onOpenChange(false);
    } catch (error) {
      console.error("提交失敗:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "新增章節" : "編輯章節"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="chapter_name">章節名稱 *</Label>
              <Input
                id="chapter_name"
                value={formData.chapter_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, chapter_name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sequence_number">順序</Label>
              <Input
                id="sequence_number"
                type="number"
                min="1"
                value={formData.sequence_number || 1}
                onChange={(e) =>
                  setFormData({ ...formData, sequence_number: parseInt(e.target.value) })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video_url">影片 URL</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, video_url: e.target.value })
                }
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "處理中..." : mode === "create" ? "新增" : "更新"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
