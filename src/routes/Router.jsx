import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "./Layout";
import Home from "../pages/Home";
import Albums from "../pages/Albums";
import ProtectedRoute from "./ProtectedRoute"; 
import Profile from "../pages/Profile";

const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                index: true, 
                path: "/",
                element: <Home />,
            },
            {
                path: "/albums",
                element: (
                    <ProtectedRoute>
                        <Albums />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default Router;
