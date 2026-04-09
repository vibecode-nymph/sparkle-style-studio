import { motion } from 'framer-motion';

interface NameNecklacePreviewProps {
  name: string;
  fontFamily?: string;
  material?: 'gold' | 'silver' | 'rose-gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const materialGradients = {
  gold: {
    stops: [
      { offset: '0%', color: '#D4B07A' },
      { offset: '30%', color: '#C4922A' },
      { offset: '50%', color: '#E8D5A3' },
      { offset: '70%', color: '#C4922A' },
      { offset: '100%', color: '#D4B07A' },
    ],
    chain: '#C4922A',
    shadow: 'rgba(196, 146, 42, 0.3)',
  },
  silver: {
    stops: [
      { offset: '0%', color: '#C0C0C0' },
      { offset: '30%', color: '#A8A8A8' },
      { offset: '50%', color: '#E8E8E8' },
      { offset: '70%', color: '#A8A8A8' },
      { offset: '100%', color: '#C0C0C0' },
    ],
    chain: '#A8A8A8',
    shadow: 'rgba(168, 168, 168, 0.3)',
  },
  'rose-gold': {
    stops: [
      { offset: '0%', color: '#E8B4B8' },
      { offset: '30%', color: '#D4878C' },
      { offset: '50%', color: '#F0D0D4' },
      { offset: '70%', color: '#D4878C' },
      { offset: '100%', color: '#E8B4B8' },
    ],
    chain: '#D4878C',
    shadow: 'rgba(212, 135, 140, 0.3)',
  },
};

const sizes = {
  sm: { width: 200, height: 100, fontSize: 28, chainY: 12 },
  md: { width: 300, height: 140, fontSize: 40, chainY: 16 },
  lg: { width: 400, height: 180, fontSize: 52, chainY: 20 },
};

const NameNecklacePreview = ({
  name,
  fontFamily = "'Dancing Script', cursive",
  material = 'gold',
  size = 'md',
  className = '',
}: NameNecklacePreviewProps) => {
  const mat = materialGradients[material];
  const dim = sizes[size];
  const displayName = name.trim() || 'Yourname';
  const isEmpty = !name.trim();

  // Adjust font size based on name length
  const adjustedFontSize =
    displayName.length > 10
      ? dim.fontSize * 0.6
      : displayName.length > 7
      ? dim.fontSize * 0.75
      : displayName.length > 5
      ? dim.fontSize * 0.85
      : dim.fontSize;

  const textY = dim.height * 0.58;
  const cx = dim.width / 2;

  // Chain attachment points — offset from center based on text width estimate
  const textWidthEstimate = displayName.length * adjustedFontSize * 0.45;
  const leftAnchor = cx - textWidthEstimate / 2 + adjustedFontSize * 0.1;
  const rightAnchor = cx + textWidthEstimate / 2 - adjustedFontSize * 0.1;

  const gradientId = `necklace-metal-${material}-${size}`;
  const shadowId = `necklace-shadow-${size}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex justify-center ${className}`}
    >
      <svg
        width={dim.width}
        height={dim.height}
        viewBox={`0 0 ${dim.width} ${dim.height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {mat.stops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id={shadowId} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={mat.shadow} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Chain — curved line from edges down to name anchor points */}
        <path
          d={`M 0 ${dim.chainY} Q ${leftAnchor * 0.5} ${dim.chainY + 20} ${leftAnchor} ${textY - adjustedFontSize * 0.55}`}
          stroke={mat.chain}
          strokeWidth="1.5"
          fill="none"
          opacity={isEmpty ? 0.3 : 0.6}
          strokeLinecap="round"
        />
        <path
          d={`M ${dim.width} ${dim.chainY} Q ${rightAnchor + (dim.width - rightAnchor) * 0.5} ${dim.chainY + 20} ${rightAnchor} ${textY - adjustedFontSize * 0.55}`}
          stroke={mat.chain}
          strokeWidth="1.5"
          fill="none"
          opacity={isEmpty ? 0.3 : 0.6}
          strokeLinecap="round"
        />

        {/* Small loops at anchor points */}
        <circle
          cx={leftAnchor}
          cy={textY - adjustedFontSize * 0.55}
          r="2.5"
          fill="none"
          stroke={mat.chain}
          strokeWidth="1"
          opacity={isEmpty ? 0.3 : 0.6}
        />
        <circle
          cx={rightAnchor}
          cy={textY - adjustedFontSize * 0.55}
          r="2.5"
          fill="none"
          stroke={mat.chain}
          strokeWidth="1"
          opacity={isEmpty ? 0.3 : 0.6}
        />

        {/* Name text — laser-cut style */}
        <text
          x={cx}
          y={textY}
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize={adjustedFontSize}
          fontWeight="400"
          fill={`url(#${gradientId})`}
          filter={`url(#${shadowId})`}
          opacity={isEmpty ? 0.35 : 1}
          style={{ letterSpacing: '-0.5px' }}
        >
          {displayName}
        </text>

        {/* Subtle underline connector for laser-cut look */}
        {!isEmpty && (
          <line
            x1={leftAnchor + 5}
            y1={textY + 4}
            x2={rightAnchor - 5}
            y2={textY + 4}
            stroke={mat.chain}
            strokeWidth="0.5"
            opacity="0.2"
          />
        )}
      </svg>
    </motion.div>
  );
};

export default NameNecklacePreview;
