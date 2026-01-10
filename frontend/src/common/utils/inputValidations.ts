import type {InputType} from "../../components/input/Input.tsx";
import type {InputNumberType} from "../../components/input/InputNumber.tsx";

export const name_validation: InputType = {
    type: "text",
    id: "input-name",
    placeholder: "Ваше имя",
    validation: { required: "Напишите Ваше имя" }
}

export const email_validation: InputType = {
    type: "email",
    id: "input-email",
    placeholder: "Email",
    validation: {
        required: "Введите email",
        pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Некорректный email'
        }
    }
}

export const number_validation: InputNumberType = {
    id: "input-number",
    placeholder: "Число",
    validation: {required: "Введите число"}
}

export const users_number_validation: InputNumberType = {
    id: "input-amount-users",
    placeholder: "Укажите кол-во игроков от 2 до 15",
    min: 2,
    max: 15,
    validation: {required: 'Укажите количество игроков',}
}

export const pass_validation: InputType = {
    type: "password",
    id: "input-password",
    placeholder: "Введите пароль",
    validation: {
        required: 'Введите пароль',
        minLength: { value: 6, message: "Пароль должен содержать от 6 до 15 символов" },
        maxLength: { value: 15, message: "Пароль должен содержать от 6 до 15 символов" }
    }
}

export const color_validation: InputType = {
    type: "color",
    id: "input-color",
    validation: { required: "Укажите цвет" }
}

export const desc_validation = {
    name: 'description',
    id: 'textarea-description',
    placeholder: 'Напишите ...',
    maxLength: 200,
    validation: {required: 'Заполните поле. Максимум 200 символов'}
}