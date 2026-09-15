import { CopyButton } from 'react-cheminfo/ui';

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
  return (
    <div className="code-row">
      <span className="code-format-label">{label}</span>
      <textarea
        className="code-output"
        aria-label={`${label} embed code`}
        readOnly
        value={value}
      />
      <CopyButton content={value} title={title} disabled={value === ''} />
    </div>
  );
}
