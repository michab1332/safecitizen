import {
  Routes,
  Route
} from "react-router-dom";
import { useSelector } from "react-redux";

import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AddAlert from "./pages/AddAlert";
import AddAlertI from "./pages/AddAlert/addAlertI";
import Alert from "./pages/Alert";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useSelector(state => state);
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/addAlert" element={<ProtectedRoute user={user}>
          <AddAlertI />
        </ProtectedRoute>} />
        <Route path="/alert/:id" element={<Alert />} />
      </Route>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App