import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";

import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <Signin />
  },
  {
    path: "/signup",
    element: <Signup />
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App