## This is how to implement the API integration

1. Use the `/lib/axiosInstance` to make the request
2. Use the `@tanstack/react-query` to manage the state

## Here is the sample implementation

# Query

```tsx
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "lib/axiosInstance";
import { ApiResponse, ApiResponseError, User } from "@/types";

const Component = () => {
  const { data, ...query } = useQuery<ApiResponse<User>, ApiResponseError>({
    queryKey: ["getUser"],
    queryFn: async () => await getRequest({ url: "/user" }),
  });

  //..rest of the code
};
```

# Mutation

```tsx
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "lib/axiosInstance";
import { ApiResponse, ApiResponseError, User } from "@/types";
import { useForm, Forge } from "lib/forge";
import { useToastHandler } from "@/hooks/useToaster";

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

        //..rest of the code
    } catch (error) {
      console.log(error);
      const err = error as ApiResponseError;
      toast.error("ERR_TITLE", err ?? "ERR_DESC")
    }
  };

  //..rest of the code
};
```
