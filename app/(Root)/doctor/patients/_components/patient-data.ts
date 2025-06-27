// The actual data is now fetched from the API using patientService.ts

export enum PatientStatus {
  Active = "Active",
  Inactive = "Inactive",
  Deceased = "Deceased",
  Critical = "Critical",
  Recovered = "Recovered"
}

export type PatientType = {
  id: string;
  patientId: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  lastVisit: string; // Should be a date string, formatted as 'dd-MMM-yyyy'
  status: PatientStatus;
  email: string; // Added from typical patient data
  phone: string; // Added from typical patient data
  address: string; // Added from typical patient data
};

// Sample data generation has been replaced with API integration
// See features/services/patientService.ts for the implementation

// For backward compatibility during transition to API
import { makeArrayDataWithLength } from "@/demo";

export const getSamplePatientData = makeArrayDataWithLength<PatientType>(
  (fakerInstance) => ({
    id: fakerInstance.string.uuid(),
    patientId: `PID-${fakerInstance.string.numeric(5)}`,
    name: fakerInstance.person.fullName(),
    gender: fakerInstance.helpers.arrayElement(['Male', 'Female', 'Other'] as const) as PatientType['gender'],
    age: fakerInstance.number.int({ min: 1, max: 100 }),
    lastVisit: fakerInstance.date.past({ years: 1 }).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
    status: fakerInstance.helpers.enumValue(PatientStatus),
    email: fakerInstance.internet.email(),
    phone: fakerInstance.phone.number(),
    address: fakerInstance.location.streetAddress(true),
  }),
  15 // Generate 15 sample patients
);