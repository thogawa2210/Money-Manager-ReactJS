import {createSlice} from '@reduxjs/toolkit'

const flagSlice = createSlice({
    name: 'flag',
    initialState: {flag: 0},
    reducers: {
        changeFlag: (state, action) => {
            state.flag += action.payload;
        }
    }
})

export const { changeFlag } = flagSlice.actions

export default flagSlice.reducer

