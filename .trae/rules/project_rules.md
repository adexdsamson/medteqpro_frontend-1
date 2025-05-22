## Base Rules

1. Always check if components from the Figma design already exist in the project—**reuse them** instead of creating new ones.
2. Follow the existing **code style** and formatting conventions of the project.
3. Apply accurate **units** for dimensions and spacing as per the design.
7. Before implementation, **download the Figma files** and review them thoroughly. Do not guess or make assumptions.
8. Write code as an experienced software engineer familiar with the project’s tech stack and framework. Do not implement what was not requested.
6. **IMPORTANT:** Never alter the UI design during API integration unless explicitly instructed.
9. Use **ShadCN components** where applicable; if not available, install the required component.
10. This project uses the following components mostly: Card: `/components/ui/card`, DataTable: `/components/DataTable`, Tabs: `/components/ui/card`, Button: `/components/ui/button`
11. Only extend the above components to fit into the UI design but do not override the existing functionality or UI design of the components.
12. Use the image attached to understand the design and use the figma link provided to get the necessary assets.
14. Use `@faker-js/faker` for demo data to render on the pages.
15. The Sidebar and the Header component already exist in the project. The SubHeader component is always added under the Header component.
16. **IMPORTANT:** Do not change or modify UI elements **outside the scope of your assigned implementation**.
17. **Download UI assets** (icons, images, etc.) from Figma, move them to the `/public` folder, and reference them in the code.
18. Use the `/hooks/useToaster` hook for displaying toasts.

# Form State Management
1. Always use the **`useForge`** hook from **`/lib/forge`** for form state management.
2. Use `Forger` to wrap the Input component and below is an example usage:
```
    const { control } = useForge({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });
    <Forge control={control} onSubmit={handleSubmit}>
        <Forger
            control={control}
            name="name"
            render={({ field }) => (
                <Input
                    {...field}
                    placeholder="Name"
                />
            )}
        />
        <button type="submit">Submit</button>
    </Forge>
```

# API Integration
1. Use the existing `axiosInstance` with **`react-query`’s `useQuery` and `useMutation`** hooks for all API operations.
2. Use `@tanstack/react-query` useQuery and useMutation with axios to handle the API, 
3. Use the `/features` for the logic of each module 
here is an example below 
```
    <!-- /feature/auth/service.ts -->
    export const useLogin = () => {
        return useQuery<ApiResponse<LoginType>, ApiResponseError, { email: string, password: string }>({
            mutationKey: ["login"],
            mutationFn: async (payload) => await postRequest("/", payload)
        })
    }

    <!-- /app/(auth)/sign-in -->
    const { mutateAsync } = useLogin()

    const handleSubmit = async (data: FormState) => {
        try {
            const res = await mutateAsync(data)
        } catch (error) {
            const err = error as ApiResponseError;
        }
    }
```

3. Use the **`useFieldArray`** hook to manage arrays of fields.
4. Use the **`usePersist`** hook to persist form data.

Here is the project structure:
```

├───.next
│   ├───build
│   │   └───chunks
│   ├───cache
│   │   └───images
│   │       └───y0yuivbwkIOTxZGDiWwPbF4vKpXQwUBXBqpAtP2vaCU
│   ├───server
│   │   ├───app
│   │   │   ├───(auth)
│   │   │   │   └───sign-in
│   │   │   │       └───page
│   │   │   ├───(Root)
│   │   │   │   ├───admin
│   │   │   │   │   ├───bed-management
│   │   │   │   │   │   └───page
│   │   │   │   │   ├───dashboard
│   │   │   │   │   │   └───page
│   │   │   │   │   └───patients
│   │   │   │   │       ├───page
│   │   │   │   │       └───[patientId]
│   │   │   │   │           └───add-vital-signs
│   │   │   │   │               └───page
│   │   │   │   └───nurse
│   │   │   │       └───dashboard
│   │   │   │           └───page
│   │   │   ├───favicon.ico
│   │   │   │   └───route
│   │   │   └───_not-found
│   │   │       └───page
│   │   ├───chunks       
│   │   │   └───ssr      
│   │   └───pages        
│   │       ├───_app     
│   │       ├───_document
│   │       └───_error   
│   ├───static
│   │   ├───chunks       
│   │   │   └───pages  
│   │   ├───development
│   │   └───media      
│   └───types
├───.qodo
├───.trae
│   └───rules
├───app
│   ├───(auth)
│   │   └───sign-in
│   │       └───_components
│   └───(Root)
│       ├───admin
│       │   ├───bed-management
│       │   │   └───_components
│       │   ├───dashboard
│       │   │   └───_components
│       │   ├───patients
│       │   │   ├───[patientId]
│       │   │   │   └───add-vital-signs
│       │   │   └───_components
│       │   └───visitation-frequency
│       ├───config
│       ├───doctor
│       │   └───dashboard
│       ├───nurse
│       │   └───dashboard
│       ├───patient
│       │   ├───book-appointment
│       │   ├───dashboard
│       │   │   └───_components
│       │   ├───doctors-note
│       │   │   └───_components
│       │   ├───lab-result
│       │   │   ├───[id]
│       │   │   └───_components
│       │   ├───prescription
│       │   └───profile
│       ├───super-admin
│       │   ├───clients
│       │   ├───dashboard
│       │   │   └───_components
│       │   ├───profile
│       │   │   └───_components
│       │   ├───reports
│       │   │   └───[slug]
│       │   ├───settings
│       │   │   └───layout
│       │   ├───staff
│       │   └───support
│       │       └───_components
│       └───_components
├───components
│   ├───ConfirmAlert
│   ├───DataTable
│   ├───FormInputs
│   └───ui
├───demo
├───features
│   ├───schema
│   ├───services
│   └───components
├───hooks
│   └───useToaster
├───lib
│   └───forge
│       ├───Forge
│       ├───Forger
│       ├───useFieldArray
│       ├───useForge
│       └───usePersist
├───public
│   └───assets
│       └───admin-dashboard
└───store
    └───middleware
```