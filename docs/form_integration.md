## This how to implement the form integration

1. Use the `forge` to manage the form state
2. Use `yup` to validate the form
3. There are two ways to structure the form, either using Forger or passing array of fields to useForge hook

## Here is the sample implementation

### Using Forger

```tsx
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForge, Forger, Forge } from "forge";
import { Button } from "@/components/ui/button";
import * as yup from "yup";

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
    // rest of the api integration
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

### Using useForge hook

```tsx
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForge, FormPropsRef } from "forge";
import { Button } from "@/components/ui/button";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

type FormValues = yup.InferType<typeof schema>;

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
    // rest of the api integration
  };

  return (
    <>
      <Forge {...{ control, onSubmit: handleSubmit, ref: formRef }} />
      <Button onClick={() => formRef.current?.onSubmit()}>Submit</Button>
    </>
  );
};
```
