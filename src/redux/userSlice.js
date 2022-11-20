import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    location: null,
    loading: false,
    error: false
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        loginFailure: (state) => {
            state.error = true;
            state.loading = false;
        },
        logout: (state) => {
            return initialState;
        },
        getUserLocationStart: (state) => {
            state.loading = true;
        },
        getUserLocationSuccess: (state, action) => {
            state.loading = false;
            state.location = action.payload;
        },
        getUserLocationFailure: (state) => {
            state.error = true;
            state.loading = false;
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, getUserLocationStart, getUserLocationSuccess, getUserLocationFailure } = userSlice.actions;

export default userSlice.reducer;