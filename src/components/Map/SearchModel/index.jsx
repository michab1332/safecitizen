import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
        choosingAction: false,
        isAlert: false
    });
    const [isSearchMenuActive, setIsSearchMenuActive] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const options = [
        {
            name: "Dodaj zgłoszenie",
            action: () => {
                navigate("/addAlert")
            }
        }
    ]

    function handleOnChangeSearchInput(e) {
        const { value } = e.target;
        setCity(value);
        if (value.length === 0) {
            setIsSearchMenuActive(false)
            setActiveSearchMobileState(prevState => ({
                choosingAction: false,
                searchingCity: false,
                isAlert: false
            }));
            return;
        }
        setIsSearchMenuActive(true);
        setActiveSearchMobileState(prevState => ({
            choosingAction: false,
            searchingCity: true,
            isAlert: false
        }));
    }

    function handleOnButtonClick(e) {
        e.preventDefault();
        setIsSearchMenuActive(prevState => !prevState);
        setActiveSearchMobileState(prevState => ({
            choosingAction: true,
            searchingCity: false,
            isAlert: false
        }));
    }

    const getPathName = () => {
        const path = pathname.split("/")[1];
        return path;
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

    useEffect(() => {
        if (getPathName() === "alert") {
            setActiveSearchMobileState(prevState => ({
                choosingAction: false,
                searchingCity: false,
                isAlert: true
            }));
            setIsSearchMenuActive(true);
        }
    }, [pathname])

    const responseArrayMapped = response.data.map(item => {
        return <Item key={item.id} data={item} onClick={function () {
            handleOnItemClick(item);
            setIsSearchMenuActive(false);
        }} />
    })

    const optionsArrayMapped = options.map(item => (
        <li className="searchContainer-result" key={item.name} onClick={item.action}>{item.name}</li>
    ))

    let searchMobile = null;
    if (activeSearchMobileState.choosingAction) {
        searchMobile = <SearchMobile title={"Wybierz akcje"} data={optionsArrayMapped} isSearchMenuActive={isSearchMenuActive} />
    } else if (activeSearchMobileState.searchingCity) {
        searchMobile = <SearchMobile title="Wybierz miasto" data={responseArrayMapped} isSearchMenuActive={isSearchMenuActive} />
    } else if (activeSearchMobileState.isAlert) {
        searchMobile = <SearchMobile title="" data={[]} isSearchMenuActive={isSearchMenuActive} outlet={true} />
    }

    return (
        <div className="searchContainer">

            {searchMobile}

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