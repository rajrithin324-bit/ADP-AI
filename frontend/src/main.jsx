import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Updated this path to match your exact directory structure layout
import './styles/global.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
