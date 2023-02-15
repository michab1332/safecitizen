import { useState, useEffect } from "react";
import axios from "axios";
import useGeoLocation from "./useGeoLocation";

export default function useGeoLocationUserPlace() {
    const [place, setPlace] = useState({
        loaded: false,
        locationName: ""
    });

    const location = useGeoLocation();

    const getPlaceFromUserLocation = async () => {
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.coordinates.lng},${location.coordinates.lat}.json?access_token=${process.env.REACT_APP_ACCESS_TOKEN}`;
        try {
            const response = await axios.get(endpoint);
            setPlace(({
                loaded: true,
                locationName: `${response.data.features[0].context[1].text}, ${response.data.features[0].text}`
            }));
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getPlaceFromUserLocation();
    }, [location])

    return place;
}