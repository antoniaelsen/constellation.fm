import { AuthState } from "../types/auth";
import { ConstellationState } from "../types/constellation";
import { MusicState } from "../types/music";
import { SettingsState } from "../types/settings";

export interface RootState {
  auth: AuthState,
  constellation: ConstellationState,
  music: MusicState,
  settings: SettingsState,
}

export const initialState = {
};


