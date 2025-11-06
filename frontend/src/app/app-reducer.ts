import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed"
export type ErrorStatus = string | null

const initialState = {
    status: "idle" as RequestStatus,
    error: null as ErrorStatus
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<RequestStatus>) => {
            state.status = action.payload
        },
        setError: (state, action: PayloadAction<ErrorStatus>) => {
            state.error = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const {setStatus, setError} = appSlice.actions
export default appSlice.reducer
