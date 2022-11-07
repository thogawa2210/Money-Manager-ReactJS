import {createSlice} from '@reduxjs/toolkit'

const totalSlice = createSlice({
    name: 'total',
    initialState: {
        wallet: {
            name: 'total',
            amount: 0
        }
    },
    reducers: {
        addTotal: (state, action) => {
            state.wallet.amount = action.payload;
        }
    }
})

export const { addTotal } = totalSlice.actions

export default totalSlice.reducer

