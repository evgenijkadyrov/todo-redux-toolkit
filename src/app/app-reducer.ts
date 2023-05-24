import {Dispatch} from 'redux'
import {authAPI} from '../api/todolists-api'
import {authActions } from 'features/auth/auth-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string| null,
    isInitialized: false
}
export type initialStateType = typeof initialState
const slice = createSlice({
    name:"app",
    initialState ,
    reducers :{
        setAppStatus: (state, action:PayloadAction<{status:RequestStatusType}>)=>{
            state.status=action.payload.status
        },
        setAppError:(state, action:PayloadAction<{error:string|null}>)=>{
            state.error= action.payload.error
        },
        setAppInitialized:( state, action:PayloadAction<{isInitialized:boolean}>)=>{
            state.isInitialized= action.payload.isInitialized
        }
    }
})
export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


export const appActions = slice.actions


export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({value:true}));
        } else {

        }

        dispatch(appActions.setAppInitialized({isInitialized:true}));
    })
}

export type SetAppErrorActionType = ReturnType<typeof appActions.setAppError>
export type SetAppStatusActionType = ReturnType<typeof appActions.setAppStatus>
