import { useEffect, useState } from 'react';
// @mui
import { Box, MenuItem, IconButton, Popover, Typography, Divider, Grid, Avatar } from '@mui/material';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addTotal } from '../../../features/totalSlice';
import Swal from 'sweetalert2';
import { enviroment } from 'src/enviroment/enviroment';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function numberWithCommas(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function WalletUser() {
  const [open, setOpen] = useState(null);
  const [state, setState] = useState({
    wallets: [],
  });
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();

  const { flag } = useSelector((state) => state.flag);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const userId = JSON.parse(localStorage.getItem('user'));

  const getAllWallet = async (userId) => {
    return await axios.get(`${enviroment.apiUrl}/wallet/get-all-wallet/${userId.user_id}`);
  };
  const toTalMoney = async (userId) => {
    return await axios.get(`${enviroment.apiUrl}/wallet/total/${userId.user_id}`);
  };

  useEffect(() => {
    if (userId) {
      getAllWallet(userId)
        .then((res) => setState({ wallets: res.data.wallet }))
        .catch((error) =>
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: ' Something wrong! Please try again!',
            showConfirmButton: false,
            timer: 2000,
          })
        );
      toTalMoney(userId)
        .then((res) => setTotal(res.data.total))
        .catch((error) =>
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: ' Something wrong! Please try again!',
            showConfirmButton: false,
            timer: 2000,
          })
        );
      dispatch(addTotal(total));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          padding: 0,
          height: 44,
          flexGrow: 2,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <IconButton
          sx={{
            padding: 0,
            width: 40,
            height: 40,
          }}
        >
          <Avatar src="/assets/icons/wallets/total.svg" alt="No image" />
        </IconButton>
        <Box
          sx={{
            height: 40,
          }}
        >
          <Typography
            style={{
              color: 'black',
              fontFamily: 'serif',
              fontSize: 12,
              paddingLeft: 12,
            }}
          >
            Total
          </Typography>
          <Typography
            style={{
              color: 'black',
              fontFamily: 'serif',
              fontSize: 14,
              paddingLeft: 12,
              fontWeight: 700,
            }}
          >
            {numberWithCommas(total)} VNĐ
          </Typography>
        </Box>
      </Box>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            mt: 1.5,
            ml: 0.75,
            width: 280,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 11 }}>
          <Typography variant="subtitle2" noWrap>
            Select Wallet
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Grid container spacing={1}>
          {state.wallets.map((item, index) => (
            <MenuItem key={index} onClick={() => handleClose(index)} sx={{ width: '100%', padding: 0, height: '50px' }}>
              <Grid item xs>
                <Grid container>
                  <Grid item xs={4}>
                    <Avatar src={item.icon} sx={{ width: 28, height: 28 }} />
                  </Grid>
                  <Grid item xs sx={{mt: '4px', textAlign: 'left'}}>
                    {' '}
                    {item.name}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs sx={{ textAlign: 'right', mt: '3px' }}>
                {numberWithCommas(item.amount)} VNĐ
              </Grid>
            </MenuItem>
          ))}
        </Grid>
      </Popover>
    </>
  );
}
