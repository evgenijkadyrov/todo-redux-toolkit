import { ResultCode, todolistsAPI, TodolistType } from "features/todolists-list/todolists/todolists-api";
import { RequestStatusType } from "app/app-reducer";
import { createAppAsyncThunk } from "common";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions";

const setTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
    "todolists/setTodolists",
    async (arg, thunkAPI) => {
        const res = await todolistsAPI.getTodolists();

        const todolists = res.data;
        return { todolists };
    }
);
const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
    "todo/removeTodolist",
    async (id, { dispatch, rejectWithValue }) => {
        dispatch(todolistsActions.changeTodolistEntityStatus({ id, status: "loading" }));
        const res = await todolistsAPI.deleteTodolist(id);
        if (res.data.resultCode === ResultCode.success) {
            return { id };
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);
const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
    "todolists/addTodolist",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        const res = await todolistsAPI.createTodolist(arg.title);
        if (res.data.resultCode === ResultCode.success) {
            return { todolist: res.data.data.item };
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: false });
        }
        // dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
    }
);
const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
    "todolists/changeTodolistTitle",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        //dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsAPI.updateTodolist(arg);
        if (res.data.resultCode === ResultCode.success) {
            return arg;
        } else {
            //handleServerAppError(res.data, dispatch);
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);
const initialState: Array<TodolistDomainType> = [];
const slice = createSlice({
    name: "todolists",
    initialState,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id);
            if (index !== -1) state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id);
            if (index !== -1) state[index].entityStatus = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(clearTasksAndTodolists, () => {
                return [];
            })

            .addCase(setTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl) => ({
                    ...tl,
                    filter: "all",
                    entityStatus: "idle",
                }));
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) state.splice(index, 1);
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({
                    ...action.payload.todolist,
                    filter: "all",
                    entityStatus: "idle",
                });
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) state[index].title = action.payload.title;
            });
    },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunk = {
    setTodolists,
    removeTodolist,
    addTodolist,
    changeTodolistTitle,
};

// thunks
// export const fetchTodolistsTC = (): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(todolistsActions.setTodolists({todolists:res.data}))
//                 dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             })
//             .catch(error => {
//                 handleServerNetworkError(error, dispatch);
//             })
//     }
// }
// export const removeTodolistTC = (todolistId: string): AppThunk => {
//     return (dispatch) => {
//         //изменим глобальный статус приложения, чтобы вверху полоса побежала
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//         dispatch(todolistsActions.changeTodolistEntityStatus({
//             id: todolistId,
//             status: 'loading'
//         }))
//         todolistsAPI.deleteTodolist(todolistId)
//             .then((res) => {
//
//                 dispatch(todolistsActions.removeTodolist({todolistId}))
//                 //скажем глобально приложению, что асинхронная операция завершена
//                 dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             })
//     }
// }
// export const addTodolistTC = (title: string): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         todolistsAPI.createTodolist(title)
//             .then((res) => {
//                 dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
//                 dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             })
//     }
// }
// export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
//     return (dispatch) => {
//         todolistsAPI.updateTodolist(id, title)
//             .then((res) => {
//                 dispatch(todolistsActions.changeTodolistTitle({id, title}))
//             })
//     }
// }

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
