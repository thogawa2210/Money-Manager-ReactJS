import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import {
    Avatar, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid, InputLabel, ListItemText, MenuItem, NativeSelect, OutlinedInput, Paper, Select,
    Slide, TextField
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import {forwardRef, useEffect, useState} from "react";
import wallets from '../_mock/wallet'
import category from "../_mock/category";
import axios from "axios";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: true,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        editable: true,
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function TransactionPage() {
    const [value, setValue] = useState(dayjs());
    const [openAddForm, setOpenAddForm] = useState(false);
    const [list, setList] = useState([])
    const [transaction, setTransaction] = useState({
        wallet: '',
        category: '',
        amount: 0,
        note: '',
        date: dayjs(value).format('DD/MM/YYYY')
    })

    useEffect(()=>{
        const userId = JSON.parse(localStorage.getItem('user')).user_id;
        axios.get(`http://localhost:3001/transaction/get-all-transaction/${userId}`)
            .then(res=> setList(res.data.data.data))
            .catch(err=> console.log(err))
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

        // call API here


    }

    const handleClickOpen = () => {
        setOpenAddForm(true);
    };

    const handleClose = () => {
        setOpenAddForm(false);
    };

    const handleSubmit = () => {
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

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    experimentalFeatures={{ newEditingApi: true }}
                />
            </Box>

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