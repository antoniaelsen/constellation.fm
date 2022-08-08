import { Track, Context } from "types/music";

export interface ServicePlaybackProps {
  token: string;
  track: Track | null;
  setPlayingContext: (trackContext: Context | null) => void;
};
