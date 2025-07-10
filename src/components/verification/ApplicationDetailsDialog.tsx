import React, { useState, useEffect } from 'react';
import type { TherapistApplication } from '../../lib/verification-api';
import { ApplicationStatus, getStatusText, getStatusColor, getDocumentTypeText } from '../../lib/verification-api';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { User } from 'lucide-react';
import { useVerification } from '../../hooks/useVerification';
import { therapistApi, type UserWithProfileResponse } from '../../lib/therapist-api';
import { usersApi, type UserResponse } from '../../lib/users-api';
import { getErrorMessage } from '../../lib/api';
import { useToast } from '../../hooks/useToast';

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
  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [therapistProfile, setTherapistProfile] = useState<UserWithProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { handleApprove, handleReject, handleRequestAction, getDocumentUrl, loading } = useVerification();
  const { showError } = useToast();

  // 載入用戶和治療師資料
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!application?.user_id || !isOpen) return;
      
      try {
        setProfileLoading(true);
        
        // 嘗試載入治療師專業檔案資料
        try {
          // 先嘗試直接取得治療師檔案
          const therapistProfile = await therapistApi.getProfileById(application.user_id);
          // 取得所有治療師列表以獲得完整的用戶資料
          const allTherapists = await therapistApi.getAllTherapists();
          const fullTherapistData = allTherapists.find(t => t.user_id === application.user_id);
          
          if (fullTherapistData) {
            setTherapistProfile(fullTherapistData);
          } else {
            // 如果在治療師列表中找不到，建立一個包含治療師檔案的結構
            setTherapistProfile({
              user_id: application.user_id,
              account_id: '', // 這些資訊會從 userProfile 取得
              name: '',
              gender: null,
              age: null,
              phone: null,
              role: 'client' as const,
              created_at: '',
              updated_at: '',
              therapist_profile: therapistProfile
            });
          }
        } catch {
          // 如果無法載入治療師檔案，表示申請人還沒有治療師檔案
          setTherapistProfile(null);
        }
        
        // 載入基本用戶資料
        const allUsers = await usersApi.list();
        const userData = allUsers.users.find(u => u.user_id === application.user_id);
        setUserProfile(userData || null);
        
      } catch (error) {
        showError(getErrorMessage(error));
      } finally {
        setProfileLoading(false);
      }
    };
    
    loadUserProfile();
  }, [application?.user_id, isOpen, showError]);
  
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
            <div className="flex items-center justify-between">
              <DialogTitle>治療師申請詳情</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                申請人資料
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            {/* 申請人個人資料 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  申請人資料
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <div className="text-center py-4 text-muted-foreground">載入用戶資料中...</div>
                ) : userProfile ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">姓名</label>
                      <div className="text-base font-medium">{userProfile.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="text-base">{userProfile.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">性別</label>
                      <div className="text-base">{userProfile.gender || '未設定'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">年齡</label>
                      <div className="text-base">{userProfile.age ? `${userProfile.age} 歲` : '未設定'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">電話</label>
                      <div className="text-base">{userProfile.phone || '未設定'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">目前角色</label>
                      <div>
                        <Badge variant={userProfile.role === 'admin' ? 'destructive' : userProfile.role === 'therapist' ? 'warning' : 'secondary'}>
                          {userProfile.role === 'admin' ? '管理員' : userProfile.role === 'therapist' ? '語言治療師' : '一般用戶'}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">用戶 ID</label>
                      <div className="font-mono text-xs bg-muted p-2 rounded">{userProfile.user_id}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">註冊時間</label>
                      <div className="text-sm">{new Date(userProfile.created_at).toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">最後更新</label>
                      <div className="text-sm">{new Date(userProfile.updated_at).toLocaleString()}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">無法載入用戶資料</div>
                )}
              </CardContent>
            </Card>
            
            {/* 申請治療師專業資料 */}
            {therapistProfile?.therapist_profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">申請治療師專業資料</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">執照號碼</label>
                      <div className="text-base">{therapistProfile.therapist_profile.license_number}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">專業領域</label>
                      <div className="text-base">{therapistProfile.therapist_profile.specialization || '未設定'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">工作經驗</label>
                      <div className="text-base">
                        {therapistProfile.therapist_profile.years_experience ? `${therapistProfile.therapist_profile.years_experience} 年` : '未設定'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">學歷</label>
                      <div className="text-base">{therapistProfile.therapist_profile.education || '未設定'}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">個人簡介</label>
                    <div className="text-base mt-1 min-h-[60px] p-2 bg-muted rounded">
                      {therapistProfile.therapist_profile.bio || '未設定'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 如果沒有治療師專業資料的提示 */}
            {!therapistProfile?.therapist_profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">申請治療師專業資料</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-sm">
                      申請人尚未提供治療師專業資料，或資料載入失敗
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 申請資訊 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">申請資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">申請 ID</label>
                    <div className="font-mono text-xs bg-muted p-2 rounded">{application.id}</div>
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
                      <div className="text-base p-2 bg-red-50 border border-red-200 rounded">{application.rejection_reason}</div>
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
