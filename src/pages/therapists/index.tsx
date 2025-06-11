import Navbar from '@/components/Navbar';
import TherapistManagement from '@/components/therapists/TherapistManagement';

const TherapistsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">治療師管理</h1>
          <p className="text-muted-foreground">
            管理所有語言治療師的資料和專業檔案
          </p>
        </div>
        <TherapistManagement />
      </main>
    </div>
  );
};

export default TherapistsPage;
