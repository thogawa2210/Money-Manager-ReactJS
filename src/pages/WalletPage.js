import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import {Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper} from "@mui/material";


export default function WalletPage() {
    const [detail,setDetail] = useState('Choose wallet to see details')

    const handleClick = () => {
        setDetail('Cash detail')
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
                    <Grid item xs={7}>
                        <h3>Detail</h3>
                    </Grid>
                    <Grid item xs={5}>
                        <List>
                            <ListItem button onClick={handleClick}>
                                <ListItemAvatar>
                                    <Avatar alt="Cash" src='data:image/png;base64,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' /></ListItemAvatar>
                                <ListItemText primary='Cash' secondary='10.000.000VNĐ' />
                            </ListItem>
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
