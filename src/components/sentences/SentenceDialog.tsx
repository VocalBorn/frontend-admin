import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SentenceResponse, SentenceCreate, SentenceUpdate, SpeakerRole } from "@/lib/sentences-api";

interface SentenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SentenceCreate | SentenceUpdate) => Promise<void>;
  sentence?: SentenceResponse;
  mode: "create" | "edit";
}

export function SentenceDialog({
  open,
  onOpenChange,
  onSubmit,
  sentence,
  mode,
}: SentenceDialogProps) {
  const [formData, setFormData] = useState<Partial<SentenceCreate & SentenceUpdate>>({
    sentence_name: "",
    speaker_role: "self",
    role_description: "",
    content: "",
    start_time: undefined,
    end_time: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && sentence) {
      setFormData({
        sentence_name: sentence.sentence_name,
        speaker_role: sentence.speaker_role,
        role_description: sentence.role_description || "",
        content: sentence.content,
        start_time: sentence.start_time || undefined,
        end_time: sentence.end_time || undefined,
      });
    } else {
      setFormData({
        sentence_name: "",
        speaker_role: "self",
        role_description: "",
        content: "",
        start_time: undefined,
        end_time: undefined,
      });
    }
  }, [mode, sentence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sentence_name?.trim() || !formData.content?.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData as SentenceCreate | SentenceUpdate);
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
            {mode === "create" ? "新增語句" : "編輯語句"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sentence_name">語句名稱 *</Label>
              <Input
                id="sentence_name"
                value={formData.sentence_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sentence_name: e.target.value })
                }
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="speaker_role">說話者角色 *</Label>
                <Select
                  value={formData.speaker_role}
                  onValueChange={(value: SpeakerRole) =>
                    setFormData({ ...formData, speaker_role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">自己</SelectItem>
                    <SelectItem value="other">對方</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role_description">角色描述</Label>
                <Input
                  id="role_description"
                  value={formData.role_description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, role_description: e.target.value })
                  }
                  placeholder="例：客人、服務員"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">語句內容 *</Label>
              <Textarea
                id="content"
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">開始時間 (秒)</Label>
                <Input
                  id="start_time"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.start_time || ""}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      start_time: e.target.value ? parseFloat(e.target.value) : undefined 
                    })
                  }
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="end_time">結束時間 (秒)</Label>
                <Input
                  id="end_time"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.end_time || ""}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      end_time: e.target.value ? parseFloat(e.target.value) : undefined 
                    })
                  }
                />
              </div>
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
