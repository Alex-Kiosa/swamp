import type {RootState} from "../../../app/store.ts";

export const selectGame = (state: RootState) => state.game.roomId
