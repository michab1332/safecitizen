import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import useSupercluster from "use-supercluster";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import SearchModel from "../../components/Map/SearchModel";
import MarkerItem from "../../components/Map/Marker";
import MarkerCluster from "../../components/Map/Marker/MarkerCluster";
import PopupModal from "../../components/Map/Popup";
import NewAlertModal from "../../components/Map/NewAlertModal";
import InfoModal from "../../components/InfoModal";

import MarkerIcon from "../../assets/markerIcon.svg";
import MarkerLocationIcon from "../../assets/yourLocation.svg";

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
    const [isAddAlertButtonClicked, setIsAddAlertButtonClicked] = useState(false);
    const [userLocation, setUserLocation] = useState({});

    const navigate = useNavigate();

    const { user } = useSelector(state => state.user);

    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

    const { clusters, supercluster } = useSupercluster({
        points,
        zoom: viewState.zoom,
        bounds,
        options: { radius: 75, maxZoom: 20 }
    })

    const handleAddAlertOnClick = (e) => {
        e.preventDefault();
        if (userLocation) {
            mapRef.current?.flyTo({ center: [userLocation?.longitude, userLocation?.latitude], duration: 1500, zoom: 12 });
        }
        navigate("/addAlert");
        setIsAddAlertButtonClicked(prevState => !prevState);
    }

    const handleOnItemClick = (data) => {
        setCurrentCity(data);
    }

    const setUserLocationFromGeolocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { longitude, latitude } = position.coords;
            setUserLocation({
                latitude,
                longitude
            });
        });
    }

    const handleOnLocationButtonClick = (e) => {
        e.preventDefault();
        setUserLocationFromGeolocation();
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
        mapRef.current?.flyTo({ center: [currentCity?.center[0], currentCity?.center[1]], duration: 1500, zoom: 12 });
    }, [currentCity]);

    useEffect(() => {
        getAlerts();
    }, [])

    useEffect(() => {
        setUserLocationFromGeolocation();
    }, [])

    useEffect(() => {
        if (userLocation) {
            mapRef.current?.flyTo({ center: [userLocation?.longitude, userLocation?.latitude], duration: 1500, zoom: 12 });
        }
    }, [userLocation])

    return <div className="homeContainer">
        <Header />
        <Map
            {...viewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={ACCESS_TOKEN}
            ref={mapRef}
        >

            {
                clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const {
                        cluster: isCluster,
                        point_count: pointCount
                    } = cluster.properties;

                    if (isCluster) {
                        const size = `${20 + (pointCount / points.length) * 20}px`;
                        const onMarkerClusterClick = () => {
                            const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                            mapRef.current?.flyTo({ center: [longitude, latitude], duration: 1500, zoom: expansionZoom });
                        }

                        return (
                            <MarkerCluster key={cluster.id} onMarkerClusterClick={onMarkerClusterClick} size={size} lat={latitude} lon={longitude} count={pointCount} />
                        );
                    }

                    return (
                        <MarkerItem key={cluster.properties.alertId} onClick={() => handleSetCurrentAlertOnMarkerClick(cluster.properties.data)} title={cluster.properties.data.title} lon={cluster.properties.data.location.longitude} lat={cluster.properties.data.location.latitude} icon={MarkerIcon} />
                    )
                })
            }

            {
                showPopup && (
                    <PopupModal data={currentAlert} onClosePopup={onClosePopup} />
                )
            }

            {userLocation.latitude && <MarkerItem lon={userLocation.longitude} lat={userLocation.latitude} title="Twoja lokalizacja" icon={MarkerLocationIcon} />}

        </Map>
        {user && (<button onClick={handleAddAlertOnClick} className="homeContainer__addAlertButton">{isAddAlertButtonClicked ? "Cofnij" : "Dodaj zgłoszenie"}</button>)}
        {user && isAddAlertButtonClicked ? (userLocation.latitude && <NewAlertModal handleCloseAfterCreate={handleAddAlertOnClick} userId={user._id} location={userLocation} />) : null}
        {isAddAlertButtonClicked && <InfoModal info="Zgłoszenie zostanie dodane w miejscu twojej lokalizacji" />}

        <SearchModel handleOnItemClick={handleOnItemClick} handleOnLocationButtonClick={handleOnLocationButtonClick} />
    </div>
}
export default Home;