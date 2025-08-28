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
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/CV Online/models-face-api');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/CV Online/models-face-api');
    await faceapi.nets.faceExpressionNet.loadFromUri('/CV Online/models-face-api');
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
 * Centra y escala la imagen dentro del contenedor
 * @param {HTMLElement} wrapper - Wrapper que contiene la imagen
 * @param {HTMLElement} container - Contenedor visible
 * @param {Object} detection - Resultado face-api (bounding box)
 * @returns {Object} { scale, offsetX, offsetY }
 */
export function centerFaceWrapper(wrapper, container, detection) {
  if (!detection) return null;

  // Resetear transform previo
  wrapper.style.transform = 'translate(-50%, -50%) scale(1)';
  wrapper.dataset.offsetX = 0;
  wrapper.dataset.offsetY = 0;
  wrapper.dataset.scale = 1;

  const { x, y, width, height } = detection.detection.box;
  const faceCenterX = x + width / 2;
  const faceCenterY = y + height / 2;

  const margin = 10;
  const scaleX = (container.clientWidth - 2 * margin) / width;
  const scaleY = (container.clientHeight - 2 * margin) / height;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = container.clientWidth / 2 - faceCenterX * scale;
  const offsetY = container.clientHeight / 2 - faceCenterY * scale;

  wrapper.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  wrapper.dataset.offsetX = offsetX;
  wrapper.dataset.offsetY = offsetY;
  wrapper.dataset.scale = scale;

  return { scale, offsetX, offsetY };
}

/* ==========================================================
   4️⃣ Función de dibujo de landmarks
========================================================== */

/**
 * Dibuja los landmarks en un canvas alineado con la imagen
 * @param {HTMLImageElement} imageElement - Imagen de la cara
 * @param {HTMLElement} containerElement - Contenedor visible
 * @param {Object} detection - Resultado face-api
 */
export function drawLandmarks(imageElement, containerElement, detection) {
  if (!detection) return;

  const wrapper = imageElement.parentElement;

  // --- 1️⃣ Recuperar escala y offsets del dataset (ya actualizado por centerFaceWrapper)
  const scale = parseFloat(wrapper.dataset.scale) || 1;
  const offsetX = parseFloat(wrapper.dataset.offsetX) || 0;
  const offsetY = parseFloat(wrapper.dataset.offsetY) || 0;

  // --- 2️⃣ Crear canvas overlay si no existe
  let canvas = wrapper.querySelector('canvas.face-overlay');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.classList.add('face-overlay');
    wrapper.appendChild(canvas);
  }

  // Ajustar tamaño del canvas al contenedor
  canvas.width = containerElement.clientWidth;
  canvas.height = containerElement.clientHeight;
  canvas.style.width = `${containerElement.clientWidth}px`;
  canvas.style.height = `${containerElement.clientHeight}px`;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { x, y, width, height } = detection.detection.box;

  // --- 3️⃣ Transformar coordenadas de la imagen a coordenadas visibles
  const transformPoint = (px, py) => {
    const cx = containerElement.clientWidth / 2;
    const cy = containerElement.clientHeight / 2;
    const imgW = imageElement.naturalWidth;
    const imgH = imageElement.naturalHeight;
    return {
      x: (px - imgW / 2) * scale + offsetX + cx,
      y: (py - imgH / 2) * scale + offsetY + cy
    };
  };

  // --- 4️⃣ Dibujar bounding box completo
  const topLeft = transformPoint(x, y);
  const bottomRight = transformPoint(x + width, y + height);
  ctx.strokeStyle = 'rgba(255,0,0,0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);

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

  drawPoints(detection.landmarks.getLeftEye(), 'blue');
  drawPoints(detection.landmarks.getRightEye(), 'blue');
  drawPoints(detection.landmarks.getNose(), 'green');
  drawPoints(detection.landmarks.getMouth(), 'purple');

  // --- 6️⃣ Dibujar centro del rostro
  const center = transformPoint(x + width / 2, y + height / 2);
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
  ctx.fill();

  // --- 7️⃣ Log para debug
  console.log('🎨 Landmarks dibujados | scale:', scale, 'offsetX:', offsetX, 'offsetY:', offsetY);
}



/* ==========================================================
   5️⃣ Configuración de flags y botones
========================================================== */

let ENABLE_FACE_CENTERING = false;   // centrar automáticamente
let ENABLE_LANDMARKS_DRAW = true;    // dibujar landmarks

export function setFaceCentering(enabled) { ENABLE_FACE_CENTERING = enabled; }
export function setLandmarksDraw(enabled) { ENABLE_LANDMARKS_DRAW = enabled; }

/**
 * Inicializa el botón "center-face-btn"
 * - Dibuja landmarks sin mover la imagen si ENABLE_FACE_CENTERING=false
 * - Centra la imagen si ENABLE_FACE_CENTERING=true
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

      const wrapper = img.parentElement;
      let scale, offsetX, offsetY;

      if (ENABLE_FACE_CENTERING) {
        // 4️⃣ Centrar la imagen usando bounding box
        console.log('🔹 Centrado automático activado, aplicando transform...');
        ({ scale, offsetX, offsetY } = centerFaceWrapper(wrapper, container, detection));
        console.log(`📐 Transform aplicado | scale=${scale.toFixed(2)}, offsetX=${offsetX.toFixed(1)}, offsetY=${offsetY.toFixed(1)}`);

        // 5️⃣ Actualizar dataset del wrapper para drawLandmarks
        wrapper.dataset.scale = scale;
        wrapper.dataset.offsetX = offsetX;
        wrapper.dataset.offsetY = offsetY;

      } else {
        // 6️⃣ Mantener posición actual sin centrar
        scale = parseFloat(wrapper.dataset.scale) || 1;
        offsetX = parseFloat(wrapper.dataset.offsetX) || 0;
        offsetY = parseFloat(wrapper.dataset.offsetY) || 0;
        console.log('🔹 Centrado automático desactivado, usando posición actual');

        wrapper.dataset.scale = scale;
        wrapper.dataset.offsetX = offsetX;
        wrapper.dataset.offsetY = offsetY;
      }

      // 7️⃣ Dibujar landmarks si está habilitado
      if (ENABLE_LANDMARKS_DRAW) {
        console.log('🎨 Dibujando landmarks sobre la imagen...');
        drawLandmarks(img, container, detection);
        console.log('✅ Landmarks dibujados correctamente');
      }

    } catch (err) {
      console.error('❌ Error centrando/dibujando rostro:', err);
    }
  });
}
