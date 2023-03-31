import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import { AppCurrentVisits, AppWebsiteVisits } from '../sections/@dashboard/app';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import { CSVLink } from 'react-csv';
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
  DialogActions,
  Slide,
  TextField,
  Stack,
  Alert,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import getDataBarChart from '../getDataBarChart';
import axios from 'axios';
import getFormatDate from './../getDateFormat';
import getCircleData from '../getCircleData';
import Swal from 'sweetalert2';
import { enviroment } from 'src/enviroment/enviroment';

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
  let lastMonth, daysOfMonth;
  if (month > 0) {
    lastMonth = month.toString().length > 1 ? month : '0' + month;
    daysOfMonth = new Date(year, month, 0).getDate();
  } else if (month === 0) {
    lastMonth = 1;
    daysOfMonth = new Date(year, lastMonth, 0).getDate();
  } else {
    lastMonth = 12;
    year = year - 1;
    daysOfMonth = new Date(year, lastMonth, 0).getDate();
  }
  return {
    last_start: `${lastMonth}/01/${year}`,
    last_end: `${lastMonth}/${daysOfMonth}/${year}`,
  };
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

let day = new Date();
let { start_date, end_date } = getStartEndDate(day);
let { last_start, last_end } = getLastStartEndDate(day);

function ReportPage() {
  const [loading, setLoading] = useState({
    filter: false,
    export: false,
  });
  const [disabled, setDisabled] = useState({
    filter: false,
    export: false,
  });
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [openChooseDay, setOpenChooseDay] = useState(false);
  const [displayDate, setDisplayDate] = useState('Today');
  const [form, setForm] = useState({
    date: '',
    wallet_id: '',
  });
  const [dataEmpty, setDataEmpty] = useState(false);
  const [dataExport, setDataExport] = useState({
    list: [],
    filename: '',
    headers: [
      { label: 'Category Name', key: 'category_name' },
      { label: 'Category Type', key: 'category_type' },
      { label: 'Date', key: 'date' },
      { label: 'Amount', key: 'amount' },
      { label: 'Wallet Name', key: 'wallet_name' },
      { label: 'Note', key: 'note' },
    ],
  });
  const [wallets, setWallets] = useState([]);
  const [defaultWallet, setDefaultWallet] = useState('');
  const [defaultDate, setDefaultDate] = useState('today');
  const [pickDate, setPickDate] = useState({
    pick_start: null,
    pick_end: null,
  });
  const [dataApi, setDataApi] = useState({
    start_date: '',
    end_date: '',
    wallet_id: '',
    user_id: '',
  });
  const [error, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const userID = JSON.parse(localStorage.getItem('user')).user_id;
  const theme = useTheme();
  const handleCloseDialogChooseDate = () => {
    setPickDate({
      pick_start: null,
      pick_end: null,
    });
    setOpenChooseDay(false);
    setDefaultDate('today');
    setForm({ ...form, date: 'today' });
  };

  const [incomeData, setIcomeData] = useState([]);
  const [expenseData, setExpensData] = useState([]);

  const closeChooseDay = () => {
    setOpenChooseDay(false);
    setDefaultDate('today');
    setForm({ ...form, date: 'today' });
  };

  const getWalletsApi = async (id) => {
<<<<<<< HEAD
    return await axios.get(`http://localhost:3001/wallet/get-all-wallet/${id}`);
=======
    return await axios.get(`${enviroment.apiUrl}/wallet/get-all-wallet/${id}`);
>>>>>>> 650520c5c1ef5ffc59bbd50646230bf6cf8befdb
  };

  useEffect(() => {
    getWalletsApi(userID)
      .then((res) => {
        if (res.data.type === 'success') {
          setDefaultWallet('total');
          setForm({ date: 'today', wallet_id: 'total' });
          setDefaultDate('today');
          setWallets(res.data.wallet);
        } else console.log(res.data);
      })
      .catch((err) =>
        Swal.fire({
          icon: 'error',
          title: 'Something Wrong!',
          text: 'Something wrong! Please try again!',
          showConfirmButton: false,
          timer: 2000,
        })
      );
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
          setPickDate({
            pick_start: null,
            pick_end: null,
          });
        }
        setDefaultDate(e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
        break;
      default:
    }
  };

  useEffect(() => {
    setDataApi({ ...dataApi, user_id: userID });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTransCustomApi = async (data) => {
<<<<<<< HEAD
    return await axios.post('http://localhost:3001/transaction/get-transaction-custom', data);
=======
    return await axios.post(`${enviroment.apiUrl}/transaction/get-transaction-custom`, data);
>>>>>>> 650520c5c1ef5ffc59bbd50646230bf6cf8befdb
  };

  useEffect(() => {
    if (form && form.date && form.wallet_id) {
      switch (form.date) {
        case 'today':
          if (form.wallet_id === 'total') {
            setDataApi({ ...dataApi, start_date: '', end_date: '', wallet_id: '' });
          } else {
            setDataApi({ ...dataApi, wallet_id: form.wallet_id, start_date: '', end_date: '' });
          }
          break;
        case 'this month':
          if (form.wallet_id === 'total') {
            setDataApi({ ...dataApi, start_date: start_date, end_date: end_date, wallet_id: '' });
          } else {
            setDataApi({ ...dataApi, start_date: start_date, end_date: end_date, wallet_id: form.wallet_id });
          }
          break;
        case 'last month':
          if (form.wallet_id === 'total') {
            setDataApi({ ...dataApi, start_date: last_start, end_date: last_end, wallet_id: '' });
          } else {
            setDataApi({ ...dataApi, start_date: last_start, end_date: last_end, wallet_id: form.wallet_id });
          }
          break;
        case 'custom':
          if (form.wallet_id === 'total') {
            setDataApi({ ...dataApi, start_date: pickDate.pick_start, end_date: pickDate.pick_end, wallet_id: '' });
          } else {
            setDataApi({
              ...dataApi,
              start_date: pickDate.pick_start,
              end_date: pickDate.pick_end,
              wallet_id: form.wallet_id,
            });
          }
          break;
        default:
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, dataApi, pickDate]);

  const handleFilter = (e) => {
    setLoading({ ...loading, filter: true });
    setDisabled({ ...disabled, filter: true });
    getTransCustomApi(dataApi)
      .then((res) => {
        setLoading({ ...loading, filter: false });
        setDisabled({ ...disabled, filter: false });
        if (res.data.data.transactions.length > 0) {
          if (res.data.data.startDate === res.data.data.endDate) {
            setDisplayDate(`Today`);
          } else {
            setDisplayDate(`Period: From ${res.data.data.startDate} To ${res.data.data.endDate}`);
          }
          setDataEmpty(false);
          const data = getDataBarChart(res.data.data);
          const circleData = getCircleData(res.data.data);
          setIcomeData(circleData.income);
          setExpensData(circleData.expense);
          setChartLabels(data.chartLabels);
          setChartData(data.chartData);
          setDataExport({
            ...dataExport,
            list: res.data.data.transactions,
            filename: `Bao_cao_tai_chinh_from_${res.data.data.startDate}_to_${res.data.data.endDate}`,
          });
        } else {
          const circleData = getCircleData(res.data.data);
          if (res.data.data.startDate === res.data.data.endDate) {
            setDisplayDate(`Today`);
          } else {
            setDisplayDate(`Period: From ${res.data.data.startDate} To ${res.data.data.endDate}`);
          }
          setIcomeData(circleData.income);
          setExpensData(circleData.expense);
          setDataExport({
            ...dataExport,
            list: res.data.data.transactions,
            filename: `Bao_cao_tai_chinh_from_${res.data.data.startDate}_to_${res.data.data.endDate}`,
          });
          setDataEmpty(true);
        }
      })
      .catch((err) => {
        setLoading({ ...loading, filter: false });
        setDisabled({ ...disabled, filter: false });
        Swal.fire({
          icon: 'error',
          title: 'Something Wrong!',
          text: 'Something wrong! Please try again!',
          showConfirmButton: false,
          timer: 2000,
        });
      });
  };

  const handleChangePickDate = (value) => {
    let date_end = dayjs(value).format('MM/DD/YYYY');
    let result = new Date(date_end) - new Date(pickDate.pick_start);
    if (date_end === pickDate.pick_start || result < 0) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    } else {
      setPickDate({ ...pickDate, pick_end: date_end });
    }
  };

  const handleSubmitPickDate = () => {
    if (pickDate.pick_start === null || pickDate.pick_end === null) {
      setError1(true);
      setTimeout(() => {
        setError1(false);
      }, 3000);
    } else {
      setOpenChooseDay(false);
    }
  };

  useEffect(() => {
    let user = localStorage.getItem('user');
    if (user) {
      let userId = JSON.parse(user).user_id;
      let data = {
        user_id: userId,
        start_date: '',
        end_date: '',
        wallet_id: '',
      };
      getTransCustomApi(data)
        .then((res) => {
          if (res.data.data.transactions.length > 0) {
            setDataEmpty(false);
            const dataBarChart = getDataBarChart(res.data.data);
            const circleData = getCircleData(res.data.data);
            setIcomeData(circleData.income);
            setExpensData(circleData.expense);
            setChartLabels(dataBarChart.chartLabels);
            setChartData(dataBarChart.chartData);
            setDataExport({
              ...dataExport,
              list: res.data.data.transactions,
              filename: `Bao_cao_tai_chinh_from_${res.data.data.startDate}_to_${res.data.data.endDate}`,
            });
          } else {
            setDataExport({
              ...dataExport,
              list: res.data.data.transactions,
              filename: `Bao_cao_tai_chinh_from_${res.data.data.startDate}_to_${res.data.data.endDate}`,
            });
            setDataEmpty(true);
          }
        })
        .catch((err) =>
          Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text: 'Something wrong! Please try again!',
            showConfirmButton: false,
            timer: 2000,
          })
        );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Report | Money Manager Master </title>
      </Helmet>

      <AppBar position="static" color="inherit">
        <Toolbar sx={{ height: '40px' }}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Typography variant="h6" sx={{ flexGrow: 1, pt: '6px' }}>
                Expense report
              </Typography>
            </Grid>
            <Grid item xs>
              <Grid container>
                <Grid item xs={4}>
                  <FormControl size="small" fullWidth sx={{ mr: '2px' }}>
                    <InputLabel> Date </InputLabel>
                    <Select value={defaultDate} name="date" onChange={handleChangeMenu} label=" Date ">
                      <MenuItem value={'today'}>Today</MenuItem>
                      <MenuItem value={'this month'}>This month</MenuItem>
                      <MenuItem value={'last month'}>Last month </MenuItem>
                      <MenuItem value={'custom'} onClick={() => setOpenChooseDay(true)}>
                        Custom
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
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
                  <LoadingButton
                    color="success"
                    type="submit"
                    variant="outlined"
                    sx={{ padding: '7px' }}
                    onClick={handleFilter}
                    loading={loading.filter}
                    disabled={disabled.filter}
                  >
                    Filter
                  </LoadingButton>
                </Grid>

                <Grid item xs={2} sx={{ textAlign: 'right' }}>
                  <LoadingButton variant="contained" color="warning" sx={{ height: '38px' }} loading={loading.export} disabled={disabled.export}>
                    <CSVLink
                      data={dataExport.list}
                      filename={dataExport.filename}
                      headers={dataExport.headers}
                      sx={{ padding: '7px', textDecoration: 'none' }}
                    >
                      Export
                    </CSVLink>
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: '10px' }}>
        <Grid item xs={12} md={6} lg={8}>
          {dataEmpty ? (
            <Paper
              elevant={3}
              sx={{
                width: '1056px',
                height: '150px',
                mt: '4px',
                color: 'inherit',
                padding: '24px',
                boxShadow: '1px 1px 1px 1px #CFD8E3 ',
                mr: 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.56,
                  fontFamily: 'Public Sans,sans-serif',
                  fontSize: '18px',
                }}
              >
                Income & Expense Reports
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  lineHeight: 1.56,
                  fontFamily: 'Public Sans,sans-serif',
                  fontSize: '14px',
                  color: '#637381',
                }}
              >
                {displayDate}
              </Typography>
              <Divider />
              <Typography
                component="p"
                sx={{
                  textAlign: 'center',
                  mt: 2,
                  fontStyle: 'italic',
                  fontWeight: 400,
                  lineHeight: 1.56,
                  fontFamily: 'Public Sans,sans-serif',
                  fontSize: '16px',
                  color: '#637381',
                }}
              >
                No Data
              </Typography>
            </Paper>
          ) : (
            <AppWebsiteVisits
              title="Income & Expense Reports"
              subheader={displayDate}
              chartLabels={chartLabels}
              chartData={chartData}
            />
          )}
        </Grid>
      </Box>

      <Box sx={{ mt: '10px' }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            {incomeData.length <= 0 ? (
              <Paper
                elevant={3}
                sx={{
                  width: '500',
                  height: '150px',
                  mt: '4px',
                  color: 'inherit',
                  padding: '24px',
                  boxShadow: '1px 1px 1px 1px #CFD8E3 ',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.56,
                    fontFamily: 'Public Sans,sans-serif',
                    fontSize: '18px',
                  }}
                >
                  Income
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    lineHeight: 1.56,
                    fontFamily: 'Public Sans,sans-serif',
                    fontSize: '14px',
                    color: '#637381',
                  }}
                >
                  {displayDate}
                </Typography>
                <Divider />
                <Typography
                  component="p"
                  sx={{
                    textAlign: 'center',
                    mt: 2,
                    fontStyle: 'italic',
                    fontWeight: 400,
                    lineHeight: 1.56,
                    fontFamily: 'Public Sans,sans-serif',
                    fontSize: '16px',
                    color: '#637381',
                  }}
                >
                  No Data
                </Typography>
              </Paper>
            ) : (
              <AppCurrentVisits
                title="Income"
                subheader={displayDate}
                chartData={incomeData}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                  theme.palette.success.main,
                  theme.palette.secondary.main,
                  theme.palette.info.light,
                ]}
                sx={{ boxShadow: '1px 1px 1px 1px #CFD8E3 ' }}
              />
            )}
          </Grid>
          <Grid item xs={6} md={6}>
            {expenseData.length <= 0 ? (
              <Paper
                elevant={3}
                sx={{
                  width: '500',
                  height: '150px',
                  mt: '4px',
                  color: 'inherit',
                  padding: '24px',
                  boxShadow: '1px 1px 1px 1px #CFD8E3 ',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.56,
                    fontFamily: 'Public Sans,sans-serif',
                    fontSize: '18px',
                  }}
                >
                  Expense
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 400,
                    lineHeight: 1.56,
                    fontFamily: 'Public Sans,sans-serif',
                    fontSize: '14px',
                    color: '#637381',
                  }}
                >
                  {displayDate}
                </Typography>
                <Divider />
                <Typography
                  component="p"
                  sx={{
                    textAlign: 'center',
                    mt: 2,
                    fontStyle: 'italic',
                    fontWeight: 400,
                    lineHeight: 1.56,
                    fontFamily: 'Public Sans,sans-serif',
                    fontSize: '16px',
                    color: '#637381',
                  }}
                >
                  No Data
                </Typography>
              </Paper>
            ) : (
              <AppCurrentVisits
                title="Expense"
                subheader={displayDate}
                chartData={expenseData}
                chartColors={[
                  theme.palette.primary.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                  theme.palette.success.main,
                  theme.palette.secondary.main,
                  theme.palette.info.light,
                ]}
                sx={{ boxShadow: '1px 1px 1px 1px #CFD8E3 ' }}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={openChooseDay}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeChooseDay}
        aria-describedby="alert-dialog-slide-description"
      >
        <Typography variant="h5" padding={3} pb={0}>
          Choose <span style={{ textDecoration: 'underline', color: 'blue' }}>Start Date</span> And{' '}
          <span style={{ textDecoration: 'underline', color: 'blue' }}>End Date</span>{' '}
        </Typography>
        {error ? (
          <Stack spacing={2} sx={{ padding: 2 }}>
            <Alert severity="error">
              You cannot select the end date to be the day before the start date or select the same date! Please try
              again!
            </Alert>
          </Stack>
        ) : (
          ''
        )}
        {error1 ? (
          <Stack spacing={2} sx={{ padding: 2 }}>
            <Alert severity="error">Some fields are empty! Try again!</Alert>
          </Stack>
        ) : (
          ''
        )}
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  inputFormat="MM/DD/YYYY"
                  disableFuture={true}
                  label="Start Date"
                  value={pickDate.pick_start}
                  onChange={(newValue) =>
                    setPickDate({ ...pickDate, pick_start: dayjs(newValue).format('MM/DD/YYYY') })
                  }
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disableFuture={true}
                  label="End Date"
                  inputFormat="MM/DD/YYYY"
                  value={pickDate.pick_end}
                  onChange={(newValue) => handleChangePickDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogChooseDate} variant="outlined" color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmitPickDate} variant="outlined" color="success">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ReportPage;
