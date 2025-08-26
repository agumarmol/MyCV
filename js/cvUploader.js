// cvUploaders.js

import { initCVDataFromObject, updatePhoto } from './cvLoaders.js';

// Manejador para el JSON del CV
export function setupJsonUploadListener() {
  const input = document.getElementById('jsonUpload');
  if (!input) return;

  input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      alert("Por favor selecciona un archivo JSON válido.");
      return;
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      // Creamos un blob URL temporal para simular una URL de archivo
      const blobUrl = URL.createObjectURL(new Blob([text], { type: 'application/json' }));

      // Guardamos los datos cargados para futuros usos
      window.customCVData = jsonData;

      // Llama a una versión modificada de initCVData que acepte datos directos
      await initCVDataFromObject(jsonData);

    } catch (error) {
      console.error("Error leyendo el archivo JSON:", error);
      alert("No se pudo leer el archivo. Asegúrate de que sea un JSON válido.");
    }
  });
}

// Manejador para la foto
export function setupPhotoUploadListener() {
  const input = document.getElementById('photoUpload');
  if (!input) return;

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert("Por favor selecciona una imagen válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;

      // Actualizamos la foto directamente
      updatePhoto(imageUrl);
    };
    reader.readAsDataURL(file);
  });
}


