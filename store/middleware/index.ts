import { StateCreator, StoreMutatorIdentifier } from "zustand";

type TLoggerFn = (actionName: string, args: unknown[]) => void;

type TLogger = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  logger?: TLoggerFn
) => StateCreator<T, Mps, Mcs>;

type TLoggerImpl = <T>(
  storeInitializer: StateCreator<T, [], []>,
  logger: TLoggerFn
) => StateCreator<T, [], []>;

const logger: TLoggerImpl = (config, logger) => (set, get, api) => {
  const originalConfig = config(set, get, api) as any;
  let actions = originalConfig["actions"] as any;

  if (actions && typeof actions === "object") {
    const newActions = Object.fromEntries(
      Object.entries(actions).map(([actionName, actionFn]) => {
        let enhancedFn = actionFn;
        if (typeof actionFn === "function") {
          enhancedFn = (...args: unknown[]) => {
            const ret = actionFn(...args);
            logger(actionName, args);
            return ret;
          };
        }
        return [actionName, enhancedFn];
      })
    );

    // Spread originalConfig and overwrite the actions property
    return { ...originalConfig, actions: newActions };
  }
  return originalConfig;
};

export const zustandLogger = logger as unknown as TLogger;