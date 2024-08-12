import React, { useState } from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const [coverImageUrl, setCoverImageUrl] = useState('https://sandbox.academiadevelopers.com/media/harmonyhub/albums/a1442392160_10.jpg');
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (newImage) => {
    setCoverImageUrl(URL.createObjectURL(newImage));
  };

  const handleSave = () => {
    // Guardar cambios (por ejemplo, enviar al servidor)
    setIsEditing(false);
  };

  return (
    <div>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancelar' : 'Editar'}
      </button>
      {isEditing && (
        <button onClick={handleSave}>Guardar</button>
      )}
      <ChildComponent 
        coverImageUrl={coverImageUrl}
        isEditable={isEditing}
        onImageChange={handleImageChange}
      />
    </div>
  );
};

export default ParentComponent;
