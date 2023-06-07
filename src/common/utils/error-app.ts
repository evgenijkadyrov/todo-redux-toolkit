import { ResponseType } from "features/todolists-list/todolists/todolists-api";
import { Dispatch } from "redux";
import { appActions, SetAppErrorActionType, SetAppStatusActionType } from "app/app-reducer";

export const handleServerAppError = <D>(
    data: ResponseType<D>,
    dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>,
    showError: boolean = true
) => {
    if (showError) {
        dispatch(
            appActions.setAppError({
                error: data.messages.length ? data.messages[0] : "Some error occurred",
            })
        );
    }

    dispatch(appActions.setAppStatus({ status: "failed" }));
};
