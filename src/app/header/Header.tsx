import React from 'react';
import {
    AppBar,
    Button,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {useActions} from "hooks/useActions";
import {authThunk} from "features/auth/auth-reducer";
import {selectStatus} from "app/app.selectors";

const Header = () => {
    const status = useSelector(selectStatus)
    const {logout}= useActions(authThunk)
    const logoutHandler = () =>  logout({})
    const isLoggedIn = useSelector(selectIsLoggedIn)
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu/>
                </IconButton>
                <Typography variant="h6">
                    News
                </Typography>
                {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log
                    out</Button>}
            </Toolbar>
            {status === 'loading' && <LinearProgress/>}
        </AppBar>
    );
};

export default Header;