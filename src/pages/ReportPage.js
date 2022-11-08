import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import { AppWebsiteVisits } from '../sections/@dashboard/app';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  AppBar,
  Button,
  Grid,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Slide,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import getDataBarChart from '../getDataBarChart';
import axios from 'axios';
import getFormatDate from './../getDateFormat';
import transaction from "../_mock/transaction";
import {Box} from "@mui/system";


const getStartEndDate = (date) => {
  let day = getFormatDate(date);
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let thisMonth = day.slice(0, 2);
  let daysOfMonth = new Date(year, month, 0).getDate();
  return {
    start_date: `${thisMonth}/01/${year}`,
    end_date: `${thisMonth}/${daysOfMonth}/${year}`,
  };
};

const getLastStartEndDate = (date) => {
  let month = date.getMonth();
  let year = date.getFullYear();
  let thisMonth, daysOfMonth;
  if (month !== 0) {
    thisMonth = month.toString().length > 1 ? month : '0' + month;
    daysOfMonth = new Date(year, month, 0).getDate();
  } else {
    thisMonth = 12;
    year = year - 1;
    daysOfMonth = new Date(year, thisMonth, 0).getDate();
  }
  return {
    start_date: `${thisMonth}/01/${year}`,
    end_date: `${thisMonth}/${daysOfMonth}/${year}`,
  };
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ReportPage() {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [openChooseDay, setOpenChooseDay] = useState(false);
  const [form, setForm] = useState({
    date: '',
    wallet_id: '',
  });
  const [wallets, setWallets] = useState([]);
  const [defaultWallet, setDefaultWallet] = useState('');
  const [defaultDate, setDefaultDate] = useState('today');
  const [pickStartDate, setPickStartDate] = useState('');
  const [pickEndDate, setPickEndDate] = useState('');

  useEffect(() => {
    const data = getDataBarChart();
    setChartLabels(data.chartLabels);
    setChartData(data.chartData);
  }, []);

  const getWalletsApi = async (id) => {
    return axios.get(`http://localhost:3001/wallet/get-all-wallet/${id}`);
  };

  useEffect(() => {
    const userID = JSON.parse(localStorage.getItem('user')).user_id;
    getWalletsApi(userID)
      .then((res) => {
        if (res.data.type === 'success') {
          setDefaultWallet('total');
          setForm({ date: 'today', wallet_id: 'total' });
          setDefaultDate('today');
          setWallets(res.data.wallet);
        } else console.log(res.data);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeMenu = (e) => {
    switch (e.target.name) {
      case 'wallet_id':
        setDefaultWallet(e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
        break;
      case 'date':
        if (e.target.value === 'custom') {
          setOpenChooseDay(true);
        }
        setDefaultDate(e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
        break;
      default:
    }
  };

  const getTransCustomApi = async (data) => {
    return await axios.post('http://localhost:3001/transaction/get-transaction-custom', data);
  };

  const handleFilter = (e) => {
    const userID = JSON.parse(localStorage.getItem('user')).user_id;
    if (form && form.date && form.wallet_id) {
      if (form.date === 'today') {
        if (form.wallet_id === 'total') {
          getTransCustomApi({ user_id: userID })
            .then((res) => console.log(res.data.data))
            .catch((err) => console.log(err));
        } else {
          getTransCustomApi({
            user_id: userID,
            wallet_id: form.wallet_id,
          })
            .then((res) => console.log(res.data.data))
            .catch((err) => console.log(err));
        }
      } else if (form.date === 'this month') {
        let day = new Date();
        let { start_date, end_date } = getStartEndDate(day);
        if (form.wallet_id === 'total') {
          let data = {
            start_date: start_date,
            end_date: end_date,
            user_id: userID,
          };
          getTransCustomApi(data)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
        } else {
          let data = {
            start_date: start_date,
            end_date: end_date,
            user_id: userID,
            wallet_id: form.wallet_id,
          };
          getTransCustomApi(data)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
        }
      } else if (form.date === 'last month') {
        let day = new Date();
        let { start_date, end_date } = getLastStartEndDate(day);
        if (form.wallet_id === 'total') {
          let data = {
            user_id: userID,
            start_date: start_date,
            end_date: end_date,
          };
          getTransCustomApi(data)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
        } else {
          let data = {
            user_id: userID,
            start_date: start_date,
            end_date: end_date,
            wallet_id: form.wallet_id,
          };
          getTransCustomApi(data)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
        }
      } else {
      }
    }
  };

  return (
    <>
      <Helmet>
        <title> Report | Money Manager Master </title>
      </Helmet>

      <AppBar position="static" color="inherit">
        <Toolbar sx={{ height: '40px' }}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, pt: '6px' }}>
                Expense report
              </Typography>
            </Grid>
            <Grid item xs>
              <Grid container>
                <Grid item xs={5}>
                  <FormControl size="small" fullWidth sx={{ mr: '2px' }}>
                    <InputLabel> Date </InputLabel>
                    <Select value={defaultDate} name="date" onChange={handleChangeMenu} label=" Date ">
                      <MenuItem value={'today'}>Today</MenuItem>
                      <MenuItem value={'this month'}>This month</MenuItem>
                      <MenuItem value={'last month'}>Last month </MenuItem>
                      <MenuItem value={'custom'}>Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={5}>
                  <FormControl size="small" fullWidth sx={{ pl: '4px' }}>
                    <InputLabel> Wallet </InputLabel>
                    <Grid container>
                      <Select
                        value={defaultWallet}
                        onChange={handleChangeMenu}
                        name="wallet_id"
                        sx={{ pl: 0, height: '40px' }}
                        label=" Wallet "
                        fullWidth
                      >
                        <MenuItem key={'0'} value={'total'} sx={{ width: '100%', height: '40px' }}>
                          <Grid item xs={2}>
                            <Avatar src="/assets/icons/wallets/total.svg" sx={{ width: '28px', height: '28px' }} />
                          </Grid>
                          <Grid item xs sx={{ textAlign: 'center' }}>
                            {' '}
                            <ListItemText primary="Total" />
                          </Grid>
                        </MenuItem>
                        {wallets.map((wallet, index) => (
                          <MenuItem key={wallet._id} value={wallet._id} sx={{ width: '100%', height: '40px' }}>
                            <Grid item xs={2}>
                              <Avatar src={wallet.icon} sx={{ width: '28px', height: '28px' }} />
                            </Grid>
                            <Grid item xs sx={{ textAlign: 'center' }}>
                              {' '}
                              <ListItemText primary={wallet.name} />
                            </Grid>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <Button
                    color="success"
                    type="submit"
                    variant="outlined"
                    sx={{ padding: '7px' }}
                    onClick={handleFilter}
                  >
                    Filter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Box sx={{mt: "10px"}}>
        <Grid item xs={12} md={6} lg={8}>
          <AppWebsiteVisits
              title="This month Reports"
              subheader="(+43%) than last year"
              chartLabels={chartLabels}
              chartData={chartData}
          />
        </Grid>
      </Box>

      <Dialog
        open={openChooseDay}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenChooseDay(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
            <Grid item xs></Grid>
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Basic example"
              value={pickStartDate}
              onChange={(newValue) => {
                setPickStartDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChooseDay(false)} variant='outlined' color='error' >Cancel</Button>
          <Button onClick={() => setOpenChooseDay(false)} variant='outlined' color='success'>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ReportPage;
