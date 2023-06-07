import { appActions } from "app/app-reducer";
import { LoginParamsType, ResultCode } from "features/todolists-list/todolists/todolists-api";
import { createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions";
import { createAppAsyncThunk } from "common/index";
import { authAPI } from "features/auth/auth-api";

const login = createAppAsyncThunk<{ value: boolean }, { data: LoginParamsType }>(
    "auth/login",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        const res = await authAPI.login(arg.data);

        if (res.data.resultCode === ResultCode.success) {
            return { value: true };
        } else {
            const showAppError = !res.data.fieldsErrors.length;
            //handleServerAppError(res.data, dispatch, showAppError)
            return rejectWithValue({ data: res.data, showGlobalError: showAppError });
        }
    }
);
const logout = createAppAsyncThunk<{ value: boolean }, void>("auth/logout", async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    const res = await authAPI.logout();

    if (res.data.resultCode === ResultCode.success) {
        dispatch(clearTasksAndTodolists());
        return { value: false };
    } else {
        return rejectWithValue({ data: res.data, showGlobalError: true });
    }
});
const initialized = createAppAsyncThunk<{ value: boolean }, void>("auth/initialized", async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
        const res = await authAPI.me();

        if (res.data.resultCode === ResultCode.success) {
            return { value: true };
        } else {
            return rejectWithValue(null);
        }
    } catch (error) {
        return rejectWithValue(null);
    } finally {
        dispatch(appActions.setAppInitialized({ isInitialized: true }));
    }
});
const initialState = {
    isLoggedIn: false,
};
const slice = createSlice({
    name: "auth",
    reducers: {},
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.value;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.value;
            })
            .addCase(initialized.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.value;
            });
    },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunk = { login, logout, initialized };
