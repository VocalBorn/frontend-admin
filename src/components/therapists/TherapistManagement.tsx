import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTherapists } from '@/hooks/useTherapists';
import TherapistDetailsDialog from './TherapistDetailsDialog';
import type { UserWithProfileResponse } from '@/lib/therapist-api';

const TherapistManagement = () => {
  const { therapists, loading } = useTherapists();
  const [selectedTherapist, setSelectedTherapist] = useState<UserWithProfileResponse | null>(null);
  const [showTherapistDetails, setShowTherapistDetails] = useState(false);

  const handleViewTherapistDetails = (therapist: UserWithProfileResponse) => {
    setSelectedTherapist(therapist);
    setShowTherapistDetails(true);
  };

  const handleCloseTherapistDetails = () => {
    setShowTherapistDetails(false);
    setSelectedTherapist(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getProfileStatusBadge = (therapist: UserWithProfileResponse) => {
    if (therapist.therapist_profile) {
      return <Badge variant="default">已建立檔案</Badge>;
    }
    return <Badge variant="secondary">未建立檔案</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 統計資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">總治療師數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{therapists.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已建立檔案</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {therapists.filter(t => t.therapist_profile).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">未建立檔案</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {therapists.filter(t => !t.therapist_profile).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 治療師列表 */}
      <Card>
        <CardHeader>
          <CardTitle>治療師列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>性別</TableHead>
                <TableHead>年齡</TableHead>
                <TableHead>電話</TableHead>
                <TableHead>專業領域</TableHead>
                <TableHead>執照號碼</TableHead>
                <TableHead>檔案狀態</TableHead>
                <TableHead>註冊時間</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {therapists.map((therapist: UserWithProfileResponse) => (
                <TableRow key={therapist.user_id}>
                  <TableCell className="font-medium">{therapist.name}</TableCell>
                  <TableCell>{therapist.gender || '-'}</TableCell>
                  <TableCell>{therapist.age || '-'}</TableCell>
                  <TableCell>{therapist.phone || '-'}</TableCell>
                  <TableCell>
                    {therapist.therapist_profile?.specialization || '-'}
                  </TableCell>
                  <TableCell>
                    {therapist.therapist_profile?.license_number || '-'}
                  </TableCell>
                  <TableCell>
                    {getProfileStatusBadge(therapist)}
                  </TableCell>
                  <TableCell>{formatDate(therapist.created_at)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTherapistDetails(therapist)}
                    >
                      查看詳情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {therapists.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              沒有找到治療師資料
            </div>
          )}
        </CardContent>
      </Card>

      {/* 治療師詳情對話框 */}
      <TherapistDetailsDialog
        therapist={selectedTherapist}
        open={showTherapistDetails}
        onOpenChange={handleCloseTherapistDetails}
      />
    </div>
  );
};

export default TherapistManagement;
