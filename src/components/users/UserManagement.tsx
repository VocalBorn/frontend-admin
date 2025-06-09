import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUsers } from '@/hooks/useUsers';
import UserDetailsDialog from './UserDetailsDialog';
import type { UserResponse, UserRole } from '@/lib/api';

const UserManagement = () => {
  const { users, stats, loading, error, updateUserRole, promoteToTherapist, promoteToAdmin, demoteToClient } = useUsers();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const getRoleBadgeVariant = (role: UserRole) => {
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

  const getRoleDisplayName = (role: UserRole) => {
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

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingUserId(userId);
      await updateUserRole(userId, newRole);
    } catch (error) {
      console.error('更新角色失敗:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handlePromoteToTherapist = async (userId: string) => {
    try {
      setUpdatingUserId(userId);
      await promoteToTherapist(userId);
    } catch (error) {
      console.error('提升為語言治療師失敗:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      setUpdatingUserId(userId);
      await promoteToAdmin(userId);
    } catch (error) {
      console.error('提升為管理員失敗:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDemoteToClient = async (userId: string) => {
    try {
      setUpdatingUserId(userId);
      await demoteToClient(userId);
    } catch (error) {
      console.error('降級為一般用戶失敗:', error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleViewUserDetails = (user: UserResponse) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };

  const handleRoleChangeFromDialog = async (userId: string, newRole: UserRole) => {
    await handleRoleChange(userId, newRole);
    handleCloseUserDetails();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">錯誤: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">總用戶數</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">一般用戶</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">語言治療師</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.therapists}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">管理員</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 用戶列表 */}
      <Card>
        <CardHeader>
          <CardTitle>用戶列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>性別</TableHead>
                <TableHead>年齡</TableHead>
                <TableHead>電話</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>註冊時間</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: UserResponse) => (
                <TableRow key={user.user_id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.gender || '-'}</TableCell>
                  <TableCell>{user.age || '-'}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={updatingUserId === user.user_id}
                        >
                          {updatingUserId === user.user_id ? '更新中...' : '管理'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                          查看詳情
                        </DropdownMenuItem>
                        {user.role !== 'admin' && (
                          <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.user_id)}>
                            提升為管理員
                          </DropdownMenuItem>
                        )}
                        {user.role !== 'therapist' && (
                          <DropdownMenuItem onClick={() => handlePromoteToTherapist(user.user_id)}>
                            提升為語言治療師
                          </DropdownMenuItem>
                        )}
                        {user.role !== 'client' && (
                          <DropdownMenuItem onClick={() => handleDemoteToClient(user.user_id)}>
                            降級為一般用戶
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, 'admin')}>
                          設為管理員
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, 'therapist')}>
                          設為語言治療師
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.user_id, 'client')}>
                          設為一般用戶
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              沒有找到用戶資料
            </div>
          )}
        </CardContent>
      </Card>

      {/* 用戶詳情對話框 */}
      <UserDetailsDialog
        user={selectedUser}
        open={showUserDetails}
        onOpenChange={handleCloseUserDetails}
        onRoleChange={handleRoleChangeFromDialog}
      />
    </div>
  );
};

export default UserManagement;
