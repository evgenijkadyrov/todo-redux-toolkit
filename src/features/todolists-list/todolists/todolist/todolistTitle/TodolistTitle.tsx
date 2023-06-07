import React, { FC, useCallback } from "react";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useActions } from "hooks/useActions";
import { TodolistDomainType, todolistsThunk } from "features/todolists-list/todolists/todolists-reducer";
type Props = {
    todolist: TodolistDomainType;
};
export const TodolistTitle: FC<Props> = ({ todolist }) => {
    const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunk);
    const removeTodolistCB = () => {
        removeTodolist(todolist.id);
    };
    const changeTodolistTitleCB = useCallback(
        (title: string) => {
            changeTodolistTitle({ id: todolist.id, title });
        },
        [todolist.id]
    );

    return (
        <div>
            <h3>
                <EditableSpan value={todolist.title} onChange={changeTodolistTitleCB} />
                <IconButton onClick={removeTodolistCB} disabled={todolist.entityStatus === "loading"}>
                    <Delete />
                </IconButton>
            </h3>
        </div>
    );
};
