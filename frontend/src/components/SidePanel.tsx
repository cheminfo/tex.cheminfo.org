import { useState } from 'react';

import { ExamplesPanel } from '../ExamplesPanel.tsx';
import { HelpPanel } from '../HelpPanel.tsx';
import { LatexCommands } from '../reference/LatexCommands.tsx';
import { LatexDocs } from '../reference/LatexDocs.tsx';
import type { FeatureKey, ShareConfig } from '../state/shareConfig.ts';
import { isHidden } from '../state/shareConfig.ts';

const TABS: ReadonlyArray<{ key: FeatureKey; label: string }> = [
  { key: 'examples', label: 'Examples' },
  { key: 'reference', label: 'Reference' },
  { key: 'commands', label: 'Commands' },
  { key: 'help', label: 'Help' },
];

interface SidePanelProps {
  config: ShareConfig;
  onSelect: (tex: string) => void;
  /**
   * The tabs the open page offers; the exercises keep only what helps solve
   * them.
   * @default every tab
   */
  tabs?: readonly FeatureKey[];
}

/**
 * The right-hand panel, holding whichever reference tabs the link left visible.
 * @param props - The panel props.
 * @returns The panel, or null when every tab is hidden.
 */
export function SidePanel({ config, onSelect, tabs }: SidePanelProps) {
  const offered = tabs ? TABS.filter((tab) => tabs.includes(tab.key)) : TABS;
  const visible = offered.filter((tab) => !isHidden(config, tab.key));
  const [active, setActive] = useState<FeatureKey | undefined>(visible[0]?.key);
  const [open, setOpen] = useState(false);

  if (visible.length === 0) return null;

  /** On a narrow screen the panel is a drawer, so picking closes it. */
  function select(tex: string): void {
    onSelect(tex);
    setOpen(false);
  }

  const current = visible.some((tab) => tab.key === active)
    ? active
    : visible[0]?.key;

  return (
    <>
      {open && (
        <button
          type="button"
          className="panel-backdrop no-print"
          aria-label="Close the reference"
          onClick={() => setOpen(false)}
        />
      )}

      <button
        type="button"
        className="panel-toggle no-print"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <BookIcon />
        Reference
      </button>

      <aside className={`panel panel-right ${open ? 'panel-right--open' : ''}`}>
        <div className="tab-bar">
          {visible.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab-btn ${current === tab.key ? 'active' : ''}`}
              onClick={() => setActive(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            className="panel-close no-print"
            aria-label="Close the reference"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="tab-content">
          {current === 'examples' && <ExamplesPanel onSelect={select} />}
          {current === 'reference' && <LatexDocs onSelect={select} />}
          {current === 'commands' && <LatexCommands onSelect={select} />}
          {current === 'help' && <HelpPanel />}
        </div>
      </aside>
    </>
  );
}

function BookIcon() {
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
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z" />
      <path d="M4 19.5h16" />
    </svg>
  );
}
