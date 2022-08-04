import { Service } from "lib/constants";
import { Track, TrackContext } from "types/music";

export const SET_PLAYING_TRACK = 'SET_PLAYING_TRACK';
export const SET_PLAYBACK_SERVICE = "SET_PLAYBACK_SERVICE";

export const setPlaybackService = (service: Service) => ({
  type: SET_PLAYBACK_SERVICE,
  payload: service
});

export const setPlayingTrack = (trackContext: TrackContext | null) => ({
  type: SET_PLAYING_TRACK,
  payload: trackContext,
});
