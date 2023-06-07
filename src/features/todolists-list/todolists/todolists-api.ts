import { instance } from "common/common-api";

// api
export const todolistsAPI = {
    getTodolists() {
        const promise = instance.get<TodolistType[]>("todo-lists");
        return promise;
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
        return promise;
    },
    deleteTodolist(id: string) {
        const promise = instance.delete<ResponseType>(`todo-lists/${id}`);
        return promise;
    },
    updateTodolist(arg: { id: string; title: string }) {
        const promise = instance.put<ResponseType>(`todo-lists/${arg.id}`, {
            title: arg.title,
        });
        return promise;
    },
};

export type LoginParamsType = {
    email: string;
    password: string;
    rememberMe: boolean;
    captcha?: string;
};

// types
export type TodolistType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};
type FieldsErrorsType = { field: string; error: string };
export type ResponseType<D = {}> = {
    resultCode: number;
    messages: Array<string>;
    data: D;
    fieldsErrors: FieldsErrorsType[];
};

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}

export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
};
export type UpdateTaskModelType = {
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
};

export enum ResultCode {
    success = 0,
    error = 1,
    captcha = 10,
}
