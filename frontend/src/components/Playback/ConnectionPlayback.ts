import { Track } from "store/music/types";

export interface ConnectionPlaybackProps {
  token: string;
  track: Track | null;
};
