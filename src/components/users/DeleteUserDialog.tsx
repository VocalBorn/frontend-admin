import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import type { UserResponse } from '@/lib/api';

interface DeleteUserDialogProps {
  user: UserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string, password: string) => Promise<void>;
}

const DeleteUserDialog = ({ user, open, onOpenChange, onConfirm }: DeleteUserDialogProps) => {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !password.trim()) {
      setError('請輸入管理員密碼');
      return;
    }

    try {
      setIsDeleting(true);
      setError('');
      await onConfirm(user.user_id, password);
      onOpenChange(false);
      setPassword('');
    } catch (err) {
      console.error('刪除用戶失敗:', err);
      // 發生錯誤時直接關閉 dialog
      onOpenChange(false);
      setPassword('');
      setError('');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setPassword('');
    setError('');
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            刪除用戶帳號
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-red-800">
                <div className="font-semibold">警告：此操作無法復原！</div>
                <div className="mt-1">
                  您即將刪除用戶「{user.name}」的帳號，所有相關資料將被永久移除。
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">
                請輸入您的管理員密碼以確認此操作：
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="管理員密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isDeleting}
              >
                取消
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isDeleting || !password.trim()}
              >
                {isDeleting ? '刪除中...' : '確認刪除'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
