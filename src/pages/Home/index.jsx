import { useState, useEffect, useRef } from "react";
import Map, { Marker } from "react-map-gl";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import useSupercluster from "use-supercluster";


import SearchModel from "../../components/Map/SearchModel";
import MarkerItem from "../../components/Map/Marker";
import MarkerCluster from "../../components/Map/Marker/MarkerCluster";
import PopupModal from "../../components/Map/Popup";
import Menu from "./Menu";
import NewAlertModal from "../../components/Map/NewAlertModal";
import InfoModal from "../../components/InfoModal";

import Burger from "../../assets/burger.svg";

import "./home.css";
import { useSelector } from "react-redux";

const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Home = () => {
    const mapRef = useRef();
    const [viewState, setViewState] = useState({
        latitude: 53.012918,
        longitude: 18.593554,
        zoom: 12,
    })
    const [alerts, setAlerts] = useState({
        loading: true,
        data: [],
    });
    const points = alerts.data.map(alert => ({
        type: "Feature",
        properties: {
            cluster: false,
            alertId: alert._id,
            data: alert,
            category: "anti-socail-behaviour"
        },
        geometry: {
            type: "Point",
            coordinates: [alert.location.longitude, alert.location.latitude]
        }
    }));
    const [currentCity, setCurrentCity] = useState({});
    const [currentAlert, setCurrentAlert] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAddAlertButtonClicked, setIsAddAlertButtonClicked] = useState(false);
    const [newAlert, setNewAlert] = useState({
        location: null,
    });
    const { user } = useSelector(state => state.user);

    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

    const { clusters } = useSupercluster({
        points,
        zoom: viewState.zoom,
        bounds,
        options: { radius: 75, maxZoom: 20 }
    })

    const handleAddAlertOnClick = (e) => {
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
        if (!isAddAlertButtonClicked) {
            setNewAlert({
                location: null,
            });
        }
    }, [isAddAlertButtonClicked]);

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

    useEffect(() => {
        console.log(alerts)
    }, [alerts])

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
            ref={mapRef}
        >
            {/* {[...alerts.data].map(item => (
                <MarkerItem key={item._id} onClick={() => handleSetCurrentAlertOnMarkerClick(item)} title={item.title} lon={item.location.longitude} lat={item.location.latitude} />
            ))} */}
            {
                clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const {
                        cluster: isCluster,
                        point_count: pointCount
                    } = cluster.properties;

                    if (isCluster) {
                        return (
                            <MarkerCluster key={cluster.id} lat={latitude} lon={longitude} count={pointCount} />
                        );
                    }

                    return (
                        <MarkerItem key={cluster.properties.alertId} onClick={() => handleSetCurrentAlertOnMarkerClick(cluster.properties.data)} title={cluster.properties.data.title} lon={cluster.properties.data.location.longitude} lat={cluster.properties.data.location.latitude} />
                    )
                })
            }
            {
                showPopup && (
                    <PopupModal data={currentAlert} onClosePopup={onClosePopup} />
                )
            }
        </Map>
        {user && (<button onClick={handleAddAlertOnClick} className="homeContainer__addAlertButton">{isAddAlertButtonClicked ? "Cofnij" : "Dodaj zgłoszenie"}</button>)}
        {user ? (newAlert.location && <NewAlertModal handleCloseAfterCreate={handleAddAlertOnClick} userId={user._id} location={newAlert.location} />) : null}
        {isAddAlertButtonClicked && <InfoModal info="Klinkij w miejsce zgłoszenia" />}


        <SearchModel handleOnItemClick={handleOnItemClick} handleOnLocationButtonClick={handleOnLocationButtonClick} />
        <Menu isVisible={isVisible} handleChangeVisibleOnClick={handleChangeVisibleOnClick} />
    </div>
}

export default Home;