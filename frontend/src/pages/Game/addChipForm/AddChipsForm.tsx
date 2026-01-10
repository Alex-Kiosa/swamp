import {useAppDispatch, useAppSelector} from "../../../common/hooks/hooks.ts";
import {selectAppStatus} from "../../../app/appSelectors.ts";
import {FormProvider, useForm} from "react-hook-form";
import {Loading} from "../../../components/loading/Loading.tsx";
import {Select} from "../../../components/select/Select.tsx";
import {Input} from "../../../components/input/Input.tsx";
import {color_validation} from "../../../common/utils/inputValidations.ts";
import {createChipThunk} from "../../../features/games/actions/games-actions.ts";

export const AddChipsForm = () => {
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
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(e) => e.preventDefault()}
                noValidate
                className="w-sm p-10 space-y-6 rounded-2xl bg-white shadow-sm"
            >
                <div className="mb-5 text-center">
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
                    onClick={onSubmit}
                    className="btn btn-primary w-full text-base"
                    disabled={status === "loading"}
                >
                    {status === "loading" ? <Loading/> : "Подтвердить выбор"}
                </button>
            </form>
        </FormProvider>
    )
}