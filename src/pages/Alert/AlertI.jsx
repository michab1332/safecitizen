import useGetAlert from "../../hooks/useGetAlert";

const AlertI = () => {
    const alert = useGetAlert();
    const { data, loading, error } = alert;

    return (
        <>
            helooo
        </>
    )
}

export default AlertI;