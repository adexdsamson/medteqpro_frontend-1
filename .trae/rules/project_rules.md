## Base Rules

## Important Notice
1. Do not start the local server, the project is currently running on localhost:5173
2. Whenever you are implementing the API integration, use the provided API endpoints and request body formats, do not assume or suggest an API that is not provided.
3. Always stick to the information provided to you, do not make assumptions about the data you will get from the API.
4. Do not change the UI structure while implementing the APIs, if not available, skip it.


## Implementation of the UI
1. Follow exactly how the Image UI design provided, both to pixel perfect sizes, color and to the exact position.


## Implementation of API 
1. Never use the axiosInstance directly, always use the getRequest, postRequest, deleteRequest and putRequest functions from the api folder.

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