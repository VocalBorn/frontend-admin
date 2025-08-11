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

const ProfileManagement = () => {
  const { therapists, loading } = useTherapists();
  const [selectedTherapist, setSelectedTherapist] = useState<UserWithProfileResponse | null>(null);
  const [showTherapistDetails, setShowTherapistDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');

  const handleViewTherapistDetails = (therapist: UserWithProfileResponse) => {
    setSelectedTherapist(therapist);
    setShowTherapistDetails(true);
  };

  const handleCloseTherapistDetails = () => {
    setShowTherapistDetails(false);
    setSelectedTherapist(null);
  };

  const handleRefresh = () => {
    // 這裡應該重新獲取資料，暫時用 reload
    window.location.reload();
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

  // 獲取所有專業領域
  const getSpecializations = () => {
    const specializations = new Set<string>();
    therapists.forEach(therapist => {
      if (therapist.therapist_profile?.specialization) {
        specializations.add(therapist.therapist_profile.specialization);
      }
    });
    return Array.from(specializations);
  };

  // 過濾治療師（只顯示已建立檔案的）
  const filteredTherapists = therapists.filter(therapist => {
    if (!therapist.therapist_profile) return false; // 只顯示已建立檔案的
    
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (therapist.therapist_profile?.specialization?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (therapist.therapist_profile?.license_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = specializationFilter === 'all' || 
                                 therapist.therapist_profile?.specialization === specializationFilter;
    
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  const therapistsWithProfile = therapists.filter(t => t.therapist_profile);

  return (
    <div className="space-y-6">
      {/* 檔案管理統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已建檔治療師</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{therapistsWithProfile.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">專業領域數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getSpecializations().length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均年齡</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {therapistsWithProfile.length > 0 
                ? Math.round(therapistsWithProfile.reduce((sum, t) => sum + (t.age || 0), 0) / therapistsWithProfile.length)
                : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月新增</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {therapistsWithProfile.filter(t => {
                const createdDate = new Date(t.created_at);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜尋和篩選 */}
      <Card>
        <CardHeader>
          <CardTitle>檔案搜尋與篩選</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="搜尋治療師姓名、專業領域或執照號碼..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="篩選專業領域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部領域</SelectItem>
                  {getSpecializations().map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            顯示 {filteredTherapists.length} / {therapistsWithProfile.length} 位已建檔治療師
          </div>
        </CardContent>
      </Card>

      {/* 專業資訊摘要 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">專業領域分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getSpecializations().slice(0, 5).map(spec => {
                const count = therapistsWithProfile.filter(t => t.therapist_profile?.specialization === spec).length;
                const percentage = Math.round((count / therapistsWithProfile.length) * 100);
                return (
                  <div key={spec} className="flex justify-between items-center">
                    <span className="text-sm font-medium truncate">{spec}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} 人</span>
                      <Badge variant="secondary">{percentage}%</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">性別分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['男', '女'].map(gender => {
                const count = therapistsWithProfile.filter(t => t.gender === gender).length;
                const percentage = therapistsWithProfile.length > 0 
                  ? Math.round((count / therapistsWithProfile.length) * 100) 
                  : 0;
                return (
                  <div key={gender} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{gender}性</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} 人</span>
                      <Badge variant="secondary">{percentage}%</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 治療師詳細列表 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>治療師檔案管理</CardTitle>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            重新整理
          </Button>
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
                  <TableHead className="min-w-[150px]">專業領域</TableHead>
                  <TableHead className="min-w-[120px] hidden xl:table-cell">執照號碼</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">檔案狀態</TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">建檔時間</TableHead>
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
                    <TableCell className="max-w-[150px] truncate">
                      {therapist.therapist_profile?.specialization || '-'}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {therapist.therapist_profile?.license_number || '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {getProfileStatusBadge(therapist)}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {formatDate(therapist.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewTherapistDetails(therapist)}
                      >
                        管理
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredTherapists.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || specializationFilter !== 'all' 
                ? '沒有符合條件的治療師檔案' 
                : '沒有已建檔的治療師'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 治療師詳情對話框 */}
      <TherapistDetailsDialog
        therapist={selectedTherapist}
        open={showTherapistDetails}
        onOpenChange={handleCloseTherapistDetails}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default ProfileManagement;