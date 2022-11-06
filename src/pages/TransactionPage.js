import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Slide,
  Stack,
  TextField,
  Typography,
  Divider,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import Iconify from '../components/iconify';
import Swal from 'sweetalert2';
import { changeFlag } from '../features/flagSlice';
import { useDispatch } from 'react-redux';
//css
import '../css/transaction.css';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TransactionPage() {
  const [value, setValue] = useState(dayjs());
  const [openAddForm, setOpenAddForm] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [listTransaction, setListTransaction] = useState([]);
  const [listWallet, setListWallet] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [transaction, setTransaction] = useState({
    wallet_id: '',
    category_id: '',
    amount: 0,
    note: '',
    date: dayjs(value).format('DD/MM/YYYY'),
  });
  const [defaultWallet, setDefaultWallet] = useState('');
  const [expanded, setExpanded] = useState(false);

  //redux
  const dispatch = useDispatch();

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getData = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).user_id;
    await axios
      .get(`http://localhost:3001/transaction/get-all-transaction/${userId}`)
      .then((res) => setListTransaction(res.data.data.data))
      .catch((err) => console.log(err));
    await axios
      .get(`http://localhost:3001/category/get-category/${userId}`)
      .then((res) => setListCategory(res.data.categoryUser))
      .catch((err) => console.log(err));
    await axios
      .get(`http://localhost:3001/wallet/get-all-wallet/${userId}`)
      .then((res) => setListWallet(res.data.wallet))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (listWallet.length > 0) {
      setDefaultWallet(listWallet[0]._id);
      setTransaction({ ...transaction, wallet_id: listWallet[0]._id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listWallet]);

  const handleChange = (e) => {
    if (e.target) {
      if (e.target.name === 'amount') {
        setTransaction({ ...transaction, [e.target.name]: parseInt(e.target.value) });
      } else if (e.target.name === 'wallet_id') {
        setDefaultWallet(e.target.value);
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
      } else {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
      }
    } else {
      setValue(e);
      setTransaction({ ...transaction, date: dayjs(e).format('DD/MM/YYYY') });
    }
  };

  const handleClickOpen = () => {
    setOpenAddForm(true);
  };

  const handleClose = () => {
    setOpenAddForm(false);
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user')).user_id;
    setTransaction({ ...transaction, user_id: userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    console.log(transaction);
    if (transaction.category_id === '' || transaction.wallet_id === '' || transaction.amount === '') {
      setOpenAddForm(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
      });
    } else {
      await axios
        .post('http://localhost:3001/transaction/add-transaction', transaction)
        .then((res) => {
          if (res.status === 200) {
            dispatch(changeFlag(1));
            setTransaction({
              wallet_id: '',
              category_id: '',
              amount: 0,
              note: '',
              date: dayjs(value).format('DD/MM/YYYY'),
            });
            Swal.fire({
              icon: 'success',
              title: 'Add transaction successfully!',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            });
          }
        })
        .catch((err) => console.log(err));
      setOpenAddForm(false);
      dispatch(changeFlag(1));
    }
  };

  return (
    <>
      <Helmet>
        <title> Transaction | Money Manager Master </title>
      </Helmet>

      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ padding: '0px', height: '50px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h3">Transaction</Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
              New Transaction
            </Button>
          </Stack>
        </Grid>
        <Grid item xs />
        <Grid item xs={8} sx={{ padding: 0 }}>
          <Stack>
            <Grid>
              <Grid>
                <Card>
                  <CardContent sx={{ pb: 0 }}>
                    <h2 style={{ padding: 0, margin: 0 }}>Transaction Info</h2>
                    <hr />
                    <Grid container>
                      <Grid xs>Inflow</Grid>
                      <Grid xs sx={{ textAlign: 'right', color: '#039BE5' }}>
                        + 30000 <span style={{ textDecoration: 'underline' }}>đ</span>
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={6}>
                        Outflow
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right', color: '#E51C23' }}>
                        - 30000 <span style={{ textDecoration: 'underline' }}>đ</span>
                      </Grid>
                    </Grid>
                    <hr />
                    <p style={{ textAlign: 'right' }}>
                      0 <span style={{ textDecoration: 'underline' }}>đ</span>
                    </p>
                  </CardContent>
                  <Divider />
                  {listTransaction.map((item, index) => (
                    <CardActions sx={{ width: '100%' }} key={index}>
                      <Accordion
                        expanded={expanded === `panel${index + 1}`}
                        onChange={handleExpand(`panel${index + 1}`)}
                      >
                        <Grid container>
                          <AccordionSummary
                            aria-controls={`panel${index + 1}bh-content`}
                            id={`panel${index + 1}bh-header`}
                            sx={{ width: '100%', height: '60px', display:'inline-flex' }}
                          >
                            <Stack>
                              <Typography sx={{ width: '100%'}}>
                                <Grid container spacing={3}>
                                  <Grid item xs={2} sx={{ direction: 'inline-block' }} >
                                    {' '}
                                    <Avatar src={item.wallet_icon} />
                                  </Grid>
                                  <Grid item xs={5} sx={{ pt: '20px', pl: '5px' }}>
                                    {item.wallet_name}
                                  </Grid>
                                  {item.type === 'expense' ? (
                                    <Grid item xs={5} sx={{ color: '#E51C23', textAlign: 'right', pt: '20px', width: "100%" }}>
                                      - {item.amount} <span style={{ textDecoration: 'underline' }}>đ</span>
                                    </Grid>
                                  ) : (
                                    <Grid item xs={5} sx={{ color: '#039BE5', textAlign: 'right', pt: '20px', width: "100%" }}>
                                      + {item.amount} <span style={{ textDecoration: 'underline' }}>đ</span>
                                    </Grid>
                                  )}
                                </Grid>
                              </Typography>
                            </Stack>
                          </AccordionSummary>
                        </Grid>

                        <AccordionDetails>
                          <Grid container>
                            <Grid item xs>
                              Transaction Details
                            </Grid>
                            <hr />
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                      <Divider />
                    </CardActions>
                  ))}
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs />
      </Grid>

      <Dialog
        open={openAddForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>{'Add Transaction'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Remember to Record Your Transactions Today.</DialogContentText>
          <hr />
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Wallet</InputLabel>
                <Select
                  onChange={handleChange}
                  defaultValue="Cash"
                  label="Wallet"
                  name="wallet_id"
                  value={defaultWallet}
                >
                  {listWallet.map((wallet) => (
                    <MenuItem key={wallet._id} value={wallet._id}>
                      <Avatar src={wallet.icon} />
                      <ListItemText primary={wallet.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Categories</InputLabel>
                <Select onChange={handleChange} label="Categories" name="category_id">
                  {listCategory.map((category) => (
                    <MenuItem key={category.name} value={category._id}>
                      <Avatar src={category.icon} />
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                name="amount"
                onChange={handleChange}
                fullWidth={true}
                label="Amount"
                variant="outlined"
                type="number"
                margin="dense"
                InputProps={{ startAdornment: <InputAdornment position="start">VNĐ</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="DD/MM/YYYY"
                  value={value}
                  name="date"
                  disableFuture={true}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="note"
                onChange={handleChange}
                fullWidth={true}
                label="Note"
                variant="outlined"
                type="text"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button sx={{ color: 'white' }} variant="contained" color="success" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
