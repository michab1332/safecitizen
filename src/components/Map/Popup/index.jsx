import { format } from "timeago.js";
import { Popup } from "react-map-gl";

import "./popup.css";

const PopupModal = ({ data, onClosePopup }) => {
    const { title, description, img, createdAt, location } = data;
    return <Popup offset={30} longitude={location.longitude} latitude={location.latitude}
        anchor="bottom"
        onClose={onClosePopup}>
        <div className="popupContainer">
            <div className="popupContainer__adress">
                <p className="popupContainer__adressName">{location.adress}</p>
                <p className="popupContainer__createdAt">{format(createdAt)}</p>
            </div>
            <p className="popupContainer__title">{title}</p>
            <p className="popupContainer__description">{description}</p>
        </div>
    </Popup>
}

export default PopupModal;