import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login";
import Layout from "./Layout";
import Inicio from "../components/Inicio";
import Listado from "../components/Listado";

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
                element: (
                    
                        <Inicio />
                ),
            },
            {
                path: "/listado",
                element: (
                    
                        <Listado />
                   
                ),
            },
        ],
    },
]);

export default Router;