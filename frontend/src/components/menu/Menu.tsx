import { Link } from "react-router"
import {useDispatch} from "react-redux";
import {logout} from "../../features/users/model/user-reducer.ts";
import {Avatar} from "../profile/Profile.tsx";

export const Menu = () => {
    return <>
        <div className="flex-1">
            <Link to="/login" className="btn btn-ghost text-xl">Войти</Link>
        </div>
        <div className="flex-1">
            <Link to="/signup" className="btn btn-ghost text-xl">Регистрация</Link>
        </div>
    </>
}

export const MenuAuth = () => {
    const dispatch = useDispatch()

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                    <Avatar/>
                </div>
            </div>
            <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-white rounded-lg z-1 mt-3 w-52 p-2 shadow font-medium">
                <li><Link to="/account">Мой аккаунт</Link></li>
                <li><button onClick={()=> dispatch(logout())}>Выйти</button></li>
            </ul>
        </div>
    )
}