import AppLayout from '@/components/AppLayout';
import TherapistManagement from '@/components/therapists/TherapistManagement';

const TherapistsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">治療師管理</h1>
          <p className="text-muted-foreground">管理所有語言治療師的資料和專業檔案</p>
        </div>
        <TherapistManagement />
      </div>
    </AppLayout>
  );
};

export default TherapistsPage;
