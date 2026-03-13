import type {FieldErrors} from "react-hook-form";

export const isFormInvalid = (err:FieldErrors) => {
  if (Object.keys(err).length > 0) return true
  return false
}