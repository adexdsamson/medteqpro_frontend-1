import { create } from "zustand";
import { persist, combine, PersistOptions } from "zustand/middleware";
import {
  createSelectorHooks,
  ZustandHookSelectors,
  createSelectorFunctions,
  ZustandFuncSelectors,
} from "auto-zustand-selectors-hook";
import { User } from "../types";
import { zustandLogger } from "./middleware";
// import { getLoginUser, getLoginToken } from "@/demo";

type InitialState = {
  user: User | null;
  token: string | null;
  refresh: string | null;
  authorities: string[];
  loginToken: string | null;
};

type Actions = {
  setReset: () => void;
  setUser: (user: InitialState["user"]) => void;
  setToken: (user: InitialState["token"]) => void;
  setLoginToken: (user: InitialState["loginToken"]) => void;
  setRefreshToken: (user: InitialState["refresh"]) => void;
  setAuthorities: (user: InitialState["authorities"]) => void;
};

const initialState: InitialState = {
  user: null,
  token: null,
  refresh: null,
  authorities: [],
  loginToken: null,
};

const reducer = combine(initialState, (set) => ({
  setUser: (user: InitialState["user"]) => set({ user }),
  setToken: (token: InitialState["token"]) => set({ token }),
  setRefreshToken: (refresh: InitialState["refresh"]) => set({ refresh }),
  setLoginToken: (loginToken: InitialState["loginToken"]) =>
    set({ loginToken }),
  setAuthorities: (authorities: InitialState["authorities"]) => {
    set({ authorities });
  },
  setReset: () => {
    set(initialState);
  },
}));

// const logger = (config: any) => (set: any, get: any, api: any) => {
//   return config(
//     (args: any) => {
//       console.log("store is applying", args);
//       set(args);
//       console.log("store new state", get());
//     },
//     get,
//     api
//   );
// };

type Selectors = InitialState & Actions;

const persistConfig: PersistOptions<Selectors> = {
  name: "fss",
};

const baseReducer = create(
  persist(
    zustandLogger(reducer, (fnName, fnArgs) => {
      console.log(`${fnName} called with ${fnArgs}`);
    }),
    persistConfig
  )
);

export const {
  useUser,
  useSetUser,
  useToken,
  useRefresh,
  useSetToken,
  useSetReset,
  useLoginToken,
  useAuthorities,
  useSetLoginToken,
  useSetAuthorities,
  useSetRefreshToken,
} = createSelectorHooks(baseReducer) as typeof baseReducer &
  ZustandHookSelectors<Selectors>;

export const authSlice = createSelectorFunctions(
  baseReducer
) as typeof baseReducer & ZustandFuncSelectors<Selectors>;

export const storeFunctions = createSelectorFunctions(
  baseReducer
) as typeof baseReducer & ZustandFuncSelectors<Selectors>;