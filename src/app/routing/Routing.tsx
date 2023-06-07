import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { TodolistsList } from "features/todolists-list/TodolistsList";
import { Login } from "features/auth/Login";
import { Container } from "@mui/material";
import { Props } from "app/App";

const Routing: FC<Props> = ({ demo }) => {
    return (
        <Container fixed>
            <Routes>
                <Route path={"/"} element={<TodolistsList demo={demo} />} />
                <Route path={"/login"} element={<Login />} />
            </Routes>
        </Container>
    );
};

export default Routing;
