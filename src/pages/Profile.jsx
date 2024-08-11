import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEnvelope, faCalendar, faInfoCircle, faTag, faSave } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userStates, setUserStates] = useState([]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            setError('No se encontró el token de autenticación.');
            setLoading(false);
            return;
        }

        const fetchProfileData = async () => {
            try {
                const profileResponse = await fetch('https://sandbox.academiadevelopers.com/users/profiles/profile_data/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`,
                    },
                });

                if (!profileResponse.ok) {
                    throw new Error('Error al obtener los datos del perfil.');
                }

                const profile = await profileResponse.json();
                setProfileData(profile);

                const statesResponse = await fetch('https://sandbox.academiadevelopers.com/users/user-states/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`,
                    },
                });

                if (!statesResponse.ok) {
                    throw new Error('Error al obtener los estados de usuario.');
                }

                const states = await statesResponse.json();
                setUserStates(states.results);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return (
            <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger mt-5 text-center">{error}</div>;
    }

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = () => {
        const authToken = localStorage.getItem('authToken');
        const userId = Number(profileData.user__id);

        const apiUrl = `https://sandbox.academiadevelopers.com/users/profiles/${userId}/`;

        fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`,
            },
            body: JSON.stringify({
                ...profileData,
                state: profileData.state.id,
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        console.error('Error response from server:', errData);
                        throw new Error('Error al guardar los datos del perfil.');
                    });
                }
                return response.json();
            })
            .then(data => {
                setProfileData(data);
                setIsEditing(false);
            })
            .catch(err => {
                setError(err.message);
            });
    };

    const handleChange = (e) => {
        if (e.target.name === "state") {
            const selectedState = userStates.find(state => state.id === parseInt(e.target.value));
            setProfileData({
                ...profileData,
                state: selectedState
            });
        } else {
            setProfileData({
                ...profileData,
                [e.target.name]: e.target.value
            });
        }
    };

    return (
        <section className="bg-light m-5">
            <div className="container-fluid">
                <div className="row">
                    <article className="card shadow-sm">
                        <div className="card-body">
                            {/* Header */}
                            <div className="d-flex align-items-center mb-4">
                                {/* Profile image */}
                                <div className="me-3">
                                    {profileData.image ? (
                                        <img
                                            className="img-thumbnail border-0 rounded-circle img-sm"
                                            src={profileData.image}
                                            alt="Imagen de Perfil"
                                            height="60"
                                            width="60"
                                        />
                                    ) : (
                                        <img
                                            className="img-thumbnail border-0 rounded-circle img-sm"
                                            src="https://media.istockphoto.com/id/1327592449/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=yqoos7g9jmufJhfkbQsk-mdhKEsih6Di4WZ66t_ib7I="
                                            alt="Imagen de Perfil"
                                            height="60"
                                            width="60"
                                        />
                                    )}
                                </div>
                                {/* Basic info */}
                                <div className="me-3">
                                    <h3 className="title m-0" style={{ color: '#4341B2' }}>
                                        {profileData.first_name} {profileData.last_name}
                                        <span style={{ color: '#A0A0A0' }}>
                                            {` #${profileData.user__id}:${profileData.username}`}
                                        </span>
                                    </h3>
                                    <div className="d-md-flex">
                                        <p className="m-0 me-2">
                                            <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: '#A0A0A0' }} />
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                profileData.email
                                            )}
                                        </p>
                                        <p className="m-0">
                                            <FontAwesomeIcon icon={faCalendar} className="me-2" style={{ color: '#A0A0A0' }} />
                                            Fecha de Nacimiento: {isEditing ? (
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={profileData.dob || ''}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                profileData.dob ? profileData.dob : 'No especificada'
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {/* Edit - Global */}
                                <div className="ms-auto">
                                    {isEditing ? (
                                        <a href="#" className="px-2" onClick={handleSaveProfile}>
                                            <FontAwesomeIcon icon={faSave} style={{ color: '#4341B2' }} />
                                        </a>
                                    ) : (
                                        <a href="#" className="px-2" onClick={handleEditProfile}>
                                            <FontAwesomeIcon icon={faPen} style={{ color: '#4341B2' }} />
                                        </a>
                                    )}
                                </div>
                            </div>
                            {/* Biography */}
                            <div className="mb-3">
                                <h5>
                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" style={{ color: '#A0A0A0' }} />
                                    Biografía
                                </h5>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={profileData.bio || ''}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                ) : (
                                    <p>{profileData.bio ? profileData.bio : 'No especificada'}</p>
                                )}
                            </div>
                            <hr />
                            {/* Estado */}
                            <div className="mb-3">
                                <h5>
                                    <FontAwesomeIcon icon={faTag} className="me-2" style={{ color: '#A0A0A0' }} />
                                    Estado
                                </h5>
                                {isEditing ? (
                                    <select
                                        name="state"
                                        value={profileData.state?.id || ''}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="" disabled>Seleccione un estado...</option>
                                        {userStates.map(state => (
                                            <option key={state.id} value={state.id}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <article className="border border-light bg-light rounded p-2 d-flex align-items-center">
                                        {profileData.state?.icon && (
                                            <img 
                                                src={`https://sandbox.academiadevelopers.com${profileData.state.icon}`} 
                                                alt="Estado"
                                                height="24" 
                                                className="me-2"
                                            />
                                        )}
                                        <span>
                                            {profileData.state?.name || 'No especificado'}
                                        </span>
                                    </article>
                                )}
                            </div>
                            <hr />
                            {/* Created and Updated dates */}
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <article className="border border-light bg-light rounded p-2">
                                        <b className="mx-2">
                                            <FontAwesomeIcon icon={faCalendar} style={{ color: '#A0A0A0' }} />
                                        </b>
                                        Fecha de Alta: {new Date(profileData.created_at).toLocaleDateString()}
                                    </article>
                                </div>
                                <div className="col-md-6">
                                    <article className="border border-light bg-light rounded p-2">
                                        <b className="mx-2">
                                            <FontAwesomeIcon icon={faCalendar} style={{ color: '#A0A0A0' }} />
                                        </b>
                                        Última Modificación: {new Date(profileData.updated_at).toLocaleDateString()}
                                    </article>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default Profile;
