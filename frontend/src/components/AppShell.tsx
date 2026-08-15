import { useSignals } from '@preact/signals-react/runtime';
import type { MouseEvent, ReactNode } from 'react';

import { navigate, openShare, state } from '../state/index.ts';
import type { Page } from '../state/router.ts';

import './AppShell.css';
import { BrandMark, Wordmark } from './Brand.tsx';

/**
 * The site chrome: the brand at the left, the menu pushed right.
 * An embedded page renders the content alone — what a host page frames
 * already carries its own navigation.
 * @param props.children - The page under the header.
 * @returns The page, with or without its header.
 */
export function AppShell({ children }: { children: ReactNode }) {
  useSignals();
  const { page } = state.view.route.value;

  if (state.view.config.value.embed) return children;

  return (
    <>
      <header className="app-header no-print">
        <div className="app-header__inner">
          <a
            href="/"
            className="brand"
            title="tex.cheminfo.org"
            onClick={(event) => go(event, 'editor')}
          >
            <BrandMark />
            <Wordmark />
          </a>
          <span className="spacer" />
          <a
            className={`nav-link ${page === 'editor' ? 'nav-link--active' : ''}`}
            href="/"
            onClick={(event) => go(event, 'editor')}
            title="Write a formula and take away its image"
          >
            Editor
          </a>
          <a
            className={`nav-link ${
              page === 'tutorial' ? 'nav-link--active' : ''
            }`}
            href="/tutorial"
            onClick={(event) => go(event, 'tutorial')}
            title="A guided tour of the notation, one editable step at a time"
          >
            Tutorial
          </a>
          <a
            className={`nav-link ${
              page === 'exercises' ? 'nav-link--active' : ''
            }`}
            href="/exercises"
            onClick={(event) => go(event, 'exercises')}
            title="Learn the notation by writing it"
          >
            Exercises
          </a>
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
            onClick={openShare}
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

function go(event: MouseEvent<HTMLAnchorElement>, next: Page): void {
  event.preventDefault();
  navigate({ page: next });
}
