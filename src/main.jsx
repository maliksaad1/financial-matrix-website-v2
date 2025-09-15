import { createRoot } from 'react-dom/client';
import './App.css'; // Import App.css instead of index.css
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <App />
);
