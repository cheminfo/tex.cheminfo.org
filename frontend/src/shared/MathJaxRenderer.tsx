import { useMemo } from 'react';

import { renderToSvg } from './mathjax.ts';

interface MathJaxRendererProps {
  tex: string;
  displayMode?: boolean;
  className?: string;
}

/** Every render carries it, so a rendered formula is told from any other icon. */
const RENDER_CLASS = 'mathjax-render';

export function MathJaxRenderer({
  tex,
  displayMode = false,
  className,
}: MathJaxRendererProps) {
  const classes =
    className === undefined ? RENDER_CLASS : `${RENDER_CLASS} ${className}`;
  const { svg, error } = useMemo(() => {
    try {
      return { svg: renderToSvg(tex, displayMode), error: null };
    } catch (error_) {
      return {
        svg: '',
        error: error_ instanceof Error ? error_.message : String(error_),
      };
    }
  }, [tex, displayMode]);

  if (error) {
    return (
      <span className={classes} style={{ color: '#c0392b', fontSize: 12 }}>
        {error}
      </span>
    );
  }

  return (
    <span
      className={classes}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
