import {Outlet, useLocation} from "react-router";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs.tsx";
import {Navbar} from "../navbar/Navbar.tsx";


export const LayoutNavbarBreadcrumbs = () => {
    const location = useLocation();
    const hideBreadcrumbs = location.pathname === "/";

    return (
        <div>
            <Navbar/>
            {!hideBreadcrumbs && <Breadcrumbs/>}
            <div className="flex justify-center items-center gap-8 flex-col">
                <Outlet/>
            </div>
        </div>
    )
}