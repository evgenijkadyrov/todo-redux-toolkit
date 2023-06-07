import React, { ChangeEvent, FC, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskStatuses, TaskType } from "features/todolists-list/todolists/todolists-api";
import { useActions } from "hooks/useActions";
import { tasksThunk } from "features/todolists-list/tasks/tasks-reducer";
import s from "features/todolists-list/todolists/todolist/tasks/task/task.module.css";

type Props = {
    task: TaskType;
    todolistId: string;
};
export const Task: FC<Props> = React.memo(({ task, todolistId }) => {
    const { removeTask, updateTask } = useActions(tasksThunk);
    const removeTaskHandler = useCallback(
        () =>
            removeTask({
                taskId: task.id,
                todolistId,
            }),
        [task.id, todolistId]
    );

    const onChangeStatusHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            updateTask({
                taskId: task.id,
                model: {
                    status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New,
                },
                todolistId,
            });
        },
        [task.id, todolistId]
    );

    const onTitleChangeHandler = useCallback(
        (title: string) => {
            updateTask({ todolistId, model: { title }, taskId: task.id });
        },
        [task.id, todolistId]
    );

    return (
        <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ""}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeStatusHandler}
            />

            <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
            <IconButton onClick={removeTaskHandler}>
                <Delete />
            </IconButton>
        </div>
    );
});
