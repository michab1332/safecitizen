import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/userSlice";

import XIcon from "../../assets/xIcon.svg";

import "./menu.css";

const Menu = ({ isVisible, handleChangeVisibleOnClick }) => {
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    return (
        <div className={isVisible ? "menuContainer" : "menuContainer-hidden"}>
            <button onClick={handleChangeVisibleOnClick} className="menuContainer__button">
                <img src={XIcon} alt="hide menu" />
            </button>
            <div className="menuContainer__links">
                <Link className={user ? "menuContainer__link-hidden" : "menuContainer__link"} to="/signin">Zaloguj się</Link>
                <Link className={user ? "menuContainer__link-hidden" : "menuContainer__link"} to="/signup">Załóż konto</Link>
                <p onClick={() => dispatch(logout())} className={user ? "menuContainer__link" : "menuContainer__link-hidden"}>Wyloguj się</p>
            </div>
        </div>
    );
}

export default Menu;