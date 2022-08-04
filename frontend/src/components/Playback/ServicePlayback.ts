import { Track, TrackContext } from "types/music";

export interface ServicePlaybackProps {
  token: string;
  track: Track | null;
  setPlayingTrack: (trackContext: TrackContext | null) => void;
};
