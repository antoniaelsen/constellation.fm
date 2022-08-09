import React from 'react';
import Button from '@mui/material/Button';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

import { useAuth } from "components/AuthProvider";
import { StyledBox } from 'components/StyledBox';
interface Props {
}

export const Login: React.FC<Props> = (props) => {
  const { login } = useAuth();

  return (
    <StyledBox sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
    }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => login()}
        endIcon={<StarBorderRoundedIcon/>}
      >
        login
      </Button>
    </StyledBox>
  );
}

