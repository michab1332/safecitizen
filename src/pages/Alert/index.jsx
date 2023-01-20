import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { DateUtils } from "../../utils";

import Header from "../../components/Header";
import MarkerItem from "../../components/Map/Marker";

import MarkerIcon from "../../assets/yourLocation.svg";

import "../AddAlert/addAlert.css";
import "./alert.css";

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function AddAlert() {
    const { user } = useSelector(state => state);

    const { state } = useLocation();
    //przerob to w taki sposob zeby w linku bylo id alertu i z id pobieralo by informacje o nim - axios
    const [viewState, setViewState] = useState({
        latitude: state.location.latitude,
        longitude: state.location.longitude,
        zoom: 14,
    })

    const mapRef = useRef();

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
                    mapStyle="mapbox://styles/mapbox/dark-v11"
                    mapboxAccessToken={ACCESS_TOKEN}
                    onMove={evt => setViewState(evt.viewState)}
                    ref={mapRef}>
                    {user.location ? <MarkerItem icon={MarkerIcon} lat={user.location.latitude} lon={user.location.longitude} /> : null}
                </Map>
            </div>
            <div className="addAlertContainer__text">
                <p className="addAlertContainer__place">{state.location.place}</p>
                <p className="addAlertContainer__date">{DateUtils(state.createdAt)}</p>
            </div>
            <div className="alertContainer__content">
                <p className="alertContainer__title">{state.title}</p>
                <p className="alertContainer__desc">{state.description}</p>
            </div>
        </div>
    )
}
