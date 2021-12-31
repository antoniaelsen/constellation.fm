import React, {useRef} from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';

import IconButton from '@material-ui/core/IconButton';


const useStyles = makeStyles(({ spacing, shape }: Theme) =>
  createStyles({
    icon: {
      minWidth: "auto",
    },
    root: {
      '&:hover': {
        backgroundColor: '#111',
      },
      borderRadius: shape.borderRadius,
    },
    grey: {
      opacity: 0.5,
    },
    text: {
      margin: `${spacing(1)/2}px ${spacing(1)}px`
    }
  }),
);

export interface PlaylistProps {
  collaborative: boolean;
  editable: boolean;
  id: string;
  name: string;
};

export const PlaylistItem: React.SFC<PlaylistProps> = (props) => {
  const {
    collaborative,
    editable,
    id,
    name,
  } = props;
  const classes = useStyles();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <ListItem className={classes.root} key={id} innerRef={ref} role={undefined} dense disableGutters={true}>
      
      <ListItemText
        className={classes.text}
        classes={{ primary: editable ? '' : classes.grey }}
        primary={name}
      />
      {collaborative && (
        <ListItemSecondaryAction>
          <ListItemIcon classes={{ root: classes.icon }}>
            <GroupOutlinedIcon fontSize="small"/>
          </ListItemIcon>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}