import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface NameNecklacePreviewProps {
  name: string;
  fontFamily?: string;
  material?: 'gold' | 'silver' | 'rose-gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const materialStyles = {
  gold: {
    stops: [
      { offset: '0%', color: '#B8860B' },
      { offset: '20%', color: '#D4A843' },
      { offset: '40%', color: '#F5E6A3' },
      { offset: '55%', color: '#D4A843' },
      { offset: '75%', color: '#C4922A' },
      { offset: '100%', color: '#B8860B' },
    ],
    stroke: '#C4922A',
    chain: '#B8860B',
    chainHighlight: '#D4A843',
    shadow: 'rgba(196, 146, 42, 0.4)',
    ringFill: '#D4A843',
  },
  silver: {
    stops: [
      { offset: '0%', color: '#909090' },
      { offset: '20%', color: '#B0B0B0' },
      { offset: '40%', color: '#E0E0E0' },
      { offset: '55%', color: '#B0B0B0' },
      { offset: '75%', color: '#A0A0A0' },
      { offset: '100%', color: '#909090' },
    ],
    stroke: '#A0A0A0',
    chain: '#909090',
    chainHighlight: '#C0C0C0',
    shadow: 'rgba(160, 160, 160, 0.4)',
    ringFill: '#B0B0B0',
  },
  'rose-gold': {
    stops: [
      { offset: '0%', color: '#B76E79' },
      { offset: '20%', color: '#D4878C' },
      { offset: '40%', color: '#F0C0C4' },
      { offset: '55%', color: '#D4878C' },
      { offset: '75%', color: '#C47A7F' },
      { offset: '100%', color: '#B76E79' },
    ],
    stroke: '#C47A7F',
    chain: '#B76E79',
    chainHighlight: '#D4878C',
    shadow: 'rgba(180, 110, 121, 0.4)',
    ringFill: '#D4878C',
  },
};

const sizeConfig = {
  sm: { height: 90, fontSize: 24, chainStroke: 1, ringR: 2.5, ringStroke: 1 },
  md: { height: 140, fontSize: 36, chainStroke: 1.5, ringR: 3.5, ringStroke: 1.2 },
  lg: { height: 180, fontSize: 48, chainStroke: 2, ringR: 4.5, ringStroke: 1.5 },
};

const NameNecklacePreview = ({
  name,
  fontFamily = "'Dancing Script', cursive",
  material = 'gold',
  size = 'md',
  className = '',
}: NameNecklacePreviewProps) => {
  const mat = materialStyles[material];
  const cfg = sizeConfig[size];
  const textRef = useRef<SVGTextElement>(null);
  const [textBox, setTextBox] = useState({ width: 0, x: 0 });

  const displayName = name.trim() || 'Name';
  const isEmpty = !name.trim();

  // Measure the rendered text to get exact width
  useEffect(() => {
    if (textRef.current) {
      const bbox = textRef.current.getBBox();
      setTextBox({ width: bbox.width, x: bbox.x });
    }
  }, [displayName, fontFamily, cfg.fontSize]);

  // Dynamic font size: shrink for longer names
  const adjustedFontSize =
    displayName.length > 10
      ? cfg.fontSize * 0.55
      : displayName.length > 7
      ? cfg.fontSize * 0.7
      : displayName.length > 5
      ? cfg.fontSize * 0.82
      : cfg.fontSize;

  // SVG dimensions — pad generously for chain curves
  const svgWidth = Math.max(textBox.width + 80, 160);
  const cx = svgWidth / 2;
  const textY = cfg.height * 0.62;

  // Attachment points — at the start and end of the text
  const halfText = textBox.width / 2;
  const leftAttach = cx - halfText - 2;
  const rightAttach = cx + halfText + 2;

  // Ring centers sit just above the text
  const ringY = textY - adjustedFontSize * 0.65;
  const ringR = cfg.ringR;

  // Chain endpoints at top edges
  const chainTopY = 4;
  const chainLeftX = 8;
  const chainRightX = svgWidth - 8;

  // Unique IDs
  const gradId = `nk-grad-${material}-${size}`;
  const shadowId = `nk-shadow-${size}`;
  const shineId = `nk-shine-${material}-${size}`;

  // Connector bar — the thin underline that ties all letters together (laser-cut style)
  const barY = textY + 3;
  const barLeft = leftAttach + ringR + 2;
  const barRight = rightAttach - ringR - 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex justify-center ${className}`}
    >
      <svg
        width={svgWidth}
        height={cfg.height}
        viewBox={`0 0 ${svgWidth} ${cfg.height}`}
        className="overflow-visible"
        style={{ maxWidth: '100%' }}
      >
        <defs>
          {/* Metal gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="80%">
            {mat.stops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>

          {/* Shine overlay */}
          <linearGradient id={shineId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id={shadowId} x="-15%" y="-15%" width="130%" height="150%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor={mat.shadow} floodOpacity="0.7" />
          </filter>
        </defs>

        {/* ── Chain: left side ── */}
        <path
          d={`M ${chainLeftX} ${chainTopY}
              C ${chainLeftX + 10} ${chainTopY + 25},
                ${leftAttach - 15} ${ringY - 30},
                ${leftAttach} ${ringY - ringR - 1}`}
          stroke={mat.chain}
          strokeWidth={cfg.chainStroke}
          fill="none"
          opacity={isEmpty ? 0.25 : 0.55}
          strokeLinecap="round"
        />
        {/* Chain highlight */}
        <path
          d={`M ${chainLeftX} ${chainTopY}
              C ${chainLeftX + 10} ${chainTopY + 25},
                ${leftAttach - 15} ${ringY - 30},
                ${leftAttach} ${ringY - ringR - 1}`}
          stroke={mat.chainHighlight}
          strokeWidth={cfg.chainStroke * 0.4}
          fill="none"
          opacity={isEmpty ? 0.1 : 0.3}
          strokeLinecap="round"
        />

        {/* ── Chain: right side ── */}
        <path
          d={`M ${chainRightX} ${chainTopY}
              C ${chainRightX - 10} ${chainTopY + 25},
                ${rightAttach + 15} ${ringY - 30},
                ${rightAttach} ${ringY - ringR - 1}`}
          stroke={mat.chain}
          strokeWidth={cfg.chainStroke}
          fill="none"
          opacity={isEmpty ? 0.25 : 0.55}
          strokeLinecap="round"
        />
        <path
          d={`M ${chainRightX} ${chainTopY}
              C ${chainRightX - 10} ${chainTopY + 25},
                ${rightAttach + 15} ${ringY - 30},
                ${rightAttach} ${ringY - ringR - 1}`}
          stroke={mat.chainHighlight}
          strokeWidth={cfg.chainStroke * 0.4}
          fill="none"
          opacity={isEmpty ? 0.1 : 0.3}
          strokeLinecap="round"
        />

        {/* ── Bail rings (attachment loops) ── */}
        <circle
          cx={leftAttach}
          cy={ringY}
          r={ringR}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={cfg.ringStroke}
          opacity={isEmpty ? 0.3 : 0.85}
        />
        <circle
          cx={rightAttach}
          cy={ringY}
          r={ringR}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={cfg.ringStroke}
          opacity={isEmpty ? 0.3 : 0.85}
        />

        {/* ── Small connector bars: ring → text ── */}
        <line
          x1={leftAttach}
          y1={ringY + ringR}
          x2={leftAttach + 3}
          y2={barY}
          stroke={mat.stroke}
          strokeWidth={cfg.ringStroke * 0.8}
          opacity={isEmpty ? 0.2 : 0.6}
        />
        <line
          x1={rightAttach}
          y1={ringY + ringR}
          x2={rightAttach - 3}
          y2={barY}
          stroke={mat.stroke}
          strokeWidth={cfg.ringStroke * 0.8}
          opacity={isEmpty ? 0.2 : 0.6}
        />

        {/* ── Laser-cut connector bar (underline that connects all letters) ── */}
        {!isEmpty && textBox.width > 0 && (
          <line
            x1={barLeft}
            y1={barY}
            x2={barRight}
            y2={barY}
            stroke={`url(#${gradId})`}
            strokeWidth={cfg.ringStroke * 0.7}
            opacity={0.35}
            strokeLinecap="round"
          />
        )}

        {/* ── Name text (laser-cut lettering) ── */}
        <text
          ref={textRef}
          x={cx}
          y={textY}
          textAnchor="middle"
          fontFamily={fontFamily}
          fontSize={adjustedFontSize}
          fontWeight="400"
          fill={`url(#${gradId})`}
          filter={`url(#${shadowId})`}
          opacity={isEmpty ? 0.3 : 1}
          style={{ letterSpacing: '0.5px' }}
        >
          {displayName}
        </text>

        {/* ── Shine overlay on text ── */}
        {!isEmpty && (
          <text
            x={cx}
            y={textY}
            textAnchor="middle"
            fontFamily={fontFamily}
            fontSize={adjustedFontSize}
            fontWeight="400"
            fill={`url(#${shineId})`}
            style={{ letterSpacing: '0.5px', pointerEvents: 'none' }}
          >
            {displayName}
          </text>
        )}
      </svg>
    </motion.div>
  );
};

export default NameNecklacePreview;
