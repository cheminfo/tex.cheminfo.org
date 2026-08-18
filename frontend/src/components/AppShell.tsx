import { useSignals } from '@preact/signals-react/runtime';
import type { ReactNode } from 'react';
import { EcosystemButton, SiteFooter, SiteHeader } from 'react-cheminfo/ui';

import { navigate, openShare, state } from '../state/index.ts';
import { withBase } from '../state/site.ts';

const NAV = [
  {
    id: 'editor',
    label: 'Editor',
    href: withBase('/'),
    title: 'Write a formula and take away its image',
    onSelect: () => navigate({ page: 'editor' }),
  },
  {
    id: 'tutorial',
    label: 'Tutorial',
    href: withBase('/tutorial'),
    title: 'A guided tour of the notation, one editable step at a time',
    onSelect: () => navigate({ page: 'tutorial' }),
  },
  {
    id: 'exercises',
    label: 'Exercises',
    href: withBase('/exercises'),
    title: 'Learn the notation by writing it',
    onSelect: () => navigate({ page: 'exercises' }),
  },
] as const;

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
      <SiteHeader
        siteId="tex"
        homeHref={withBase('/')}
        onHome={() => navigate({ page: 'editor' })}
        activeId={page}
        nav={NAV}
        actions={
          <>
            <a
              className="nav-link"
              href={withBase('/docs')}
              target="_blank"
              rel="noreferrer"
              title="OpenAPI documentation for the rendering API"
            >
              API
            </a>
            <EcosystemButton currentSiteId="tex" />
            <button
              type="button"
              className="nav-link"
              onClick={openShare}
              title="Share a link to this page, or embed it in your own site"
            >
              <ShareIcon />
              Share
            </button>
          </>
        }
      />
      <div className="app-main">{children}</div>
      <SiteFooter siteId="tex" />
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
