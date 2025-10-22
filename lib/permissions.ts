 

// Permission categories aligned to API permission keys
export type PermissionCategory =
  | "lab_draft"
  | "bed_management"
  | "lab_management"
  | "ora_management"
  | "queue_management"
  | "staff_management"
  | "pickup_management"
  | "create_new_patient"
  | "patient_management"
  | "payroll_management"
  | "wound_care_management"
  | "appointment_management"
  | "lab_results_management"
  | "internal_pharmacy_management";

// Mapping of module key to route -> required permission
// Routes are relative to the module prefix, e.g., admin route '/patients'
export const routePermissionMap: Record<string, Record<string, PermissionCategory>> = {
  admin: {
    "/patients": "patient_management",
    "/bed-management": "bed_management",
    "/staff-management": "staff_management",
    "/queuing-system": "queue_management",
    "/appointment": "appointment_management",
    // "/billing-payments" unrestricted until billing permission key is defined
  },
  doctor: {
    "/patients": "patient_management",
    "/wound-care": "wound_care_management",
    "/appointment": "appointment_management",
    "/ora": "ora_management",
    "/queuing-system": "queue_management",
  },
  nurse: {
    "/patients": "patient_management",
    "/wound-care": "wound_care_management",
    "/bed-management": "bed_management",
    "/queuing-system": "queue_management",
    "/appointment": "appointment_management",
  },
  "lab-scientist": {
    "/laboratory": "lab_management",
    "/queuing-system": "queue_management",
    "/appointment": "appointment_management",
  },
  pharmacy: {
    "/internal-pharmacy": "internal_pharmacy_management",
    "/pickup": "pickup_management",
    "/queuing-system": "queue_management",
    "/appointment": "appointment_management",
  },
  "front-desk": {
    "/patients": "patient_management",
    "/queuing-system": "queue_management",
    "/appointment": "appointment_management",
    // '/billing-payments' unrestricted due to missing category
  },
};

/**
 * Given a full pathname and module key, resolve the required permission category for the route.
 * If none is required or mapping does not exist, returns undefined.
 */
export function getRequiredPermissionForPath(
  moduleKey: string,
  pathname: string
): PermissionCategory | undefined {
  const map = routePermissionMap[moduleKey];
  if (!map) return undefined;

  // Extract the first segment after the module prefix
  // e.g., '/admin/patients/123' -> '/patients'
  const segments = pathname.split("/").filter(Boolean);
  // segments[0] is moduleKey
  if (!segments.length) return undefined;
  const firstAfterModule = segments[1] ? `/${segments[1]}` : "/";

  // Direct match on the first segment
  if (map[firstAfterModule]) return map[firstAfterModule];

  // Fallback: try matching by prefix for nested routes
  const entry = Object.entries(map).find(([route]) =>
    firstAfterModule.startsWith(route)
  );
  return entry ? entry[1] : undefined;
}

/**
 * Whether a menu item href should be visible given authorities.
 */
export function hasMenuPermission(
  authorities: string[] | undefined,
  moduleKey: string,
  href: string
): boolean {
  const map = routePermissionMap[moduleKey];
  if (!map) return true; // no mapping => unrestricted
  const required = map[href];
  if (!required) return true; // no permission required
  if (!authorities || authorities.length === 0) return false;
  // Authorities are permission category strings
  return authorities.includes(required);
}