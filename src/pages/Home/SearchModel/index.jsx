import { useState, useEffect } from "react";
import axios from "axios";

import SearchIcon from "../../../assets/searchIcon.svg";

import "./searchModel.css";

const Item = ({ data, onClick }) => {
    return <li onClick={() => onClick(data)} className="searchContainer-result">{data.place_name}</li>
}

const SearchModel = ({ handleOnItemClick }) => {
    const [city, setCity] = useState("");
    const [response, setResponse] = useState({
        data: [],
        error: false
    })

    useEffect(() => {
        if (city !== "") {
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${import.meta.env.VITE_ACCESS_TOKEN}`)
                .then(response => {
                    setResponse(prevState => ({
                        ...prevState,
                        data: response.data.features,
                    }));
                })
                .catch(err => {
                    setResponse(prevState => ({
                        ...prevState,
                        error: err
                    }));
                });
        }
    }, [city])

    return (
        <div className="searchContainer">
            <div className="searchContainer-top"></div>
            <form className="searchContainer-form">
                <input value={city} onChange={e => setCity(e.target.value)} type="text" placeholder="search city" className="searchContainer-text" />
                <button className="searchContainer-button">
                    <img src={SearchIcon} alt="search_icon" />
                </button>
            </form>
            <ul className="searchContainer-results">
                {response.data.map(item => {
                    return <Item key={item.id} data={item} onClick={handleOnItemClick} />
                })}
            </ul>
        </div>
    );
}

export default SearchModel;