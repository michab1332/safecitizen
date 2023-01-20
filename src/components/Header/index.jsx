import { useState } from 'react';

import Menu from "./Menu";

import "./header.css";
import Burger from "../../assets/burger.svg";
import Logo from "../../assets/logo.svg";

const Header = () => {

    const [isVisible, setIsVisible] = useState(false);

    const handleChangeVisibleOnClick = (e) => {
        e.preventDefault();
        setIsVisible(prevState => !prevState);
    }

    return (
        <header>
            <div className="header-logo">
                <p className="header-text">SafeCitizen</p>
                <img src={Logo} alt="logo" className="header-logoIcon" />
            </div>
            {/* <div onClick={e => handleChangeVisibleOnClick(e)} className="header-burger">
                    <img src={Burger} alt="burger" />
                </div> */}
            {/* <Menu isVisible={isVisible} handleChangeVisibleOnClick={handleChangeVisibleOnClick} /> */}
        </header>
    )
}

export default Header;