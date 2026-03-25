import { User } from "../models/User";

const API_BASE_URL = "https://jsonplaceholder.typicode.com/users";

export const getPatients = async (): Promise<User[]> => {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error("Unable to load patients.");
  }

  const data = (await response.json()) as User[];
  return data;
};

export const getPatientById = async (id: number): Promise<User | null> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load patient.");
  }

  const data = (await response.json()) as User;
  return data;
};

export const deletePatient = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Unable to delete patient.");
  }
};
