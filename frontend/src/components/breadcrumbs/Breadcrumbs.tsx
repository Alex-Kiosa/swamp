import {Link, useLocation} from "react-router";
import {convertSlugTotTile} from "../../utils/slugService.ts";

const Breadcrumbs = () => {
    const location = useLocation()
    const pathnames = location.pathname.split("/").filter(x => x)

    return (
        <div className="breadcrumbs text-sm mb-4">
            <ul>
                <li>
                    <Link to={"/"}>Главная</Link>
                </li>
                {pathnames.map((value, index) => <li key={index}>{convertSlugTotTile(value)}</li>)}
            </ul>
        </div>
    )
}

export default Breadcrumbs