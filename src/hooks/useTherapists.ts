import { useState, useEffect } from 'react';
import { 
  therapistApi, 
  type UserWithProfileResponse, 
  type TherapistProfileResponse,
  type TherapistClientResponse,
  type TherapistApplicationRequest,
  type TherapistProfileCreate,
  type TherapistProfileUpdate,
  type TherapistClientCreate
} from '@/lib/therapist-api';
import { getErrorMessage } from '@/lib/api';
import { useToast } from './useToast';

export const useTherapists = () => {
  const [therapists, setTherapists] = useState<UserWithProfileResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const data = await therapistApi.getAllTherapists();
      setTherapists(data);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const applyToBeTherapist = async (data: TherapistApplicationRequest) => {
    try {
      await therapistApi.apply(data);
      showSuccess('治療師申請已提交');
      await fetchTherapists();
    } catch (error) {
      showError(getErrorMessage(error));
      throw error;
    }
  };

  const createTherapistProfile = async (data: TherapistProfileCreate) => {
    try {
      await therapistApi.createProfile(data);
      showSuccess('治療師檔案建立成功');
      await fetchTherapists();
    } catch (error) {
      showError(getErrorMessage(error));
      throw error;
    }
  };

  const updateTherapistProfile = async (data: TherapistProfileUpdate) => {
    try {
      await therapistApi.updateProfile(data);
      showSuccess('治療師檔案更新成功');
      await fetchTherapists();
    } catch (error) {
      showError(getErrorMessage(error));
      throw error;
    }
  };

  const deleteTherapistProfile = async () => {
    try {
      await therapistApi.deleteProfile();
      showSuccess('治療師檔案刪除成功');
      await fetchTherapists();
    } catch (error) {
      showError(getErrorMessage(error));
      throw error;
    }
  };

  return {
    therapists,
    loading,
    fetchTherapists,
    applyToBeTherapist,
    createTherapistProfile,
    updateTherapistProfile,
    deleteTherapistProfile,
  };
};

export const useTherapistProfile = (userId?: string) => {
  const [profile, setProfile] = useState<TherapistProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

  const fetchProfile = async (targetUserId?: string) => {
    if (!targetUserId && !userId) return;
    
    try {
      setLoading(true);
      const data = userId 
        ? await therapistApi.getProfileById(userId)
        : await therapistApi.getMyProfile();
      setProfile(data);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return {
    profile,
    loading,
    fetchProfile,
  };
};

export const useTherapistClients = () => {
  const [clients, setClients] = useState<TherapistClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await therapistApi.getMyClients();
      setClients(data);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const assignClient = async (data: TherapistClientCreate) => {
    try {
      await therapistApi.assignClient(data);
      showSuccess('客戶指派成功');
      await fetchClients();
    } catch (error) {
      showError(getErrorMessage(error));
      throw error;
    }
  };

  const unassignClient = async (clientId: string) => {
    try {
      await therapistApi.unassignClient(clientId);
      showSuccess('客戶指派已取消');
      await fetchClients();
    } catch (error) {
      showError(getErrorMessage(error));
      throw error;
    }
  };

  return {
    clients,
    loading,
    fetchClients,
    assignClient,
    unassignClient,
  };
};
