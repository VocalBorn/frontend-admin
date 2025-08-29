import React, { useState } from 'react';
import { useVerification } from '../../hooks/useVerification';
import { ApplicationStatus, getStatusText, getStatusColor } from '../../lib/verification-api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ApplicationDetailsDialog from '../verification/ApplicationDetailsDialog';

const ApplicationReview: React.FC = () => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const {
    applications,
    selectedApplication,
    loading,
    error,
    loadApplications,
    loadApplicationDetails,
    clearSelectedApplication,
  } = useVerification();

  const handleViewDetails = async (applicationId: string) => {
    await loadApplicationDetails(applicationId);
    setShowDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialog(false);
    clearSelectedApplication();
  };

  const getStatusStats = () => {
    const stats = {
      [ApplicationStatus.PENDING]: 0,
      [ApplicationStatus.ACTION_REQUIRED]: 0,
      [ApplicationStatus.APPROVED]: 0,
      [ApplicationStatus.REJECTED]: 0,
    };

    applications.forEach(app => {
      stats[app.status]++;
    });

    return stats;
  };

  // 過濾申請
  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const stats = getStatusStats();

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">載入失敗</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadApplications()}
                    >
                      重新載入
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 申請狀態統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待審核</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats[ApplicationStatus.PENDING]}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">需補件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats[ApplicationStatus.ACTION_REQUIRED]}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已批准</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats[ApplicationStatus.APPROVED]}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已拒絕</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats[ApplicationStatus.REJECTED]}</div>
          </CardContent>
        </Card>
      </div>

      {/* 篩選器 */}
      <Card>
        <CardHeader>
          <CardTitle>申請篩選</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="篩選狀態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部狀態</SelectItem>
                  <SelectItem value={ApplicationStatus.PENDING}>待審核</SelectItem>
                  <SelectItem value={ApplicationStatus.ACTION_REQUIRED}>需補件</SelectItem>
                  <SelectItem value={ApplicationStatus.APPROVED}>已批准</SelectItem>
                  <SelectItem value={ApplicationStatus.REJECTED}>已拒絕</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Button
                variant="outline"
                onClick={() => loadApplications()}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? '載入中...' : '重新整理'}
              </Button>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            顯示 {filteredApplications.length} / {applications.length} 個申請
          </div>
        </CardContent>
      </Card>

      {/* 申請列表 */}
      <Card>
        <CardHeader>
          <CardTitle>治療師申請列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">申請 ID</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">用戶 ID</TableHead>
                  <TableHead className="min-w-[80px]">狀態</TableHead>
                  <TableHead className="min-w-[140px] hidden md:table-cell">申請時間</TableHead>
                  <TableHead className="min-w-[140px] hidden lg:table-cell">更新時間</TableHead>
                  <TableHead className="min-w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {loading ? '載入中...' : (statusFilter === 'all' ? '目前沒有申請需要處理' : '沒有符合條件的申請')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {application.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {application.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusText(application.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(application.created_at).toLocaleDateString('zh-TW')}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(application.updated_at).toLocaleDateString('zh-TW')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(application.id)}
                          disabled={loading}
                        >
                          查看詳情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 申請詳情對話框 */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        isOpen={showDetailsDialog}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default ApplicationReview;