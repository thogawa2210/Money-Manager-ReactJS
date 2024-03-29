/* eslint-disable no-unused-vars */
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { changeFlag } from '../features/flagSlice';
import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import mockWallet from '../_mock/wallet';
import { enviroment } from 'src/enviroment/enviroment';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  InputAdornment,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slide,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider, CircularProgress, Backdrop,
} from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Iconify from '../components/iconify';
import { forwardRef } from 'react';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';

function numberWithCommas(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function WalletPage() {
  // Button loading
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [walletEdit, setWalletEdit] = useState({
    icon: '',
  });
  const [open, setOpen] = useState(false);
  // Create Wallet
  const [openCreate, setOpenCreate] = React.useState(false);
  const [wallet, setWallet] = useState({
    icon: '',
    name: '',
    amount: '',
  });
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(true);
  const user = localStorage.getItem('user');
  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };
  const handleChangeCreate = (e) => {
    setWallet({
      ...wallet,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmitCreate = async () => {
    setLoading(true)
    if (user) {
      let userId = JSON.parse(user).user_id
      setOpenAddForm(false);
      let data = {
        icon: wallet.icon,
        name: wallet.name,
        amount: wallet.amount,
        user_id: userId,
      };
      if (wallet.name === '' || wallet.amount === '') {
        setOpenCreate(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill all the required fields',
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false)
      } else {
        await axios
          .post(`${enviroment.apiUrl}/wallet/create`, data)
          .then((res) => {
            setLoading(false)
            if (res.data.type === 'success') {
              setOpenCreate(false);
              dispatch(changeFlag(1));
              setWallet({
                name: '',
                amount: '',
                icon: null,
              });
              Swal.fire({
                icon: 'success',
                title: 'Create Successfully!',
                showConfirmButton: false,
                timer: 1500,
              });
            } else {
              setLoading(false)
              setOpenCreate(false);
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: `${res.data.message}`,
                showConfirmButton: false,
                timer: 1500,
              });
              setWallet({
                icon: '',
                name: '',
                amount: '',
              });
            }
          })
          .catch((err) => {
            setLoading(false)
            setOpenCreate(false);
            Swal.fire({
              icon: 'success',
              title: 'Error!',
              text: 'Something error! Try again!',
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    }

  };

  // Detail wallet
  const [expanded, setExpanded] = React.useState(false);

  const handleChangeDetail = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const flag = useSelector((state) => state.flag);
  const dispatch = useDispatch();

  const handleOpenEdit = (id) => {
    const walletEdit = wallets.filter((wallet) => wallet._id === id);
    setWalletEdit(walletEdit[0]);
    setOpen(true);
  };

  const getAllWallet = async () => {
    const userId = JSON.parse(localStorage.getItem('user'));
    return await axios.get(`${enviroment.apiUrl}/wallet/get-all-wallet/${userId.user_id}`);
  };

  useEffect(() => {
    getAllWallet()
      .then((res) => {
        setOpenBackDrop(false);
        setWallets(res.data.wallet)
      })
      .catch((error) => console.log(error.message));
  }, [flag]);

  const onCancelEdit = () => {
    setOpen(false);
    setWalletEdit({
      icon: '',
      name: '',
      amount: '',
    });
  };

  const onChangeEdit = (e) => {
    setWalletEdit({ ...walletEdit, [e.target.name]: e.target.value });
  };

  const handleDeleteWallet = (id) => {
    setLoading(true)
    Swal.fire({
      title: 'Are you sure to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#54D62C',
      cancelButtonColor: '#FF4842',
    }).then(async (result) => {
      setLoading(false)
      if (result.isConfirmed) {
        await axios
          .delete(`${enviroment.apiUrl}/wallet/delete/${id}`)
          .then((res) => {
            dispatch(changeFlag(1));
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Wallet has been deleted.',
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) => {
            console.log(err)
            setLoading(false)
          });
      }
    });
  };

  const handleSaveEdit = async (id) => {
    setLoading(true)
    let data = {
      icon: walletEdit.icon,
      name: walletEdit.name,
      amount: walletEdit.amount,
    };
    await axios
      .put(`${enviroment.apiUrl}/wallet/update/${id}`, data)
      .then((res) => {
        setOpen(false);
        Swal.fire({
          icon: 'success',
          title: 'Update Successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        dispatch(changeFlag(1));
      })
      .catch((err) => {console.log(err)
        setLoading(false)
      });
    setLoading(false)
  };

  return (
    <>
      <Helmet>
        <title> Wallet | Money Manager Master </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3" gutterBottom sx={{ ml: '20px' }}>
          Wallet Manager
        </Typography>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenCreate} sx={{ mr: '20px' }}>
          New Wallet
        </Button>
      </Stack>

      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Edit Wallet */}
      <Dialog
        TransitionComponent={Transition}
        fullWidth
        maxWidth="md"
        keepMounted
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>{'Edit Wallet'}</DialogTitle>
        <DialogContentText></DialogContentText>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              {/* Select icon */}
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 100 }}>
                  <Select name="icon" onChange={onChangeEdit} sx={{ height: 55 }} value={walletEdit.icon}>
                    {mockWallet.map((item) => (
                      <MenuItem value={item.icon} key={item.icon}>
                        <Avatar src={item.icon} sx={{ mr: 0 }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <TextField
                required
                name="name"
                onChange={onChangeEdit}
                fullWidth
                variant="outlined"
                value={walletEdit.name}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Name</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                required
                name="amount"
                onChange={onChangeEdit}
                fullWidth
                variant="outlined"
                type="number"
                value={walletEdit.amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Amount</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={onCancelEdit}>
            Cancel
          </Button>
          <LoadingButton loading={loading} variant="outlined" color="success" onClick={() => handleSaveEdit(walletEdit._id)}>
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Detail Wallet */}
      <Grid container spacing={3}>
        <Grid item xs />
        {wallets.length <= 0 ? (
          <Box component="main">
            <Divider />
            <Typography
              sx={{
                textAlign: 'center',
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 1.56,
                fontFamily: 'Public Sans,sans-serif',
                fontSize: '18px',
              }}
            >
              No Data
            </Typography>
          </Box>
        ) : (
          <Grid item xs={9} sx={{ padding: 0 }}>
            {wallets.map((item, index) => (
              <Accordion expanded={expanded === `panel${index + 1}`} onChange={handleChangeDetail(`panel${index + 1}`)} key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                  <Typography sx={{ width: '80%', flexShrink: 0, display: 'flex' }}>
                    <Avatar src={item.icon} sx={{ mr: 0 }} />
                    <ListItemText
                      primary={item.name}
                      sx={{ pr: 22, ml: 2, display: 'block !important', alignItems: 'center', marginTop: 1 }}
                    />
                  </Typography>

                  <Typography sx={{ ml: 2, display: 'block !important', alignItems: 'center', marginTop: 1 }}>
                    Wallet {index + 1}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {/* Table */}
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Wallet Name</TableCell>
                            <TableCell align="right">Wallet Amount</TableCell>
                            <TableCell align="right">Wallet Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody key={index}>
                          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              <strong>{item.name}</strong>
                            </TableCell>
                            <TableCell align="right">{numberWithCommas(item.amount)} VNĐ</TableCell>
                            <TableCell align="right">
                              <Button variant="outlined" color="success" onClick={() => handleOpenEdit(item._id)}>
                                Edit
                              </Button>
                              <Button variant="outlined" color="error" onClick={() => handleDeleteWallet(item._id)}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {/* done Table */}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        )}

        <Grid item xs />
      </Grid>

      {/* Done */}
      {/* Dialog create wallet/>*/}
      <Dialog
        TransitionComponent={Transition}
        fullWidth
        maxWidth="md"
        keepMounted
        open={openCreate}
        onClose={handleCloseCreate}
      >
        <DialogTitle>{'Add Wallet'}</DialogTitle>
        <DialogContentText></DialogContentText>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              {/* Select icon */}
              <Box sx={{ minWidth: 120 }}>
                <FormControl sx={{ width: 100 }}>
                  <InputLabel id="demo-simple-select-label">Icon</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="icon"
                    name="icon"
                    onChange={handleChangeCreate}
                    value={wallet.icon}
                    sx={{ height: 55 }}
                  >
                    {mockWallet.map((item, index) => (
                      <MenuItem value={item.icon} key={index}>
                        <Avatar src={item.icon} sx={{ mr: 0 }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <TextField
                name="name"
                onChange={handleChangeCreate}
                fullWidth
                label="Name Wallet"
                variant="outlined"
                value={wallet.name}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                name="amount"
                onChange={handleChangeCreate}
                fullWidth
                label="Amount"
                variant="outlined"
                type="number"
                value={wallet.amount}
                lang="en-150"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleCloseCreate}>
            Cancel
          </Button>
          <LoadingButton
            variant="outlined"
            color="success"
            onClick={handleSubmitCreate}
            loading={loading}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
