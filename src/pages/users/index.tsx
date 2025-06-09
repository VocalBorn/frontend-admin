import Navbar from "@/components/Navbar";
import UserManagement from "@/components/users/UserManagement";

const UsersPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">使用者管理</h1>
          <p className="text-muted-foreground mt-2">管理系統使用者和角色權限</p>
        </div>
        <UserManagement />
      </div>
    </div>
  );
};

export default UsersPage;
