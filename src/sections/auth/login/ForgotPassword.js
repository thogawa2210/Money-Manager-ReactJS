import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';

function ForgotPasswordForm() {
  const REGEX = {
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/,
  };
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState({
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState({
    password: '',
    passwordConfirm: '',
  });

  const handleOnchange = (e) => {
    handleValidate(e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleValidate = (e) => {
    switch (e.target.name) {
      case 'password':
        if (!REGEX.password.test(e.target.value)) {
          setError({
            ...error,
            password:
              'Password must contain at least 6 characters, 1 uppercase letter, 1 lowercase letter and 1 number ',
            passwordConfirm: 'Password is not the same',
          });
        } else {
          if (e.target.value === form.passwordConfirm) {
            setError({ ...error, password: '', passwordConfirm: '' });
          } else if (e.target.value !== form.passwordConfirm) {
            setError({
              ...error,
              password: '',
              passwordConfirm: 'Password is not the same',
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

  const userId = useParams();
  const sendUser = async (userId) => {
    const data = {
      password: form.password,
    };
    const results = await axios.request({
      url: `https://money-manager-master-be.herokuapp.com/user/forgot-password/${userId.id}`,
      method: 'PUT',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return results;
  };

  const handleApi = (data) => {
    if (data.type === 'success') {
      Swal.fire({
        title: 'Change Password Success!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      navigate('/login');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Forgot Password Error!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setDisabled(true);
    if (form.password === '' || form.passwordConfirm === '') {
      setLoading(false);
      setDisabled(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all the required fields',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      sendUser(userId)
        .then((res) => {
          setLoading(false);
          setDisabled(false);
          handleApi(res.data);
        })
        .catch((err) => {
          setLoading(false);
          setDisabled(false);
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: ' Something wrong! Please try again!',
            showConfirmButton: false,
            timer: 2000,
          });
        });
    }
  };

  return (
    <>
      <Stack spacing={3}>
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
      {!error.password && !error.passwordConfirm && form.password && form.passwordConfirm ? (
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          loading={loading}
          disabled={disabled}
        >
          Submit
        </LoadingButton>
      ) : (
        <LoadingButton
          disabled
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          loading={loading}
        >
          Submit
        </LoadingButton>
      )}
    </>
  );
}

export default ForgotPasswordForm;
