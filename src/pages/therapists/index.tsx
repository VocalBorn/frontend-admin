import SharedSidebar from '@/components/SharedSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import TherapistManagement from '@/components/therapists/TherapistManagement';

const TherapistsPage = () => {
  return (
    <SidebarProvider>
      <div className="flex">
        <SharedSidebar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">治療師管理</h1>
            <p className="text-muted-foreground">
              管理所有語言治療師的資料和專業檔案
            </p>
          </div>
          <TherapistManagement />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TherapistsPage;
