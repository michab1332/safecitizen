import { useState, useEffect } from "react";
import Map from "react-map-gl";
import SearchModel from "./SearchModel";

import Burger from "../../assets/burger.svg";

import "./home.css";

const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

const Home = () => {
    const [viewState, setViewState] = useState({
        latitude: 53.014611,
        longitude: 18.578888,
        zoom: 12,
    })

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
        />
        <SearchModel />
    </div>
}

export default Home;