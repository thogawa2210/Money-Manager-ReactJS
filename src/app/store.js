import { configureStore } from '@reduxjs/toolkit';
import walletReducer from '../features/walletSlice'
import flagReducer from '../features/flagSlice'
import totalReducer from '../features/totalSlice'

export const store = configureStore({
	reducer: {
		wallet: walletReducer,
		flag: flagReducer,
		total: totalReducer
	},
});