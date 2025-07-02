import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { usersApi } from "@/lib/users-api";
import type { UserResponse } from "@/lib/users-api";

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserResponse | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await usersApi.getUserProfileDetails();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">個人資料設定</h1>
          <p className="text-muted-foreground">管理您的個人資料和帳戶設定</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>個人資料</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">姓名</label>
                  <p className="text-sm text-muted-foreground">{profile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">電子郵件</label>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">帳號建立時間</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p>載入中...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
