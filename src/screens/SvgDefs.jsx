import React from 'react';

export default function SvgDefs(v) {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", width: "0", height: "0", overflow: "hidden" }}>
      <defs>
        <filter id="dvBlur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <linearGradient id="jPcbTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2e34" />
          <stop offset="1" stopColor="#16181b" />
        </linearGradient>
        <linearGradient id="jHsTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d646e" />
          <stop offset=".5" stopColor="#3a3f46" />
          <stop offset="1" stopColor="#25282d" />
        </linearGradient>
        <radialGradient id="jFan" cx=".4" cy=".35" r=".75">
          <stop offset="0" stopColor="#2b2f35" />
          <stop offset="1" stopColor="#0b0c0e" />
        </radialGradient>
        <linearGradient id="tTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3e45" />
          <stop offset="1" stopColor="#16181b" />
        </linearGradient>
        <linearGradient id="tSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1c1e22" />
          <stop offset="1" stopColor="#0e0f11" />
        </linearGradient>
        <linearGradient id="tFin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9DEE3" />
          <stop offset=".55" stopColor="#A8AFB7" />
          <stop offset="1" stopColor="#7C848D" />
        </linearGradient>
        <linearGradient id="sTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EFE6D9" />
          <stop offset="1" stopColor="#D6C7B6" />
        </linearGradient>
        <linearGradient id="sFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2D6C6" />
          <stop offset="1" stopColor="#C4B4A0" />
        </linearGradient>
        <linearGradient id="sSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#CFC1B0" />
          <stop offset="1" stopColor="#AE9C88" />
        </linearGradient>
        <linearGradient id="sPanel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EEE7DB" />
          <stop offset="1" stopColor="#D2C6B6" />
        </linearGradient>
        <pattern id="sRib" width="0.07" height="0.07" patternUnits="userSpaceOnUse" patternTransform="rotate(42)">
          <line x1="0" y1="0" x2="0" y2="0.07" stroke="#BCAD97" strokeWidth="0.03" />
        </pattern>
        <pattern id="sFoam" width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#A9A49A" />
          <circle cx="5.8" cy="6.6" r="0.5" fill="#E6E2DB" />
          <circle cx="0.4" cy="5.4" r="0.8" fill="#33302B" />
          <circle cx="5.5" cy="2.3" r="0.6" fill="#33302B" />
          <circle cx="5.5" cy="6.9" r="0.5" fill="#6E685E" />
          <circle cx="0.2" cy="1.9" r="0.5" fill="#C9C4BB" />
          <circle cx="1.5" cy="6.4" r="0.6" fill="#33302B" />
          <circle cx="6.6" cy="2.1" r="0.8" fill="#4C473F" />
          <circle cx="1.4" cy="3.1" r="0.6" fill="#E6E2DB" />
          <circle cx="6.6" cy="6.5" r="0.5" fill="#33302B" />
          <circle cx="6.2" cy="4" r="0.5" fill="#6E685E" />
          <circle cx="4.1" cy="1.7" r="0.5" fill="#C9C4BB" />
          <circle cx="2.2" cy="3.7" r="0.8" fill="#33302B" />
          <circle cx="3.5" cy="2.6" r="0.7" fill="#4C473F" />
          <circle cx="5.1" cy="0.9" r="0.6" fill="#6E685E" />
          <circle cx="4" cy="5.2" r="0.8" fill="#33302B" />
          <circle cx="2.3" cy="4.4" r="0.6" fill="#C9C4BB" />
          <circle cx="1" cy="3.9" r="0.5" fill="#E6E2DB" />
          <circle cx="3" cy="1.6" r="0.5" fill="#6E685E" />
          <circle cx="0.5" cy="5.1" r="0.7" fill="#4C473F" />
          <circle cx="2" cy="6.3" r="0.5" fill="#C9C4BB" />
          <circle cx="4.4" cy="6.2" r="0.9" fill="#33302B" />
          <circle cx="5" cy="4.8" r="0.6" fill="#4C473F" />
          <circle cx="3.4" cy="4" r="0.6" fill="#E6E2DB" />
          <circle cx="6.4" cy="5.2" r="0.5" fill="#C9C4BB" />
          <circle cx="1.8" cy="1.2" r="0.6" fill="#33302B" />
          <circle cx="0.8" cy="6.6" r="0.5" fill="#6E685E" />
        </pattern>
        <linearGradient id="sFoamShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".18" />
          <stop offset="1" stopColor="#262320" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id="dgxBlue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2063C9" />
          <stop offset="1" stopColor="#17529F" />
        </linearGradient>
        <clipPath id="dgxClip">
          <rect x="53" y="19" width="94" height="82" rx="2.6" />
        </clipPath>
        <clipPath id="dgxClip2" clipPathUnits="userSpaceOnUse">
          <rect x="0.05" y="0.05" width="0.9" height="0.9" rx="0.05" />
        </clipPath>
        <linearGradient id="jonTopG" gradientUnits="userSpaceOnUse" x1="100" y1="20" x2="100" y2="92">
          <stop offset="0" stopColor="#4288F4" />
          <stop offset="1" stopColor="#2355BE" />
        </linearGradient>
        <linearGradient id="jonRightG" gradientUnits="userSpaceOnUse" x1="168" y1="56" x2="100" y2="118">
          <stop offset="0" stopColor="#245AAE" />
          <stop offset="1" stopColor="#143A77" />
        </linearGradient>
        <linearGradient id="jonLeftG" gradientUnits="userSpaceOnUse" x1="32" y1="56" x2="100" y2="103">
          <stop offset="0" stopColor="#2E64CE" />
          <stop offset="1" stopColor="#1F4AA0" />
        </linearGradient>
        <linearGradient id="jonBaseG" gradientUnits="userSpaceOnUse" x1="32" y1="67" x2="66" y2="118">
          <stop offset="0" stopColor="#F7F9FC" />
          <stop offset="1" stopColor="#CDD3DC" />
        </linearGradient>
        <linearGradient id="jonFaceG" gradientUnits="userSpaceOnUse" x1="100" y1="26" x2="100" y2="96">
          <stop offset="0" stopColor="#3C7DED" />
          <stop offset="0.55" stopColor="#2D5EC6" />
          <stop offset="1" stopColor="#214FB2" />
        </linearGradient>
        <linearGradient id="jonGrilleG" gradientUnits="userSpaceOnUse" x1="140" y1="78" x2="130" y2="108">
          <stop offset="0" stopColor="#F4F6F9" />
          <stop offset="1" stopColor="#D6DBE3" />
        </linearGradient>
        <radialGradient id="jonShadowG" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0B1B3A" stopOpacity="0.3" />
          <stop offset="1" stopColor="#0B1B3A" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
