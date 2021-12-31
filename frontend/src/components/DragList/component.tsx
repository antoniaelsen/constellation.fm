import React from 'react';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';

import { DragListItem } from 'components/DragListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: `0 ${theme.spacing(1)}`,
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);


export interface DragListProps {
  children: JSX.Element | JSX.Element[];
  move: (id: number, index:number) => void;
}

export const DragList: React.SFC<DragListProps> = (props) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <List className={classes.root}
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
