"use client";

import AdminCreatePatientDialog from "@/app/(Root)/admin/patients/_components/CreatePatientDialog";

// Re-export the admin dialog for front-desk to maintain a single source of truth
// This assumes the dialog is module-agnostic (no hardcoded path usage inside)
const CreatePatientDialog = AdminCreatePatientDialog;

export default CreatePatientDialog;