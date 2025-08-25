import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";

const DashboardPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">系統管理員儀表板</h1>
          <p className="text-muted-foreground">歡迎使用 VocalBorn 後台管理系統</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>總覽</CardTitle>
            </CardHeader>
            <CardContent>
              <p>歡迎使用管理系統</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
