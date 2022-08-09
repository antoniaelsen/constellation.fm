import React, { useCallback } from "react";
import { Context as SContext, useSpotifyPlayer, config as sconfig } from "use-spotify-player";
import { styled } from "@mui/material/styles";

import config from "config";
import { StyledBox } from "components/StyledBox";
import { SongInfo } from "components/SongInfo";
import { Service } from "lib/constants";
import { DeviceMenu } from "./DeviceMenu";
import { ServicePlaybackProps } from "../ServicePlayback";
import { PlayControls } from "../PlayControls";
import { Context } from "types/music";

const POLL_PERIOD = 1000; // ms
sconfig.api = config.api.spotify;

const transformContext = (ctx: SContext): Context => {
  const { id: serviceId, type } = ctx;
    const service = Service.SPOTIFY;
    const id = `${service}-${type}-${serviceId}`;
    return{
      ...ctx,
      id,
      service,
      serviceId,
    };
}

export const PlaybackBox = styled(StyledBox)(({ theme }) => ({
  display: "grid", 
  gridTemplateColumns: "25% 50% 25%",
  flex: 1,
  padding: theme.spacing(2),
}));

interface SpotifyPlaybackProps extends ServicePlaybackProps {
}

export const SpotifyPlayback = (props: SpotifyPlaybackProps) => {
  const { token, setPlayingContext } = props;

  const handlePlayingContext = useCallback((ctx: SContext | null) => {
    if (!ctx) {
      setPlayingContext(ctx);
      return;
    }

    setPlayingContext(transformContext(ctx));
  }, [setPlayingContext]);

  const {
    context,
    deviceId,
    devices,
    disabled,
    duration,
    paused,
    position,
    repeat,
    shuffle,
    volume,
    handleNextTrack,
    handlePlay,
    handlePreviousTrack,
    handleRepeat,
    handleSeek,
    handleShuffle,
    handleVolumeChange,
    getAvailableDevices,
    transferPlayback,
  } = useSpotifyPlayer({
    token,
    pollPeriod: POLL_PERIOD,
    onContextChanged: handlePlayingContext
  });

  return (
    <PlaybackBox>
      <StyledBox sx={{ display: "flex", gridColumn: 1, gridRow: 1, overflow: "hidden" }}>
        {context?.current && <SongInfo track={context?.current} imageWidth={48} hideAlbum={true}/>}
      </StyledBox>
      
      <PlayControls
        disabled={disabled}
        duration={duration}
        paused={paused}
        position={position}
        repeat={repeat}
        shuffle={shuffle}
        onPlay={() => handlePlay(true)}
        onPause={() => handlePlay(false)}
        onNextTrack={handleNextTrack}
        onPreviousTrack={handlePreviousTrack}
        onRepeat={handleRepeat}
        onSeek={handleSeek}
        onShuffle={handleShuffle}
        boxProps={{ sx: { gridColumn: 2, gridRow: 1 } }}
      />

      <DeviceMenu
        boxProps={{ sx: { justifySelf: "flex-end", gridColumn: 3, gridRow: 1 }}}
        deviceId={deviceId}
        devices={devices}
        disabled={disabled}
        volume={volume}
        onVolume={handleVolumeChange}
        getAvailableDevices={getAvailableDevices}
        transferPlayback={transferPlayback}
      />

    </PlaybackBox>
  );
}
