import React, {useRef} from 'react';

import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

import IconButton from '@mui/material/IconButton';


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
      margin: `calc(${spacing(1)} / 2) ${spacing(1)}`
    }
  }),
);

export interface PlaylistProps {
  collaborative: boolean;
  editable: boolean;
  id: string;
  name: string;
}

export const PlaylistItem: React.SFC<PlaylistProps> = (props) => {
  const {
    collaborative,
    editable,
    id,
    name,
  } = props;
  const classes = useStyles();

  return (
    <ListItem className={classes.root} key={id} role={undefined} dense disableGutters={true}>
      
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