type PlaceholderPortraitProps = {
  accent: string;
  soft: string;
  label: string;
};

export function PlaceholderPortrait({
  accent,
  soft,
  label,
}: PlaceholderPortraitProps) {
  return (
    <div className="portrait-card" aria-hidden="true">
      <svg viewBox="0 0 240 240" className="portrait-card__svg">
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={soft} />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="240" height="240" rx="36" fill={`url(#gradient-${label})`} />
        <circle cx="120" cy="94" r="42" fill="rgba(255,255,255,0.88)" />
        <path
          d="M70 182c14-38 33-57 50-57s36 19 50 57"
          fill="rgba(255,255,255,0.88)"
        />
      </svg>
      <span className="portrait-card__label">{label}</span>
    </div>
  );
}
