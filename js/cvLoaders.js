// cvLoaders.js

// Importar funciones desde personalization.js and utils.js
import { 
  flagMap, idiomaApaísMap, idiomaNombresMap, levelMap,
  loadFonts,
  enhanceSectionItems, 
  // enhanceSkillIcons, enhanceLanguageIcons, 
  renderIcon, renderItems
} from './utils.js';

export {
  initCVData, // 1 - main.js

  // renderCVContentForLanguage, // 2 - (interno)
  // renderTextContent, // 2.1 - (interno) -> Usa enhanceSectionItems (2.4) que está en utils.js)
  renderArrayContent, // 2.2 - personalization.js
  // generateSidebarTemplate, // 2.2.1 - (interno) -> Usa renderIcon (utils.js))
  // generateMainTemplate, // 2.2.2 - (interno) -> Usa renderIcon (utils.js))
  // renderSectionLabels, // 2.3 - (interno)
  // setupLanguageButtons, // 3 - (interno) 
  updatePhoto, // 4 - cvUploaders.js
  // detectFaceCenter, // 4.1 - (interno) 
  // tryFaceApi, // 4.1.2 - (interno) 
  // loadFaceApiModels, // 4.1.2.1 - (interno) 
  // getDefaultFaceCenter, // 4.2 - (interno) 
  // setupImageDragAndZoom, // 4.3 - (interno)
  // clampOffset, // 4.3.1 - (interno)
  // loadFontIfNeeded, // 5 - (interno) -> Usa loadFonts (utils.js)

  initCVDataFromObject, // cvUploaders.js -> Usa renderCVContentForLanguage, setupLanguageButtons, loadFontIfNeeded (aqui), 
  getCurrentIdiomaData, // personalization.js -> Utiliza el windows.Data para extraer el Idioma
};

// Secciones para la renderización
const seccionesSimples = ['nombre', 'titulo', 'resumen', 'objetivo'];

// Secciones que contienen arrays
const seccionesConArray = [
  'contacto', 'habilidades', 'idiomas', 'hobbies',
  'experiencia', 'estudios', 'logros'
];

const vistaPorSeccion = {
  contacto: 'list-view',
  habilidades: 'grid-view',
  idiomas: 'grid-view',
  hobbies: 'grid-view',
  experiencia: 'list-view',
  estudios: 'list-view',
  logros: 'list-view'
};

const sidebarSectionsConfig = {
  contacto: { iconField: 'icono', nameField: 'etiqueta', valueField: 'valor' },
  habilidades: { iconField: 'icono', nameField: 'nombre', valueField: 'nivel' },
  idiomas: { iconField: 'icono', nameField: 'idioma', valueField: 'nivel' },
  hobbies: { iconField: 'icono', nameField: 'nombre', valueField: null }
};

const mainSectionsConfig = {
  experiencia: {
    iconField: 'icono',
    titleField: item => `${item.puesto} en ${item.empresa}`,
    descriptionField: 'descripcion',
    dateField: 'fecha'
  },
  estudios: {
    iconField: 'icono',
    titleField: 'titulo',
    descriptionField: 'detalles',
    dateField: 'fecha'
  },
  logros: {
    iconField: null,
    titleField: 'titulo',
    descriptionField: 'descripcion',
    dateField: 'fecha'
  }
};

// 1️⃣ - Cargar el contenido del CV
async function initCVData(jsonFile = 'assets/data.json', photoFile = 'assets/foto.jpg') {
  try {
    const response = await fetch(jsonFile);
    const fullData = await response.json();

    const idiomasDisponibles = Object.keys(fullData);
    const idiomaGuardado = localStorage.getItem('idiomaSeleccionado');
    const idiomaPorDefecto = idiomaGuardado && idiomasDisponibles.includes(idiomaGuardado)
      ? idiomaGuardado
      : idiomasDisponibles[0];

    window.cvData = fullData[idiomaPorDefecto];

    renderCVContentForLanguage(idiomaPorDefecto, fullData); // 2️⃣ Carga los datos en el idioma por defecto
    setupLanguageButtons(idiomasDisponibles, fullData);     // 3️⃣ Configura el selector de idiomas
    updatePhoto(photoFile);                                 // 4️⃣ Carga la Foto
    loadFontIfNeeded(window.cvData.fuente);                 // 5️⃣ Fuente personalizada

  } catch (error) {
    console.error('Error al cargar los datos del CV:', error);
  }
}

// 2️⃣ - Renderizar el contenido del CV para un idioma específico con la vista actualizada
function renderCVContentForLanguage(idioma, data) {
  const idiomaData = data[idioma];
  if (!idiomaData) {
    console.error(`No se encontraron datos para el idioma: ${idioma}`);
    return;
  }

  // Renderizar campos simples
  for (const section of seccionesSimples) {
    if (idiomaData[section]) {
      renderTextContent(section, idiomaData[section]); // 2️⃣.1️⃣
    }
  }
 
  // Renderizar arrays
  seccionesConArray.forEach(section => {
    const contenido = idiomaData[section];
    const viewType = vistaPorSeccion[section] || 'list-view'; // Obtener el tipo de vista de la sección. En caso de no estar listada aplica por defecto: 'list-view'
    
    if (Array.isArray(contenido)) {
      renderArrayContent(section, contenido, viewType); // 2️⃣.2️⃣
    }
  });

  // Etiquetas de sección
  if (idiomaData.secciones) {
    renderSectionLabels(idiomaData.secciones); // 2️⃣.3️⃣
  }

  // 👇 Mejora de ítems con íconos y valores visuales

  // HABILIDADES
  if (idiomaData.habilidades) {
    enhanceSectionItems('habilidades', idiomaData.habilidades, {
      type: 'habilidades',
      renderItems,
      totalItems: 5
    });
  }

  // IDIOMAS
  if (idiomaData.idiomas) {
    enhanceSectionItems('idiomas', idiomaData.idiomas, {
      type: 'idiomas',
      levelMap,
      renderItems,
      totalItems: 6
    });
  }

}

// 2️⃣.1️⃣ - Renderizar texto simple
function renderTextContent(section, contenido) {
  const el = document.getElementById(section);
  if (el) {
    el.innerHTML = `
      <div class="section-item-container">
        <div class="item-info">
          <p class="item-description">${contenido}</p>
        </div>
      </div>
    `;
  }
}

// 2️⃣.2️⃣ - Renderizar secciones con Arrays (por defecto en tipo de vista 'list-view')
function renderArrayContent(section, data, viewType = 'list-view') {
  if (!Array.isArray(data)) {
    console.error(`renderArrayContent: "${section}" requiere un array. Recibido:`, data);
    return;
  }

  const container = document.getElementById(section);
  if (!container) {
    console.error(`No se encontró el contenedor con el ID "${section}"`);
    return;
  }

  // Setear clase de vista en el contenedor
  container.classList.remove('list-view', 'grid-view', 'compact-view');
  container.classList.add(viewType);

  container.innerHTML = '';
  console.log(`Renderizando sección "${section}" con vista "${viewType}"`);

  let templateFn;

  // Ver si es una sección del sidebar
  if (sidebarSectionsConfig[section]) {
    const templateMap = generateSidebarTemplate(sidebarSectionsConfig[section]);
    templateFn = templateMap[viewType];
    if (!templateFn) {
      console.error(`No hay plantilla para la vista "${viewType}" en la sección "${section}"`);
      return;
    }
  }

  // Ver si es una sección del main
  else if (mainSectionsConfig[section]) {
    templateFn = generateMainTemplate(mainSectionsConfig[section]);
  }

  // Sección no reconocida
  else {
    console.error(`No hay configuración de plantilla para la sección "${section}"`);
    return;
  }

  data.forEach(item => {
    const renderedItem = templateFn(item);
    container.innerHTML += renderedItem;
  });

  // Agregar Hipervinculos
  addLinksToSidebar(container);
  makeCardsClickable(container);
}

// 2️⃣.2️⃣.1️⃣ - Función para Generar estructura de HTML (desde un Template) para el Sidebar
/* Nota: Las 3 tienen la misma estructura, solo difieren en la 2da linea list-view, grid-view y compact-view */

function generateSidebarTemplate({ iconField, nameField, valueField }) {
  return {
    'list-view': item => `
      <div class="section-item-container list-view">
        <div class="item-info item-row">
          <div class="item-left">
            ${renderIcon(item[iconField], item[nameField])}
          </div>
          <div class="item-center">
            <div class="item-name">
              <span class="item-text">${item[nameField]}</span>
            </div>
            ${valueField ? `
              <div class="item-value">
                <span class="item-text">${item[valueField]}</span>
              </div>` : ''}
          </div>
          <div class="item-right"></div>
        </div>
      </div>
    `,
    'grid-view': item => `
      <div class="section-item-container grid-view">
        <div class="item-info item-row">
          <div class="item-left">
            ${renderIcon(item[iconField], item[nameField])}
          </div>
          <div class="item-center">
            <div class="item-name">
              <span class="item-text">${item[nameField]}</span>
            </div>
            ${valueField ? `
              <div class="item-value">
                <span class="item-text">${item[valueField]}</span>
              </div>` : ''}
          </div>
          <div class="item-right"></div>
        </div>
      </div>
    `,
    'compact-view': item => `
      <div class="section-item-container compact-view">
        <div class="item-info item-row">
          <div class="item-left">
              ${renderIcon(item[iconField], item[nameField])}
          </div>
          <div class="item-center">
            <div class="item-name">
              <span class="item-text">${item[nameField]}</span>
            </div>
          </div>
          <div class="item-right">
            ${valueField ? `
              <div class="item-value">
                <span class="item-text">${item[valueField]}</span>
              </div>` : ''}
          </div>
        </div>
      </div>
    `
  };
}

// 2️⃣.2️⃣.2️⃣ - Función para Generar estructura de HTML (desde un Template) para el Main
function generateMainTemplate({ iconField = null, titleField, descriptionField, dateField }) {
  return item => `
    <div class="section-item-container list-view">
      <div class="item-info">
        <div class="item-title">
          ${iconField ? renderIcon(item[iconField], item[titleField]) : ''}
          <span class="item-name text-item">${
            typeof titleField === 'function' ? titleField(item) : item[titleField]
          }</span>
        </div>
        <p class="item-description">${item[descriptionField]}</p>
        <p class="item-date"><small>${item[dateField]}</small></p>
      </div>
    </div>
  `;
}

// 2️.3️⃣ - Renderizar las Etiquetas de secciones
// Actualiza dinámicamente los títulos de cada sección del CV según el idioma seleccionado, reemplazando
// el texto dentro de los elementos <span> cuyo ID sigue el formato id + "Titulo".
// Cambia los encabezados visibles como "Experiencia", "Estudios", etc., por sus traducciones correspondientes.
function renderSectionLabels(sections) {
  Object.entries(sections).forEach(([id, texto]) => {
    const span = document.getElementById(id + 'Titulo'); // Ej (en HTML): 'aria-labelledby="experienciaTitulo"'
    if (span) span.textContent = texto;
  });
}

// 2️.4. - Agregar un Hipervinculo
// Función post-procesado del HTML para identificar un hipervinculo (https o mailto) y agregarlo al HTML (aparece oculto con un <a> dentro de 'item-value', y sin reemplazar el 'item-text' sino que lo envuelve al mismo)
function addLinksToSidebar(container = document) {
  const items = container.querySelectorAll('.item-value');

  items.forEach(div => {
    const span = div.querySelector('.item-text');
    if (!span) return;
    
    const text = span.textContent.trim();
    let link;

    if (/^https?:\/\//.test(text)) {
      // Enlaces web
      link = document.createElement('a');
      link.href = text;
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      // Correos electrónicos
      link = document.createElement('a');
      link.href = `mailto:${text}`;
    }

    if (link) {
      link.target = "_blank";         // Para web, no hace daño en mailto
      link.rel = "noopener noreferrer";

      // Envolver el span dentro del link
      span.parentNode.replaceChild(link, span);
      link.appendChild(span);
    }
  });
}



// Función para agregar el acceso del hipervinculo a la tarjeta
function makeCardsClickable(container = document) {
  const cards = container.querySelectorAll('.section-item-container');
  cards.forEach(card => {
    const link = card.querySelector('.item-value a');
    if (link) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => window.open(link.href, '_blank'));
    }
  });
}


// 3️⃣ - Configurar el Selector de idiomas
/**
 * Crea el selector de idiomas en la interfaz y configura el listener
 * 
 * @param {string[]} idiomasDisponibles - Lista de códigos de idioma (ej: ['es', 'en', 'fr']).
 * @param {Object} data - Datos completos del CV en todos los idiomas.
 */
function setupLanguageButtons(idiomasDisponibles, data) {
  const selector = document.getElementById('languageSwitcher');
  if (!selector) return; // ⛔ Si no existe el contenedor, salir

  selector.innerHTML = ''; // 🧼 Limpia el contenido previo (por si se llama más de una vez)

  // 1️⃣ Obtener idioma guardado previamente o usar el primero disponible
  const idiomaGuardado = localStorage.getItem('idiomaSeleccionado') || idiomasDisponibles[0];

  // 2️⃣ Iterar sobre cada idioma para crear su botón
  idiomasDisponibles.forEach(idioma => {
    const btn = document.createElement('button');
    btn.classList.add('language-button'); // 🔘 Clase para estilos
    btn.dataset.idioma = idioma;          // 📦 Guardar código del idioma como atributo

    // 2.1 Crear en el HTML los botones de los idiomas (bandera + nombre)
    btn.innerHTML = `
      <img src="${flagMap[idioma]}" alt="${idioma}" class="flag-icon">
      <span>${idiomaNombresMap[idioma] || idioma.toUpperCase()}</span>
    `;

    // 2.2 Asignar comportamiento en los botones al hacer clic
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return; // ⛔ Evita volver a cargar el idioma ya activo

      renderCVContentForLanguage(idioma, data); // 2️⃣ - 📄 Cargar datos del idioma seleccionado
      localStorage.setItem('idiomaSeleccionado', idioma); // 💾 Guardar selección

      // 🔄 Actualizar clase activa visualmente
      selector.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });

    // 2.3 Activar el botón correspondiente si coincide con el idioma guardado
    if (idioma === idiomaGuardado) {
      btn.classList.add('active');
    }

    selector.appendChild(btn); // ➕ Agregar botón al contenedor
  });

  // 3️⃣ Cargar el idioma guardado al iniciar (asegura que se aplique aunque no se haga clic)
  // renderCVContentForLanguage(idiomaGuardado, data); // 2️⃣ ELIMINAR
}

// 4️⃣ - Foto de perfil


// Función principal para actualizar la foto de perfil
// async function updatePhoto(photoFile) {
//   const img = document.getElementById('foto');
//   const placeholder = document.getElementById('foto-placeholder');
//   const container = document.getElementById('foto-container');

//   if (!img || !container) {
//     console.error('Elemento de imagen o contenedor no encontrado');
//     return;
//   }

//   // Asignar la imagen al elemento de manera rápida
//   img.src = typeof photoFile === 'string' ? photoFile : URL.createObjectURL(photoFile);

//   // Eliminar el placeholder inmediatamente
//   if (placeholder) placeholder.style.display = 'none';

//   // Cuando la imagen haya cargado (sin esperar ninguna lógica adicional de posición o escala)
//   img.onload = () => {
//     console.log('Imagen cargada correctamente');
//     img.classList.add('visible');

//     // Lógica comentada para posicionamiento y escalado en el futuro:
//     /*
//     // Intentar la detección de la cara
//     const face = await detectFaceCenter(img);
//     let offsetX, offsetY, scale;

//     if (face) {
//       // Si se detectó la cara, usa sus coordenadas
//       offsetX = (container.clientWidth / 2) - (face.cx * scale);
//       offsetY = (container.clientHeight / 2) - (face.cy * scale);
//       console.log('Valores calculados de la cara:', { offsetX, offsetY, scale });
//     } else {
//       // Si no se detecta, usar valores predeterminados
//       const defaultValues = getDefaultFaceCenter(img, container);
//       offsetX = defaultValues.offsetX;
//       offsetY = defaultValues.offsetY;
//       scale = defaultValues.scale;
//     }

//     // Guardar y aplicar la transformación
//     img.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`;
//     */

//     // Habilitar la funcionalidad de arrastre y zoom manual
//     setupImageDragAndZoom(img, container.clientWidth, container.clientHeight);
//   };
// }

// Función principal para actualizar la foto de perfil
function updatePhoto(src) {
  const img = document.getElementById('foto');
  const placeholder = document.getElementById('foto-placeholder');
  const container = document.getElementById('foto-container');

  // Resetear transformaciones
  img.style.transform = 'translate(-50%, -50%) scale(1)';
  img.classList.remove('visible');
  placeholder.classList.remove('show');

  // Función que se llama cuando la imagen falla
  img.onerror = () => {
    console.warn('No se pudo cargar la imagen, mostrando placeholder.');
    img.src = '';
    placeholder.classList.add('show');
  };

  // Función que se llama cuando la imagen carga correctamente
  img.onload = () => {
    placeholder.classList.remove('show');
    img.classList.add('visible');

    // Escala mínima para que la imagen quepa
    const scaleX = container.clientWidth / img.naturalWidth;
    const scaleY = container.clientHeight / img.naturalHeight;
    const minScale = Math.min(scaleX, scaleY);

    // Cargar offsets guardados solo si queremos restaurar
    const startX = parseFloat(localStorage.getItem('fotoOffsetX')) || 0;
    const startY = parseFloat(localStorage.getItem('fotoOffsetY')) || 0;

    // Siempre iniciar con minScale
    setupImageDragAndZoom(img, container.clientWidth, container.clientHeight, startX, startY, minScale, minScale);
  };

  // Asignar la nueva fuente
  img.src = src;
}




// 4.1.2 - Función para detectar la cara en la imagen (usa FaceDetector o Face-api.js)
let faceDetectionInProgress = false;

async function detectFaceCenter(img) {
  if (faceDetectionInProgress) {
    console.log('[FaceDetection] Detección en progreso. Cancelando nueva ejecución.');
    return null;
  }

  faceDetectionInProgress = true;

  try {
    if ('FaceDetector' in window) {
      try {
        const detector = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        const faces = await detector.detect(img);
        if (faces.length === 0) {
          console.log('No se detectaron caras con FaceDetector.');
          return null;
        }
        const { width: w, height: h, left: x, top: y } = faces[0].boundingBox;
        const center = { cx: x + w / 2, cy: y + h / 2 };
        console.log('Cara detectada con FaceDetector:', center);
        return center;
      } catch (error) {
        console.error('Error al usar FaceDetector:', error);
        console.log('Intentando con Face-api.js...');
        return await tryFaceApi(img);
      }
    } else {
      console.warn('FaceDetector no está disponible en este navegador. Intentando con Face-api.js...');
      return await tryFaceApi(img);
    }
  } catch (e) {
    console.error('[FaceDetection] Error inesperado:', e);
    return null;
  } finally {
    faceDetectionInProgress = false;
  }
}



// 4.1.2 - Función alternativa utilizando Face-api.js
async function tryFaceApi(img) {
  try {
    // Asegurarse de que los modelos se hayan cargado antes de ejecutar la detección
    if (!faceapi.nets.ssdMobilenetv1.isLoaded) {
      console.log('Esperando a que se carguen los modelos...');
      await loadFaceApiModels(); // Cargar los modelos si no están cargados
    }

    const detections = await faceapi.detectAllFaces(img);

    if (!detections || detections.length === 0 || !detections[0]?.detection?.box) {
      console.warn('No se detectaron caras válidas con Face-api.js.');
      return null;
    }

    const box = detections[0].detection.box;
    const center = { cx: box.x + box.width / 2, cy: box.y + box.height / 2 };
    console.log('Cara detectada con Face-api.js:', center);
    return center;

  } catch (error) {
    console.error('Error al usar Face-api.js:', error);
    return null; // Si falla, devuelve null y usará valores predeterminados
  }
}



// 4.1.2.1 - Cargar los modelos de Face-api.js (solo una vez)
async function loadFaceApiModels() {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models-face-api');
    console.log('Modelos cargados correctamente.');
  } catch (error) {
    console.error('Error al cargar los modelos de Face-api.js:', error);
  }
}

// 4.2 - Si no se detecta una cara, devuelve valores predeterminados
function getDefaultFaceCenter(img, container) {
  const imgW = img.naturalWidth, imgH = img.naturalHeight;
  const cW = container.clientWidth, cH = container.clientHeight;

  // Evitar el cálculo de escala, simplemente usar un valor de escala de 1
  const defaultScale = 1;

  const offsetX = -(imgW * defaultScale / 2 - cW / 2);   // Centrado horizontal
  // const offsetY = -(imgH * defaultScale / 2 - cH / 2);   // Centrado vertical
  const offsetY = -(imgH * defaultScale * 0.15);         // Alineado arriba - 0.15 es un factor para dejar algo de margen arriba

  console.log('No se detectó ninguna cara. Usando valores predeterminados:', { offsetX, offsetY, defaultScale });
  return { offsetX, offsetY, scale: defaultScale }; // valores predeterminados
}

// 4.3 - Función Drag & Zoom para la foto
/**
 * setupImageDragAndZoom: permite arrastrar y hacer zoom sobre la imagen.
 * - img: el <img>
 * - cW,cH: dimensiones del contenedor
 * - initialX, initialY, initialScale: valores de offset y escala iniciales
 */
function setupImageDragAndZoom(img, containerWidth, containerHeight, startX = 0, startY = 0, startScale = 1, minScale = 1) {

  // --- Asegurar que no queden listeners duplicados
  if (img._dragZoomListeners) {
    removeImageDragAndZoomListeners(img);
  }

  // --- Recuperar valores guardados en localStorage (si existen)
  const savedX = parseFloat(localStorage.getItem('fotoOffsetX'));
  const savedY = parseFloat(localStorage.getItem('fotoOffsetY'));
  const savedScale = parseFloat(localStorage.getItem('fotoScale'));

  let offsetX = !isNaN(savedX) ? savedX : startX;
  let offsetY = !isNaN(savedY) ? savedY : startY;
  let scale   = !isNaN(savedScale) ? savedScale : Math.max(minScale, startScale);  // <-- aplicar minScale al inicio
  let isDragging = false;
  let lastX, lastY;

  // Función para actualizar las transformaciones de la imagen y guardar en localStorage
  const updateTransform = () => {
    const maxOffsetX = (img.naturalWidth * scale - containerWidth) / 2;
    const maxOffsetY = (img.naturalHeight * scale - containerHeight) / 2;

    const clampedX = clampOffset(offsetX, maxOffsetX);
    const clampedY = clampOffset(offsetY, maxOffsetY);

    console.log('Transformación actualizada:', { clampedX, clampedY, scale });

    img.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px)) scale(${scale})`;

    // Guardar en localStorage los valores de transformación
    localStorage.setItem('fotoOffsetX', clampedX);
    localStorage.setItem('fotoOffsetY', clampedY);
    localStorage.setItem('fotoScale', scale);
  };

  // // Listeners ( Eventos para comenzar a arrastrar la Foto )

  const onMouseDown = (e) => { 
    isDragging = true; 
    lastX = e.clientX; 
    lastY = e.clientY; 
    e.preventDefault(); 
    console.log('mousedown activado');
  };
  
  // Evento para mover la imagen mientras se mantiene presionado el mouse

  const onMouseMove = (e) => {
    if (!isDragging) return;
    offsetX += e.clientX - lastX;
    offsetY += e.clientY - lastY;
    lastX = e.clientX; 
    lastY = e.clientY;
    updateTransform();
  };

  // Evento para soltar el mouse y terminar el arrastre
  const onMouseUp = () => { isDragging = false; };

  // Evento para hacer zoom con la rueda del ratón
  const onWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(minScale, Math.min(scale + delta, 2));
    // Mantener centrado relativo al puntero
    const rect = img.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / scale;
    const relY = (e.clientY - rect.top - rect.height / 2) / scale;
    offsetX -= relX * delta;
    offsetY -= relY * delta;
    scale = newScale;
    console.log('Zoom actualizado:', { offsetX, offsetY, scale });
    updateTransform();
  };

  // Asignar listeners
  img.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  img.addEventListener('wheel', onWheel);

  // Guardar referencias para poder removerlos
  img._dragZoomListeners = { onMouseDown, onMouseMove, onMouseUp, onWheel };

  // Inicialización de la imagen con las transformaciones iniciales
  updateTransform(); // <-- escala inicial ya respetando minScale
}


export function removeImageDragAndZoomListeners(img) {
  if (!img._dragZoomListeners) return;
  const { onMouseDown, onMouseMove, onMouseUp, onWheel } = img._dragZoomListeners;
  img.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  img.removeEventListener('wheel', onWheel);
  
  delete img._dragZoomListeners;
}

// 4.3.1 - Función auxiliar para limitar desplazamiento
function clampOffset(offset, max) {
  return Math.min(Math.max(offset, -max), max);
}



// 5️⃣ - Carga de fuente personalizada
function loadFontIfNeeded(fontName) {
  // "1em ${fontName}" -> Query para consultar al navegador si la fuente existe en el sistema"
  if (fontName && !document.fonts.check(`1em "${fontName}"`)) {
    loadFonts(fontName);
  }
}

// Función alternativa que renderiza directamente desde objeto
async function initCVDataFromObject(jsonData) {
  try {
    const idiomasDisponibles = Object.keys(jsonData);
    const idiomaPorDefecto = idiomasDisponibles[0];

    window.cvData = jsonData[idiomaPorDefecto];

    renderCVContentForLanguage(idiomaPorDefecto, jsonData);
    setupLanguageButtons(idiomasDisponibles, jsonData);
    loadFontIfNeeded(window.cvData.fuente);

    // 👇 ✅ Si el JSON incluye una foto, usarla
    if (window.cvData.foto && typeof window.cvData.foto === 'string') {
      const rutaBase = 'assets/';
      const urlFinal = window.cvData.foto.startsWith('data:') 
        ? window.cvData.foto                      // ya es base64
        : rutaBase + window.cvData.foto;          // concatenamos si es nombre simple
    
      updatePhoto(urlFinal);
    }

  } catch (error) {
    console.error("Error al procesar datos JSON personalizados:", error);
  }
}


// Función para exportar los datos para conectarlo con otros archivos o partes del programa (usado en 'personalization.js')
function getCurrentIdiomaData() {
  return window.cvData;
}
























// // 2️.2️⃣ - Renderizar listas dinámicas
// export function renderArrayContent(section, data) {
//   if (!Array.isArray(data)) {
//     console.error(`renderArrayContent: "${section}" requiere un array. Recibido:`, data);
//     return;
//   }

//   // Encuentra el contenedor
//   const container = document.getElementById(section);

//   // Si no se encuentra el contenedor, terminamos la función
//   if (!container) {
//     console.error(`No se encontró el contenedor con el ID "${section}"`);
//     return;
//   }

//   // Vaciar el contenido antes de agregar nuevos elementos
//   console.log(`Limpiando el contenido del contenedor "${section}"...`);
//   container.innerHTML = '';
//   console.log(`Contenedor "${section}" vacío.`);

//   // Definir plantillas para cada tipo de sección
//   // Función 'renderIcon' en 'utils.js'
//   const templates = {
//     contacto: item => `
//       <div class="item-info">
//         <h3 class="item-title">
//           ${renderIcon(item.icono, item.etiqueta)}
//           <span class="item-name text-item">${item.etiqueta}</span>
//         </h3>
//         <div class="item-value">
//           <span class="item-value-text">${item.valor}</span>
//         </div>
//       </div>
//     `,

//     habilidades: item => `
//       <div class="item-info">
//         <h3 class="item-title">
//           ${renderIcon(item.icono, item.nombre)}
//           <span class="item-name text-item">${item.nombre}</span>
//         </h3>
//         <div class="item-value">
//           <span class="item-level">Nivel: ${item.nivel}</span>
//         </div>
//       </div>
//     `,

//     idiomas: item => `
//       <div class="item-info">
//         <h3 class="item-title">
//           ${renderIcon(item.icono, item.idioma)}
//           <span class="item-name text-item">${item.idioma}</span>
//         </h3>
//         <div class="item-value">
//           <span class="item-level">Nivel: ${item.nivel}</span>
//         </div>
//       </div>
//     `,

//     hobbies: item => `
//       <div class="item-info">
//         <h3 class="item-title">
//           ${renderIcon(item.icono, item.nombre)}
//           <span class="item-name text-item">${item.nombre}</span>
//         </h3>
//       </div>
//     `,

//     experiencia: item => `
//       <div class="item-info">
//         <h3 class="item-title">
//           ${renderIcon(item.icono, item.puesto)}
//           <span class="item-name text-item">${item.puesto} en ${item.empresa}</span>
//         </h3>
//         <p class="item-description">${item.descripcion}</p>
//         <p class="item-date"><small>${item.fecha}</small></p>
//       </div>
//     `,

//     estudios: item => `
//       <div class="item-info">
//         <h3 class="item-title">
//           ${renderIcon(item.icono, item.titulo)}
//           <span class="item-name text-item">${item.titulo}</span>
//         </h3>
//         <p class="item-description">${item.detalles}</p>
//         <p class="item-date"><small>${item.fecha}</small></p>
//       </div>
//     `,

//     logros: item => `
//       <div class="item-info">
//         <h3 class="item-title">
//           <span class="item-name text-item">${item.titulo}</span>
//         </h3>
//         <p class="item-description">${item.descripcion}</p>
//         <p class="item-date"><small>${item.fecha}</small></p>
//       </div>
//     `
//   };

//   // Verificar los datos antes de procesarlos
//   console.log(`Datos para la sección "${section}":`, data);

//   // Procesar cada elemento de los datos y agregarlo al contenedor
//   data.forEach(item => {
//     const div = document.createElement('div');
//     div.classList.add('section-item-container', `item-${section}`);

//     // Si la plantilla para la sección no está definida, mostrar un mensaje por defecto
//     const tpl = templates[section] || (() => `
//       <div class="item-info"><span class="item-name text-item">Elemento desconocido</span></div>`);

//     // Insertar el HTML generado en el div
//     div.innerHTML = tpl(item);

//     // Agregar el div al contenedor
//     container.appendChild(div);
//     console.log(`Elemento agregado a la sección "${section}":`, item);
//   });

//   console.log(`Contenido renderizado para la sección "${section}".`);
// }









// // 8️⃣ - Renderizar listas dinámicas (Versión vieja)
// export function renderArrayContent(section, data) {
//   if (!Array.isArray(data)) {
//     console.error(`renderArrayContent: "${section}" requiere un array. Recibido:`, data);
//     return;
//   }
//   const container = document.getElementById(section);
//   if (!container) return;
//   container.innerHTML = '';

//   const templates = {
//     contacto: item => `
//       <div class="item-info">
//         ${renderIcon(item.icono, item.etiqueta)}
//         <span>${item.etiqueta}</span>
//       </div>
//       <div class="item-value">
//         <span>${item.valor}</span>
//       </div>
//     `,
//     habilidades: item => `
//       <div class="item-info">
//         ${renderIcon(item.icono, item.nombre)}
//         <span>${item.nombre}</span>
//       </div>
//       <div class="item-value">
//         <span>Nivel: ${item.nivel}</span>
//       </div>
//     `,
//     idiomas: item => `
//       <div class="item-info">
//         ${renderIcon(item.icono, item.idioma)}
//         <span>${item.idioma}</span>
//       </div>
//       <div class="item-value">
//         <span>Nivel: ${item.nivel}</span>
//       </div>
//     `,
//     hobbies: item => `
//       ${renderIcon(item.icono, item.nombre)}
//       <span class="item-name">${item.nombre}</span>
//     `,
//     experiencia: item => `
//       <h3>${renderIcon(item.icono, item.puesto)} ${item.puesto} en ${item.empresa}</h3>
//       <p>${item.descripcion}</p>
//       <p><small>${item.fecha}</small></p>
//     `,
//     estudios: item => `
//       <h3>${renderIcon(item.icono, item.titulo)} ${item.titulo}</h3>
//       <p>${item.detalles}</p>
//       <p><small>${item.fecha}</small></p>
//     `,
//     logros: item => `
//       <h3>${item.titulo}</h3>
//       <p>${item.descripcion}</p>
//       <p><small>${item.fecha}</small></p>
//     `,
//   };

//   data.forEach(item => {
//     const div = document.createElement('div');
//     div.classList.add('item', `item-${section}`);
//     const tpl = templates[section] || (() => `<div class="item-info"><span>Elemento desconocido</span></div>`);
//     div.innerHTML = tpl(item);
//     container.appendChild(div);
//   });
// }