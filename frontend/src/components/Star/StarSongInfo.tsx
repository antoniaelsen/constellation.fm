import React from 'react';
import { Typography } from '@mui/material';

import { StyledBox } from 'components/StyledBox';
import { StyledLink } from 'components/StyledLink';
import { Track } from 'types/music';

const IMG_WIDTH = 72;

interface StarSongInfoProps {
  imageWidth?: number;
  hideAlbum?: boolean;
  hideImage?: boolean;
  track: Track;
};


export const StarSongInfo = (props: StarSongInfoProps) => {
  const { imageWidth = IMG_WIDTH, hideAlbum, hideImage, track } = props;
  const { artists, album, name, url } = track;

  return (
    <StyledBox sx={{ display: "flex", alignItems: "center", userSelect: "none" }}>
      {!hideImage && (
        <StyledBox sx={{ display: "flex", mr: 2 }}>
          <img
            alt={`Album art for ${album.name}`}
            style={{ borderRadius: imageWidth / 2 }}
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
            <React.Fragment key={url}>
              {i > 0 && <Typography sx={{ display: "inline-block", mr: 1 }} variant="caption">, </Typography>}
              <StyledLink key={url} href={url} variant="caption">{name}</StyledLink>
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