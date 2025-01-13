// static/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Elimina el texto "Historial de imágenes subidas" si está presente
    const historialTitle = document.querySelector('#historicoImages h2');
    if (historialTitle) {
        historialTitle.remove();
    }
});

// Lógica para subir la nueva imagen
const form = document.getElementById('uploadForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al subir la imagen');
        }

        const result = await response.json();

        if (result.images) {
            document.getElementById('originalImage').src = result.images[0] + '?t=' + new Date().getTime(); // Cache busting

            const processedImagesDiv = document.getElementById('processedImages');
            processedImagesDiv.innerHTML = ''; // Limpiar imágenes procesadas

            result.images.slice(1).forEach(img => {
                const imgElement = document.createElement('img');
                imgElement.src = img + '?t=' + new Date().getTime(); // Cache busting
                imgElement.style.maxWidth = '100%';
                processedImagesDiv.appendChild(imgElement);
            });
        }
    } catch (error) {
        console.error('Error al subir la imagen:', error);
    }
});

let isProcessing = false;

function processImage() {
    // Prevenir el scroll mientras procesamos la imagen
    isProcessing = true;
    document.body.style.overflow = 'hidden';  // Esto bloquea el scroll

    // Aquí va tu código de procesamiento de imagen
    setTimeout(() => {
        // Simulación de procesamiento de imagen
        console.log('Imagen procesada');
        
        // Después de procesar la imagen, puedes permitir el scroll nuevamente
        isProcessing = false;
        document.body.style.overflow = '';  // Esto habilita el scroll
    }, 3000);  // Simulando que el procesamiento toma 3 segundos
}

// Llama a esta función cuando proceses la imagen
processImage();