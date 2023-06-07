import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";
import { ResponseType } from "features/todolists-list/todolists/todolists-api";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType;
    dispatch: AppDispatch;
    rejectValue: null | RejectedValueType;
}>();
export type RejectedValueType = {
    data: ResponseType;
    showGlobalError: boolean;
};
