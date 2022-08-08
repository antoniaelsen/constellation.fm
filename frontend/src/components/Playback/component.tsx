import React from "react";

import { Service } from "lib/constants";
import { Context } from "types/music";
import { ServicePlaybackProps } from "./ServicePlayback";
import { NoPlayback } from "./NoPlayback";
import { PlaybackBox } from "./PlaybackBox";
import { SpotifyPlayback } from "./SpotifyPlayback";

/**
 * Passing track to component
 * - Set track in redux
 * 
 * - Extract service, from track or state
 * - Confirm that connection is available (token in store)
 * - Render appropriate component
 */


const connectionComponents: { [key: string]: React.FC<ServicePlaybackProps> } = {
  [Service.SPOTIFY]: SpotifyPlayback,
};



interface PlaybackProps {
  connectionTokens: { [key: string]: string | null };
  setPlayingContext: (trackContext: Context | null) => void;
}

export const Playback = (props: PlaybackProps) => {
  const { connectionTokens, setPlayingContext } = props;

  const service = Service.SPOTIFY; // TODO(aelsen)
  const token = connectionTokens[service!];
  const track = null;

  const ServicePlayback = (service && token) ? connectionComponents[service!] : NoPlayback;

  return (
    <>
      <PlaybackBox>
        <ServicePlayback token={token!} track={track!} setPlayingContext={setPlayingContext} />
      </PlaybackBox>
    </>
  );
}