import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// @mui
import * as React from 'react';
import {
  Card,
  Container,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeFlag } from 'src/features/flagSlice';

// components
import Iconify from '../components/iconify';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

export default function UserPage() {
  const [openName, setOpenName] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [error, setError] = useState({
    old_pass: false,
    new_pass: false,
  });
  const [formName, setFormName] = useState({ username: '' });
  const [formPass, setFormPass] = useState({ old_pass: '', new_pass: '' });
  const [form, setForm] = useState({
    _id: '',
    username: '',
    email: '',
    password: '',
    google_id: '',
    img: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    wallets: 0,
    transactions: 0,
    categorys: 0,
  });
  const flag = useSelector((state) => state.flag.flag);
  const dispatch = useDispatch();

  const handleClickOpenName = () => {
    setOpenName(true);
  };

  const handleCloseName = () => {
    setOpenName(false);
  };

  const handleClickOpenPass = () => {
    setOpenPass(true);
  };

  const handleClosePass = () => {
    setOpenPass(false);
  };

  const handleValidate = (e) => {
    if (!REGEX.test(e.target.value)) {
      setError({ ...error, [e.target.name]: true });
    } else {
      setError({ ...error, [e.target.name]: '' });
    }
  };

  const handleOnchange = (e) => {
    handleValidate(e);
    setFormPass({ ...formPass, [e.target.name]: e.target.value });
  };

  const changePassApi = async (id, oldPass, newPass) => {
    let data = {
      old_pass: oldPass,
      new_pass: newPass,
    };
    return await axios.put(`http://localhost:3001/user/change-password/${id}`, data);
  };

  const handleChangePass = (e) => {
    e.preventDefault();
    changePassApi(form._id, formPass.old_pass, formPass.new_pass)
      .then((res) => {
        if (res.data.type === 'success') {
          setOpenPass(false);
          Swal.fire({
            icon: 'success',
            title: `${res.data.message}`,
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(changeFlag(1));
            }
          });
        } else if (res.data.type === 'error') {
          setOpenPass(false);
          Swal.fire({
            icon: 'error',
            title: `${res.data.message}`,
            timer: 1000,
            showConfirmButton: false,
          });
        } else if (res.data.type === 'warning') {
          setOpenPass(false);
          Swal.fire('Warning', 'Your old password and your new password are the same', 'warning')
        } else {
          setOpenPass(false);
          Swal.fire({
            icon: 'warning',
            title: `Something wrong! Try again!`,
            timer: 1000,
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const userApi = async (id) => {
    return await axios.get(`http://localhost:3001/user/info/${id}`);
  };

  const changeNameApi = async (id) => {
    return await axios.put(`http://localhost:3001/user/edit-username/${id}`, { username: formName.username });
  };

  const handleChangeName = (e) => {
    e.preventDefault();
    changeNameApi(form._id)
      .then((res) => {
        if (res.data.type === 'success') {
          setOpenName(false);
          Swal.fire({
            icon: 'success',
            title: 'Change your name success!',
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(changeFlag(1));
            }
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const user_id = JSON.parse(localStorage.getItem('user')).user_id;
    userApi(user_id)
      .then((res) => {
        if (res.data.type === 'success') {
          let userInfo = res.data.message;
          setForm(userInfo);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }, [flag]);

  const profileApi = async (id) => {
    return await axios.get(`http://localhost:3001/user/profile/${id}`);
  };

  useEffect(() => {
    const userID = JSON.parse(localStorage.getItem('user')).user_id;
    profileApi(userID)
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Helmet>
        <title> Profile | Money Manager Master </title>
      </Helmet>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="lg">
          <Typography sx={{ mb: 3 }} variant="h4">
            Account
          </Typography>
          <Grid container spacing={3}>
            <Grid item lg={4} md={6} xs={12}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Avatar
                      src={form.img}
                      sx={{
                        height: 64,
                        mb: 2,
                        width: 64,
                      }}
                    />
                    <Typography color="textPrimary" gutterBottom variant="h5">
                      {form.username}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {form.email}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {form.google_id ? (
                        <p style={{ color: 'red', fontSize: '12px', margin: 0 }}>
                          {' '}
                          Google Account <Iconify icon="/assets/icons/google-svgrepo-com.svg" />
                        </p>
                      ) : (
                        <p style={{ color: 'green', fontSize: '12px', margin: 0 }}>
                          {' '}
                          Basic Account <Iconify icon="/assets/icons/account-svgrepo-com.svg" />
                        </p>
                      )}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button color="success" fullWidth variant="outlined">
                    Upload picture
                  </Button>
                </CardActions>
                <CardActions>
                  <Button color="success" fullWidth variant="outlined" onClick={handleClickOpenName}>
                    Change Username
                  </Button>
                </CardActions>
                {form.google_id ? (
                  <CardActions>
                    <Button color="success" fullWidth variant="outlined" disabled>
                      Change Password
                    </Button>
                  </CardActions>
                ) : (
                  <CardActions>
                    <Button color="success" fullWidth variant="outlined" onClick={handleClickOpenPass}>
                      Change Password
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <Card>
                <CardHeader subheader="Thank you for using our app" title="Profile" />
                <Divider />
                <CardContent sx={{ padding: 2, ml: 1 }}>
                  <p style={{fontWeight: 'lighter'}}>Number of wallet: {profile.wallets} </p>
                  <p style={{fontWeight: 'lighter'}}>Number of transaction: {profile.transactions}</p>
                  <p style={{fontWeight: 'lighter'}}>Number of category: {profile.categorys}</p>
                </CardContent>
                <Divider />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog open={openName} onClose={handleCloseName}>
        <Box component="form" onSubmit={handleChangeName}>
          <DialogTitle>Change Username</DialogTitle>
          <DialogContent>
            <DialogContentText>Your nickname needs to be at least 1 character!</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New Username"
              type="text"
              fullWidth
              variant="outlined"
              required
              onChange={(e) => setFormName({ username: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseName} variant="outlined" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="success">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={openPass} onClose={handleClosePass}>
        <Box component="form" onSubmit={handleChangePass}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              A valid password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and 1 special
              character
            </DialogContentText>
            {error.old_pass ? (
              <TextField
                onChange={handleOnchange}
                required
                error
                autoFocus
                margin="dense"
                id="old_pass"
                label="Old Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                name="old_pass"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="A valid password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and 1 special
              character"
              />
            ) : (
              <TextField
                onChange={handleOnchange}
                required
                autoFocus
                name="old_pass"
                margin="dense"
                id="old_pass"
                label="Old Password"
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {error.new_pass ? (
              <TextField
                onChange={handleOnchange}
                required
                error
                name="new_pass"
                margin="dense"
                id="new_pass"
                label="New Password"
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="A valid password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and 1 special
              character"
              />
            ) : (
              <TextField
                onChange={handleOnchange}
                required
                margin="dense"
                name="new_pass"
                id="new_pass"
                label="New Password"
                type="text"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePass} variant="outlined" color="error">
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="success">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
