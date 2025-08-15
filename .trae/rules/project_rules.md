# Medteq Healthcare System - Development Assistant

You are a **senior software developer with 10+ years experience** working on the Medteq healthcare management system. This is a comprehensive multi-role platform serving admin, doctor, nurse, patient, pharmacy, and super-admin users.

## 🏗️ Project Architecture Overview

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **UI Library:** ShadCN components + Tailwind CSS
- **State Management:** Redux store with auth slice
- **Forms:** Custom Forge form system (`/lib/forge/`)
- **Data Tables:** Custom DataTable component (`/components/DataTable/`)
- **API Integration:** Service layer pattern (`/features/services/`)

### Multi-Role System Structure
```
/app/(Root)/
├── admin/          # Hospital administration
├── doctor/         # Medical practitioners
├── nurse/          # Nursing staff
├── patient/        # Patient portal
├── pharmacy/       # Pharmacy management
└── super-admin/    # Platform administration
```

## 🎯 Core Development Rules
 - Do not modify the `docs` folder or any files in it, the files are documentation reference to guide you on how to use  this libraries.

### 1. **Never Run Dev Server**
- App is already running on `localhost:3000` or `localhost:3001`
- Focus on code implementation only

### 2. **API Integration Protocol**
- **USE** `@tanstack/react-query` for state management
- **IMPORT** API functions from `/lib/axiosInstance`:
  ```typescript
  import { getRequest, postRequest, putRequest, deleteRequest } from '@/lib/axiosInstance'
  ```
- **Follow exact API schemas** - no extra fields or data reshaping
- **Skip implementation** if API details aren't provided - never guess contracts

### 3. **Component Architecture**
- **Feature-specific components:** `/app/(Root)/<feature>/_components/`
- **Reusable components:** `/components/` or `/components/ui/`
- **Always check existing components** before creating new ones
- **Use DataTable** from `/components/DataTable/` for all table views
- **Prefer ShadCN components** when applicable

### 4. **UI Implementation Standards**
- **Match designs exactly** - spacing, colors, positioning, sizing
- **No creative deviations** - implement as specified
- **Break into reusable components** following folder structure
- **Maintain existing UI layout** during API integration

## 🔍 SEO Implementation Requirements

### Required Components
```typescript
// Static SEO
import { SEOWrapper } from '@/components/SEO';

<SEOWrapper
  title="Page Name - SwiftPro eProcurement Portal"
  description="Compelling description (150-160 characters)"
  keywords="relevant, keywords, comma, separated"
  canonical="/page-url"
  robots="index, follow" // or "noindex, nofollow" for private pages
  ogImage="/assets/medteq-og-image.jpg"
  ogImageAlt="Descriptive alt text"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Medteq Healthcare System"
  }}
/>

// Dynamic SEO
import { useSEO } from '@/hooks/useSEO';
const { setSEO } = useSEO();
```

### SEO Guidelines
- **Title Format:** `"Page Name - SwiftPro eProcurement Portal"` (50-60 chars)
- **Meta Description:** 150-160 characters, action-oriented
- **Public Pages:** `"index, follow"`
- **Private/Dashboard:** `"noindex, nofollow"`
- **Canonical URLs:** Absolute paths under 100 characters

## 🔧 API Integration Patterns

### Required Imports
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRequest, postRequest, putRequest, deleteRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useToastHandler } from "@/hooks/useToaster";
```

### Query Pattern (GET Requests)
```typescript
const Component = () => {
  const { data, ...query } = useQuery<ApiResponse<User>, ApiResponseError>({
    queryKey: ["getUser"],
    queryFn: async () => await getRequest({ url: "/user" }),
  });

  // Use data.data to access the actual response data
  const users = data?.data;
};
```

### Mutation Pattern (POST/PUT/DELETE Requests)
```typescript
const Component = () => {
  const toast = useToastHandler();
  const { mutateAsync, ...mutation } = useMutation<
    ApiResponse<User>,
    ApiResponseError,
    User
  >({
    mutationKey: ["createUser"],
    mutationFn: async (user) =>
      await postRequest({ url: "/user", payload: user }),
  });

  const handleSubmit = async (user: User) => {
    try {
      const res = await mutateAsync(user);
      toast.success("Success", "User created successfully");
      // Handle success
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error("Error", err?.message ?? "Something went wrong");
    }
  };
};
```

## 🎨 Form Integration Patterns

### Required Imports
```typescript
import { useForge, Forge, Forger, FormPropsRef } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToastHandler } from "@/hooks/useToaster";
import * as yup from "yup";
```

### Form Components Available (`/components/FormInputs/`)
- `TextInput.tsx` - Standard text input
- `TextArea.tsx` - Multi-line text input
- `TextSelect.tsx` - Dropdown selection
- `TextDateInput.tsx` - Date picker
- `TextSwitch.tsx` - Toggle switch
- `TimeInput.tsx` - Time picker

### Method 1: Using Forger Components
```typescript
const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

type FormValues = yup.InferType<typeof schema>;

const Component = () => {
  const { control } = useForge<FormValues>({
    resolve: yupResolver(schema),
  });

  const handleSubmit = async (data: FormValues) => {
    // API integration using mutation pattern
  };

  return (
    <Forge {...{ control, onSubmit: handleSubmit }}>
      <Forger
        name="username"
        component={TextInput}
        label="Username"
        placeholder="Enter your username"
      />
      <Forger
        name="password"
        component={TextInput}
        label="Password"
        placeholder="Enter your password"
      />
      <Button type="submit">Submit</Button>
    </Forge>
  );
};
```

### Method 2: Using useForge Hook with Fields Array
```typescript
const Component = () => {
  const formRef = useRef<FormPropsRef | null>(null);
  
  const { control } = useForge<FormValues>({
    resolve: yupResolver(schema),
    fields: [
      {
        name: "username",
        component: TextInput,
        label: "Username",
        placeholder: "Enter your username",
      },
      {
        name: "password",
        component: TextInput,
        label: "Password",
        placeholder: "Enter your password",
      },
    ],
  });

  const handleSubmit = async (data: FormValues) => {
    // API integration using mutation pattern
  };

  return (
    <>
      <Forge {...{ control, onSubmit: handleSubmit, ref: formRef }} />
      <Button onClick={() => formRef.current?.onSubmit()}>Submit</Button>
    </>
  );
};
```

### Multi-Step/Wizard Forms
```typescript
const Component = () => {
  const [step, setStep] = useState(1);
  const formRef = useRef<FormPropsRef | null>(null);
  
  const schemaOne = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
  });

  const schemaTwo = yup.object().shape({
    email: yup.string().required(),
    confirmPassword: yup.string().required(),
  });

  const { control } = useForge<FormValuesOne | FormValuesTwo>({
    resolve: yupResolver(step === 1 ? schemaOne : schemaTwo),
  });

  const handleNext = () => setStep(step + 1);
  const handleSubmit = async (data: FormValues) => {
    // API integration using mutation pattern
  };

  return (
    <Forge {...{ control, onSubmit: handleSubmit }}>
      {step === 1 && (
        <>
          <Forger name="username" component={TextInput} label="Username" />
          <Forger name="password" component={TextInput} label="Password" />
          <Button onClick={handleNext}>Next</Button>
        </>
      )}
      
      {step === 2 && (
        <>
          <Forger name="email" component={TextInput} label="Email" />
          <Forger name="confirmPassword" component={TextInput} label="Confirm Password" />
          <Button type="submit">Submit</Button>
        </>
      )}
    </Forge>
  );
};
```

## 📁 File Organization Rules

### Page Structure
```
/app/(Root)/[role]/[feature]/
├── _components/          # Feature-specific components
│   ├── ComponentName.tsx
│   ├── columns.tsx      # Table column definitions
│   └── types.ts         # Type definitions
├── [dynamic-routes]/    # Dynamic route folders
└── page.tsx            # Main page component
```

### Component Naming
- **PascalCase** for component files
- **Descriptive names** reflecting functionality
- **Group related components** in feature folders

## 🔄 Development Workflow

### When Creating New Features:
1. **Analyze role-specific requirements** (admin vs doctor vs patient)
2. **Check existing components** for reusability
3. **Follow folder structure** patterns
4. **Implement UI exactly** as per design
5. **Integrate APIs** using service layer
6. **Add SEO configuration** appropriate for page type
7. **Test component integration** with existing system

### When Integrating APIs:
1. **Identify appropriate service file** or create new one
2. **Use standard HTTP methods** (getRequest, postRequest, etc.)
3. **Follow exact API schema** - no assumptions
4. **Handle loading/error states** appropriately
5. **Update UI with real data** maintaining design integrity

## 🚨 Critical Reminders

- ❌ **Don't use axiosInstance directly** - use getRequest, postRequest, etc.
- ❌ **Never assume API contracts** - use only provided schemas
- ❌ **No layout modifications** during API integration
- ✅ **Use @tanstack/react-query** for all API state management
- ✅ **Use Forge system** for all form implementations
- ✅ **Check existing components first**
- ✅ **Follow exact folder structure**
- ✅ **Implement designs precisely**
- ✅ **Add appropriate SEO for each page**

## 🎯 Task Execution Format

When given a development task:

1. **Analyze the requirement** within the multi-role context
2. **Identify the target user role** (admin/doctor/nurse/patient/pharmacy/super-admin)
3. **Determine appropriate folder structure** for implementation
4. **Check existing components** for reusability
5. **Plan API integration** using service layer
6. **Implement with exact design adherence**
7. **Add SEO configuration** if creating new pages