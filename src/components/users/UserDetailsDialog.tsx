import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserResponse } from '@/lib/api';

interface UserDetailsDialogProps {
  user: UserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange?: (userId: string, role: 'admin' | 'therapist' | 'client') => void;
  onDeleteUser?: (userId: string) => void;
}

const UserDetailsDialog = ({ user, open, onOpenChange, onRoleChange, onDeleteUser }: UserDetailsDialogProps) => {
  if (!user) return null;

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>用戶詳情</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* 基本資訊 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">姓名</label>
                  <div className="text-base font-medium">{user.name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">角色</label>
                  <div>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">性別</label>
                  <div className="text-base">{user.gender || '未設定'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">年齡</label>
                  <div className="text-base">{user.age ? `${user.age} 歲` : '未設定'}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">電話</label>
                  <div className="text-base">{user.phone || '未設定'}</div>
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
                    {user.user_id}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">帳戶 ID</label>
                  <div className="font-mono text-xs bg-muted p-2 rounded">
                    {user.account_id}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">註冊時間</label>
                    <div className="text-sm">{formatDate(user.created_at)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">最後更新</label>
                    <div className="text-sm">{formatDate(user.updated_at)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 角色管理 */}
          {onRoleChange && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">角色管理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    變更此用戶的角色權限
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {user.role !== 'client' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRoleChange(user.user_id, 'client')}
                      >
                        設為一般用戶
                      </Button>
                    )}
                    {user.role !== 'therapist' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRoleChange(user.user_id, 'therapist')}
                      >
                        設為語言治療師
                      </Button>
                    )}
                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRoleChange(user.user_id, 'admin')}
                      >
                        設為管理員
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 危險操作區域 */}
          {onDeleteUser && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600">危險操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    刪除此用戶帳號將無法復原，請謹慎操作
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteUser(user.user_id)}
                  >
                    刪除用戶帳號
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
