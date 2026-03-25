import { useCallback, useEffect, useState } from "react";

import { User } from "../models/User";
import { getPatientById } from "../services/patientService";
import { getNote, saveNote } from "../storage/noteStorage";

interface UsePatientDetailResult {
  patient: User | null;
  note: string;
  setNote: (value: string) => void;
  loading: boolean;
  saving: boolean;
  error: string | null;
  savePatientNote: () => Promise<void>;
  reload: () => Promise<void>;
}

export const usePatientDetail = (patientId: number): UsePatientDetailResult => {
  const [patient, setPatient] = useState<User | null>(null);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatientData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [selectedPatient, storedNote] = await Promise.all([
        getPatientById(patientId),
        getNote(patientId),
      ]);

      if (!selectedPatient) {
        setError("Patient not found.");
        setLoading(false);
        return;
      }

      setPatient(selectedPatient);
      setNote(storedNote);
    } catch {
      setError("Could not load patient detail.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const savePatientNote = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      await saveNote(patientId, note.trim());
    } catch {
      setError("Could not save clinical note.");
    } finally {
      setSaving(false);
    }
  }, [note, patientId]);

  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  return {
    patient,
    note,
    setNote,
    loading,
    saving,
    error,
    savePatientNote,
    reload: loadPatientData,
  };
};
