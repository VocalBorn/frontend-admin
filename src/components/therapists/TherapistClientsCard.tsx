import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMinus, Users } from 'lucide-react';
import { therapistApi, type TherapistClientResponse } from '@/lib/therapist-api';
import { getErrorMessage } from '@/lib/api';
import { useToast } from '@/hooks/useToast';

interface TherapistClientsCardProps {
  therapistId: string;
  onClientUnassigned?: () => void;
}

const TherapistClientsCard = ({ therapistId, onClientUnassigned }: TherapistClientsCardProps) => {
  const [clients, setClients] = useState<TherapistClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [unassigning, setUnassigning] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // 使用管理員專用的端點來取得指定治療師的客戶列表
        const data = await therapistApi.getTherapistClients(therapistId);
        setClients(data);
      } catch (error) {
        showError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [therapistId, showError]);

  const handleUnassignClient = async (clientId: string) => {
    try {
      setUnassigning(clientId);
      await therapistApi.unassignClient(clientId);
      showSuccess('客戶指派已取消');
      // 重新載入客戶列表
      setClients(prev => prev.filter(client => client.client_id !== clientId));
      onClientUnassigned?.();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setUnassigning(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            指派客戶
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">載入中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          指派客戶 ({clients.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>尚未指派任何客戶</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{client.client_info?.name || '未知'}</h4>
                    <Badge variant="secondary" className="text-xs">客戶</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {client.client_info?.gender && client.client_info?.age && (
                      <span>{client.client_info.gender} • {client.client_info.age}歲</span>
                    )}
                    {client.created_at && (
                      <span className="block">
                        指派時間：{new Date(client.created_at).toLocaleDateString('zh-TW')}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnassignClient(client.client_id)}
                  disabled={unassigning === client.client_id}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <UserMinus className="h-4 w-4" />
                  {unassigning === client.client_id ? '取消中...' : '取消指派'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistClientsCard;