import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUsers } from '@/hooks/useUsers';
import UserDetailsDialog from './UserDetailsDialog';
import DeleteUserDialog from './DeleteUserDialog';
import type { UserResponse, UserRole } from '@/lib/api';

const UserManagement = () => {
  const { users, stats, loading, updateUserRole, deleteUser } = useUsers();
  
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);

  const getRoleBadgeVariant = (role: UserRole | string) => {
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

  const getRoleDisplayName = (role: UserRole | string) => {
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

  const handleViewUserDetails = (user: UserResponse) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleCloseUserDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
  };


  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.user_id === userId);
    if (user) {
      setUserToDelete(user);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async (userId: string, password: string) => {
    try {
      await deleteUser(userId, password);
      setShowDeleteDialog(false);
      setUserToDelete(null);
      // 如果刪除的是當前查看的用戶，關閉詳情對話框
      if (selectedUser?.user_id === userId) {
        handleCloseUserDetails();
      }
    } catch (error) {
      // 刪除失敗時也關閉相關的對話框
      setShowDeleteDialog(false);
      setUserToDelete(null);
      if (selectedUser?.user_id === userId) {
        handleCloseUserDetails();
      }
      // 重新拋出錯誤讓 DeleteUserDialog 處理
      throw error;
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setUserToDelete(null);
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">姓名</TableHead>
                      <TableHead className="min-w-[60px] hidden sm:table-cell">性別</TableHead>
                      <TableHead className="min-w-[60px] hidden md:table-cell">年齡</TableHead>
                      <TableHead className="min-w-[120px] hidden lg:table-cell">電話</TableHead>
                      <TableHead className="min-w-[100px]">角色</TableHead>
                      <TableHead className="min-w-[200px] hidden xl:table-cell">Email</TableHead>
                      <TableHead className="min-w-[140px] hidden xl:table-cell">註冊時間</TableHead>
                      <TableHead className="min-w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: UserResponse) => (
                      <TableRow key={user.user_id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{user.gender || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.age || '-'}</TableCell>
                        <TableCell className="hidden lg:table-cell">{user.phone || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)} className="whitespace-nowrap">
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">{user.email}</TableCell>
                        <TableCell className="hidden xl:table-cell">{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewUserDetails(user)}
                            disabled={updatingUserId === user.user_id}
                          >
                            管理
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
        onDeleteUser={handleDeleteUser}
      />

      {/* 刪除用戶確認對話框 */}
      <DeleteUserDialog
        user={userToDelete}
        open={showDeleteDialog}
        onOpenChange={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};

export default UserManagement;
