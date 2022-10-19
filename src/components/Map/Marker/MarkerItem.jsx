import { Marker } from "react-map-gl"

import MarkerIcon from "../../../assets/markerIcon.svg";

import "./markerItem.css";

const MarkerItem = ({ lon, lat, title }) => {
    return <Marker longitude={lon} latitude={lat} anchor="bottom">
        <div className="markerItem__container">
            <p className="markerItem__text">{title}</p>
            <img src={MarkerIcon} alt="marker" className="markerItem__icon" />
        </div>
    </Marker>
}

export default MarkerItem;