"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuthorities } from "@/store/authSlice";
import { getRequiredPermissionForPath } from "@/lib/permissions";
import { getModuleByPathname } from "@/app/(Root)/config/modules";

export default function RoutePermissionGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authorities = useAuthorities();

  // Determine the module key from the current pathname
  const moduleKey = getModuleByPathname(pathname).key;

  // Resolve required permission for current route (if any)
  const required = pathname
    ? getRequiredPermissionForPath(moduleKey, pathname)
    : undefined;

  // If no permission required, or user has it, render children
  const allowed = !required || (authorities && authorities.includes(required));

  if (allowed) return <>{children}</>;

  return (
    <div className="p-8">
      <div className="max-w-xl mx-auto bg-white border rounded-md p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Access Restricted</h2>
        <p className="text-sm text-gray-600">
          You do not have permission to access this page. Contact your admin if you believe this is an error.
        </p>
      </div>
    </div>
  );
}