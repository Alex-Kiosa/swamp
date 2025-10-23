import {createRoot} from 'react-dom/client'
import './main.css'
import App from './app/App.tsx'
import {BrowserRouter, Route, Routes} from "react-router";
import {Login} from "./pages/Login.tsx";
import {Signup} from "./pages/Signup.tsx";
import {Provider} from "react-redux";
import {store} from "./app/store"
import Breadcrumbs from "./components/breadcrumbs/Breadcrumbs.tsx";
import {NotFound} from "./pages/NotFound.tsx";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <BrowserRouter>
            <Breadcrumbs/>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
);