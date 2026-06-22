import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

type UserType = {
    id: string
    name: string
    email: string
    roles: string[]
    createdAt: string
}

type UserStateType = {
    currentUser: Partial<UserType>
    isAuth: boolean
    isInitialized: boolean
}

const initialState: UserStateType = {
    currentUser: {},
    isAuth: false,
    isInitialized: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>) => {
            state.currentUser = action.payload
            state.isAuth = true
        },
        setIsInitialized: (state, action) => {
            state.isInitialized = action.payload
        },
        logout: (state) => {
            localStorage.removeItem("token")
            state.currentUser = {}
            state.isAuth = false
        }
    }
})

// Action creators are generated for each case reducer function
export const {setUser, logout, setIsInitialized} = userSlice.actions
export default userSlice.reducer
