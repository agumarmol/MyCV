/*
 * faceCentering.js
 * Detecta y centra la cara dentro del contenedor usando face-api.js
 * Estrategia:
 * 1️⃣ Detectar rostro + landmarks
 * 2️⃣ Aplicar centrado y escalado al wrapper
 * 3️⃣ Dibujar landmarks sobre canvas alineado al wrapper
 */

let modelsLoaded = false;

/* ==========================================================
   1️⃣ Carga de modelos face-api
========================================================== */

/**
 * Carga los modelos de face-api desde la carpeta local `/models-face-api`
 */
export async function loadModels() {
  if (modelsLoaded) return;
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/CV%20Online/models-face-api');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/CV%20Online/models-face-api');
    await faceapi.nets.faceExpressionNet.loadFromUri('/CV%20Online/models-face-api');
    modelsLoaded = true;
    console.log('✅ Modelos de face-api cargados correctamente');
  } catch (err) {
    console.error('❌ Error cargando modelos de face-api:', err);
  }
}

/**
 * Precarga los modelos en segundo plano
 */
export async function preloadFaceApiModels() {
  console.log('Cargando modelos de face-api en segundo plano...');
  await loadModels();
  console.log('✅ Modelos de face-api listos para usar');
}

/* ==========================================================
   2️⃣ Espera a que la imagen termine de cargar
========================================================== */
export function waitForImageLoad(img) {
  return new Promise(resolve => {
    if (img.complete && img.naturalWidth > 0) {
      resolve();
    } else {
      img.addEventListener('load', () => resolve(), { once: true });
      img.addEventListener('error', () => resolve(), { once: true });
    }
  });
}

/* ==========================================================
   3️⃣ Función de centrado de la imagen
========================================================== */

/**
 * Centra y escala la imagen dentro del contenedor basándose en la cara detectada
 * @param {HTMLElement} wrapper - Contenedor de la imagen
 * @param {HTMLElement} container - Contenedor visible donde se muestra la imagen
 * @param {Object} detection - Resultado de face-api (bounding box)
 * @param {number} padding - Padding aplicado en getPaddedImageCanvas
 * @returns {Object} { scale, offsetX, offsetY }
 */
export function centerFaceWrapper(wrapper, container, detection, padding = 50) {
  if (!detection) return null;

  const img = wrapper.querySelector('img');
  if (!img) return null;

  const box = detection.detection.box;
  console.log('📦 Bounding Box Original:', box);

  // --- 1️⃣ Escalar la imagen para que quepa en el contenedor
  const scaleX = container.clientWidth / img.naturalWidth;
  const scaleY = container.clientHeight / img.naturalHeight;
  const scale = Math.min(scaleX, scaleY);
  console.log('🔹 scaleX:', scaleX, 'scaleY:', scaleY, 'scale uniforme:', scale);

  // --- 2️⃣ Centro del contenedor
  const cx = container.clientWidth / 2;
  const cy = container.clientHeight / 2;

  // --- 3️⃣ Centro de la cara (con padding)
  const faceCenterX = box.x + box.width / 2 + padding;
  const faceCenterY = box.y + box.height / 2 + padding;

  // --- 4️⃣ Calcular offsets para centrar la cara en el contenedor
  const offsetX = cx - faceCenterX * scale;
  const offsetY = cy - faceCenterY * scale;

  // --- 5️⃣ Aplicar transformación al wrapper
  wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  wrapper.style.transformOrigin = 'top left';

  // --- 6️⃣ Guardar en dataset para drawLandmarksDebug
  wrapper.dataset.scale = scale;
  wrapper.dataset.offsetX = offsetX;
  wrapper.dataset.offsetY = offsetY;

  console.log(`📐 Transform aplicado | translateX: ${offsetX.toFixed(1)}, translateY: ${offsetY.toFixed(1)}, scale: ${scale.toFixed(2)}`);

  return { scale, offsetX, offsetY };
}


/* ==========================================================
   4️⃣ Función de dibujo de landmarks
========================================================== */

/**
 * Dibuja los landmarks en un canvas alineado con la imagen
 * Ajustado para que coincida con la escala y posición de la imagen dentro del contenedor
 * @param {HTMLImageElement} imageElement - Imagen de la cara
 * @param {HTMLElement} containerElement - Contenedor visible
 * @param {Object} detection - Resultado face-api
 */
export function drawLandmarks(imageElement, containerElement, detection) {
  if (!detection) return;

  const wrapper = imageElement.parentElement;

  // --- 1️⃣ Calcular escala y offsets uniformes respecto al contenedor
  const scaleX = containerElement.clientWidth / imageElement.naturalWidth;
  const scaleY = containerElement.clientHeight / imageElement.naturalHeight;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = (containerElement.clientWidth - imageElement.naturalWidth * scale) / 2;
  const offsetY = (containerElement.clientHeight - imageElement.naturalHeight * scale) / 2;

  console.log('📦 Bounding Box Original:', detection.detection.box);
  console.log('🔹 scale:', scale, 'offsetX:', offsetX, 'offsetY:', offsetY);

  // --- 2️⃣ Crear canvas overlay si no existe
  let canvas = wrapper.querySelector('canvas.face-overlay');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.classList.add('face-overlay');
    wrapper.appendChild(canvas);
  }

  // 🔹 Hacemos que el canvas cubra TODO el contenedor visible
  canvas.width = containerElement.clientWidth;
  canvas.height = containerElement.clientHeight;
  canvas.style.width = `${containerElement.clientWidth}px`;
  canvas.style.height = `${containerElement.clientHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- 3️⃣ Función para transformar puntos de imagen a coordenadas del canvas
  const padding = 50; // el mismo que usamos al crear el canvas con padding
  const transformPoint = (px, py) => ({
    x: (px - padding) * scaleX + offsetX,
    y: (py - padding) * scaleY + offsetY
  });

  // --- 4️⃣ Dibujar bounding box completo
  const { x, y, width, height } = detection.detection.box;
  const topLeft = transformPoint(x, y);
  const bottomRight = transformPoint(x + width, y + height);

  ctx.strokeStyle = 'rgba(255,0,0,0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    topLeft.x,
    topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y
  );

  console.log('📦 Bounding Box Transformado:', { topLeft, bottomRight });

  // --- 5️⃣ Dibujar landmarks
  const drawPoints = (points, color) => {
    ctx.fillStyle = color;
    points.forEach(p => {
      const tp = transformPoint(p.x, p.y);
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const landmarks = detection.landmarks;

  console.log('🟢 Jaw Outline:', landmarks.getJawOutline());
  console.log('🟢 Left Eye:', landmarks.getLeftEye());
  console.log('🟢 Right Eye:', landmarks.getRightEye());
  console.log('🟢 Left Eyebrow:', landmarks.getLeftEyeBrow());
  console.log('🟢 Right Eyebrow:', landmarks.getRightEyeBrow());
  console.log('🟢 Nose:', landmarks.getNose());
  console.log('🟢 Mouth:', landmarks.getMouth());

  drawPoints(landmarks.getJawOutline(), 'green');
  drawPoints(landmarks.getLeftEye(), 'blue');
  drawPoints(landmarks.getRightEye(), 'blue');
  drawPoints(landmarks.getLeftEyeBrow(), 'orange');
  drawPoints(landmarks.getRightEyeBrow(), 'orange');
  drawPoints(landmarks.getNose(), 'purple');
  drawPoints(landmarks.getMouth(), 'pink');

  // --- 6️⃣ Dibujar centro del rostro
  const center = transformPoint(x + width / 2, y + height / 2);
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
  ctx.fill();

  console.log('🎨 Landmarks dibujados correctamente | scale:', scale, 'offsetX:', offsetX, 'offsetY:', offsetY);
}



/**
 * drawLandmarksDebug
 * Dibuja landmarks sobre la imagen y muestra logs detallados para debug
 * @param {HTMLImageElement} imageElement - Imagen de la cara
 * @param {HTMLElement} containerElement - Contenedor visible
 * @param {Object} detection - Resultado face-api
 * @param {number} padding - padding usado en getPaddedImageCanvas (en px)
 */
export function drawLandmarksDebug(imageElement, containerElement, detection, padding) {
  if (!detection) return;
  const wrapper = imageElement.parentElement;

  console.log('🎨 Dibujando landmarks sobre la imagen...');

  // --- 1️⃣ Escala y offset real
  const scaleX = imageElement.clientWidth / imageElement.naturalWidth;
  const scaleY = imageElement.clientHeight / imageElement.naturalHeight;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = parseFloat(wrapper.dataset.offsetX) || 0;
  const offsetY = parseFloat(wrapper.dataset.offsetY) || 0;

  // --- 2️⃣ Crear canvas overlay si no existe
  let canvas = wrapper.querySelector('canvas.face-overlay');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.classList.add('face-overlay');
    wrapper.appendChild(canvas);
  }
  canvas.width = containerElement.clientWidth;
  canvas.height = containerElement.clientHeight;
  canvas.style.width = `${containerElement.clientWidth}px`;
  canvas.style.height = `${containerElement.clientHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const box = detection.detection.box;

  // --- 3️⃣ Función de transformación de puntos
  // ⚡ CAMBIO: usar padding dinámico y asegurarse que sea >= 50px
  const finalPadding = Math.max(padding, 50);  // ✅ cambio principal
  const transformPoint = (px, py) => {
    const cx = containerElement.clientWidth / 2;
    const cy = containerElement.clientHeight / 2;
    return {
      x: (px - finalPadding - imageElement.naturalWidth / 2) * scaleX + offsetX + cx,
      y: (py - finalPadding - imageElement.naturalHeight / 2) * scaleY + offsetY + cy
    };
  };

  // --- 4️⃣ Dibujar bounding box
  const topLeft = transformPoint(box.x, box.y);
  const bottomRight = transformPoint(box.x + box.width, box.y + box.height);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);

  // --- 5️⃣ Dibujar landmarks
  const landmarks = detection.landmarks;
  const drawPoints = (points, color) => {
    ctx.fillStyle = color;
    const radius = Math.max(2, 2 * scale);
    points.forEach(p => {
      const tp = transformPoint(p.x, p.y);
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  try {
    drawPoints(landmarks.getJawOutline(), 'green');
    drawPoints(landmarks.getLeftEye(), 'blue');
    drawPoints(landmarks.getRightEye(), 'blue');
    drawPoints(landmarks.getNose(), 'orange');
    drawPoints(landmarks.getMouth(), 'purple');

    const faceCenter = transformPoint(box.x + box.width / 2, box.y + box.height / 2);
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(faceCenter.x, faceCenter.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  } catch (err) {
    console.warn('❌ Error dibujando algunos landmarks:', err);
  }

  console.log('🎨 Landmarks dibujados correctamente | scaleX:', scaleX, 'scaleY:', scaleY, 'offsetX:', offsetX, 'offsetY:', offsetY);
}



/* ==========================================================
   5️⃣ Configuración de botones
========================================================== */

/**
 * Inicializa el botón "center-face-btn"
 * - Detecta la cara y centra la imagen dentro del contenedor
 * - No dibuja landmarks
 */
export function setupFaceCenteringButton() {
  const btn = document.getElementById('center-face-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const img = document.getElementById('foto');
    const container = document.getElementById('foto-container');
    if (!img || !container) {
      console.warn('⚠️ Imagen o contenedor no encontrados');
      return;
    }

    try {
      console.log('🖱️ center-face-btn presionado');

      // 1️⃣ Cargar modelos de face-api si no están cargados
      await loadModels();
      console.log('✅ Modelos de face-api listos');

      // 2️⃣ Esperar que la imagen cargue completamente
      await waitForImageLoad(img);
      await new Promise(r => setTimeout(r, 50)); // asegurar dimensiones finales
      console.log('✅ Imagen lista para procesar');

      // 3️⃣ Detectar rostro + landmarks
      const detection = await faceapi.detectSingleFace(img).withFaceLandmarks();
      if (!detection) {
        console.warn('⚠️ No se detectó ninguna cara en la imagen');
        return;
      }
      console.log('✅ Cara detectada');

      // 4️⃣ Aplicar centrado automático usando bounding box
      const wrapper = img.parentElement;
      console.log('🔹 Aplicando centrado automático...');
      const { scale, offsetX, offsetY } = centerFaceWrapper(wrapper, container, detection);
      console.log(`📐 Transform aplicado | scale=${scale.toFixed(2)}, offsetX=${offsetX.toFixed(1)}, offsetY=${offsetY.toFixed(1)}`);

      // 5️⃣ Guardar los valores en dataset para referencia futura
      wrapper.dataset.scale = scale;
      wrapper.dataset.offsetX = offsetX;
      wrapper.dataset.offsetY = offsetY;

    } catch (err) {
      console.error('❌ Error centrando rostro:', err);
    }
  });
}



/**
 * Inicializa el botón "detect-face-btn"
 * - Solo detecta y dibuja landmarks, sin aplicar centrado automático
 */
/**
 * Inicializa el botón "detect-face-btn"
 * - Detecta la cara y dibuja landmarks usando padding dinámico
 */
export function setupFaceDetectionButton() {
  const btn = document.getElementById('detect-face-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const img = document.getElementById('foto');
    const container = document.getElementById('foto-container');
    if (!img || !container) {
      console.warn('⚠️ Imagen o contenedor no encontrados');
      return;
    }

    try {
      console.log('🖱️ detect-face-btn presionado');

      // 1️⃣ Cargar modelos de face-api si no están cargados
      await loadModels();
      console.log('✅ Modelos de face-api listos');

      // 2️⃣ Esperar que la imagen cargue completamente
      await waitForImageLoad(img);
      await new Promise(r => setTimeout(r, 50));
      console.log('✅ Imagen lista para procesar');

      // 3️⃣ Detectar rostro primero sin padding para calcular padding dinámico
      const initialDetection = await faceapi.detectSingleFace(img).withFaceLandmarks();
      if (!initialDetection) {
        console.warn('⚠️ No se detectó ninguna cara en la imagen');
        return;
      }

      const box = initialDetection.detection.box;

      // 4️⃣ Calcular padding dinámico según márgenes de la cara
      const marginTop = box.y;
      const marginBottom = img.naturalHeight - (box.y + box.height);
      const marginLeft = box.x;
      const marginRight = img.naturalWidth - (box.x + box.width);

      const maxPadding = 200; // límite superior
      const padding = Math.min(maxPadding, marginTop, marginBottom, marginLeft, marginRight);
      console.log(`🟢 Padding dinámico calculado: ${padding}px`);

      // 5️⃣ Crear canvas con padding
      const paddedCanvas = getPaddedImageCanvas(img, padding);

      // 6️⃣ Detectar nuevamente sobre imagen con padding
      const detection = await faceapi.detectSingleFace(paddedCanvas).withFaceLandmarks();
      if (!detection) {
        console.warn('⚠️ No se detectó la cara en la imagen con padding');
        return;
      }
      console.log('✅ Cara detectada con padding');

      const wrapper = img.parentElement;

      // 7️⃣ Mantener la posición actual (no centrar en este botón)
      const scale = parseFloat(wrapper.dataset.scale) || 1;
      const offsetX = parseFloat(wrapper.dataset.offsetX) || 0;
      const offsetY = parseFloat(wrapper.dataset.offsetY) || 0;
      wrapper.dataset.scale = scale;
      wrapper.dataset.offsetX = offsetX;
      wrapper.dataset.offsetY = offsetY;

      // 8️⃣ Dibujar landmarks
      if (ENABLE_LANDMARKS_DRAW) {
        console.log('🎨 Dibujando landmarks sobre la imagen...');
        drawLandmarksDebug(img, container, detection, padding);
        console.log('✅ Landmarks dibujados correctamente');
      }

    } catch (err) {
      console.error('❌ Error detectando rostro:', err);
    }
  });
}



// /* ==========================================================
//    5️⃣ Configuración de flags y botones
// ========================================================== */

let ENABLE_FACE_CENTERING = false;   // centrar automáticamente
let ENABLE_LANDMARKS_DRAW = true;    // dibujar landmarks

// export function setFaceCentering(enabled) { ENABLE_FACE_CENTERING = enabled; }
// export function setLandmarksDraw(enabled) { ENABLE_LANDMARKS_DRAW = enabled; }

// /**
//  * Inicializa el botón "center-face-btn"
//  * - Dibuja landmarks sin mover la imagen si ENABLE_FACE_CENTERING=false
//  * - Centra la imagen si ENABLE_FACE_CENTERING=true
//  */
// export function setupFaceCenteringButton() {
//   const btn = document.getElementById('center-face-btn');
//   if (!btn) return;

//   btn.addEventListener('click', async () => {
//     const img = document.getElementById('foto');
//     const container = document.getElementById('foto-container');
//     if (!img || !container) {
//       console.warn('⚠️ Imagen o contenedor no encontrados');
//       return;
//     }

//     try {
//       console.log('🖱️ center-face-btn presionado');

//       // 1️⃣ Cargar modelos de face-api si no están cargados
//       await loadModels();
//       console.log('✅ Modelos de face-api listos');

//       // 2️⃣ Esperar que la imagen cargue completamente
//       await waitForImageLoad(img);
//       await new Promise(r => setTimeout(r, 50)); // asegurar dimensiones finales
//       console.log('✅ Imagen lista para procesar');

//       // 3️⃣ Detectar rostro + landmarks
//       const detection = await faceapi.detectSingleFace(img).withFaceLandmarks();
//       if (!detection) {
//         console.warn('⚠️ No se detectó ninguna cara en la imagen');
//         return;
//       }
//       console.log('✅ Cara detectada');

//       const wrapper = img.parentElement;
//       let scale, offsetX, offsetY;

//       if (ENABLE_FACE_CENTERING) {
//         // 4️⃣ Centrar la imagen usando bounding box
//         console.log('🔹 Centrado automático activado, aplicando transform...');
//         ({ scale, offsetX, offsetY } = centerFaceWrapper(wrapper, container, detection));
//         console.log(`📐 Transform aplicado | scale=${scale.toFixed(2)}, offsetX=${offsetX.toFixed(1)}, offsetY=${offsetY.toFixed(1)}`);

//         // 5️⃣ Actualizar dataset del wrapper para drawLandmarks
//         wrapper.dataset.scale = scale;
//         wrapper.dataset.offsetX = offsetX;
//         wrapper.dataset.offsetY = offsetY;

//       } else {
//         // 6️⃣ Mantener posición actual sin centrar
//         scale = parseFloat(wrapper.dataset.scale) || 1;
//         offsetX = parseFloat(wrapper.dataset.offsetX) || 0;
//         offsetY = parseFloat(wrapper.dataset.offsetY) || 0;
//         console.log('🔹 Centrado automático desactivado, usando posición actual');

//         wrapper.dataset.scale = scale;
//         wrapper.dataset.offsetX = offsetX;
//         wrapper.dataset.offsetY = offsetY;
//       }

//       // 7️⃣ Dibujar landmarks si está habilitado
//       if (ENABLE_LANDMARKS_DRAW) {
//         console.log('🎨 Dibujando landmarks sobre la imagen...');
//         drawLandmarks(img, container, detection);
//         console.log('✅ Landmarks dibujados correctamente');
//       }

//     } catch (err) {
//       console.error('❌ Error centrando/dibujando rostro:', err);
//     }
//   });
// }


/**
 * Crea un canvas temporal con padding alrededor de la imagen
 * @param {HTMLImageElement} img - Imagen original
 * @param {number} padding - Pixels de padding a agregar alrededor
 * @param {string} backgroundColor - Color de fondo opcional
 * @param {number} minPadding - Padding mínimo garantizado (por defecto 50px)
 * @returns {HTMLCanvasElement} - Canvas con la imagen centrada y padding
 */
function getPaddedImageCanvas(img, padding = 50, backgroundColor = 'white', minPadding = 50) {
  // Asegurarse que el padding nunca sea menor al mínimo
  const finalPadding = Math.max(padding, minPadding);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth + finalPadding * 2;
  canvas.height = img.naturalHeight + finalPadding * 2;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar la imagen centrada dentro del canvas con el padding garantizado
  ctx.drawImage(img, finalPadding, finalPadding, img.naturalWidth, img.naturalHeight);

  return canvas;
}
