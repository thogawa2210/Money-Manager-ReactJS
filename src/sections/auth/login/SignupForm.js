import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {useNavigate} from "react-router-dom";
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { enviroment } from 'src/enviroment/enviroment';

function SingupForm() {
  const REGEX = {
    username: /^.{3,}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
  };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleOnchange = (e) => {
    handleValidate(e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleValidate = (e) => {
    switch (e.target.name) {
      case 'username':
        if (!REGEX.username.test(e.target.value)) {
          setError({ ...error, username: 'Username must have at least 3 characters' });
        } else {
          setError({ ...error, username: '' });
        }
        break;
      case 'email':
        if (!REGEX.email.test(e.target.value)) {
          setError({ ...error, email: 'Email is not valid' });
        } else {
          setError({ ...error, email: '' });
        }
        break;
      case 'password':
        if (!REGEX.password.test(e.target.value)) {
          setError({ ...error,password:
                'Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and 1 number ',passwordConfirm: 'Password is not the same'});
        }else {
          if (e.target.value === form.passwordConfirm) {
            setError({ ...error,password: '', passwordConfirm: '' });
          }else if (e.target.value !== form.passwordConfirm) {
            setError({
              ...error,
              password: '',passwordConfirm: 'Password is not the same'
            });
          }
        }
        break;
      case 'passwordConfirm':
        if (e.target.value !== form.password) {
          setError({ ...error, passwordConfirm: 'Password is not the same' });
        } else {
          setError({ ...error, passwordConfirm: '' });
        }
        break;
      default:
        break;
    }
  };



  const sendUser = async () => {
    const data = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    const results = await axios.request({
<<<<<<< HEAD
      url: 'http://localhost:3001/auth/register',
=======
      url: `${enviroment.apiUrl}/auth/register`,
>>>>>>> 650520c5c1ef5ffc59bbd50646230bf6cf8befdb
      method: 'POST',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return results;
  };

  const handleApi = (data) => {
    setLoading(false);
    if (data.type === 'success') {
      Swal.fire({
        title: 'Register Success',
        text: 'Please Check Your Email To Verify',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      })
      navigate('/login');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Account already exists!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    if (form.username === '' || form.password === '' || form.passwordConfirm === '' || form.email === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all the required fields',
        showConfirmButton: false,
        timer: 1500,
      });
      setLoading(false);
    } else {
      sendUser()
        .then((res) => handleApi(res.data))
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: ' Something wrong! Please try again!',
            showConfirmButton: false,
            timer: 2000
          })
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        {!error.username ? (
          <TextField required name="username" label="Username" onChange={(e) => handleOnchange(e)}  />
        ) : (
          <TextField
            required
            name="username"
            label="Username"
            onChange={(e) => handleOnchange(e)}
            error
            helperText={error.username}
          />
        )}
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
        {!error.passwordConfirm ? (
          <TextField
            required
            name="passwordConfirm"
            label="Confirm password"
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
            helperText={error.passwordConfirm}
            required
            name="passwordConfirm"
            label="Confirm password"
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
        <hr />
      </Stack>
      {!error.email && !error.username && !error.password && !error.passwordConfirm && form.username && form.password && form.email && form.passwordConfirm ? (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit} loading={loading}>
          Sign up
        </LoadingButton>
      ) : (
        <LoadingButton disabled fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit} loading={loading}>
          Sign up
        </LoadingButton>
      )}
    </>
  );
}

export default SingupForm;
