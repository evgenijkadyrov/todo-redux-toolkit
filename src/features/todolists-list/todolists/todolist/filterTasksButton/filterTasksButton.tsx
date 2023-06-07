import React, {FC, useCallback} from "react";
import {Button} from "@mui/material";
import {useActions} from "hooks/useActions";
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions
} from "features/todolists-list/todolists/todolists-reducer";
type Props={
    todolist: TodolistDomainType
}
export const FilterTasksButton:FC<Props> = ({todolist})=>{

    const {changeTodolistFilter:changeFilter} = useActions(todolistsActions)

    const changeFilterHandler = useCallback ((filter:FilterValuesType)=>{
        changeFilter({id: todolist.id,filter })
    },[todolist.id])


    return (
        <div>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={()=>{changeFilterHandler('all')}}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={()=>{changeFilterHandler('active')}}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={()=>{changeFilterHandler('completed')}}
                    color={'secondary'}>Completed
            </Button>
        </div>
    )
}