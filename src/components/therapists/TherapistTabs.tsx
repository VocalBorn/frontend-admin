import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TherapistOverview from './TherapistOverview';
import ApplicationReview from './ApplicationReview';
import ProfileManagement from './ProfileManagement';

const TherapistTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="flex w-fit">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          總覽
        </TabsTrigger>
        <TabsTrigger value="applications" className="flex items-center gap-2">
          申請審核
        </TabsTrigger>
        <TabsTrigger value="profiles" className="flex items-center gap-2">
          檔案管理
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <TherapistOverview />
      </TabsContent>

      <TabsContent value="applications">
        <ApplicationReview />
      </TabsContent>

      <TabsContent value="profiles">
        <ProfileManagement />
      </TabsContent>
    </Tabs>
  );
};

export default TherapistTabs;