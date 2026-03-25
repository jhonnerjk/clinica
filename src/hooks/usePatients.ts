import { useCallback, useEffect, useState } from "react";

import { User } from "../models/User";
import { deletePatient, getPatients } from "../services/patientService";

interface UsePatientsResult {
  patients: User[];
  loading: boolean;
  error: string | null;
  deletingId: number | null;
  reload: () => Promise<void>;
  removePatient: (id: number) => Promise<void>;
}

export const usePatients = (): UsePatientsResult => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPatients();
      setPatients(data);
    } catch {
      setError("Could not load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const removePatient = useCallback(async (id: number) => {
    setDeletingId(id);
    setError(null);

    try {
      await deletePatient(id);
      setPatients((previous) => previous.filter((patient) => patient.id !== id));
    } catch {
      setError("Could not delete patient. Please try again.");
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
    error,
    deletingId,
    reload: loadPatients,
    removePatient,
  };
};
