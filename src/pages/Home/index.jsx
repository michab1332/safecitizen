import { useState, useEffect } from "react";
import Map from "react-map-gl";

import "./home.css";

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const Home = () => {
    const [viewState, setViewState] = useState({
        latitude: 37.8,
        longitude: -122.4,
        zoom: 14,
    })

    return <div style={{ width: "100vw", height: "100vh" }}>
        <Map
            {...viewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={ACCESS_TOKEN}
        />
    </div>
}

export default Home;