import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { changeFlag } from '../features/flagSlice';
import * as React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  CardContent,
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
} from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Iconify from '../components/iconify';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { forwardRef } from 'react';
import { Box } from '@mui/system';

function numberWithCommas(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function WalletPage() {
  const [detail, setDetail] = useState(<h5>Choose wallet to see details</h5>);
  const [wallets, setWallets] = useState([]);
  const [walletEdit, setWalletEdit] = useState([]);
  const [open, setOpen] = useState(false);
  const [totalMoney, setTotalMoney] = useState(0);
  // Create Wallet
  const [openCreate, setOpenCreate] = React.useState(false);
  const [icon, setIcon] = useState('');
  const [wallet, setWallet] = useState({
    name: '',
    amount: '',
  });
  const [value, setValue] = useState(dayjs());
  const [openAddForm, setOpenAddForm] = useState(false);
  const idUser = JSON.parse(localStorage.getItem('user')).user_id;
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
    setOpenAddForm(false);

    let data = {
      icon: icon,
      name: wallet.name,
      amount: wallet.amount,
      user_id: idUser,
    };
    if (wallet.name === '' || wallet.amount === '') {
      setOpenCreate(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
      });
    } else {
      const result = await axios.post('http://localhost:3001/wallet/create', data);
      if (result.data.type === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Update Successfully!',
        }).then(
          setOpenCreate(false),
          dispatch(changeFlag(1)),
          setWallet({
            ...wallet,
            name: '',
            amount: '',
          }),
          setIcon('')
        );
      } else {
        alert(result.data.message);
      }
    }
  };

  const handleChangeIcon = (event) => {
    setIcon(event.target.value);
  };
  // Detail wallet
  const [expanded, setExpanded] = React.useState(false);

  const handleChangeDetail = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  //Done
  const flag = useSelector((state) => state.flag);
  const dispatch = useDispatch();

  const handleClickOpen = (id) => {
    const walletEdit = wallets.filter((wallet) => wallet._id === id);
    setWalletEdit(walletEdit[0]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getAllWallet = async () => {
    const userId = JSON.parse(localStorage.getItem('user'));
    return await axios.get(` http://localhost:3001/wallet/get-all-wallet/${userId.user_id}`);
  };

  const toTalMoney = async () => {
    const userId = JSON.parse(localStorage.getItem('user'));
    return await axios.get(`http://localhost:3001/wallet/total/${userId.user_id}`);
  };

  useEffect(() => {
    getAllWallet()
      .then((res) => setWallets(res.data.wallet))
      .catch((error) => console.log(error.message));
    toTalMoney()
      .then((res) => setTotalMoney(res.data.total))
      .catch((error) => console.log(error.message));
  }, [flag]);

  const onChangeEdit = (e) => {
    if (e.target.name === 'amount') {
      setWalletEdit({ ...walletEdit, [e.target.name]: parseInt(e.target.value) });
    } else {
      setWalletEdit({ ...walletEdit, [e.target.name]: e.target.value });
    }
  };

  const handleDeleteWallet = (id) => {
    Swal.fire({
      title: 'Are you sure to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`http://localhost:3001/wallet/delete/${id}`)
          .then((res) => {
            dispatch(changeFlag(1));
            setDetail(<h5>Choose wallet to see details</h5>);
          })
          .catch((err) => console.log(err));
        Swal.fire('Deleted!', 'Wallet has been deleted.', 'success');
      }
    });
  };

  const handleSaveEdit = async (id) => {
    await axios
      .put(`http://localhost:3001/wallet/update/${id}`, walletEdit)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Update Successfully!',
        });
        dispatch(changeFlag(1));
        setDetail(<h5>Choose wallet to see details</h5>);
      })
      .catch((err) => console.log(err));
    setOpen(false);
  };

  return (
    <>
      <Helmet>
        <title> Wallet | Money Manager Master </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3" gutterBottom>
          Wallet Manager
        </Typography>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenCreate}>
          New Wallet
        </Button>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit wallet</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your update infomation</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Wallet Name"
            type="text"
            fullWidth
            variant="standard"
            value={walletEdit.name}
            onChange={onChangeEdit}
          />
          <TextField
            autoFocus
            margin="dense"
            name="amount"
            label="Wallet Amount"
            type="number"
            fullWidth
            variant="standard"
            value={walletEdit.amount}
            onChange={onChangeEdit}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSaveEdit(walletEdit._id)}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Detail Wallet */}

      <Grid container spacing={3}>
        <Grid item xs />
        <Grid item xs={8} sx={{ padding: 0 }}>
          {wallets.map((item, index) => (
            <Accordion expanded={expanded === `panel${index + 1}`} onChange={handleChangeDetail(`panel${index + 1}`)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                <Typography sx={{ width: '80%', flexShrink: 0, display: 'flex' }}>
                  <Avatar src={item.icon} sx={{ mr: 0 }} />
                  <ListItemText primary={item.name} sx={{pr : 22, ml : 2, display: 'block !important' , 
                  alignItems: 'center', marginTop: 1 }} />
                </Typography>

                <Typography sx={{ color: 'text.secondary' }}>Wallet {index + 1}</Typography>
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
                            {item.name}
                          </TableCell>
                          <TableCell align="right">{numberWithCommas(item.amount)} VNĐ</TableCell>
                          <TableCell align="right">
                            <Button variant="contained" color="primary" onClick={() => handleClickOpen(item._id)}>
                              Edit
                            </Button>
                            <Button variant="contained" color="error" onClick={() => handleDeleteWallet(item._id)}>
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
        <Grid item xs />
      </Grid>

      {/* Done */}

      {/* Dialog create wallet/>*/}

      <Dialog
        TransitionComponent={Transition}
        fullWidth={true}
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
                    onChange={handleChangeIcon}
                    sx={{ height: 55 }}
                  >
                    <MenuItem value={`/assets/icons/wallets/cash.svg`}>
                      <Avatar src={`/assets/icons/wallets/cash.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/wallets/card.svg`}>
                      <Avatar src={`/assets/icons/wallets/card.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/wallets/credit-card.svg`}>
                      <Avatar src={`/assets/icons/wallets/credit-card.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                    <MenuItem value={`/assets/icons/wallets/saving.svg`}>
                      <Avatar src={`/assets/icons/wallets/saving.svg`} sx={{ mr: 0 }} />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <TextField
                name="name"
                onChange={handleChangeCreate}
                fullWidth={true}
                label="Name Wallet"
                variant="outlined"
                value={wallet.name}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                name="amount"
                onChange={handleChangeCreate}
                fullWidth={true}
                label="Amount"
                variant="outlined"
                type="number"
                value={wallet.amount}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCreate}>
            Cancel
          </Button>
          <Button variant="contained" startIcon={<Iconify icon="uis:check" />} onClick={handleSubmitCreate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
