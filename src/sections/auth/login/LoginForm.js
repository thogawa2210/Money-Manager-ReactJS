import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2'

// components
import Iconify from '../../../components/iconify';

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

  const callApi = async () => {
    const data = {
      email: form.email,
      password: form.password,
    };
    const results = await axios.post('http://localhost:3001/auth/login', data);
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
    if (form.email === '' || form.password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all the required fields',
      });
    } else {
      callApi()
        .then((res) => handleApi(res.data))
        .catch((err) => console.log(err.message));
    }
  };

  const handleApi = (data) => {
    if (data.type === 'success') {
      const user = {
        user_id: data.message.data._id
      };
      localStorage.setItem('user', JSON.stringify(user));
      Swal.fire({
        icon: 'success',
        title: 'Login successfuly!',
        showConfirmButton: false,
        timer: 1000,
      });
      navigate('/');
    } else if (data.type === 'error') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data.message,
      });
    } else if (data.type === 'notexist') {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: data.message,
        footer: '<a href="/signup">Create new account?</a>',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong. Please try again!',
        footer: '<a href="/signup">Create new account?</a>',
      });
    }
  };

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
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      {!error.email && !error.password ? (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Login
        </LoadingButton>
      ) : (
        <LoadingButton disabled fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Login
        </LoadingButton>
      )}
    </>
  );
}
