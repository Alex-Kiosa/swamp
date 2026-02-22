import {useAppSelector} from "../../../common/hooks/hooks.ts";
import {selectGame} from "../../../features/games/model/gameSelectors.ts";
import {Player} from "./Player.tsx";

export const Players = () => {
    const {players} = useAppSelector(selectGame)
    const onlinePlayers = players.filter(p=>p.isOnline === true)

    return <div className={"flex gap-4 mt-3 flex-wrap"}>{onlinePlayers.map(p => <Player name={p.name}/>)}</div>
}