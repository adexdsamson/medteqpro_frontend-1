import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getFormatCurrency = (amount: number) => {
  const naira = Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return naira.format(amount);
};

// ---------------------------------------------------------------------------
// Role-based routing utilities
// ---------------------------------------------------------------------------

/**
 * Map a server role value to the app route base segment.
 * @param role - The authenticated user's role as returned by the API (e.g., "hospital_admin", "front_desk", "lab_scientist").
 * @returns A route base segment starting with a slash (e.g., "/admin", "/doctor"), or undefined if unsupported.
 * @example
 * getRoleBasePath("hospital_admin") // "/admin"
 * getRoleBasePath("front_desk") // "/front-desk"
 */
export function getRoleBasePath(role?: string): string | undefined {
  if (!role) return undefined;
  const normalized = String(role).toLowerCase();
  const map: Record<string, string> = {
    superadmin: "/super-admin",
    admin: "/super-admin",
    hospital_admin: "/admin",
    doctor: "/doctor",
    nurse: "/nurse",
    patient: "/patient",
    pharmacist: "/pharmacy",
    lab_scientist: "/lab-scientist",
    front_desk: "/front-desk",
  };
  return map[normalized];
}

/**
 * Build a role-scoped path for nested feature routes.
 * @param role - The authenticated user's role as returned by the API.
 * @param segments - Path segment(s) to append after the role base (e.g., "patients" or ["patients", patientId]).
 * @returns A path string like "/doctor/patients/123" or undefined if the role is unsupported.
 * @example
 * buildRolePath("doctor", ["patients", "123"]) // "/doctor/patients/123"
 * buildRolePath("front_desk", "patients") // "/front-desk/patients"
 */
export function buildRolePath(
  role: string | undefined,
  segments: string | string[]
): string | undefined {
  const base = getRoleBasePath(role);
  if (!base) return undefined;
  const parts = Array.isArray(segments) ? segments : [segments];
  const cleaned = parts
    .filter(Boolean)
    .map((p) => String(p).replace(/^\/+|\/+$/g, ""));
  return `${base}/${cleaned.join("/")}`.replace(/\/+$/g, "");
}

/**
 * Whether a role is allowed to access the Patients feature routes.
 * @param role - The authenticated user's role.
 * @returns true if the role can access patients pages, false otherwise.
 * @example
 * hasPatientsRoute("doctor") // true
 * hasPatientsRoute("pharmacist") // false
 */
export function hasPatientsRoute(role?: string): boolean {
  if (!role) return false;
  const normalized = String(role).toLowerCase();
  const allowed = new Set(["hospital_admin", "doctor", "nurse", "front_desk", "admin"]);
  return allowed.has(normalized);
}

/**
 * Whether a role has a dashboard route available.
 * @param role - The authenticated user's role.
 * @returns true if the role has a dashboard page, false otherwise.
 * @example
 * hasDashboardRoute("front_desk") // false
 * hasDashboardRoute("doctor") // true
 */
export function hasDashboardRoute(role?: string): boolean {
  if (!role) return false;
  const normalized = String(role).toLowerCase();
  // Known roles with dashboard pages in /app/(Root)/
  const rolesWithDashboard = new Set([
    "superadmin",
    "hospital_admin",
    "doctor",
    "nurse",
    "pharmacist",
    "lab_scientist",
    "admin"
    // patient dashboard folder not found in current codebase snapshot
  ]);
  return rolesWithDashboard.has(normalized);
}