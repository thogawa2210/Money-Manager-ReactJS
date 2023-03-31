import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
// mock
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
//
import navConfig from './config';
import { useSelector } from 'react-redux';
import { enviroment } from 'src/enviroment/enviroment';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDesktop = useResponsive('up', 'lg');
  const [userForm, setUserForm] = useState({
    username: '',
    img: ''
  })
  const flag = useSelector(state => state.flag.flag)

  const isLoginApi = async (token, id) => {
<<<<<<< HEAD
    const result = await axios.post('http://localhost:3001/auth/is-login', { token: token, id: id });
=======
    const result = await axios.post(`${enviroment.apiUrl}/auth/is-login`, { token: token, id: id });
>>>>>>> 650520c5c1ef5ffc59bbd50646230bf6cf8befdb
    return result;
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo) {
      Swal.fire({
        icon: 'info',
        title: 'You are not loggin! Please login to use our service!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/login');
    } else {
      isLoginApi(userInfo.token, userInfo.user_id)
        .then((res) => {
          switch (res.data.type) {
            case 'No':
              localStorage.clear('user');
              Swal.fire({
                icon: 'info',
                title: 'You are not loggin!',
                html: 'Please login and use our service!',
                showConfirmButton: false,
                timer: 1500,
              });
              navigate('/login');
              break;
            case 'error':
              Swal.fire({
                icon: 'error',
                title: 'You are not loggin!',
                html: 'Please login and use our service!',
                showConfirmButton: false,
                timer: 1500,
              });
              navigate('/login');
              break;
            default:
              setUserForm({
                username: res.data.data.username,
                img: res.data.data.img
              });
              break;
          }
        })
        .catch((err) => console.log(err));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, flag]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={userForm.img} />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                Hello, {userForm.username} ! 
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/assets/logotrans.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get pro?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $299
            </Typography>
          </Box>

          <Button href="https://web.moneylover.me/store/" target="_blank" variant="contained">
            Upgrade to Pro
          </Button>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
