import React from 'react';

import "./searchModel.css";

export default function SearchMobile({ title, data }) {
    return (
        <div>
            <p className="searchContainer-mobile-title">{title}</p>
            <ul className="searchContainer-mobile-results">
                {data}
            </ul>
        </div>
    )
}
