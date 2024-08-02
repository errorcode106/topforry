import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import Layout from "./Layout";
import Inicio from "../components/Inicio";
import Listado from "../components/Listado";
import ProtectedRoute from "./ProtectedRoute"; 
import Profile from "../components/Profile";

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
                element: <Inicio />,
            },
            {
                path: "/listado",
                element: (
                    <ProtectedRoute>
                        <Listado />
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
