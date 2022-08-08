import React from 'react';

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

export interface DragListProps {
  children: JSX.Element | JSX.Element[];
  move: (id: number, index:number) => void;
}

export const DragList: React.SFC<DragListProps> = (props) => {
  const { children } = props;

  return (
    <List sx={(theme) => ({
        padding: `0 ${theme.spacing(1)}`,
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
      })}
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader" disableGutters>
          CONSTELLATIONS
        </ListSubheader>
      }
    >
      {children}
    </List>
  );
}
