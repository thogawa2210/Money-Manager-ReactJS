import { Helmet } from 'react-helmet-async';
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
import {forwardRef, useState} from "react";
import wallets from '../_mock/wallet'
import category from "../_mock/category";


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function TransactionPage() {

    const [openAddForm, setOpenAddForm] = useState(false);

    const handleClickOpen = () => {
        setOpenAddForm(true);
    };

    const handleClose = () => {
        setOpenAddForm(false);
    };

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
                                    label="Wallet"
                                >
                                    {wallets.map((wallet) => (
                                        <MenuItem key={wallet._id} value={wallet.name} >
                                            <Avatar src={wallet.photoURL} />
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
                                    label="Categories"
                                >
                                    {category.map((category) => (
                                        <MenuItem key={category._id} value={category.name} >
                                            <Avatar src={category.icon} />
                                            <ListItemText primary={category.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth={true} label="Amount" variant="outlined" type="number" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth={true} label="Amount" variant="outlined" type="number" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth={true} label="Note" variant="outlined" type="text" multiline rows={2} />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="success" onClick={handleClose}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    )
}