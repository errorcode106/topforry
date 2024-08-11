# TopForry

## Pagina de muestra: https://topforry.vercel.app/

## Descripción del Proyecto

TopForry es una aplicación web para gestionar álbumes de música. Permite a los usuarios crear, editar, y eliminar álbumes, así como agregar, modificar y eliminar canciones dentro de cada álbum. La aplicación también ofrece la posibilidad de reproducir canciones directamente desde la interfaz y cuenta con controles de audio integrados.

## Características

- **Gestión de Álbumes**: Los usuarios pueden crear nuevos álbumes, asignarles un título, año, artista, y subir una portada.
- **Gestión de Canciones**: Dentro de cada álbum, los usuarios pueden añadir, editar y eliminar canciones. Cada canción puede tener un título, año de lanzamiento, y archivo de audio asociado.
- **Reproducción de Audio**: La aplicación cuenta con un reproductor de audio integrado que permite a los usuarios reproducir canciones directamente desde la aplicación.
- **Interfaz de Usuario Moderna**: La aplicación utiliza componentes visuales modernos, con soporte para temas y efectos de transición suave.
- **Control de Autenticación**: Solo los usuarios autenticados pueden crear o editar álbumes y canciones, asegurando que los recursos sean gestionados de manera segura.
- **Soporte para HTTPS**: Asegura que todos los recursos (imágenes, archivos de audio) se carguen a través de conexiones seguras.

## Tecnologías Utilizadas

- **Frontend**: 
  - React
  - Bootstrap
  - FontAwesome
  - React Router DOM
- **Backend**: 
  - API REST (implementada en Django REST Framework)
- **Autenticación**: 
  - Token basado en JSON Web Token (JWT)
- **Despliegue**:
  - Vercel (para frontend)
  - API hospedada en un servidor remoto

## Instalación y Configuración

### Requisitos Previos

- Node.js
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio:**

    ```bash
   git clone https://github.com/tu-usuario/topforry.git
   cd topforry
    ```

2. Instalar dependencias:

    ```bash
    npm install
    ```

3. Configurar variables de entorno:

    Crea un archivo .env en la raíz del proyecto con las siguientes variables:

    ```bash
    REACT_APP_API_URL= your-api-url
    REACT_APP_AUTH_TOKEN= your-auth-token
    ```

4. Ejecutar la aplicación:

    Usando npm:

    ```bash
    npm run dev
    ```

La aplicación estará disponible en http://localhost:5173.

## Uso
### Crear un Álbum
1. Navega a la sección "Crear Álbum".
2. Completa los campos obligatorios: Título, Año, Artista, y Portada.
3. Haz clic en "Crear Álbum".
4. Un modal permitirá añadir canciones al álbum recién creado.

### Añadir Canciones a un Álbum
1. Dentro de la vista de detalle del álbum, selecciona "Añadir Canción".
2. Rellena los detalles de la canción: Título, Año, Archivo de Audio.
3. Haz clic en "Guardar Canción".

### Editar o Eliminar Álbumes y Canciones
1. Para editar un álbum o canción, haz clic en el ícono de lápiz junto al recurso que deseas modificar.
2. Para eliminar, haz clic en el ícono de la papelera. Aparecerá un modal de confirmación antes de proceder.

### Reproducir Canciones
* Desde la vista de detalle del álbum, haz clic en cualquier canción de la lista para reproducirla. El reproductor de audio se actualizará para mostrar la canción seleccionada.

### Despliegue
* La aplicación está desplegada en Vercel. Puedes acceder a la aplicación en TopForry.

### Problemas Comunes
#### Error de Contenido Mixto
* Si se cargan recursos a través de HTTP en lugar de HTTPS, el navegador puede bloquear el contenido. Asegúrate de que todas las URLs utilicen https://.

#### Archivos Grandes de Audio
* Asegúrate de que los archivos de audio no excedan el tamaño máximo permitido por el servidor.

#### Contribuciones
* Las contribuciones son bienvenidas. Puedes realizar un fork del repositorio, crear una nueva rama para tu funcionalidad o corrección de errores, y enviar un pull request.
