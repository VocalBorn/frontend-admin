import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserWithProfileResponse } from '@/lib/therapist-api';

interface TherapistDetailsDialogProps {
  therapist: UserWithProfileResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TherapistDetailsDialog = ({ therapist, open, onOpenChange }: TherapistDetailsDialogProps) => {
  if (!therapist) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>治療師詳情</DialogTitle>
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
                  <label className="text-sm font-medium text-muted-foreground">姓名</label>
                  <div className="text-base font-medium">{therapist.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">角色</label>
                  <div>
                    <Badge variant={getRoleBadgeVariant(therapist.role)}>
                      {getRoleDisplayName(therapist.role)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">性別</label>
                  <div className="text-base">{therapist.gender || '未設定'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">年齡</label>
                  <div className="text-base">{therapist.age ? `${therapist.age} 歲` : '未設定'}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">電話</label>
                  <div className="text-base">{therapist.phone || '未設定'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 系統資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">系統資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">用戶 ID</label>
                  <div className="font-mono text-xs bg-muted p-2 rounded">
                    {therapist.user_id}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">註冊時間</label>
                    <div className="text-sm">{formatDate(therapist.created_at)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">最後更新</label>
                    <div className="text-sm">{formatDate(therapist.updated_at)}</div>
                  </div>
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
                    <label className="text-sm font-medium text-muted-foreground">執照號碼</label>
                    <div className="text-base">{therapist.therapist_profile.license_number}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">專業領域</label>
                    <div className="text-base">{therapist.therapist_profile.specialization || '未設定'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">工作經驗</label>
                    <div className="text-base">
                      {therapist.therapist_profile.years_experience ? `${therapist.therapist_profile.years_experience} 年` : '未設定'}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">學歷</label>
                    <div className="text-base">{therapist.therapist_profile.education || '未設定'}</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">個人簡介</label>
                  <div className="text-base mt-1 min-h-[80px]">
                    {therapist.therapist_profile.bio || '未設定'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">建立時間</label>
                    <div className="text-sm">{formatDate(therapist.therapist_profile.created_at)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">最後更新</label>
                    <div className="text-sm">{formatDate(therapist.therapist_profile.updated_at)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 沒有治療師檔案的提示 */}
          {!therapist.therapist_profile && (
            <Card>
              <CardContent className="pt-1">
                <div className="text-center text-muted-foreground">
                  <p>此用戶尚未建立治療師專業檔案</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapistDetailsDialog;
