import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import * as React from 'react';
import { Card, Container, Button } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';

// components

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UserPage() {
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
        <Card sx={{ boxShadow: '1px 1px 1px 1px', mt: 3, maxWidth: 700 }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              
            </Avatar>}
            title={`${form.username}`}
            subheader={`${form.email}`}
          />
          <CardMedia component="img" height="194" image="" alt="user photo" />
          <CardContent>
            <Button fullWidth variant="contained" color="info" size='large'>
              Edit
            </Button>
          </CardContent>
          <CardActions disableSpacing></CardActions>
          <Collapse timeout="auto" unmountOnExit></Collapse>
        </Card>
      </Container>
    </>
  );
}
