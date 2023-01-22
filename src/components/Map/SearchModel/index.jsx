import { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";

import LocationIcon from "../../../assets/locationIcon.svg";

import SearchMobile from "./SearchMobile";

import "./searchModel.css";

const Item = ({ data, onClick }) => {
    return <li onClick={() => onClick()} className="searchContainer-result">{data.place_name}</li>
}

const SearchModel = ({ handleOnItemClick, handleOnLocationButtonClick }) => {
    const [city, setCity] = useState("");
    const [response, setResponse] = useState({
        data: [],
        error: false
    })
    const [activeSearchMobileState, setActiveSearchMobileState] = useState({
        searchingCity: false,
        choosingAction: false
    });
    const [isSearchMenuActive, setIsSearchMenuActive] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    function handleOnChangeSearchInput(e) {
        const { value } = e.target;
        setCity(value);
        if (value.length === 0) {
            setIsSearchMenuActive(false)
            setActiveSearchMobileState(prevState => ({
                choosingAction: false,
                searchingCity: false
            }));
            return;
        }
        setIsSearchMenuActive(true);
        setActiveSearchMobileState(...prevState => ({
            choosingAction: false,
            searchingCity: true
        }));
    }

    function handleOnButtonClick(e) {
        e.preventDefault();
        setIsSearchMenuActive(prevState => !prevState);
        setActiveSearchMobileState(prevState => ({
            choosingAction: true,
            searchingCity: false
        }));
    }

    useEffect(() => {
        if (city !== "") {
            axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${process.env.REACT_APP_ACCESS_TOKEN}`)
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

    const responseArrayMapped = response.data.map(item => {
        return <Item key={item.id} data={item} onClick={function () {
            handleOnItemClick(item);
            setIsSearchMenuActive(false);
        }} />
    })

    let searchMobile = null;
    if (activeSearchMobileState.choosingAction) {
        searchMobile = <SearchMobile title="Wybierz akcje" data={responseArrayMapped} />
    } else if (activeSearchMobileState.searchingCity) {
        searchMobile = <SearchMobile title="Wybierz miasto" data={responseArrayMapped} />
    }

    // const displaySearchMobile = () => {
    //     if (isButtonClicked) {
    //         return <SearchMobile title="Wybierz akcje" data={responseArrayMapped} />
    //     }
    //     return <SearchMobile title="Wybierz miasto" data={responseArrayMapped} />
    // }

    return (
        <div className="searchContainer">

            <div className={isSearchMenuActive ? "searchContainer-mobile-active" : "searchContainer-mobile"}>
                {isSearchMenuActive ? searchMobile : null}

                <Outlet />
            </div>

            <form className="searchContainer-form">
                <input value={city} onChange={handleOnChangeSearchInput} type="text" placeholder="search city" className="searchContainer-text" />
                <button onClick={handleOnButtonClick} className="searchContainer-button">
                    <img src={LocationIcon} alt="search_icon" />
                </button>
            </form>
            <ul className="searchContainer-results">
                {responseArrayMapped}
            </ul>
        </div>
    );
}

export default SearchModel;