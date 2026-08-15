import { autocompletion } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';

import { latexCompletionSource, latexLanguage } from './latex-completions.ts';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onPasteUrl: (tex: string) => void;
}

const theme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily: "'Fira Mono', 'Cascadia Code', 'Consolas', monospace",
    border: '1px solid var(--border-strong)',
    borderRadius: '8px',
    background: 'var(--surface)',
    color: 'var(--text)',
    minHeight: '86px',
  },
  '&.cm-focused': {
    outline: 'none',
    borderColor: 'var(--accent)',
    boxShadow: '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)',
  },
  '.cm-scroller': { minHeight: '86px' },
  '.cm-content': { padding: '11px' },
  '.cm-line': { lineHeight: '1.65' },
  '.cm-gutters': {
    border: 'none',
    background: 'var(--surface-sunken)',
    color: 'var(--text-muted)',
  },
  '.cm-activeLine': {
    background: 'color-mix(in oklab, var(--accent) 5%, white)',
  },
  '.cm-activeLineGutter': {
    background: 'color-mix(in oklab, var(--accent) 8%, white)',
    color: 'var(--text)',
  },
  '.cm-tooltip.cm-tooltip-autocomplete': { fontFamily: 'inherit' },
});

const latexCompletion = latexLanguage.data.of({
  autocomplete: latexCompletionSource,
});

export function LatexEditor({ value, onChange, onPasteUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const pasteExtension = EditorView.domEventHandlers({
      paste(event) {
        const pasted = event.clipboardData?.getData('text');
        if (!pasted) return false;
        try {
          const parsed = new URL(pasted);
          const texParam = parsed.searchParams.get('tex');
          if (texParam) {
            event.preventDefault();
            onPasteUrl(texParam);
            return true;
          }
        } catch {
          // not a URL — let default paste proceed
        }
        return false;
      },
    });

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          latexLanguage,
          latexCompletion,
          autocompletion({ activateOnTyping: true }),
          EditorView.lineWrapping,
          theme,
          pasteExtension,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          }),
        ],
      }),
      parent: containerRef.current,
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. clicking an example)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} className="latex-editor" />;
}
