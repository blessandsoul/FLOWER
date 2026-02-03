interface FlowerIconProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Subtle 5-petal flower icon for FLORCA branding
 * Matches the flower icon in server PDF generator
 */
export function FlowerIcon({ size = 24, className = '', color = 'currentColor' }: FlowerIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      {/* Center circle */}
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.3" />

      {/* 5 petals in circle formation (72° apart) */}
      <circle cx="12" cy="6" r="3" fill={color} opacity="0.2" />
      <circle cx="17.5" cy="9" r="3" fill={color} opacity="0.2" />
      <circle cx="16" cy="16.5" r="3" fill={color} opacity="0.2" />
      <circle cx="8" cy="16.5" r="3" fill={color} opacity="0.2" />
      <circle cx="6.5" cy="9" r="3" fill={color} opacity="0.2" />
    </svg>
  );
}
