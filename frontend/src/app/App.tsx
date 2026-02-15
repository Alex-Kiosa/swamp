import {Route, Routes} from "react-router";
import {LayoutNavbarBreadcrumbs} from "../components/layoutNavbarBreadcrumbs/LayoutNavbarBreadcrumbs";
import {Login} from "../pages/Login";
import {Signup} from "../pages/Signup";
import {PrivacyNotice} from "../pages/PrivacyNotice";
import {NotFound} from "../pages/NotFound";
import {Home} from "../pages/Home";
import {useEffect} from "react";
import {authThunk} from "../features/users/actions/user-actions.ts";
import {Account} from "../pages/Account.tsx";
import {useAppDispatch, useAppSelector} from "../common/hooks/hooks.ts";
import {Game} from "../pages/Game/Game.tsx";
import {PrivateRoute} from "../components/privatePublicRoute/PrivatePublicRoute.tsx";
import {selectAuth, selectIsInitialized} from "../features/users/model/userSelectors.ts";
import {Loading} from "../components/loading/Loading.tsx";
import {setIsInitialized} from "../features/users/model/user-reducer.ts";
import {useToast} from "../contexts/ToastContext.tsx";
import {selectAppError} from "./appSelectors.ts";
import {setAppError} from "./app-reducer.ts";
import {GameLayout} from "../pages/Game/GameLayout.tsx";

function App() {
    const isInitialized = useAppSelector(selectIsInitialized)
    const isAuth = useAppSelector(selectAuth)
    const error = useAppSelector(selectAppError)

    const dispatch = useAppDispatch()
    const {showToast} = useToast()

    useEffect(() => {
        const token = localStorage.getItem("token")

        if (token) {
            dispatch(authThunk())
        } else {
            dispatch(setIsInitialized(true))
        }
    }, [])

    useEffect(() => {
        if (!error) return

        showToast({
            type: "warning",
            message: error
        })

        dispatch(setAppError(null))
    }, [error])

    return <>
        {isInitialized && (
            <Routes>
                <Route element={<LayoutNavbarBreadcrumbs/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/privacy-notice" element={<PrivacyNotice/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route element={<PrivateRoute isAuth={isAuth}/>}>
                        <Route path="/account" element={<Account/>}/>
                    </Route>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
                <Route element={<GameLayout/>}>
                    <Route path="/game/:gameId" element={<Game/>}/>
                </Route>
            </Routes>
        )}
        {!isInitialized && (
            <Loading/>
        )}
    </>
}

export default App;
