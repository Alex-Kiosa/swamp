import type {RootState} from "./store.ts";

export const selectAppStatus = (state: RootState) => state.app.status

export const selectAppError = (state: RootState) => state.app.error