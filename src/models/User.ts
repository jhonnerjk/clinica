export interface Company {
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  company: Company;
}

export interface ClinicalNote {
  patientId: number;
  text: string;
}
