import {authApi} from "../api/authAPI.ts";

const RegisterForm = () => {
    const loginHandler = () => {
        return authApi.login()
    }

    return (
        <div className="flex min-h-full flex-col justify-center p-6 lg:p-8 bg-white shadow-2xs rounded-2xl">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">Войти в аккаунт ведущего</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action={()=> console.log("send form")} method="POST" className="space-y-6">
                    <div className="mt-2">
                        <label htmlFor="email"
                               className="block text-sm/6 font-medium ">Email</label>
                        <input id="email" type="email" name="email" required autoComplete="email"
                               className="block mt-2 w-full rounded-md px-3 py-1.5 text-base outline-1 outline-gray-700 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-900 sm:text-sm/6"/>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password"
                                   className="block text-sm/6 font-medium ">Пароль</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-lime-900 hover:text-lime-950">Забыли
                                    пароль</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input id="password" type="password" name="password" required
                                   autoComplete="current-password"
                                   className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base outline-1 outline-gray-700 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-lime-900 sm:text-sm/6"/>
                        </div>
                    </div>

                    <div>
                        <button type="submit"
                                className="flex w-full justify-center rounded-md text-white p-3 text-sm/6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 bg-lime-900 hover:bg-lime-950">Войти
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterForm
