import { useSignals } from '@preact/signals-react/runtime';
import { AboutPage, ShareDialog, SiteTheme } from 'react-cheminfo/ui';

import './App.css';
import './learn.css';
import { ABOUT } from './about.ts';
import { AppShell } from './components/AppShell.tsx';
import { EditorPage } from './editor/EditorPage.tsx';
import { ExercisesPage } from './exercises/ExercisesPage.tsx';
import { closeShare, state } from './state/index.ts';
import { SHARE_VOCABULARY } from './state/shareConfig.ts';
import { TutorialPage } from './tutorial/TutorialPage.tsx';

/** How the page is named in the share dialog, and in the frame it writes. */
const SHARE_TITLE = 'tex.cheminfo.org — LaTeX to SVG';

export default function App() {
  useSignals();
  const { page } = state.view.route.value;

  return (
    <>
      <SiteTheme siteId="tex" />
      <AppShell>
        {page === 'about' && (
          <main className="about-scroll">
            <AboutPage content={ABOUT} />
          </main>
        )}
        {page === 'tutorial' && <TutorialPage />}
        {page === 'exercises' && <ExercisesPage />}
        {page === 'editor' && <EditorPage />}

        <ShareDialog
          isOpen={state.view.sharing.value}
          onClose={closeShare}
          vocabulary={SHARE_VOCABULARY}
          title={SHARE_TITLE}
        />
      </AppShell>
    </>
  );
}
