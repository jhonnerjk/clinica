import AsyncStorage from "@react-native-async-storage/async-storage";

import { ClinicalNote } from "../models/ClinicalNote";

const NOTE_KEY_PREFIX = "clinical_note";

const getNoteKey = (patientId: number): string => `${NOTE_KEY_PREFIX}_${patientId}`;

const isValidPatientId = (patientId: number): boolean =>
  Number.isInteger(patientId) && patientId > 0;

export const saveNote = async (patientId: number, text: string): Promise<void> => {
  if (!isValidPatientId(patientId)) {
    throw new Error(`Invalid patientId: ${patientId}`);
  }

  const note: ClinicalNote = {
    patientId,
    text,
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(getNoteKey(patientId), JSON.stringify(note));
};

export const getNote = async (patientId: number): Promise<string> => {
  if (!isValidPatientId(patientId)) {
    throw new Error(`Invalid patientId: ${patientId}`);
  }

  const serializedNote = await AsyncStorage.getItem(getNoteKey(patientId));

  if (!serializedNote) {
    return "";
  }

  try {
    const parsed = JSON.parse(serializedNote) as ClinicalNote;
    return parsed.text ?? "";
  } catch {
    return "";
  }
};
