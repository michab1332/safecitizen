import { format } from "timeago.js";
import { Popup } from "react-map-gl";

const PopupModal = ({ data, onClosePopup }) => {
    return <Popup longitude={data.location.longitude} latitude={data.location.latitude}
        anchor="bottom"
        onClose={onClosePopup}>
        u are hereee
    </Popup>
}

export default PopupModal;