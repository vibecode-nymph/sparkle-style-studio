import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useFontPath } from '@/hooks/use-font-path';

interface NameNecklacePreviewProps {
  name: string;
  fontFamily?: string;
  fontId?: 'serif' | 'script' | 'modern';
  material?: 'gold' | 'silver' | 'rose-gold';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/* ── Material palette ─────────────────────────────────── */
const materials = {
  gold: {
    main: [
      { off: '0%', c: '#9E7A1E' },
      { off: '15%', c: '#C4A23A' },
      { off: '35%', c: '#F5E6A3' },
      { off: '50%', c: '#DCBD5C' },
      { off: '70%', c: '#C4922A' },
      { off: '85%', c: '#A67C22' },
      { off: '100%', c: '#876418' },
    ],
    edge: '#8B6914',
    chain: '#B8860B',
    chainHi: '#D4A843',
    shadow: 'rgba(140,100,20,0.55)',
    ring: '#C4A23A',
  },
  silver: {
    main: [
      { off: '0%', c: '#808080' },
      { off: '15%', c: '#A0A0A0' },
      { off: '35%', c: '#E8E8E8' },
      { off: '50%', c: '#C0C0C0' },
      { off: '70%', c: '#999' },
      { off: '85%', c: '#888' },
      { off: '100%', c: '#707070' },
    ],
    edge: '#606060',
    chain: '#909090',
    chainHi: '#C8C8C8',
    shadow: 'rgba(80,80,80,0.45)',
    ring: '#A8A8A8',
  },
  'rose-gold': {
    main: [
      { off: '0%', c: '#9C5A5F' },
      { off: '15%', c: '#C07A7F' },
      { off: '35%', c: '#F0C0C4' },
      { off: '50%', c: '#D4959A' },
      { off: '70%', c: '#C07A7F' },
      { off: '85%', c: '#A8686C' },
      { off: '100%', c: '#8E5458' },
    ],
    edge: '#7A4A4E',
    chain: '#B76E79',
    chainHi: '#D4A0A4',
    shadow: 'rgba(140,80,90,0.5)',
    ring: '#C8888C',
  },
};

/* ── Size presets ─────────────────────────────────────── */
const sizes = {
  sm: { h: 100, fs: 42, stroke: 1.8, ring: 4, chainW: 0.9 },
  md: { h: 150, fs: 60, stroke: 2.4, ring: 5.5, chainW: 1.2 },
  lg: { h: 200, fs: 80, stroke: 3.0, ring: 7, chainW: 1.6 },
};

/* ── Component ────────────────────────────────────────── */
const NameNecklacePreview = ({
  name,
  fontId = 'script',
  material = 'gold',
  size = 'md',
  className = '',
}: NameNecklacePreviewProps) => {
  const cfg = sizes[size];
  const mat = materials[material];
  const displayName = name.trim() || 'Name';
  const isEmpty = !name.trim();

  // Shrink font for long names
  const fontSize = useMemo(() => {
    const len = displayName.length;
    if (len > 10) return cfg.fs * 0.5;
    if (len > 7) return cfg.fs * 0.65;
    if (len > 5) return cfg.fs * 0.8;
    return cfg.fs;
  }, [displayName.length, cfg.fs]);

  // Get real vector outlines from opentype.js
  const { pathData, width: pathWidth, ascender, unitsPerEm, ready } = useFontPath(
    displayName,
    fontId,
    fontSize
  );

  // Compute geometry
  const scale = fontSize / (unitsPerEm || 1000);
  const textAscent = (ascender || 800) * scale;
  const textWidth = pathWidth || fontSize * displayName.length * 0.55;

  // Padding around the charm
  const padX = cfg.ring * 4 + 12;
  const padTop = cfg.h * 0.35;
  const svgW = textWidth + padX * 2;
  const svgH = cfg.h;

  // Text origin: center horizontally, vertically positioned
  const textX = svgW / 2 - textWidth / 2;
  const textY = padTop + textAscent;

  // Bail ring attachment points
  const ringY = textY - textAscent * 0.45;
  const leftRingX = textX - cfg.ring * 2 - 2;
  const rightRingX = textX + textWidth + cfg.ring * 2 + 2;

  // Chain endpoints at top
  const chainTopY = 2;

  // Connector bar (underline)
  const barY = textY + fontSize * 0.08;
  const barLeft = leftRingX + cfg.ring + 1;
  const barRight = rightRingX - cfg.ring - 1;

  // Unique SVG IDs
  const uid = `nn-${material}-${size}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: ready ? 1 : 0.3, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex justify-center ${className}`}
    >
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width={svgW}
        height={svgH}
        className="overflow-visible"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <defs>
          {/* Metal body gradient (diagonal for depth) */}
          <linearGradient id={`${uid}-fill`} x1="0%" y1="0%" x2="80%" y2="100%">
            {mat.main.map((s, i) => (
              <stop key={i} offset={s.off} stopColor={s.c} />
            ))}
          </linearGradient>

          {/* Top-down shine */}
          <linearGradient id={`${uid}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#fff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
          </linearGradient>

          {/* Shape-following shadow — blurred copy of path offset downward */}
          <filter id={`${uid}-shadow`} x="-10%" y="-10%" width="120%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
            <feOffset in="blur" dx="0" dy="3" result="shifted" />
            <feFlood floodColor={mat.shadow} result="color" />
            <feComposite in="color" in2="shifted" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Bevel/depth — inner edge highlight */}
          <filter id={`${uid}-bevel`} x="-5%" y="-5%" width="110%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="inner" />
            <feOffset dx="0.4" dy="-0.4" result="shifted" />
            <feComposite in="shifted" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="edge" />
            <feFlood floodColor="#fff" floodOpacity="0.4" result="white" />
            <feComposite in="white" in2="edge" operator="in" result="highlight" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="highlight" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Chain: left curve ── */}
        <path
          d={`M ${4} ${chainTopY}
              C ${leftRingX * 0.3} ${chainTopY + svgH * 0.2},
                ${leftRingX * 0.6} ${ringY - 20},
                ${leftRingX} ${ringY - cfg.ring - 1}`}
          stroke={mat.chain}
          strokeWidth={cfg.chainW}
          fill="none"
          opacity={isEmpty ? 0.2 : 0.5}
          strokeLinecap="round"
        />
        {/* Chain highlight */}
        <path
          d={`M ${4} ${chainTopY}
              C ${leftRingX * 0.3} ${chainTopY + svgH * 0.2},
                ${leftRingX * 0.6} ${ringY - 20},
                ${leftRingX} ${ringY - cfg.ring - 1}`}
          stroke={mat.chainHi}
          strokeWidth={cfg.chainW * 0.35}
          fill="none"
          opacity={isEmpty ? 0.08 : 0.25}
          strokeLinecap="round"
        />

        {/* ── Chain: right curve ── */}
        <path
          d={`M ${svgW - 4} ${chainTopY}
              C ${svgW - (svgW - rightRingX) * 0.3} ${chainTopY + svgH * 0.2},
                ${svgW - (svgW - rightRingX) * 0.6} ${ringY - 20},
                ${rightRingX} ${ringY - cfg.ring - 1}`}
          stroke={mat.chain}
          strokeWidth={cfg.chainW}
          fill="none"
          opacity={isEmpty ? 0.2 : 0.5}
          strokeLinecap="round"
        />
        <path
          d={`M ${svgW - 4} ${chainTopY}
              C ${svgW - (svgW - rightRingX) * 0.3} ${chainTopY + svgH * 0.2},
                ${svgW - (svgW - rightRingX) * 0.6} ${ringY - 20},
                ${rightRingX} ${ringY - cfg.ring - 1}`}
          stroke={mat.chainHi}
          strokeWidth={cfg.chainW * 0.35}
          fill="none"
          opacity={isEmpty ? 0.08 : 0.25}
          strokeLinecap="round"
        />

        {/* ── Bail rings (attachment loops) ── */}
        {[leftRingX, rightRingX].map((rx, i) => (
          <g key={i}>
            {/* Ring shadow */}
            <circle
              cx={rx} cy={ringY} r={cfg.ring}
              fill="none" stroke={mat.edge}
              strokeWidth={cfg.stroke * 0.6}
              opacity={isEmpty ? 0.1 : 0.2}
              transform={`translate(0, 1.5)`}
            />
            {/* Main ring */}
            <circle
              cx={rx} cy={ringY} r={cfg.ring}
              fill="none"
              stroke={`url(#${uid}-fill)`}
              strokeWidth={cfg.stroke * 0.8}
              opacity={isEmpty ? 0.25 : 0.9}
            />
            {/* Ring shine */}
            <circle
              cx={rx} cy={ringY} r={cfg.ring * 0.75}
              fill="none"
              stroke="#fff"
              strokeWidth={cfg.stroke * 0.15}
              opacity={isEmpty ? 0 : 0.2}
              strokeDasharray={`${cfg.ring * 1.2} ${cfg.ring * 3}`}
              strokeDashoffset={cfg.ring * 0.5}
            />
          </g>
        ))}

        {/* ── Vertical connectors: ring → charm ── */}
        {[
          { x: leftRingX, toX: barLeft },
          { x: rightRingX, toX: barRight },
        ].map((c, i) => (
          <line
            key={i}
            x1={c.x} y1={ringY + cfg.ring}
            x2={c.toX} y2={barY}
            stroke={`url(#${uid}-fill)`}
            strokeWidth={cfg.stroke * 0.5}
            opacity={isEmpty ? 0.15 : 0.6}
            strokeLinecap="round"
          />
        ))}

        {/* ── Connector bar (laser-cut base plate) ── */}
        {!isEmpty && pathWidth > 0 && (
          <rect
            x={barLeft - 1}
            y={barY - cfg.stroke * 0.3}
            width={barRight - barLeft + 2}
            height={cfg.stroke * 0.6}
            rx={cfg.stroke * 0.3}
            fill={`url(#${uid}-fill)`}
            opacity={0.4}
          />
        )}

        {/* ── The name: real vector outlines ── */}
        {ready && pathData && (
          <g filter={`url(#${uid}-shadow)`}>
            <g transform={`translate(${textX}, ${textY})`}>
              {/* Main filled path */}
              <path
                d={pathData}
                fill={`url(#${uid}-fill)`}
                stroke={mat.edge}
                strokeWidth={cfg.stroke * 0.15}
                strokeLinejoin="round"
                filter={`url(#${uid}-bevel)`}
                opacity={isEmpty ? 0.3 : 1}
              />
              {/* Shine overlay */}
              <path
                d={pathData}
                fill={`url(#${uid}-shine)`}
                style={{ pointerEvents: 'none' }}
              />
            </g>
          </g>
        )}

        {/* Fallback while loading */}
        {!ready && (
          <text
            x={svgW / 2}
            y={textY}
            textAnchor="middle"
            fontFamily="'Dancing Script', cursive"
            fontSize={fontSize}
            fill={`url(#${uid}-fill)`}
            opacity={0.3}
          >
            {displayName}
          </text>
        )}
      </svg>
    </motion.div>
  );
};

export default NameNecklacePreview;
