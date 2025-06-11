import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { UserWithProfileResponse } from '@/lib/therapist-api';

interface TherapistDetailsDialogProps {
  therapist: UserWithProfileResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TherapistDetailsDialog = ({ therapist, open, onOpenChange }: TherapistDetailsDialogProps) => {
  if (!therapist) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'therapist':
        return 'warning';
      case 'client':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理員';
      case 'therapist':
        return '語言治療師';
      case 'client':
        return '一般用戶';
      default:
        return role;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>治療師詳細資訊 - {therapist.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本用戶資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>姓名</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{therapist.name}</div>
                </div>
                <div>
                  <Label>性別</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{therapist.gender || '未設定'}</div>
                </div>
                <div>
                  <Label>年齡</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{therapist.age || '未設定'}</div>
                </div>
                <div>
                  <Label>電話</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{therapist.phone || '未設定'}</div>
                </div>
                <div>
                  <Label>角色</Label>
                  <div className="mt-1">
                    <Badge variant={getRoleBadgeVariant(therapist.role)}>
                      {getRoleDisplayName(therapist.role)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>用戶 ID</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{therapist.user_id}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>註冊時間</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{formatDate(therapist.created_at)}</div>
                </div>
                <div>
                  <Label>最後更新</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{formatDate(therapist.updated_at)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 治療師專業資訊 */}
          {therapist.therapist_profile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">治療師專業資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>執照號碼</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">{therapist.therapist_profile.license_number}</div>
                  </div>
                  <div>
                    <Label>專業領域</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">{therapist.therapist_profile.specialization || '未設定'}</div>
                  </div>
                  <div>
                    <Label>工作經驗</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">
                      {therapist.therapist_profile.years_experience ? `${therapist.therapist_profile.years_experience} 年` : '未設定'}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>學歷</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded">{therapist.therapist_profile.education || '未設定'}</div>
                </div>
                <div>
                  <Label>個人簡介</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded min-h-[80px]">
                    {therapist.therapist_profile.bio || '未設定'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>建立時間</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">{formatDate(therapist.therapist_profile.created_at)}</div>
                  </div>
                  <div>
                    <Label>最後更新</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded">{formatDate(therapist.therapist_profile.updated_at)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 沒有治療師檔案的提示 */}
          {!therapist.therapist_profile && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>此用戶尚未建立治療師專業檔案</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 操作按鈕 */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              關閉
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapistDetailsDialog;
