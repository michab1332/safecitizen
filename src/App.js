import {
  Routes,
  Route
} from "react-router-dom";

import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AddAlert from "./pages/AddAlert";
import AddAlertI from "./pages/AddAlert/addAlertI";
import Alert from "./pages/Alert";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/addAlert" element={<AddAlertI />} />
        <Route path="/alert" element={<Alert />} />
      </Route>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App