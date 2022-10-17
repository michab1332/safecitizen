import React from "react";

import SearchIcon from "../../../assets/searchIcon.svg";

import "./searchModel.css";

const SearchModel = () => {
    return (
        <div className="searchContainer">
            <div className="searchContainer-top"></div>
            <form className="searchContainer-form">
                <input type="text" className="searchContainer-text" />
                <button className="searchContainer-button">
                    <img src={SearchIcon} alt="search_icon" />
                </button>
            </form>
        </div>
    );
}

export default SearchModel;