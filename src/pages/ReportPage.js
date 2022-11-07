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
  const [form, setForm] = useState({
    date: '',
    walletID: '',
  });
  const [wallets, setWallets] = useState([]);
  const [defaultWallet, setDefaultWallet] = useState('');
  const totalWallet = useSelector((state) => state.total.wallet.amount);

  useEffect(() => {
    let result = [];

    useEffect(() => {
      const data = getDataBarChart('cash', '11/01/2022', '11/30/2022');
      setChartLabels(data.chartLabels);
      setChartData(data.chartData);
    }, []);

    const getAllWallet = async (id) => {
      return await axios.get(`http://localhost:3001/wallet/get-all-wallet/${id}`);
    };

    useEffect(() => {
      const userID = JSON.parse(localStorage.getItem('user')).user_id;
      getAllWallet(userID)
        .then((res) => {
          if (res.data.type === 'success') {
            setDefaultWallet(res.data.wallet[0]._id);
            setWallets(res.data.wallet);
          } else {
            console.log(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    }, []);

    console.log(form);

    const handleFilter = () => {};

    const handleChangeMenu = (e) => {
      let target = e.target.name;
      switch (target) {
        case 'walletID':
          setDefaultWallet(e.target.value);
          setForm({ ...form, walletID: e.target.value });
          break;
        case 'date':
          setForm({ ...form, date: e.target.value });
          break;
        default:
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
              <Grid item xs={6} sx={{ pt: '13px' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Expense report
                </Typography>
              </Grid>
              <Grid item xs>
                <Grid container>
                  <Grid item xs>
                    <FormControl size="small" fullWidth sx={{ mr: '2px' }}>
                      <InputLabel id="demo-select-small">Date </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={menu}
                        label="Age"
                        name="date"
                        onChange={handleChangeMenu}
                      >
                        <MenuItem value={'today'}>Today</MenuItem>
                        <MenuItem value={'this month'}>This month</MenuItem>
                        <MenuItem value={'last month'}>Last month </MenuItem>
                        <MenuItem value={'custom'}>Custom</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs>
                    <FormControl size="small" fullWidth sx={{ pl: '4px' }}>
                      <InputLabel id="select-wallet">Wallet </InputLabel>
                      <Select
                        value={defaultWallet}
                        label="Wallet"
                        onChange={handleChangeMenu}
                        name="walletID"
                        sx={{ pl: 0 }}
                      >
                        <Grid container>
                          {wallets.map((wallet, index) => (
                            <MenuItem key={wallet.name} value={wallet._id} sx={{ width: '100%', height: '100%' }}>
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
  });
}

export default ReportPage;
