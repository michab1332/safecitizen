import React from "react";

import "./sign.css";

const Signin = () => {
    return (
        <div className="signContainer">
            <form className="signContainer__form">
                <p className="signContainer__text">Zaloguj się</p>
                <input type="text" className="signcontainer__input" placeholder="Name" />
                <input type="password" className="signcontainer__input" placeholder="Password" />
                <button className="signContainer__button">Zaloguj się</button>
            </form>
        </div>
    )
}

export default Signin;