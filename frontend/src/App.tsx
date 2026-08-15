import { useSignals } from '@preact/signals-react/runtime';

import './App.css';
import './learn.css';
import { AppShell } from './components/AppShell.tsx';
import { ShareDialog } from './components/ShareDialog.tsx';
import { EditorPage } from './editor/EditorPage.tsx';
import { ExercisesPage } from './exercises/ExercisesPage.tsx';
import { closeShare, state } from './state/index.ts';
import type { ShareConfig } from './state/shareConfig.ts';
import { DEFAULT_EMBED_HIDDEN } from './state/shareOptions.ts';
import { TutorialPage } from './tutorial/TutorialPage.tsx';

/**
 * Open the dialog on the link the user would hand out: embedded, with the
 * features a host page has no use for already switched off. When the page is
 * itself running a configuration, start from that instead.
 * @param config - The configuration in force.
 * @returns The configuration the dialog opens on.
 */
function draftFrom(config: ShareConfig): ShareConfig {
  if (config.embed || config.hide.length > 0) return config;
  return { ...config, embed: true, hide: DEFAULT_EMBED_HIDDEN };
}

export default function App() {
  useSignals();
  const { page } = state.view.route.value;
  const config = state.view.config.value;

  return (
    <AppShell>
      {page === 'tutorial' && <TutorialPage />}
      {page === 'exercises' && <ExercisesPage />}
      {page === 'editor' && <EditorPage />}

      {state.view.sharing.value && (
        <ShareDialog
          initialConfig={draftFrom(config)}
          href={window.location.href}
          onClose={closeShare}
        />
      )}
    </AppShell>
  );
}
