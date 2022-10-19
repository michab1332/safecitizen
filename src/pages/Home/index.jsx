import { useState, useEffect } from "react";
import Map from "react-map-gl";
import axios from "axios";

import SearchModel from "../../components/Map/SearchModel";
import MarkerItem from "../../components/Map/Marker";
import PopupModal from "../../components/Map/Popup";

import Burger from "../../assets/burger.svg";

import "./home.css";

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const Home = () => {
    const [viewState, setViewState] = useState({
        latitude: 53.012918,
        longitude: 18.593554,
        zoom: 12,
    })
    const [alerts, setAlerts] = useState({
        loading: true,
        data: [],
    });
    const [currentCity, setCurrentCity] = useState({});
    const [currentAlert, setCurrentAlert] = useState({});
    const [showPopup, setShowPopup] = useState(false);

    const handleOnItemClick = (data) => {
        setCurrentCity(data);
    }

    const handleOnLocationButtonClick = (e) => {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition((position) => {
            setViewState(prevState => ({
                ...prevState,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }))
        });
    }

    const getAlerts = () => {
        axios.get("http://localhost:8800/api/alert/all")
            .then(response => {
                setAlerts({
                    loading: false,
                    data: response.data
                });
            })
            .catch(err => { throw err })
    }

    const handleSetCurrentAlertOnMarkerClick = (alert) => {
        setCurrentAlert(alert);
    }

    const onClosePopup = () => {
        setCurrentAlert({});
        setShowPopup(false);
    }

    useEffect(() => {
        if (Object.keys(currentAlert).length !== 0) {
            setShowPopup(true);
        }
    }, [currentAlert])

    useEffect(() => {
        if (Object.keys(currentCity).length !== 0) {
            setViewState(prevState => ({
                ...prevState,
                latitude: currentCity.center[1],
                longitude: currentCity.center[0]
            }))
        }
    }, [currentCity]);

    useEffect(() => {
        getAlerts();
    }, [])

    return <div className="homeContainer">
        <header>
            <div className="header-logo">
                <p className="header-text">Safecitizen</p>
            </div>
            <div className="header-burger">
                <img src={Burger} alt="burger" />
            </div>
        </header>
        <Map
            {...viewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={ACCESS_TOKEN}
        >
            {[...alerts.data].map(item => (
                <MarkerItem key={item._id} onClick={() => handleSetCurrentAlertOnMarkerClick(item)} title={item.title} lon={item.location.longitude} lat={item.location.latitude} />
            ))}
            {
                showPopup && (
                    <PopupModal data={currentAlert} onClosePopup={onClosePopup} />
                )
            }
        </Map>
        <SearchModel handleOnItemClick={handleOnItemClick} handleOnLocationButtonClick={handleOnLocationButtonClick} />
    </div>
}

export default Home;