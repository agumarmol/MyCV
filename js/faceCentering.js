/*
 * faceCentering.js
 * Detecta y centra la cara dentro del contenedor usando face-api.js
 */

let modelsLoaded = false;

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
 * Función para precargar los modelos en segundo plano
 */
export async function preloadFaceApiModels() {
  console.log('Cargando modelos de face-api en segundo plano...');
  try {
    await loadModels();
    console.log('✅ Modelos de face-api listos para usar');
  } catch (err) {
    console.error('❌ Error cargando modelos de face-api en segundo plano:', err);
  }
}

/**
 * Espera a que la imagen termine de cargar
 */
async function waitForImageLoad(img) {
  if (img.complete && img.naturalHeight !== 0) return;
  return new Promise(resolve => {
    img.onload = resolve;
    img.onerror = () => resolve(); // evita bloqueo si falla
  });
}

/**
 * Detecta y centra la cara dentro del contenedor
 * @param {HTMLImageElement} imageElement - Imagen de la cara
 * @param {HTMLElement} containerElement - Contenedor del placeholder
 */
async function detectAndCenterFace(imageElement, containerElement) {
  console.log('🔎 Detectando rostro...');

  // Detectar rostro + landmarks + expresiones
  const detection = await faceapi
    .detectSingleFace(imageElement)
    .withFaceLandmarks()
    .withFaceExpressions();

  if (!detection) {
    console.warn('⚠️ No se detectó ninguna cara en la imagen.');
    return;
  }

  // Obtener dimensiones naturales de la imagen
  const imageWidth = imageElement.naturalWidth;
  const imageHeight = imageElement.naturalHeight;

  // Información de la caja del rostro
  const { x, y, width, height } = detection.detection.box;
  console.log('📦 Caja de detección:', { x, y, width, height });

  // Landmarks (ojos, nariz, boca)
  console.log('👁️ Landmarks ojos:', detection.landmarks.getLeftEye(), detection.landmarks.getRightEye());
  console.log('👃 Nariz:', detection.landmarks.getNose());
  console.log('👄 Boca:', detection.landmarks.getMouth());

  // Centro de la cara detectada
  const faceCenterX = x + width / 2;
  const faceCenterY = y + height / 2;

  // Dimensiones del contenedor (placeholder)
  const containerWidth = containerElement.clientWidth;
  const containerHeight = containerElement.clientHeight;

  // Margen opcional para que no toque bordes
  const margin = 10; // px

  // Escala dinámica para que la cara encaje dentro del contenedor
  const scaleX = (containerWidth - 2 * margin) / width;
  const scaleY = (containerHeight - 2 * margin) / height;
  const scale = Math.min(scaleX, scaleY);
  console.log('⚖️ Scale calculado dinámicamente:', scale);

  // Offset para centrar la cara en el contenedor
  const offsetX = containerWidth / 2 - faceCenterX * scale;
  const offsetY = containerHeight / 2 - faceCenterY * scale;
  console.log('📐 Offset calculado:', offsetX, offsetY);

  // ⚡ Forzar que la transformación se haga desde el centro de la imagen
  imageElement.style.transformOrigin = 'center center';

  // Aplicar transformación final
  imageElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

  console.log('✅ Cara centrada y ajustada al contenedor');

  // 🔹 Dibujar canvas de depuración alineado con la imagen transformada
  drawDetectionCanvas(imageElement, containerElement, detection, scale, offsetX, offsetY);
}

/**
 * Función opcional para dibujar el canvas de depuración sobre la imagen
 * @param {HTMLImageElement} imageElement - Imagen sobre la que se detecta la cara
 * @param {HTMLElement} containerElement - Contenedor donde se coloca el canvas
 * @param {Object} detection - Resultado de la detección de face-api
 * @param {number} scale - Escala aplicada a la imagen
 * @param {number} offsetX - Offset X aplicado a la imagen
 * @param {number} offsetY - Offset Y aplicado a la imagen
 */
function drawDetectionCanvas(imageElement, containerElement, detection, scale = 1, offsetX = 0, offsetY = 0) {
  if (!detection) return;

  // Buscar canvas existente o crear uno nuevo
  let canvas = containerElement.querySelector('canvas.face-overlay');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.classList.add('face-overlay');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none'; // no bloquea la interacción
    containerElement.style.position = 'relative'; // asegurar contenedor relativo
    containerElement.appendChild(canvas);
  }

  // Ajustar tamaño del canvas al contenedor
  canvas.width = containerElement.clientWidth;
  canvas.height = containerElement.clientHeight;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Escalar detección a tamaño de la imagen transformada
  const scaleX = scale;
  const scaleY = scale;

  const { x, y, width, height } = detection.detection.box;
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(x * scaleX + offsetX, y * scaleY + offsetY, width * scaleX, height * scaleY);

  // Función para dibujar landmarks
  const drawPoints = (points, color = 'blue') => {
    ctx.fillStyle = color;
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * scaleX + offsetX, p.y * scaleY + offsetY, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  // Dibujar landmarks con colores diferenciados
  drawPoints(detection.landmarks.getLeftEye(), 'blue');
  drawPoints(detection.landmarks.getRightEye(), 'blue');
  drawPoints(detection.landmarks.getNose(), 'green');
  drawPoints(detection.landmarks.getMouth(), 'purple');

  // Dibujar centro de la cara
  const faceCenterX = x + width / 2;
  const faceCenterY = y + height / 2;
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(faceCenterX * scaleX + offsetX, faceCenterY * scaleY + offsetY, 3, 0, 2 * Math.PI);
  ctx.fill();
}

/**
 * Configura el botón "Centrar rostro"
 */
export function setupFaceCentering() {
  const btn = document.getElementById('center-face-btn');
  const imageElement = document.getElementById('foto');
  const containerElement = document.getElementById('foto-container');

  if (!btn || !imageElement || !containerElement) {
    console.warn("⏩ No se encontró algún elemento para centrar la cara.");
    return;
  }

  console.log('⚡ Botón de centrar rostro listo');

  btn.addEventListener('click', async () => {
    console.log('🖱️ Botón presionado');
    try {
      await loadModels();               // asegura que los modelos estén cargados
      await waitForImageLoad(imageElement);
      await detectAndCenterFace(imageElement, containerElement);
    } catch (err) {
      console.error('❌ Error al centrar la cara:', err);
      alert('No se pudo centrar la cara. Revisa la consola para más detalles.');
    }
  });
}
