import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import { FocusStyleManager } from '@blueprintjs/core';
import { effect } from '@preact/signals-react';
import { StrictMode } from 'react';
import { startDocumentMeta, trimTrailingSlash } from 'react-cheminfo/core';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import { sanitizeStoredProgress, startRouting, state } from './state/index.ts';
import { routePath } from './state/router.ts';
import { PAGE_ROUTES } from './state/routes.ts';
import { absoluteUrl } from './state/site.ts';

FocusStyleManager.onlyShowFocusOnTabs();

startRouting();
// The server already titled the page it handed out; this is what a move inside
// the app changes. The origin is read off the page so a deployment mounted
// under a path canonicalises to the address it is opened at.
startDocumentMeta({
  site: 'tex',
  routes: PAGE_ROUTES,
  url: () => routePath(state.view.route.value),
  origin: trimTrailingSlash(absoluteUrl('/')),
  follow: effect,
});
sanitizeStoredProgress();

const rootElement = document.querySelector('#root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
