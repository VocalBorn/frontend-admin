import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { SituationDialog } from "@/components/situations/SituationDialog";
import { MoreVertical, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSituations } from "@/hooks/useSituations";
import { useSituationStats } from "@/hooks/useSituationStats";
import type { SituationResponse, SituationCreate, SituationUpdate } from "@/lib/api";

const CoursesPage = () => {
  const navigate = useNavigate();
  const {
    situations,
    isLoading,
    loadSituations,
    createSituation,
    updateSituation,
    deleteSituation,
  } = useSituations();

  const { chapterCounts, loadChapterCounts } = useSituationStats();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSituation, setEditingSituation] = useState<SituationResponse | undefined>();

  useEffect(() => {
    loadSituations();
  }, [loadSituations]);

  useEffect(() => {
    if (situations.length > 0) {
      const situationIds = situations.map(s => s.situation_id);
      loadChapterCounts(situationIds);
    }
  }, [situations, loadChapterCounts]);

  const handleSubmit = async (data: SituationCreate | SituationUpdate) => {
    if (editingSituation) {
      await updateSituation(editingSituation.situation_id, data as SituationUpdate);
      setEditingSituation(undefined);
    } else {
      const createData: SituationCreate = {
        situation_name: data.situation_name || "",
        description: data.description,
        location: data.location,
      };
      await createSituation(createData);
    }
    setDialogOpen(false);
  };

  const handleDelete = async (situationId: string) => {
    if (!window.confirm("確定要刪除此情境嗎？")) return;
    await deleteSituation(situationId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>課程管理</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新增情境
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>載入中...</div>
            ) : (
              <div className="grid gap-4">
                {situations.map((situation) => (
                  <div
                    key={situation.situation_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{situation.situation_name}</h3>
                        <Badge variant="secondary">
                          {chapterCounts[situation.situation_id] || 0} 章節
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{situation.description}</p>
                      {situation.location && (
                        <p className="text-sm text-gray-500">地點: {situation.location}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/chapters/${situation.situation_id}`)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          管理章節
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingSituation(situation);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          編輯
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(situation.situation_id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          刪除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <SituationDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditingSituation(undefined);
          }}
          onSubmit={handleSubmit}
          situation={editingSituation}
          mode={editingSituation ? "edit" : "create"}
        />
      </div>
    </div>
  );
};

export default CoursesPage;
