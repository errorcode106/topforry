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
                            <img
                                /** lugar para el logo */
                            />
                        </Link>
                        <p className="column">{appName}</p>
                    </div>
                </div>
                <NavMenu
                    items={[
                        { text: "Top Inicio", url: "/" },
                        { text: "Listado de Canciones", url: "/listado" },
                        { text: "Inicio de Sesion", url: "/login" },
                    ]}
                />
                
            </nav>
        </header>
    );
}

export default NavBar;