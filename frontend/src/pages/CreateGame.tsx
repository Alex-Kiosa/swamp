import {FormProvider, useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../common/hooks/hooks.ts";
import {Input} from "../components/input/Input.tsx";
import {users_number_validation} from "../common/utils/inputValidations.ts";
import {createGameThunk} from "../features/games/actions/games-actions.ts";
import {selectAppStatus} from "../app/appSelectors.ts";
import {Loading} from "../components/loading/Loading.tsx";
import {useEffect} from "react";
import {selectGame} from "../features/games/model/gameSelectors.ts";
import {useNavigate} from "react-router";

export const CreateGame = () => {
    const status = useAppSelector(selectAppStatus)
    const {gameInitialized, isActive, gameId} = useAppSelector(selectGame)

    const methods = useForm()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const createGameHandler = methods.handleSubmit(data => {
        // dispatch(createGameThunk(data))
    })

    useEffect(() => {
        if (gameInitialized && isActive) {
            navigate(`/game/${gameId}`, {replace: true})
        }
    }, [gameInitialized, isActive])

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

                <Input {...users_number_validation}/>

                <button
                    type="submit"
                    onClick={createGameHandler}
                    className="btn btn-primary w-full text-base"
                    disabled={status === "loading"}
                >
                    {status === "loading" ? <Loading/> : "Создать"}
                </button>
            </form>
        </FormProvider>
    )
}