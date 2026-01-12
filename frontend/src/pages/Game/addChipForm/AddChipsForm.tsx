import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {selectAppStatus} from "../../../app/appSelectors.ts";
import {FormProvider, useForm} from "react-hook-form";
import {Loading} from "../../../components/loading/Loading.tsx";
import {Select} from "../../../components/select/Select.tsx";
import {Input} from "../../../components/input/Input.tsx";
import {color_validation} from "../../../common/utils/inputValidations.ts";
import {createChipThunk} from "../../../features/games/actions/games-actions.ts";

type Props = {
    onSuccess?: () => void
}

export const AddChipsForm = ({onSuccess}: Props) => {
    const status = useAppSelector(selectAppStatus)

    const methods = useForm()
    const dispatch = useAppDispatch()

    const onSubmit = methods.handleSubmit(data => {
        const chip = {
            gameId: "1c9f6cd4",
            shape: data["select-shape"],
            color: data["input-color"]
        }
        dispatch(createChipThunk(chip))
        if (onSuccess) onSuccess()
        methods.reset()
    })

    // Async logic
    // const onSubmit = methods.handleSubmit(async data => {
    //     const chip = {
    //         gameId: "1c9f6cd4",
    //         shape: data["select-shape"],
    //         color: data["input-color"]
    //     }
    //
    //     try {
    //         await dispatch(createChipThunk(chip)).unwrap()
    //         if (onSuccess) onSuccess()
    //         methods.reset()
    //     } catch (e) {
    //         console.error("Ошибка создания фишки", e)
    //     }
    // })

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit} noValidate className="mx-auto w-xs rounded-2xl">
                <div className="mb-7 text-center">
                    <h2 className="mb-3 text-2xl font-bold">Создать фишку</h2>
                </div>

                <Select
                    id="select-shape"
                    placeholder="Выберите форму"
                    options={[
                        {label: "Круг", value: "Circle"},
                        {label: "Квадрат", value: "Square"},
                        {label: "Треугольник", value: "Triangle"},
                    ]}
                    validation={{required: "Выберите форму фишки",}}
                />

                <Input {...color_validation} label={"Поменять цвет"}/>

                <button
                    type="submit"
                    className="w-full mt-2 btn btn-primary text-base"
                    disabled={status === "loading"}
                >
                    {status === "loading" ? <Loading/> : "Подтвердить выбор"}
                </button>
            </form>
        </FormProvider>
    )
}