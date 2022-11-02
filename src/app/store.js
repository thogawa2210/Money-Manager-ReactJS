import { configureStore } from '@reduxjs/toolkit';
import walletReducer from '../features/walletSlice'

export const store = configureStore({
	reducer: {
        wallet: walletReducer
	},
});