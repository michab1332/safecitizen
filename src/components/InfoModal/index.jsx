import "./infoModal.css";

const InfoModal = ({ info }) => {
    return (
        <div className="infoModalContainer">
            <p className="infoModalContainer__text">{info}</p>
        </div>
    )
}

export default InfoModal;