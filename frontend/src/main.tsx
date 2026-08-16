import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import { FocusStyleManager } from '@blueprintjs/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import {
  sanitizeStoredProgress,
  startDocumentMeta,
  startRouting,
} from './state/index.ts';

FocusStyleManager.onlyShowFocusOnTabs();

startRouting();
startDocumentMeta();
sanitizeStoredProgress();

const rootElement = document.querySelector('#root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
