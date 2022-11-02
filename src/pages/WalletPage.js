import { Helmet } from 'react-helmet-async';
import {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper, TextField
} from "@mui/material";
import wallet from '../_mock/wallet'

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function WalletPage() {
    const [detail,setDetail] = useState(<h5>Choose wallet to see details</h5>)
    const [wallets,setWallets] = useState(wallet)
    const [walletEdit,setWalletEdit] = useState([])
    const [open, setOpen] = useState(false);

    const handleClickOpen = (id) => {
        const walletEdit = wallets.filter(wallet => wallet._id === id)
        setWalletEdit(walletEdit[0]);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

    },wallets)

    const onChangeEdit = (e) => {
        setWalletEdit({...walletEdit, [e.target.name]: e.target.value});
    }

    const handleSaveEdit = (id) => {
        const index = wallets.findIndex(wallet => wallet._id === id);
        wallets[index] = walletEdit
        setWallets(wallets)
        setOpen(false);
    }

    const handleClick = (id) => {
        const wallet = wallets.filter(wallet => wallet._id === id)
        setDetail(
            <>
                <h4>Wallet detail</h4>
                <hr/>
                <p>Wallet Name: {wallet[0].name}</p>
                <hr/>
                <p>Wallet Amount: {numberWithCommas(wallet[0].amount)}</p>
                <hr/>
                <Button variant="contained" color="primary" onClick={()=>handleClickOpen(id)}>Edit</Button>
                <Button variant="contained" color="error">Delete</Button>
            </>
        )
    }

    return(
        <>
            <Helmet>
                <title> Wallet | Money Controller </title>
            </Helmet>

            <h1>Wallet</h1>
            <Paper elevation={3} sx={{padding:2}}>
                <Grid container spacing={2}>
                    <Grid item xs={5} alignItems="center" >
                        <div>Total: 10.000.000</div>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Detail</h3>
                    </Grid>
                    <Grid item xs={3}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="success">Add new Wallet</Button>
                        </Box>
                    </Grid>
                    <Grid item xs={5}>
                        <List>
                            {wallets.map((item) =>(
                            <ListItem button onClick={()=>handleClick(item._id)} key={item._id}>
                                <ListItemAvatar>
                                    <Avatar alt={item.name} src={item.icon} />
                                </ListItemAvatar>
                                <ListItemText primary={item.name} secondary={numberWithCommas(item.amount)} />
                            </ListItem>
                            ))
                            }
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
                    <DialogContentText>
                        Please enter your update infomation
                    </DialogContentText>
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
                    <Button onClick={()=>handleSaveEdit(walletEdit._id)}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
