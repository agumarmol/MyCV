// personalization.js

// La función setupPersonalizationListeners tiene como objetivo configurar todos los listeners de eventos
// relacionados con la personalización y administrar la interactividad de los controles en el panel de personalización. 
// El rol principal de esta función es servir como un punto de configuración inicial para todos los eventos, que se
// activan cuando el usuario realiza cambios en las opciones de personalización, como los selectores de fuentes, 
// sliders, colores, etc.

// 1- Carga inicial de configuraciones:

// - Carga: Cuando la página se carga, setupPersonalizationListeners se ejecuta para configurar todos los elementos de personalización
// en el DOM (por ejemplo, los selectores, sliders, botones, etc.), estableciendo sus valores iniciales. Esta carga inicial puede
// implicar recuperar valores previamente guardados en localStorage y aplicar esos valores al DOM para restaurar el estado anterior de la
// personalización.

// - Restauración: Al inicio, algunos controles, como los selectores y sliders, pueden tener valores restaurados desde localStorage
// (por ejemplo, el tema seleccionado, el tamaño de la fuente, la fuente misma, etc.). Esto asegura que el usuario vea su configuración
// anterior inmediatamente al cargar la página.

// 2- Gestión de cambios del usuario:

// - Actualización en tiempo real (Update): Cada vez que el usuario interactúa con un control (como cambiar la fuente, ajustar un slider,
//   o elegir un color), setupPersonalizationListeners asegura que esos cambios se apliquen inmediatamente al DOM. También puede invocar
//   funciones de actualización para otros estilos (por ejemplo, applyChanges) para aplicar estos cambios en tiempo real.

// - Los event listeners configurados por setupPersonalizationListeners son los encargados de capturar los eventos de cambio del usuario
// (por ejemplo, un cambio en el selector de fuente, el tamaño de la foto, etc.) y actualizar el DOM o guardar los valores en localStorage.

// 3- Guardado de configuraciones personalizadas:

// - Guardado: Cada vez que el usuario realiza un cambio, esos cambios se guardan en localStorage a través de funciones como
// localStorage.setItem(). Esto asegura que la configuración persista incluso después de que el usuario cierre y vuelva a abrir el sitio.
// Por ejemplo, el cambio de tema, la fuente, el tamaño de los elementos, y otros valores que el usuario personaliza, son almacenados de
// manera persistente.

// Resumen de roles:
//  Carga: Configuración inicial de los elementos del panel de personalización basados en localStorage (fuentes, colores, etc.).

// - Restauración: Restaurar valores anteriores guardados en localStorage y aplicarlos a los controles (fuentes, colores, etc.).

// - Actualización (Update): Cada vez que el usuario realiza un cambio (por ejemplo, seleccionando una nueva fuente o ajustando un slider),
// la personalización se aplica inmediatamente.

// - Guardado: Los cambios del usuario se guardan en localStorage para persistir entre sesiones.


// personalization.js

// import {
//   // enhanceSkillIcons, enhanceLanguageIcons,
// } from '-/cvLoaders.js'

import { 
  STYLE_SETTINGS, fonts, ITEM_TEMPLATES, 
  populateSelector, 
  // updateSkills, updateLanguages, 
  enhanceSkillIcons, enhanceLanguageIcons,
  updateTimelineLine 
} from './utils.js'

// Función principal para inicializar todos los listeners
export function setupPersonalizationListeners() {
  console.log('Inicializando listeners de personalización...');

  // Rellena los Selectores con las opciones (Fuente, iconos)
  populateSelector(
    document.getElementById('font-family'),
    fonts,
    {
      getLabel: item => item.name,
      getValue: item => item.value
    }
  );

  populateSelector(
    document.getElementById('iconSelector'),
    ITEM_TEMPLATES,
    {
      getLabel: (item, key) => item.label,
      getValue: (item, key) => key
    }
  );

  // ------------------------- Arrays de Controles -------------------------

  // Definición de selectores (ID, clave de localStorage, atributo CSS)
  const selectors = [
      { id: 'theme-select', storageKey: 'theme', attribute: 'data-theme' },
      { id: 'format-select', storageKey: 'format', attribute: 'data-format' },
      { id: 'view-selector', storageKey: 'sidebarView', attribute: 'data-sidebar-view' },
      { id: 'font-family', storageKey: 'font', attribute: 'font-family' },
  ];

  // Definición de sliders (ID, clave de localStorage, propiedad CSS, unidad) // --> USAMOS FONT_STYLES
  
  // const sliders = [
  //     { id: 'font-size', storageKey: 'fontSize', cssProperty: 'font-size', unit: 'px' },
  //     { id: 'sidebar-padding-vertical-slider', storageKey: 'sidebarPaddingVertical', cssProperty: 'padding-top', unit: 'px' },
  //     { id: 'sidebar-padding-horizontal-slider', storageKey: 'sidebarPaddingHorizontal', cssProperty: 'padding-left', unit: 'px' },
  //     { id: 'hobby-size-slider', storageKey: 'hobbySize', cssProperty: '--hobby-size', unit: 'px' },
  // ];

  // Definición de botones (ID, callback)
  const buttons = [
      { id: 'reset-img-btn', callback: setupResetImgButton },
      { id: 'reset-preferences-btn', callback: resetPreferences },
      { id: 'close-personalization-btn', callback: closePanel }
  ];

  // -------------------- Configuración de Listeners --------------------

  // Configurar los listeners para los selectores
  selectors.forEach(selector => {
    console.log(`Configurando selector con id: ${selector.id}`);
    setupSelectorListener(selector.id, selector.storageKey, selector.attribute);
  });

  // Configurar los listeners para los sliders

  // No usaremos este porque diretamente lo tomaremos desde STYLE_SETTINGS
  // sliders.forEach(slider => {
  //   console.log(`Configurando slider con id: ${slider.id}`);
  //   setupSliderListener(slider.id, slider.storageKey, slider.cssProperty, slider.unit);
  // });

  // 🛠️ Usa STYLE_SETTINGS para los sliders
  STYLE_SETTINGS.forEach(setting => {
    console.log(`Configurando slider con id: ${setting.id}`);
    setupSliderListener(setting.id, setting.key, setting.cssVar, setting.suffix || '');
  });
  
  // Configurar los listeners para los botones
  buttons.forEach(button => {
    console.log(`Configurando botón con id: ${button.id}`);
    setupButtonListener(button.id, button.callback);
  });

  // Configurar valores iniciales de sliders desde localStorage
  setSliderValuesFromStorageOrRoot();

  // Llamar al setup del selector de íconos
  setupIconSelectorListener();

  // Inicializar un valor por defecto de iconos
  if (!localStorage.getItem('selectedItemType')) {
    localStorage.setItem('selectedItemType', Object.keys(ITEM_TEMPLATES)[0]);
  }

  updateLevelIcons(); // Aplicar íconos guardados al iniciar
}

// ---------------------- Funciones Comunes ----------------------

/**
* Configura los listeners para los selectores (como fuentes, tipos de ítem, etc.)
*/
function setupSelectorListener(selectorId, storageKey, attribute) {
  const selector = document.getElementById(selectorId);
  
  if (!selector) {
    console.warn(`Selector con id ${selectorId} no encontrado`);
    return;
  }

  const savedValue = localStorage.getItem(storageKey);
  if (savedValue) {
    console.log(`Valor guardado en localStorage para ${storageKey}: ${savedValue}`);
    selector.value = savedValue;
    document.body.setAttribute(attribute, savedValue);
  }

  selector.addEventListener('change', (event) => {
    console.log(`Selector ${selectorId} cambiado: ${event.target.value}`);
    const selectedValue = event.target.value;
    document.body.setAttribute(attribute, selectedValue);
    saveToLocalStorage(storageKey, selectedValue);
  });
}

/**
 * Configura un listener para un slider de personalización.
 * Este listener actualiza una propiedad CSS, guarda el valor en localStorage
 * y actualiza el valor visual en pantalla (si existe un span asociado).
 *
 * @param {string} sliderId - El ID del elemento <input type="range">
 * @param {string} storageKey - Clave para guardar el valor en localStoragesetupPersonalizationListeners
 * @param {string} cssProperty - Propiedad CSS que se debe actualizar (ej. 'font-size', '--hobby-size')
 * @param {string} unit - Unidad a aplicar al valor (ej. 'px', '%', 'em', etc.)
 */
function setupSliderListener(sliderId, storageKey, cssProperty, unit = '') {
  const slider = document.getElementById(sliderId);
  const root = document.documentElement;

  if (!slider) {
    console.warn(`Slider con id ${sliderId} no encontrado`);
    return;
  }

  const savedValue = localStorage.getItem(storageKey);
  if (savedValue !== null) {
    console.log(`Valor guardado en localStorage para ${storageKey}: ${savedValue}`);
    slider.value = savedValue;
    root.style.setProperty(cssProperty, `${savedValue}${unit}`);
  }

  // Actualizar el valor del span con el valor del slider
  const displayElement = document.getElementById(`${sliderId}-display`);
  if (displayElement) {
    displayElement.textContent = `${slider.value}${unit}`; // Aseguramos que el valor inicial esté correcto
  }

  slider.addEventListener('input', (event) => {
    const newValue = event.target.value;
    console.log(`Slider ${sliderId} ajustado: ${newValue}`);

    // Aplicar el valor en el CSS de la raíz
    root.style.setProperty(cssProperty, `${newValue}${unit}`);

    // Guardar el valor actualizado en localStorage
    localStorage.setItem(storageKey, newValue);

    // Actualizar el valor en el span de visualización
    if (displayElement) {
      displayElement.textContent = `${newValue}${unit}`;
    } else {
      console.warn(`Elemento de visualización para ${sliderId} no encontrado.`);
    }

    // Llamada a updateTimelineLine() si es necesario
    requestAnimationFrame(() => {
      updateTimelineLine();
    });
  });
}



/**
* Configura los listeners para los botones.
* @param {string} buttonId - El id del botón
* @param {Function} callback - La función a ejecutar cuando el botón es presionado
*/
function setupButtonListener(buttonId, callback) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', callback);
  } else {
    console.warn(`El botón con ID "${buttonId}" no se encuentra en el DOM.`);
  }
}

/**
* Función para guardar los valores en localStorage
*/
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

// -------------------- Funciones Específicas --------------------

/**
* Resetear imagen (función específica para el botón de reset de imagen)
*/
// ---------------------------------------------
// 9️⃣ Botón para resetear la imagen
// ---------------------------------------------
export function setupResetImgButton() {
    const resetBtn = document.getElementById('reset-img-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const img = document.getElementById('foto');
            if (img) centerImage(img);
            alert('Imagen restablecida!');
        });
    }
}

export function centerImage(img) {
  img.style.transform = `translate(calc(-50% + 0px), calc(-50% + 0px)) scale(1)`;
  localStorage.setItem('fotoOffsetX', '0');
  localStorage.setItem('fotoOffsetY', '0');
  localStorage.setItem('fotoScale', '1');
}

/**
* Resetear preferencias (función específica para el botón de reset de preferencias)
*/
function resetPreferences() {
  localStorage.clear();
  alert('Preferencias restablecidas!');
  location.reload(); // Recarga la página para aplicar los cambios
}

/**
* Función para cerrar el panel de preferencias
*/
function closePanel() {
  const panel = document.getElementById('personalization-panel');
  if (panel) {
    panel.classList.remove('active'); // Oculta el panel correctamente
  }
}

/**
* Listener para cambios de tema
*/
function setupThemeChangeListener() {
  const themeButton = document.getElementById('theme-toggle-button');
  
  // Cargar y restaurar el tema desde localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'theme-custom') {
      document.body.classList.add('theme-custom');
  }

  // Cambio de tema y guardado
  themeButton.addEventListener('click', () => {
      document.body.classList.toggle('theme-custom');
      const newTheme = document.body.classList.contains('theme-custom') ? 'theme-custom' : 'default';
      saveToLocalStorage('theme', newTheme);
  });
}

/**
* Listener para cambios generales
*/
function setupGeneralChangesListener() {
  const generalChanges = document.getElementById('general-changes');
  generalChanges.addEventListener('change', () => {
      alert('Cambios generales aplicados!');
  });
}

/**
* Configuración de sliders desde localStorage (Actualiza los valroes)
*/
function setSliderValuesFromStorageOrRoot() {
  STYLE_SETTINGS.forEach(setting => {
    const savedValue = localStorage.getItem(setting.key); // Obtenemos el valor de localStorage usando la clave definida en STYLE_SETTINGS
    
    if (savedValue) {
      // Si existe un valor guardado en localStorage, se establece en el slider correspondiente
      const sliderElement = document.getElementById(setting.id);
      
      if (sliderElement) {
        // Si el slider existe en el DOM, se actualiza su valor
        sliderElement.value = savedValue;
        
        // También se actualiza la visualización del valor en el span correspondiente
        const displayElement = document.getElementById(`${setting.id}-display`);
        if (displayElement) {
          displayElement.textContent = `${savedValue}${setting.suffix || ''}`;
        }
      }
    }
  });
}

function setupIconSelectorListener(icon_selec = 'iconSelector', item_type = 'selectedItemType') {
  const iconSelector = document.getElementById(icon_selec);
  if (!iconSelector) return;

  const savedType = localStorage.getItem(item_type);
  if (savedType && ITEM_TEMPLATES[savedType]) {
    iconSelector.value = savedType;
  }

  iconSelector.addEventListener('change', (event) => {
    const selectedType = event.target.value;
    localStorage.setItem(item_type, selectedType);
    updateLevelIcons(item_type); // 👈 Llama a esta
  });
}

/**
 * Aplica el nuevo tipo de ícono (star, heart, ...) a las habilidades e idiomas.
 * Simplemente vuelve a llamar a updateSkills/updateLanguages, que internamente usan
 * renderItems(...) con el ITEM_TEMPLATES correcto.
 */
function updateLevelIcons(item_type = 'selectedItemType') {
  const selectedType = localStorage.getItem(item_type);
  // Si el tipo no existe en tus plantillas, salimos
  if (!ITEM_TEMPLATES[selectedType]) {
    console.warn(`Tipo de ícono "${selectedType}" no válido.`);
    return;
  }

  // Rerenderiza habilidades e idiomas con el tipo actual
  // updateSkills();
  // updateLanguages();

  // En vez de llamar directamente a updateSkills/languages, usamos mejoras visuales
  
  // Verificamos que window.cvData exista
  if (!window.cvData) {
    console.warn('cvData no está disponible en window.');
    return;
  }

  const habilidadesEl = document.getElementById('habilidades');
  const idiomasEl = document.getElementById('idiomas');

  if (habilidadesEl) {
    enhanceSkillIcons(habilidadesEl, window.cvData.habilidades || []);
  }
  if (idiomasEl) {
    enhanceLanguageIcons(idiomasEl, window.cvData.idiomas || []);
  }
}


// Función para cambiar la vista del sidebar
function changeViewSidebar(viewType) {
  const sidebar = document.getElementById('sidebar'); // Asegúrate de que este ID coincida con el ID de tu sidebar
  
  // Primero, eliminamos las clases anteriores
  sidebar.classList.remove('grid-view', 'list-view', 'compact-view');
  
  // Añadimos la clase seleccionada
  sidebar.classList.add(viewType);
}

// // personalization.js

// // Importar funciones desde utils.js
// import { flagMap } from './cvLoaders.js';
// import { fonts, FONT_LINKS, ITEM_TEMPLATES, nivelMap } from './utils.js'
// import { setupSectionFormatLoading, setupFormatSelector, adjustTextShadowBasedOnSidebarColor, isLightColor } from './utils.js';

// // ---------------------------------------------
// // 1️⃣ Inicializar todos los listeners de personalización
// // ---------------------------------------------
// export function setupPersonalizationListeners() {
//     setupfontSelector();                       // 2️⃣ - Selector de fuente
//     setupItemTypeSelector();                   // 5️⃣ - Selector de tipo de ítem
//     setupFontSizeSlider();                     // 6️⃣ - Controlador de tamaño de fuente
//     setupHobbySizeSlider();                    // 7️⃣ - Controlador de tamaño de hobbies

//     // 8️⃣ - Controlador de padding vertical del sidebar    
//     setupRangeSlider({
//         sliderId:      'sidebar-padding-vertical-slider',
//         displayId:     'sidebar-padding-vertical-display',
//         cssVar:        '--padding-vertical',
//         storageKey:    'sidebarPaddingVertical',
//         unit:          'vw'
//     });

//     setupRangeSlider({
//         sliderId:      'sidebar-padding-horizontal-slider',
//         displayId:     'sidebar-padding-horizontal-display',
//         cssVar:        '--padding-horizontal',
//         storageKey:    'sidebarPaddingHorizontal',
//         unit:          'vw'
//     });

//     setupResetImgButton();                     // 9️⃣ - Botón de reset de imagen
//     setupResetPreferencesButton();             // 🔢 - Resetear preferencias
//     setupProfilePhotoSliders();              //   - Controlar el Tamaño y Radio de la Foto
  
//     // 🎨 Listener para cambio de tema + clase theme-custom
//     const themeSelect = document.getElementById('theme-select');
//     const panel = document.getElementById('personalization-panel');
//     themeSelect?.addEventListener('change', e => {
//         const theme = e.target.value;
//         setTheme(theme);                       // 3️⃣ - Cambiar tema
//         applyChanges();                        // 4️⃣ - Aplicar cambios
//         panel.classList.toggle('theme-custom', theme === 'custom');
//     });

//     setupFormatSelector(); // 🎯 Selector de formato lista / tabla
  
//     // 🎛 Listener para cambios generales
//     document.querySelectorAll(
//         '#custom-style-color input, #font-family, #font-size, ' +
//         '#sidebar-padding-vertical-slider, #sidebar-padding-horizontal-slider, ' +
//         '#iconSelector, #hobby-size-slider'
//     ).forEach(el => el.addEventListener('input', applyChanges));
  
//     // ❌ Botón para cerrar el panel
//     document.getElementById('close-personalization-btn')?.addEventListener('click', togglePersonalization);

//     // ** Llamada para configurar los valores iniciales de los sliders ** 
//     setSliderValuesFromStorageOrRoot();  // Establece los valores iniciales de los sliders
// }

// // ---------------------------------------------
// // 2️⃣ Configurar el selector de fuentes (Carga, Restaura desde localStorage y lo Guarda)
// // ---------------------------------------------
// export function setupfontSelector() {
//     const fontSelect = document.getElementById('font-family');
//     if (!fontSelect) return;

//     fontSelect.innerHTML = '';
//     fonts.forEach(font => {
//         const option = document.createElement('option');
//         option.value = font.value;
//         option.textContent = font.name;
//         fontSelect.appendChild(option);
//     });

//     // Carga inicial y restauración desde localStorage
//     const savedFont = localStorage.getItem('fontFamily');
//     if (savedFont) {
//         fontSelect.value = savedFont;
//         document.documentElement.style.setProperty('--font-family', savedFont);
//     }

//     // Configura el listener del <select> para guardar los cambios
//     fontSelect.addEventListener('change', () => {
//         const selectedFont = fontSelect.value;
//         if (document.documentElement.style.getPropertyValue('--font-family') !== selectedFont) {
//             document.documentElement.style.setProperty('--font-family', selectedFont);
//             localStorage.setItem('fontFamily', selectedFont);
//             applyChanges();
//         }
//     });
// }

// // ---------------------------------------------
// // 5️⃣ Configurar selector del tipo de ítem
// // ---------------------------------------------
// export function setupItemTypeSelector() {
//     const itemSelect = document.getElementById('iconSelector');
//     if (!itemSelect) return;

//     // Poblamos el <select>
//     itemSelect.replaceChildren();
//     Object.entries(ITEM_TEMPLATES).forEach(([key, tpl]) => {
//         const opt = document.createElement('option');
//         opt.value = key;
//         opt.textContent = tpl.label;
//         itemSelect.appendChild(opt);
//     });

//     // Leemos el valor guardado
//     const savedType = localStorage.getItem('selectedItemType') || 'star';
//     itemSelect.value = savedType;

//     // Cuando cambie el selector:
//     itemSelect.addEventListener('change', () => {
//         const tipo = itemSelect.value;
//         // 1) Guardar en localStorage
//         localStorage.setItem('selectedItemType', tipo);
//         // 2) Reaplicar estilos CSS genéricos
//         applyChanges();
//         // 3) 🖌️ Volver a pintar stars/hearts en habilidades e idiomas
//         updateSkills();
//         updateLanguages();
//     });
// }

// // ---------------------------------------------
// // 6️⃣ Ajustar el tamaño de fuente
// // ---------------------------------------------
// export function setupFontSizeSlider() {
//     const fontSizeSlider = document.getElementById('font-size');
//     const fontSizeDisplay = document.getElementById('font-size-display');
//     if (fontSizeSlider && fontSizeDisplay) {
//         fontSizeSlider.addEventListener('input', () => {
//             // Mostrar el valor en px
//             const value = fontSizeSlider.value;
//             fontSizeDisplay.textContent = `${value}px`;

//             // Convertir el valor de px a rem (asumiendo que la raíz es 16px)
//             const remValue = value / 16;

//             // Actualizar la variable CSS --font-size-base con el valor en rem
//             document.documentElement.style.setProperty('--font-size-base', `${remValue}rem`);

//             // Aplicar los cambios visuales a otros elementos si es necesario
//             applyChanges(); // Mantener esto si necesitas otras acciones relacionadas con los cambios
//         });
//     }
// }

// // ---------------------------------------------
// // 7️⃣ Ajustar tamaño de las tarjetas de hobbies
// // ---------------------------------------------
// export function setupHobbySizeSlider() {
//     const hobbySlider = document.getElementById('hobby-size-slider');
//     const hobbySizeDisplay = document.getElementById('hobby-size-display');
//     if (!hobbySlider || !hobbySizeDisplay) return;

//     hobbySlider.addEventListener('input', (e) => {
//         const scale = e.target.value;
//         adjustCardSize(scale);  // Esta función debería ajustar el tamaño de las cards
//         localStorage.setItem('hobby-size-slider', scale); // Guarda la preferencia del tamaño
//         hobbySizeDisplay.textContent = `${scale}x`;  // Actualiza el valor mostrado al usuario
//         applyChanges();  // Asegúrate de que se apliquen los cambios globales
//     });
// }

// // 🧩 Subfunción de ajuste de hobbies
// export function adjustCardSize(scale) {
//     const root = document.documentElement;
//     root.style.setProperty('--hobby-size-slider', scale);  // Aplica el cambio a la variable CSS
// }

// // ---------------------------------------------
// // 7️⃣ Configurar el padding del sidebar
// // ---------------------------------------------
// export function setupRangeSlider({ sliderId, displayId, cssVar, storageKey, unit = 'vw' }) {
//     const slider  = document.getElementById(sliderId);
//     const display = document.getElementById(displayId);

//     if (!slider || !display) return;

//     // Cargar valor guardado o usar valor inicial
//     const saved = localStorage.getItem(storageKey);
//     if (saved !== null) {
//         slider.value = saved;
//         document.documentElement.style.setProperty(cssVar, `${saved}${unit}`);
//         display.textContent = `${saved}${unit}`;
//     } else {
//         display.textContent = `${slider.value}${unit}`;
//         document.documentElement.style.setProperty(cssVar, `${slider.value}${unit}`);
//     }

//     // Listener para actualizar en tiempo real
//     slider.addEventListener('input', () => {
//         const val = slider.value;
//         document.documentElement.style.setProperty(cssVar, `${val}${unit}`);
//         display.textContent = `${val}${unit}`;
//         localStorage.setItem(storageKey, val);
//     });
// }

// // ---------------------------------------------
// // 8️⃣ Ajustar tamaño, radio y aspecto de la foto
// // ---------------------------------------------
// export function setupProfilePhotoSliders() {
//     const fotoSizeSlider = document.getElementById('foto-size-slider');
//     const fotoRadiusSlider = document.getElementById('foto-radius-slider');
//     const fotoAspectSlider = document.getElementById('foto-aspect-slider');

//     const fotoSizeDisplay = document.getElementById('foto-size-display');
//     const fotoRadiusDisplay = document.getElementById('foto-radius-display');
//     const fotoAspectDisplay = document.getElementById('foto-aspect-display');

//     if (!fotoSizeSlider || !fotoRadiusSlider || !fotoAspectSlider ||
//         !fotoSizeDisplay || !fotoRadiusDisplay || !fotoAspectDisplay) return;

//     // Cargar valores guardados en localStorage o usar valores actuales
//     fotoSizeSlider.value = localStorage.getItem('fotoSize') || fotoSizeSlider.value;
//     fotoRadiusSlider.value = localStorage.getItem('fotoRadius') || fotoRadiusSlider.value;
//     fotoAspectSlider.value = localStorage.getItem('fotoAspect') || fotoAspectSlider.value;

//     updateProfilePhotoDisplays();

//     // Agregar listeners
//     [fotoSizeSlider, fotoRadiusSlider, fotoAspectSlider].forEach(slider => {
//         slider.addEventListener('input', () => {
//             updateProfilePhotoDisplays();
//             applyChanges();
//         });
//     });
// }

// // 🧩 Subfunción para actualizar visualmente los displays de sliders
// export function updateProfilePhotoDisplays() {
//     const fotoSizeSlider = document.getElementById('foto-size-slider');
//     const fotoRadiusSlider = document.getElementById('foto-radius-slider');
//     const fotoAspectSlider = document.getElementById('foto-aspect-slider');

//     const fotoSizeDisplay = document.getElementById('foto-size-display');
//     const fotoRadiusDisplay = document.getElementById('foto-radius-display');
//     const fotoAspectDisplay = document.getElementById('foto-aspect-display');

//     if (!fotoSizeSlider || !fotoRadiusSlider || !fotoAspectSlider ||
//         !fotoSizeDisplay || !fotoRadiusDisplay || !fotoAspectDisplay) return;

//     fotoSizeDisplay.textContent = `${fotoSizeSlider.value}%`;
//     fotoRadiusDisplay.textContent = `${fotoRadiusSlider.value}%`;
//     fotoAspectDisplay.textContent = `${fotoAspectSlider.value}:1`;

//     // Guardar en localStorage
//     localStorage.setItem('fotoSize', fotoSizeSlider.value);
//     localStorage.setItem('fotoRadius', fotoRadiusSlider.value);
//     localStorage.setItem('fotoAspect', fotoAspectSlider.value);
// }

// // ---------------------------------------------
// // 9️⃣ Botón para resetear la imagen
// // ---------------------------------------------
// export function setupResetImgButton() {
//     const resetBtn = document.getElementById('reset-img-btn');
//     if (resetBtn) {
//         resetBtn.addEventListener('click', () => {
//             const img = document.getElementById('foto');
//             if (img) centerImage(img);
//         });
//     }
// }

// // 🧩 Subfunción para resetear transformaciones de imagen
// export function centerImage(img) {
//     img.style.transform = `translate(calc(-50% + 0px), calc(-50% + 0px)) scale(1)`;
//     localStorage.setItem('fotoOffsetX', '0');
//     localStorage.setItem('fotoOffsetY', '0');
//     localStorage.setItem('fotoScale', '1');
// }

// // ---------------------------------------------
// // 🔟 Botón para resetear preferencias guardadas
// // ---------------------------------------------
// export function setupResetPreferencesButton() {
//     const resetBtn = document.getElementById('reset-preferences-btn');
//     if (resetBtn) {
//         resetBtn.addEventListener('click', () => {
//             localStorage.clear(); // Elimina todas las preferencias del localStorage
//             location.reload();  // Recarga la página para aplicar los cambios por defecto
//         });
//     }
// }

