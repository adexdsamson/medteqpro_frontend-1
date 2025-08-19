/**
 * Centralized status color utility for consistent badge styling across all DataTables
 */

export type StatusType = 
  // Queue/Process statuses
  | 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  // Appointment statuses
  | 'upcoming' | 'rescheduled'
  // Lab/Medical test statuses
  | 'pending' | 'draft'
  // Staff statuses
  | 'active' | 'inactive' | 'on_leave' | 'suspended'
  // Generic statuses
  | 'approved' | 'rejected' | 'processing' | 'expired';

export interface StatusColorConfig {
  background: string;
  text: string;
  hover: string;
}

/**
 * Get status color configuration for badges
 * @param status - The status value (case-insensitive)
 * @returns StatusColorConfig object with background, text, and hover colors
 */
export const getStatusColors = (status: string): StatusColorConfig => {
  const normalizedStatus = status.toLowerCase().replace(/[\s_-]/g, '_') as StatusType;
  
  const statusColorMap: Record<StatusType, StatusColorConfig> = {
    // Success/Completed states - Green
    completed: {
      background: 'bg-green-100',
      text: 'text-green-800',
      hover: 'hover:bg-green-200'
    },
    active: {
      background: 'bg-green-100',
      text: 'text-green-800',
      hover: 'hover:bg-green-200'
    },
    approved: {
      background: 'bg-green-100',
      text: 'text-green-800',
      hover: 'hover:bg-green-200'
    },
    
    // Warning/Pending states - Yellow/Orange
    waiting: {
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-200'
    },
    pending: {
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-200'
    },
    rescheduled: {
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-200'
    },
    on_leave: {
      background: 'bg-yellow-100',
      text: 'text-yellow-800',
      hover: 'hover:bg-yellow-200'
    },
    processing: {
      background: 'bg-orange-100',
      text: 'text-orange-800',
      hover: 'hover:bg-orange-200'
    },
    
    // Info/Progress states - Blue
    in_progress: {
      background: 'bg-blue-100',
      text: 'text-blue-800',
      hover: 'hover:bg-blue-200'
    },
    upcoming: {
      background: 'bg-blue-100',
      text: 'text-blue-800',
      hover: 'hover:bg-blue-200'
    },
    
    // Error/Danger states - Red
    cancelled: {
      background: 'bg-red-100',
      text: 'text-red-800',
      hover: 'hover:bg-red-200'
    },
    suspended: {
      background: 'bg-red-100',
      text: 'text-red-800',
      hover: 'hover:bg-red-200'
    },
    rejected: {
      background: 'bg-red-100',
      text: 'text-red-800',
      hover: 'hover:bg-red-200'
    },
    expired: {
      background: 'bg-red-100',
      text: 'text-red-800',
      hover: 'hover:bg-red-200'
    },
    
    // Neutral/Draft states - Gray
    draft: {
      background: 'bg-gray-100',
      text: 'text-gray-800',
      hover: 'hover:bg-gray-200'
    },
    inactive: {
      background: 'bg-gray-100',
      text: 'text-gray-800',
      hover: 'hover:bg-gray-200'
    }
  };
  
  return statusColorMap[normalizedStatus] || {
    background: 'bg-gray-100',
    text: 'text-gray-800',
    hover: 'hover:bg-gray-200'
  };
};

/**
 * Get combined CSS classes for status badges
 * @param status - The status value
 * @returns Combined CSS class string
 */
export const getStatusBadgeClasses = (status: string): string => {
  const colors = getStatusColors(status);
  return `${colors.background} ${colors.text} ${colors.hover} border-0`;
};

/**
 * Format status text for display
 * @param status - The status value
 * @returns Formatted status text
 */
export const formatStatusText = (status: string): string => {
  const statusDisplayMap: Record<string, string> = {
    'in_progress': 'In Progress',
    'on_leave': 'On Leave',
    'upcoming': 'Upcoming',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'rescheduled': 'Rescheduled',
    'pending': 'Pending',
    'draft': 'Draft',
    'active': 'Active',
    'inactive': 'Inactive',
    'suspended': 'Suspended',
    'waiting': 'Waiting',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'processing': 'Processing',
    'expired': 'Expired'
  };
  
  const normalizedStatus = status.toLowerCase().replace(/[\s_-]/g, '_');
  return statusDisplayMap[normalizedStatus] || status.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};