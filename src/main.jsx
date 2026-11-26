import React from 'react';
import ReactDOM from 'react-dom/client';
import '@dotlottie/player-component';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './styles/global.css';
import App from './App.jsx';
import { loadConfig } from './services/portalApi.js';

// public/config.json names the API address; read it before the first request.
loadConfig().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
