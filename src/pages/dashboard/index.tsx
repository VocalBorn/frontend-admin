import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>系統管理員儀表板</CardTitle>
        </CardHeader>
        <CardContent>
          <p>歡迎使用管理系統</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
