import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children }) {
    if (!user.user) {
        return <Navigate to="/signin" replace />;
    }
    return children;
}