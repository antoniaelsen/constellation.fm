import { AuthState } from "./auth/types";
import { ConstellationState } from "./constellation/types";
import { MusicState } from "./music/types";

export interface RootState {
  // application: ApplicationState,
  auth: AuthState,
  constellation: ConstellationState,
  music: MusicState,
}

export const initialState = {
  auth: {
    isAuthenticated: false,
    tokens: {},
  }
};


