import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../Signin/sign.css";

const Signup = () => {
    const [state, setState] = useState({
        name: "",
        password: "",
        email: ""
    });
    const navigate = useNavigate();

    const handleOnInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const handleOnSignup = (e) => {
        e.preventDefault();
        console.log(state)
        axios.post("/auth/signup", {
            name: state.name,
            password: state.password,
            email: state.email
        }).then((response) => {
            navigate("/signin");
        }).catch(err => {
            console.log(err)
        });
    }

    return (
        <div className="signContainer">
            <form className="signContainer__form" onSubmit={handleOnSignup}>
                <p className="signContainer__text">Załóż konto</p>
                <input type="text" onChange={handleOnInputChange} className="signcontainer__input" placeholder="Name" name="name" />
                <input type="email" onChange={handleOnInputChange} className="signcontainer__input" placeholder="E-mail" name="email" />
                <input type="password" onChange={handleOnInputChange} className="signcontainer__input" placeholder="Password" name="password" />
                <button className="signContainer__button">Załóż konto</button>
            </form>
        </div>
    )
}

export default Signup;