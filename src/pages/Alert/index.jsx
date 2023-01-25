import useGetAlert from "../../hooks/useGetAlert";
import dateUtils from "../../utils/dateUtils";

import "./alert.css";

const AlertI = () => {
    const alert = useGetAlert();
    const { data, loading, error } = alert;
    return (
        <div className="alertContainer">
            <header className="alertContainer__header">
                <p className="alertContainer__place">{data.location?.place}</p>
                <p className="alertContainer__date">{dateUtils(data.updatedAt)}</p>
            </header>
            <section className="alertContainer__mainInfo">
                <p className="alertContainer__title">{data.title}</p>
                <p className="alertContainer__desc">{data.description}</p>
            </section>
        </div>
    )
}

export default AlertI;