import { useSignals } from '@preact/signals-react/runtime';

import { ServerRenderPanel } from '../ServerRenderPanel.tsx';
import { EmbedCode } from '../components/EmbedCode.tsx';
import { PageLayout } from '../components/PageLayout.tsx';
import { MathJaxRenderer } from '../shared/MathJaxRenderer.tsx';
import { setZoom, state, writeTex } from '../state/index.ts';
import { MAX_ZOOM, MIN_ZOOM, isHidden } from '../state/shareConfig.ts';

import { LatexEditor } from './LatexEditor.tsx';

const ZOOM_LEVELS = Array.from(
  { length: MAX_ZOOM - MIN_ZOOM + 1 },
  (_, index) => MIN_ZOOM + index,
);

/**
 * The editor page: a formula, its live render, and the ways to take it away.
 * @returns The page.
 */
export function EditorPage() {
  useSignals();
  const tex = state.view.editor.tex.value;
  const zoom = state.preferences.zoom.value;
  const config = state.view.config.value;

  return (
    <PageLayout onSelect={writeTex}>
      <div className="section section-editor">
        <div className="section-head">
          <span className="section-label">LaTeX formula</span>
          <span className="section-note">
            edit directly, or paste a <code className="inline-code">?tex=</code>{' '}
            URL
          </span>
        </div>
        <div className="section-body">
          <LatexEditor value={tex} onChange={writeTex} onPasteUrl={writeTex} />
        </div>
      </div>

      <div className="section section-preview">
        <div className="section-head">
          <span className="section-label">Live preview</span>
          <div className="zoom-btns">
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={`zoom-btn ${zoom === level ? 'active' : ''}`}
                onClick={() => setZoom(level)}
              >
                {level}×
              </button>
            ))}
          </div>
        </div>
        <div className="section-body">
          <div className="live-preview" style={{ fontSize: `${zoom}em` }}>
            {tex ? (
              <MathJaxRenderer tex={tex} displayMode />
            ) : (
              <span className="placeholder" style={{ fontSize: '0.5em' }}>
                Live preview will appear here
              </span>
            )}
          </div>
        </div>
      </div>

      {!isHidden(config, 'embedCode') && <EmbedCode tex={tex} />}

      {!isHidden(config, 'serverRender') && (
        <ServerRenderPanel tex={tex} zoom={zoom} />
      )}
    </PageLayout>
  );
}
