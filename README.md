# Jomaps 🗺️

Un planificador de rutas interactivo y moderno, construido con React, Vite y Leaflet.

**[🚀 Ver Demo en Vivo 🚀](https://johanmorales211.github.io/jomaps/)**

![Demostración de Jomaps](https://i.postimg.cc/6QPgyFpH/foto-jomaps.png)

## 📌 Acerca del Proyecto

**Jomaps** es una aplicación web de mapas diseñada para ofrecer una experiencia de usuario fluida y eficiente al planificar viajes. Permite a los usuarios buscar ubicaciones, calcular rutas para diferentes medios de transporte y visualizar detalles del trayecto como la distancia, la duración estimada y el perfil de altitud.

Este proyecto fue desarrollado como una demostración de habilidades en el desarrollo frontend moderno, integrando APIs externas y construyendo una interfaz de usuario limpia y responsiva con las últimas tecnologías.

## ✨ Características Principales

-   **Múltiples Modos de Transporte:** Calcula rutas para vehículo, bicicleta o a pie.
-   **Búsqueda Inteligente:** Encuentra ubicaciones fácilmente con un buscador que ofrece autocompletado.
-   **Mapa Interactivo:** Visualiza la ruta trazada sobre un mapa de OpenStreetMap, con la capacidad de hacer zoom y moverte libremente.
-   **Detalles de la Ruta:** Obtén información clave como distancia, duración y un gráfico con el perfil de elevación del terreno.
-   **Ubicación Actual:** Utiliza la geolocalización del navegador para establecer tu punto de partida con un solo clic.
-   **Diseño Responsivo:** Una experiencia de usuario óptima tanto en dispositivos de escritorio como en móviles.

## 🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando un stack de tecnologías moderno y eficiente:

-   **React**
-   **Vite**
-   **TypeScript**
-   **Leaflet & React-Leaflet**
-   **OpenRouteService API**
-   **Tailwind CSS**
-   **Shadcn/UI**
-   **React Context API**

## 🚀 Cómo Empezar (Desarrollo Local)

Si deseas ejecutar este proyecto en tu máquina local, sigue estos pasos:

1.  **Clona el repositorio:**
    ```sh
    git clone https://github.com/JohanMorales211/jomaps.git
    cd jomaps
    ```

2.  **Instala las dependencias:**
    ```sh
    npm install
    ```

3.  **Configura las variables de entorno:**
    -   Crea un archivo `.env` en la raíz del proyecto.
    -   Necesitarás una API Key de [OpenRouteService](https://openrouteservice.org/). Es gratuita para desarrollo.
    -   Añade tu clave al archivo `.env` de la siguiente manera:
    ```
    VITE_ORS_API_KEY=tu_api_key_aqui
    ```

4.  **Ejecuta el servidor de desarrollo:**
    ```sh
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:8080`.

## ✍️ Autor

**Johan Morales**

-   **GitHub:** [@JohanMorales211](https://github.com/JohanMorales211)
-   **LinkedIn:** [Johan Morales](https://www.linkedin.com/in/johan-morales-b3809b206/)
-   **Portafolio:** [johanmorales211.github.io](https://johanmorales211.github.io/portafolio-personal/)
