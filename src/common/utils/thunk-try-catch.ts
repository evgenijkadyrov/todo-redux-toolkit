import { AppDispatch, AppRootStateType } from "app/store";

import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { handleServerNetworkError } from "common/utils/error-network";
import { appActions } from "app/app-reducer";
import { ResponseType } from "features/todolists-list/todolists/todolists-api";

// export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, null| ResponseType>, logic: Function) => {
//     const {dispatch, rejectWithValue} = thunkAPI
//     //dispatch(appActions.setAppStatus({status: 'loading'}))
//     try {
//         return await logic()
//     } catch (e) {
//         handleServerNetworkError(e, dispatch)
//         return rejectWithValue(null)
//     }
//     // finally {
//     //     // в handleServerNetworkError можно удалить убирани крутилки
//     //     //dispatch(appActions.setAppStatus({status: 'idle'}))
//     // }
// }
