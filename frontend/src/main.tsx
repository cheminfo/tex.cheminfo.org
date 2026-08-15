import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import { sanitizeStoredProgress, startRouting } from './state/index.ts';

startRouting();
sanitizeStoredProgress();

const rootElement = document.querySelector('#root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
