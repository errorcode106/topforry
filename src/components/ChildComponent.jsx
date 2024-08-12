import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const ChildComponent = ({ coverImageUrl, isEditable, onImageChange }) => {
  const [tempImageUrl, setTempImageUrl] = useState(coverImageUrl);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImageUrl(reader.result); // Muestra la imagen temporalmente
      onImageChange(file); // Envía la imagen seleccionada al componente padre
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    document.getElementById('coverInput').click();
  };

  return (
    <div className="col-md-4">
      <div className="audio-player">
        <div className="cover">
          <div className={`cover-img-wrapper ${isEditable ? 'editable' : ''}`}>
            <img 
              src={tempImageUrl} 
              alt="Cover" 
              className="img-fluid rounded"
              onClick={isEditable ? triggerFileInput : undefined} // Solo permitir cambiar la imagen si es editable
              style={{ cursor: isEditable ? 'pointer' : 'default' }} // Cambiar cursor si es editable
            />
            {isEditable && (
              <div className="overlay" onClick={triggerFileInput}>
                <div className="edit-button">
                  <FontAwesomeIcon icon={faPen} />
                </div>
              </div>
            )}
            {isEditable && (
              <input 
                type="file" 
                id="coverInput" 
                style={{ display: 'none' }} 
                onChange={handleImageChange} // Manejar el cambio de imagen
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Definir prop types para el componente
ChildComponent.propTypes = {
  coverImageUrl: PropTypes.string.isRequired,
  isEditable: PropTypes.bool,
  onImageChange: PropTypes.func
};

// Definir valores predeterminados para las props
ChildComponent.defaultProps = {
  isEditable: false,
  onImageChange: () => {}
};

export default ChildComponent;
