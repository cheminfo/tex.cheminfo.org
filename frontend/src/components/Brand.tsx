/**
 * The site mark: a radical sign in the lead colour over the square it renders
 * the formula into. Reads the brand tokens, so retuning the pair retunes it.
 * `public/favicon.svg` repeats this geometry with literal colours.
 * @param props.size - Rendered edge length in pixels.
 * @returns The inline SVG mark.
 */
export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="14"
        y="8"
        width="6.5"
        height="6.5"
        rx="1.3"
        fill="var(--brand-alt)"
      />
      <path
        d="M2.5 12.5h2.6l3.2 7.4L13 3.5h8.5"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The site name, in the two colours this site owns.
 * @param props.className - Extra class names, for size and weight.
 * @returns The wordmark.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className ? `wordmark ${className}` : 'wordmark'}>
      <span className="wordmark__lead">tex</span>
      <span className="wordmark__dot">.</span>
      <span className="wordmark__alt">cheminfo</span>
    </span>
  );
}
