import AsyncStorage from "@react-native-async-storage/async-storage";

import { ClinicalNote } from "../models/User";

const NOTE_KEY_PREFIX = "clinical_note";

const getNoteKey = (patientId: number): string => `${NOTE_KEY_PREFIX}_${patientId}`;

export const saveNote = async (patientId: number, text: string): Promise<void> => {
  const note: ClinicalNote = {
    patientId,
    text,
  };

  await AsyncStorage.setItem(getNoteKey(patientId), JSON.stringify(note));
};

export const getNote = async (patientId: number): Promise<string> => {
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
