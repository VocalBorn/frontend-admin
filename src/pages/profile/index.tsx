import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>個人資料設定</CardTitle>
          </CardHeader>
          <CardContent>
            <p>修改您的個人資料和帳號設定</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
