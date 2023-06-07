import React, { useEffect } from "react";
import "./App.css";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { selectIsInitialized } from "app/app.selectors";
import { authThunk } from "features/auth/auth-reducer";
import { useActions } from "hooks/useActions";
import Header from "app/header/Header";
import Routing from "app/routing/Routing";

export type Props = {
    demo?: boolean;
};

function App({ demo = false }: Props) {
    const isInitialized = useSelector(selectIsInitialized);

    const { initialized } = useActions(authThunk);
    useEffect(() => {
        initialized({});
    }, []);

    if (!isInitialized) {
        return (
            <div
                style={{
                    position: "fixed",
                    top: "30%",
                    textAlign: "center",
                    width: "100%",
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar />
                <Header />
                <Routing demo={demo} />
            </div>
        </BrowserRouter>
    );
}

export default App;
