import {createSlice} from '@reduxjs/toolkit'

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        wallet: {
            name: '',
            email: '',
            amount: 0,
            icon:''
        }
    },
    reducers: {
        addWallet: (state, action) => {
            state.wallet = action.payload;
        }
    }
})

export const { getUser } = walletSlice.actions

export default walletSlice.reducer

