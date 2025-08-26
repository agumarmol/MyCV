// cvLoaders.js

// Importar funciones desde personalization.js and utils.js
import { } from './personalization.js';
import { 
  flagMap, idiomaApaísMap, idiomaNombresMap,
  loadFonts, setupSectionFormatLoading, setupImageDragAndZoom,
  setTheme,
  // updateLanguages, updateSkills
  enhanceSkillIcons, enhanceLanguageIcons
  // renderItems,
} from './utils.js';

const seccionesValidas = ['sobreMi', 'objetivo', 'contacto', 'habilidades', 'idiomas', 'hobbies', 'experiencia', 'estudios', 'logros'];

// 1️⃣ - Cargar el contenido del CV
export async function loadCV(jsonFile = 'assets/data.json', photoFile = 'assets/foto.jpg') {
  try {
    // Usamos fetch() para obtener los datos desde el archivo JSON
    const response = await fetch(jsonFile); // Aquí pasamos el nombre del archivo JSON como parámetro
    const fullData = await response.json(); // Convertimos la respuesta en un objeto JavaScript

    // Detectamos los idiomas disponibles y seleccionamos el primero por defecto
    const idiomasDisponibles = Object.keys(fullData);  // Obtenemos los idiomas disponibles del objeto
    const idiomaGuardado = localStorage.getItem('idiomaSeleccionado'); // Chequeamos si hay algún idioma guardado en localStorage
    const idiomaPorDefecto = idiomaGuardado && idiomasDisponibles.includes(idiomaGuardado)
      ? idiomaGuardado // Si el idioma guardado está disponible, usa este
      : idiomasDisponibles[0]; // Si no hay idioma guardado, seleccionamos el primer idioma como por defecto

    window.cvData = fullData[idiomaPorDefecto]; // Guardamos la Info Para aplicar a Fuentes y al Timeline

    // Actualizar las secciones del CV
    updatePhoto(photoFile);  // Usamos la URL de la foto como parámetro para cargarla

    // Establecemos el idioma por defecto
    loadLanguage(idiomaPorDefecto, fullData);

    // Añadimos el selector de idiomas (Botones)
    setupLanguageSelector(idiomasDisponibles, fullData);

    // 🔤 Aplicamos la fuente personalizada solo si es distinta a la ya cargada
    if (window.cvData && window.cvData.fuente) {
      const fontName = window.cvData.fuente.trim();
      if (!document.fonts.check(`1em ${fontName}`)) {
        loadFonts(fontName); // Solo la carga si no está aplicada
      }
    }

  } catch (error) {
    console.error('Error al cargar los datos del CV:', error);
  }
}
  
// 2️⃣ - Cargar el contenido del CV para un idioma específico
export function loadLanguage(idioma, data) {
  const idiomaData = data[idioma];

  if (!idiomaData) {
    console.error(`No se encontraron datos para el idioma: ${idioma}`);
    return;
  }

  // Renderizamos las secciones básicas (sobreMi, objetivo, etc.)
  if (idiomaData.sobreMi) renderTextContent('sobreMi', idiomaData.sobreMi);
  if (idiomaData.objetivo) renderTextContent('objetivo', idiomaData.objetivo);

  // Iteramos sobre las secciones dinámicas
  for (let section in idiomaData) {
    if (idiomaData.hasOwnProperty(section) && section !== 'secciones' && section !== 'sobreMi' && section !== 'objetivo') {
      // Verificamos si la sección contiene un arreglo (lista) o un solo valor
      if (Array.isArray(idiomaData[section])) {
        // Solo renderizamos si la sección tiene datos
        if (idiomaData[section].length > 0) {
          renderSection(section, idiomaData[section]);  // Usamos renderSection para listas (arrays)
        } else {
          console.warn(`La sección "${section}" está vacía.`);
        }
      } else {
        // Solo renderizamos si la sección tiene un valor
        if (idiomaData[section]) {
          renderTextContent(section, idiomaData[section]);  // Usamos renderTextContent para valores simples
        } else {
          console.warn(`La sección "${section}" tiene un valor no definido o vacío.`);
        }
      }
    }
  }

  // Renderizamos las etiquetas de las secciones si existen
  if (idiomaData.secciones) {
    renderSectionLabels(idiomaData.secciones);
  }

  // Rerenderiza habilidades e idiomas con el tipo actual
  // updateSkills(); // Si tienes una función para actualizar habilidades
  // updateLanguages(); // Si tienes una función para actualizar idiomas

  // Mejora visual de habilidades e idiomas solo si los elementos existen y tienen datos
  const habilidadesEl = document.getElementById('habilidades');
  if (habilidadesEl && idiomaData.habilidades) {
    enhanceSkillIcons(habilidadesEl, idiomaData.habilidades);
  }

  const idiomasEl = document.getElementById('idiomas');
  if (idiomasEl && idiomaData.idiomas) {
    enhanceLanguageIcons(idiomasEl, idiomaData.idiomas);
  }
}


// 3️⃣ - Configurar el selector de idiomas (Botones)
export function setupLanguageSelector(idiomasDisponibles, data) {
  const selector = document.getElementById('languageSwitcher');

  if (selector) {
    selector.innerHTML = '';

    try {
      idiomasDisponibles.forEach(idioma => {
        const button = document.createElement('button');
        button.classList.add('language-button');
        button.setAttribute('data-idioma', idioma);

        button.innerHTML = `
          <img src="${flagMap[idioma]}" alt="${idioma}" class="flag-icon">
          <span>${idiomaNombresMap[idioma] || idioma.toUpperCase()}</span>
        `;

        button.addEventListener('click', () => {
            // 1. Cambiar idioma
            loadLanguage(idioma, data);

            // 2. Guardar idioma elegido
            localStorage.setItem('idiomaSeleccionado', idioma);

            // 3. Marcar botón activo
            const allButtons = selector.querySelectorAll('button');
            allButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });

        selector.appendChild(button);
      });

      const firstButton = selector.querySelector('button');
      if (firstButton) {
        firstButton.classList.add('active');
      }
    } catch (error) {
      console.error('Error en setupLanguageSelector:', error);
    }
  }
}

// 4️⃣ - Actualizar la foto del perfil
export function updatePhoto(photoFile) {
  const photoElement = document.getElementById('foto'); // Asegúrate de que el ID 'foto' esté presente en tu HTML
  const placeholder = document.getElementById('foto-placeholder');
  
  if (photoElement && photoFile) {
    // Establece la ruta de la foto basada en el parámetro pasado
    photoElement.setAttribute('src', photoFile); // Asumimos que 'photoFile' es la URL de la foto

    // Mostrar la imagen y ocultar el placeholder
    photoElement.classList.add('visible');
    if (placeholder) placeholder.style.display = 'none'; // Ocultar el placeholder
  } else {
    console.error('No se pudo cargar la foto, o el elemento no existe');
  }

  const storedOffsetX = localStorage.getItem('fotoOffsetX') || 0;
  const storedOffsetY = localStorage.getItem('fotoOffsetY') || 0;
  const storedScale = localStorage.getItem('fotoScale') || 1;

  // Aplicamos la transformación en el elemento de la imagen
  if (photoElement) {
    photoElement.style.transform = `translate(calc(-50% + ${storedOffsetX}px), calc(-50% + ${storedOffsetY}px)) scale(${storedScale})`;
  }

  // Funcionalidad Drag and Zoom Foto (utils.js)
  if (photoElement) {
    setupImageDragAndZoom(photoElement); // Pasa el photoElement a la función de drag & zoom
  }
}

// 6️⃣ - Renderizar contenido de texto (Resumen, Objetivo, etc.)
export function renderTextContent(section, contenido) {
  const container = document.getElementById(section);
  if (container) {
    container.innerHTML = contenido; // Asume que 'contenido' es un string
  }
}

// 7️⃣ - Renderizar las etiquetas de las secciones (Título de la sección)
export function renderSectionLabels(sections) {
  if (!sections) {
    console.warn('No sections data provided for renderSectionLabels.');
    return;
  }

  for (const id in sections) {
    const titulo = sections[id];
    const span = document.getElementById(id + 'Titulo');
    if (span) {
      span.textContent = titulo;
    } else {
      console.warn(`No se encontró el elemento con id ${id}Titulo`);
    }
  }
}


export function renderSection(section, data) {
  if (!section || typeof section !== 'string') {
    console.error(`renderSection: El parámetro "section" debe ser un string no vacío.`);
    return;
  }

  if (!Array.isArray(data)) {
    console.error(`renderSection: El parámetro "data" debe ser un array. Recibido:`, data);
    return;
  }

  if (data.length === 0) {
    console.warn(`renderSection: La sección "${section}" no tiene datos para renderizar.`);
    return;
  }

  const container = document.getElementById(section);
  if (!container) {
    console.warn(`renderSection: No se encontró el contenedor con id "${section}".`);
    return;
  }

  container.innerHTML = '';

  data.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('item', `item-${section}`); // clases unificadas

    let contentHTML = '';

    if (['contacto', 'habilidades', 'idiomas', 'hobbies'].includes(section)) {
      let label = '';
      let value = '';

      if (!item || typeof item !== 'object') {
        console.warn(`Elemento inválido en la sección "${section}" [índice ${index}]:`, item);
        return;
      }

      const iconHTML = item.icono ? `<span class="item-icon"><i class="${item.icono}"></i></span>` : '';

      if (section === 'contacto') {
        label = item.etiqueta || 'Sin etiqueta';
        value = item.valor || '';
        contentHTML = `
          <div class="item-info">
            ${iconHTML}
            <span>${label}</span>
          </div>
          ${value ? `<div class="item-value">${value}</div>` : ''}
        `;
      } else if (section === 'habilidades') {
        label = item.nombre || 'Sin nombre';
        value = item.nivel ? `Nivel: ${item.nivel}` : '';
        contentHTML = `
          <div class="item-info">
            ${iconHTML}
            <span>${label}</span>
          </div>
          ${value ? `<div class="item-value">${value}</div>` : ''}
        `;
      } else if (section === 'idiomas') {
        label = item.idioma || 'Sin idioma';
        value = item.nivel ? `Nivel: ${item.nivel}` : '';
        contentHTML = `
          <div class="item-info">
            ${iconHTML}
            <span>${label}</span>
          </div>
          ${value ? `<div class="item-value">${value}</div>` : ''}
        `;
      } else if (section === 'hobbies') {
        contentHTML = `
          ${iconHTML}
          <span class="item-name">${item.nombre || 'Sin nombre'}</span>
        `;
      }

    } else {
      div.classList.add('section-item');
      const iconHTML = item.icono ? `<span class="item-icon"><i class="${item.icono}"></i></span>` : '';

      if (section === 'experiencia') {
        contentHTML = `
          <h3>${iconHTML} ${item.puesto || 'Sin puesto'} en ${item.empresa || 'Sin empresa'}</h3>
          <p>${item.descripcion || ''}</p>
          <p><small>${item.fecha || ''}</small></p>
        `;
      } else if (section === 'estudios') {
        contentHTML = `
          <h3>${iconHTML} ${item.titulo || 'Sin título'} en ${item.instituto || 'Sin instituto'}</h3>
          <p>${item.detalles || ''}</p>
          <p><small>${item.fecha || ''}</small></p>
        `;
      } else if (section === 'logros') {
        contentHTML = `
          <h3>${iconHTML} ${item.titulo || 'Sin título'}</h3>
          <p>${item.descripcion || ''}</p>
          <p><small>${item.fecha || ''}</small></p>
        `;
      } else {
        console.warn(`renderSection: Sección desconocida "${section}"`);
        return;
      }
    }

    div.innerHTML = contentHTML;
    container.appendChild(div);
  });
}



// export function renderSection(section, data) {
//   if (!data || data.length === 0) {
//     console.warn(`No hay datos válidos para la sección "${section}"`);
//     return;
//   }

//   const container = document.getElementById(section);
//   if (!container) {
//     console.warn(`No se encontró el contenedor con id "${section}"`);
//     return;
//   }

//   container.innerHTML = '';

//   data.forEach(item => {
//     const div = document.createElement('div');
//     let contentHTML = '';

//     if (['contacto', 'habilidades', 'idiomas', 'hobbies'].includes(section)) {
//       // 👉 Clase específica por sección
//       div.classList.add(`${section}-item`);

//       let label = '';
//       let value = '';

//       if (section === 'contacto') {
//         label = item.etiqueta;
//         value = item.valor;
//         contentHTML = `
//           <div class="contacto-info">
//             ${item.icono ? `<i class="${item.icono}"></i>` : ''}
//             <span>${label}</span>
//           </div>
//           ${value ? `<div class="contacto-valor">${value}</div>` : ''}
//         `;
//       } else if (section === 'habilidades') {
//         label = item.nombre;
//         value = `Nivel: ${item.nivel}`;
//         contentHTML = `
//           <div class="habilidades-info">
//             ${item.icono ? `<i class="${item.icono}"></i>` : ''}
//             <span>${label}</span>
//           </div>
//           <div class="habilidades-valor">${value}</div>
//         `;
//       } else if (section === 'idiomas') {
//         label = item.idioma;
//         value = `Nivel: ${item.nivel}`;
//         contentHTML = `
//           <div class="idiomas-info">
//             ${item.icono ? `<i class="${item.icono}"></i>` : ''}
//             <span>${label}</span>
//           </div>
//           <div class="idiomas-valor">${value}</div>
//         `;
//       } else if (section === 'hobbies') {
//         contentHTML = `
//           ${item.icono ? `<i class="${item.icono} hobby-icon"></i>` : ''}
//           <span class="hobby-name">${item.nombre}</span>
//         `;
//       }

//     } else if (section === 'experiencia') {
//       div.classList.add('section-item');
//       contentHTML = `
//         <h3><i class="${item.icono}"></i> ${item.puesto} en ${item.empresa}</h3>
//         <p>${item.descripcion}</p>
//         <p><small>${item.fecha}</small></p>
//       `;

//     } else if (section === 'estudios') {
//       div.classList.add('section-item');
//       contentHTML = `
//         <h3><i class="${item.icono}"></i> ${item.titulo} en ${item.instituto}</h3>
//         <p>${item.detalles}</p>
//         <p><small>${item.fecha}</small></p>
//       `;

//     } else if (section === 'logros') {
//       div.classList.add('section-item');
//       contentHTML = `
//         <h3>${item.titulo}</h3>
//         <p>${item.descripcion}</p>
//         <p><small>${item.fecha}</small></p>
//       `;
//     }

//     div.innerHTML = contentHTML;
//     container.appendChild(div);
//   });
// }






////////////////////////////////////////////// TESTING ///////////////////////////////////////////////////////
export async function loadCV1(jsonFile = 'assets/data.json', photoFile = 'assets/foto.jpg') {
  try {
    // Cargar el tema guardado en localStorage, si existe
    const savedTheme = localStorage.getItem('selectedTheme') || 'dark'; // 'light' es el tema predeterminado si no hay tema guardado
    setTheme(savedTheme); // Aplicamos el tema guardado

    // Usamos fetch() para obtener los datos desde el archivo JSON
    const response = await fetch(jsonFile); // Aquí pasamos el nombre del archivo JSON como parámetro
    const fullData = await response.json(); // Convertimos la respuesta en un objeto JavaScript

    // Detectamos los idiomas disponibles y seleccionamos el primero por defecto
    const idiomasDisponibles = Object.keys(fullData);  // Obtenemos los idiomas disponibles del objeto
    const idiomaGuardado = localStorage.getItem('idiomaSeleccionado'); // Chequeamos si hay algún idioma guardado en localStorage
    const idiomaPorDefecto = idiomaGuardado && idiomasDisponibles.includes(idiomaGuardado)
      ? idiomaGuardado // Si el idioma guardado está disponible, usa este
      : idiomasDisponibles[0]; // Si no hay idioma guardado, seleccionamos el primer idioma como por defecto

    window.cvData = fullData[idiomaPorDefecto]; // Guardamos la Info Para aplicar el Timeline

    // Establecemos el idioma por defecto
    loadLanguage(idiomaPorDefecto, fullData);

    // Añadimos el selector de idiomas
    setupLanguageSelector(idiomasDisponibles, fullData);

    // Ahora podemos usar los datos para actualizar las secciones del CV
    updatePhoto(photoFile);  // Ahora pasamos la URL de la foto como parámetro
    setupSectionFormatLoading();  // Configura el formato (grid/lista) para las secciones
  } catch (error) {
    console.error('Error al cargar los datos del CV:', error);
  }
}

export function loadLanguage1(idioma, data) {
  const idiomaData = data[idioma];

  // Renderizamos las secciones básicas (sobreMi, objetivo, etc.)
  renderTextContent('sobreMi', idiomaData.sobreMi);
  renderTextContent('objetivo', idiomaData.objetivo);

  // Iteramos sobre las secciones dinámicamente
  for (let section in idiomaData) {
    if (idiomaData.hasOwnProperty(section) && section !== 'secciones' && section !== 'sobreMi' && section !== 'objetivo') {
      // Verificamos si la sección contiene un arreglo (lista) o un solo valor
      if (Array.isArray(idiomaData[section])) {
        renderSection(section);  // Usamos renderSection para listas (arrays)
      } else {
        renderTextContent(section, idiomaData[section]);  // Usamos renderTextContent para valores simples
      }
    }
  }

  // Renderizamos las etiquetas de las secciones
  renderSectionLabels(idiomaData.secciones);

  updateSkills();
  updateLanguages();
}

export function renderSection1(section, data) {
  // Asegúrate de que 'data' no esté vacío
  if (!data || data.length === 0) {
    console.warn(`No hay datos válidos para la sección "${section}"`);
    return; // Si no hay datos, no se renderiza nada
  }

  let itemClass = ''; // Define la clase del ítem según la sección

  // Asegúrate de que la sección que estás renderizando existe en el DOM
  const container = document.getElementById(section);
  if (!container) {
    console.warn(`No se encontró el contenedor con id "${section}"`);
    return;
  }

  // Limpia el contenido previo
  container.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('section-item'); // Asigna una clase genérica o específica

    let contentHTML = '';

    // Genera el contenido dependiendo de la sección
    if (section === 'contacto') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.etiqueta}</h3>
        <p>${item.valor}</p>
      `;
    } else if (section === 'habilidades') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.nombre}</h3>
        <p>Nivel: ${item.nivel}</p>
      `;
    } else if (section === 'idiomas') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.idioma}</h3>
        <p>Nivel: ${item.nivel}</p>
      `;
    } else if (section === 'hobbies') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.nombre}</h3>
      `;
    } else if (section === 'experiencia') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.puesto} en ${item.empresa}</h3>
        <p>${item.descripcion}</p>
        <p><small>${item.fecha}</small></p>
      `;
    } else if (section === 'estudios') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.titulo} en ${item.instituto}</h3>
        <p>${item.detalles}</p>
        <p><small>${item.fecha}</small></p>
      `;
    } else if (section === 'logros') {
      contentHTML = `
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
        <p><small>${item.fecha}</small></p>
      `;
    }

    div.innerHTML = contentHTML;
    container.appendChild(div);
  });
}


// 5️⃣ - Renderizar una sección específica (estudios, experiencia, logros)            /////////////// ORIGINAL //////////
export function renderSection2(section, data) {
  // Buscar el contenedor con el id correspondiente al nombre de la sección
  const container = document.getElementById(section);  // Ejemplo: 'habilidades', 'idiomas', etc.

  if (!container) {
    console.error(`Error: No se encontró el contenedor con el id "${section}"`);
    return;
  }

  if (!Array.isArray(data)) {
    console.error(`Error: El dato de la sección ${section} no es un arreglo válido.`);
    return;
  }

  container.innerHTML = ''; // Limpiar el contenido previo

  // Asignar la clase específica para cada sección
  let itemClass = ''; // Variable para almacenar la clase específica
  if (section === 'habilidades') {
    itemClass = 'habilidad-item';
  } else if (section === 'idiomas') {
    itemClass = 'idioma-item';
  } else if (section === 'contacto') {
    itemClass = 'contacto-item';
  } else if (section === 'experiencia') {
    itemClass = 'experiencia-item';
  } else if (section === 'estudios') {
    itemClass = 'estudio-item';
  } else if (section === 'hobbies') {
    itemClass = 'hobby-item';
  } else if (section === 'logros') {
    itemClass = 'logro-item';
  }

  // Aquí se renderizan los datos basados en la sección
  data.forEach(item => {
    const div = document.createElement('div');
    div.classList.add(itemClass);  // Aplicar la clase correspondiente

    // Verificar qué tipo de datos tiene cada sección
    let contentHTML = '';

    if (section === 'habilidades') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.nombre}</h3>
        <p>Nivel: ${item.nivel}</p>
      `;
    } else if (section === 'idiomas') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.idioma}</h3>
        <p>Nivel: ${item.nivel}</p>
      `;
    } else if (section === 'contacto') {
      // Secciones de contacto, utilizando íconos y etiquetas.
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.etiqueta}</h3>
        <p>${item.valor}</p>
      `;
    } else if (section === 'experiencia') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.puesto} en ${item.empresa}</h3>
        <p>${item.descripcion}</p>
        <p><small>${item.fecha}</small></p>
      `;
    } else if (section === 'estudios') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.titulo} en ${item.instituto}</h3>
        <p>${item.detalles}</p>
        <p><small>${item.fecha}</small></p>
      `;
    } else if (section === 'hobbies') {
      contentHTML = `
        <h3><i class="${item.icono}"></i> ${item.nombre}</h3>
      `;
    } else if (section === 'logros') {
      contentHTML = `
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
        <p><small>${item.fecha}</small></p>
      `;
    }

    // Insertamos el contenido al div
    div.innerHTML = contentHTML;
    container.appendChild(div);
  });
}


