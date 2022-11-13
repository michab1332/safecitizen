import { Marker } from "react-map-gl"

import "./markerItem.css";

const MarkerCluster = ({ lon, lat, count, size, onMarkerClusterClick }) => {
    return <Marker onClick={onMarkerClusterClick} longitude={lon} latitude={lat} anchor="bottom">
        <div className="markerCluster" style={{ width: size, height: size }}>
            <p className="markerCluster__text">{count}</p>
        </div>
    </Marker>
}

export default MarkerCluster;