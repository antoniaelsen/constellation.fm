import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

import { useAuth } from "components/AuthProvider";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {

    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }
  })
);


interface Props {
}

export const Login: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { login } = useAuth();
  console.log("Login | Rendering");

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => login()}
        endIcon={<StarBorderRoundedIcon/>}
      >
        login
      </Button>
    </div>
  );
}

