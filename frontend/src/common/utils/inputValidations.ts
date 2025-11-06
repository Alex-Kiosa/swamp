import type {InputType} from "../../components/input/Input.tsx";

export const name_validation: InputType = {
    type: "text",
    id: "input-name",
    placeholder: "Ваше имя",
    validation: {
        required: {value: true, message: 'Напишите Ваше имя'},
    }
}

export const num_validation: InputType = {
    type: "number",
    id: "input-number",
    placeholder: "Число",
    validation: {
        required: {value: true, message: 'Введите число'},
    }
}

export const email_validation: InputType = {
    type: "email",
    id: "input-email",
    placeholder: "Email",
    validation: {
        required: {value: true, message: 'Введите email'},
        pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Некорректный email'
        }
    }
}

export const pass_validation: InputType = {
    type: "password",
    id: "input-password",
    placeholder: "Введите пароль",
    validation: {
        required: {value: true, message: 'Введите пароль'}
    }
}

export const desc_validation = {
    name: 'description',
    id: 'textarea-description',
    placeholder: 'Напишите ...',
    validation: {
        required: {
            value: true,
            message: 'Заполните поле',
        },
        maxLength: {
            value: 200,
            message: '200 символов максимум',
        },
    },
}