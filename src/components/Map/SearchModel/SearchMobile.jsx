import React from 'react';
import { Outlet } from "react-router-dom";

import "./searchModel.css";

export default function SearchMobile({ title, data, isSearchMenuActive, outlet }) {
    return (
        <div className={isSearchMenuActive ? "searchContainer-mobile-active" : "searchContainer-mobile"}>
            {outlet ? <Outlet /> : (<><p className="searchContainer-mobile-title">{title}</p>
                <ul className="searchContainer-mobile-results">
                    {data}
                </ul></>)}
        </div>
    )
}
