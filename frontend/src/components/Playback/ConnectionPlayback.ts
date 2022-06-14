import { Track } from "store/types/music";

export interface ConnectionPlaybackProps {
  token: string;
  track: Track | null;
};
