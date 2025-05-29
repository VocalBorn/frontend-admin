import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const UsersPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>使用者管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p>管理系統使用者</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;
