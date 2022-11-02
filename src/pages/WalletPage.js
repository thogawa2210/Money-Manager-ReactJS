import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {Avatar, Box, Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper} from "@mui/material";
import wallets from '../_mock/wallet'

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function WalletPage() {
    const [detail,setDetail] = useState(<h5>Choose wallet to see details</h5>)

    const handleClick = (index) => {
        console.log(index)
        setDetail(
            <>
                <h4>Wallet detail</h4>
                <hr/>
                <p>Wallet Name: {wallets[index].name}</p>
                <hr/>
                <p>Wallet Amount: {numberWithCommas(wallets[index].amount)}</p>
                <hr/>
                <Button variant="contained" color="primary">Edit</Button>
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
                            {wallets.map((item, index) =>(
                            <ListItem button onClick={()=>handleClick(index)}>
                                <ListItemAvatar>
                                    <Avatar alt={item.name} src={item.photoURL} />
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
        </>
    )
}
