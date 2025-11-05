import {Route, Routes} from "react-router";
import {LayoutNavbarBreadcrumbs} from "../components/layoutNavbarBreadcrumbs/LayoutNavbarBreadcrumbs";
import {Login} from "../pages/Login";
import {Signup} from "../pages/Signup";
import {PrivacyNotice} from "../pages/PrivacyNotice";
import {NotFound} from "../pages/NotFound";
import {Home} from "../pages/Home";
import {useSelector} from "react-redux";
import type {RootState} from "./store.ts";
import {useEffect} from "react";
import {authThunk} from "../features/users/actions/user.ts";
import {Account} from "../pages/Account.tsx";
import {useAppDispatch} from "../common/hooks/hooks.ts";
import {PrivateRoute, PublicRoute} from "../components/privatePublicRoute/PrivatePublicRoute.tsx";

function App() {
    const isAuth = useSelector((state: RootState) => state.user.isAuth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(authThunk());
    }, [dispatch]);

    return (
        <div className="@container mx-auto p-4 pb-10 max-w-5xl">
            <Routes>
                <Route element={<LayoutNavbarBreadcrumbs />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/privacy-notice" element={<PrivacyNotice />} />

                    {/* Private */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute isAuth={isAuth}>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute isAuth={isAuth}>
                                <Signup />
                            </PublicRoute>
                        }
                    />

                    {/* Public */}
                    <Route
                        path="/account"
                        element={
                            <PrivateRoute isAuth={isAuth}>
                                <Account />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
