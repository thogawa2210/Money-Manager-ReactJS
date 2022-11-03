import {createSlice} from '@reduxjs/toolkit'

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        wallet: []
    },
    reducers: {
        addWallet: (state, action) => {
            state.wallet = action.payload.wallet;
        }
    }
})

export const { getUser } = walletSlice.actions

export default walletSlice.reducer

