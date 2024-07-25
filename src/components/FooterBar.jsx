function FooterBar({ socialNetworks, appName }) {
    const theme = "light"; 

    return (
        <footer className={`footer`}>
            <div className="content has-text-centered">
                {socialNetworks.map((socialNetwork) => (
                    <a
                        key={socialNetwork.name}
                        className="icon"
                        href={socialNetwork.url}
                    >
                        <i
                            className={`fab fa-${socialNetwork.name} ${
                                theme === "light"
                                    ? "has-text-dark"
                                    : "has-text-light"
                            }`}
                        ></i>
                    </a>
                ))}
                <p>
                    &copy; {new Date().getFullYear()} {appName}. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default FooterBar;
