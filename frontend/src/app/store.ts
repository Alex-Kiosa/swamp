import {combineReducers, configureStore} from "@reduxjs/toolkit";
import gameReducer from "../features/games/model/game-reducer.ts";
import userReducer from "../features/users/model/user-reducer.ts";
import appReducer from "./app-reducer.ts";

const rootReducer = combineReducers({
    user: userReducer,
    game: gameReducer,
    app: appReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    // devTools: process.env.NODE_ENV !== "production",
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch