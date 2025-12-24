import womenAvatar from '../../assets/women-avatar.jpg';
import {useAppDispatch, useAppSelector} from "../../common/hooks/hooks.ts";
import {Link} from "react-router";
import {useEffect} from "react";
import {getGameThunk} from "../../features/games/actions/games-actions.ts";
import {selectGame} from "../../features/games/model/gameSelectors.ts";
import {selectCurrentUser} from "../../features/users/model/userSelectors.ts";

type AvatarProps = {
    src?: string
    className?: string
}

export const Profile = () => {
    const {name, email, roles = []} = useAppSelector(selectCurrentUser)
    const roomId = useAppSelector(selectGame)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getGameThunk())
    }, []);

    const checkUserRole = () => {
        return roles.includes("ADMIN") ? "Админ" : roles.includes("HOST") ? "Ведущий" : "Гость"
    }

    return (
        <div className="card bg-white w-96 shadow-sm">
            <figure className="mt-6"><Avatar/></figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{name}</h2>
                <p><b>Email:</b> {email}</p>
                <p><b>Тип аккаунта:</b> {checkUserRole()}</p>
                {
                    roomId ?
                        <p><b>Ваша игра:</b> <Link to={`/game/${roomId}`} role="link" className="link link-primary ">Открыть
                            игру</Link></p> :
                        <div className="card-actions">
                            <Link to="/account/create-game" role="button"
                                  className="btn btn-wide btn-primary text-base">
                                Создать игру
                            </Link>
                        </div>
                }
            </div>
        </div>
    )
}

export const Avatar = ({
                           className = "rounded-xl", src = womenAvatar
                       }: AvatarProps) => {
    return <img src={src} alt="Аватар" className={className}/>
}