import appLogo from "../assets/react.svg";
import NavMenu from "./NavMenu";
import { Link } from "react-router-dom";

function NavBar({ appName }) {
    return (
        <header>
            <nav
                className={"navbar "}
                role="navigation"
                aria-label="main navigation"
            >
                <div className="navbar-brand">
                    <div className="columns is-vcentered">
                        <Link className="navbar-item column" to="/">
                            <img src={appLogo} alt="Logo" />
                        </Link>
                        <p className="column">{appName}</p>
                    </div>
                </div>
                <NavMenu
                    items={[
                        { text: "Top Inicio", url: "/" },
                        {
                            text: "Canciones",
                            url: "#",
                            submenu: [
                                { text: "Escuchar Canción", url: "/canciones/list" },
                                { text: "Subir Canción", url: "/canciones/create" },
                                { text: "Modificar Canción", url: "/canciones/update" },
                                { text: "Borrar Canción", url: "/canciones/delete" },
                            ],
                        },
                        { text: "Listado de Canciones", url: "/listado" },
                        { text: "Perfil", url: "/Profile" },
                        { text: "Inicio de Sesión", url: "/login" },
                    ]}
                />
            </nav>
        </header>
    );
}

export default NavBar;
