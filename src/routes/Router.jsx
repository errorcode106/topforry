import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "./Layout";
import Home from "../pages/Home";
import Albums from "../pages/Albums";
import Album from "../pages/Album";
import ProtectedRoute from "./ProtectedRoute"; 
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";

import SongCreateForm from "../components/musicTop/SongCreateForm";
import SongsList from "../components/musicTop/SongsList";
import SongUpdate from "../components/musicTop/SongUpdate";
import SongDelete from "../components/musicTop/SongDelete";

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
            {
                path: "/canciones/list",
                element: (
                    <ProtectedRoute>
                        <SongsList />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/canciones/create",
                element: (
                    <ProtectedRoute>
                        <SongCreateForm />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/canciones/update",
                element: (
                    <ProtectedRoute>
                        <SongUpdate />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/canciones/delete",
                element: (
                    <ProtectedRoute>
                        <SongDelete />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default Router;
