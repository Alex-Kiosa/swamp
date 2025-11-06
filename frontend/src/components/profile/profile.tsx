import womenAvatar from '../../assets/women-avatar.jpg';
import {useAppSelector} from "../../common/hooks/hooks.ts";
import {Link} from "react-router";

export const Profile = () => {
    const {name, email, roles = []} = useAppSelector((state) => state.user.currentUser)
    const checkUserRole = () => {
        return roles.includes("ADMIN") ?  "Админ" : roles.includes("HOST") ? "Ведущий" : "Гость"
    }

    return (
        <div className="card bg-white w-96 shadow-sm">
            <figure className="px-10 pt-10">
                <img
                    src={womenAvatar}
                    alt="Аватар"
                    className="rounded-xl"/>
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{name}</h2>
                <p><b>Email:</b> {email}</p>
                <p><b>Тип аккаунта:</b> {checkUserRole()}</p>
                <div className="card-actions">
                    <Link to="/account/create-game" role="button" className="btn btn-wide btn-primary text-base">
                        Создать игру
                    </Link>
                </div>
            </div>
        </div>
    )
}