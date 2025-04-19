'use client';

import { usePathname } from 'next/navigation';
import { getModuleByPathname, getModuleByKey, type ModuleConfig } from '@/app/(Root)/config/modules';

/**
 * Custom hook to access the current module configuration
 * @param moduleKey Optional module key to override pathname-based detection
 * @returns The module configuration and utility functions
 */
export function useModule(moduleKey?: string) {
  const pathname = usePathname();
  
  // Get the module configuration either from the provided key or from the pathname
  const moduleConfig: ModuleConfig = moduleKey 
    ? getModuleByKey(moduleKey) 
    : getModuleByPathname(pathname);
  
  /**
   * Check if a path is active in the current module
   * @param href The path to check
   * @returns Boolean indicating if the path is active
   */
  const isActivePath = (href: string) => {
    return pathname?.startsWith(`${moduleConfig.pathPrefix}${href}`);
  };
  
  /**
   * Generate a full path for a route in the current module
   * @param href The relative path within the module
   * @returns The full path including the module prefix
   */
  const getModulePath = (href: string) => {
    return `${moduleConfig.pathPrefix}${href}`;
  };
  
  return {
    moduleConfig,
    isActivePath,
    getModulePath,
    userProfile: moduleConfig.defaultUserProfile,
  };
} 