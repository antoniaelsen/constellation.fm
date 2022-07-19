import React from 'react';
import { Link, LinkProps } from "@mui/material";

export const StyledLink = (props: LinkProps) => {
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