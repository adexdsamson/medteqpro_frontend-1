// Types for Patient Detail Page based on API response

export interface Medication {
  medication: string;
  dosage: string;
  frequency: string;
}

export interface PatientDetailResponse {
  id: string;
  user_id: string;
  hospital: string;
  family: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  full_name: string;
  patient_type: string;
  date_of_birth: string;
  age: number;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  employment_status: string;
  height: number;
  weight: number;
  bmi: number;
  blood_group: string;
  genotype: string;
  allergies: string;
  last_seen: LastSeenInfo;
  chronic_conditions: string;
  current_medications: Medication[];
  family_history: string;
  surgical_history: string;
  hereditary_conditions: string;
  other_conditions: string;
  emergency_contact: PatientContact;
  marital_status: string;
  social_history: {
    smoking: string;
    alcohol: string;
    drug_use: string;
    exercise: string;
    diet: string;
    sexual_history: string;
    other_habits: string;
  };
  created_at: string;
  updated_at: string;
}

export interface LastSeenInfo {
  doctor: null | string;
  nurse: null | string;
  lab_scientist: null | string;
  pharmacist: null | string;
}

export interface PatientContact {
  name: string;
  phone: string;
  relationship: string;
}
