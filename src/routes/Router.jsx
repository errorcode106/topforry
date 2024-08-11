import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "./Layout";
import Home from "../pages/Home";
import Albums from "../pages/Albums";
import Album from "../pages/Album";
import ProtectedRoute from "./ProtectedRoute"; 
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";

const Router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
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
                path: "/album/:id",
                element: (
                    <ProtectedRoute>
                        <Album />
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
