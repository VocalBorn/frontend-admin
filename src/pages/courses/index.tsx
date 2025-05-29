import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const CoursesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>課程管理</CardTitle>
          </CardHeader>
          <CardContent>
            <p>管理所有課程內容</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursesPage;
