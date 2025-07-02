import AppLayout from "@/components/AppLayout";
import UserManagement from "@/components/users/UserManagement";

const UsersPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">使用者管理</h1>
          <p className="text-muted-foreground">管理系統使用者和角色權限</p>
        </div>
        <UserManagement />
      </div>
    </AppLayout>
  );
};

export default UsersPage;
