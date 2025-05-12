import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  HelpCircle,
  UserCog,
  LogOut,
  FlaskConical,
  ScrollText,
  Pill,
  CalendarCheck,
  Activity,
  Building,
  UserPlus,
  Calendar,
  Database,
  Stethoscope
} from "lucide-react";
import { LucideIcon } from "lucide-react";

// Define types for menu items
export type MenuItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

// Define user profile type
export type UserProfile = {
  name: string;
  role: string;
  avatar: string;
};

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
  {
    label: 'Logout',
    icon: LogOut,
    href: '/auth/login'
  }
];

// Define all modules in the application
export const moduleConfigs: ModuleConfig[] = [
  {
    key: 'super-admin',
    displayName: 'Super Admin',
    pathPrefix: '/super-admin',
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
    defaultUserProfile: {
      name: "Henry Audu",
      role: "Super Admin",
      avatar: "https://avatar.iran.liara.run/public/14",
    },
  },
  {
    key: 'patient',
    displayName: 'Patient',
    pathPrefix: '/patient',
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
    defaultUserProfile: {
      name: "Femi Babolola",
      role: "Patient",
      avatar: "/images/avatar.png",
    },
  },
  {
    key: 'doctor',
    displayName: 'Doctor',
    pathPrefix: '/doctor',
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
    defaultUserProfile: {
      name: "Dr. Sarah Johnson",
      role: "Doctor",
      avatar: "/images/doctor-avatar.png",
    },
  },
  {
    key: 'admin',
    displayName: 'Admin',
    pathPrefix: '/admin',
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
      {
        label: "Payroll Management",
        icon: UserPlus,
        href: "/payroll-management",
      },
      {
        label: "Queuuing System",
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
    defaultUserProfile: {
      name: "Jane Smith",
      role: "Hospital Admin",
      avatar: "/images/admin-avatar.png",
    },
  },
  {
    key: 'nurse',
    displayName: 'Nurse',
    pathPrefix: '/nurse',
    menuItems: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Patient Care",
        icon: Stethoscope,
        href: "/patient-care",
      },
      {
        label: "Vitals Records",
        icon: Activity,
        href: "/vitals",
      },
      {
        label: "Medication Schedule",
        icon: Calendar,
        href: "/medication-schedule",
      },
      {
        label: "Reports",
        icon: FileText,
        href: "/reports",
      },
    ],
    settingsItems: commonSettingsItems,
    defaultUserProfile: {
      name: "Mary Johnson",
      role: "Nurse",
      avatar: "/images/nurse-avatar.png",
    },
  },
];

// Utility functions to work with modules
export function getModuleByPathname(pathname: string | null): ModuleConfig {
  if (!pathname) return moduleConfigs[0];
  
  const module = moduleConfigs.find(config => 
    pathname.startsWith(config.pathPrefix)
  );
  
  return module || moduleConfigs[0]; // Default to first module if not found
}

export function getModuleByKey(key: string): ModuleConfig {
  return moduleConfigs.find(config => config.key === key) || moduleConfigs[0];
} 