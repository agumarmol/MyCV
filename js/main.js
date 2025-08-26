// main.js

// Importar funciones desde los módulos
import { 
  setupPrintBreakToggle, setupPersonalizationListeners, setupResetImgButton
} from './personalization.js';
import { 
  initCVData 
} from './cvLoaders.js';
import { 
  STYLE_SETTINGS,
  setTheme, setupSectionFormatLoading, setupResizer, setupToggleSections, 
  adjustColorBasedOnInversion, adjustTextShadowBasedOnSidebarColor, changeTopbarOnScroll, updateTimelineLine,
  setupHideSectionButtons, 
} from './utils.js';
import { 
  exportCustomStyles, importCustomStyles
} from './styleManager.js';

import { 
  setupJsonUploadListener, 
  setupPhotoUploadListener 
} from './cvUploader.js';

export {
  // setupMenuDropdown, // 1 - (interno)
  // restoreCustomStyles, // 5.5 - (interno) - IMPORTANTE: está duplicada en styleManager (comentada)
  // setupMenuListeners, // (interno) --> Usa setupPhotoUploadListener y setupJsonUploadListener (cvUploaders.js)
}

// ===================================
// 🏁 Inicializar todo cuando cargue la página
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOMContentLoaded: La página ha cargado, iniciando inicialización...");

  // 🆕 0️⃣ Inicializamos el estado del botón de impresión ANTES de configurar listeners
  setupPrintBreakToggle();

  // 🆕 1️⃣ Llamamos a la función para el menú desplegable en la topbar
  // setupMenuDropdown();  // Inicializamos el menú desplegable -> Reemplazado por setupButton + handlePanelToggle
  setupButton("menu-toggle-btn", () => {
    handlePanelToggle({
      panelId: "menuDropdown",
      buttonSelector: "#menu-toggle-btn",
      action: "toggle"   // explícito
    });
  });

  // 2️⃣ Restaurar tema y estilos personalizados
  const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
  setTheme(savedTheme);             // 🔸 Ahora incluye cargar fuentes automáticamente

  // 3️⃣ Restaurar formato de secciones (lista o tabla) antes de inyectar datos
  console.log(`Tema guardado encontrado: ${savedTheme}`);
  setupSectionFormatLoading();      // ✅ Aplica clases desde localStorage y ajusta el botón

  // 🆕 3️⃣1 Verificar la vista predeterminada (list-view)
  const savedViewType = localStorage.getItem('viewType') || 'grid-view';  // Por defecto, grid-view
  document.body.classList.add(savedViewType);  // Aplica la vista guardada (list-view o grid-view)

  // 4️⃣ Cargar datos del CV, idioma y foto
  console.log("Cargando CV...");
  try {
    await initCVData('assets/data.json', 'assets/foto.jpg');
    console.log("CV cargado exitosamente");

    // 🆕 Ahora que la imagen ya existe en el DOM, podemos configurar el boton de reset
    setupResetImgButton();

  } catch (error) {
    console.error("Error al cargar el CV:", error);
  }

  // 🔹 Incluye idioma, contenido y foto. También inicializa el selector de idiomas.
  // 🔹 No vuelve a llamar a restoreCustomStyles()

  // 5️⃣ Interactividad General: Configurar el comportamiento interactivo
  console.log("Configurando comportamiento interactivo...");
  setupResizer();                   // 5.1 Resizer del sidebar
  setupPersonalizationListeners();  // 5.2 Inputs para personalización (color pickers, sliders...)
  setupToggleSections();            // 5.3 Secciones colapsables en contenido (educación, skills, etc.)
  setupHideSectionButtons();        // 5.4 Secciones ocultas
  restoreCustomStyles();            // 5.5 Restaura colores, paddings, etc. desde localStorage

  // 6️⃣ Ajustar sombras de texto según color actual del sidebar
  console.log('Ajustando sombras de texto...');
  adjustTextShadowBasedOnSidebarColor();

  // 🆕 Ajustar color del texto principal según el fondo de página
  adjustColorBasedOnInversion('--page-font-color', '--page-background-color');

  // 🆕 Ajustar color del texto del sidebar según el fondo del sidebar
  adjustColorBasedOnInversion('--sidebar-font-color', '--sidebar-background-color');

  // 7️⃣ Configurar botón de personalización

  // const personalizeButton = document.getElementById('personalize-btn');
  // if (personalizeButton) {
  //   console.log('Personalize button found');
  //   personalizeButton.addEventListener('click', () => {
  //     // Muestra u oculta el panel (antes 'togglePersonalization'. 'handlePersonalization centraliza diferentes usos y botones)
  //     handlePersonalization("toggle"); 
  //   });
  // } else {
  //   console.warn('No se encontró el botón de personalización');
  // }

  // Esta función anidada reemplaza la anterior, la cual llamaba a una función específica handlePersonalization (ahorahandlePanelToggle que es más generalista)
  setupButton("personalize-btn", () => {
    handlePanelToggle({
      panelId: "personalization-panel",
      buttonSelector: ".personalize-btn",
      action: "toggle"   // explícito
    });
  });

  // 🆕 8️⃣ Topbar dinámica al hacer scroll
  changeTopbarOnScroll();  // Aquí la llamamos para que empiece a funcionar

  // 🔄 9️⃣ Recalcula la línea del Timeline en caso de que padding/fuente haya cambiado
  updateTimelineLine();

  // 🔄 🆕 Escuchar carga de archivos del usuario
  setupMenuListeners();
});

// ===================================
// 1️⃣ Función para configurar un botón
// // ===================================

/**
 * Configura un botón para ejecutar una acción al hacer click
 * @param {string} buttonId - ID del botón en el DOM
 * @param {Function} action - Función que se ejecuta al clickear 
 * @param {string} [missingMsg] - Mensaje opcional si no se encuentra el botón
 */
function setupButton(buttonId, action, missingMsg = '') {
  const btn = document.getElementById(buttonId);

  if (btn) {
    btn.addEventListener("click", action);
  } else if (missingMsg) {
    console.warn(missingMsg || `No se encontró el botón con id "${buttonId}"`);
  }
}

// Función para configurar una acción en un botón 
export function handlePanelToggle({panelId, buttonSelector, action = "toggle", activeClass = "active"}) {
  const panel = document.getElementById(panelId);
  const button = document.querySelector(buttonSelector);

  if (!panel || !button) return;

  switch (action) {
    case "open":
      panel.classList.add(activeClass);
      button.classList.add(activeClass);
      break;

    case "close":
      panel.classList.remove(activeClass);
      button.classList.remove(activeClass);
      break;

    case "toggle":
    default:
      const isActive = panel.classList.toggle(activeClass);
      button.classList.toggle(activeClass, isActive);
      break;
  }
}


// ===================================
// 1️⃣ Función para mostrar/ocultar el menú desplegable en el topbar
// ===================================

// function setupMenuDropdown() {
//   const menuToggleBtn = document.getElementById("menu-toggle-btn");
//   const menuDropdown = document.getElementById("menuDropdown");

//   // Asegurémonos de que el botón de menú y el dropdown existan
//   if (menuToggleBtn && menuDropdown) {
//     menuToggleBtn.addEventListener("click", () => {
//       menuDropdown.classList.toggle("active"); // Toggle para mostrar/ocultar el dropdown
//     });
//   }
// }

//  5️⃣.5️⃣ - Función mejorada para restaurar estilos desde localStorage (ignora los vacíos)
function restoreCustomStyles() {
  const root = document.documentElement;

  STYLE_SETTINGS.forEach(({ key, cssVar, suffix = '' }) => {
    const val = localStorage.getItem(key);
    if (val !== null && val.trim() !== '') {
      // Si existe el valor en localStorage, lo aplicamos con su sufijo correspondiente
      root.style.setProperty(cssVar, `${val}${suffix}`);
    }
  });
}

// Función para configurar los listeners del Menu
function setupMenuListeners() {
  setupJsonUploadListener();
  setupPhotoUploadListener();
}


// ---------------------------------------------
// 8️⃣ Mostrar/Ocultar panel de personalización (similar a ClosePanel en personalization.js)
// ---------------------------------------------
// export function togglePersonalization() {
//   const panel = document.getElementById('personalization-panel');
//   panel.classList.toggle('active');
// }



// // ===================================
// // 🏁 Inicializar todo cuando cargue la página
// // ===================================

// document.addEventListener('DOMContentLoaded', async () => {
//   // 1️⃣ Restaurar tema y estilos personalizados
//   const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
//   setTheme(savedTheme);             // 🔸 Ahora incluye cargar fuentes automáticamente

//   // 2️⃣ Restaurar formato de secciones (lista o tabla) antes de inyectar datos
//   setupSectionFormatLoading();      // ✅ Aplica clases desde localStorage y ajusta el botón

//   // 3️⃣ Cargar datos del CV, idioma y foto
//   await initCVData('assets/data.json', 'assets/foto.jpg'); 
//   // 🔹 Incluye idioma, contenido y foto. También inicializa el selector de idiomas.
//   // 🔹 No vuelve a llamar a restoreCustomStyles()

//   // 4️⃣ Configurar el comportamiento interactivo
//   setupResizer();                   // Resizer del sidebar
//   setupPersonalizationListeners();  // Inputs para personalización (color pickers, sliders...)
//   setupToggleSections();            // Secciones colapsables (educación, skills, etc.)
//   restoreCustomStyles();            // ✅ Restaura colores, paddings, etc. desde localStorage

//   // 5️⃣ Ajustar sombras de texto según color actual del sidebar
//   adjustTextShadowBasedOnSidebarColor();

//   // 6️⃣ Configurar botón de personalización
//   const personalizeButton = document.getElementById('personalize-btn');
//   if (personalizeButton) {
//     personalizeButton.addEventListener('click', () => {
//       togglePersonalization(); // Muestra u oculta el panel
//     });
//   } else {
//     console.warn('No se encontró el botón de personalización');
//   }

//   // Llama a la función para establecer los valores iniciales de los sliders desde localStorage o el root
//   setSliderValuesFromStorageOrRoot();
// });




// 3. Secciones colapsables
// export function setupToggleSections(ids = []) {
//   const allToggles = ids.length 
//     ? ids.map(id => document.querySelector(`#${id} .title-container`)).filter(Boolean)
//     : [...document.querySelectorAll('.title-container')];

//   allToggles.forEach(el => {
//     const wrapper = el.parentElement;
//     const content = el.nextElementSibling;
//     const isTimeline = wrapper.id === 'timelineSection';
//     const open = JSON.parse(localStorage.getItem('openSections') || '[]');

//     // Estado inicial
//     const isOpen = open.includes(wrapper.id);
//     content.style.display = isOpen ? '' : 'none';
//     if (isTimeline && isOpen) {
//       renderTimeline();
//       setupTimelineObserver();
//     }

//     el.addEventListener('click', () => {
//       toggleSection(el);
//       if (isTimeline && content.style.display !== 'none') {
//         renderTimeline();
//         setupTimelineObserver();
//       }
//     });
//   });
// }

// 3.1 - Función para expandir/colapsar una sección y guardar su estado en localStorage
// export function toggleSection(el) {
//   const wrapper = el.closest('.section');
//   const content = wrapper?.querySelector('.content-container');
//   if (!content) return;

//   const isVisible = window.getComputedStyle(content).display !== 'none';
//   content.style.display = isVisible ? 'none' : 'block';

//   const sectionId = wrapper?.id;
//   const openSections = JSON.parse(localStorage.getItem('openSections') || '[]');

//   if (sectionId) {
//     if (!isVisible) {
//       if (!openSections.includes(sectionId)) openSections.push(sectionId);
//     } else {
//       const index = openSections.indexOf(sectionId);
//       if (index !== -1) openSections.splice(index, 1);
//     }
//     localStorage.setItem('openSections', JSON.stringify(openSections));
//   }
// }
