import {Helmet} from 'react-helmet-async';
import {useEffect, useState} from 'react';
import {changeFlag} from '../features/flagSlice';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper, Slide, Stack,
    TextField, Typography,
} from '@mui/material';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import Iconify from "../components/iconify";

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function WalletPage() {
    const [detail, setDetail] = useState(<h5>Choose wallet to see details</h5>);
    const [wallets, setWallets] = useState([]);
    const [walletEdit, setWalletEdit] = useState([]);
    const [open, setOpen] = useState(false);
    const [totalMoney, setTotalMoney] = useState(0);

    const flag = useSelector((state) => state.flag);
    const dispatch = useDispatch();

    const handleClickOpen = (id) => {
        const walletEdit = wallets.filter((wallet) => wallet._id === id);
        setWalletEdit(walletEdit[0]);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getAllWallet = async () => {
        const userId = JSON.parse(localStorage.getItem('user'));
        return await axios.get(` http://localhost:3001/wallet/get-all-wallet/${userId.user_id}`);
    };

    const toTalMoney = async () => {
        const userId = JSON.parse(localStorage.getItem('user'));
        return await axios.get(`http://localhost:3001/wallet/total/${userId.user_id}`)
    };

    useEffect(() => {
        getAllWallet()
            .then((res) => setWallets(res.data.wallet))
            .catch((error) => console.log(error.message));
        toTalMoney().then(res => setTotalMoney(res.data.total))
            .catch(error => console.log(error.message))
    }, [flag]);

    const onChangeEdit = (e) => {
        if (e.target.name === 'amount') {
            setWalletEdit({...walletEdit, [e.target.name]: parseInt(e.target.value)});
        } else {
            setWalletEdit({...walletEdit, [e.target.name]: e.target.value});
        }
    };

    const handleDeleteWallet = (id) => {
        Swal.fire({
            title: 'Are you sure to delete?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3001/wallet/delete/${id}`)
                    .then(res => {
                        dispatch(changeFlag(1))
                        setDetail(<h5>Choose wallet to see details</h5>)
                    })
                    .catch(err => console.log(err))
                Swal.fire(
                    'Deleted!',
                    'Wallet has been deleted.',
                    'success'
                )
            }
        });
    };


    const handleSaveEdit = async (id) => {
        await axios.put(`http://localhost:3001/wallet/update/${id}`, walletEdit)
            .then(res => {
                Swal.fire({
                    icon: 'success',
                    title: 'Update Successfully!'
                })
                dispatch(changeFlag(1))
                setDetail(<h5>Choose wallet to see details</h5>)
            })
            .catch(err => console.log(err))
        setOpen(false);
    };

    const handleClick = (id) => {
        const wallet = wallets.filter((wallet) => wallet._id === id);
        setDetail(
            <>
                <h4>Wallet detail</h4>
                <hr/>
                <p>Wallet Name: {wallet[0].name}</p>
                <hr/>
                <p>Wallet Amount: {numberWithCommas(wallet[0].amount)}</p>
                <hr/>
                <Button variant="contained" color="primary" onClick={() => handleClickOpen(id)}>
                    Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDeleteWallet(id)}>
                    Delete
                </Button>
            </>
        );
    };

    return (
        <>
            <Helmet>
                <title> Wallet | Money Manager Master </title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h3" gutterBottom>
                    Wallet
                </Typography>
                <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>}>
                    New Wallet
                </Button>
            </Stack>

            <Paper elevation={3} sx={{padding: 2}}>
                <Grid container spacing={2}>

                    <Grid item xs={5} alignItems="center">
                        <h3>Total: {numberWithCommas(totalMoney)} VNĐ</h3>
                        <List>
                            {wallets.slice(0, 3).map((item) => (
                                <ListItem button onClick={() => handleClick(item._id)} key={item._id}>
                                    <ListItemAvatar>
                                        <Avatar alt={item.name} src={item.icon}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.name} secondary={numberWithCommas(item.amount)}/>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>

                    <Grid item xs={7}>
                        <div>{detail}</div>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit wallet</DialogTitle>
                <DialogContent>
                    <DialogContentText>Please enter your update infomation</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Wallet Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={walletEdit.name}
                        onChange={onChangeEdit}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="amount"
                        label="Wallet Amount"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={walletEdit.amount}
                        onChange={onChangeEdit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleSaveEdit(walletEdit._id)}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
