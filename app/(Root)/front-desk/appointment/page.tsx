/**
 * Front Desk Appointment page
 *
 * Mirrors the Admin appointment UI while preserving front-desk specific concerns like SEO meta.
 * Provides booking entry point, KPI stats, search, and tabs for individual/family appointments.
 *
 * @module FrontDeskAppointmentPage
 */
"use client";

import React from "react";
import AppointmentPage from "@/features/pages/appointment/page";

/**
 * Front-desk Appointment page component.
 * Renders header, booking CTA, analytics stats, search, and tabbed content for individual and family appointments.
 * Also sets static SEO for dashboard contexts.
 *
 * @returns {JSX.Element} Page markup for front-desk appointment management
 * @example
 * return <FrontDeskAppointmentPage />
 */
const FrontDeskAppointmentPage = ()=> {
  return (
    <AppointmentPage />
  );
};

export default FrontDeskAppointmentPage;