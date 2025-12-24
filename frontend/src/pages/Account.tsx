import {Profile} from "../components/profile/Profile.tsx";
import { Outlet } from "react-router";

export const Account= () => {
    return <>
        <Profile/>
        <Outlet/>
    </>

}