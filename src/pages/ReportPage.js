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

  let result = [];

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
          setWallets(res.data.wallet);
        } else console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChangeMenu = (e) => {
    switch (e.target.name) {
      case 'walletID':
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
            <Grid item xs={6} sx={{ pt: '14px' }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Expense report
              </Typography>
            </Grid>
            <Grid item xs>
              <Grid container>
                <Grid item xs>
                  <FormControl size="small" fullWidth sx={{ mr: '2px' }}>
                    <InputLabel>Date </InputLabel>
                    <Select value={menu} name="date" onChange={handleChangeMenu}>
                      <MenuItem value={'today'}>Today</MenuItem>
                      <MenuItem value={'this month'}>This month</MenuItem>
                      <MenuItem value={'last month'}>Last month </MenuItem>
                      <MenuItem value={'custom'}>Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs>
                  <FormControl size="small" fullWidth sx={{ pl: '4px' }}>
                    <InputLabel>Wallet</InputLabel>
                    <Select
                      value={defaultWallet}
                      label="Wallet"
                      onChange={handleChangeMenu}
                      name="walletID"
                      sx={{ pl: 0 }}
                    >
                      <Grid container>
                        {wallets.map((wallet, index) => (
                          <MenuItem key={index + 1} value={wallet._id} sx={{ width: '100%', height: '100%' }}>
                            <Grid item xs>
                              <Avatar src={wallet.icon} />
                            </Grid>
                            <Grid item xs sx={{}}>
                              {' '}
                              {wallet.name}
                            </Grid>
                          </MenuItem>
                        ))}
                      </Grid>
                    </Select>
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
