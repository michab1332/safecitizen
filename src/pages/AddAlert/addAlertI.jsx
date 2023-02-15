import React from "react";
import DateUtils from "../../utils/dateUtils"
import { useSelector } from "react-redux";
import useGeoLocationUserPlace from "../../hooks/useGeoLocationUserPlace";
import { useNavigate } from "react-router-dom";

import "./addAlert.css";

export default function AddAlertI() {
    const [state, setState] = React.useState({
        title: null,
        description: null,
        time: null
    });
    const place = useGeoLocationUserPlace();
    const navigate = useNavigate();
    const { user } = useSelector(state => state);

    const setTime = () => {
        setState(prevState => ({
            ...prevState,
            time: DateUtils()
        }));
    }

    const handleHideSearchMenu = (e) => {
        e.preventDefault();
        navigate("/");
    }

    React.useEffect(() => {
        setTime()
    }, [])

    return (
        <div className="addAlertContainer">
            <header className="alertContainer__header">
                <div className="alertContainer__header__wrapper">
                    <p className="alertContainer__place">{place.locationName}</p>
                    <p className="alertContainer__date">{state.time}</p>
                </div>
                <button onClick={handleHideSearchMenu} className="alertContainer__hideAlert">x</button>
            </header>
        </div>
    )
}
