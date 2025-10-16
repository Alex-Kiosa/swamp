import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router/dom";
import {Login} from "./pages/Login.tsx";
import {SignUp} from "./pages/SignUp.tsx";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/signup",
        element: <SignUp/>,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router}/>
        <Toaster/>
    </StrictMode>
);