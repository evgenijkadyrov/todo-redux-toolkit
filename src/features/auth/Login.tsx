import React from "react";
import { FormikHelpers, useFormik } from "formik";
import { useSelector } from "react-redux";
import { authThunk } from "./auth-reducer";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { selectIsLoggedIn } from "features/auth/auth.selectors";
import { LoginParamsType, ResponseType } from "features/todolists-list/todolists/todolists-api";
import { useActions } from "hooks/useActions";

type FormikErrorsType = Partial<Omit<LoginParamsType, "captcha">>;
export const Login = () => {
    const { login } = useActions(authThunk);

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            const errors: FormikErrorsType = {};
            if (!values.email) {
                errors.email = "Email is required";
            }
            if (!values.password) {
                errors.password = "Password is required";
            } else if (values.password.length < 3) {
                errors.password = "Must be 3 characters at least";
            }
            return errors;
        },
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        onSubmit: (values, formikHelper: FormikHelpers<LoginParamsType>) => {
            login({ data: values })
                .unwrap()
                .catch((reason: ResponseType) => {
                    const { fieldsErrors } = reason;
                    if (fieldsErrors) {
                        fieldsErrors.forEach((f) => {
                            formikHelper.setFieldError(f.field, f.error);
                        });
                    }
                });
        },
    });

    if (isLoggedIn) {
        return <Navigate to={"/"} />;
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={4}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered{" "}
                                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p> Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
                            {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                {...formik.getFieldProps("password")}
                            />
                            {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                            <FormControlLabel
                                label={"Remember me"}
                                control={
                                    <Checkbox
                                        {...formik.getFieldProps("rememberMe")}
                                        checked={formik.values.rememberMe}
                                    />
                                }
                            />
                            <Button type={"submit"} variant={"contained"} color={"primary"}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
};
