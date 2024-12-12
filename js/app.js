if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('Service Worker registrado correctamente.'))
      .catch((error) => console.error('Error al registrar el Service Worker:', error));
  }
  