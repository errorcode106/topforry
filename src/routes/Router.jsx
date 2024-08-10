import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Layout from "./Layout";
import Home from "../pages/Home";
import Albums from "../pages/Albums";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../pages/Profile";
import SongCreateForm from "../components/musicTop/SongCreateForm";
import SongsList from "../components/musicTop/SongsList";
import SongUpdate from "../components/musicTop/SongUpdate";
import SongDelete from "../components/musicTop/SongDelete";

const Router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                index: true, // path: "/"
                element: <Home />,
            },
            {
                path: "/listado",
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
