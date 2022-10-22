import { useState, useEffect } from "react";
import Map from "react-map-gl";
import axios from "axios";

import SearchModel from "../../components/Map/SearchModel";
import MarkerItem from "../../components/Map/Marker";
import PopupModal from "../../components/Map/Popup";
import Menu from "./menu";
import NewAlertModal from "../../components/Map/NewAlertModal";

import Burger from "../../assets/burger.svg";

import "./home.css";
import { useSelector } from "react-redux";

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
    const [isVisible, setIsVisible] = useState(false);
    const [isAddAlertButtonClicked, setIsAddAlertButtonClicked] = useState(false);
    const [newAlert, setNewAlert] = useState({
        location: null,
    });
    const { user } = useSelector(state => state.user);

    const handleAddAlertButtonOnClick = (e) => {
        e.preventDefault();
        setIsAddAlertButtonClicked(prevState => !prevState);
    }

    const handleOnMapClick = (e) => {
        setNewAlert(prevState => ({
            location: {
                latitude: e.lngLat.lat,
                longitude: e.lngLat.lng
            }
        }));
    }

    useEffect(() => {
        if (!isAddAlertButtonClicked) {
            setNewAlert({
                location: null,
            });
        }
    }, [isAddAlertButtonClicked]);

    const handleChangeVisibleOnClick = (e) => {
        e.preventDefault();
        setIsVisible(prevState => !prevState);
    }

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
        axios.get("/alert/all")
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
            <div onClick={e => handleChangeVisibleOnClick(e)} className="header-burger">
                <img src={Burger} alt="burger" />
            </div>
        </header>
        <Map
            {...viewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={ACCESS_TOKEN}
            onClick={isAddAlertButtonClicked ? handleOnMapClick : null}
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
        {user && (<button onClick={handleAddAlertButtonOnClick} className="homeContainer__addAlertButton">{isAddAlertButtonClicked ? "Cofnij" : "Dodaj zgłoszenie"}</button>)}
        {user ? (newAlert.location && <NewAlertModal userId={user._id} location={newAlert.location} />) : null}

        <SearchModel handleOnItemClick={handleOnItemClick} handleOnLocationButtonClick={handleOnLocationButtonClick} />
        <Menu isVisible={isVisible} handleChangeVisibleOnClick={handleChangeVisibleOnClick} />
    </div>
}

export default Home;