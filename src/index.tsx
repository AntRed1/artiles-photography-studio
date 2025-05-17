/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initGA } from './utils/analytics';

const trackingId = 'G-XXXXXXXXXX'; // Reemplaza con tu ID de Google Analytics
initGA(trackingId);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        // eslint-disable-next-line no-console
        console.log('Service Worker registrado:', registration);
      })
      .catch(error => {
        console.error('Error al registrar Service Worker:', error);
      });
  });
}
