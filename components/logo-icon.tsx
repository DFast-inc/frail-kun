export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 背景 (円形・ソフト) */}
      <rect x="15" y="40" width="270" height="120" rx="40" ry="40" fill="#78B7C5" opacity="0.2" />

      {/* テキスト (フレイルくん) */}
      <text
        x="150"
        y="115"
        fontFamily="Arial, sans-serif"
        fontSize="42"
        fontWeight="bold"
        textAnchor="middle"
        fill="#5B9EAD"
      >
        フレイルくん
      </text>

      {/* 柔らかいアクセント */}
      <path d="M45,135 Q150,155 255,135" stroke="#5B9EAD" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
