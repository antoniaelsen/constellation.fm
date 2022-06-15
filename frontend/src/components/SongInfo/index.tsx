import React from 'react';

import { styled } from "@mui/material/styles";
import { Link, LinkProps, Typography } from "@mui/material";

import { StyledBox } from 'components/StyledBox';
import { Track } from 'store/types/music';

const IMG_WIDTH = 72;

export const SongInfoLink = styled((props: LinkProps) => {
  return (
    <Link color="textPrimary" noWrap={true} underline="hover" {...props} />
  )
})(() => ({
  display: "inline-block",
}));

interface SongInfoProps {
  imageWidth?: number;
  hideAlbum?: boolean;
  hideImage?: boolean;
  track: Track;
};

export const SongInfo = (props: SongInfoProps) => {
  const { imageWidth = IMG_WIDTH, hideAlbum, hideImage, track } = props;
  const { artists, album, name, url } = track;

  return (
    <StyledBox sx={{ display: "flex", alignItems: "center" }}>
      {!hideImage && (
        <StyledBox sx={{ display: "flex", mr: 2 }}>
          <img
            alt={`Album art for ${album.name}`}
            src={album.image.url}
            height={imageWidth}
            width={imageWidth}
          />
        </StyledBox>
      )}

      <StyledBox sx={{ display: "flex", flexFlow: "column nowrap" }}>
        <SongInfoLink href={url}>{name}</SongInfoLink>

        <StyledBox sx={{ display: "flex" }}>
          {artists.map(({ name, url }, i) => (
            <React.Fragment key={url}>
              {i > 0 && <Typography sx={{ display: "inline-block", mr: 1 }} variant="caption">, </Typography>}
              <SongInfoLink href={url} variant="caption">{name}</SongInfoLink>
            </React.Fragment>
          ))}
        </StyledBox>
      
        {!hideAlbum && (
          <SongInfoLink href={album.url} variant="caption">{album.name}</SongInfoLink>
        )}
      </StyledBox>
    </StyledBox>
  );
};