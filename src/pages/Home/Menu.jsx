import { Link } from "react-router-dom";

import XIcon from "../../assets/xIcon.svg";

import "./menu.css";

const Menu = ({ isVisible, handleChangeVisibleOnClick }) => {
    return (
        <div className={isVisible ? "menuContainer" : "menuContainer-hidden"}>
            <button onClick={handleChangeVisibleOnClick} className="menuContainer__button">
                <img src={XIcon} alt="hide menu" />
            </button>
            <div className="menuContainer__links">
                <Link className="menuContainer__link" to="/signin">Zaloguj się</Link>
                <Link className="menuContainer__link" to="/signup">Załóż konto</Link>
            </div>
        </div>
    );
}

export default Menu;