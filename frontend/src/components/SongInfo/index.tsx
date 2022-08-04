import React from 'react';
import { Typography } from "@mui/material";

import { StyledBox } from 'components/StyledBox';
import { StyledLink } from 'components/StyledLink';
import { Track } from 'types/music';

const IMG_WIDTH = 72;

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
        <StyledLink color="textPrimary" href={url}>{name}</StyledLink>

        <StyledBox sx={{ display: "flex" }}>
          {artists.map(({ name, url }, i) => (
            <React.Fragment key={name}>
              {i > 0 && <Typography sx={{ display: "inline-block", mr: 1 }} variant="caption">, </Typography>}
              <StyledLink href={url} variant="caption">{name}</StyledLink>
            </React.Fragment>
          ))}
        </StyledBox>
      
        {!hideAlbum && (
          <StyledLink href={album.url} variant="caption">{album.name}</StyledLink>
        )}
      </StyledBox>
    </StyledBox>
  );
};