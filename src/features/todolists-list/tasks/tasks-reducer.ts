import {
    ResultCode,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    UpdateTaskModelType,
} from "features/todolists-list/todolists/todolists-api";
import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todolistsThunk } from "features/todolists-list/todolists/todolists-reducer";
import { clearTasksAndTodolists } from "common/actions";
import { createAppAsyncThunk } from "common";
import { tasksAPI } from "features/todolists-list/tasks/tasks-api";

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
    "tasks/fetchTasks",
    async (todolistId: string, thunkAPI) => {
        const res = await tasksAPI.getTasks(todolistId);
        const tasks = res.data.items;
        return { tasks, todolistId };
    }
);
const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>("tasks/addTask", async (arg, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    const res = await tasksAPI.createTask(arg);

    if (res.data.resultCode === ResultCode.success) {
        const task = res.data.data.item;
        return { task };
    } else {
        return rejectWithValue({ data: res.data, showGlobalError: false });
    }
});

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
    "tasks/updateTask",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue, getState } = thunkAPI;

        const state = getState();
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
        if (!task) {
            dispatch(appActions.setAppError({ error: "task not found" }));
            return rejectWithValue(null);
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.model,
        };
        const res = await tasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel);

        if (res.data.resultCode === ResultCode.success) {
            return arg;
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);
const removeTask = createAppAsyncThunk<taskRemoveArgType, taskRemoveArgType>(
    "tasks/removeTask",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;

        const res = await tasksAPI.deleteTask(arg.todolistId, arg.taskId);
        if (res.data.resultCode === ResultCode.success) {
            return arg;
        } else {
            return rejectWithValue({ data: res.data, showGlobalError: true });
        }
    }
);

const initialState: TasksStateType = {};
const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) state[action.payload.todolistId].splice(index, 1);
            })
            .addCase(todolistsThunk.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(todolistsThunk.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id];
            })
            .addCase(todolistsThunk.setTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = [];
                });
            })
            .addCase(clearTasksAndTodolists, () => {
                return {};
            });
    },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunk = { fetchTasks, addTask, updateTask, removeTask };

// types
export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};
export type TasksStateType = {
    [key: string]: Array<TaskType>;
};
export type AddTaskArgType = {
    todolistId: string;
    title: string;
};
export type UpdateTaskArgType = {
    taskId: string;
    model: UpdateDomainTaskModelType;
    todolistId: string;
};
export type taskRemoveArgType = { todolistId: string; taskId: string };
