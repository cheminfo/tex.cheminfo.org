import { useSignals } from '@preact/signals-react/runtime';
import type { ReactNode } from 'react';
import {
  CiteButton,
  EcosystemButton,
  NavLink,
  ShareButton,
  SiteFooter,
  SiteHeader,
} from 'react-cheminfo/ui';

import { ABOUT } from '../about.ts';
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
      <div className="app-screen">
        <SiteHeader
          siteId="tex"
          width="full"
          homeHref={withBase('/')}
          onHome={() => navigate({ page: 'editor' })}
          activeId={page}
          nav={NAV}
          actions={
            <>
              <NavLink
                item={{
                  id: 'about',
                  label: 'About',
                  icon: 'info-sign',
                  href: withBase('/about'),
                  title: 'What this tool renders with, and what it borrows',
                  onSelect: () => navigate({ page: 'about' }),
                }}
                active={page === 'about'}
              />
              {ABOUT.cite ? <CiteButton works={ABOUT.cite} /> : null}
              <NavLink
                item={{
                  id: 'api',
                  label: 'API',
                  icon: 'code',
                  href: withBase('/docs'),
                  external: true,
                  title: 'OpenAPI documentation for the rendering API',
                }}
              />
              <EcosystemButton currentSiteId="tex" />
              <ShareButton onClick={openShare} />
            </>
          }
        />
        <div className="app-main">{children}</div>
      </div>
      <SiteFooter siteId="tex" width="full" />
    </>
  );
}
