import { Marker } from "react-map-gl"

import "./markerItem.css";

const MarkerCluster = ({ lon, lat, count }) => {
    return <Marker longitude={lon} latitude={lat} anchor="bottom">
        <div className="markerCluster">
            <p className="markerCluster__text">{count}</p>
        </div>
    </Marker>
}

export default MarkerCluster;