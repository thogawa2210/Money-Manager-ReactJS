import {useEffect, useState} from 'react';
// @mui
import {Box, MenuItem, Stack, IconButton, Popover, Typography, Divider} from '@mui/material';
import axios from "axios";
import { useSelector, useDispatch} from "react-redux";
import { addTotal } from '../../../features/totalSlice';
import Swal from "sweetalert2";






// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

function numberWithCommas(x) {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


export default function WalletUser() {
    const [open, setOpen] = useState(null);
    const [state, setState] = useState({
        wallets:[]
    })
    const [total, setTotal] = useState(0)
    const dispatch = useDispatch()

    const {flag} = useSelector(state => state.flag)



    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const userId = JSON.parse(localStorage.getItem('user'))

    const getAllWallet = async (userId) => {
        return await axios.get(` http://localhost:3001/wallet/get-all-wallet/${userId.user_id}`)
    }
    const toTalMoney = async (userId) => {
        return await axios.get(`http://localhost:3001/wallet/total/${userId.user_id}`)
    }

    useEffect(() =>{
        getAllWallet(userId).then(res => setState({wallets:res.data.wallet})
        ).catch(error =>
            Swal.fire({
            icon: 'error',
            title: 'Something Wrong!',
            text:' Something wrong! Please try again!',
            showConfirmButton: false,
            timer: 2000
    })
    )
        toTalMoney(userId).then(res => setTotal(res.data.total))
            .catch(error =>  Swal.fire({
                icon: 'error',
                title: 'Something Wrong!',
                text:' Something wrong! Please try again!',
                showConfirmButton: false,
                timer: 2000
            }))
        dispatch(addTotal(total))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[flag])







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
                    <img src='/assets/icons/wallets/total.svg' alt='No image'/>
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
                    }}>{numberWithCommas(total)} VNĐ</Typography>
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
                    {state.wallets.map((item, index) => (
                        <MenuItem sx={{display:'flex'}} key={index}
                                  onClick={() => handleClose(index)}>
                            <Box component="img" src={item.icon} sx={{width: 28, mr: 2}}/>
                            {item.name} {numberWithCommas(item.amount)} VNĐ
                        </MenuItem>
                    ))}
                </Stack>
            </Popover>
        </>
    );
}
