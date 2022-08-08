import { Service } from "lib/constants";
import { Context } from "types/music";

export const SET_PLAYING_CONTEXT = 'SET_PLAYING_CONTEXT';
export const SET_PLAYBACK_SERVICE = "SET_PLAYBACK_SERVICE";

export const setPlaybackService = (service: Service) => ({
  type: SET_PLAYBACK_SERVICE,
  payload: service
});

export const setPlayingContext = (trackContext: Context | null) => ({
  type: SET_PLAYING_CONTEXT,
  payload: trackContext,
});
