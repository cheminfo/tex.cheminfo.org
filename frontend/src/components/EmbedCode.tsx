import { useState } from 'react';

import { buildRenderUrl } from '../shared/renderUrl.ts';

const FORMATS = [
  {
    key: 'html',
    label: 'HTML',
    title: 'Copy HTML to clipboard',
    build: (tex: string) => `<img src="${buildRenderUrl(tex)}"/>`,
  },
  {
    key: 'md',
    label: 'MD',
    title: 'Copy Markdown to clipboard',
    build: (tex: string) => `![formula](${buildRenderUrl(tex)})`,
  },
] as const;

/**
 * The snippets that embed the rendered formula in someone else's document.
 * @param props.tex - The LaTeX formula, empty when the editor is empty.
 * @returns The embed-code section.
 */
export function EmbedCode({ tex }: { tex: string }) {
  return (
    <div className="section section-code">
      <div className="section-head">
        <span className="section-label">Embed code</span>
      </div>
      <div className="section-body">
        {FORMATS.map((format) => (
          <EmbedCodeRow
            key={format.key}
            label={format.label}
            title={format.title}
            value={tex ? format.build(tex) : ''}
          />
        ))}
      </div>
    </div>
  );
}

function EmbedCodeRow({
  label,
  title,
  value,
}: {
  label: string;
  title: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="code-row">
      <span className="code-format-label">{label}</span>
      <textarea
        className="code-output"
        aria-label={`${label} embed code`}
        readOnly
        value={value}
      />
      <button
        type="button"
        className={`copy-btn ${copied ? 'copied' : ''}`}
        title={title}
        onClick={() => {
          void navigator.clipboard
            .writeText(value)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
            .catch(() => setCopied(false));
        }}
      >
        {copied ? '✓' : <CopyIcon />}
      </button>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="2" width="10" height="13" rx="2" />
      <path d="M5 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
    </svg>
  );
}
