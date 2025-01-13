// static/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Elimina el texto "Historial de imágenes subidas" si está presente
    const historialTitle = document.querySelector('#historicoImages h2');
    if (historialTitle) {
        historialTitle.remove();
    }
});

// Función para eliminar una imagen
async function eliminarImagen(imageUrl) {
    // Usamos SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esta acción no se puede deshacer!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Enviar solicitud al backend para eliminar la imagen
                const response = await fetch('/eliminar_imagen', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ imageUrl }),
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la imagen');
                }

                const result = await response.json();

                if (result.success) {
                    Swal.fire('¡Eliminado!', 'La imagen ha sido eliminada.', 'success');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar la imagen.', 'error');
                }
            } catch (error) {
                console.error('Error al eliminar la imagen:', error);
                Swal.fire('Error', 'Ocurrió un error al eliminar la imagen.', 'error');
            }
        }
    });
}

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

// Función para reprocesar una imagen seleccionada del historial
async function reprocesarImagen(imageUrl) {
    try {
        const response = await fetch('/reprocesar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
        });

        if (!response.ok) {
            throw new Error('Error al reprocesar la imagen');
        }

        const result = await response.json();

        if (result.images) {
            document.getElementById('originalImage').src = imageUrl + '?t=' + new Date().getTime(); // Cache busting

            const processedImagesDiv = document.getElementById('processedImages');
            processedImagesDiv.innerHTML = ''; // Limpiar imágenes procesadas

            result.images.forEach(img => {
                const imgElement = document.createElement('img');
                imgElement.src = img + '?t=' + new Date().getTime(); // Cache busting
                imgElement.style.maxWidth = '100%';
                processedImagesDiv.appendChild(imgElement);
            });
        }
    } catch (error) {
        console.error('Error al reprocesar la imagen:', error);
    }
}

// Delegar el evento de clic a un contenedor principal (historicoImages)
document.getElementById('historicoImages').addEventListener('click', (event) => {
    const imgElement = event.target;

    // Asegúrate de que el clic haya sido en una imagen
    if (imgElement.tagName === 'IMG' && imgElement.dataset.imageUrl) {
        reprocesarImagen(imgElement.dataset.imageUrl);
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

// Evitar que el usuario haga scroll mientras se procesa la imagen
window.addEventListener('wheel', (e) => {
    if (isProcessing) {
        e.preventDefault(); // Bloquea el desplazamiento
    }
});

// Llama a esta función cuando proceses la imagen
processImage();
