import { useState } from 'react';

import Menu from "./Menu";

import "./header.css";
import Burger from "../../assets/burger.svg";

const Header = () => {

    const [isVisible, setIsVisible] = useState(false);

    const handleChangeVisibleOnClick = (e) => {
        e.preventDefault();
        setIsVisible(prevState => !prevState);
    }

    return (
        <div className="headerContainer">
            <header>
                <div className="header-logo">
                    <p className="header-text">Safecitizen</p>
                </div>
                <div onClick={e => handleChangeVisibleOnClick(e)} className="header-burger">
                    <img src={Burger} alt="burger" />
                </div>
            </header>
            <Menu isVisible={isVisible} handleChangeVisibleOnClick={handleChangeVisibleOnClick} />
        </div>
    )
}

export default Header;