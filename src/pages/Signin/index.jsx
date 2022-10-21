import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

import "./sign.css";

const Signin = () => {
    const [state, setState] = useState({
        name: "",
        password: ""
    });
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const navigate = useNavigate();

    const handleOnInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const handleSignin = (e) => {
        e.preventDefault();
        dispatch(loginStart());
        axios.post("http://localhost:8800/api/auth/signin", {
            name: state.name,
            password: state.password
        }).then((response) => {
            dispatch(loginSuccess(response.data));
        }).catch(err => {
            dispatch(loginFailure());
        });
    }

    useEffect(() => {
        if (user !== null) {
            navigate("/");
        }
    }, [user]);

    return (
        <div className="signContainer">
            <form className="signContainer__form" onSubmit={handleSignin}>
                <p className="signContainer__text">Zaloguj się</p>
                <input onChange={handleOnInputChange} type="text" className="signcontainer__input" placeholder="Name" name="name" />
                <input onChange={handleOnInputChange} type="password" className="signcontainer__input" placeholder="Password" name="password" />
                <button className="signContainer__button">Zaloguj się</button>
            </form>
        </div>
    )
}

export default Signin;