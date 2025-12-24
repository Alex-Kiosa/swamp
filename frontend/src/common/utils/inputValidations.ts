import type {InputType} from "../../components/input/Input.tsx";

export const name_validation: InputType = {
    type: "text",
    id: "input-name",
    placeholder: "Ваше имя",
    validation: {
        required: {value: true, message: 'Напишите Ваше имя'},
    }
}

export const number_validation: InputType = {
    type: "number",
    id: "input-number",
    placeholder: "Число",
    validation: {
        required: {value: true, message: 'Введите число'},
    }
}

export const users_number_validation: InputType = {
    type: "number",
    id: "input-number",
    placeholder: "Укажите кол-во игроков от 2 до 15",
    validation: {
        required: {value: true, message: 'Укажите количество игроков'},
        min: {value: 2, message: "Минимум 2 игрока"},
        max: {value: 15, message: "Максимум 15 игроков"},
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