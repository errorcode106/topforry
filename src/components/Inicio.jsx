import { useNavigate } from 'react-router-dom';

function Inicio() {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    };
    return (
        <div className="box content has-text-centered is-medium my-6">
            <h2 className="title">Esta es la página de inicio, va a ser 
                publica y tendran un boton para iniciar sesion...</h2>        
            <button className="button is-primary is-fullwidth" onClick={handleLoginClick}>Login</button>
        </div>
    );
}

export default Inicio;
