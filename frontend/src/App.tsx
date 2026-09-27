import { useSignals } from '@preact/signals-react/runtime';
import {
  AboutPage,
  GlossaryProvider,
  ShareDialog,
  SiteTheme,
} from 'react-cheminfo/ui';

import './App.css';
import './learn.css';
import { ABOUT } from './about.ts';
import { AppShell } from './components/AppShell.tsx';
import { EditorPage } from './editor/EditorPage.tsx';
import { ExercisesPage } from './exercises/ExercisesPage.tsx';
import { closeShare, state } from './state/index.ts';
import { SHARE_VOCABULARY } from './state/shareConfig.ts';
import { GlossaryExample } from './tutorial/GlossaryExample.tsx';
import { TutorialPage } from './tutorial/TutorialPage.tsx';
import { GLOSSARY } from './tutorial/glossary.ts';

/** How the page is named in the share dialog, and in the frame it writes. */
const SHARE_TITLE = 'tex.cheminfo.org — LaTeX to SVG';

export default function App() {
  useSignals();
  const { page } = state.view.route.value;

  return (
    <GlossaryProvider
      glossary={GLOSSARY}
      renderExample={(example) => <GlossaryExample example={example} />}
      renderCode={(code) => <code className="inline-code">{code}</code>}
    >
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
    </GlossaryProvider>
  );
}
