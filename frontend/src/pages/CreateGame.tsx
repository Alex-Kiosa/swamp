import {FormProvider, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../common/hooks/hooks.ts";
import {gameCreateThunk} from "../features/games/actions/games-actions.ts";
import type {RootState} from "../app/store.ts";
import {Input} from "../components/input/Input.tsx";
import {email_validation, pass_validation} from "../common/utils/inputValidations.ts";
import {Loader} from "../components/loader/Loader.tsx";

export const CreateGame = () => {
    const methods = useForm()
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state: RootState) => state.app.status);

    const createGameHandler = () => {
        dispatch(gameCreateThunk)
    }

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(e) => e.preventDefault()}
                noValidate
                className="w-sm p-10 space-y-6 rounded-2xl bg-white shadow-sm"
            >
                <div className="mb-5 text-center">
                    <h2 className="mb-3 text-2xl font-bold">Укажите параметры игры</h2>
                </div>

                <Input {...email_validation} placeholder="Введите email"/>
                <Input {...pass_validation}/>

                <button
                    type="submit"
                    onClick={createGameHandler}
                    className="btn btn-primary w-full text-base"
                    disabled={loading === "succeeded"}
                >

                    {loading === "loading" ? <Loader/> : "Создать"}
                </button>
            </form>
        </FormProvider>
    );
}