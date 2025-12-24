import type {RootState} from "../../../app/store.ts";

export const selectAuth = (state: RootState) => state.user.isAuth
export const selectIsInitialized = (state: RootState) => state.user.isInitialized
export const selectCurrentUser = (state: RootState) => state.user.currentUser
