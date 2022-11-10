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
  Card,
  CardContent,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  ListSubheader,
  Tab,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { forwardRef, useEffect, useState } from 'react';
import axios from 'axios';
import Iconify from '../components/iconify';
import Swal from 'sweetalert2';
import { changeFlag } from '../features/flagSlice';
import { useDispatch, useSelector } from 'react-redux';
//css
import '../css/transaction.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function numberWithCommas(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getDayy(x) {
  const day = ['Sunday ', 'Monday', 'Tuesday ', 'Wednesday ', 'Thursday', 'Friday ', 'Sunday '];
  return day[x];
}

export default function TransactionPage() {
  const flag = useSelector((state) => state.flag.flag);
  const [value, setValue] = useState(dayjs());
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [listTransaction, setListTransaction] = useState([]);
  const [listWallet, setListWallet] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [transaction, setTransaction] = useState({
    wallet_id: '',
    category_id: '',
    amount: 0,
    note: '',
    date: dayjs(value).format('MM/DD/YYYY'),
  });
  const [editTransaction, setEditTransaction] = useState({
    wallet_id: '',
    category_id: '',
    amount: 0,
    note: '',
    date: dayjs(value).format('MM/DD/YYYY'),
  });
  const [defaultWallet, setDefaultWallet] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [moneyFlow, setMoneyFlow] = useState({
    inflow: 0,
    outflow: 0,
  });
  const [category, setCategory] = useState('expense');

  const handleChangeCategory = (e, category) => {
    setCategory(category);
  };

  const handleChooseCategory = (id) => {
    setTransaction({ ...transaction, category_id: id });
    setEditTransaction({ ...transaction, category_id: id });
    setOpenCategory(false);
  };

  //redux
  const dispatch = useDispatch();

  const handleExpand = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getDataApi = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).user_id;
    return await axios.get(`http://localhost:3001/transaction/transaction-this-month/${userId}`);
  };

  const getData = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).user_id;
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
    getDataApi()
      .then((res) => {
        setListTransaction(res.data.data.list);
        setMoneyFlow({
          inflow: res.data.data.inflow,
          outflow: res.data.data.outflow,
        });
      })
      .catch((err) => console.log(err));
  }, [flag]);

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
      setTransaction({ ...transaction, date: dayjs(e).format('MM/DD/YYYY') });
    }
  };

  const handleChangeEdit = (e) => {
    if (e.target) {
      if (e.target.name === 'amount') {
        setEditTransaction({ ...editTransaction, [e.target.name]: parseInt(e.target.value) });
      } else if (e.target.name === 'wallet_id') {
        // setDefaultWallet(e.target.value);
        setEditTransaction({ ...editTransaction, [e.target.name]: e.target.value });
      } else {
        setEditTransaction({ ...editTransaction, [e.target.name]: e.target.value });
      }
    } else {
      setValue(e);
      setEditTransaction({ ...editTransaction, date: dayjs(e).format('MM/DD/YYYY') });
    }
  };

  const handleClickOpenAddForm = () => {
    setOpenAddForm(true);
  };

  const handleCloseAddForm = () => {
    setValue(dayjs());
    setOpenAddForm(false);
  };

  const handleClickEditForm = (id) => {
    const editTransaction = listTransaction.filter((transaction) => transaction._id === id);

    if (editTransaction[0].category_name === 'Add Wallet') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can not edit Add Wallet Transaction!',
        showConfirmButton: false,
        timer: 2000,
      })
    } else {
      setOpenEditForm(true);
      setValue(dayjs(editTransaction[0].date));
      setEditTransaction(editTransaction[0]);
    }
  };

  const handleCloseEditForm = () => {
    setValue(dayjs());
    setOpenEditForm(false);
  };

  const handleClickOpenCategory = () => {
    setOpenCategory(true);
  };

  const closeCategory = () => {
    setOpenCategory(false);
  };

  const deleteTransApi = async (id) => {
    return await axios.delete(`http://localhost:3001/transaction/delete-transaction/${id}`);
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('user')).user_id;
    setTransaction({ ...transaction, user_id: userId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteTrans = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Delete This Transaction',
      text: 'Are you sure?',
      showCancelButton: true,
      confirmButtonColor: '#54D62C',
      cancelButtonColor: '#FF4842',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTransApi(id)
          .then((res) => {
            dispatch(changeFlag(1));
            setExpanded(false);
            Swal.fire({
              icon: 'success',
              title: 'Delete Success!',
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) =>
            Swal.fire({
              icon: 'warning',
              title: 'Something Wrong!',
              text: 'Try again!',
              showConfirmButton: false,
              timer: 1500,
            })
          );
      }
    });
  };

  const handleSubmit = async () => {
    if (transaction.category_id === '' || transaction.wallet_id === '' || transaction.amount === '') {
      setOpenAddForm(false);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      await axios
        .post('http://localhost:3001/transaction/add-transaction', transaction)
        .then((res) => {
          if (res.status === 200) {
            dispatch(changeFlag(1));
            setTransaction({
              ...transaction,
              category_id: '',
              amount: 0,
              note: '',
              date: dayjs().format('MM/DD/YYYY'),
            });
            Swal.fire({
              icon: 'success',
              title: 'Add transaction successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((err) => console.log(err));
      setOpenAddForm(false);
      dispatch(changeFlag(1));
    }
  };

  const handleEdit = async () => {
    if(editTransaction.category_name === 'Add Wallet') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You can not edit Add Wallet Transaction!',
        showConfirmButton: false,
        timer: 2000,
      })
    }else{
      if (editTransaction.category_id === '' || editTransaction.wallet_id === '' || isNaN(editTransaction.amount)) {
        setOpenEditForm(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill all the required fields',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios
            .put(`http://localhost:3001/transaction/update-transaction/${editTransaction._id}`, editTransaction)
            .then((res) => {
              setOpenEditForm(false);
              if (res.status === 200) {
                Swal.fire({
                  icon: 'success',
                  title: 'Edit transaction successfully!',
                  showConfirmButton: false,
                  timer: 1500,
                });
                dispatch(changeFlag(1));
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            })
            .catch((err) => console.log(err));
      }
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
            <Typography variant="h3" sx={{ml: '20px'}}>Transaction</Typography>
            <Button  sx={{mr: '20px'}} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpenAddForm}>
              New Transaction
            </Button>
          </Stack>
        </Grid>
        <Grid item xs />
        <Grid item xs={8} sx={{ padding: 0 }}>
          <Stack>
            <Grid>
              <Card>
                <CardContent>
                  <Typography sx={{ padding: 0, margin: 0 }} variant="h4">
                    Transaction Info
                  </Typography>
                  <hr />
                  <Grid container>
                    <Grid xs item>
                      Inflow
                    </Grid>
                    <Grid xs item sx={{ textAlign: 'right', color: '#039BE5' }}>
                      + {numberWithCommas(moneyFlow.inflow)}{' '}
                      <Typography component="span" sx={{ textDecoration: 'underline' }}>
                        đ
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6}>
                      Outflow
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right', color: '#E51C23' }}>
                      - {numberWithCommas(moneyFlow.outflow)}{' '}
                      <Typography component="span" sx={{ textDecoration: 'underline' }}>
                        đ
                      </Typography>
                    </Grid>
                  </Grid>
                  <hr />
                  <Typography sx={{ textAlign: 'right', mt: '16px' }}>
                    {moneyFlow.inflow - moneyFlow.outflow > 0 ? '+' : '-'}{' '}
                    {numberWithCommas(moneyFlow.inflow - moneyFlow.outflow)}{' '}
                    <Typography component="span" sx={{ textDecoration: 'underline' }}>
                      đ
                    </Typography>
                  </Typography>
                </CardContent>

                <Box
                  component="main"
                  sx={{
                    maxHeight: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    overflowY: 'scroll',
                  }}
                >
                  {listTransaction?.map((item, index) => (
                    <div key={index}>
                      <Box sx={{ heght: '20px', border: '1px solid #EAFCDE' }}></Box>
                      <Accordion
                        expanded={expanded === `panel${index + 1}`}
                        onChange={handleExpand(`panel${index + 1}`)}
                      >
                        <AccordionSummary
                          aria-controls={`panel${index + 1}bh-content`}
                          id={`panel${index + 1}bh-header`}
                          sx={{
                            width: '100%',
                            height: '60px',
                            flexShrink: 0,
                            justifyContent: 'flex-start',
                            padding: '24px',
                            backgroundColor: '#ECFFE0',
                          }}
                        >
                          <Grid container spacing={2} sx={{ pt: '4px' }}>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                              {' '}
                              <Avatar src={item.category_icon} />
                            </Grid>
                            <Grid item xs={5} sx={{ mt: '8px' }}>
                              {item.category_name}
                            </Grid>
                            {item.category_type === 'expense' ? (
                              <Grid
                                item
                                xs={5}
                                sx={{
                                  color: '#E51C23',
                                  textAlign: 'right',
                                  mt: '6px',
                                }}
                              >
                                - {numberWithCommas(item.amount)}{' '}
                                <Typography component="span" sx={{ textDecoration: 'underline' }}>
                                  đ
                                </Typography>
                              </Grid>
                            ) : (
                              <Grid
                                item
                                xs={5}
                                sx={{
                                  color: '#039BE5',
                                  textAlign: 'right',
                                  mt: '6px',
                                }}
                              >
                                + {numberWithCommas(item.amount)}{' '}
                                <Typography component="span" style={{ textDecoration: 'underline' }}>
                                  đ
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails sx={{ height: '235px', pb: 0 }}>
                          <Typography sx={{ height: '40px' }}>
                            <Grid container>
                              <Grid item xs sx={{ mt: 0, mb: 0 }}>
                                <Typography variant="h4" style={{ margin: 0 }}>
                                  Transaction Details
                                </Typography>
                              </Grid>
                              <Grid item xs={2} sx={{ textAlign: 'right' }}>
                                <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={() => handleClickEditForm(item._id)}
                                >
                                  EDIT
                                </Button>
                              </Grid>
                              <Grid item xs={2} sx={{ textAlign: 'right' }}>
                                <Button variant="outlined" color="error" onClick={() => handleDeleteTrans(item._id)}>
                                  DELETE
                                </Button>
                              </Grid>
                            </Grid>
                          </Typography>
                          <hr />
                          <Grid container>
                            <Grid item xs={2}>
                              <Avatar src={item.category_icon} sx={{ mr: 10 }} />
                            </Grid>
                            <Grid item xs sx={{ mt: '3px' }}>
                              <h3 style={{ margin: 0 }}>{item.category_name}</h3>
                              <Typography
                                sx={{
                                  marginTop: '0px',
                                  marginBottom: '0px',
                                  fontSize: '14px',
                                }}
                              >
                                {item.wallet_name}
                              </Typography>
                              <Typography sx={{ fontSize: '12px', fontWeight: 'light' }}>
                                {getDayy(new Date(`${item.date}`).getDay())}, {item.date}{' '}
                              </Typography>
                              <hr />
                              <Typography
                                sx={{
                                  margin: '8px 0px',
                                  fontSize: '12px',
                                }}
                              >
                                {item.note}{' '}
                              </Typography>
                              {item.category_type === 'income' ? (
                                <Typography sx={{ color: '#039BE5', marginBottom: 0 }}>
                                  + {numberWithCommas(item.amount)}{' '}
                                  <span
                                    sx={{
                                      color: '#039BE5',
                                      textDecoration: 'underline',
                                    }}
                                  >
                                    đ
                                  </span>
                                </Typography>
                              ) : (
                                <Typography sx={{ color: '#E51C23', marginBottom: 0 }}>
                                  - {numberWithCommas(item.amount)}{' '}
                                  <span
                                    sx={{
                                      color: '#E51C23',
                                      textDecoration: 'underline',
                                    }}
                                  >
                                    đ
                                  </span>
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs></Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  ))}
                </Box>
              </Card>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs />
      </Grid>

      <Dialog
        open={openAddForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAddForm}
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
                  label="Wallet"
                  name="wallet_id"
                  value={defaultWallet}
                  sx={{ height: '56px' }}
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
                <Select
                  onChange={handleChange}
                  label="Categories"
                  name="category_id"
                  value={transaction.category_id}
                  sx={{ height: '56px' }}
                  inputProps={{ readOnly: true }}
                  onClick={handleClickOpenCategory}
                >
                  {listCategory?.map((category) => (
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
                sx={{ height: '73' }}
                name="amount"
                onChange={handleChange}
                fullWidth={true}
                label="Amount"
                variant="outlined"
                type="number"
                margin="dense"
                value={transaction.amount}
                InputProps={{
                  startAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="MM/DD/YYYY"
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
                value={transaction.note}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseAddForm} color="error">
            Cancel
          </Button>
          <Button variant="outlined" color="success" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseEditForm}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>{'Edit Transaction'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Remember to Record Your Transactions Today.</DialogContentText>
          <hr />
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Wallet</InputLabel>
                <Select
                  onChange={handleChangeEdit}
                  label="Wallet"
                  name="wallet_id"
                  value={editTransaction.wallet_id}
                  sx={{ height: '56px' }}
                >
                  {listWallet?.map((wallet) => (
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
                <Select
                  onChange={handleChangeEdit}
                  label="Categories"
                  name="category_id"
                  value={editTransaction.category_id}
                  sx={{ height: '56px' }}
                  inputProps={{ readOnly: true }}
                  onClick={handleClickOpenCategory}
                >
                  {listCategory?.map((category) => (
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
                onChange={handleChangeEdit}
                fullWidth={true}
                label="Amount"
                variant="outlined"
                type="number"
                sx={{ height: '73' }}
                value={editTransaction.amount}
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
                  onChange={handleChangeEdit}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="note"
                onChange={handleChangeEdit}
                fullWidth={true}
                label="Note"
                variant="outlined"
                type="text"
                value={editTransaction.note}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseEditForm}>
            Cancel
          </Button>
          <Button sx={{ color: 'white' }} variant="contained" color="success" onClick={handleEdit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCategory} onClose={closeCategory}>
        <DialogTitle>Choose Category</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '300px', typography: 'body1', height: '300px' }}>
            <TabContext value={category}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChangeCategory} centered>
                  <Tab label="Income" value="income" />
                  <Tab label="Expense" value="expense" />
                </TabList>
              </Box>
              <TabPanel value="income" centered>
                {listCategory?.map((category) => {
                  if (category.type === 'income')
                    return (
                      <MenuItem key={category.name} onClick={() => handleChooseCategory(category._id)}>
                        <Avatar src={category.icon} />
                        <ListItemText primary={category.name} />
                      </MenuItem>
                    );
                })}
              </TabPanel>
              <TabPanel value="expense">
                {listCategory?.map((category) => {
                  if (category.type === 'expense')
                    return (
                      <MenuItem key={category.name} onClick={() => handleChooseCategory(category._id)}>
                        <Avatar src={category.icon} />
                        <ListItemText primary={category.name} />
                      </MenuItem>
                    );
                })}
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCategory} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
