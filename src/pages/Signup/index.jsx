import React from "react";

import "../Signin/sign.css";

const Signup = () => {
    return (
        <div className="signContainer">
            <form className="signContainer__form">
                <p className="signContainer__text">Załóż konto</p>
                <input type="text" className="signcontainer__input" placeholder="Name" />
                <input type="text" className="signcontainer__input" placeholder="E-mail" />
                <input type="password" className="signcontainer__input" placeholder="Password" />
                <button className="signContainer__button">Załóż konto</button>
            </form>
        </div>
    )
}

export default Signup;