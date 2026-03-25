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
  savePatientNote: () => Promise<boolean>;
  reload: () => Promise<void>;
}

export const usePatientDetail = (patientId: number | null): UsePatientDetailResult => {
  const [patient, setPatient] = useState<User | null>(null);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatientData = useCallback(async () => {
    if (!patientId || Number.isNaN(patientId)) {
      setPatient(null);
      setNote("");
      setError("ID de paciente invalido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [selectedPatient, storedNote] = await Promise.all([
        getPatientById(patientId),
        getNote(patientId),
      ]);

      setPatient(selectedPatient);
      setNote(storedNote);
    } catch {
      setError("No pudimos cargar el detalle del paciente.");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  const savePatientNote = useCallback(async () => {
    if (!patientId || Number.isNaN(patientId)) {
      setError("ID de paciente invalido.");
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      await saveNote(patientId, note.trim());
      return true;
    } catch {
      setError("No pudimos guardar la nota clinica.");
      return false;
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
