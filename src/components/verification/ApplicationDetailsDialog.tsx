import React, { useState } from 'react';
import type { TherapistApplication } from '../../lib/verification-api';
import { ApplicationStatus, getStatusText, getStatusColor, getDocumentTypeText } from '../../lib/verification-api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { useVerification } from '../../hooks/useVerification';

interface ApplicationDetailsDialogProps {
  application: TherapistApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const [actionReason, setActionReason] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'request_action' | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const { handleApprove, handleReject, handleRequestAction, getDocumentUrl, loading } = useVerification();

  if (!application) return null;

  const handleAction = async () => {
    if (!actionType) return;

    try {
      switch (actionType) {
        case 'approve':
          await handleApprove(application.id);
          break;
        case 'reject':
          await handleReject(application.id, actionReason);
          break;
        case 'request_action':
          await handleRequestAction(application.id, actionReason);
          break;
      }
      setShowActionDialog(false);
      setActionReason('');
      setActionType(null);
      onClose();
    } catch (error) {
      console.error('處理申請失敗:', error);
    }
  };

  const openActionDialog = (type: 'approve' | 'reject' | 'request_action') => {
    setActionType(type);
    setShowActionDialog(true);
  };

  const handleViewDocument = async (documentId: string) => {
    const url = await getDocumentUrl(documentId);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getActionButtonText = () => {
    switch (actionType) {
      case 'approve':
        return '確認批准';
      case 'reject':
        return '確認拒絕';
      case 'request_action':
        return '確認要求補件';
      default:
        return '確認';
    }
  };

  const getActionDialogTitle = () => {
    switch (actionType) {
      case 'approve':
        return '批准申請';
      case 'reject':
        return '拒絕申請';
      case 'request_action':
        return '要求補件';
      default:
        return '處理申請';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full h-full max-w-none max-h-none m-0 rounded-none sm:w-3/4 sm:h-auto sm:max-w-2xl sm:max-h-[90vh] sm:m-6 sm:rounded-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>治療師申請詳情</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* 申請資訊 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">申請資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">申請人 ID</label>
                    <div className="text-base font-medium">{application.user_id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">申請狀態</label>
                    <div>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">申請時間</label>
                    <div className="text-base">{new Date(application.created_at).toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">更新時間</label>
                    <div className="text-base">{new Date(application.updated_at).toLocaleString()}</div>
                  </div>
                  {application.rejection_reason && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">拒絕原因</label>
                      <div className="text-base">{application.rejection_reason}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 上傳文件 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">上傳文件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.documents.length > 0 ? (
                  <div className="space-y-3">
                    {application.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{getDocumentTypeText(doc.document_type)}</p>
                          <p className="text-sm text-muted-foreground">
                            上傳時間: {new Date(doc.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          檢視
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">尚未上傳任何文件</p>
                )}
              </CardContent>
            </Card>

            {/* 操作按鈕 */}
            {application.status === ApplicationStatus.PENDING && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">操作</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button
                    onClick={() => openActionDialog('approve')}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    批准申請
                  </Button>
                  <Button
                    onClick={() => openActionDialog('reject')}
                    variant="destructive"
                    disabled={loading}
                  >
                    拒絕申請
                  </Button>
                  <Button
                    onClick={() => openActionDialog('request_action')}
                    variant="outline"
                    disabled={loading}
                  >
                    要求補件
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 操作確認對話框 */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md mx-auto p-6">
          <DialogHeader>
            <DialogTitle>{getActionDialogTitle()}</DialogTitle>
          </DialogHeader>
          {actionType === 'approve' ? (
            <p className="text-sm text-gray-600 mb-4">
              確定要批准這個治療師申請嗎？此操作無法撤銷。
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                請輸入{actionType === 'reject' ? '拒絕' : '要求補件'}的原因：
              </p>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={`請輸入${actionType === 'reject' ? '拒絕' : '補件'}原因...`}
                rows={4}
              />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleAction}
              disabled={loading || (actionType !== 'approve' && !actionReason.trim())}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 
                          actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {loading ? '處理中...' : getActionButtonText()}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowActionDialog(false)}
              disabled={loading}
            >
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationDetailsDialog;
