import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import {
    Avatar, Box,
    Button, CardHeader, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid, InputLabel, ListItemText, MenuItem, NativeSelect, OutlinedInput, Select,
    Slide, TextField
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {forwardRef, useState} from "react";
import wallets from '../_mock/wallet'
import category from "../_mock/category";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function TransactionPage() {
    const [value, setValue] = useState(dayjs());
    const [openAddForm, setOpenAddForm] = useState(false);
    const [transaction, setTransaction] = useState({
        wallet: '',
        category: '',
        amount: 0,
        note: '',
        date: dayjs(value).format('DD/MM/YYYY')
    })

    const handleChange = (e) => {
        if(e.target){
            setTransaction({...transaction, [e.target.name]: e.target.value});
        }else {
            setValue(e);
            setTransaction({...transaction, date: dayjs(e).format('DD/MM/YYYY')})
        }

        // call API here


    }

    const handleClickOpen = () => {
        setOpenAddForm(true);
    };

    const handleClose = () => {
        setOpenAddForm(false);
    };

    const handleSubmit = () => {
        console.log(transaction)
        setOpenAddForm(false);
    }

    return(
        <>
            <Helmet>
                <title> Transaction | Money Controller </title>
            </Helmet>

            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <h1>Transaction</h1>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" color="primary" onClick={handleClickOpen}>Add Transaction</Button>
                </Grid>
            </Grid>

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
                                    name = "wallet"
                                >
                                    {wallets.map((wallet) => (
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
                                    name = "category"
                                >
                                    {category.map((category) => (
                                        <MenuItem key={category.name} value={category.name} >
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