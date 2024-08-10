import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
    return (
        <AuthProvider>
            <div className={`hero is-fullheight is-flex is-flex-direction-column`}>
                <Header />
                <div className={`container flex-grow-1`}>
                    <Outlet />
                </div>
                <Footer
                    menuItems={[
                        { text: 'Álbumes', href: '/albums' },
                        { text: 'Canciones', href: '/songs' },
                        { text: 'Artistas', href: '/artists' },
                        { text: 'Géneros', href: '/genres' },
                        { text: 'Listas de Reproducción', href: '/playlists' },
                        { text: 'API', href: 'https://sandbox.academiadevelopers.com/docs/' },
                    ]}
                    languages={[
                        { value: 'es', label: 'Español (AR)' },
                        { value: 'en', label: 'English (US)' },
                    ]}
                    selectedLanguage="es"
                    onLanguageChange={(e) => console.log(e.target.value)}
                    logoSrc="https://www.edesa.com.ar/wp-content/uploads/2023/11/Edesa-blanco.png"
                    siteName="Top Forry"
                    tagline="Sigue tu música!"
                    socialLinks={[
                        { href: '#', icon: 'faTwitter' },
                        { href: '#', icon: 'faFacebook' },
                        { href: '#', icon: 'faReddit' },
                        { href: '#', icon: 'faInstagram' },
                        { href: '#', icon: 'faYoutube' },
                    ]}
                    year="2024"
                    copyrightText="Todas las marcas comerciales a las que se hace referencia son propiedad de sus respectivos dueños."
                />
            </div>
        </AuthProvider>
    );
}
