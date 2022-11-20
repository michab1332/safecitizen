import { useState, useEffect, useRef } from "react";
import Map from "react-map-gl";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import useSupercluster from "use-supercluster";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserLocationStart, getUserLocationSuccess, getUserLocationFailure } from "../../redux/userSlice";

import Header from "../../components/Header";
import SearchModel from "../../components/Map/SearchModel";
import MarkerItem from "../../components/Map/Marker";
import MarkerCluster from "../../components/Map/Marker/MarkerCluster";
import PopupModal from "../../components/Map/Popup";
import InfoModal from "../../components/InfoModal";

import MarkerIcon from "../../assets/markerIcon.svg";
import MarkerLocationIcon from "../../assets/locationOnHomeMap.svg";

import "./home.css";

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

    const navigate = useNavigate();

    const { user } = useSelector(state => state);

    const dispatch = useDispatch();

    const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

    const { clusters, supercluster } = useSupercluster({
        points,
        zoom: viewState.zoom,
        bounds,
        options: { radius: 75, maxZoom: 20 }
    })

    const handleAddAlertOnClick = (e) => {
        e.preventDefault();
        if (user.location) {
            mapRef.current?.flyTo({ center: [user.location?.longitude, user.location?.latitude], duration: 1500, zoom: 12 });
        }
        navigate("/addAlert");
    }

    const handleOnItemClick = (data) => {
        setCurrentCity(data);
    }

    const setUserLocationFromGeolocation = () => {
        dispatch(getUserLocationStart());
        try {
            navigator.geolocation.getCurrentPosition((position) => {
                const { longitude, latitude } = position.coords;
                dispatch(getUserLocationSuccess({ longitude: longitude, latitude: latitude }));
            });
        } catch (err) {
            dispatch(getUserLocationFailure(err));
        }
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
        if (user?.location) {
            mapRef.current?.flyTo({ center: [user.location.longitude, user.location.latitude], duration: 1500, zoom: 12 });
        }
    }, [user.location])

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

            {user.location?.latitude && <MarkerItem lon={user.location.longitude} lat={user.location.latitude} title="Twoja lokalizacja" icon={MarkerLocationIcon} />}

        </Map>

        {user.user && (<button onClick={handleAddAlertOnClick} className="homeContainer__addAlertButton">Dodaj zgłoszenie</button>)}

        <SearchModel handleOnItemClick={handleOnItemClick} handleOnLocationButtonClick={handleOnLocationButtonClick} />
    </div>
}
export default Home;