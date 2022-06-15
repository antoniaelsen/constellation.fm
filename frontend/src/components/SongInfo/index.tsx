import React from 'react';

import { Link, LinkProps, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { StyledBox } from 'components/StyledBox';
import { Track } from 'store/types/music';

const IMG_WIDTH = 72;

export const SongInfoLink = (props: LinkProps) => {
  return (
    <Link color="textSecondary" noWrap={true} underline="hover"  {...props} sx={(theme) => {
      return {
        display: "inline-block",
        '&:hover': {
          color: theme.palette.text.primary,
        }
      };
    }}/>
  );
};

interface SongInfoProps {
  imageWidth?: number;
  hideAlbum?: boolean;
  hideImage?: boolean;
  track: Track;
};

export const SongInfo = (props: SongInfoProps) => {
  const { imageWidth = IMG_WIDTH, hideAlbum, hideImage, track } = props;
  const { artists, album, name, url } = track;
  const theme = useTheme();

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
        <SongInfoLink color="textPrimary" href={url}>{name}</SongInfoLink>

        <StyledBox sx={{ display: "flex" }}>
          {artists.map(({ name, url }, i) => (
            <React.Fragment key={url}>
              {i > 0 && <Typography sx={{ display: "inline-block", mr: 1 }} variant="caption">, </Typography>}
              <SongInfoLink key={url} href={url} variant="caption">{name}</SongInfoLink>
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