import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';


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
  console.log("Login | Rendering");

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        href={`${process.env.REACT_APP_BACKEND_URL}/auth/auth0?returnTo=${
          window.location.href
        }`}
        endIcon={<StarBorderRoundedIcon/>}
      >
        login
      </Button>
    </div>
  );
}

