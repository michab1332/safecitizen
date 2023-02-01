import useGetAlert from "../../hooks/useGetAlert";
import dateUtils from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

import "./alert.css";

const AlertI = () => {
    const alert = useGetAlert();
    const { data, loading, error } = alert;
    const navigate = useNavigate();
    return (
        <div className="alertContainer" onClick={() => navigate("/")}>
            <header className="alertContainer__header">
                <div className="alertContainer__header__wrapper">
                    <p className="alertContainer__place">{data.location?.place}</p>
                    <p className="alertContainer__date">{dateUtils(data.updatedAt)}</p>
                </div>
                <button className="alertContainer__hideAlert">x</button>
            </header>
            <section className="alertContainer__mainInfo">
                <p className="alertContainer__title">{data.title}</p>
                <p className="alertContainer__desc">{data.description}</p>
            </section>
        </div>
    )
}

export default AlertI;