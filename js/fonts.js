// fonts.js

// Lista de enlaces a Google Fonts y otros recursos
const FONT_LINKS = [
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
  
  // Función para cargar dinámicamente todos los enlaces de fuentes
  function loadFontLinks() {
    FONT_LINKS.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
  
      link.onload = () => console.log(`Fuente cargada: ${url}`);
      link.onerror = () => console.error(`Error cargando la fuente: ${url}`);
    });
  }
  
  // Exportar función principal
  export function loadFonts() {
    loadFontLinks();
  }
  