import { useMemo, useState } from 'react';

import './ShareDialog.css';
import type { FeatureKey, ShareConfig } from '../state/shareConfig.ts';
import {
  HIDEABLE_FEATURES,
  applyShareConfig,
  serializeShareUrl,
} from '../state/shareConfig.ts';
import { SHARE_FEATURES } from '../state/shareOptions.ts';

interface ShareDialogProps {
  /** The configuration the dialog opens on. */
  initialConfig: ShareConfig;
  /** The address the tool inputs are read from. */
  href: string;
  onClose: () => void;
}

/**
 * The share dialog: a link and a ready-to-paste iframe snippet, built from the
 * current address plus the configuration drafted here.
 * @param props - The dialog props.
 * @returns The dialog.
 */
export function ShareDialog({
  initialConfig,
  href,
  onClose,
}: ShareDialogProps) {
  const [draft, setDraft] = useState<ShareConfig>(initialConfig);

  const url = useMemo(
    () => serializeShareUrl(applyShareConfig(new URL(href), draft)),
    [href, draft],
  );

  const iframe = `<iframe
  src="${url}"
  width="100%"
  height="700"
  style="border: 1px solid #ddd; border-radius: 8px"
  title="tex.cheminfo.org — LaTeX to SVG"
></iframe>`;

  function toggleFeature(key: FeatureKey, visible: boolean) {
    setDraft((current) => ({
      ...current,
      hide: HIDEABLE_FEATURES.filter((feature) =>
        feature === key ? !visible : current.hide.includes(feature),
      ),
    }));
  }

  return (
    <dialog
      ref={openModal}
      className="share-backdrop"
      aria-label="Share this page"
      data-testid="share-dialog"
      onClose={onClose}
    >
      <div className="share-dialog">
        <h2 className="share-dialog__title">
          Share this page
          <button type="button" className="share-btn" onClick={onClose}>
            Close
          </button>
        </h2>
        <p className="share-dialog__lead">
          The link carries the formula you are looking at, so whoever opens it
          sees exactly this page.
        </p>

        <section className="share-section">
          <h3 className="share-section__title">Layout</h3>
          <label className="share-option">
            <input
              type="checkbox"
              checked={draft.embed}
              onChange={(event) =>
                setDraft({ ...draft, embed: event.target.checked })
              }
            />
            <span className="share-option__label">
              Embed in another page
              <span className="share-option__description">
                {' '}
                Drops the header, so the page fits inside your own site.
              </span>
            </span>
          </label>
        </section>

        <section className="share-section">
          <h3 className="share-section__title">Show on the page</h3>
          {SHARE_FEATURES.map((feature) => (
            <label className="share-option" key={feature.key}>
              <input
                type="checkbox"
                checked={!draft.hide.includes(feature.key)}
                onChange={(event) =>
                  toggleFeature(feature.key, event.target.checked)
                }
              />
              <span className="share-option__label">
                {feature.label}
                <span className="share-option__description">
                  {' '}
                  {feature.description}
                </span>
              </span>
            </label>
          ))}
        </section>

        <section className="share-section">
          <h3 className="share-section__title">Link</h3>
          <code className="share-code">{url}</code>
          <div className="share-actions">
            <CopyButton value={url} label="Copy link" primary />
            <a
              className="share-btn"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              Open in a new tab
            </a>
          </div>
        </section>

        <section className="share-section">
          <h3 className="share-section__title">Iframe</h3>
          <textarea
            className="share-code"
            aria-label="Iframe snippet"
            readOnly
            rows={7}
            value={iframe}
          />
          <div className="share-actions">
            <CopyButton value={iframe} label="Copy iframe" />
          </div>
        </section>
      </div>
    </dialog>
  );
}

/**
 * Open the native dialog modally as soon as it is mounted, so the browser
 * supplies the backdrop, the focus trap and the Escape key.
 * @param element - The dialog element, or null when unmounting.
 */
function openModal(element: HTMLDialogElement | null): void {
  if (element && !element.open) element.showModal();
}

function CopyButton({
  value,
  label,
  primary = false,
}: {
  value: string;
  label: string;
  primary?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={primary ? 'share-btn share-btn--primary' : 'share-btn'}
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
      {copied ? 'Copied' : label}
    </button>
  );
}
