import {Task} from "features/todolists-list/todolists/todolist/tasks/task/Task";
import React, {FC} from "react";
import {TaskStatuses} from "features/todolists-list/todolists/todolists-api";
import {TaskType} from "features/todolists-list/tasks/tasks-api";
import {TodolistDomainType} from "features/todolists-list/todolists/todolists-reducer";
type Props ={
    tasks:TaskType[],
    todolist:TodolistDomainType
}
export const Tasks:FC<Props> =({tasks,todolist})=>{
    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
    <>
        {
            tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}

            />)
        }
    </>)
}