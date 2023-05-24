
import {appActions, SetAppErrorActionType, SetAppStatusActionType} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import axios, {AxiosError} from "axios";


export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error:data.messages[0]}))
    } else {
        dispatch(appActions.setAppError({error:'Some error occurred'}))
    }
    dispatch(appActions.setAppStatus({status:"failed"}))
}


export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {

        const err = e as Error | AxiosError<{ error: string }>

    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(appActions.setAppError({error}))
    } else {
        dispatch(appActions.setAppError({error: `Native error ${err.message}`}))
    }
    dispatch(appActions.setAppStatus({status: 'failed'}))
}
