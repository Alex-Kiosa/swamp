import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

type UserType = {
    name: string
    email: string
    password: string
    roles: string[]
}

type UserStateType = {
    currentUser: Partial<UserType>
    isAuth: boolean
}

const initialState: UserStateType = {
    currentUser: {},
    isAuth: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>) => {
            state.currentUser = action.payload
            state.isAuth = true
        },
        logout: (state) => {
            localStorage.removeItem("token")
            state.currentUser = {}
            state.isAuth = false
        }
    }
})

// Action creators are generated for each case reducer function
export const {setUser, logout} = userSlice.actions
export default userSlice.reducer
