import { useState } from "react";
import axios from "axios";
import "./newAlertModal.css";

const NewAlertModal = ({ location, userId }) => {
    const [state, setState] = useState({
        title: null,
        description: null
    });

    const handleOnInputChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const handleCreateNewAlert = async (e) => {
        e.preventDefault();
        const res = await axios.post("/alert/add", {
            title: state.title,
            description: state.description,
            location: location,
            userId: userId
        })
        console.log(res)
    }

    return (
        <div className="newAlertModalContainer">
            <p className="newAlertModalContainer__text">Dodaj nowe zgłoszenie</p>
            <form className="newAlertModalContainer__form" onSubmit={handleCreateNewAlert}>
                <input type="text" onChange={handleOnInputChange} className="newAlertModalContainer__input" placeholder="Tytuł" name="title" />
                <input type="text" onChange={handleOnInputChange} className="newAlertModalContainer__input" placeholder="Opis sytuacji" name="description" />
                <button className="newAlertModalContainer__button">Dodaj</button>
            </form>
        </div>
    );
}

export default NewAlertModal;