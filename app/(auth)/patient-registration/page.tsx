import React from "react";
import type { Metadata } from "next";
import PatientRegistrationForm from "./_components/PatientRegistrationForm";

export const metadata: Metadata = {
  title: "Patient Registration - SwiftPro eProcurement Portal",
  description:
    "Register as a new patient to access appointments, lab results, prescriptions, and personalized healthcare services with MedteqPro.",
  robots: { index: true, follow: true },
  keywords: [
    "patient registration",
    "medteq",
    "medteqpro",
    "healthcare",
    "create account",
  ],
  alternates: { canonical: "/patient-registration" },
  openGraph: {
    title: "Patient Registration - SwiftPro eProcurement Portal",
    description:
      "Register as a new patient to access appointments, lab results, prescriptions, and personalized healthcare services with MedteqPro.",
    images: [{ url: "/assets/medteq-og-image.jpg", alt: "Medteq Healthcare System" }],
    url: "/patient-registration",
  },
};

function PatientRegistrationPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <PatientRegistrationForm />
    </div>
  );
}

export default PatientRegistrationPage;