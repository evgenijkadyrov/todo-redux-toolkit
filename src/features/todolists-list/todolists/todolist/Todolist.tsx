import React, { FC, useCallback, useEffect } from "react";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { TaskType } from "features/todolists-list/todolists/todolists-api";
import { TodolistDomainType } from "features/todolists-list/todolists/todolists-reducer";
import { tasksThunk } from "features/todolists-list/tasks/tasks-reducer";
import { useActions } from "hooks/useActions";
import { FilterTasksButton } from "features/todolists-list/todolists/todolist/filterTasksButton/filterTasksButton";
import { Tasks } from "features/todolists-list/todolists/todolist/tasks/Tasks.";
import { TodolistTitle } from "features/todolists-list/todolists/todolist/todolistTitle/TodolistTitle";

type Props = {
    todolist: TodolistDomainType;
    tasks: Array<TaskType>;
    demo?: boolean;
};

export const Todolist: FC<Props> = React.memo(function ({ demo = false, todolist, tasks }) {
    const { fetchTasks, addTask } = useActions(tasksThunk);

    useEffect(() => {
        if (demo) {
            return;
        }
        fetchTasks(todolist.id);
    }, []);

    const addTaskCallback = useCallback(
        (title: string) => {
            return addTask({ title, todolistId: todolist.id }).unwrap();
        },
        [todolist.id]
    );

    return (
        <div>
            <TodolistTitle todolist={todolist} />
            <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />

            <Tasks todolist={todolist} tasks={tasks} />

            <div style={{ paddingTop: "10px" }}>
                <FilterTasksButton todolist={todolist} />
            </div>
        </div>
    );
});
