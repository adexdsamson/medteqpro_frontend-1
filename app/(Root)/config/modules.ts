import { User } from "@/types";
import { PatientsIcon } from "@/components/icons/PatientsIcon";
import { WoundCareIcon } from "@/components/icons/WoundCareIcon";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  HelpCircle,
  UserCog,
  // LogOut,
  FlaskConical,
  ScrollText,
  Pill,
  CalendarCheck,
  Activity,
  Building,
  // UserPlus,
  Calendar,
  Database,
  // Stethoscope,
  ShoppingCart,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";

// Define types for menu items
export type MenuItem = {
  label: string;
  // icon: any;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  // icon: LucideIcon;
  href: string;
};

// Define user profile type
export type UserProfile = User;

// Define module configuration type
export type ModuleConfig = {
  key: string;
  displayName: string;
  pathPrefix: string;
  menuItems: MenuItem[];
  settingsItems?: MenuItem[];
  defaultUserProfile: UserProfile;
};

// Common settings menu items shared across modules
export const commonSettingsItems: MenuItem[] = [
  {
    label: "Profile Settings",
    icon: UserCog,
    href: "/profile",
  },
  // {
  //   label: "Logout",
  //   icon: LogOut,
  //   href: "/sign-in",
  // },
];

const defaultUser = {
  first_name: "Henry",
  last_name: "Audu",
  role: "Super Admin",
  email: "henry@example.com",
  id: "1",
  is_active: true,
  is_staff: true,
  phone_number: "+2348166666666",
  // avatar: "https://avatar.iran.liara.run/public/14",
}

// Define all modules in the application
export const moduleConfigs: ModuleConfig[] = [
  {
    key: "super-admin",
    displayName: "Super Admin",
    pathPrefix: "/super-admin",
    menuItems: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Clients Management",
        icon: Users,
        href: "/clients",
      },
      {
        label: "Staff Management",
        icon: Users,
        href: "/staff",
      },
      {
        label: "System Settings",
        icon: Settings,
        href: "/settings",
      },
      {
        label: "Reports",
        icon: FileText,
        href: "/reports",
      },
      {
        label: "Support",
        icon: HelpCircle,
        href: "/support",
      },
    ],
    settingsItems: commonSettingsItems,
    defaultUserProfile: defaultUser,
  },
  {
    key: "patient",
    displayName: "Patient",
    pathPrefix: "/patient",
    menuItems: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Lab Result",
        icon: FlaskConical,
        href: "/lab-result",
      },
      {
        label: "Doctor's Note",
        icon: ScrollText,
        href: "/doctors-note",
      },
      {
        label: "Prescription",
        icon: Pill,
        href: "/prescription",
      },
      {
        label: "Book Appointment",
        icon: CalendarCheck,
        href: "/book-appointment",
      },
    ],
    settingsItems: commonSettingsItems,
    defaultUserProfile: defaultUser,
  },
  {
    key: "doctor",
    displayName: "Doctor",
    pathPrefix: "/doctor",
    menuItems: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Appointments",
        icon: Calendar,
        href: "/appointments",
      },
      {
        label: "Patients",
        icon: Users,
        href: "/patients",
      },
      {
        label: "Medical Records",
        icon: Database,
        href: "/medical-records",
      },
      {
        label: "Write Prescription",
        icon: Pill,
        href: "/write-prescription",
      },
    ],
    settingsItems: commonSettingsItems,
    defaultUserProfile: defaultUser,
  },
  {
    key: "admin",
    displayName: "Admin",
    pathPrefix: "/admin",
    menuItems: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Patient",
        icon: Users,
        href: "/patients",
      },
      {
        label: "Bed Management",
        icon: Building,
        href: "/bed-management",
      },
      // {
      //   label: "Payroll Management",
      //   icon: UserPlus,
      //   href: "/payroll-management",
      // },
      {
        label: "Queuing System",
        icon: Activity,
        href: "/queuing-system",
      },
      {
        label: "Staff Management",
        icon: Settings,
        href: "/staff-management",
      },
      {
        label: "Appointment",
        icon: Settings,
        href: "/appointment",
      },
    ],
    settingsItems: commonSettingsItems,
    defaultUserProfile: defaultUser,
  },
  {
    key: "nurse",
    displayName: "Nurse",
    pathPrefix: "/nurse",
    menuItems: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Patients",
        icon: PatientsIcon,
        href: "/patients",
      },
      {
        label: "Wound Care",
        icon: WoundCareIcon,
        href: "/wound-care",
      },
      {
        label: "Bed Management",
        icon: Calendar,
        href: "/medication-schedule",
      },
      {
        label: "Queuing System",
        icon: FileText,
        href: "/reports",
      },
      {
        label: "Appointment",
        icon: FileText,
        href: "/reports",
      },
    ],
    settingsItems: commonSettingsItems,
    defaultUserProfile: defaultUser,
  },
  {
    key: "pharmacy",
    displayName: "Pharmacy",
    pathPrefix: "/pharmacy",
    menuItems: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Internal Pharmacy",
        icon: Pill,
        href: "/internal-pharmacy",
      },
      {
        label: "Queuing System",
        icon: Activity,
        href: "/queuing-system",
      },
      {
        label: "Pickup",
        icon: ShoppingCart,
        href: "/pickup",
      },
    ],
    settingsItems: commonSettingsItems,
    defaultUserProfile: defaultUser,
  },
];

// Utility functions to work with modules
export function getModuleByPathname(pathname: string | null): ModuleConfig {
  if (!pathname) return moduleConfigs[0];

  const foundModule = moduleConfigs.find((config) =>
    pathname.startsWith(config.pathPrefix)
  );

  return foundModule || moduleConfigs[0]; // Default to first module if not found
}

export function getModuleByKey(key: string): ModuleConfig {
  return moduleConfigs.find((config) => config.key === key) || moduleConfigs[0];
}
