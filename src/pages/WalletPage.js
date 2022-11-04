import { Helmet } from 'react-helmet-async';
import { forwardRef, useEffect, useState } from 'react';
import { changeFlag } from "../features/flagSlice";
import category from "../_mock/category";
import Iconify from "../components/iconify";
import wallet from '../_mock/wallet';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import dayjs from 'dayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as React from 'react';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from '@mui/material';

const Transition = React.forwardRef(function Transaction(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function WalletPage() {
  const [detail, setDetail] = useState(<h5>Choose wallet to see details</h5>);
  const [wallets, setWallets] = useState([]);
  const [walletEdit, setWalletEdit] = useState([]);


  // Create Wallet

  const [openCreate, setOpenCreate] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [wallet, setWallet] = useState()
  const [value, setValue] = useState(dayjs());
  const [openAddForm, setOpenAddForm] = useState(false);
const idUser = JSON.parse(localStorage.getItem('user')).user_id

  const handleClickOpenCreate = () => {
    setOpenCreate(true);
  };
  const handleCloseCreate = () => {
    setOpenCreate(false);
  };

  const handleChangeCreate = (e) => {
    setWallet({
      ...wallet,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmitCreate = async () => {
    setOpenAddForm(false);
    

    const result = await axios.post('http://localhost:3001/wallet/create')
    console.log(result)
  }


  // done
  const flag = useSelector(state => state.flag);
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
    const userId = JSON.parse(localStorage.getItem('user'))
    return await axios.get(` http://localhost:3001/wallet/get-all-wallet/${userId.user_id}`)
  }

  useEffect(() => {
    getAllWallet().then(res => setWallets(res.data.wallet)
    ).catch(error => console.log(error.message))
  }, [flag])

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
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3001/wallet/delete/${id}`)
          .then(res => {
            dispatch(changeFlag(1))
            setDetail(<h5>Choose wallet to see details</h5>)
          })
          .catch(err => console.log(err))
        Swal.fire(
          'Deleted!',
          'Wallet has been deleted.',
          'success'
        )
      }
    })
  }

  const handleSaveEdit = async (id) => {
    await axios.put(`http://localhost:3001/wallet/update/${id}`, walletEdit)
      .then(res => {
        Swal.fire({
          icon: 'success',
          title: 'Update Successfully!'
        })
        dispatch(changeFlag(1))
        setDetail(<h5>Choose wallet to see details</h5>)
      })
      .catch(err => console.log(err))
    setOpen(false);
  };

  const handleClick = (id) => {
    const wallet = wallets.filter((wallet) => wallet._id === id);
    setDetail(
      <>
        <h4>Wallet detail</h4>
        <hr />
        <p>Wallet Name: {wallet[0].name}</p>
        <hr />
        <p>Wallet Amount: {numberWithCommas(wallet[0].amount)}</p>
        <hr />
        <Button variant="contained" color="primary" onClick={() => handleClickOpen(id)}>
          Edit
        </Button>
        <Button variant="contained" color="error" onClick={() => handleDeleteWallet(id)}>
          Delete
        </Button>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title> Wallet | Money Manager Master </title>
      </Helmet>

      <h1>Wallet</h1>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={5} alignItems="center">
            <div>Total: 10.000.000</div>
          </Grid>
          <Grid item xs={4}>
            <h3>Detail</h3>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="flex-end">
              <Button color="success" variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenCreate}>
                Add new Wallet
              </Button>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <List>
              {wallets.slice(0, 3).map((item) => (
                <ListItem button onClick={() => handleClick(item._id)} key={item._id}>
                  <ListItemAvatar>
                    <Avatar alt={item.name} src={item.icon} />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} secondary={numberWithCommas(item.amount)} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={7}>
            <div>{detail}</div>
          </Grid>
        </Grid>
      </Paper>

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

      {/* Dialog create wallet/>*/}
      <Button variant="outlined" onClick={handleClickOpenCreate}>
        Slide in alert dialog
      </Button>
      <Dialog
        TransitionComponent={Transition}
        fullWidth={true}
        maxWidth='md'
        keepMounted
        open={openCreate}
        onClose={handleCloseCreate}>
        <DialogTitle>{"Add Wallet"}</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Form dialogs allow users to fill out form fields within a dialog. For example, if your site prompts for potential subscribers to fill in their email address, they can fill out the email field and touch 'Submit'.
          </DialogContentText>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField name="icon" onChange={handleChangeCreate} fullWidth={true} label="Icon" variant="outlined" />
            </Grid>

            <Grid item xs={6}>
              <TextField name="name" onChange={handleChangeCreate} fullWidth={true} label="Name" variant="outlined" />
            </Grid>

            <Grid item xs={6}>
              <TextField name="user_id" onChange={handleChangeCreate} fullWidth={true} variant="outlined" />{idUser} 
            </Grid>
            <Grid item xs={6}>
              <TextField name="amount" onChange={handleChangeCreate} fullWidth={true} label="Amount" variant="outlined" type="number" />
            </Grid>
            <Grid item xs={6}>


              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  fullWidth
                  label="Date desktop"
                  inputFormat="DD/MM/YYYY"
                  value={value}
                  name="date"
                  onChange={handleChangeCreate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCreate}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSubmitCreate}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
