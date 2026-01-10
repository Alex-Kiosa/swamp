import type {RootState} from "../../../app/store.ts";

export const selectGame = (state: RootState) => state.game
export const selectGameId = (state: RootState) => state.game.gameId
export const selectGameChips = (state: RootState) => state.game.chips