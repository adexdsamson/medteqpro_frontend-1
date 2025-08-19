# Profile API Implementation for All User Roles

This document explains the implementation of profile API services for all user roles in the Medteq Healthcare System using the Auth folder endpoints.

## Overview

The profile API implementation uses the standardized `/auth/user/` endpoints from the Auth folder in the API documentation for all user roles:

- **GET** `/auth/user/` - Retrieve user profile
- **PATCH** `/auth/user/` - Update user profile

## Available Services

### 1. Auth Service (`features/auth/service.ts`)

Contains the original auth-specific profile hooks:

```typescript
import { useGetUserProfile, useUpdateUserProfile } from '@/features/auth/service';

// Get user profile
const { data: profile, isLoading, error } = useGetUserProfile();

// Update user profile
const { mutateAsync: updateProfile } = useUpdateUserProfile();
```

### 2. Profile Service (`features/services/profileService.ts`)

Updated to use the correct `/auth/user/` endpoint:

```typescript
import { useGetProfile, useUpdateProfile } from '@/features/services/profileService';

// Get user profile
const { data: profile, isLoading, error } = useGetProfile();

// Update user profile
const { mutateAsync: updateProfile } = useUpdateProfile();
```

### 3. Unified Profile Service (`features/services/unifiedProfileService.ts`)

Comprehensive service with role-specific hooks:

```typescript
import { 
  useGetUserProfile, 
  useUpdateUserProfile,
  useAdminProfile,
  useDoctorProfile,
  useNurseProfile,
  usePatientProfile,
  usePharmacyProfile,
  useLabScientistProfile,
  useFrontDeskProfile,
  useSuperAdminProfile,
  useProfile
} from '@/features/services/unifiedProfileService';
```

## Usage Examples

### Basic Profile Management

```typescript
import { useGetUserProfile, useUpdateUserProfile } from '@/features/services/unifiedProfileService';
import { useToastHandler } from '@/hooks/useToaster';

const ProfileComponent = () => {
  const toast = useToastHandler();
  const { data: profile, isLoading, error } = useGetUserProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();

  const handleUpdateProfile = async (formData) => {
    try {
      await updateProfile(formData);
      toast.success('Success', 'Profile updated successfully');
    } catch (error) {
      toast.error('Error', 'Failed to update profile');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <h1>{profile?.data?.first_name} {profile?.data?.last_name}</h1>
      <p>Email: {profile?.data?.email}</p>
      <p>Role: {profile?.data?.role}</p>
      {/* Update form here */}
    </div>
  );
};
```

### Role-Specific Profile Management

```typescript
// For Doctor role
import { useDoctorProfile } from '@/features/services/unifiedProfileService';

const DoctorProfileComponent = () => {
  const { getProfile, updateProfile } = useDoctorProfile();
  const { data: profile } = getProfile();
  const { mutateAsync: updateDoctorProfile } = updateProfile();

  // Doctor-specific profile logic
};

// For Admin role
import { useAdminProfile } from '@/features/services/unifiedProfileService';

const AdminProfileComponent = () => {
  const { getProfile, updateProfile } = useAdminProfile();
  const { data: profile } = getProfile();
  const { mutateAsync: updateAdminProfile } = updateProfile();

  // Admin-specific profile logic
};
```

### Generic Profile Hook

```typescript
import { useProfile } from '@/features/services/unifiedProfileService';

const GenericProfileComponent = () => {
  const { getProfile, updateProfile } = useProfile();
  const { data: profile } = getProfile();
  const { mutateAsync: updateUserProfile } = updateProfile();

  // Works for any user role
};
```

## Data Types

### UserProfile Interface

```typescript
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone_number?: string;
  specialization?: string;
  role: string;
  is_active: boolean;
  is_staff: boolean;
  avatar?: string;
  hospital?: {
    id: string;
    name: string;
    email?: string;
    phone_number?: string;
    state: string;
    city: string;
    address: string;
    avatar?: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}
```

### UpdateProfilePayload Interface

```typescript
interface UpdateProfilePayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  phone_number?: string;
  specialization?: string;
  avatar?: string;
}
```

## Supported User Roles

All user roles use the same `/auth/user/` endpoint:

- **superadmin** - Super Administrator
- **hospital_admin** - Hospital Administrator
- **doctor** - Medical Doctor
- **nurse** - Nursing Staff
- **patient** - Patient
- **pharmacy** - Pharmacy Staff
- **lab_scientist** - Laboratory Scientist
- **front_desk** - Front Desk Staff

## Features

### Automatic Cache Management
- Automatic query invalidation on profile updates
- 5-minute stale time for profile data
- Retry logic for failed requests

### Auth Store Integration
- Updates auth store with new user data on successful profile updates
- Maintains consistency between profile data and auth state

### Error Handling
- Comprehensive error handling with toast notifications
- Retry mechanisms for network failures
- Type-safe error responses

### Role-Based Access
- Role-specific hooks for specialized use cases
- Generic hooks for common profile operations
- Backward compatibility with existing implementations

## Migration Guide

### From Old Profile Service

```typescript
// Old implementation
import { useGetProfile, useUpdateProfile } from '@/features/services/profileService';

// New implementation (no changes needed)
import { useGetProfile, useUpdateProfile } from '@/features/services/profileService';
// OR use the unified service
import { useGetUserProfile, useUpdateUserProfile } from '@/features/services/unifiedProfileService';
```

### From Auth Service

```typescript
// Old implementation
import { useGetUserProfile, useUpdateUserProfile } from '@/features/auth/service';

// New implementation (no changes needed)
import { useGetUserProfile, useUpdateUserProfile } from '@/features/auth/service';
// OR use the unified service
import { useGetUserProfile, useUpdateUserProfile } from '@/features/services/unifiedProfileService';
```

## Best Practices

1. **Use the unified service** for new implementations
2. **Handle loading and error states** appropriately
3. **Use toast notifications** for user feedback
4. **Validate form data** before sending updates
5. **Use role-specific hooks** when you need role-specific logic
6. **Cache invalidation** is handled automatically

## API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/user/` | Get user profile | Yes (Bearer Token) |
| PATCH | `/auth/user/` | Update user profile | Yes (Bearer Token) |

## Response Format

All endpoints return data in the standard API response format:

```json
{
  "status": true,
  "message": "User details retrieved successfully.",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "doctor",
    // ... other profile fields
  }
}
```