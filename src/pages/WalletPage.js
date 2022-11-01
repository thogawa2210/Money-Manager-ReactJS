import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {Avatar, Box, Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper} from "@mui/material";
import wallets from '../_mock/wallet'


export default function WalletPage() {
    const [detail,setDetail] = useState(<h5>Choose wallet to see details</h5>)

    const handleClick = () => {
        setDetail(<h5>Cash detail</h5>)
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
                            <ListItem button onClick={handleClick}>
                                <ListItemAvatar>
                                    <Avatar alt={item.name} src={item.photoURL} />
                                </ListItemAvatar>
                                <ListItemText primary={item.name} secondary={item.amount} />
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
