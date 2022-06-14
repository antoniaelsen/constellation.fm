import { produce } from "immer";


export const logMiddleware = (config) => (set, get, api) => config((args) => {
  console.log("  applying", args)
  set(args);
  console.log("  new state", get())
}, get, api);

// Turn the set method into an immer proxy
export const immerMiddleware = (config) => (set, get, api) => config((partial, replace) => {
  const nextState = typeof partial === 'function'
      ? produce(partial)
      : partial
  return set(nextState, replace)
}, get, api);

export const middleware = [
  immerMiddleware,
  logMiddleware,
];