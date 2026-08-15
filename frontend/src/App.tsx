import { useEffect, useState } from 'react';

import './App.css';
import { ServerRenderPanel } from './ServerRenderPanel.tsx';
import { AppShell } from './components/AppShell.tsx';
import { EmbedCode } from './components/EmbedCode.tsx';
import { ShareDialog } from './components/ShareDialog.tsx';
import { SidePanel } from './components/SidePanel.tsx';
import { LatexEditor } from './editor/LatexEditor.tsx';
import { MathJaxRenderer } from './shared/MathJaxRenderer.tsx';
import type { ShareConfig } from './state/shareConfig.ts';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  isHidden,
  parseShareConfig,
} from './state/shareConfig.ts';
import { DEFAULT_EMBED_HIDDEN } from './state/shareOptions.ts';

const ZOOM_LEVELS = Array.from(
  { length: MAX_ZOOM - MIN_ZOOM + 1 },
  (_, index) => MIN_ZOOM + index,
);

function getTexFromUrl(): string {
  return new URLSearchParams(window.location.search).get('tex') ?? '';
}

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
  const [config] = useState(() => parseShareConfig(window.location.search));
  const [tex, setTex] = useState<string>(getTexFromUrl);
  const [zoom, setZoom] = useState<number>(config.zoom);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (tex) {
      url.searchParams.set('tex', tex);
    } else {
      url.searchParams.delete('tex');
    }
    window.history.replaceState(null, '', url.toString());
  }, [tex]);

  return (
    <AppShell embed={config.embed} onShare={() => setSharing(true)}>
      <div className="layout">
        <main className="panel panel-middle">
          <div className="section section-editor">
            <span className="section-label">
              LaTeX formula — edit directly or paste a{' '}
              <code className="inline-code">?tex=</code> URL
            </span>
            <LatexEditor value={tex} onChange={setTex} onPasteUrl={setTex} />
          </div>

          <div className="section section-preview">
            <div className="section-label-row">
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

          {!isHidden(config, 'embedCode') && <EmbedCode tex={tex} />}

          {!isHidden(config, 'serverRender') && (
            <ServerRenderPanel tex={tex} zoom={zoom} />
          )}
        </main>

        <SidePanel config={config} onSelect={setTex} />
      </div>

      {sharing && (
        <ShareDialog
          initialConfig={draftFrom(config)}
          href={window.location.href}
          onClose={() => setSharing(false)}
        />
      )}
    </AppShell>
  );
}
