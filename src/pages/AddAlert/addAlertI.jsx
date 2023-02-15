import React from "react";
import DateUtils from "../../utils/dateUtils"
import { useSelector } from "react-redux";
import useGeoLocationUserPlace from "../../hooks/useGeoLocationUserPlace";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

    const handleOnInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const handleOnButtonClick = (e) => {
        e.preventDefault();
        if (state.title && state.description && place.loaded === true) {
            handleCreateNewAlert();
            return;
        }
        console.log("wpisz cos")
    }

    const handleCreateNewAlert = async () => {
        if (state.title && state.description && place.loaded === true) {
            try {
                const response = await axios.post("/alert/add", {
                    title: state.title,
                    description: state.description,
                    location: {
                        place: place.locationName,
                        longitude: place.coordinates.lng,
                        latitude: place.coordinates.lat
                    },
                    userId: user.user._id
                })
                navigate("/");
            } catch (err) {
                console.log(err)
            }
        } else {
            console.log("wpisz cos")
        }
    }

    React.useEffect(() => {
        setTime()
    }, [])

    return (
        <div className="addAlertContainer">
            <header className="addAlertContainer__header">
                <div className="addAlertContainer__header__wrapper">
                    <p className="addAlertContainer__place">{place.locationName}</p>
                    <p className="addAlertContainer__date">{state.time}</p>
                </div>
                <button onClick={handleHideSearchMenu} className="alertContainer__hideAlert">x</button>
            </header>
            <form className="addAlertContainer__form">
                <input onChange={handleOnInputChange} type="text" className="addAlertContainer__title" placeholder="Tytuł" name="title" />
                <textarea onChange={handleOnInputChange} rows="5" type="text" className="addAlertContainer__desc" placeholder="Opis sytuacji" name="description" />
                <button onClick={handleOnButtonClick} className="addAlertContainer__button">Dodaj zgłoszenie</button>
            </form>
        </div>
    )
}
