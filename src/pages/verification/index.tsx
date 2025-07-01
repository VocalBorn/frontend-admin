import React, { useState } from 'react';
import { useVerification } from '../../hooks/useVerification';
import { ApplicationStatus, getStatusText, getStatusColor } from '../../lib/verification-api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table } from '../../components/ui/table';
import ApplicationDetailsDialog from '../../components/verification/ApplicationDetailsDialog';
import Navbar from '../../components/Navbar';

const VerificationPage: React.FC = () => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
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

  const stats = getStatusStats();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col"> {/* 調整頁面結構與使用者管理頁面一致 */}
      <Navbar />
      <div className="flex-1 p-8"> {/* 調整內部間距 */}
        <div className="mb-6"> {/* 調整標題與描述的間距 */}
          <h1 className="text-3xl font-bold">治療師申請驗證</h1> {/* 調整標題字體大小與粗細 */}
          <p className="text-muted-foreground mt-2">管理治療師申請，審核文件並決定是否批准</p> {/* 調整描述文字樣式 */}
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"> {/* 調整卡片間距 */}
          <Card className="p-6 shadow-md border border-gray-200"> {/* 調整卡片樣式 */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"> {/* 調整圖示大小 */}
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                </div>
              </div>
              <div className="ml-4"> {/* 調整內部間距 */}
                <p className="text-sm font-medium text-gray-600">待審核</p>
                <p className="text-2xl font-bold text-gray-900">{stats[ApplicationStatus.PENDING]}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">需補件</p>
                <p className="text-2xl font-bold text-gray-900">{stats[ApplicationStatus.ACTION_REQUIRED]}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已批准</p>
                <p className="text-2xl font-bold text-gray-900">{stats[ApplicationStatus.APPROVED]}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">已拒絕</p>
                <p className="text-2xl font-bold text-gray-900">{stats[ApplicationStatus.REJECTED]}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 申請列表 */}
        <Card className="shadow-md border border-gray-200"> {/* 調整卡片樣式 */}
          <div className="px-6 py-4 border-b border-gray-300"> {/* 調整內部間距與邊框顏色 */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">申請列表</h2> {/* 調整標題字體大小與粗細 */}
              <Button
                variant="outline"
                onClick={() => loadApplications()}
                disabled={loading}
                className="text-sm font-medium" // 調整按鈕字體大小
              >
                {loading ? '載入中...' : '重新整理'}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200"> {/* 調整表格樣式 */}
              <thead className=""> {/* 調整表頭背景顏色 */}
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    申請 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] hidden sm:table-cell">
                    用戶 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px] hidden md:table-cell">
                    申請時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px] hidden lg:table-cell">
                    更新時間
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200"> {/* 調整表格分隔線顏色 */}
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground"> {/* 統一空資料提示樣式 */}
                      {loading ? '載入中...' : '目前沒有申請需要處理'}
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50"> {/* 增加 hover 效果 */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 min-w-[100px]">
                        {application.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[100px] hidden sm:table-cell">
                        {application.user_id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap min-w-[80px]">
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusText(application.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[140px] hidden md:table-cell">
                        {new Date(application.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[140px] hidden lg:table-cell">
                        {new Date(application.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium min-w-[80px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(application.id)}
                          disabled={loading}
                        >
                          查看詳情
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>

      {/* 詳情對話框 */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        isOpen={showDetailsDialog}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default VerificationPage;
