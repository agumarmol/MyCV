//styleManager.js

import { STYLE_SETTINGS } from './utils.js';
import { adjustTextShadowBasedOnSidebarColor } from './utils.js';


// ===============================
// CONFIGURACIÓN DE ESTILOS - CENTRALIZADA
// ===============================

// /**
//  * Restaura los estilos personalizados desde localStorage al cargar la página.
//  */
// export function restoreCustomStyles() {
//   const root = document.documentElement;

//   STYLE_SETTINGS.forEach(({ cssVar, key }) => {
//     const storedValue = localStorage.getItem(key);
//     if (storedValue !== null) {
//       root.style.setProperty(cssVar, storedValue);
//     }
//   });

//   adjustTextShadowBasedOnSidebarColor();
// }

/**
 * Aplica los estilos actuales según los valores de los inputs en pantalla y los guarda en localStorage.
 */
export function applyChanges() {
  const root = document.documentElement;

  STYLE_SETTINGS.forEach(({ id, cssVar, key, suffix = '' }) => {
    const input = document.getElementById(id);
    if (input) {
      const value = input.value + suffix;
      root.style.setProperty(cssVar, value);
      localStorage.setItem(key, value);
    }
  });

  adjustTextShadowBasedOnSidebarColor();
}

/**
 * Establece los valores de los inputs basándose en lo que hay en localStorage o en el valor actual de los CSS vars.
 */
export function setSliderValuesFromStorageOrRoot() {
  const root = document.documentElement;

  STYLE_SETTINGS.forEach(({ id, cssVar, key, suffix = '' }) => {
    const input = document.getElementById(id);
    if (input) {
      let value = localStorage.getItem(key);

      if (value === null) {
        value = getComputedStyle(root).getPropertyValue(cssVar).trim();
      }

      // Remover el sufijo para que el input no tenga "px", "%", etc.
      if (suffix && value.endsWith(suffix)) {
        value = value.slice(0, -suffix.length);
      }

      input.value = value;
    }
  });
}

/**
 * Exporta las configuraciones actuales como un archivo JSON descargable.
 */
export function exportCustomStyles() {
  const config = {};

  STYLE_SETTINGS.forEach(({ key }) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      config[key] = value;
    }
  });

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'personalizacion.json';
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Importa un archivo JSON con configuraciones y aplica los estilos inmediatamente.
 */
export function importCustomStyles(file) {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const config = JSON.parse(event.target.result);
      const root = document.documentElement;

      STYLE_SETTINGS.forEach(({ cssVar, key, suffix = '' }) => {
        const value = config[key];
        if (value !== undefined) {
          root.style.setProperty(cssVar, value);
          localStorage.setItem(key, value);
        }
      });

      setSliderValuesFromStorageOrRoot();
      adjustTextShadowBasedOnSidebarColor();
    } catch (err) {
      console.error('Error al importar el archivo JSON:', err);
      alert('El archivo no es válido o está dañado.');
    }
  };

  reader.readAsText(file);
}
