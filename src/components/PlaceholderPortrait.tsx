type PlaceholderPortraitProps = {
  accent: string;
  soft: string;
  label: string;
  imagePath?: string;
  size?: string;
};

export function PlaceholderPortrait({
  accent,
  soft,
  label,
  imagePath,
  size = '240px',
}: PlaceholderPortraitProps) {
  const glyph = Array.from(label)[0] ?? 'A';
  const cardStyle: React.CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <div className="portrait-card" style={cardStyle} aria-hidden="true">
      {imagePath ? (
        <>
          <img alt={label} className="portrait-card__image" src={imagePath} />
          <svg className="portrait-card__svg portrait-card__svg--hidden" viewBox="0 0 240 240" style={{ display: 'none' }} />
        </>
      ) : (
        <svg viewBox="0 0 240 240" className="portrait-card__svg">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={soft} />
              <stop offset="100%" stopColor={accent} />
            </linearGradient>
            <linearGradient id={`plate-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.88)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.34)" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="240" height="240" rx="36" fill={`url(#gradient-${label})`} />
          <rect x="22" y="22" width="196" height="196" rx="30" fill="rgba(255,255,255,0.14)" />
          <circle cx="72" cy="72" r="24" fill="rgba(255,255,255,0.3)" />
          <circle cx="178" cy="58" r="14" fill="rgba(255,255,255,0.44)" />
          <path
            d="M38 174C76 144 118 136 202 120"
            stroke="rgba(255,255,255,0.62)"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <rect x="58" y="82" width="122" height="104" rx="28" fill={`url(#plate-${label})`} />
          <text
            x="119"
            y="150"
            fill={accent}
            fontFamily="'Newsreader', 'Noto Serif SC', serif"
            fontSize="68"
            fontWeight="800"
            textAnchor="middle"
          >
            {glyph}
          </text>
        </svg>
      )}
      <span className="portrait-card__label">{label}</span>
    </div>
  );
}
