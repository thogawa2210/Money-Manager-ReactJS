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
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeFlag } from 'src/features/flagSlice';

// components

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

  return (
    <>
      <Helmet>
        <title> Profile | Money Manager Master </title>
      </Helmet>

      <Container>
        <Card sx={{ boxShadow: '1px 1px 1px 1px #CCE2FF', mt: 2, maxWidth: 500, maxHeight: 500, ml: 20 }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"></Avatar>}
            title={`${form.username}`}
            subheader={`${form.email}`}
          />
          <CardMedia component="img" height="194" image="/assets/images/avatars/avatar_10.jpg" alt="user photo" />
          <CardContent>
            <Button fullWidth variant="contained" color="info" size="large" onClick={handleClickOpenName}>
              Edit Username
            </Button>
            {!form.google_id ? (
              <Button
                fullWidth
                variant="outlined"
                color="success"
                size="large"
                sx={{ mt: 1 }}
                onClick={handleClickOpenPass}
              >
                Change Password
              </Button>
            ) : (
              <Button
                disabled
                fullWidth
                variant="outlined"
                color="success"
                size="large"
                sx={{ mt: 1 }}
                onClick={handleClickOpenPass}
              >
                You login with GG
              </Button>
            )}
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
      </Container>

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
              variant="standard"
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
                type="text"
                fullWidth
                name="old_pass"
                variant="standard"
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
                variant="standard"
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
                variant="standard"
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
                variant="standard"
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
