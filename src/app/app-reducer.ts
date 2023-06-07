import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
};

export type initialStateType = typeof initialState;
const slice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status;
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },

        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized;
        },
    },

    extraReducers: (builder) =>
        builder
            .addMatcher(
                (value) => {
                    return value.type.endsWith("/pending");
                },
                (state, action) => {
                    state.status = "loading";
                }
            )
            .addMatcher(
                (value) => {
                    return value.type.endsWith("/rejected");
                },
                (state, action) => {
                    const { payload, error } = action;
                    if (payload) {
                        if (payload.showGlobalError) {
                            state.error = payload.data.messages.length ? payload.data.messages[0] : "Some error";
                        }
                    } else {
                        state.error = error.message ? error.message : "Some error";
                    }
                    state.status = "failed";
                }
            )
            .addMatcher(
                (value) => {
                    return value.type.endsWith("/fulfilled");
                },
                (state, action) => {
                    state.status = "succeeded";
                }
            ),
});

export const appReducer = slice.reducer;

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export const appActions = slice.actions;

export type SetAppErrorActionType = ReturnType<typeof appActions.setAppError>;
export type SetAppStatusActionType = ReturnType<typeof appActions.setAppStatus>;
