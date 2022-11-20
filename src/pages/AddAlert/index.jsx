import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserLocationStart, getUserLocationSuccess, getUserLocationFailure } from "../../redux/userSlice";
import axios from "axios";

import Header from "../../components/Header";
import MarkerItem from "../../components/Map/Marker";

import MarkerIcon from "../../assets/yourLocation.svg";

import "./addAlert.css";

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function AddAlert() {
    const [state, setState] = useState({
        title: null,
        description: null,
        place: null,
        time: null
    });

    const { user } = useSelector(state => state);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [viewState, setViewState] = useState({
        latitude: user.location.latitude,
        longitude: user.location.longitude,
        zoom: 14,
    })

    const mapRef = useRef();

    const handleOnInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const getPlaceFromUserLocation = async () => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${user.location.longitude},${user.location.latitude}.json?access_token=${process.env.REACT_APP_ACCESS_TOKEN}`;
        try {
            const response = await axios.get(endpoint);
            setState(prevState => ({
                ...prevState,
                place: `${response.data.features[0].context[1].text}, ${response.data.features[0].text}`
            }));
        } catch (err) {
            console.log(err)
        }
    }

    const setTime = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const minutes = date.getMinutes();
        const hours = date.getHours();
        setState(prevState => ({
            ...prevState,
            time: `${day} ${month} ${year}, ${hours}:${minutes}`
        }));
    }

    const handleCreateNewAlert = async (e) => {
        e.preventDefault();
        if (state.title && state.description) {
            try {
                const response = await axios.post("/alert/add", {
                    title: state.title,
                    description: state.description,
                    location: {
                        place: state.place,
                        longitude: user.location.longitude,
                        latitude: user.location.latitude
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

    useEffect(() => {
        getPlaceFromUserLocation();
        setTime();
    }, [])

    // const setUserLocationFromGeolocation = () => {
    //     dispatch(getUserLocationStart());
    //     try {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             const { longitude, latitude } = position.coords;
    //             dispatch(getUserLocationSuccess({ longitude: longitude, latitude: latitude }));
    //         });
    //     } catch (err) {
    //         dispatch(getUserLocationFailure(err));
    //     }
    // }

    return (
        <div className="addAlertContainer">
            <Header />
            <div className="addAlertContainer__map">
                <Map
                    {...viewState}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    mapboxAccessToken={ACCESS_TOKEN}
                    onMove={evt => setViewState(evt.viewState)}
                    ref={mapRef}>
                    {user.location ? <MarkerItem icon={MarkerIcon} lat={user.location.latitude} lon={user.location.longitude} /> : null}
                </Map>
            </div>
            <div className="addAlertContainer__text">
                <p className="addAlertContainer__place">{state.place}</p>
                <p className="addAlertContainer__date">{state.time}</p>
            </div>
            <form className="addAlertContainer__form">
                <input onChange={handleOnInputChange} type="text" className="addAlertContainer__input" placeholder="Tytuł" name="title" />
                <textarea onChange={handleOnInputChange} className="addAlertContainer__textArea" placeholder="Opis" name="description" cols="30" rows="10"></textarea>
                <button onClick={handleCreateNewAlert} className="addAlertContainer__button">Dodaj zgłoszenie</button>
            </form>
        </div>
    )
}
