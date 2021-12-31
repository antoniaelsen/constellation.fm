import React from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import { DragListItem } from 'components/DragListItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: `0 ${theme.spacing(1)}px`,
      width: '100%',
      // maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);


export interface DragListProps {
  children: JSX.Element | JSX.Element[];
  move: (id: number, index:number) => void;
};

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
