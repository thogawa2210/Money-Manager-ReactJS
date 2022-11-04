import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import {
    Avatar, Box,
    Button, Card, Checkbox, Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid, IconButton, InputLabel, ListItemText, MenuItem, Paper, Popover, Select,
    Slide, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, TextField, Typography
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {forwardRef, useEffect, useState} from "react";
import category from "../_mock/category";
import axios from "axios";
import Iconify from "../components/iconify";
import wallet from "../_mock/wallet";
import Swal from "sweetalert2";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function TransactionPage() {
    const [value, setValue] = useState(dayjs());
    const [openAddForm, setOpenAddForm] = useState(false);
    const [listTransaction, setListTransaction] = useState([])
    const [listWallet, setListWallet] = useState([])
    const [listCategory, setListCategory] = useState([])
    const [transaction, setTransaction] = useState({
        wallet_id: '',
        category_id: '',
        amount: 0,
        note: '',
        date: dayjs(value).format('DD/MM/YYYY')
    })

    const getData = async () => {
        const userId = JSON.parse(localStorage.getItem('user')).user_id;
        await axios.get(`http://localhost:3001/transaction/get-all-transaction/${userId}`)
            .then(res=> setListTransaction(res.data.data.data))
            .catch(err=> console.log(err));
        await axios.get(`http://localhost:3001/category/get-category/${userId}`)
            .then(res=> setListCategory(res.data.categoryUser))
            .catch(err=> console.log(err));
        await axios.get(`http://localhost:3001/wallet/get-all-wallet/${userId}`)
            .then(res=> setListWallet(res.data.wallet))
            .catch(err=> console.log(err))
    }

    useEffect(()=>{
        getData()
    },[])

    const handleChange = (e) => {
        if(e.target){
            if(e.target.name === 'amount'){
                setTransaction({...transaction, [e.target.name]: parseInt(e.target.value)});
            }else{
                setTransaction({...transaction, [e.target.name]: e.target.value});
            }
        }else {
            setValue(e);
            setTransaction({...transaction, date: dayjs(e).format('DD/MM/YYYY')})
        }
    }

    const handleClickOpen = () => {
        setOpenAddForm(true);
    };

    const handleClose = () => {
        setOpenAddForm(false);
    };

    useEffect(() => {
        const wallet = listWallet.filter(wallet => wallet._id === transaction.wallet_id);
        if(wallet.length>0){
            setTransaction({...transaction, wallet_name: wallet[0].name, wallet_icon : wallet[0].icon})
        }
        const category = listCategory.filter(category => category._id === transaction.category_id);
        if(category.length>0){
            setTransaction({...transaction, category_name: category[0].name, category_icon : category[0].icon })
        }
    },[transaction.wallet_id, transaction.category_id])

    const handleSubmit = async () => {
        if(transaction.category_id === '' || transaction.wallet_id === '' || transaction.amount === ''){
            setOpenAddForm(false);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the required fields'
            });
        }else{
            await axios.post('http://localhost:3001/transaction/add-transaction', transaction)
                .then(res=> {
                    if(res.status === 200){
                        setTransaction({
                            wallet_id: '',
                            category_id: '',
                            amount: 0,
                            note: '',
                            date: dayjs(value).format('DD/MM/YYYY')
                        })
                        Swal.fire({
                            icon: 'success',
                            title: 'Add transaction successfully!',
                        })
                    }else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!'
                        })
                    }
                })
                .catch(err => console.log(err))
            setOpenAddForm(false);
        }
    }

    return(
        <>
            <Helmet>
                <title> Transaction | Money Controller </title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h3" gutterBottom>
                    Transaction
                </Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
                    New Transaction
                </Button>
            </Stack>

            <Dialog
                open={openAddForm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                fullWidth={true}
                maxWidth='md'
            >
                <DialogTitle>{"Add Transaction"}</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        Remember to Record Your Transactions Today.
                    </DialogContentText>
                    <hr/>
                    <Grid container spacing={4}>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Wallet</InputLabel>
                                <Select
                                    onChange={handleChange}
                                    defaultValue="Cash"
                                    label = "Wallet"
                                    name = "wallet_id"
                                >
                                    {listWallet.map((wallet) => (
                                        <MenuItem key={wallet._id} value={wallet._id} >
                                            <Avatar src={wallet.icon} />
                                            <ListItemText primary={wallet.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel >Categories</InputLabel>
                                <Select
                                    onChange={handleChange}
                                    label="Categories"
                                    name = "category_id"
                                >
                                    {listCategory.map((category) => (
                                        <MenuItem key={category.name} value={category._id} >
                                            <Avatar src={category.icon} />
                                            <ListItemText primary={category.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField name="amount" onChange={handleChange} fullWidth={true} label="Amount" variant="outlined" type="number" />
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                fullWidth
                                label="Date desktop"
                                inputFormat="DD/MM/YYYY"
                                value={value}
                                name="date"
                                onChange={handleChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField name="note" onChange={handleChange} fullWidth={true} label="Note" variant="outlined" type="text" multiline rows={2} />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="success" onClick={handleSubmit}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}