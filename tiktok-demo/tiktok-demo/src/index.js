import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure it's the correct path
import './index.css'; // If you have a CSS file

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
