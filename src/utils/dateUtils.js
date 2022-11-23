export default function dateUtils(optionalDate) {
    const date = optionalDate ? new Date(optionalDate) : new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    return `${day} ${month} ${year}, ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
}