import React from 'react';
import { Button } from '@mui/material';
import Iconify from './iconify/Iconify';
import { useGoogleAuth } from '../pages/LoginGoogle';

const LoginButton = () => {
  const { signIn } = useGoogleAuth();

  return (
    <Button fullWidth size="large" color="inherit" variant="outlined" onSubmitGoogle={signIn}>
      <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
      <span style={{ color: '#DF3E30', marginLeft: 5 }}>Login with Google</span>
    </Button>
  );
};

export default LoginButton;
