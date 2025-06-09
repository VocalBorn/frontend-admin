import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { SituationCreate, SituationResponse, SituationUpdate } from "@/lib/api";

interface SituationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SituationCreate | SituationUpdate) => Promise<void>;
  situation?: SituationResponse;
  mode: "create" | "edit";
}

export function SituationDialog({
  open,
  onOpenChange,
  onSubmit,
  situation,
  mode,
}: SituationDialogProps) {
  const [formData, setFormData] = useState<SituationCreate | SituationUpdate>({
    situation_name: "",
    description: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({
        situation_name: situation?.situation_name || "",
        description: situation?.description || "",
        location: situation?.location || "",
      });
    }
  }, [open, situation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "新增情境" : "編輯情境"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="situation_name">情境名稱</Label>
              <Input
                id="situation_name"
                value={formData.situation_name}
                onChange={(e) =>
                  setFormData({ ...formData, situation_name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">描述</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">地點</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "處理中..." : mode === "create" ? "新增" : "更新"}
          </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
