import { useSignals } from '@preact/signals-react/runtime';
import type { ReactNode } from 'react';

import { state } from '../state/index.ts';
import type { FeatureKey } from '../state/shareConfig.ts';

import { SidePanel } from './SidePanel.tsx';

interface PageLayoutProps {
  /** What a click on a reference entry does with the snippet it carries. */
  onSelect: (tex: string) => void;
  /**
   * The reference tabs this page offers, in order.
   * @default every tab
   */
  tabs?: readonly FeatureKey[];
  children: ReactNode;
}

/**
 * The two-column page: the working column, and the reference beside it.
 * @param props - The layout props.
 * @returns The page body.
 */
export function PageLayout({ onSelect, tabs, children }: PageLayoutProps) {
  useSignals();

  return (
    <div className="layout">
      <main className="panel panel-middle">{children}</main>
      <SidePanel
        config={state.view.config.value}
        onSelect={onSelect}
        tabs={tabs}
      />
    </div>
  );
}
