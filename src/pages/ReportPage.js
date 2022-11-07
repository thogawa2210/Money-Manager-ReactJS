import { Helmet } from 'react-helmet-async';
import { AppWebsiteVisits } from '../sections/@dashboard/app';
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
} from '@mui/material';
import { useEffect, useState } from 'react';
import getDataBarChart from '../getDataBarChart';
import { useSelector } from 'react-redux';
import axios from 'axios';

function ReportPage() {
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [menu, setMenu] = useState();
  const [openChooseDay, setOpenChooseDay] = useState(false);
  const [form, setForm] = useState({});
  const [wallets, setWallets] = useState([]);
  const [defaultWallet, setDefaultWallet] = useState('');
  const totalWallet = useSelector((state) => state.total.wallet.amount);

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
          setDefaultWallet(res.data.wallet[0].name);
          setWallets(res.data.wallet);
        } else console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangeMenu = (e) => {
    console.log(e.target.name);
    switch (e.target.name) {
      case 'wallet_id':
        console.log(e.target.value);
        setDefaultWallet(e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
        break;
      case 'date':
        setForm({ ...form, [e.target.name]: e.target.value });
        break;
      default:
    }
  };

  console.log(form);
  return (
    <>
      <Helmet>
        <title> Report | Money Manager Master </title>
      </Helmet>

      <AppBar position="static" color="inherit">
        <Toolbar sx={{ height: '40px' }}>
          <Grid container spacing={1}>
            <Grid item xs={4} sx={{ pt: '14px' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Expense report
              </Typography>
            </Grid>
            <Grid item xs>
              <Grid container>
                <Grid item xs={5}>
                  <FormControl size="small" fullWidth sx={{ mr: '2px' }}>
                    <InputLabel> Date </InputLabel>
                    <Select value={menu} name="date" onChange={handleChangeMenu} label=" Date ">
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
                            <ListItemText primary="Total"  />
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
                  <Button color="success" type="submit" variant="outlined" sx={{ padding: '7px' }}>
                    Filter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Grid item xs={12} md={6} lg={8}>
        <AppWebsiteVisits
          title="This month Reports"
          subheader="(+43%) than last year"
          chartLabels={chartLabels}
          chartData={chartData}
        />
      </Grid>
    </>
  );
}

export default ReportPage;
