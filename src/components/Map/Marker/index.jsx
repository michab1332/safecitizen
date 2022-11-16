import { Marker } from "react-map-gl";

import "./markerItem.css";

const MarkerItem = ({ lon, lat, title, onClick, icon }) => {
    return <Marker longitude={lon} latitude={lat} anchor="bottom">
        <div onClick={onClick} className="markerItem__container">
            <p className="markerItem__text">{title}</p>
            <img src={icon} alt="marker" className="markerItem__icon" />
        </div>
    </Marker>
}

export default MarkerItem;