import {instance} from "common/common-api";

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export const authAPI = {
    login(data: LoginParamsType) {
        const promise = instance.post<ResponseType<{ userId?: number }>>('auth/login', data);
        return promise;
    },
    logout() {
        const promise = instance.delete<ResponseType<{ userId?: number }>>('auth/login');
        return promise;
    },
    me() {
        const promise = instance.get<ResponseType<{ id: number; email: string; login: string }>>('auth/me');
        return promise
    }
}

type FieldsErrorsType = { field: string, error: string }
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D,
    fieldsErrors: FieldsErrorsType[]
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

