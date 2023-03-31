import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useEffect } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import Iconify from '../components/iconify/Iconify';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import { LoginForm } from '../sections/auth/login';
import { useNavigate } from 'react-router-dom';
import { enviroment } from 'src/enviroment/enviroment';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem('user');
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginGGApi = async (data) => {
<<<<<<< HEAD
    const result = await axios.post('http://localhost:3001/auth/login-gg', data);
=======
    const result = await axios.post(`${enviroment.apiUrl}/auth/login-gg`, data);
>>>>>>> 650520c5c1ef5ffc59bbd50646230bf6cf8befdb
    return result;
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });
        const info = res.data;
        const userInfo = {
          username: info.name,
          google_id: info.sub,
          email: info.email,
        };
        await loginGGApi(userInfo)
          .then((res) => {
            switch (res.data.type) {
              case 'success':
                Swal.fire({
                  icon: 'success',
                  title: 'Login Successfully!',
                  showConfirmButton: false,
                  timer: 1500,
                });
                localStorage.setItem(
                  'user',
                  JSON.stringify({ token: res.data.data.token, user_id: res.data.data.data._id })
                );
                navigate('/');
                break;
              case 'error':
                Swal.fire({
                  icon: 'error',
                  title: 'Something Wrong! Try again!',
                  showConfirmButton: false,
                  timer: 1500,
                });
                break;
              default:
            }
          })
          .catch(() =>
            Swal.fire({
              icon: 'error',
              title: 'Something Wrong!',
              text: 'Something rong! Please try again!',
              showConfirmButton: false,
              timer: 1500,
            })
          );
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Something Wrong!',
          text: 'Something rong! Please try again!',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  return (
    <>
      <Helmet>
        <title> Login | Money Manager Master </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h3" gutterBottom>
              Sign in
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Don’t have an account? {''}
              <Link href="/signup" variant="subtitle2">
                Get started
              </Link>
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined" onClick={loginGoogle}>
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                <span style={{ color: '#DF3E30', marginLeft: 5 }}>Login with Google</span>
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
