import {Alert} from "../alert/Alert"
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks.ts";
import {selectAppError} from "../../app/appSelectors.ts";
import {setAppError} from "../../app/app-reducer.ts";

export const ErrorToast = () => {
    const dispatch = useAppDispatch()
    const error = useAppSelector(selectAppError)
    const onCloseHandler = () => dispatch(setAppError(null))

    if (!error) return null

    return (
        <div className="toast toast-center toast-bottom">
            <Alert
                type={"error"}
                message={error}
                onClose={onCloseHandler}
            />
        </div>
    )
}
