import { Service } from "lib/constants";

export const PLAY_TRACK = 'PLAY_TRACK';
export const SET_PLAYBACK_SERVICE = "SET_PLAYBACK_SERVICE";

export const setPlaybackService = (service: Service) => ({
  type: SET_PLAYBACK_SERVICE,
  payload: service
});

export const playTrack = () => ({
  type: PLAY_TRACK,
});
