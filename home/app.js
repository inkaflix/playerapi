// =======================================================
// === CONFIGURACIÓN DE LA API ===========================
// =======================================================

// ⚠️ DEBES REEMPLAZAR ESTO con tu clave de API de TMDb
const TMDB_API_KEY = "867b27ebb5a72c3f64ee67bc9dd7a794"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; 

// =======================================================
// === ESTRUCTURA DE CONTENIDO CON URL MANUAL POR ITEM ===
// =======================================================

// Estructura de contenido que define qué filas se mostrarán.
// Cada item tiene el ID de TMDb y la URL de destino manual.
const streamingIDs = [
    // ----------------------------------------------------
    // CATEGORÍAS PRINCIPALES
    // ----------------------------------------------------
    {
        title: "Películas",
        type: "movie", 
        content: [
            { id: "286217", url_destino: "https://ufnetics.com/play/martian" },
            { id: "157336", url_destino: "https://ufnetics.com/play/interstellar" },
            { id: "315635", url_destino: "https://ufnetics.com/play/arrival" },
            { id: "550", url_destino: "https://ufnetics.com/play/fightclub" },
            { id: "343611", url_destino: "https://ufnetics.com/play/jackreacher" },
            { id: "424", url_destino: "https://ufnetics.com/play/schindlerslist" },
        ]
    },
    {
        title: "Series",
        type: "tv", 
        content: [
            { id: "1399", url_destino: "https://ufnetics.com/series/got" },
            { id: "66732", url_destino: "https://ufnetics.com/series/strangerthings" },
            { id: "71912", url_destino: "https://ufnetics.com/series/thewitcher" },
            { id: "60735", url_destino: "https://ufnetics.com/series/flash" },
            { id: "82856", url_destino: "https://ufnetics.com/series/mandalorian" },
        ]
    },
    {
        title: "Animes (Series de TV)",
        type: "tv", 
        content: [
            // IDs de series de Anime populares (ejemplos)
            { id: "73586", url_destino: "https://ufnetics.com/anime/aot" }, 
            { id: "31910", url_destino: "https://ufnetics.com/anime/deathnote" }, 
            { id: "37854", url_destino: "https://ufnetics.com/anime/demon-slayer" }, 
            { id: "4586", url_destino: "https://ufnetics.com/anime/naruto" },
        ]
    },
    
    // ----------------------------------------------------
    // CATEGORÍAS DINÁMICAS (TENDENCIA / LO NUEVO)
    // ----------------------------------------------------
    {
        title: "🔥 Lo más nuevo",
        type: "movie",
        content: [
            { id: "475557", url_destino: "https://ufnetics.com/play/joker-nuevo" },
            { id: "603", url_destino: "https://ufnetics.com/play/matrix-nuevo" },
            { id: "496243", url_destino: "https://ufnetics.com/play/parasite-nuevo" },
            { id: "76341", url_destino: "https://ufnetics.com/play/madmax-nuevo" },
            { id: "671", url_destino: "https://ufnetics.com/play/harrypotter1" },
            { id: "703771", url_destino: "https://ufnetics.com/play/thewhale" },
        ]
    },
    {
        title: "📈 En Tendencia (Series)",
        type: "tv",
        content: [
            { id: "1402", url_destino: "https://ufnetics.com/series/walkingdead" },
            { id: "119051", url_destino: "https://ufnetics.com/series/wednesday" },
            { id: "1416", url_destino: "https://ufnetics.com/series/greys-anatomy" },
            { id: "456", url_destino: "https://ufnetics.com/series/thesimpsons" },
            { id: "1622", url_destino: "https://ufnetics.com/series/sherlock" },
        ]
    },
    
    // ----------------------------------------------------
    // GÉNEROS ESPECÍFICOS
    // ----------------------------------------------------
    {
        title: "🎬 Animación (Películas)",
        type: "movie",
        content: [
            // IDs de películas de Animación populares (ejemplos)
            { id: "280", url_destino: "https://ufnetics.com/animacion/monstersinc" }, 
            { id: "10195", url_destino: "https://ufnetics.com/animacion/toystory3" }, 
            { id: "49645", url_destino: "https://ufnetics.com/animacion/up" }, 
            { id: "11", url_destino: "https://ufnetics.com/animacion/starwars" },
            { id: "105", url_destino: "https://ufnetics.com/animacion/backtothefuture" },
        ]
    },
    {
        title: "😱 Terror",
        type: "movie",
        content: [
            // IDs de películas de Terror populares (ejemplos)
            { id: "539", url_destino: "https://ufnetics.com/terror/silence-of-lambs" }, 
            { id: "272", url_destino: "https://ufnetics.com/terror/batman-begins" }, 
            { id: "397", url_destino: "https://ufnetics.com/terror/pulp-fiction" }, 
            { id: "585", url_destino: "https://ufnetics.com/terror/terminator2" },
            { id: "680", url_destino: "https://ufnetics.com/terror/pulpfiction" },
        ]
    },
];


// =======================================================
// === LÓGICA DE API Y RENDERIZADO (NO CAMBIA) ============
// =======================================================

/**
 * Realiza la petición a la API de TMDb para obtener los detalles.
 * (Función inalterada, pero ahora usa contentItem.id y contentItem.url_destino)
 */
async function fetchTMDBDetails(contentItem, type) {
    const url = `${TMDB_BASE_URL}/${type}/${contentItem.id}?api_key=${TMDB_API_KEY}&language=es-ES`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error al obtener ${type} ${contentItem.id}:`, response.statusText);
            return null;
        }
        const data = await response.json();
        return {
            title: data.title || data.name,
            poster_path: data.poster_path,
            id: contentItem.id,
            media_type: type,
            // AGREGAMOS LA URL MANUAL
            manual_url: contentItem.url_destino 
        };
    } catch (error) {
        console.error("Error de red al llamar a TMDb:", error);
        return null;
    }
}

/**
 * Crea el HTML para una sola tarjeta. (Inalterada)
 */
function createCard(item) {
    const imageUrl = item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/150x225/333333/FFFFFF?text=No+Poster';

    return `
        <div class="card" style="background-image: url('${imageUrl}');" 
             title="${item.title}" 
             data-nav-item="content" 
             data-tmdb-id="${item.id}"
             data-media-url="${item.manual_url}">
        </div>
    `;
}

/**
 * Crea y renderiza una fila completa. (Inalterada)
 */
async function renderRow(rowConfig) {
    const contentContainer = document.getElementById('content-container');

    const rowDiv = document.createElement('div');
    rowDiv.className = 'content-row';
    rowDiv.innerHTML = `<div class="row-title">${rowConfig.title}</div><div class="row-list"></div>`;
    contentContainer.appendChild(rowDiv);

    const rowList = rowDiv.querySelector('.row-list');

    const promises = rowConfig.content.map(contentItem => fetchTMDBDetails(contentItem, rowConfig.type));
    const results = await Promise.all(promises);

    results.filter(item => item !== null).forEach(item => {
        rowList.innerHTML += createCard(item);
    });

    setupNavigation();
}

/**
 * Renderiza todo el contenido de la interfaz. (Inalterada)
 */
async function renderContent() {
    const container = document.getElementById('content-container');
    container.innerHTML = ''; 

    for (const rowConfig of streamingIDs) {
        await renderRow(rowConfig);
    }
}


// =======================================================
// === LÓGICA DE NAVEGACIÓN (ANDROID TV D-PAD - INALTERADA)
// =======================================================

let focusableElements = [];
let focusedElementIndex = 0;

function setupNavigation() {
    focusableElements = Array.from(document.querySelectorAll('[data-nav-item="content"], .nav-item'));
    
    if (focusableElements.length > 0) {
        if (focusedElementIndex >= focusableElements.length) {
             focusedElementIndex = focusableElements.length - 1;
        }
        setFocus(focusedElementIndex);
    }
}

function setFocus(newIndex) {
    if (focusableElements[focusedElementIndex]) {
        focusableElements[focusedElementIndex].classList.remove('focused');
    }

    if (newIndex < 0) {
        newIndex = 0;
    } else if (newIndex >= focusableElements.length) {
        newIndex = focusableElements.length - 1;
    }
    focusedElementIndex = newIndex;

    const newFocusElement = focusableElements[focusedElementIndex];
    newFocusElement.classList.add('focused');
    
    newFocusElement.scrollIntoView({
        behavior: 'smooth', 
        block: 'nearest',   
        inline: 'center'    
    });
}

document.addEventListener('keydown', (e) => {
    e.preventDefault(); 
    let newIndex = focusedElementIndex;

    if (e.key === 'ArrowRight') {
        newIndex = focusedElementIndex + 1;
    } else if (e.key === 'ArrowLeft') {
        newIndex = focusedElementIndex - 1;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const jump = 7; 
        
        if (e.key === 'ArrowDown') {
            newIndex += jump; 
        } else if (e.key === 'ArrowUp') {
            newIndex -= jump;
        }
        
    } else if (e.key === 'Enter') {
        const selectedElement = focusableElements[focusedElementIndex];
        const manualUrl = selectedElement.getAttribute('data-media-url');
        const title = selectedElement.title;

        if (manualUrl) {
            console.log(`¡Redirigiendo a!: ${manualUrl}`);
            // Aquí puedes redirigir realmente
            // window.location.href = manualUrl;
            alert(`Abriendo: ${title}\nURL de destino: ${manualUrl}`);
        } else {
            console.log(`Elemento de menú seleccionado.`);
            alert(`Elemento de menú seleccionado.`);
        }
        return;
    }

    setFocus(newIndex);
});

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderContent();
});
