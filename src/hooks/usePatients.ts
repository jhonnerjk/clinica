import { useCallback, useEffect, useState } from "react";

import { User } from "../models/User";
import { deletePatient, getPatients } from "../services/patientService";

interface UsePatientsResult {
  patients: User[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  deletingId: number | null;
  reload: () => Promise<void>;
  refresh: () => Promise<void>;
  removePatient: (id: number) => Promise<void>;
}

export const usePatients = (): UsePatientsResult => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadPatients = useCallback(async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getPatients();
      setPatients(data);
    } catch {
      setError("No pudimos cargar los pacientes. Verifica tu conexion a internet e intenta de nuevo.");
    } finally {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const removePatient = useCallback(async (id: number) => {
    setDeletingId(id);
    setError(null);

    try {
      await deletePatient(id);
      setPatients((previous) => previous.filter((patient) => patient.id !== id));
    } catch {
      setError("No pudimos eliminar al paciente. Intenta de nuevo.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  return {
    patients,
    loading,
    refreshing,
    error,
    deletingId,
    reload: () => loadPatients(false),
    refresh: () => loadPatients(true),
    removePatient,
  };
};
