import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle>個人資料設定</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div>
                <p>
                  <strong>姓名：</strong>
                  {profile.name}
                </p>
                <p>
                  <strong>電子郵件：</strong>
                  {profile.email}
                </p>
                <p>
                  <strong>帳號建立時間：</strong>
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p>載入中...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
