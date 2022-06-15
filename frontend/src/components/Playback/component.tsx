import React, { useEffect, useState } from "react";

import { Connection } from "rest/constants";
import { ConnectionPlaybackProps } from "./ConnectionPlayback";
import { NoPlayback } from "./NoPlayback";
import { PlaybackContainer } from "./PlaybackContainer";
import { SpotifyPlayback } from "./SpotifyPlayback";

/**
 * Passing track to component
 * - Set track in redux
 * 
 * - Extract connection, from track or state
 * - Confirm that connection is available (token in store)
 * - Render appropriate component
 */


const connectionComponents: { [key: string]: React.FC<ConnectionPlaybackProps> } = {
  [Connection.SPOTIFY]: SpotifyPlayback,
};



interface PlaybackProps {
  connectionTokens: { [key: string]: string | null };
}

export const Playback = (props: PlaybackProps) => {
  const { connectionTokens } = props;

  // const connection = Connection.SPOTIFY; // TODO(aelsen)
  const connection = Connection.SPOTIFY; // TODO(aelsen)
  const token = connectionTokens[connection!];
  const track = null;

  const ConnectionPlayback = (connection && token) ? connectionComponents[connection!] : NoPlayback;

  return (
    <>
      <PlaybackContainer>
        <ConnectionPlayback token={token!} track={track!}/>
      </PlaybackContainer>
    </>
  );
}