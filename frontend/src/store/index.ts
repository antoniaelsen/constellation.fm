import { AuthState } from "./types/auth";
import { ConstellationState } from "./types/constellation";
import { MusicState } from "./types/music";

export interface RootState {
  // application: ApplicationState,
  auth: AuthState,
  constellation: ConstellationState,
  music: MusicState,
}

export const initialState = {
  auth: {
    isAuthenticated: false,
    connections: [],
    tokens: {},
  }
};


