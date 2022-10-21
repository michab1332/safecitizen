import { useState } from "react";

import "../Signin/sign.css";

const Signup = () => {
    const [state, setState] = useState({
        name: "",
        password: "",
        email: ""
    });

    const handleOnInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }
    return (
        <div className="signContainer">
            <form className="signContainer__form">
                <p className="signContainer__text">Załóż konto</p>
                <input type="text" className="signcontainer__input" placeholder="Name" name="name" />
                <input type="text" className="signcontainer__input" placeholder="E-mail" name="email" />
                <input type="password" className="signcontainer__input" placeholder="Password" name="password" />
                <button className="signContainer__button">Załóż konto</button>
            </form>
        </div>
    )
}

export default Signup;