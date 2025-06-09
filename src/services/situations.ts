import { 
  situationsApi, 
  type SituationCreate, 
  type SituationUpdate, 
  type SituationResponse, 
  type SituationListResponse 
} from "@/lib/api";

export class SituationService {
  async list(params?: { skip?: number; limit?: number; search?: string }): Promise<SituationListResponse> {
    try {
      return await situationsApi.list(params);
    } catch (error) {
      console.error("載入情境失敗:", error);
      throw error;
    }
  }

  async create(data: SituationCreate): Promise<SituationResponse> {
    try {
      return await situationsApi.create(data);
    } catch (error) {
      console.error("新增情境失敗:", error);
      throw error;
    }
  }

  async update(id: string, data: SituationUpdate): Promise<SituationResponse> {
    try {
      return await situationsApi.update(id, data);
    } catch (error) {
      console.error("更新情境失敗:", error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await situationsApi.delete(id);
    } catch (error) {
      console.error("刪除情境失敗:", error);
      throw error;
    }
  }
}

export const situationService = new SituationService();
