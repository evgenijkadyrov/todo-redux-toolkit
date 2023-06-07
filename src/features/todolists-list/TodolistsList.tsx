import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType} from 'app/store'
import {
    TodolistDomainType,
    todolistsThunk
} from 'features/todolists-list/todolists/todolists-reducer'
import {Grid, Paper} from '@mui/material'
import {AddItemForm} from 'components/AddItemForm/AddItemForm'
import {Todolist} from './todolists/todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {useAppDispatch} from 'hooks/useAppDispatch';
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTasks} from "features/todolists-list/tasks/tasks.selectors";
import {selectTodolists} from "features/todolists-list/todolists/todolists.select";
import {useActions} from "hooks/useActions";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(selectTodolists)
    const tasks = useSelector(selectTasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    const {
        addTodolist,
        setTodolists,
    } = useActions(todolistsThunk)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }

        setTodolists({})
    }, [])


    const addTodolistCB = useCallback((title: string) => {
       return addTodolist({title}).unwrap()

    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolistCB}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
