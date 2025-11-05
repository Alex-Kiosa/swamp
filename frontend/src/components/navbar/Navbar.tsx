import {Link} from "react-router"
import {useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../app/store.ts";
import {logout} from "../../features/users/model/user-reducer.ts";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const isAuth = useSelector((state:RootState)=> state.user.isAuth)
    const dispatch = useDispatch()

    return (
        <header className="rounded-lg bg-white shadow-sm mb-8">
            <div className="navbar flex justify-between items-center py-4 px-4">
                <Link className="btn btn-ghost text-lg" to="/">Главная</Link>

                <nav className="hidden @md:flex gap-6 text-gray-700">
                    {!isAuth && <Link to="/login" className="btn btn-ghost text-lg">Войти</Link>}
                    {!isAuth && <Link to="/signup" className="btn btn-ghost text-lg">Регистрация</Link>}
                    {isAuth && <button onClick={()=> dispatch(logout())} className="btn btn-ghost text-lg">Выход</button>}
                </nav>

                <div className="@md:hidden relative">
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Меню"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-6 w-6 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
                            <Link
                                to="/login"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                Войти
                            </Link>
                            <Link
                                to="/signup"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                Регистрация
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
