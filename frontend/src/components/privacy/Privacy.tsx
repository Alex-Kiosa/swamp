import {Link} from "react-router";

export const Privacy = () => {
    return (
        <p className="text-sm text-gray-700">Отправляя форму, Вы принимаете условия <Link to={"/privacy-notice"} target="_blank">Политики обработки персональных данных</Link></p>
    )
}