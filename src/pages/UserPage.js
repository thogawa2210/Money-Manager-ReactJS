import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import mockAvatar from 'src/_mock/avatar';
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
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

const ITEM_HEIGHT = 48;

export default function UserPage() {
  const [openName, setOpenName] = useState(false);
  const [openPass, setOpenPass] = useState(false);
  const [error, setError] = useState({
    old_pass: false,
    new_pass: false,
  });
  const [formName, setFormName] = useState({ username: '' });
  const [formPass, setFormPass] = useState({ old_pass: '', new_pass: '' });
  const [openDialogListAva, setOpenDialogListAva] = useState(false);
  const [form, setForm] = useState({
    _id: '',
    username: '',
    email: '',
    password: '',
    google_id: '',
    img: '',
  });
  const options = ['Change Username', 'Change Password'];
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    wallets: 0,
    transactions: 0,
    categorys: 0,
  });
  const flag = useSelector((state) => state.flag.flag);
  const dispatch = useDispatch();

  const handleClickOpen = (option) => {
    if (option === 'Change Username') {
      setFormName({ username: form.username });
      setAnchorEl(null);
      setOpenName(true);
    } else {
      if (form.password) {
        setShowPassword(false)
        setAnchorEl(null);
        setOpenPass(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Warning!',
          text: 'Your account is login by Google! Can change password!',
          showConfirmButton: false,
          timer: 1500,
        });
        setAnchorEl(null);
      }
    }
  };

  const handleCloseName = () => {
    setOpenName(false);
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
    return await axios.put(`https://money-manager-master-be.herokuapp.com/user/change-password/${id}`, data);
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
            confirmButtonColor: '#54D62C',
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
            timer: 1500,
            showConfirmButton: false,
          });
        } else if (res.data.type === 'warning') {
          setOpenPass(false);
          Swal.fire({
            title: 'Warning',
            icon: 'warning',
            text: 'Your old password and your new password are the same',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setOpenPass(false);
          Swal.fire({
            icon: 'warning',
            title: `Something wrong! Try again!`,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      })
      .catch((err) =>
        Swal.fire({
          icon: 'error',
          title: 'Something Wrong!',
          text: 'Something wrong! Please try again!',
          timer: 1500,
          showConfirmButton: false,
        })
      );
  };

  const userApi = async (id) => {
    return await axios.get(`https://money-manager-master-be.herokuapp.com/user/info/${id}`);
  };

  const changeNameApi = async (id) => {
    return await axios.put(`https://money-manager-master-be.herokuapp.com/user/edit-username/${id}`, {
      username: formName.username,
    });
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
            confirmButtonColor: '#54D62C',
          }).then((result) => {
            if (result.isConfirmed) {
              dispatch(changeFlag(1));
            }
          });
        }
      })
      .catch((err) =>
        Swal.fire({
          icon: 'error',
          title: 'Something Wrong!',
          text: 'Something wrong! Please try again!',
          timer: 1500,
          showConfirmButton: false,
        })
      );
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const user_id = JSON.parse(user).user_id;
      userApi(user_id)
        .then((res) => {
          if (res.data.type === 'success') {
            let userInfo = res.data.message;
            setForm({
              _id: userInfo._id,
              username: userInfo.username,
              email: userInfo.email,
              password: userInfo.password,
              google_id: userInfo.google_id,
              img: userInfo.img,
            });
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) =>
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: 'Something wrong! Please try again!',
            timer: 1500,
            showConfirmButton: false,
          })
        );
    }
  }, [flag]);

  const profileApi = async (id) => {
    return await axios.get(`https://money-manager-master-be.herokuapp.com/user/profile/${id}`);
  };

  useEffect(() => {
    const userID = JSON.parse(localStorage.getItem('user')).user_id;
    profileApi(userID)
      .then((res) => setProfile(res.data.data))
      .catch((err) =>
        Swal.fire({
          icon: 'error',
          title: 'Something Wrong!',
          text: 'Something wrong! Please try again!',
          timer: 1500,
          showConfirmButton: false,
        })
      );
  }, []);

  const changeAvaApi = async (id, data) => {
    return await axios.put(`https://money-manager-master-be.herokuapp.com/user/change-avatar/${id}`, data);
  };

  const onClickChangeAvatar = () => {
    setOpenDialogListAva(true);
  };

  const handleChangeAvatar = (avatar) => {
    const user = localStorage.getItem('user');
    if (user) {
      let userId = JSON.parse(user).user_id;
      const data = {
        img: avatar,
      };
      changeAvaApi(userId, data)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Change Avatar Success!',
            showConfirmButton: false,
            timer: 1500,
          });
          dispatch(changeFlag(1));
          setOpenDialogListAva(false);
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Something wrong!',
            text: 'Try again!',
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  };

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
                  <Button color="primary" fullWidth variant="outlined" onClick={onClickChangeAvatar}>
                    Change Avatar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item lg={8} md={6} xs={12}>
              <Card>
                <Grid container>
                  <Grid item xs={11}>
                    <CardHeader subheader="Thank you for using out app!" title="Profile" />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                      sx={{ padding: 0, margin: '26px' }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      MenuListProps={{
                        'aria-labelledby': 'long-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: '20ch',
                        },
                      }}
                    >
                      {options.map((option) => (
                        <MenuItem key={option} onClick={() => handleClickOpen(option)}>
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Grid>
                </Grid>
                <Divider />
                <CardContent sx={{ padding: 2, ml: 1 }}>
                  <p style={{ fontWeight: 'lighter' }}>Number of wallet: {profile.wallets} </p>
                  <p style={{ fontWeight: 'lighter' }}>Number of transaction: {profile.transactions}</p>
                  <p style={{ fontWeight: 'lighter' }}>Number of category: {profile.categorys}</p>
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
              value={formName.username}
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
                type={showPassword ? 'text' : 'password'}
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
                type={showPassword ? 'text' : 'password'}
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
                type={showPassword ? 'text' : 'password'}
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

      {/* List ava */}
      <Dialog open={openDialogListAva} onClose={() => setOpenDialogListAva(false)}>
        <DialogContent>
          <Box sx={{ width: '400px', typography: 'body1', height: '400px' }}>
            <Grid container spacing={3}>
              {mockAvatar.map((item) => (
                <Grid item xs={3} key={item}>
                  <MenuItem onClick={() => handleChangeAvatar(item)} sx={{ width: '70px', height: '40px' }}>
                    <Avatar src={item} />
                  </MenuItem>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialogListAva(false)} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
