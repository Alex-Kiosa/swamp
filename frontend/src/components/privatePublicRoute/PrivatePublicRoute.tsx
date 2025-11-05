import { Navigate } from "react-router";
import * as React from "react";

type RouteProps = {
    isAuth: boolean;
    children: React.ReactNode;
}

export const PrivateRoute = ({ isAuth, children }: RouteProps) => {
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export const PublicRoute = ({ isAuth, children }: RouteProps) => {
    if (isAuth) {
        return <Navigate to="/account" replace />;
    }
    return <>{children}</>;
};
