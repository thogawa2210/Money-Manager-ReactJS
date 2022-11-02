import {useState} from 'react';
// @mui
import {Box, MenuItem, Stack, IconButton, Popover, Typography, Divider} from '@mui/material';
import wallets from '../../../_mock/wallet'


// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function WalletUser() {
    const [open, setOpen] = useState(null);

    const totalMoney = wallets.reduce((a,v) =>  a = a + v.amount , 0 )

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <Box
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    height: 44,
                    flexGrow: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                }}>
                <IconButton
                    sx={{
                        padding: 0,
                        width: 40,
                        height: 40,
                    }}
                >
                    <img src={wallets[0].icon} alt={wallets[0].name}/>
                </IconButton>
                <Box sx={{
                    height: 40,
                }}>
                    <Typography style={{
                        color: "black",
                        fontFamily: "serif",
                        fontSize: 12,
                        paddingLeft: 12
                    }}>Total</Typography>
                    <Typography style={{
                        color: "black",
                        fontFamily: "serif",
                        fontSize: 14,
                        paddingLeft: 12,
                        fontWeight: 700
                    }}>{totalMoney}</Typography>
                </Box>
            </Box>


            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 1,
                        mt: 1.5,
                        ml: 0.75,
                        width: 280,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Box sx={{my: 1.5, px: 11}}>
                    <Typography variant="subtitle2" noWrap>
                        Select Wallet
                    </Typography>
                </Box>
                <Divider sx={{borderStyle: 'dashed'}}/>

                <Stack spacing={0.75} sx={{p: 1}}>
                    {wallets.map((item, index) => (
                        <MenuItem key={index}
                                  onClick={() => handleClose(index)}>
                            <Box component="img" alt={item.name} src={item.icon} sx={{width: 28, mr: 2}}/>
                            {item.name} {item.amount}
                        </MenuItem>
                    ))}
                </Stack>
            </Popover>
        </>
    );
}