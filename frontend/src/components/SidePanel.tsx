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
}

/**
 * The right-hand panel, holding whichever reference tabs the link left visible.
 * @param props - The panel props.
 * @returns The panel, or null when every tab is hidden.
 */
export function SidePanel({ config, onSelect }: SidePanelProps) {
  const visible = TABS.filter((tab) => !isHidden(config, tab.key));
  const [active, setActive] = useState<FeatureKey | undefined>(visible[0]?.key);

  if (visible.length === 0) return null;

  const current = visible.some((tab) => tab.key === active)
    ? active
    : visible[0]?.key;

  return (
    <aside className="panel panel-right">
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
      </div>

      <div className="tab-content">
        {current === 'examples' && <ExamplesPanel onSelect={onSelect} />}
        {current === 'reference' && <LatexDocs onSelect={onSelect} />}
        {current === 'commands' && <LatexCommands onSelect={onSelect} />}
        {current === 'help' && <HelpPanel />}
      </div>
    </aside>
  );
}
