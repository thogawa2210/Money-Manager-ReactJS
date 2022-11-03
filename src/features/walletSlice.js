import {createSlice} from '@reduxjs/toolkit'

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        wallet: []
    },
    reducers: {
        addWallet: (state, action) => {
            state.wallet.push(action.payload);
        }
    }
})

export const { addWallet } = walletSlice.actions

export default walletSlice.reducer

