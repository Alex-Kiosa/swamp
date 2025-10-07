import axios from "axios"

// in production, there's no localhost so we have to make this dynamic
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : import.meta.env.VITE_BASE_URL

export const instance = axios.create({
    baseURL: BASE_URL

    // headers: {
    //     Authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
    //     "API-KEY": process.env.REACT_APP_API_KEY,
    // },
})
