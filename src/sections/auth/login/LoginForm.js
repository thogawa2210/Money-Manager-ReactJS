import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent, DialogContentText, Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';

// components
import Iconify from '../../../components/iconify';
import * as React from 'react';


// ----------------------------------------------------------------------

const REGEX = {
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    email: '',
    password: '',
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState({
    email:  ''
  })

  const [erremail, setErrEmail] = useState({
    email: ''
  })

  const callApi = async () => {
    const data = {
      email: form.email,
      password: form.password,
    };
    const results = await axios.post('https://money-manager-master-be.herokuapp.com/auth/login', data);
    return results;
  };

  const handleValidate = (e) => {
    switch (e.target.name) {
      case 'email':
        if (!REGEX.email.test(e.target.value)) {
          setError({ ...error, email: 'Email is not valid' });
        } else {
          setError({ ...error, email: '' });
        }
        break;
      case 'password':
        if (!REGEX.password.test(e.target.value)) {
          setError({
            ...error,
            password:
              'Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and 1 number ',
          });
        } else {
          setError({ ...error, password: '' });
        }
        break;
      default:
        break;
    }
  };

  const handleOnchange = (e) => {
    handleValidate(e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    setLoading(true);
    if (form.email === '' || form.password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all the required fields',
        showConfirmButton: false,
        timer: 1500,
      });
      setLoading(false);

    } else {
      callApi()
        .then((res) => {
          setLoading(false);
          handleApi(res.data)
        })
    
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: 'Somthing wrong! Please try again!',
            showConfirmButton: false,
            timer: 1500,
          });
          setLoading(false);
        })
    ;
    }
  };

  const handleApi = (data) => {
    if (data.type === 'success') {
      const user = {
        user_id: data.data.data._id,
        token: data.data.token,
      };
      localStorage.setItem('user', JSON.stringify(user));
      Swal.fire({
        icon: 'success',
        title: 'Login successfuly!',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/');
    } else if (data.type === 'notexist') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.message,
        confirmButtonColor: '#54D62C',
        footer: '<a href="/signup">Create new account?</a>'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  

  const handleValidateForgot = (e) => {
    switch (e.target.name) {
      case 'email':
        if (!REGEX.email.test(e.target.value)) {
          setErrEmail({ ...erremail, email: 'Email is not valid' });
        } else {
          setErrEmail({ ...erremail, email: '' });
        }
        break;
      default:
        break;
    }
  };

  const sendEmail = async () => {
    const data = {
      email: email.email,
    };
    const results = await axios.request({
      url: `https://money-manager-master-be.herokuapp.com/auth/forgotPassword`,
      method: 'POST',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return results;
  };

  const handleApiEmail = (data) => {
    if (data.type === 'success') {
      Swal.fire({
        title: 'Send Email Success',
        text: 'Please Check Your Email To Forgot Password',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      })
    }else if (data.type === 'error') {
      Swal.fire({
        title: 'Oops...',
        text: 'You login by google',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Account does not exists!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChangeForgotPassword = (e) => {
    handleValidateForgot(e);
    setEmail({...email,[e.target.name] : e.target.value})
  }

  const handleClose = () => {
    setOpen(false);
    setEmail({...email,email: ''})
  };

  const handleSubmitForgotPassword = () => {
    setOpen(false);
      sendEmail()
          .then((res) => handleApiEmail(res.data))
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: ' Something wrong! Please try again!',
            showConfirmButton: false,
            timer: 2000
          })
        });
  }


  return (
    <>
      <Stack spacing={3}>
        {!error.email ? (
          <TextField
            required
            type="email"
            name="email"
            label="Email address"
            onChange={(e) => {
              handleOnchange(e);
            }}
          />
        ) : (
          <TextField
            error
            helperText={error.email}
            required
            type="email"
            name="email"
            label="Email address"
            onChange={(e) => {
              handleOnchange(e);
            }}
          />
        )}

        {!error.password ? (
          <TextField
            required
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              handleOnchange(e);
            }}
          />
        ) : (
          <TextField
            error
            helperText={error.password}
            required
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              handleOnchange(e);
            }}
          />
        )}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link onClick={handleClickOpen} variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      {!error.email && !error.password ? (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={loading}>
          Login
        </LoadingButton>
      ) : (
        <LoadingButton disabled fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={loading}>
          Login
        </LoadingButton>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText    sx={{ mb: 2}}>
            To forgot password, please enter your email address.
          </DialogContentText>
          {!erremail.email ? ( <TextField
              required
              name="email"
              sx={{ minWidth: 400}}
              fullWidth={true}
              label="Email Address"
              variant="outlined"
              onChange={(e) => {handleChangeForgotPassword(e)}}
          />) : ( <TextField
              error
              helperText={erremail.email}
              required
              name="email"
              sx={{ minWidth: 400}}
              fullWidth={true}
              label="Email Address"
              variant="outlined"
              onChange={(e) => {handleChangeForgotPassword(e)}}
          />)}

        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
          {!erremail.email && email.email ? ( <Button variant="outlined" color="success" onClick={handleSubmitForgotPassword}>
            Submit
          </Button>) : ( <Button disabled variant="outlined" color="success" onClick={handleSubmitForgotPassword}>
            Submit
          </Button>)}

        </DialogActions>
      </Dialog>
    </>
  );
}
