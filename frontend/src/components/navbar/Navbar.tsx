import {Link} from "react-router"
import type {RootState} from "../../app/store.ts";
import {useAppSelector} from "../../common/hooks/hooks.ts";
import {Menu, MenuAuth} from "../menu/Menu.tsx";

export const Navbar = () => {
    const isAuth = useAppSelector((state: RootState) => state.user.isAuth)

    return (
        <header className="mb-8">
            <nav className="navbar bg-white shadow-sm rounded-lg">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost text-xl">Главная</Link>
                </div>
                <div className="flex gap-2">
                    {isAuth ? <MenuAuth/> : <Menu/>}
                </div>
            </nav>
        </header>
    )
}
