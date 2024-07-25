import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import NavBar from "../components/NavBar";
import FooterBar from "../components/FooterBar";

export default function Layout() {
    return (
        <AuthProvider>
            <div
                className={`hero is-fullheight is-flex is-flex-direction-column`}
            >
                <NavBar appName={"Top Forry"} />
                <div className={`container`}>
                    <Outlet />
                </div>
                <FooterBar
                    appName={"Top Forry"}
                    socialNetworks={[
                        { name: "facebook", url: "https://facebook.com" },
                        { name: "twitter", url: "https://twitter.com" },
                        { name: "instagram", url: "https://instagram.com" },
                    ]}
                />
            </div>
        </AuthProvider>
    );
}
