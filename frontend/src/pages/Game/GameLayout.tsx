import {Outlet} from "react-router";

export const GameLayout = () => {
    return (
        <div className="w-screen h-screen overflow-hidden">
            <Outlet />
        </div>
    )
}
