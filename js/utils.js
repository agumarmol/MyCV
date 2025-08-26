// utils.js

// ---------------------------------------------
// 🔤 Fuentes disponibles para personalizar
// ---------------------------------------------
export const fonts = [
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'EB Garamond', value: "'EB Garamond', serif" },
  { name: 'Arial', value: "'Arial', sans-serif" },
  { name: 'Courier New', value: "'Courier New', monospace" },
  { name: 'Roboto', value: "'Roboto', sans-serif" },
  { name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { name: 'Lora', value: "'Lora', serif" },
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Fira Sans', value: "'Fira Sans', sans-serif" }
];

export const FONT_LINKS = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap",
  "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap",
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;700&display=swap",
  "https://use.fontawesome.com/releases/v5.15.4/css/all.css",
  ];

// ---------------------------------------------
// Banderas e idiomas
// ---------------------------------------------

export const flagMap = {
  es: 'https://flagcdn.com/w40/es.png', // Español
  en: 'https://flagcdn.com/w40/us.png', // Inglés (EE. UU.)
  de: 'https://flagcdn.com/w40/de.png', // Alemán
  it: 'https://flagcdn.com/w40/it.png', // Italiano
  fr: 'https://flagcdn.com/w40/fr.png', // Francés
  pl: 'https://flagcdn.com/w40/pl.png', // Polaco
  zh: 'https://flagcdn.com/w40/cn.png', // Chino
  ja: 'https://flagcdn.com/w40/jp.png', // Japonés
  ru: 'https://flagcdn.com/w40/ru.png', // Ruso
  pt: 'https://flagcdn.com/w40/pt.png', // Portugués
  ar: 'https://flagcdn.com/w40/sa.png', // Árabe
  ko: 'https://flagcdn.com/w40/kr.png', // Coreano
  nl: 'https://flagcdn.com/w40/nl.png', // Neerlandés
  tr: 'https://flagcdn.com/w40/tr.png', // Turco
  sv: 'https://flagcdn.com/w40/se.png', // Sueco
  no: 'https://flagcdn.com/w40/no.png', // Noruego
  fi: 'https://flagcdn.com/w40/fi.png', // Finés
  el: 'https://flagcdn.com/w40/gr.png', // Griego
  hi: 'https://flagcdn.com/w40/in.png', // Hindi
  he: 'https://flagcdn.com/w40/il.png'  // Hebreo
};

export const idiomaApaísMap = {
  es: 'es', // Español -> España
  en: 'us', // Inglés -> Estados Unidos
  de: 'de', // Alemán -> Alemania
  it: 'it', // Italiano -> Italia
  fr: 'fr', // Francés -> Francia
  pl: 'pl', // Polaco -> Polonia
  zh: 'cn', // Chino -> China
  ja: 'jp', // Japonés -> Japón
  ru: 'ru', // Ruso -> Rusia
  pt: 'pt', // Portugués -> Portugal
  ar: 'sa', // Árabe -> Arabia Saudita
  ko: 'kr', // Coreano -> Corea del Sur
  nl: 'nl', // Neerlandés -> Países Bajos
  tr: 'tr', // Turco -> Turquía
  sv: 'se', // Sueco -> Suecia
  no: 'no', // Noruego -> Noruega
  fi: 'fi', // Finés -> Finlandia
  el: 'gr', // Griego -> Grecia
  hi: 'in', // Hindi -> India
  he: 'il'  // Hebreo -> Israel
    // Añadir más si es necesario
};

export const idiomaNombresMap = {
    es: 'Español',
    en: 'English',
    de: 'Deutsch',
    it: 'Italiano',
    fr: 'Français',
    pl: 'Polski',
    zh: '中文'
  };

// ---------------------------------------------
// ⭐️ Plantillas de íconos para los niveles
// ---------------------------------------------
export const ITEM_TEMPLATES = {
    star:   { label: 'Estrella', full: '<i class="fas fa-star"></i>', empty: '<i class="far fa-star"></i>' },
    heart:  { label: 'Corazón',  full: '<i class="fas fa-heart"></i>', empty: '<i class="far fa-heart"></i>' },
    circle: { label: 'Círculo',  full: '●', empty: '○' },
    brain:  { label: 'Cerebro',  full: '<i class="fas fa-brain"></i>', empty: '<i class="fas fa-brain"></i>' },
    bolt:   { label: 'Rayo',     full: '<i class="fas fa-bolt"></i>', empty: '<i class="fas fa-bolt"></i>' },
    drop:   { label: 'Gota',     full: '<i class="fas fa-tint"></i>', empty: '<i class="fas fa-tint"></i>' },
    gauge:  { label: 'Tacómetro',full: '<i class="fas fa-tachometer-alt"></i>', empty: '<i class="fas fa-tachometer-alt"></i>' }
  };

// ---------------------------------------------
// Lista de todos los controles de configuración
// ---------------------------------------------

export const STYLE_SETTINGS = [
  // { id: 'page-background-color', cssVar: '--page-background-color', key: 'backgroundColor' },
  { id: 'main-background-color', cssVar: '--main-background-color', key: 'mainBackgroundColor' },
  { id: 'sidebar-background-color', cssVar: '--sidebar-background-color', key: 'sidebarBackgroundColor' },
  { id: 'title-background-color', cssVar: '--section-title-bg-color', key: 'titleBackgroundColor'},
  { id: 'main-font-color', cssVar: '--main-font-color', key: 'mainfontColor' },
  { id: 'sidebar-font-color', cssVar: '--sidebar-font-color', key: 'sidebarFontColor' },
  { id: 'title-font-color', cssVar: '--section-title-font-color', key: 'titleFontColor'},
  { id: 'font-family', cssVar: '--font-family', key: 'fontFamily' },
  { id: 'font-size-slider', cssVar: '--font-size-base', key: 'fontSize', suffix: 'px' },
  { id: 'section-padding-horizontal-slider', cssVar: '--section-padding-inline', key: 'sectionPaddingHorizontal', suffix: 'vw' },
  { id: 'section-padding-vertical-slider', cssVar: '--section-padding-block', key: 'sectionPaddingVertical', suffix: 'vw' },
  { id: 'card-size-slider', cssVar: '--card-size-scale', key: 'CardSizeSlider' },
  { id: 'card-gap-slider', cssVar: '--card-gap', key: 'CardGap', suffix: 'vw' },
  { id: 'view-selector-sidebar', cssVar: '--sidebar-view', key: 'sidebarView' },
  { id: 'foto-size-slider', cssVar: '--foto-size', key: 'fotoSize', suffix: '%' },
  { id: 'foto-radius-slider', cssVar: '--foto-radius', key: 'fotoRadius', suffix: '%' },
  { id: 'foto-aspect-slider', cssVar: '--foto-aspect', key: 'fotoAspect' }
];

// ---------------------------------------------
// 📚 Mapa de niveles de idioma
// ---------------------------------------------
export const levelMap = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };


// ------------------------------------------------------------------

// Funciones para el index.html
// handleImageError

// Función para ocultar imagen en caso de no haber una
export function handleImageError() {
  const img = document.getElementById('foto');
  const placeholder = document.getElementById('foto-placeholder');
  if (img) img.classList.remove('visible');
  if (placeholder) {
    placeholder.textContent = 'Image not found or not available';
    placeholder.style.display = 'flex';
  }
}

// ------------------------------------------------------------------


// Funciones comunes para main.js y personalization.js

// 8️⃣ Ajustar la sombra de texto según el color del sidebar (utiliza isLightColor)
export function adjustTextShadowBasedOnSidebarColor() {
  // Ajusta la sombra del texto según el color de la fuente del sidebar
  const root = document.documentElement;
  const sidebarColor = getComputedStyle(root).getPropertyValue('--sidebar-background-color').trim();

  if (isLightColor(sidebarColor)) {
      root.style.setProperty('--text-shadow-items-level', 'var(--text-shadow-black)');
  } else {
      root.style.setProperty('--text-shadow-items-level', 'var(--text-shadow-white)');
  }
}
  

// Función general para ajustar el color basado en la luz u oscuridad de otro color
export function adjustColorBasedOnInversion(targetProperty, referenceProperty) {
  const root = document.documentElement;

  // Obtener el valor del color de referencia
  const referenceColor = getComputedStyle(root).getPropertyValue(referenceProperty).trim();

  // Revisar si el color de referencia es claro o oscuro
  if (isLightColor(referenceColor)) {
      // Si es claro, asignamos el color oscuro inverso al objetivo
      const invertedColor = invertColor(referenceColor);
      root.style.setProperty(targetProperty, invertedColor);  // Asignar el color invertido
  } else {
      // Si es oscuro, asignamos el color claro inverso al objetivo
      const invertedColor = invertColor(referenceColor);
      root.style.setProperty(targetProperty, invertedColor);  // Asignar el color invertido
  }
}

// 9️⃣ Comprobar si el color es claro o oscuro
/**
 * Verifica si un color es claro (para ajustar la sombra de texto en función de él).
 * @param {string} color - El color en formato hexadecimal (#rrggbb).
 * @returns {boolean} - Devuelve true si el color es claro, false si es oscuro.
 */

function isLightColor(color) {
    // Eliminar los espacios en blanco y convertir a minúsculas
    color = color.trim().toLowerCase();

    // Solo manejar colores hexadecimales por ahora (#rrggbb)
    if (color.startsWith('#')) {
        // Expande los hexadecimales cortos (#fff -> #ffffff)
        if (color.length === 4) {
        color = '#' + color[1]+color[1] + color[2]+color[2] + color[3]+color[3];
        }

        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        
        // Calcula el brillo percibido
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128; // claro si el brillo es mayor a 128
    }

    // Si no es un color hexadecimal, se considera claro por defecto
    return true;
}


// Función para invertir el color en formato RGB
function invertColor(hex) {
  // Asegurarnos de que el color esté en formato hex
  if (!/^#[0-9A-F]{6}$/i.test(hex)) return hex;  // Retornar si no es un color hex válido

  // Convertir el color hex a RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Invertir los valores RGB
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;

  // Convertir los valores RGB de vuelta a formato hex
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

// ------------------------------------------------------------------

// Funciones exclusiavemente usadas en main.js:
// setTheme, setupSectionFormatLoading, setupResizer, setupToggleSections, adjustTextShadowBasedOnSidebarColor, changeTopbarOnScroll, updateTimelineLine, 

// ---------------------------------------------
// 2️⃣ 1 Cambiar el tema (Light/Dark)
// ---------------------------------------------
export function setTheme(theme) {
  const body = document.body; // Modificamos el atributo data-theme del body

  // Detectar dinámicamente los temas del <select>
  const select = document.getElementById('theme-select');
  const themes = Array.from(select.options).map(option => option.value);

  // Validación y alerta si el tema no está definido
  if (!themes.includes(theme)) {
    console.warn(`⚠️ El tema "${theme}" no coincide con las opciones disponibles en el <select>.`);
    debugger;  // Agregar un debugger para verificar el valor de `theme`
    return;
  }

  // Eliminar todos los temas anteriores (en el caso de que haya un atributo data-theme ya asignado)
  themes.forEach(t => body.removeAttribute('data-theme'));

  // Aplicar el nuevo tema
  body.setAttribute('data-theme', theme);

  // Guardar en localStorage
  localStorage.setItem('selectedTheme', theme);
}




// ---------------------------------------------
// 1️⃣ 2 Aplicar el formato guardado (lista o tabla) al cargar
// ---------------------------------------------

export function setupSectionFormatLoading() {
  const secciones = ['estudios', 'experiencia', 'logros'];

  secciones.forEach(id => {
    const container = document.getElementById(id);
    const savedFormat = localStorage.getItem(`${id}-format`);
    if (container) {
      container.classList.toggle('lista-tabla', savedFormat === 'lista');
      container.classList.toggle('grid-tabla', savedFormat !== 'lista');
    }
  });

  // 🔁 Actualizamos el texto del botón según el formato activo
  const btn = document.getElementById('toggle-format-btn');
  if (btn) {
    const anyLista = secciones.some(id => {
      const c = document.getElementById(id);
      return c?.classList.contains('lista-tabla');
    });
    btn.textContent = anyLista ? 'Cambiar a formato tabla' : 'Cambiar a formato lista';
  }
}


// ---------------------------------------------
// 6️⃣ 3 Sidebar resizer
// ---------------------------------------------
let isResizing = false;
let lastWidth = null;

export function setupResizer() {
    const sidebar = document.querySelector('.sidebar');
    const resizer = document.querySelector('.resizer');
    if (!sidebar || !resizer) return;

    // ⬇️ Cargar (recuperar) ancho desde localStorage
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) {
      sidebar.style.width = `${savedWidth}px`;
    }

    sidebar.classList.add('resizable');
    resizer.addEventListener('mousedown', startResizing);
    resizer.addEventListener('touchstart', startResizing, { passive: false });
}

function startResizing(e) {
    isResizing = true;
    document.body.classList.add('resizing');

    document.addEventListener('mousemove', handleResizing);
    document.addEventListener('mouseup', stopResizing);
    document.addEventListener('touchmove', handleResizing, { passive: false });
    document.addEventListener('touchend', stopResizing);
}

function handleResizing(e) {
    if (!isResizing) return;
    const x = e.clientX || (e.touches?.[0]?.clientX);
    const newWidth = Math.max(300, Math.min(700, x));
    if (newWidth !== lastWidth) {
        document.querySelector('.sidebar').style.width = `${newWidth}px`;
        lastWidth = newWidth;
    }
}

function stopResizing() {
    // Guarda el valor en LocalStorage
    if (lastWidth !== null) {
        localStorage.setItem('sidebarWidth', lastWidth);
    }

    isResizing = false;
    lastWidth = null;
    document.body.classList.remove('resizing');

    document.removeEventListener('mousemove', handleResizing);
    document.removeEventListener('mouseup', stopResizing);
    document.removeEventListener('touchmove', handleResizing);
    document.removeEventListener('touchend', stopResizing);
}

// ---------------------------------------------
// 4. Secciones colapsables
// ---------------------------------------------
export function setupToggleSections(ids = []) {
  const allToggles = ids.length 
    ? ids.map(id => document.querySelector(`#${id} .title-container`)).filter(Boolean)
    : [...document.querySelectorAll('.title-container')];
  
  allToggles.forEach(el => {
    const wrapper = el.parentElement;
    const content = el.nextElementSibling;
    const isTimeline = wrapper.id === 'timelineSection';
    const open = JSON.parse(localStorage.getItem('openSections') || '[]');
  
    // Estado inicial
    const isOpen = open.includes(wrapper.id);
    content.style.display = isOpen || wrapper.id === 'fotoSection' ? '' : 'none';
    if (isTimeline && isOpen) {
      renderTimeline();
      setupTimelineObserver();
      window.addEventListener('resize', updateTimelineLine);
    }
  
    // Configura el evento 'resize'
    el.addEventListener('click', () => {
      toggleSection(el);
      if (isTimeline && content.style.display !== 'none') {
        renderTimeline();
        setupTimelineObserver();
        window.addEventListener('resize', updateTimelineLine);
      }
    });
  });
  }
  
  
  // 4.1 - Función para expandir/colapsar una sección y guardar su estado en localStorage
  function toggleSection(el) {
    const wrapper = el.closest('.section');
    const content = wrapper?.querySelector('.content-container');
    if (!content) return;
  
    // alternar visibilidad
    const isVisible = window.getComputedStyle(content).display !== 'none';
    content.style.display = isVisible ? 'none' : 'block';
  
    // gestionar openSections en localStorage
    const sectionId = wrapper?.id;
    const openSections = JSON.parse(localStorage.getItem('openSections') || '[]');
    if (sectionId) {
      if (!isVisible) {
        // Si la sección se abrió, la agregamos a la lista
        if (!openSections.includes(sectionId)) openSections.push(sectionId);
      } else {
        // Si se cerró, la removemos
        const index = openSections.indexOf(sectionId);
        if (index !== -1) openSections.splice(index, 1);
      }
      localStorage.setItem('openSections', JSON.stringify(openSections));
    }
  }
  
  
  // 4.2 Función para renderizar el timeline
  /**
   * Renderiza la línea de tiempo en #timelineSection.
   * Ahora inyecta un <div class="timeline-line"></div> antes de los eventos,
   * para capturar hover sobre la línea.
   */
  
  function renderTimeline() {
    console.log('▶️ renderTimeline')
    const timelineContainer = document.querySelector('#timelineSection .timeline-visual');
    const timelineSection = document.getElementById('timelineSection');
  
    if (!timelineContainer || !timelineSection) {
      console.warn(`❌ Contenedor del timeline ${timelineContainer} no encontrado`);
      return;
    }
  
    if (typeof cvData === 'undefined') {
      console.error(`❌ cvData no está definido: ${cvData}`);
      return;
    }
  
    const events = [];
  
    // Procesar Estudios
    if (Array.isArray(cvData.estudios)) {
      cvData.estudios.forEach(e => {
        events.push({
          tipo: 'estudio',
          titulo: e.titulo,
          subtitulo: e.instituto,
          fecha: e.fecha,
          icono: '🎓'
        });
      });
    }
  
    // Procesar Experiencia
    if (Array.isArray(cvData.experiencia)) {
      cvData.experiencia.forEach(e => {
        events.push({
          tipo: 'experiencia',
          titulo: e.puesto,
          subtitulo: e.empresa,
          fecha: e.fecha,
          icono: '💼'
        });
      });
    }
  
    // Procesar Logros
    if (Array.isArray(cvData.logros)) {
      cvData.logros.forEach(l => {
        events.push({
          tipo: 'logro',
          titulo: l.titulo,
          subtitulo: '',
          fecha: l.fecha,
          icono: '🏆'
        });
      });
    }
  
    // Si no hay eventos, ocultamos la sección
    if (events.length === 0) {
      timelineSection.classList.add('oculto');
      return;
    } else {
      timelineSection.classList.remove('oculto');
    }
  
    // Ordenar cronológicamente por año
    events.sort((a, b) => {
      const getYear = str => parseInt((str || '').match(/\d{4}/)?.[0]) || 0;
      return getYear(b.fecha) - getYear(a.fecha); // Invertimos el orden
    });
  
    // Inyectar la linea y Renderizar eventos
    timelineContainer.innerHTML = `
    <div class="timeline-line"></div>
    ${events.map(ev => `
      <div class="event fade-in ${ev.tipo}">
        <div class="date">${ev.fecha}</div>
        <div class="icon-wrapper">
          <div class="icon">${ev.icono}</div>
        </div>
        <div class="content">
          <div class="title">${ev.titulo}</div>
          <div class="subtitle">${ev.subtitulo}</div>
        </div>
      </div>
    `).join('')}
  `;
  
    // ¡Clave! Una vez insertado el HTML, actualizamos la posición de la línea:
    updateTimelineLine();
  }
  
  // 📅 4.2 Función para Mostrar la Línea de tiempo
  function setupTimelineObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Opcional: dejar de observar una vez visible
        }
      });
    }, {
      root: null,
      threshold: 0.1
    });
  
    document.querySelectorAll('.timeline .event').forEach(event => {
      observer.observe(event);
    });
  }



// ---------------------------------------------
// 5 Función para cambiar la clase de la topbar al hacer scroll
// ---------------------------------------------

export function changeTopbarOnScroll() {
  window.addEventListener('scroll', function() {
    const topbar = document.querySelector('.topbar');  // Asegúrate de que .topbar es la clase correcta de tu topbar

    if (window.scrollY > 50) {
      topbar.classList.add('scrolled');  // Agrega clase para cambiar el estilo
    } else {
      topbar.classList.remove('scrolled');
    }
  });
}


// ---------------------------------------------
// 6 Función para recalcular la posición de la linea del timeline
// ---------------------------------------------
/**
 * Calcula y ajusta la posición horizontal de la línea vertical
 * para que quede centrada bajo el icon-wrapper.
 */
export function updateTimelineLine() {
  // Esperamos al repintado
  requestAnimationFrame(() => {
    const timeline = document.querySelector('#timelineSection .timeline-visual');

    // Validamos si existe la linea del tiempo
    if (!timeline) {
      console.warn(`❌ Linea del Timeline ${timeline} no encontrada.`);
      return;
    }

    setTimeout(0.25)

    // Seleccionamos el primer icon-wrapper
    const firstIcon = timeline.querySelector('.icon-wrapper');
    if (!firstIcon) return;

    // Obtenemos rects para cálculo relativo
    const timelineRect = timeline.getBoundingClientRect();
    const iconRect = firstIcon.getBoundingClientRect();

    // Recalculamos la posición del icono teniendo en cuenta el tamaño de la fuente y padding
    const centerX = (iconRect.left - timelineRect.left) + (iconRect.width / 2);

    // Ahora incluimos también el desplazamiento en Y de la línea, teniendo en cuenta el tamaño de la fuente y padding
    const timelinePaddingTop = parseFloat(window.getComputedStyle(timeline).paddingTop);
    const fontSize = parseFloat(getComputedStyle(document.body).fontSize); // Obtener el tamaño de la fuente actual

    // Calculamos el nuevo desplazamiento de la línea (considerando fuente y padding)
    const adjustedCenterY = (iconRect.top - timelineRect.top) + (iconRect.height / 2) + timelinePaddingTop + fontSize;

    // Actualizamos la variable CSS de la línea
    timeline.style.setProperty('--timeline-line-left', `${centerX}px`);
    timeline.style.setProperty('--timeline-line-top', `${adjustedCenterY}px`);
  });
}

// ---------------------------------------------
// 6 Función para configurar botones de ocultamiento para las secciones
// ---------------------------------------------

export function setupHideSectionButtons() {
  const HIDDEN_KEY = 'hiddenSections';

  // Restaurar visibilidad según localStorage
  const hiddenSections = JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]');
  hiddenSections.forEach(id => {
    const section = document.getElementById(id);
    if (section) section.classList.add('hidden-section');
  });

  // Insertar botones en todas las secciones
  document.querySelectorAll('.section').forEach(section => {
    if (!section.id) return;

    // Evitar insertar el botón si ya existe
    if (section.querySelector('.hide-section-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'hide-section-btn';
    btn.textContent = '✖';
    btn.title = 'Hide Section';

    // Insertar en el header de la sección
    // const header = section.querySelector('.title-container') || section.firstElementChild;
    const header = section.querySelector('.title-container') || section;

    if (header) {
      header.style.position = 'relative';
      btn.style.position = 'absolute';
      btn.style.top = '0.2em';
      btn.style.right = '0.2em';
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.style.color = '#aaa';
      btn.style.fontSize = '1rem';

      btn.addEventListener('click', () => {
        section.classList.add('hidden-section');
        const current = JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]');
        if (!current.includes(section.id)) {
          current.push(section.id);
          localStorage.setItem(HIDDEN_KEY, JSON.stringify(current));
        }
      });

      header.appendChild(btn);
    }
  });
}



// ------------------------------------------------------------------

// Funciones exclusiavemente usadas en cvLoaders.js:
// loadFonts, setupImageDragAndZoom, enhanceSkillIcons, enhanceLanguageIcons, renderIcon

// 1. Función para cargar las fuentes en el documento
export function loadFonts() {
  FONT_LINKS.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.type = 'text/css';
    document.head.appendChild(link);

    link.onload = () => {
      console.log(`Fuente cargada: ${fontUrl}`);
    };
    link.onerror = () => {
      console.error(`Error al cargar fuente: ${fontUrl}`);
    };
  });
}



// // 3. Función para mejorar los iconos de habilidades
// export function enhanceSkillIcons(container = document.getElementById('habilidades'), list = idiomaData.habilidades || []) {
//   // Seleccionamos todos los elementos que contienen una habilidad en el contenedor
//   const items = container.querySelectorAll('.item-habilidades');

//   // Iteramos sobre cada elemento de habilidad
//   items.forEach((el, index) => {
//     // Obtenemos los datos de la habilidad correspondientes de la lista
//     const data = list[index];
    
//     // Si no hay datos para esa habilidad, salimos de la iteración
//     if (!data) return;

//     // PARTE 1: INSERTAR ICONO
//     // Buscamos el elemento que contiene el icono (ahora es .item-icon-container)
//     const iconContainer = el.querySelector('.item-icon-container'); // Cambiado a .item-icon-container
    
//     // Si encontramos el contenedor del icono y hay un dato de icono en los datos, lo actualizamos
//     if (iconContainer) {
//       if (data.icono) {
//         // reconstruimos sólo el <i> manteniendo siempre la clase "item-icon"
//         iconContainer.innerHTML = `<i class="item-icon ${data.icono}"></i>`; // Usamos el icono de los datos
//       } else {
//         console.warn(`enhanceSkillIcons: data.icono undefined para índice ${index}.`);
//       }
//     } else {
//       console.warn(`enhanceSkillIcons: no se encontró '.item-icon-container' en elemento ${index}.`);
//     }

//     // PARTE 2: GENERAR ITEMS DE NIVEL
//     // Buscamos el elemento que contiene el valor de la habilidad
//     const valorEl = el.querySelector('.item-value');
//     // Si encontramos el valor, lo actualizamos con el nivel de habilidad
//     if (valorEl) {
//       valorEl.innerHTML = renderItems(data.nivel || 0, 5);  // Usamos directamente el nivel
//       valorEl.style.setProperty('--total-items', 5); // Establecemos el número total de íconos (5 en este caso)
//     } else {
//       console.warn(`enhanceSkillIcons: no se encontró '.item-value' en elemento ${index}.`);
//     }
//   });
// }



// // 4. Función para actualizar los iconos y flags de los idiomas ya renderizados
// export function enhanceLanguageIcons(
//   container = document.getElementById('idiomas'), 
//   list = idiomaData.idiomas || []
// ) {
//   // Si no encuentra el id idiomas
//   if (!container) {
//     console.warn('enhanceLanguageIcons: contenedor "#idiomas" no encontrado.');
//     return;
//   }
//   // Seleccionamos todos los elementos que contienen un idioma en el contenedor
//   const items = container.querySelectorAll('.item-idiomas');
//   if (items.length === 0) {
//     console.warn('enhanceLanguageIcons: no se encontraron elementos con la clase ".item-idiomas".');
//   }

//   // Iteramos sobre cada elemento de idioma
//   items.forEach((el, index) => {
//     // Obtenemos los datos del idioma correspondientes de la lista
//     const data = list[index];
    
//     // Si no hay datos para ese idioma, salimos de la iteración
//     if (!data) {
//       console.warn(`enhanceLanguageIcons: falta dato para el índice ${index}.`);
//       return;
//     }

//     // PARTE 1: INSERTAR ICONO (BANDERA)
//     // Buscamos el contenedor del ícono
//     const iconSpan = el.querySelector('.item-idiomas .item-icon');

//     // Si encontramos el contenedor del icono y tenemos un código de idioma en los datos
//     if (iconSpan && data.codigo) {
//       iconSpan.classList.remove('fa-language'); // Borra clase no deseada
//       // Si encontramos el data.codigo
//       if (data.codigo) {
//         iconSpan.classList.remove('fa-language'); // Borra clase no deseada
        
//         // Reemplazamos el contenido HTML del contenedor con la imagen de la bandera correspondiente
//         iconSpan.innerHTML = `<img src="${flagMap[data.codigo]}" alt="${data.idioma}" class="flag-icon" />`;
//       } else {
//         console.warn(`enhanceLanguageIcons: data.codigo undefined para índice ${index}.`);
//       }
//     } else {
//       console.warn(`enhanceLanguageIcons: no se encontró '.item-icon' en elemento ${index}.`);
//     }

//     // PARTE 2: GENERAR ITEMS DE NIVEL
//     // Buscamos el elemento que contiene el valor de conocimiento del idioma
//     const valorEl = el.querySelector('.item-value');
    
//     // Si encontramos el valor, lo actualizamos con el nivel del idioma
//     if (valorEl) {
//       // Usamos `levelMap` para obtener el nivel correspondiente y lo pasamos a la función `renderItems`
//       valorEl.innerHTML = renderItems(levelMap[data.nivel] || 0, 6);
//       valorEl.style.setProperty('--total-items', 6); // Establecemos el número total de íconos (6 en este caso)
//     } else {
//       console.warn(`enhanceLanguageIcons: no se encontró '.item-value' ni '.item-value' en elemento ${index}.`);
//     }
//   });
// }


export function enhanceSectionItems(section, list = [], options = {}) {
  const container = document.getElementById(section);
  if (!container) {
    console.warn(`enhanceSectionItems: contenedor "#${section}" no encontrado.`);
    return;
  }

  const items = container.querySelectorAll('.section-item-container');
  if (items.length === 0) {
    console.warn(`enhanceSectionItems: no se encontraron elementos en "#${section}"`);
  }

  items.forEach((el, index) => {
    const data = list[index];
    if (!data) {
      console.warn(`enhanceSectionItems: falta dato para el índice ${index}.`);
      return;
    }

    // ---------------------
    // ICONO / BANDERA
    // ---------------------
    const iconContainer = el.querySelector('.item-icon-container, .item-left.icon-item');
    if (iconContainer) {
      if (options.type === 'idiomas' && data.codigo && flagMap[data.codigo]) {
        iconContainer.innerHTML = `<img src="${flagMap[data.codigo]}" alt="${data.idioma}" class="flag-icon" />`;     
      } else if (data.icono) {
        iconContainer.innerHTML = `<i class="item-icon ${data.icono}"></i>`;
      } else {
        console.warn(`enhanceSectionItems: sin icono válido en índice ${index}`);
      }
    }

    // ---------------------
    // NIVEL EN ICONOS
    // ---------------------
    const valorEl = el.querySelector('.item-value');
    if (valorEl) {
      let nivel = data.nivel;

      if (options.levelMap) {
        nivel = options.levelMap[nivel] ?? 0;
      }

      if (options.renderItems && typeof options.renderItems === 'function') {
        valorEl.innerHTML = options.renderItems(nivel, options.totalItems || 5);
        valorEl.style.setProperty('--total-items', options.totalItems || 5);
      } else {
        valorEl.innerText = nivel;
      }
    }
  });
}


// 4.1. Función para renderizar los íconos en función del tipo de ícono y el nivel
export function renderItems(filled, total) {
  // Recuperamos el tipo de ícono seleccionado por el usuario desde el almacenamiento local, o usamos 'star' por defecto
  const type = localStorage.getItem('selectedItemType') || 'star'; 

  // Obtenemos la plantilla de íconos correspondiente a ese tipo
  const tpl = ITEM_TEMPLATES[type];

  // Si la plantilla no es válida, mostramos un warning en consola y usamos 'star' como valor predeterminado
  if (!tpl) {
    console.warn(`Tipo de ícono "${type}" no válido. Usando 'star' por defecto.`);
  }

  // Usamos la plantilla por defecto si no existe la plantilla especificada
  const template = tpl || ITEM_TEMPLATES['star'];

  // Generamos un array con los íconos llenos o vacíos en función del nivel
  return Array.from({ length: total }, (_, i) => {
    const isFull = i < filled; // Comprobamos si este ícono debe estar lleno (basado en el nivel)
    
    // Escogemos el HTML adecuado para un ícono lleno o vacío
    const html = isFull ? template.full : template.empty;

    // Devolvemos el ícono con la clase 'filled' o 'empty' según corresponda
    return `<span class="item-level ${isFull ? 'filled' : 'empty'}">${html}</span>`;
  }).join(''); // Unimos todos los íconos generados en una cadena
}

// Función para Renderizar listas dinámicas de iconos o imágenes
export function renderIcon(icono, alt = '') {
  if (!icono) return '';
  const iconClass = flagMap[icono] ? 'flag-icon' : '';
  const iconElement = flagMap[icono] 
    ? `<img src="${flagMap[icono]}" alt="${alt}" class="item-img ${iconClass}" />` 
    : `<i class="item-icon ${iconClass} ${icono}"></i>`;
  
  return `<div class="item-icon-container">${iconElement}</div>`;
}

// // Función para Renderizar listas dinámicas de iconos o imagenes (Vieja)
// export function renderIcon(icono, alt = '') {
//   if (!icono) return '';
//   return flagMap[icono]
//     ? `<span class="item-icon"><img src="${flagMap[icono]}" alt="${alt}" class="flag-icon" /></span>` // IMPORTANTE: Si hay banderas devuelve un tipo 'img' (imagen)
//     : `<span class="item-icon"><i class="${icono}"></i></span>`; // Si no hay banderas entonces devuelve un tipo 'i' (icono)
// }




// ------------------------------------------------------------------

// Funciones exclusiavemente usadas en personalization.js:
// loadFonts, setupImageDragAndZoom, enhanceSkillIcons, enhanceLanguageIcons, renderIcon


/**
 * Llena un <select> con un array u objeto de datos
 */
export function populateSelector(selectElement, data, { getLabel, getValue }) {
  if (!selectElement) {
    console.warn('Elemento select no encontrado para poblar selector');
    return;
  }

  selectElement.innerHTML = ''; // Limpia el select

  if (Array.isArray(data)) {
    data.forEach(item => {
      const option = document.createElement('option');
      option.textContent = getLabel(item);
      option.value = getValue(item);
      selectElement.appendChild(option);
    });
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      const option = document.createElement('option');
      option.textContent = getLabel(value, key);
      option.value = getValue(value, key);
      selectElement.appendChild(option);
    });
  }
}






// ------------------------------------------------------------------

// Funciónes no usadas


// ---------------------------------------------
// 2️⃣ Alternar entre formato tabla y lista manualmente (desde botón)
// ---------------------------------------------
// Esta funcionalidad se usaba en el botón.. que lo desactivamos y lo cambiamos por esta función 'setSectionFormat'
// export function toggleAllSectionFormats() {
//   const secciones = ['estudios', 'experiencia', 'logros'];

//   secciones.forEach(id => {
//     const container = document.getElementById(id);
//     if (!container) return;

//     // Si no hay formato guardado, asignamos el formato por defecto (en este caso 'lista')
//     const savedFormat = localStorage.getItem(`${id}-format`);
//     const isLista = savedFormat !== 'grid'; // Si no hay formato guardado, por defecto es 'lista'

//     // Alternamos las clases
//     container.classList.toggle('lista-tabla', isLista);
//     container.classList.toggle('grid-tabla', !isLista);

//     // Guardamos el nuevo formato en localStorage
//     const nuevoFormato = isLista ? 'grid' : 'lista';
//     localStorage.setItem(`${id}-format`, nuevoFormato);
//   });

//   // Actualizamos el texto del botón después del cambio
//   const btn = document.getElementById('toggle-format-btn');
//   if (btn) {
//     const anyLista = secciones.some(id => {
//       const c = document.getElementById(id);
//       return c?.classList.contains('lista-tabla');
//     });
//     btn.textContent = anyLista ? 'Cambiar a formato tabla' : 'Cambiar a formato lista';
//   }
// }


// 3️⃣ Convertir RGB a Hex (No usada)
export function rgbToHex(rgb) {
    const result = /^rgb\((\d+), (\d+), (\d+)\)$/.exec(rgb);
    if (!result) return rgb;

    function componentToHex(c) {
        const hex = parseInt(c).toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    return '#' + componentToHex(result[1]) + componentToHex(result[2]) + componentToHex(result[3]);
}

// 4️⃣ Obtener propiedades del CSS - Ej: --main-background-color (No usada)
export function getProperty(prop = '--main-background-color') {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(prop).trim();
}

// 5️⃣ Obtener configuración guardada en localStorage (No usada)
export function getStoredSetting(key) {
    return localStorage.getItem(key);
}

// 6️⃣ Establecer configuración en localStorage (No usada)
export function setStoredSetting(key, value) {
    localStorage.setItem(key, value);
}

// 7️⃣ Actualizar visualización de items (habilidades, idiomas, etc.) con el tipo seleccionado (No usada)
export function updateItemsDisplay(itemType) {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.classList.remove('star', 'circle', 'icon'); // Elimina tipos anteriores
        item.classList.add(itemType); // Agrega el tipo nuevo
    });
}



// ---------------------------------------------
// EXPORTAR E IMPORTAR
// ---------------------------------------------
 
/**
 * Exporta todas las preferencias actuales como un objeto JSON
 */
export function exportPreferences() {
  const preferences = {};
  STYLE_SETTINGS.forEach(({ key }) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      preferences[key] = storedValue;
    }
  });
  return preferences;
}

/**
 * Importa preferencias desde un objeto JSON (y las aplica visualmente)
 * @param {Object} json - Objeto JSON con claves coincidentes con localStorage
 */
export function importPreferences(json) {
  const root = document.documentElement;

  STYLE_SETTINGS.forEach(({ id, cssVar, key }) => {
    if (json[key] !== undefined) {
      const value = json[key];
      localStorage.setItem(key, value);
      root.style.setProperty(cssVar, value);

      const el = document.getElementById(id);
      if (el) {
        const numericValue = value.replace(/[^\d./-]/g, '');
        // el.value = numericValue;
        el.value = parseFloat(value);
        // el.value = value.replace(/[^\d./-]/g, '');
      }
    }
  });

  // Reaplicar sombra según sidebar
  const sidebarColor = getComputedStyle(root).getPropertyValue('--sidebar-font-color').trim();
  if (isLightColor(sidebarColor)) {
    root.style.setProperty('--text-shadow-items-level', 'var(--text-shadow-black)');
  } else {
    root.style.setProperty('--text-shadow-items-level', 'var(--text-shadow-white)');
  }

  adjustTextShadowBasedOnSidebarColor();
}



// ------------------------------------------------------------------

// Funciones reemplazadas

// // ---------------------------------------------
// // 6️⃣ Update
// // ---------------------------------------------

// Función reemplazada por enhanceSkillIcons
// export function updateSkills() {
//   // Check si hay datos cargados
//     console.log('cvData.habilidades:', cvData.habilidades);

//     if (!cvData.habilidades || !Array.isArray(cvData.habilidades) || cvData.habilidades.length === 0) {
//       console.warn('No hay habilidades válidas en cvData');
//       return;
//   }


//     const list = window.cvData.habilidades || [];
//     const container = document.getElementById('habilidades');
//     container.innerHTML = list.map(h => `
//       <div class="habilidad-item">
//         <div class="habilidad-info">
//           <div class="habilidad-icon"><i class="${h.icono}"></i></div>
//           <div class="habilidad-name">${h.nombre}</div>
//         </div>
//         <div class="habilidad-valor">
//           ${renderItems(h.nivel, 5)}
//         </div>
//       </div>
//     `).join('');
    
//     container.querySelectorAll('.habilidad-valor').forEach(el => {
//       el.style.setProperty('--total-items', 5);
//     });
//   }
  
//   /**
//    * Renderiza los "idiomas" usando cvData.idiomas, levelMap y flagMap
//    */

// Función reemplazada por enhanceLanguageIcons
// export function updateLanguages() {
//     // Check si hay datos cargados
//     console.log('cvData.idiomas:', cvData.idiomas);

//     if (!cvData.idiomas || !Array.isArray(cvData.idiomas) || cvData.idiomas.length === 0) {
//         console.warn('No hay idiomas válidos en cvData');
//         return;
//     }

//     const list = window.cvData.idiomas || [];
//     const container = document.getElementById('idiomas');
//     container.innerHTML = list.map(i => {
//       const num = levelMap[i.nivel] || 0;
//       const flag = flagMap[i.codigo] || '';
//       return `
//         <div class="idioma-item">
//           <div class="idioma-info">
//             <img src="${flag}" alt="${i.idioma}" class="flag-icon" crossorigin="anonymous">
//             <div class="idioma-level">${i.idioma} (${i.nivel})</div>
//           </div>
//           <div class="idioma-valor">
//             ${renderItems(num, 6)}
//           </div>
//         </div>
//       `;
//     }).join('');
  
//     container.querySelectorAll('.idioma-valor').forEach(el => {
//       el.style.setProperty('--total-items', 6);
//     });
//   }

