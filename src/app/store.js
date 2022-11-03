import { configureStore } from '@reduxjs/toolkit';
import walletReducer from '../features/walletSlice'
import flagReducer from '../features/flagSlice'

export const store = configureStore({
	reducer: {
		wallet: walletReducer,
		flag: flagReducer
	},
});