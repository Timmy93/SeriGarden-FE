import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

export const be_url = createUrl()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function createUrl() {
    let port = import.meta.env.VITE_BE_PORT;
    let domain = import.meta.env.VITE_BE_SERVER;
    if (port === '443') {
        return 'https://' + domain;
    } else {
        return 'http://' + domain + ':' + port
    }
}