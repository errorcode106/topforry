import { Link } from "react-router-dom";

function NavMenu({ items }) {
    return (
        <div className="navbar-menu">
            <div className="navbar-start">
                {items.map((item, index) => (
                    <div key={index} className="navbar-item has-dropdown is-hoverable">
                        <Link className="navbar-link text-decoration-none" to={item.url}>
                            {item.text}
                        </Link>
                        {item.submenu && (
                            <div className="navbar-dropdown">
                                {item.submenu.map((subitem, subindex) => (
                                    <Link key={subindex} className="navbar-item text-decoration-none" to={subitem.url}>
                                        {subitem.text}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NavMenu;
