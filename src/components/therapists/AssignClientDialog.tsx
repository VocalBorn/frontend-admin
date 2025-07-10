import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usersApi, type UserResponse } from '@/lib/users-api';
import { useTherapistClients } from '@/hooks/useTherapists';
import { getErrorMessage } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { UserWithProfileResponse } from '@/lib/therapist-api';

interface AssignClientDialogProps {
  therapist: UserWithProfileResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AssignClientDialog = ({ therapist, open, onOpenChange, onSuccess }: AssignClientDialogProps) => {
  const [clients, setClients] = useState<UserResponse[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { assignClient } = useTherapistClients();
  const { showError } = useToast();

  // 載入一般用戶列表
  useEffect(() => {
    if (!open) return;

    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsData = await usersApi.clients();
        setClients(clientsData);
      } catch (error) {
        showError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [open, showError]);

  // 重置表單
  useEffect(() => {
    if (!open) {
      setSelectedClientId('');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!therapist || !selectedClientId) return;

    try {
      setSubmitting(true);
      await assignClient(therapist.user_id, { client_id: selectedClientId });
      onSuccess?.();
      onOpenChange(false);
    } catch {
      // 錯誤已在 hook 中處理
    } finally {
      setSubmitting(false);
    }
  };

  const selectedClient = clients.find(client => client.user_id === selectedClientId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>指派客戶給治療師</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 治療師資訊 */}
          {therapist && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{therapist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {therapist.therapist_profile?.specialization || '未設定專業領域'}
                    </p>
                  </div>
                  <Badge variant="warning">治療師</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 客戶選擇 */}
          <div className="space-y-2">
            <Label htmlFor="client-select">選擇客戶</Label>
            {loading ? (
              <div className="p-2 text-center text-muted-foreground">載入客戶列表中...</div>
            ) : (
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger id="client-select">
                  <SelectValue placeholder="請選擇要指派的客戶" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.user_id} value={client.user_id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{client.name}</span>
                        <div className="flex items-center gap-2 ml-2">
                          {client.gender && (
                            <span className="text-xs text-muted-foreground">{client.gender}</span>
                          )}
                          {client.age && (
                            <span className="text-xs text-muted-foreground">{client.age}歲</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* 選中客戶的詳細資訊 */}
          {selectedClient && (
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{selectedClient.name}</h4>
                    <Badge variant="secondary">一般用戶</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {selectedClient.gender && <p>性別：{selectedClient.gender}</p>}
                    {selectedClient.age && <p>年齡：{selectedClient.age}歲</p>}
                    {selectedClient.phone && <p>電話：{selectedClient.phone}</p>}
                    <p>Email：{selectedClient.email}</p>
                    <p>註冊時間：{new Date(selectedClient.created_at).toLocaleDateString('zh-TW')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 操作按鈕 */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              取消
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedClientId || submitting || loading}
            >
              {submitting ? '指派中...' : '確認指派'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignClientDialog;