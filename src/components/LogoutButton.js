import React from 'react';
import { useGoogleAuth } from '../pages/LoginGoogle';

const LogoutButton = () => {
  const { signOut } = useGoogleAuth();

  return (
    // eslint-disable-next-line react/button-has-type
    <button onClick={signOut}>Logout</button>
  );
};

export default LogoutButton;
