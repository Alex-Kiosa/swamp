import { combineReducers, configureStore } from "@reduxjs/toolkit"
import gameReducer from "../features/games/model/gameSlice.ts"
import userReducer from "../features/users/model/user-reducer.ts"
import appReducer from "./app-reducer.ts"
import cardReducer from "../features/cards/model/cardSlice.ts"

// const rootReducer = combineReducers({
//     app: appReducer,
//     user: userReducer,
//     game: gameReducer,
//     cards: cardReducer
// })
//
// export const store = configureStore({
//     reducer: rootReducer,
// })

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer,
        game: gameReducer,
        cards: cardReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
