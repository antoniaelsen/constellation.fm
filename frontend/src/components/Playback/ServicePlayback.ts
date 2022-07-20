import { Track } from "types/music";

export interface ServicePlaybackProps {
  token: string;
  track: Track | null;
};
