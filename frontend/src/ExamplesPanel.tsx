import { DEFAULT_EXAMPLES } from './examples.ts';
import { MathJaxRenderer } from './shared/MathJaxRenderer.tsx';

interface Props {
  onSelect: (tex: string) => void;
}

export function ExamplesPanel({ onSelect }: Props) {
  return (
    <div className="examples-panel">
      <p className="docs-hint">Click any formula to load it in the editor.</p>
      <table className="examples-table">
        <tbody>
          {DEFAULT_EXAMPLES.map((formula) => (
            <tr key={formula}>
              <td className="formula-cell">
                <button
                  type="button"
                  className="example-btn"
                  title={formula}
                  onClick={() => onSelect(formula)}
                >
                  <MathJaxRenderer tex={formula} displayMode={false} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
