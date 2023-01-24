import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const useGetAlert = () => {
    const { id } = useParams();

    const [alert, setAlert] = useState({
        data: [],
        loading: true,
        error: null
    });

    const getAlert = async (id) => {
        const response = await axios.get(`http://localhost:8800/api/alert/${id}`);
        setAlert(prevState => ({
            ...prevState,
            loading: false,
            data: response.data
        }));
    }

    useEffect(() => {
        try {
            getAlert(id);
        } catch (error) {
            setAlert(prevState => ({
                ...prevState,
                error
            }));
        }
    }, [id])

    return alert;
}

export default useGetAlert;