import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import useGeoLocation from "../../hooks/useGeoLocation";
import { DateUtils } from "../../utils";

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
    const location = useGeoLocation();

    const { user } = useSelector(state => state);

    const navigate = useNavigate();

    const [viewState, setViewState] = useState({
        latitude: 53.012918,
        longitude: 18.593554,
        zoom: 12,
    })

    const mapRef = useRef();

    const handleOnInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const getPlaceFromUserLocation = async () => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.coordinates.lng},${location.coordinates.lat}.json?access_token=${process.env.REACT_APP_ACCESS_TOKEN}`;
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
        setState(prevState => ({
            ...prevState,
            time: DateUtils()
        }));
    }

    const handleCreateNewAlert = async (e) => {
        e.preventDefault();
        if (state.title && state.description && location.loaded === true) {
            try {
                const response = await axios.post("/alert/add", {
                    title: state.title,
                    description: state.description,
                    location: {
                        place: state.place,
                        longitude: location.coordinates.lng,
                        latitude: location.coordinates.lat
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
        if (location.loaded) {
            getPlaceFromUserLocation();
            mapRef.current?.flyTo({ center: [location.coordinates.lng, location.coordinates.lat], duration: 1500, zoom: 12 });
        }
        setTime();
    }, [location.loaded])

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
                    {location.loaded ? <MarkerItem icon={MarkerIcon} lat={location.coordinates.lat} lon={location.coordinates.lng} /> : null}
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
