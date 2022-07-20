import { AuthState } from "../types/auth";
import { ConstellationState } from "../types/constellation";
import { MusicState } from "../types/music";

export interface RootState {
  auth: AuthState,
  constellation: ConstellationState,
  music: MusicState,
}

export const initialState = {
};


