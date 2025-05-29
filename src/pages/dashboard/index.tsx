import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
      <Card>
        <CardHeader>
          <CardTitle>系統管理員儀表板</CardTitle>
        </CardHeader>
        <CardContent>
          <p>歡迎使用管理系統</p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
