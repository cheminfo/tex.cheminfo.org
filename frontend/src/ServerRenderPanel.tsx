import { useCallback, useEffect, useState } from 'react';

interface Props {
  tex: string;
  zoom: number;
}

function flashCopied(setFlag: (value: boolean) => void): void {
  setFlag(true);
  setTimeout(() => setFlag(false), 1500);
}

export function ServerRenderPanel({ tex, zoom }: Props) {
  const [serverPreviewKey, setServerPreviewKey] = useState(0);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [copiedPng150, setCopiedPng150] = useState(false);
  const [copiedPng300, setCopiedPng300] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setServerPreviewKey((k) => k + 1), 800);
    return () => clearTimeout(timer);
  }, [tex]);

  const serverImgSrc = tex
    ? `/v1/?tex=${encodeURIComponent(tex)}&ts=${serverPreviewKey}`
    : '';

  const copyServerSvg = useCallback(() => {
    if (!tex) return;
    void fetch(`/v1/?tex=${encodeURIComponent(tex)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`render failed: ${response.status}`);
        return response.blob();
      })
      .then((blob) =>
        navigator.clipboard.write([
          new ClipboardItem({ 'image/svg+xml': blob }),
        ]),
      )
      .then(() => flashCopied(setCopiedSvg))
      .catch(() => setCopiedSvg(false));
  }, [tex]);

  const copyServerPng = useCallback(
    (dpi: 150 | 300, setFlag: (value: boolean) => void) => {
      if (!tex) return;
      void fetch(
        `/v1/?tex=${encodeURIComponent(tex)}&format=png&resolution=${dpi}`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`render failed: ${response.status}`);
          }
          return response.blob();
        })
        .then((blob) =>
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]),
        )
        .then(() => flashCopied(setFlag))
        .catch(() => setFlag(false));
    },
    [tex],
  );

  return (
    <div className="section section-server-preview">
      <div className="section-label-row">
        <span className="section-label">Server render</span>
        <div className="icon-btns">
          <button
            type="button"
            className={`icon-btn ${copiedSvg ? 'copied' : ''}`}
            title="Copy SVG to clipboard"
            onClick={copyServerSvg}
            disabled={!tex}
          >
            {copiedSvg ? '✓ Copied' : 'Copy SVG'}
          </button>
          <button
            type="button"
            className={`icon-btn ${copiedPng150 ? 'copied' : ''}`}
            title="Copy PNG at 150 dpi"
            onClick={() => copyServerPng(150, setCopiedPng150)}
            disabled={!tex}
          >
            {copiedPng150 ? '✓ Copied' : 'Copy PNG 150dpi'}
          </button>
          <button
            type="button"
            className={`icon-btn ${copiedPng300 ? 'copied' : ''}`}
            title="Copy PNG at 300 dpi"
            onClick={() => copyServerPng(300, setCopiedPng300)}
            disabled={!tex}
          >
            {copiedPng300 ? '✓ Copied' : 'Copy PNG 300dpi'}
          </button>
        </div>
      </div>
      <div className="server-preview">
        {serverImgSrc ? (
          <img src={serverImgSrc} alt="Server render" style={{ zoom }} />
        ) : (
          <span className="placeholder">Server preview will appear here</span>
        )}
      </div>
    </div>
  );
}
