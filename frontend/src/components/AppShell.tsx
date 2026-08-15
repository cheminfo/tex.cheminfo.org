import type { ReactNode } from 'react';

import './AppShell.css';
import { BrandMark, Wordmark } from './Brand.tsx';

interface AppShellProps {
  /** Whether the page is framed, in which case it renders no header at all. */
  embed: boolean;
  /** Opens the share dialog. */
  onShare: () => void;
  children: ReactNode;
}

/**
 * The site chrome: the brand at the left, the menu pushed right.
 * An embedded page renders the content alone — what a host page frames
 * already carries its own navigation.
 * @param props - The shell props.
 * @returns The page, with or without its header.
 */
export function AppShell({ embed, onShare, children }: AppShellProps) {
  if (embed) return children;

  return (
    <>
      <header className="app-header no-print">
        <div className="app-header__inner">
          <a href="/" className="brand" title="tex.cheminfo.org">
            <BrandMark />
            <Wordmark />
          </a>
          <span className="spacer" />
          <a
            className="nav-link"
            href="/docs"
            target="_blank"
            rel="noreferrer"
            title="OpenAPI documentation for the rendering API"
          >
            API
          </a>
          <button
            type="button"
            className="nav-link"
            onClick={onShare}
            title="Share a link to this page, or embed it in your own site"
          >
            <ShareIcon />
            Share
          </button>
        </div>
      </header>
      {children}
    </>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
