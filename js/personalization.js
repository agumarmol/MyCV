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

import { handlePanelToggle } from './main.js';

import { getCurrentIdiomaData, renderArrayContent, updatePhoto, removeImageDragAndZoomListeners } from './cvLoaders.js';

import {
  STYLE_SETTINGS, fonts, ITEM_TEMPLATES, levelMap,
  populateSelector,
  // updateSkills, updateLanguages,
  enhanceSectionItems, renderItems,
  // enhanceSkillIcons, enhanceLanguageIcons, 
  adjustTextShadowBasedOnSidebarColor, adjustColorBasedOnInversion,
  updateTimelineLine, 
} from './utils.js';



// 1️⃣ - Inicialización de todos los listeners del panel de personalización
export function setupPersonalizationListeners() {
  console.log('Inicializando listeners de personalización...');

  // 1️⃣.1️⃣ Cargar opciones en los <select>
  populateSelector(
    document.getElementById('font-family'),
    fonts,
    { getLabel: item => item.name, getValue: item => item.value }
  );
  populateSelector(
    document.getElementById('iconSelector'),
    ITEM_TEMPLATES,
    { getLabel: (item, key) => item.label, getValue: (item, key) => key }
  );

  // 1️⃣.2️⃣ Escuchar cambios en selectores dinámicos
  const selectors = [
    { id: 'theme-select',  storageKey: 'theme',       attribute: 'data-theme' },
    { id: 'view-selector-sidebar', storageKey: 'sidebarView', attribute: 'data-sidebar-view' },
    { id: 'view-selector-main', storageKey: 'format',      attribute: 'data-main-view' },
    { id: 'font-family',   storageKey: 'font',        attribute: 'font-family' },
  ];
  selectors.forEach(s => setupSelectorListener(s.id, s.storageKey, s.attribute));

  // 1️⃣.3️⃣ Sliders personalizados
  STYLE_SETTINGS.forEach(setting =>
    setupSliderListener(setting.id, setting.key, setting.cssVar, setting.suffix || '')
  );

  // 1️⃣.4️⃣ Botones de acción
  const buttons = [
    { id: 'reset-img-btn',             callback: setupResetImgButton },
    { id: 'reset-preferences-btn',     callback: resetPreferences },
    { id: 'close-personalization-btn', callback: () => handlePanelToggle({
                                            panelId: "personalization-panel",
                                            buttonSelector: ".personalize-btn",
                                            action: "close"
                                          }) 
    },
    { id: 'import-prefs-btn',          callback: () => document.getElementById('import-prefs-file').click() },
    { id: 'export-prefs-btn',          callback: exportCustomStyles },
    { id: 'toggle-print-break',        callback: setupPrintBreakToggle },
  ];
  buttons.forEach(b => setupButtonListener(b.id, b.callback));

  // 1️⃣.5️⃣ Importar preferencias desde archivo
  const fileInput = document.getElementById('import-prefs-file');
  if (fileInput) {
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) importCustomStyles(file);
      fileInput.value = '';  // Permitir reimportar el mismo archivo
    });
  }

  // 1️⃣.6️⃣ Inicializar sliders e íconos
  setSliderValuesFromStorageOrRoot();
  setupIconSelectorListener();

  // 1️⃣.7️⃣ Tipo de ícono por defecto
  if (!localStorage.getItem('selectedItemType')) {
    localStorage.setItem('selectedItemType', Object.keys(ITEM_TEMPLATES)[0]);
  }
  updateLevelIcons();

  // 1️⃣.8️⃣ Aplicar vista guardada o default al cargar (sidebar)
  const savedView = localStorage.getItem('sidebarView') || 'grid-view';
  document.body.setAttribute('data-sidebar-view', savedView);
  changeViewSidebar(savedView);

  // Inicializar el formato principal de visualización (main)
  setupFormatSelector();
}



// 2️⃣ - Helpers comunes
function setupSelectorListener(selectorId, storageKey, attribute) {
  const sel = document.getElementById(selectorId);
  if (!sel) return console.warn(`Selector ${selectorId} no encontrado`);

  let saved = localStorage.getItem(storageKey);

  if (!saved) {
    saved = 'grid-view'; // valor predeterminado
    localStorage.setItem(storageKey, saved);
  }

  sel.value = saved;
  document.body.setAttribute(attribute, saved);

  if (selectorId === 'view-selector-sidebar') changeViewSidebar(saved);

  sel.addEventListener('change', e => {
    const v = e.target.value;
    document.body.setAttribute(attribute, v);
    saveToLocalStorage(storageKey, v);
    if (selectorId === 'view-selector-sidebar') changeViewSidebar(v);
  });
}

// 2️⃣-1️⃣ - Cambiar vista del sidebar
function changeViewSidebar(viewType) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Opcional: solo útil si aplicás estilos globales al <aside id="sidebar">
  sidebar.classList.remove('list-view', 'grid-view', 'compact-view');
  sidebar.classList.add(viewType);

  const idiomaData = getCurrentIdiomaData();

  // Secciones del sidebar
  const sidebarSections = ['contacto', 'habilidades', 'idiomas', 'hobbies']; // Secciones para actualizar las vistas

  // 🔁 Renderizar secciones con los cambios de vista (agrega iconos e items de nivel a habilidades e idiomas exlcusivamente)
  sidebarSections.forEach(section => {
    const data = idiomaData[section];
    if (Array.isArray(data)) {
      renderArrayContent(section, data, viewType);

      // Solo mejorar ítems para habilidades e idiomas (que muestran niveles)
      if (['habilidades', 'idiomas'].includes(section)) {
        enhanceSectionItems(section, data, {
          type: section,
          renderItems,
          ...(section === 'idiomas' && { levelMap, totalItems: 6 }),
          ...(section === 'habilidades' && { totalItems: 5 })
        });
      }
    }
  });

  console.log(`Vista del sidebar cambiada a: ${viewType}`);
}

// 1️⃣ - Cambiar vista (formato) del main
export function setupFormatSelector() {
  const formatSelect = document.getElementById('view-selector-main');
  if (!formatSelect) {
    console.warn('[FormatSelector] No se encontró el selector #view-selector-main');
    return;
  }

  // ✅ Leer valor de localStorage
  const savedFormat = localStorage.getItem('maincardFormat') || 'list';
  console.log(`[FormatSelector] Formato guardado encontrado: "${savedFormat}"`);

  formatSelect.value = savedFormat;
  setSectionFormat(savedFormat); // aplica visualmente
  console.log(`[FormatSelector] Se aplicó el formato inicial: "${savedFormat}"`);

  // ✅ Escuchar cambios
  formatSelect.addEventListener('change', () => {
    const selected = formatSelect.value;
    console.log(`[FormatSelector] Cambio detectado en selector: "${selected}"`);

    setSectionFormat(selected);
    localStorage.setItem('maincardFormat', selected);

    console.log(`[FormatSelector] Formato actualizado y guardado en localStorage: "${selected}"`);
  });
}


export function setSectionFormat(mode) {
  const secciones = ['estudios', 'experiencia', 'logros'];
  console.log(`[SectionFormat] Aplicando formato "${mode}" a las secciones...`);

  secciones.forEach(id => {
    const container = document.getElementById(id);
    if (!container) {
      console.warn(`[SectionFormat] No se encontró la sección con ID: "${id}"`);
      return;
    }

    const items = container.querySelectorAll('.section-item-container');

    container.classList.toggle('lista-tabla', mode === 'list');
    container.classList.toggle('grid-tabla', mode === 'grid');

    items.forEach(item => {
      item.classList.toggle('list-view', mode === 'list');
      item.classList.toggle('grid-tabla', mode === 'grid');
    });

    localStorage.setItem(`${id}-format`, mode);
    console.log(`[SectionFormat] Formato "${mode}" aplicado a sección "${id}"`);
  });
  // (Opcional) Actualizar algún texto o estado visual si fuera necesario
}


// Función que Inicializa un control deslizante (slider) que modifica una variable CS
// y actualiza el DOM en tiempo real
function setupSliderListener(sliderId, storageKey, cssProperty, unit = '') {
  const slider = document.getElementById(sliderId);
  const root = document.documentElement;

  // ⚠️ Si no se encuentra el slider en el DOM, salimos con advertencia
  if (!slider) return console.warn(`Slider ${sliderId} no encontrado`);

  // 🔄 Cargar valor guardado desde localStorage (si existe) y aplicarlo
  const saved = localStorage.getItem(storageKey);
  if (saved !== null) {
    slider.value = saved;
    root.style.setProperty(cssProperty, `${saved}${unit}`);
  }

  // 🔢 Mostrar valor actual junto al slider (si hay display asociado)
  const display = document.getElementById(`${sliderId}-display`);
  if (display) display.textContent = `${slider.value}${unit}`;

  // 🎯 Listener para manejar cambios del usuario en el slider
  slider.addEventListener('input', e => {
    const v = e.target.value;
    const valueWithUnit = `${v}${unit}`;

    // 💾 Aplicar nuevo valor como variable CSS y guardarlo
    root.style.setProperty(cssProperty, valueWithUnit);
    localStorage.setItem(storageKey, v);

    // 📟 Mostrar nuevo valor en el display
    if (display) display.textContent = valueWithUnit;

    // 🛠️ Recalcular la línea del timeline si el tamaño de fuente cambió
    if (sliderId === 'font-size-slider') {
      setTimeout(updateTimelineLine, 0.5);
    } else {
      setTimeout(updateTimelineLine, 0);
    }

    // 🧠 🔄 Ajustar automáticamente color de texto o sombra si se cambia el color de fondo
    if (cssProperty === '--sidebar-background-color') {
      adjustColorBasedOnInversion('--sidebar-font-color', '--sidebar-background-color');
      adjustColorBasedOnInversion('--main-font-color', '--main-background-color');
      adjustTextShadowBasedOnSidebarColor(); // sombra según contraste
    }

    if (cssProperty === '--page-background-color') {
      adjustColorBasedOnInversion('--page-font-color', '--page-background-color');
    }
  });
}




function setupButtonListener(buttonId, callback) {
  const btn = document.getElementById(buttonId);
  if (btn) btn.addEventListener('click', callback);
  else console.warn(`Botón ${buttonId} no encontrado.`);
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}


// 4️⃣ Botones de acción del panel

// 4️⃣.1️⃣ Reset imagen — Unificada y genérica
export function setupResetImgButton() {
  const btn = document.getElementById('reset-img-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Obtiene la URL actual de la imagen (data URL o ruta)
    const img = document.getElementById('foto');
    const currentSrc = img?.src;
    if (!currentSrc) {
      alert('No hay imagen para restablecer');
      return;
    }

    // Limpia el estado guardado
    localStorage.removeItem('fotoOffsetX');
    localStorage.removeItem('fotoOffsetY');
    localStorage.removeItem('fotoScale');

    // Remover listeners viejos
    removeImageDragAndZoomListeners(img);

    // Vuelve a cargar la misma imagen, que disparará el centrado automático
    updatePhoto(currentSrc);

    alert('Imagen restablecida!');
  });
}


// 4️⃣.2️⃣ Reset preferencias
function resetPreferences_full() {
  localStorage.clear();  // Esto limpia todo el localStorage

  // FIX: Forzar a que la página aplique la vista 'grid-view' al recargar
  document.body.setAttribute('data-sidebar-view', 'grid-view');
  saveToLocalStorage('sidebarView', 'grid-view'); // Guardar el valor predeterminado en localStorage

  alert('Preferencias restablecidas!');
  location.reload();  // Recargar la página
}

// 1.9️⃣ Modificar el reset de preferencias
// Al resetear preferencias, también debemos aplicar la vista predeterminada correctamente
export function resetPreferences() {
  console.log('Reseteando preferencias...');

  // 1️⃣ Limpiar todo el localStorage
  localStorage.clear();

  // 2️⃣ Eliminar claves de estilos personalizados (por si se setearon antes del clear)
  STYLE_SETTINGS.forEach(setting => {
    localStorage.removeItem(setting.key);
    document.documentElement.style.removeProperty(setting.cssVar);
  });

  // 3️⃣ Eliminar claves manuales adicionales (solo por seguridad extra)
  const extraKeys = [
    'theme', 'format', 'font',
    'selectedItemType',
    'primaryColor', 'secondaryColor'
  ];
  extraKeys.forEach(k => localStorage.removeItem(k));

  // 4️⃣ Restaurar vista por defecto
  const defaultView = 'grid-view';
  localStorage.setItem('sidebarView', defaultView);
  document.body.setAttribute('data-sidebar-view', defaultView);
  changeViewSidebar(defaultView);  // Aplicar la vista visualmente

  // 5️⃣ Restaurar valores visuales de sliders
  setSliderValuesFromStorageOrRoot();
  updateLevelIcons();

  // 6️⃣ Restaurar selector visual de vista
  const viewSelector = document.getElementById('view-selector-sidebar');
  if (viewSelector) viewSelector.value = defaultView;

  console.log('Preferencias reseteadas');
  alert('Preferencias restablecidas!');
}


// 4️⃣.3️⃣ Cerrar panel  (similar a 'togglePersonalization' en main.js) -> Reemplaza la función handlePanelToggle
// export function handlePersonalization(action = "toggle") {
//   const panel = document.getElementById("personalization-panel");
//   const button = document.querySelector(".personalize-btn");

//   if (!panel || !button) return;

//   switch (action) {
//     case "open":
//       panel.classList.add("active");
//       button.classList.add("active");
//       break;

//     case "close":
//       panel.classList.remove("active");
//       button.classList.remove("active");
//       break;

//     case "toggle":
//     default:
//       const isActive = panel.classList.toggle("active");
//       button.classList.toggle("active", isActive);
//       break;
//   }
// }

// USO de la función handlePersonalization 
// handlePersonalization("toggle"); // Para alternar
// handlePersonalization("open"); // Para abrir
// handlePersonalization("close"); // Para cerrar


// —————————————————————————————————————————
// 4️⃣-5️⃣ Toggle “Evitar cortes en Impresión”
// —————————————————————————————————————————
/**
 * Inicializa el botón "Evitar cortes en Impresión".
 * - Carga el estado de localStorage al arrancar.
 * - Sincroniza la clase `no-print-break` en <body>.
 * - Actualiza el texto del botón según el estado.
 */
export function setupPrintBreakToggle() {
  const STORAGE_KEY = 'printNoBreak';
  const btn = document.getElementById('toggle-print-break');
  if (!btn) return console.warn('Botón #toggle-print-break no encontrado');

  // Aplicar estado guardado
  const enabled = localStorage.getItem(STORAGE_KEY) === 'true';
  document.body.classList.toggle('no-print-break', enabled);
  btn.textContent = enabled
    ? 'Permitir cortes en Impresión'
    : 'Evitar cortes en Impresión';

  // Enlazar clic para alternar
  if (!btn.dataset.listenerAdded) {
    btn.addEventListener('click', () => {
      const isEnabled = document.body.classList.toggle('no-print-break');
      localStorage.setItem(STORAGE_KEY, isEnabled);
      btn.textContent = isEnabled
        ? 'Permitir cortes en Impresión'
        : 'Evitar cortes en Impresión';
    });
    btn.dataset.listenerAdded = "true"; // evitar doble binding (doble-click para cambiar de estado)
  }
}


// 3.4️⃣ (Comentada) setupThemeChangeListener
function setupThemeChangeListener() { /* ... */ }

// 3.5️⃣ (Comentada) setupGeneralChangesListener
function setupGeneralChangesListener() { /* ... */ }


// 4️⃣ - Estado inicial de sliders
// function setSliderValuesFromStorageOrRoot() {
//   STYLE_SETTINGS.forEach(s => {
//     const saved = localStorage.getItem(s.key);
//     if (saved !== null) {
//       const el = document.getElementById(s.id);
//       if (el) {
//         el.value = saved;
//         const disp = document.getElementById(`${s.id}-display`);
//         if (disp) disp.textContent = `${saved}${s.suffix || ''}`;
//       }
//     }
//   });
// }

// 4️⃣ - Estado inicial de sliders
/**
 * Establece los valores de los inputs basándose en lo que hay en localStorage o en el valor actual
 * de los CSS vars.
 */
function setSliderValuesFromStorageOrRoot() {
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


// 5️⃣ - Iconos dinámicos
function setupIconSelectorListener(icon_selec = 'iconSelector', item_type = 'selectedItemType') {
  const sel = document.getElementById(icon_selec);
  if (!sel) return;
  const saved = localStorage.getItem(item_type);
  if (saved && ITEM_TEMPLATES[saved]) sel.value = saved;
  sel.addEventListener('change', e => {
    const v = e.target.value;
    localStorage.setItem(item_type, v);
    updateLevelIcons(item_type);
  });
}

function updateLevelIcons(item_type = 'selectedItemType') {
  const type = localStorage.getItem(item_type);
  if (!ITEM_TEMPLATES[type] || !window.cvData) return;

  const habEl = document.getElementById('habilidades');
  const idiEl = document.getElementById('idiomas');
  
  // Actualizamos habilidades si el contenedor existe
  if (habEl && window.cvData.habilidades) {
    enhanceSectionItems('habilidades', window.cvData.habilidades, {
      type: 'habilidades',
      renderItems,
      totalItems: 5
    });
  }

  // Actualizamos idiomas si el contenedor existe
  if (idiEl && window.cvData.idiomas) {
    enhanceSectionItems('idiomas', window.cvData.idiomas, {
      type: 'idiomas',
      levelMap,
      renderItems,
      totalItems: 6
    });
  }
}



// 6️⃣ - Export / Import de preferencias

// 4️⃣.4️⃣ Función para exportar las configuraciones actuales en JSON descargable

export function exportCustomStyles() {
  const config = {};
  STYLE_SETTINGS.forEach(({ key }) => {
    const v = localStorage.getItem(key);
    if (v !== null) config[key] = v;
  });
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'personalizacion.json';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Importa un JSON de preferencias y las aplica de inmediato.
 */
export function importCustomStyles(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const config = JSON.parse(ev.target.result);
      const root   = document.documentElement;
      STYLE_SETTINGS.forEach(({ cssVar, key, suffix = '' }) => {
        const v = config[key];
        if (v !== undefined) {
          root.style.setProperty(cssVar, v);
          localStorage.setItem(key, v);
        }
      });
      setSliderValuesFromStorageOrRoot();
      // Si tienes función para ajustar sombras:
      if (typeof adjustTextShadowBasedOnSidebarColor === 'function') {
        adjustTextShadowBasedOnSidebarColor();
      }
    } catch (err) {
      console.error('Error al importar JSON:', err);
      alert('El archivo no es válido o está dañado.');
    }
  };
  reader.readAsText(file);
}

