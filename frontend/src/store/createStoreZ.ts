import create, { GetState, SetState } from 'zustand';
import { compose } from "ramda";
import { devtools } from 'zustand/middleware'
import { middleware } from "./middleware";
import slices from "./slices";

const mainSlice = (set: SetState<any>, get: GetState<any>) => Object.entries(slices).reduce((acc, [name, slice]) => {
  console.log(name, slice);
  return {
    ...acc,
    ...slice(set, get),
  };
}, {});

export const useStore = compose(
  create,
  devtools,
  ...middleware,
)(mainSlice);
