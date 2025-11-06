import type {FieldError, FieldErrors} from "react-hook-form";

export type InputErrorType = {
    error: FieldError
}  | {}

export function findInputError(errors: FieldErrors, id: string): InputErrorType {
    const filtered = Object.keys(errors)
        .filter(key => key.includes(id))
        .reduce((cur, key) => {
            return Object.assign(cur, {error: errors[key]})
        }, {})

    return filtered
}
