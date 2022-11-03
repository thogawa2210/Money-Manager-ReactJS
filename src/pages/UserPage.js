import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

// components

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UserPage() {
  const [openName, setOpenName] = useState(false);
  const [openPass, setOpenPass] = useState(false);

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

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    google_id: '',
  });

  const userApi = async (user_id) => {
    return await axios.get(`http://localhost:3001/user/info/${user_id}`);
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
  }, []);

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
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
      </Container>

      <Dialog open={openName} onClose={handleCloseName}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="New Username"
            type="text"
            fullWidth
            variant="standard"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseName}>Cancel</Button>
          <Button onClick={handleCloseName}>Subscribe</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPass} onClose={handleClosePass}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePass}>Cancel</Button>
          <Button onClick={handleClosePass}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
