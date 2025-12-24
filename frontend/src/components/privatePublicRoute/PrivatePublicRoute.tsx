import {Navigate, Outlet} from "react-router"

type RouteProps = {
    isAuth: boolean
}

export const PrivateRoute = ({isAuth}: RouteProps) => {
    return isAuth ? <Outlet/> : <Navigate to="/login"/>
}
