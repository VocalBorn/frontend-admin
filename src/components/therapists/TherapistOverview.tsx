import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTherapists } from '@/hooks/useTherapists';
import TherapistDetailsDialog from './TherapistDetailsDialog';
import type { UserWithProfileResponse } from '@/lib/therapist-api';

const TherapistOverview = () => {
  const { therapists, loading } = useTherapists();
  const [selectedTherapist, setSelectedTherapist] = useState<UserWithProfileResponse | null>(null);
  const [showTherapistDetails, setShowTherapistDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'with_profile' | 'without_profile'>('all');

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

  // 過濾治療師
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (therapist.therapist_profile?.specialization?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'with_profile' && therapist.therapist_profile) ||
                         (statusFilter === 'without_profile' && !therapist.therapist_profile);
    
    return matchesSearch && matchesStatus;
  });

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-2xl font-bold text-green-600">
              {therapists.filter(t => t.therapist_profile).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">未建立檔案</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {therapists.filter(t => !t.therapist_profile).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">建檔完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {therapists.length > 0 ? Math.round((therapists.filter(t => t.therapist_profile).length / therapists.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜尋和篩選 */}
      <Card>
        <CardHeader>
          <CardTitle>治療師搜尋與篩選</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜尋治療師姓名或專業領域..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={(value: 'all' | 'with_profile' | 'without_profile') => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="篩選狀態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="with_profile">已建立檔案</SelectItem>
                  <SelectItem value="without_profile">未建立檔案</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            顯示 {filteredTherapists.length} / {therapists.length} 位治療師
          </div>
        </CardContent>
      </Card>

      {/* 治療師列表 */}
      <Card>
        <CardHeader>
          <CardTitle>治療師列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">姓名</TableHead>
                  <TableHead className="min-w-[60px] hidden sm:table-cell">性別</TableHead>
                  <TableHead className="min-w-[60px] hidden md:table-cell">年齡</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">電話</TableHead>
                  <TableHead className="min-w-[120px] hidden xl:table-cell">專業領域</TableHead>
                  <TableHead className="min-w-[120px] hidden 2xl:table-cell">執照號碼</TableHead>
                  <TableHead className="min-w-[100px]">檔案狀態</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">註冊時間</TableHead>
                  <TableHead className="min-w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTherapists.map((therapist: UserWithProfileResponse) => (
                  <TableRow key={therapist.user_id}>
                    <TableCell className="font-medium">{therapist.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{therapist.gender || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{therapist.age || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{therapist.phone || '-'}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {therapist.therapist_profile?.specialization || '-'}
                    </TableCell>
                    <TableCell className="hidden 2xl:table-cell">
                      {therapist.therapist_profile?.license_number || '-'}
                    </TableCell>
                    <TableCell>
                      {getProfileStatusBadge(therapist)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(therapist.created_at)}</TableCell>
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
          </div>
          {filteredTherapists.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? '沒有符合條件的治療師' : '沒有找到治療師資料'}
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

export default TherapistOverview;