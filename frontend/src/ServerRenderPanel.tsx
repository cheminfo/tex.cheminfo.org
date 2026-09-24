import { writeBlobToClipboard } from 'react-cheminfo/core';
import {
  ClickToCopy,
  useCopyToClipboard,
  useDebouncedValue,
} from 'react-cheminfo/ui';

import { buildRenderImageTag, buildRenderUrl } from './shared/renderUrl.ts';

interface Props {
  tex: string;
  zoom: number;
}

// Long enough that a formula is rendered once a phrase is finished, rather
// than once per keystroke.
const SETTLE_MS = 800;

interface RenderFormat {
  key: string;
  title: string;
  label: string;
  type: string;
  /** Absent for the vector render. */
  dpi?: 150 | 300;
}

const FORMATS: readonly RenderFormat[] = [
  {
    key: 'svg',
    title: 'Copy SVG to clipboard',
    label: 'Copy SVG',
    type: 'image/svg+xml',
  },
  {
    key: 'png150',
    title: 'Copy PNG at 150 dpi',
    label: 'Copy PNG 150dpi',
    type: 'image/png',
    dpi: 150,
  },
  {
    key: 'png300',
    title: 'Copy PNG at 300 dpi',
    label: 'Copy PNG 300dpi',
    type: 'image/png',
    dpi: 300,
  },
];

export function ServerRenderPanel({ tex, zoom }: Props) {
  const { copied, failed, key: outcomeKey, copy } = useCopyToClipboard();

  const settledTex = useDebouncedValue(tex, SETTLE_MS);

  const serverImgSrc = settledTex
    ? `/v1/?tex=${encodeURIComponent(settledTex)}`
    : '';

  function copyRender(format: RenderFormat): void {
    if (!tex) return;
    // The blob goes in as a promise so the clipboard write stays inside the
    // click: Safari refuses one that starts after an await.
    void copy(
      () =>
        writeBlobToClipboard(fetchRender(tex, format.dpi), {
          type: format.type,
        }),
      format.key,
    );
  }

  return (
    <div className="section section-server-preview">
      <div className="section-head">
        <span className="section-label">Server render</span>
        <div className="icon-btns">
          {FORMATS.map((format) => {
            const isCopied = copied && outcomeKey === format.key;
            const isFailed = failed && outcomeKey === format.key;
            return (
              <button
                key={format.key}
                type="button"
                className={`icon-btn ${isCopied ? 'copied' : ''} ${
                  isFailed ? 'failed' : ''
                }`}
                title={format.title}
                onClick={() => copyRender(format)}
                disabled={!tex}
              >
                {isCopied
                  ? '✓ Copied'
                  : isFailed
                    ? 'Copy failed'
                    : format.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="section-body">
        <ClickToCopy
          as="div"
          className="server-preview"
          label="image link"
          value={() => ({
            text: buildRenderUrl(settledTex),
            html: buildRenderImageTag(settledTex),
          })}
          disabled={!serverImgSrc}
        >
          {serverImgSrc ? (
            <img src={serverImgSrc} alt="Server render" style={{ zoom }} />
          ) : (
            <span className="placeholder">Server preview will appear here</span>
          )}
        </ClickToCopy>
      </div>
    </div>
  );
}

async function fetchRender(tex: string, dpi?: 150 | 300): Promise<Blob> {
  const query = dpi === undefined ? '' : `&format=png&resolution=${dpi}`;
  const response = await fetch(`/v1/?tex=${encodeURIComponent(tex)}${query}`);
  if (!response.ok) throw new Error(`render failed: ${response.status}`);
  return response.blob();
}
