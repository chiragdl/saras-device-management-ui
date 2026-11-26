import React from 'react';
import Sx from '../components/Sx.jsx';

export default function DeviceDetail(v) {
  return (
    ((v.isDetail) ? (
      <>
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <ol style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", minWidth: "0" }}>
            <li>
              <Sx as="button" hover={{ background: "#EEF2F7" }} onClick={v.dtBack} style={{ height: "36px", display: "flex", alignItems: "center", gap: "6px", padding: "0 10px 0 6px", marginLeft: "-6px", border: "0", borderRadius: "8px", background: "transparent", color: "#005BB8", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Fleet overview</span>
              </Sx>
            </li>
            <li aria-hidden="true" style={{ color: "#8A93A2" }}>/</li>
            <li style={{ display: v.dt?.crumbTypeDisplay, minWidth: "0" }}>
              <Sx as="button" hover={{ background: "#EEF2F7" }} onClick={v.dt?.crumbTypeBack} style={{ height: "36px", display: "flex", alignItems: "center", padding: "0 10px", border: "0", borderRadius: "8px", background: "transparent", color: "#005BB8", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px" }}>{v.dt?.crumbTypeLabel}</Sx>
            </li>
            <li aria-hidden="true" style={{ display: v.dt?.crumbTypeDisplay, color: "#8A93A2" }}>/</li>
            <li aria-current="page" style={{ fontWeight: "600", color: "#1A1E26", whiteSpace: "nowrap" }}>{v.dt?.title}</li>
          </ol>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12.5px", color: "#5A6675", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{v.dt?.pos}</span>
            <Sx as="button" hover={{ borderColor: "#0070E0", color: "#005BB8" }} onClick={v.dt?.prev} aria-label="Previous device" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid #D5DBE4", background: "#FFFFFF", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Sx>
            <Sx as="button" hover={{ borderColor: "#0070E0", color: "#005BB8" }} onClick={v.dt?.next} aria-label="Next device" style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid #D5DBE4", background: "#FFFFFF", color: "#1A1E26", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Sx>
          </div>
        </nav>
        <section aria-labelledby="dt-title" style={{ display: "grid", gridTemplateColumns: v.dt?.heroCols, gap: "20px", alignItems: "center", padding: "18px", background: "#FFFFFF", border: "1px solid #E4E9F0", borderBottom: "none", borderRadius: "16px 16px 0 0", boxShadow: "0 4px 16px -10px rgba(16,42,84,.12)" }}>
          <div style={{ height: "128px", borderRadius: "12px", border: "1px solid #E4E9F0", background: "radial-gradient(120% 95% at 50% 15%,#FFFFFF 0%,#F2F5F9 62%,#E4EAF2 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <svg role="img" aria-label={v.dt?.r?.illoAlt} width="176" height="106" viewBox="0 0 200 120" style={{ display: v.dt?.r?.dJON }}>
              <ellipse cx="102" cy="112" rx="80" ry="15" fill="url(#jonShadowG)" />
              <path d="M100,97 Q100,92 104.42,89.66 L163.58,58.34 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 100,113 Z" fill="url(#jonRightG)" />
              <path d="M113.6,103.4 Q113.6,100.4 116.25,99 L153.11,79.48 Q155.76,78.08 155.76,81.08 L155.76,82.88 Q155.76,85.88 153.11,87.28 L116.25,106.8 Q113.6,108.2 113.6,105.2 Z" fill="url(#jonGrilleG)" />
              <path d="M113.6,100.4 L155.76,78.08" stroke="#FFFFFF" strokeWidth="0.7" opacity="0.6" />
              <g fill="#16181D">
                <circle cx="117" cy="100.16" r="0.9" />
                <circle cx="120.94" cy="98.07" r="0.9" />
                <circle cx="124.89" cy="95.98" r="0.9" />
                <circle cx="128.83" cy="93.9" r="0.9" />
                <circle cx="132.78" cy="91.81" r="0.9" />
                <circle cx="136.72" cy="89.72" r="0.9" />
                <circle cx="140.66" cy="87.63" r="0.9" />
                <circle cx="144.61" cy="85.54" r="0.9" />
                <circle cx="148.55" cy="83.46" r="0.9" />
                <circle cx="152.5" cy="81.37" r="0.9" />
                <circle cx="118.97" cy="100.68" r="0.9" />
                <circle cx="122.92" cy="98.59" r="0.9" />
                <circle cx="126.86" cy="96.5" r="0.9" />
                <circle cx="130.8" cy="94.41" r="0.9" />
                <circle cx="134.75" cy="92.32" r="0.9" />
                <circle cx="138.69" cy="90.24" r="0.9" />
                <circle cx="142.64" cy="88.15" r="0.9" />
                <circle cx="146.58" cy="86.06" r="0.9" />
                <circle cx="150.52" cy="83.97" r="0.9" />
                <circle cx="117" cy="103.28" r="0.9" />
                <circle cx="120.94" cy="101.19" r="0.9" />
                <circle cx="124.89" cy="99.1" r="0.9" />
                <circle cx="128.83" cy="97.02" r="0.9" />
                <circle cx="132.78" cy="94.93" r="0.9" />
                <circle cx="136.72" cy="92.84" r="0.9" />
                <circle cx="140.66" cy="90.75" r="0.9" />
                <circle cx="144.61" cy="88.66" r="0.9" />
                <circle cx="148.55" cy="86.58" r="0.9" />
                <circle cx="152.5" cy="84.49" r="0.9" />
                <circle cx="118.97" cy="103.8" r="0.9" />
                <circle cx="122.92" cy="101.71" r="0.9" />
                <circle cx="126.86" cy="99.62" r="0.9" />
                <circle cx="130.8" cy="97.53" r="0.9" />
                <circle cx="134.75" cy="95.44" r="0.9" />
                <circle cx="138.69" cy="93.36" r="0.9" />
                <circle cx="142.64" cy="91.27" r="0.9" />
                <circle cx="146.58" cy="89.18" r="0.9" />
                <circle cx="150.52" cy="87.09" r="0.9" />
              </g>
              <g fontFamily="system-ui,-apple-system,sans-serif" fill="#D4E4FB" textAnchor="middle">
                <text transform="matrix(0.8838,-0.4679,0,1,134,77.9)" fontSize="4.4" fontWeight="600" letterSpacing="0.6">PROCTORING</text>
                <text transform="matrix(0.8838,-0.4679,0,1,134,82.58)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Anywhere · Anytime</text>
                <text transform="matrix(0.8838,-0.4679,0,1,134,86.48)" fontSize="2.7" fontWeight="500" letterSpacing="0.2">Instantly</text>
              </g>
              <path d="M36.42,58.34 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 163.58,58.34 L104.42,89.66 Q100,92 95.58,89.66 Z" fill="url(#jonTopG)" />
              <path d="M36,56 Q32,56 35.54,54.13 L96.46,21.87 Q100,20 100,24 L100,30 Q100,34 96.3,35.51 L49.7,54.49 Q46,56 42,56 Z" fill="#5F9BFF" opacity="0.28" />
              <path d="M32,61 Q32,56 36.42,58.34 L95.58,89.66 Q100,92 100,97 L100,98.44 Q100,103.44 95.58,101.1 L36.42,69.78 Q32,67.44 32,62.44 Z" fill="url(#jonLeftG)" />
              <path d="M32,72.44 Q32,67.44 36.42,69.78 L95.58,101.1 Q100,103.44 100,108.44 L100,113 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" fill="url(#jonBaseG)" />
              <line x1="32" y1="67.9" x2="100" y2="103.9" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
              <g fill="#111319">
                <polygon points="37.78,75.05 45.26,79.01 45.26,83.43 37.78,79.47" />
                <polygon points="49.34,81.17 59.54,86.57 59.54,90.99 49.34,85.59" />
                <polygon points="62.26,88.01 72.46,93.41 72.46,97.83 62.26,92.43" />
                <polygon points="75.52,94.64 87.76,101.12 87.76,106.32 75.52,99.84" />
              </g>
              <g stroke="#9FB0C4" strokeWidth="0.7" opacity="0.7" fill="none" strokeLinecap="round">
                <line x1="37.78" y1="75.05" x2="45.26" y2="79.01" />
                <line x1="49.34" y1="81.17" x2="59.54" y2="86.57" />
                <line x1="62.26" y1="88.01" x2="72.46" y2="93.41" />
                <line x1="75.52" y1="94.64" x2="87.76" y2="101.12" />
              </g>
              <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                <polyline points="32,56 100,20 168,56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                <polyline points="32,56 100,92 168,56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                <line x1="100" y1="92" x2="100" y2="118" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                <line x1="32" y1="56" x2="32" y2="82" stroke="#6E97DC" strokeWidth="0.8" opacity="0.6" />
                <path d="M32,61 Q32,56 36.42,53.66 L95.58,22.34 Q100,20 104.42,22.34 L163.58,53.66 Q168,56 168,61 L168,77 Q168,82 163.58,84.34 L104.42,115.66 Q100,118 95.58,115.66 L36.42,84.34 Q32,82 32,77 Z" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
              </g>
              <g transform="rotate(26,92,34)">
                <path transform="translate(80.95,23.46) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.5" />
                <path transform="translate(79.55,22.06) scale(0.235)" d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
              </g>
              <text transform="matrix(0.8838,0.4679,-0.8838,0.4679,101.5,58)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="1.1" fill="#EAF2FF">SARAS</text>
            </svg>
            <svg role="img" aria-label={v.dt?.r?.illoAlt} width="176" height="106" viewBox="0 0 200 120" style={{ display: v.dt?.r?.dRPI }}>
              <ellipse cx="88" cy="114" rx="78" ry="13" fill="url(#jonShadowG)" />
              <polygon points="73,79.82 139.6,43.56 139.6,73.56 73,109.82" fill="url(#jonRightG)" />
              <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82" fill="url(#jonTopG)" />
              <polygon points="33.4,58.26 100,22 88.01,28.53 40.53,62.14" fill="#5F9BFF" opacity="0.22" />
              <polygon points="33.4,58.26 73,79.82 73,96.62 33.4,75.06" fill="url(#jonLeftG)" />
              <polygon points="33.4,75.06 73,96.62 73,109.82 33.4,88.26" fill="url(#jonBaseG)" />
              <line x1="33.4" y1="75.06" x2="73" y2="96.62" stroke="#FFFFFF" strokeWidth="0.9" opacity="0.8" />
              <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="#D4D9E0" />
              <polygon points="36.17,78.37 42.9,82.03 42.9,91.93 36.17,88.27" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
              <polygon points="37.16,81.31 41.91,83.9 41.91,89.3 37.16,86.71" fill="#14161B" />
              <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="#D4D9E0" />
              <polygon points="45.68,82.94 52.01,86.39 52.01,97.19 45.68,93.74" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
              <polygon points="46.47,85.17 51.22,87.76 51.22,90.76 46.47,88.17" fill="#2458A6" />
              <polygon points="46.47,89.97 51.22,92.56 51.22,95.56 46.47,92.97" fill="#2458A6" />
              <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="#D4D9E0" />
              <polygon points="54.39,87.69 60.72,91.14 60.72,101.94 54.39,98.49" fill="none" stroke="#9AA3B0" strokeWidth="0.4" />
              <polygon points="55.18,89.92 59.93,92.51 59.93,95.51 55.18,92.92" fill="#15171C" />
              <polygon points="55.18,94.72 59.93,97.31 59.93,100.31 55.18,97.72" fill="#15171C" />
              <g fill="none" strokeLinejoin="round" strokeLinecap="round">
                <polyline points="33.4,58.26 100,22 139.6,43.56" stroke="#A9CBFF" strokeWidth="1.1" opacity="0.9" />
                <polyline points="33.4,58.26 73,79.82 139.6,43.56" stroke="#8FB2F0" strokeWidth="0.9" opacity="0.6" />
                <line x1="73" y1="79.82" x2="73" y2="109.82" stroke="#9FC0F5" strokeWidth="0.9" opacity="0.7" />
                <polygon points="33.4,58.26 100,22 139.6,43.56 73,79.82 73,109.82 33.4,88.26" stroke="#355EA8" strokeWidth="1" opacity="0.8" />
              </g>
              <g transform="translate(80,35) rotate(14) scale(0.26,0.17) translate(-28,-34)">
                <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#0E2E6B" opacity="0.4" transform="translate(-1.5,4)" />
                <path d="M28.03,58.5c-1.3,1.49-1.24,3.77.18,5.19,8.42,8.42,16.38,16.39,24.81,24.81.99.99,1.79,2.6,1.79,3.59v14.41c0,.99-.81.99-1.79,0-13.13-13.13-25.81-25.81-38.94-38.94-3.61-3.61-3.61-9.52,0-13.13l24.07-24.06c3.61-3.61,9.52-3.61,13.13,0,7.12,7.12,14.21,14.26,21.33,21.37,5.03,5.03,2.83,15.45-7.36,15.45h-25.75c-.99,0-1.79-.81-1.79-1.79v-9.14c0-.99.8-1.79,1.79-1.79h16.17c.79,0,.96-.76.57-1.14l-8.81-8.81c-1.48-1.48-3.91-1.48-5.39,0l-13.99,13.99h0ZM62.04,106.51c-.99.99-1.79.99-1.79,0v-14.41c0-.99.81-2.6,1.79-3.59l24.81-24.81c1.42-1.42,1.48-3.7.18-5.19-10.72-10.72-21.4-21.46-32.11-32.18-5.03-5.03-2.83-15.45,7.37-15.45h39.59c.99,0,1.79.81,1.79,1.79v9.15c0,.99-.81,1.79-1.79,1.79h-30c-.79,0-.97.76-.57,1.14l29.68,29.69c3.61,3.61,3.61,9.52,0,13.13l-38.94,38.94h0Z" fill="#FFFFFF" />
              </g>
              <text textAnchor="middle" transform="matrix(0.8838,0.4679,-0.8838,0.4679,84.5,55)" fontFamily="system-ui,-apple-system,sans-serif" fontSize="6" fontWeight="700" letterSpacing="0.5" fill="#EAF2FF">SARAS</text>
            </svg>
            <svg role="img" aria-label={v.dt?.r?.illoAlt} width="176" height="106" viewBox="0 0 200 120" style={{ display: v.dt?.r?.dTHR }}>
              <polygon points="74.9,42 77.3,43.4 77.3,41.8 74.9,40.4" fill="#08090a" />
              <polygon points="79.7,42 77.3,43.4 77.3,41.8 79.7,40.4" fill="#060607" />
              <polygon points="77.3,39 79.7,40.4 77.3,41.8 74.9,40.4" fill="#0d0e10" />
              <polygon points="151.1,86 153.5,87.4 153.5,85.8 151.1,84.4" fill="#08090a" />
              <polygon points="155.9,86 153.5,87.4 153.5,85.8 155.9,84.4" fill="#060607" />
              <polygon points="153.5,83 155.9,84.4 153.5,85.8 151.1,84.4" fill="#0d0e10" />
              <polygon points="119.9,104 122.3,105.4 122.3,103.8 119.9,102.4" fill="#08090a" />
              <polygon points="124.8,104 122.3,105.4 122.3,103.8 124.8,102.4" fill="#060607" />
              <polygon points="122.3,101 124.8,102.4 122.3,103.8 119.9,102.4" fill="#0d0e10" />
              <polygon points="43.7,60 46.1,61.4 46.1,59.8 43.7,58.4" fill="#08090a" />
              <polygon points="48.6,60 46.1,61.4 46.1,59.8 48.6,58.4" fill="#060607" />
              <polygon points="46.1,57 48.6,58.4 46.1,59.8 43.7,58.4" fill="#0d0e10" />
              <polygon points="38.5,58.2 122.7,106.8 122.7,85.6 38.5,37" fill="#1b1d21" />
              <polygon points="161.5,84.4 122.7,106.8 122.7,85.6 161.5,63.2" fill="url(#tSide)" />
              <polygon points="77.3,14.6 161.5,63.2 122.7,85.6 38.5,37" fill="url(#tTop)" />
              <line x1="38.5" y1="37" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
              <line x1="161.5" y1="63.2" x2="122.7" y2="85.6" stroke="#6b727c" strokeWidth=".7" strokeLinecap="round" />
              <polygon points="77.3,18.6 154.6,63.2 122.7,81.6 45.4,37" fill="#24272c" />
              <line x1="45.4" y1="37" x2="122.7" y2="81.6" stroke="#3b4048" strokeWidth=".6" strokeLinecap="round" />
              <polygon points="53.1,36.6 70.4,46.6 68.3,47.8 51,37.8" fill="#76B900" />
              <polygon points="40.6,57 107.8,95.8 107.8,79.4 40.6,40.6" fill="url(#tFin)" />
              <line x1="41.3" y1="57" x2="41.3" y2="41.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="41.7" y1="57.3" x2="41.7" y2="41.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="42.7" y1="57.8" x2="42.7" y2="42.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="43.2" y1="58.1" x2="43.2" y2="43" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="44.2" y1="58.7" x2="44.2" y2="43.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="44.6" y1="58.9" x2="44.6" y2="44.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="45.6" y1="59.5" x2="45.6" y2="45" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="46.1" y1="59.8" x2="46.1" y2="45.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="47.1" y1="60.4" x2="47.1" y2="46.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="47.6" y1="60.6" x2="47.6" y2="46.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="48.6" y1="61.2" x2="48.6" y2="47.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="49" y1="61.5" x2="49" y2="47.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="50" y1="62" x2="50" y2="48.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="50.5" y1="62.3" x2="50.5" y2="48.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="51.5" y1="62.9" x2="51.5" y2="49.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="51.9" y1="63.1" x2="51.9" y2="49.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="52.9" y1="63.7" x2="52.9" y2="50.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="53.4" y1="64" x2="53.4" y2="50.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="54.4" y1="64.6" x2="54.4" y2="51" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="54.8" y1="64.8" x2="54.8" y2="51.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="55.8" y1="65.4" x2="55.8" y2="51.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="56.3" y1="65.7" x2="56.3" y2="52.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="57.3" y1="66.2" x2="57.3" y2="52.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="57.7" y1="66.5" x2="57.7" y2="52.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="58.7" y1="67.1" x2="58.7" y2="53.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="59.2" y1="67.3" x2="59.2" y2="53.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="60.2" y1="67.9" x2="60.2" y2="54.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="60.6" y1="68.2" x2="60.6" y2="54.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="61.7" y1="68.8" x2="61.7" y2="54.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="62.1" y1="69" x2="62.1" y2="55.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="63.1" y1="69.6" x2="63.1" y2="55.6" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="63.6" y1="69.9" x2="63.6" y2="55.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="64.6" y1="70.4" x2="64.6" y2="56.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="65" y1="70.7" x2="65" y2="56.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="66" y1="71.3" x2="66" y2="57" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="66.5" y1="71.5" x2="66.5" y2="57.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="67.5" y1="72.1" x2="67.5" y2="57.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="67.9" y1="72.4" x2="67.9" y2="57.9" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="68.9" y1="73" x2="68.9" y2="58.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="69.4" y1="73.2" x2="69.4" y2="58.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="70.4" y1="73.8" x2="70.4" y2="59.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="70.8" y1="74.1" x2="70.8" y2="59.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="71.8" y1="74.6" x2="71.8" y2="59.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="72.3" y1="74.9" x2="72.3" y2="60.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="73.3" y1="75.5" x2="73.3" y2="60.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="73.7" y1="75.7" x2="73.7" y2="61" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="74.7" y1="76.3" x2="74.7" y2="61.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="75.2" y1="76.6" x2="75.2" y2="61.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="76.2" y1="77.2" x2="76.2" y2="62.4" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="76.7" y1="77.4" x2="76.7" y2="62.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="77.7" y1="78" x2="77.7" y2="63.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="78.1" y1="78.3" x2="78.1" y2="63.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="79.1" y1="78.8" x2="79.1" y2="64.2" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="79.6" y1="79.1" x2="79.6" y2="64.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="80.6" y1="79.7" x2="80.6" y2="65.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="81" y1="79.9" x2="81" y2="65.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="82" y1="80.5" x2="82" y2="66.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="82.5" y1="80.8" x2="82.5" y2="66.4" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="83.5" y1="81.4" x2="83.5" y2="67.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="83.9" y1="81.6" x2="83.9" y2="67.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="84.9" y1="82.2" x2="84.9" y2="68.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="85.4" y1="82.5" x2="85.4" y2="68.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="86.4" y1="83" x2="86.4" y2="69.1" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="86.8" y1="83.3" x2="86.8" y2="69.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="87.8" y1="83.9" x2="87.8" y2="70" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="88.3" y1="84.1" x2="88.3" y2="70.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="89.3" y1="84.7" x2="89.3" y2="71" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="89.7" y1="85" x2="89.7" y2="71.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="90.8" y1="85.6" x2="90.8" y2="71.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="91.2" y1="85.8" x2="91.2" y2="72.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="92.2" y1="86.4" x2="92.2" y2="72.8" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="92.7" y1="86.7" x2="92.7" y2="73.1" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="93.7" y1="87.2" x2="93.7" y2="73.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="94.1" y1="87.5" x2="94.1" y2="74" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="95.1" y1="88.1" x2="95.1" y2="74.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="95.6" y1="88.3" x2="95.6" y2="74.8" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="96.6" y1="88.9" x2="96.6" y2="75.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="97" y1="89.2" x2="97" y2="75.5" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="98" y1="89.8" x2="98" y2="76" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="98.5" y1="90" x2="98.5" y2="76.3" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="99.5" y1="90.6" x2="99.5" y2="76.7" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="99.9" y1="90.9" x2="99.9" y2="77" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="100.9" y1="91.4" x2="100.9" y2="77.3" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="101.4" y1="91.7" x2="101.4" y2="77.6" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="102.4" y1="92.3" x2="102.4" y2="77.9" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="102.8" y1="92.5" x2="102.8" y2="78.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="103.8" y1="93.1" x2="103.8" y2="78.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="104.3" y1="93.4" x2="104.3" y2="78.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="105.3" y1="94" x2="105.3" y2="79" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="105.8" y1="94.2" x2="105.8" y2="79.2" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <line x1="106.8" y1="94.8" x2="106.8" y2="79.5" stroke="#4a5058" strokeWidth="1.1" strokeLinecap="round" />
              <line x1="107.2" y1="95.1" x2="107.2" y2="79.7" stroke="#E3E7EB" strokeWidth=".5" strokeLinecap="round" />
              <polygon points="111.1,87.5 112.9,88.6 112.9,86.5 111.1,85.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
              <polygon points="114.5,89.5 116.3,90.6 116.3,88.5 114.5,87.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
              <polygon points="118,91.5 119.8,92.6 119.8,90.5 118,89.4" fill="#0b0c0e" stroke="#4a5058" strokeWidth=".4" />
              <polygon points="111.6,92.4 113,93.2 113,92.2 111.6,91.4" fill="#34D058" />
              <polygon points="114.7,94.2 116.1,95 116.1,94 114.7,93.2" fill="#F59E0B" />
              <polygon points="158.7,74 153.9,76.8 153.9,74.4 158.7,71.6" fill="#B9C0C8" />
              <polygon points="158.3,72.9 154.3,75.2 154.3,74.8 158.3,72.4" fill="#2B5DA8" />
              <polygon points="158.7,77.6 153.9,80.4 153.9,78 158.7,75.2" fill="#B9C0C8" />
              <polygon points="158.3,76.5 154.3,78.8 154.3,78.4 158.3,76" fill="#2B5DA8" />
              <polygon points="152.5,81.2 146.9,84.4 146.9,78.8 152.5,75.6" fill="#A7AEB6" />
              <polygon points="152.1,78.4 147.4,81.1 147.4,80 152.1,77.2" fill="#15171a" />
              <polygon points="145.6,82.4 140.4,85.4 140.4,83 145.6,80" fill="#0a0b0c" />
              <polygon points="145.6,85.6 141,88.2 141,85.8 145.6,83.2" fill="#0a0b0c" />
              <polygon points="139,85.4 135.9,87.2 135.9,85.6 139,83.8" fill="#B9C0C8" />
              <polygon points="139,88.2 135.9,90 135.9,88.4 139,86.6" fill="#B9C0C8" />
              <polygon points="134.5,92.4 126.2,97.2 126.2,90.4 134.5,85.6" fill="#C9CED4" />
              <polygon points="134.1,88.9 126.6,93.2 126.6,91.9 134.1,87.5" fill="#2a2d32" />
              <polygon points="130.3,86.4 128.2,87.6 128.2,86.4 130.3,85.2" fill="#0a0b0c" />
            </svg>
            <svg role="img" aria-label={v.dt?.r?.illoAlt} width="176" height="106" viewBox="0 0 200 120" style={{ display: v.dt?.r?.dDGX }}>
              <ellipse cx="100" cy="113" rx="73" ry="10" fill="#8A8F96" opacity="0.3" />
              <polygon points="100,9.8 165,47.3 100,84.8 35.1,47.3" fill="url(#sTop)" />
              <polygon points="35.1,47.3 100,84.8 100,110 35.1,72.5" fill="url(#sSide)" />
              <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoam)" />
              <polygon points="96.8,84.7 37.7,50.6 37.7,72.2 96.8,106.4" fill="url(#sFoamShade)" />
              <g>
                <rect x="45" y="73.5" width="17" height="8" rx="2.5" fill="#F3F1EB" />
                <circle cx="49.5" cy="77.5" r="2" fill="#76B900" />
                <circle cx="49.3" cy="77.3" r="0.8" fill="#E2F2C6" />
              </g>
              <polygon points="165,47.3 100,84.8 100,110 165,72.5" fill="url(#sFront)" />
              <g transform="matrix(64.9,-37.5,64.9,37.5,35.1,47.3)">
                <rect x="0.05" y="0.05" width="0.9" height="0.9" rx="0.05" fill="url(#dgxBlue)" />
                <g clipPath="url(#dgxClip2)">
                  <ellipse cx="0.35" cy="0.12" rx="0.32" ry="0.09" fill="#FFFFFF" opacity="0.07" />
                  <rect x="0.11" y="0.1" width="0.075" height="0.075" rx="0.014" fill="#F5901E" />
                  <path d="M0.125,0.118 L0.17,0.118 L0.147,0.137 L0.17,0.137 L0.122,0.162 L0.142,0.137 L0.117,0.137 Z" fill="#FFFFFF" />
                  <rect x="0.205" y="0.112" width="0.28" height="0.026" rx="0.013" fill="#FFFFFF" opacity="0.95" />
                  <rect x="0.205" y="0.148" width="0.1" height="0.018" rx="0.009" fill="#CFE0F5" opacity="0.75" />
                  <rect x="0.58" y="0.1" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                  <rect x="0.66" y="0.104" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                  <rect x="0.66" y="0.132" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                  <rect x="0.58" y="0.19" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                  <rect x="0.66" y="0.194" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                  <rect x="0.66" y="0.222" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                  <rect x="0.58" y="0.28" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                  <rect x="0.66" y="0.284" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                  <rect x="0.66" y="0.312" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                  <rect x="0.58" y="0.37" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                  <rect x="0.66" y="0.374" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                  <rect x="0.66" y="0.402" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                  <rect x="0.58" y="0.46" width="0.05" height="0.05" rx="0.012" fill="#CFE0F5" opacity="0.9" />
                  <rect x="0.66" y="0.464" width="0.2" height="0.022" rx="0.011" fill="#FFFFFF" opacity="0.95" />
                  <rect x="0.66" y="0.492" width="0.26" height="0.018" rx="0.009" fill="#BFD3EE" opacity="0.8" />
                  <rect x="0.11" y="0.55" width="0.14" height="0.14" rx="0.02" fill="none" stroke="#FFFFFF" strokeWidth="0.012" />
                  <line x1="0.18" y1="0.555" x2="0.18" y2="0.685" stroke="#FFFFFF" strokeWidth="0.01" />
                  <path d="M0.125,0.59 Q0.18,0.565 0.235,0.59" fill="none" stroke="#CFE0F5" strokeWidth="0.008" />
                  <path d="M0.275,0.465 L0.2926,0.5024 L0.33,0.52 L0.2926,0.5376 L0.275,0.575 L0.2574,0.5376 L0.22,0.52 L0.2574,0.5024 Z" fill="#F5901E" />
                  <path d="M0.325,0.568 L0.3352,0.5898 L0.357,0.6 L0.3352,0.6102 L0.325,0.632 L0.3148,0.6102 L0.293,0.6 L0.3148,0.5898 Z" fill="#F5901E" />
                  <image href="/assets/saras-schoolai-panel.png" x="0.3" y="0.5" width="0.54" height="0.24" preserveAspectRatio="xMidYMid meet" opacity="0.96" />
                  <rect x="0.11" y="0.76" width="0.78" height="0.022" rx="0.011" fill="#BFD3EE" opacity="0.8" />
                  <path d="M0.05,0.82 C0.25,0.78 0.45,0.86 0.6,0.81 C0.75,0.77 0.85,0.83 0.95,0.8 L0.95,0.95 L0.05,0.95 Z" fill="#4A97E5" />
                  <path d="M0.05,0.86 C0.25,0.82 0.45,0.9 0.6,0.85 C0.75,0.81 0.85,0.87 0.95,0.84 L0.95,0.95 L0.05,0.95 Z" fill="#EE8020" />
                  <path d="M0.05,0.895 C0.27,0.86 0.47,0.93 0.62,0.89 C0.77,0.855 0.85,0.91 0.95,0.89 L0.95,0.95 L0.05,0.95 Z" fill="#F3F5F8" />
                </g>
              </g>
              <line x1="100" y1="9.8" x2="165" y2="47.3" stroke="#F3ECDD" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="100" y1="9.8" x2="35.1" y2="47.3" stroke="#F7F0E2" strokeWidth="0.7" strokeLinecap="round" />
              <line x1="165" y1="47.3" x2="100" y2="84.8" stroke="#E7DCCB" strokeWidth="0.6" strokeLinecap="round" />
              <line x1="100" y1="84.8" x2="100" y2="110" stroke="#8E8075" strokeWidth="0.5" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 id="dt-title" tabIndex="-1" style={{ margin: "0", fontSize: "24px", fontWeight: "600", fontVariantNumeric: "tabular-nums", outline: "none" }}>{v.dt?.title}</h1>
              {v.dt?.idSub ? <span style={{ fontSize: "13px", color: "#5A6675", fontVariantNumeric: "tabular-nums" }}>{v.dt?.idSub}</span> : null}
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "28px", padding: "0 11px 0 9px", borderRadius: "999px", background: v.dt?.r?.sBg, color: v.dt?.r?.sFg, fontSize: "12.5px", fontWeight: "600" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={v.dt?.r?.sIcon} />
                </svg>
                <span>{v.dt?.r?.status}</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12.5px", fontWeight: "600", color: v.dt?.r?.healthFg }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={v.dt?.r?.healthIcon} />
                </svg>
                <span>{v.dt?.r?.healthText}</span>
              </span>
            </div>
            <span style={{ fontSize: "14px", color: "#5A6675" }}>{v.dt?.r?.brand}{v.dt?.r?.type} · SN {v.dt?.r?.serial}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "30px", padding: "0 11px 0 7px", borderRadius: "999px", background: "#EEF2F7", color: "#005BB8", fontSize: "12.5px", fontWeight: "600", whiteSpace: "nowrap" }}>
                <span aria-hidden="true" style={{ width: "20px", height: "20px", borderRadius: "6px", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={v.dt?.r?.productIcon} />
                  </svg>
                </span>
                <span>{v.dt?.r?.product}</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "30px", padding: "0 11px", borderRadius: "999px", background: "#F5F7FA", border: "1px solid #E4E9F0", color: "#1A1E26", fontSize: "12.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" />
                </svg>
                <span>{v.dt?.r?.customer}</span>
              </span>
              <span title={v.dt?.r?.seenAbs} style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "30px", padding: "0 11px", borderRadius: "999px", background: "#F5F7FA", border: "1px solid #E4E9F0", color: "#1A1E26", fontSize: "12.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 6v6l4 2" />
                </svg>
                <span>Last seen {v.dt?.r?.seen}</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "30px", padding: "0 11px", borderRadius: "999px", background: "#F5F7FA", border: "1px solid #E4E9F0", color: "#1A1E26", fontSize: "12.5px", fontWeight: "500", whiteSpace: "nowrap" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2 4 6v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-4z" />
                </svg>
                <span>App {v.dt?.r?.app}</span>
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "stretch", minWidth: "180px" }}>
            <Sx as="button" hover={{ filter: "brightness(1.06)" }} onClick={v.dt?.r?.hcRun} disabled={v.dt?.r?.hcDisabled} aria-label={v.dt?.r?.hcAria} style={{ height: "44px", display: v.dt?.r?.hcDisplay || "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "0 16px", border: "0", borderRadius: "11px", background: v.dt?.patchBg, color: v.dt?.patchFg, fontSize: "14px", fontWeight: "600", cursor: v.dt?.r?.hcCursor, whiteSpace: "nowrap" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: v.dt?.r?.hcAnim }}>
                <path d={v.dt?.r?.hcIcon} />
              </svg>
              <span>{v.dt?.r?.hcLabel}</span>
            </Sx>
          </div>
        </section>
        <section aria-labelledby="dt-glance-h" style={{ marginTop: "-20px", display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid #E4E9F0", borderRadius: "0 0 16px 16px", boxShadow: "0 10px 18px -14px rgba(16,42,84,.18)", overflow: "visible" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "11px 18px", borderTop: "1px solid #EEF2F7", background: "linear-gradient(180deg,#FBFCFE 0%,#F6F8FB 100%)", borderRadius: "0 0 0 0" }}>
            <span aria-hidden="true" style={{ color: "#0070E0", display: "flex" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={v.dt?.glance?.icon} />
              </svg>
            </span>
            <h2 id="dt-glance-h" style={{ margin: "0", fontSize: "11.5px", fontWeight: "700", letterSpacing: ".07em", textTransform: "uppercase", color: "#5A6675", flex: "1", minWidth: "0" }}>{v.dt?.glance?.title}</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "16px 18px 18px" }}>
            {(v.dt?.glance?.items ?? []).map((it, $index) => (
              <React.Fragment key={$index}>
                <Sx as="div" hover={{ borderColor: "#D3E0F2", boxShadow: "0 8px 20px -12px rgba(16,42,84,.4)" }} className="stat-card" tabIndex="0" style={{ display: "flex", flexDirection: "column", gap: "5px", padding: "13px 15px", borderRadius: "12px", background: "#FFFFFF", border: "1px solid #E7ECF3", boxShadow: "0 1px 2px rgba(16,42,84,.04)", flex: "1 1 auto", minWidth: "168px", maxWidth: "340px", outline: "none", transition: "border-color .15s,box-shadow .15s" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", fontWeight: "600", letterSpacing: ".02em", color: "#6A7686", lineHeight: "1.3" }}>
                    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px", flexShrink: "0" }}>
                      <span className="hb-ping" aria-hidden="true" style={{ display: it?.beatDisp, position: "absolute", inset: "0", borderRadius: "50%", background: it?.iconFg, animation: "hbPing 1.6s ease-out infinite" }} />
                      <span className="hb-icon" style={{ position: "relative", color: it?.iconFg, display: "flex", transformOrigin: "center", animation: it?.beatAnim }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={it?.icon} />
                        </svg>
                      </span>
                    </span>
                    <span>{it?.label}</span>
                  </span>
                  <span style={{ fontSize: "21px", lineHeight: "1.1", fontWeight: "600", color: it?.fg, fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>{it?.value}</span>
                  <span style={{ fontSize: "11.5px", color: "#8591A1" }}>{it?.sub}</span>
                  <span className="stat-tip" role="tooltip" style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", zIndex: "30", width: "240px", padding: "12px 14px", borderRadius: "12px", background: "#10233F", color: "#FFFFFF", boxShadow: "0 18px 40px -14px rgba(8,20,42,.7)", pointerEvents: "none", textAlign: "left" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: "600", letterSpacing: ".04em", textTransform: "uppercase", color: "#8FB7EE" }}>
                      <span style={{ display: "flex" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={it?.icon} />
                        </svg>
                      </span>
                      <span>{it?.label}</span>
                    </span>
                    <span style={{ display: "block", marginTop: "7px", fontSize: "19px", fontWeight: "600", lineHeight: "1.1", color: it?.tipValFg, fontVariantNumeric: "tabular-nums" }}>{it?.value}</span>
                    <span style={{ display: it?.subDisp, marginTop: "3px", fontSize: "12px", color: "#C3D2E6" }}>{it?.sub}</span>
                    <span style={{ display: it?.tipDisp, marginTop: "9px", paddingTop: "9px", borderTop: "1px solid rgba(255,255,255,.14)", fontSize: "12px", lineHeight: "1.45", color: "#D7E2F1" }}>{it?.tip}</span>
                    <span aria-hidden="true" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", border: "7px solid transparent", borderTopColor: "#10233F" }} />
                  </span>
                </Sx>
              </React.Fragment>
            ))}
          </div>
        </section>
        <div role="status" style={{ display: v.dt?.bannerDisplay, alignItems: "flex-start", gap: "10px", padding: "12px 14px", borderRadius: "12px", background: v.dt?.bannerBg, border: `1px solid ${v.dt?.bannerBorder}`, color: v.dt?.bannerFg, fontSize: "13.5px", fontWeight: "500" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={v.dt?.bannerIcon} />
          </svg>
          <span>{v.dt?.banner}</span>
        </div>
        <div style={{ position: "sticky", top: "64px", zIndex: "20", background: "#F5F7FA", margin: "0 -24px", padding: "0 24px" }}>
          <div role="tablist" aria-label="Device details" style={{ display: "flex", gap: "2px", overflowX: "auto", borderBottom: "1px solid #E1E6EF", scrollbarWidth: "none" }}>
            {(v.dt?.tabs ?? []).map((t, $index) => (
              <React.Fragment key={$index}>
                <Sx as="button" hover={{ background: "#EAEFF5", color: "#005BB8" }} role="tab" id={t?.tid} aria-selected={t?.sel} aria-controls="dt-panel" tabIndex={t?.tab} onClick={t?.pick} onKeyDown={t?.key} style={{ position: "relative", flexShrink: "0", height: "50px", display: "flex", alignItems: "center", gap: "8px", padding: "0 14px", border: "0", borderBottomWidth: "3px", borderBottomStyle: "solid", borderBottomColor: t?.line, borderRadius: "8px 8px 0 0", background: "transparent", color: t?.fg, fontSize: "14px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", transition: "color .2s,border-color .2s,background-color .2s" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={t?.icon} />
                  </svg>
                  <span>{t?.label}</span>
                  <span style={{ display: t?.badgeDisplay, minWidth: "20px", height: "20px", padding: "0 6px", borderRadius: "999px", background: t?.badgeBg, color: t?.badgeFg, fontSize: "11.5px", fontWeight: "600", alignItems: "center", justifyContent: "center", fontVariantNumeric: "tabular-nums" }}>{t?.badge}</span>
                  <span style={{ display: t?.soonDisplay, height: "18px", padding: "0 7px", borderRadius: "999px", background: "#E3EEFB", color: "#005BB8", fontSize: "10px", fontWeight: "600", letterSpacing: ".06em", textTransform: "uppercase", alignItems: "center" }}>Soon</span>
                </Sx>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div id="dt-panel" role="tabpanel" aria-labelledby={v.dt?.tabId} tabIndex="0" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "16px", alignItems: "stretch", outline: "none" }}>
            {(v.dt?.groups ?? []).map((g, $index) => (
              <React.Fragment key={$index}>
                <section aria-labelledby={g?.hid} style={{ gridColumn: g?.col, order: g?.order, minWidth: "0", display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid #E4E9F0", borderRadius: "14px", boxShadow: "0 4px 16px -8px rgba(16,42,84,.12)", overflow: g?.secOverflow }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px", borderBottom: "1px solid #E4E9F0", background: "#FBFCFD", borderRadius: "14px 14px 0 0" }}>
                    <span aria-hidden="true" style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#EEF2F7", color: "#0070E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={g?.icon} />
                      </svg>
                    </span>
                    <h2 id={g?.hid} style={{ margin: "0", fontSize: "15px", fontWeight: "600", flex: "1", minWidth: "0" }}>{g?.title}</h2>
                    <span style={{ display: g?.rowCountDisplay, alignItems: "center", fontSize: "12px", fontWeight: "600", color: "#5A6675", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{g?.rowCountText}</span>
                    <Sx as="button" hover={{ borderColor: "#0070E0", background: "#F6F8FB" }} onClick={g?.csvFn} title="Export this table as Excel" aria-label={`Export ${g?.title} as Excel`} style={{ display: g?.csvDisplay, alignItems: "center", gap: "5px", height: "32px", padding: "0 11px", border: "1px solid #D5DBE4", borderRadius: "8px", background: "#FFFFFF", color: "#005BB8", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
                      </svg>
                      <span>Excel</span>
                    </Sx>
                    <span style={{ display: g?.asideDisplay, fontSize: "13px", fontWeight: "600", color: g?.asideFg, background: g?.asideBg, borderRadius: "999px", padding: "5px 13px", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{g?.aside}</span>
                    <Sx as="button" hover={{ background: "#EEF2F7" }} onClick={g?.link} style={{ display: g?.linkDisplay, height: "32px", alignItems: "center", gap: "4px", padding: "0 10px", border: "0", borderRadius: "8px", background: "transparent", color: "#005BB8", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" }}>
                      <span>{g?.linkLabel}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Sx>
                  </div>
                  {(g?.isCustom) ? (
                    <>
                      <div style={{ padding: "14px 16px 16px" }}>{g?.el}</div>
                    </>
                  ) : null}
                  {(g?.isStats) ? (
                    <>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "14px 16px 16px" }}>
                        {(g?.items ?? []).map((it, $index) => (
                          <React.Fragment key={$index}>
                            <Sx as="div" hover={{ borderColor: "#D3E0F2", boxShadow: "0 8px 20px -12px rgba(16,42,84,.4)" }} className="stat-card" tabIndex="0" style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "12px 14px", borderRadius: "12px", background: "#F6F8FB", border: "1px solid #EDF1F6", flex: "1 1 auto", minWidth: "170px", maxWidth: "340px", outline: "none", transition: "border-color .15s,box-shadow .15s" }}>
                              <span style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "12.5px", fontWeight: "500", color: "#5A6675", lineHeight: "1.3" }}>
                                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px", marginTop: "0", flexShrink: "0" }}>
                                  <span className="hb-ping" aria-hidden="true" style={{ display: it?.beatDisp, position: "absolute", inset: "0", borderRadius: "50%", background: it?.iconFg, animation: "hbPing 1.6s ease-out infinite" }} />
                                  <span className="hb-icon" style={{ position: "relative", color: it?.iconFg, display: "flex", transformOrigin: "center", animation: it?.beatAnim }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d={it?.icon} />
                                    </svg>
                                  </span>
                                </span>
                                <span>{it?.label}</span>
                              </span>
                              <span style={{ fontSize: "20px", lineHeight: "1.15", fontWeight: "600", color: it?.fg, fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>{it?.value}</span>
                              <span style={{ fontSize: "12px", color: "#5A6675" }}>{it?.sub}</span>
                              <span className="stat-tip" role="tooltip" style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", zIndex: "30", width: "240px", padding: "12px 14px", borderRadius: "12px", background: "#10233F", color: "#FFFFFF", boxShadow: "0 18px 40px -14px rgba(8,20,42,.7)", pointerEvents: "none", textAlign: "left" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: "600", letterSpacing: ".04em", textTransform: "uppercase", color: "#8FB7EE" }}>
                                  <span style={{ display: "flex" }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d={it?.icon} />
                                    </svg>
                                  </span>
                                  <span>{it?.label}</span>
                                </span>
                                <span style={{ display: "block", marginTop: "7px", fontSize: "19px", fontWeight: "600", lineHeight: "1.1", color: it?.tipValFg, fontVariantNumeric: "tabular-nums" }}>{it?.value}</span>
                                <span style={{ display: it?.subDisp, marginTop: "3px", fontSize: "12px", color: "#C3D2E6" }}>{it?.sub}</span>
                                <span style={{ display: it?.tipDisp, marginTop: "9px", paddingTop: "9px", borderTop: "1px solid rgba(255,255,255,.14)", fontSize: "12px", lineHeight: "1.45", color: "#D7E2F1" }}>{it?.tip}</span>
                                <span aria-hidden="true" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", border: "7px solid transparent", borderTopColor: "#10233F" }} />
                              </span>
                            </Sx>
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {(g?.isKv) ? (
                    <>
                      <dl style={{ margin: "0", padding: "4px 16px 10px", display: "grid", gridTemplateColumns: "minmax(110px,max-content) minmax(0,1fr)", columnGap: "0" }}>
                        {(g?.items ?? []).map((it, $index) => (
                          <React.Fragment key={$index}>
                            <dt style={{ padding: "10px 16px 10px 0", borderBottom: "1px solid #F0F3F7", fontSize: "13px", color: "#5A6675" }}>{it?.k}</dt>
                            <dd style={{ margin: "0", padding: "10px 0", borderBottom: "1px solid #F0F3F7", fontSize: "13px", fontWeight: "500", color: it?.fg, textAlign: "right", overflowWrap: "anywhere", fontVariantNumeric: "tabular-nums" }}>{it?.v}</dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    </>
                  ) : null}
                  {(g?.isMeters) ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "14px 16px 18px" }}>
                        {(g?.items ?? []).map((it, $index) => (
                          <React.Fragment key={$index}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                                <span style={{ fontSize: "13px", color: "#5A6675" }}>{it?.label}</span>
                                <span title={it?.title} style={{ fontSize: "14px", fontWeight: "600", color: it?.fg, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{it?.value}</span>
                              </div>
                              <span className="sdc-bar" aria-hidden="true" style={{ display: it?.barDisplay, position: "relative", height: "9px", borderRadius: "999px", background: "#EEF1F5", boxShadow: "inset 0 1px 2px rgba(16,42,84,.09)" }}>
                                <span style={{ display: "block", height: "100%", width: it?.pct, borderRadius: "999px", background: `linear-gradient(90deg,color-mix(in srgb,${it?.barC} 82%,#FFFFFF),${it?.barC})`, boxShadow: `0 1px 4px -2px color-mix(in srgb,${it?.barC} 45%,transparent),inset 0 1px 0 rgba(255,255,255,.3)`, transition: "width .9s cubic-bezier(.22,.61,.18,1)" }} />
                                <span className="sdc-tip" style={{ left: it?.pct, background: "#1A2740", color: "#FFFFFF", borderRadius: "8px", padding: "5px 9px", fontSize: "11px", fontWeight: "500", whiteSpace: "nowrap", boxShadow: "0 10px 22px -8px rgba(16,42,84,.55)" }}>{it?.label}: {it?.value}</span>
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                        <div style={{ display: g?.coresDisplay, flexDirection: "column", gap: "10px", paddingTop: "4px", borderTop: "1px dashed #E4E9F0" }}>
                          <span style={{ fontSize: "13px", color: "#5A6675", paddingTop: "10px" }}>Per-core utilization</span>
                          <div role="img" aria-label={g?.coresAria} style={{ display: "flex", alignItems: "flex-end", gap: "5px", height: "56px", borderBottom: "1.5px solid #E4E9F0" }}>
                            {(g?.cores ?? []).map((c, $index) => (
                              <React.Fragment key={$index}>
                                <span className="sdc-bar" style={{ position: "relative", flex: "1", minWidth: "6px", height: "100%", display: "flex", alignItems: "flex-end" }}>
                                  <span style={{ display: "block", width: "100%", height: c?.h, borderRadius: "5px 5px 0 0", background: `linear-gradient(180deg,color-mix(in srgb,${c?.c} 82%,#FFFFFF),${c?.c})`, boxShadow: `0 -1px 4px -2px color-mix(in srgb,${c?.c} 45%,transparent),inset 0 1px 0 rgba(255,255,255,.3)` }} />
                                  <span className="sdc-tip" style={{ background: "#1A2740", color: "#FFFFFF", borderRadius: "8px", padding: "5px 9px", fontSize: "11px", fontWeight: "500", whiteSpace: "nowrap", boxShadow: "0 10px 22px -8px rgba(16,42,84,.55)" }}>{c?.title}</span>
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {(g?.isStack) ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "14px 16px 16px" }}>
                        <div role="img" aria-label={g?.stackAria} style={{ display: "flex", height: "16px", borderRadius: "999px", overflow: "hidden", background: "#EEF2F7", gap: "2px", boxShadow: "inset 0 1px 2px rgba(16,42,84,.12)" }}>
                          {(g?.items ?? []).map((it, $index) => (
                            <React.Fragment key={$index}>
                              <Sx as="span" hover={{ filter: "brightness(1.12)" }} title={`${it?.label} · ${it?.value} (${it?.pct})`} style={{ width: it?.w, background: it?.bar, transition: "filter .15s" }} />
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,130px),1fr))", gap: "10px" }}>
                          {(g?.items ?? []).map((it, $index) => (
                            <React.Fragment key={$index}>
                              <Sx as="div" hover={{ transform: "translateY(-2px)", boxShadow: "0 10px 20px -10px rgba(16,42,84,.3)" }} className="stat-card" tabIndex="0" style={{ position: "relative", display: "flex", flexDirection: "column", gap: "7px", padding: "10px 12px", borderRadius: "10px", background: "linear-gradient(180deg,#FFFFFF,#F2F5FA)", border: "1px solid #E7ECF3", boxShadow: "0 1px 2px rgba(16,42,84,.05)", cursor: "default", outline: "none", transition: "transform .15s,box-shadow .15s" }}>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center", minWidth: "0" }}>
                                  <span aria-hidden="true" style={{ width: "10px", height: "10px", borderRadius: "3px", background: it?.c, flexShrink: "0" }} />
                                  <span style={{ fontSize: "12.5px", color: "#5A6675", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: "1", minWidth: "0" }}>{it?.label}</span>
                                  <span style={{ fontSize: "11.5px", fontWeight: "600", color: "#8591A1", fontVariantNumeric: "tabular-nums" }}>{it?.pct}</span>
                                </div>
                                <span style={{ fontSize: "15px", fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>{it?.value}</span>
                                <span aria-hidden="true" style={{ height: "4px", borderRadius: "999px", background: "#EEF2F7", overflow: "hidden" }}>
                                  <span style={{ display: "block", height: "100%", width: it?.w, background: it?.c, borderRadius: "999px" }} />
                                </span>
                                <span className="stat-tip" role="tooltip" style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", zIndex: "30", width: "230px", padding: "12px 14px", borderRadius: "12px", background: "#10233F", color: "#FFFFFF", boxShadow: "0 18px 40px -14px rgba(8,20,42,.7)", pointerEvents: "none", textAlign: "left" }}>
                                  <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "11px", fontWeight: "600", letterSpacing: ".04em", textTransform: "uppercase", color: "#8FB7EE" }}>
                                    <span aria-hidden="true" style={{ width: "9px", height: "9px", borderRadius: "2px", background: it?.c, flexShrink: "0" }} />
                                    <span>{it?.label}</span>
                                  </span>
                                  <span style={{ display: "block", marginTop: "7px", fontSize: "18px", fontWeight: "600", lineHeight: "1.1", fontVariantNumeric: "tabular-nums" }}>{it?.value}
                                    <span style={{ fontSize: "12px", fontWeight: "500", color: "#C3D2E6", marginLeft: "6px" }}>{it?.pct} of disk</span>
                                  </span>
                                  <span style={{ display: "block", marginTop: "9px", paddingTop: "9px", borderTop: "1px solid rgba(255,255,255,.14)", fontSize: "12px", lineHeight: "1.45", color: "#D7E2F1" }}>{it?.tip}</span>
                                  <span aria-hidden="true" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", border: "7px solid transparent", borderTopColor: "#10233F" }} />
                                </span>
                              </Sx>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                  {(g?.isTrend) ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px 16px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px 18px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px" }}>
                            {(g?.series ?? []).map((se, $index) => (
                              <React.Fragment key={$index}>
                                <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "#5A6675" }}>
                                  <span aria-hidden="true" style={{ width: "14px", height: "3px", borderRadius: "2px", background: se?.color }} />
                                  <span>{se?.label}</span>
                                  <span style={{ fontWeight: "600", color: "#1A1E26", fontVariantNumeric: "tabular-nums" }}>{se?.now}</span>
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                          <div role="group" aria-label="Time range" style={{ display: "flex", gap: "3px", padding: "3px", borderRadius: "9px", background: "#F5F7FA", boxShadow: "inset 0 0 0 1px #E4E9F0", flexShrink: "0" }}>
                            {(g?.ranges ?? []).map((rg, $index) => (
                              <React.Fragment key={$index}>
                                <button onClick={rg?.go} aria-pressed={rg?.pressed} style={{ height: "27px", minWidth: "34px", padding: "0 10px", border: "0", borderRadius: "7px", background: rg?.bg, color: rg?.fg, fontSize: "12px", fontWeight: "600", cursor: "pointer", fontVariantNumeric: "tabular-nums", transition: "background .15s,color .15s", boxShadow: rg?.shadow }}>{rg?.label}</button>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        <Sx as="div" focus={{ boxShadow: "0 0 0 3px rgba(0,112,224,.25)" }} tabIndex="0" role="img" aria-label={g?.trendAria} onMouseMove={g?.hMove} onMouseLeave={g?.hLeave} onKeyDown={g?.hKey} onFocus={g?.hFocus} onBlur={g?.hLeave} style={{ position: "relative", height: "170px", cursor: "crosshair", borderRadius: "8px", outline: "none" }}>
                          <svg aria-hidden="true" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", display: "block", overflow: "visible" }}>
                            <path d="M0 4H300M0 27H300M0 50H300M0 73H300M0 96H300" stroke="#EEF1F5" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                            {(g?.series ?? []).map((se, $index) => (
                              <React.Fragment key={$index}>
                                <path d={se?.area} fill={se?.color} opacity=".06" />
                                <path d={se?.path} fill="none" stroke={se?.color} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ transition: "d .4s cubic-bezier(.22,1,.36,1)" }} />
                              </React.Fragment>
                            ))}
                          </svg>
                          <span aria-hidden="true" style={{ position: "absolute", top: "0", bottom: "0", left: g?.hx, width: "1px", background: "repeating-linear-gradient(180deg,#8A93A2 0 3px,transparent 3px 6px)", opacity: g?.hOp, pointerEvents: "none", transition: "left .22s cubic-bezier(.22,1,.36,1),opacity .2s" }} />
                          {(g?.hDots ?? []).map((hd, $index) => (
                            <React.Fragment key={$index}>
                              <span aria-hidden="true" style={{ position: "absolute", left: g?.hx, top: hd?.y, width: "11px", height: "11px", margin: "-5.5px 0 0 -5.5px", borderRadius: "50%", background: "#FFFFFF", border: `2.5px solid ${hd?.color}`, boxShadow: "0 1px 4px rgba(16,42,84,.25)", opacity: hd?.hide ? 0 : g?.hOp, pointerEvents: "none", transition: "left .22s cubic-bezier(.22,1,.36,1),top .22s cubic-bezier(.22,1,.36,1),opacity .2s" }} />
                            </React.Fragment>
                          ))}
                          <div aria-hidden="true" style={{ position: "absolute", top: "6px", left: g?.hx, transform: g?.tipX, minWidth: "176px", padding: "10px 12px", borderRadius: "10px", background: "#0C1B2E", color: "#FFFFFF", boxShadow: "0 10px 24px -10px rgba(4,24,60,.55)", opacity: g?.hOp, pointerEvents: "none", display: "flex", flexDirection: "column", gap: "6px", transition: "left .22s cubic-bezier(.22,1,.36,1),transform .22s cubic-bezier(.22,1,.36,1),opacity .2s" }}>
                            <span style={{ fontSize: "12px", fontWeight: "500", color: "#B8C6D9", whiteSpace: "nowrap" }}>{g?.hTime}</span>
                            {(g?.hDots ?? []).map((hd, $index) => (
                              <React.Fragment key={$index}>
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", whiteSpace: "nowrap" }}>
                                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: hd?.color, flexShrink: "0" }} />
                                  <span style={{ flex: "1", color: "#E6ECF3" }}>{hd?.label}</span>
                                  <span style={{ fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>{hd?.v}</span>
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                        </Sx>
                        <span aria-live="polite" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>{g?.hTime}</span>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "#5A6675" }}>
                          <span>{g?.axL}</span>
                          <span>{g?.axM}</span>
                          <span>{g?.axR}</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {(g?.isTable) ? (
                    <>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: g?.minW }}>
                          <thead>
                            <tr style={{ background: "#EAF3FF" }}>
                              {(g?.cols ?? []).map((c, $index) => (
                                <React.Fragment key={$index}>
                                  <th scope="col" aria-sort={c?.ariaSort} style={{ textAlign: c?.align, padding: "0", minWidth: c?.minW, fontSize: "12.5px", fontWeight: "600", letterSpacing: ".2px", color: "#1A2740", whiteSpace: "nowrap" }}>
                                    <button onClick={c?.sortFn} style={{ display: "inline-flex", alignItems: "center", gap: "5px", width: "100%", justifyContent: c?.thJustify, padding: "11px 16px", border: "0", background: "transparent", color: "inherit", font: "inherit", fontWeight: "600", letterSpacing: ".2px", cursor: c?.thCursor }}>
                                      <span>{c?.t}</span>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0070E0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: c?.caretDisplay, flexShrink: "0" }}>
                                        <path d={c?.caret} />
                                      </svg>
                                    </button>
                                  </th>
                                </React.Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(g?.rows ?? []).map((row, $index) => (
                              <React.Fragment key={$index}>
                                <Sx as="tr" hover={{ background: row?.rowHoverBg }} style={{ borderTop: "1px solid #E4E9F0", background: row?.rowBg, boxShadow: `inset 3px 0 0 ${row?.railBg}`, transition: "background .2s" }}>
                                  {(row?.cells ?? []).map((c, $index) => (
                                    <React.Fragment key={$index}>
                                      <td style={{ padding: "13px 16px", textAlign: c?.align, fontSize: "13.5px", verticalAlign: "top" }}>
                                        <Sx as="button" hover={{ background: "rgba(16,42,84,.05)" }} onClick={c?.discFn} aria-expanded={c?.discOpen} aria-label={c?.discAria} style={{ display: c?.discDisplay, alignItems: "center", gap: "9px", margin: "-4px -8px", padding: "4px 8px", border: "0", borderRadius: "8px", background: "transparent", color: c?.fg, font: "inherit", fontWeight: "600", cursor: "pointer", textAlign: "left", whiteSpace: "nowrap" }}>
                                          <span aria-hidden="true" style={{ display: "inline-flex", width: "24px", height: "24px", borderRadius: "7px", background: c?.triBg, color: c?.triFg, alignItems: "center", justifyContent: "center", flexShrink: "0", animation: c?.triAnim }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01" />
                                            </svg>
                                          </span>
                                          <span style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                                            <span>{c?.t}</span>
                                            <span style={{ fontSize: "11.5px", fontWeight: "500", color: c?.triFg }}>{c?.discHint}</span>
                                          </span>
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#5A6675", flexShrink: "0", transition: "transform .2s", transform: c?.discRot }}>
                                            <path d="m6 9 6 6 6-6" />
                                          </svg>
                                        </Sx>
                                        <span style={{ display: c?.textDisplay, flexDirection: "column", gap: "2px" }}>
                                          <span style={{ color: c?.fg, fontWeight: c?.weight, fontVariantNumeric: "tabular-nums" }}>{c?.t}</span>
                                          <span style={{ display: c?.subDisplay, fontSize: "12px", color: "#5A6675" }}>{c?.sub}</span>
                                        </span>
                                        <span style={{ display: c?.pillDisplay, alignItems: "center", gap: "5px", height: "24px", padding: "0 9px 0 7px", borderRadius: "999px", background: c?.pillBg, color: c?.fg, fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                                          <span aria-hidden="true" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "currentColor" }} />
                                          <span>{c?.t}</span>
                                        </span>
                                        <Sx as="button" hover={{ filter: "brightness(.98)" }} onClick={c?.actFn} disabled={c?.actDisabled} aria-label={c?.actAria} style={{ display: c?.actDisplay, alignItems: "center", gap: "6px", height: "30px", padding: "0 12px", borderRadius: "8px", border: `1px solid ${c?.actBorder}`, background: c?.actBg, color: c?.actFg, fontSize: "12.5px", fontWeight: "600", cursor: c?.actCursor, whiteSpace: "nowrap" }}>
                                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: c?.actIconDisplay }}>
                                            <path d="M20 6 9 17l-5-5" />
                                          </svg>
                                          <span>{c?.actLabel}</span>
                                        </Sx>
                                      </td>
                                    </React.Fragment>
                                  ))}
                                </Sx>
                                <tr style={{ display: row?.xDisplay, background: row?.xBg, boxShadow: `inset 3px 0 0 ${row?.railBg}` }}>
                                  <td colSpan={row?.span} style={{ padding: "0 16px 16px 16px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "14px 20px", alignItems: "start", padding: "14px 16px", borderRadius: "12px", background: "#FFFFFF", border: `1px solid ${row?.xBorder}`, animation: "fadeIn .25s ease" }}>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                                        <span style={{ fontSize: "13.5px", fontWeight: "600", color: row?.xFg }}>{row?.xTitle}</span>
                                        <span style={{ fontSize: "12.5px", color: "#5A6675", lineHeight: "1.5" }}>{row?.xSub}</span>
                                      </div>
                                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                        <Sx as="button" hover={{ filter: "brightness(1.05)" }} onClick={row?.xRestart} disabled={row?.xRestartDisabled} style={{ display: "inline-flex", alignItems: "center", gap: "7px", height: "36px", padding: "0 14px", border: "0", borderRadius: "9px", background: "linear-gradient(180deg,#1a86f0,#0070E0)", color: "#FFFFFF", fontSize: "13px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 10px -6px rgba(0,112,224,.6)" }}>
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
                                          </svg>
                                          <span>{row?.xRestartLabel}</span>
                                        </Sx>
                                        <Sx as="button" hover={{ background: "#F6F9FE", borderColor: "#0070E0" }} onClick={row?.xOpen} style={{ display: "inline-flex", alignItems: "center", gap: "7px", height: "36px", padding: "0 14px", border: "1px solid #C9D6E8", borderRadius: "9px", background: "#FFFFFF", color: "#005BB8", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                                          <span>{row?.xOpenLabel}</span>
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                          </svg>
                                        </Sx>
                                      </div>
                                      <div role="log" aria-label="Recent crash log entries" style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px", padding: "12px 14px", borderRadius: "10px", background: "#10233F", fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace", fontSize: "12px", lineHeight: "1.5", overflowX: "auto" }}>
                                        {(row?.xLines ?? []).map((l, $index) => (
                                          <React.Fragment key={$index}>
                                            <div style={{ display: "flex", gap: "12px", whiteSpace: "nowrap" }}>
                                              <span style={{ color: "#8FA3BF", flexShrink: "0", fontVariantNumeric: "tabular-nums" }}>{l?.t}</span>
                                              <span style={{ color: l?.fg, fontWeight: "600", width: "46px", flexShrink: "0" }}>{l?.lvl}</span>
                                              <span style={{ color: "#E6EEF8" }}>{l?.msg}</span>
                                            </div>
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ display: g?.emptyDisplay, flexDirection: "column", alignItems: "center" }}>{g?.emptyEl}</div>
                      </div>
                    </>
                  ) : null}
                  {(g?.isActions) ? (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "10px", padding: "14px 16px 16px" }}>
                        {(g?.items ?? []).map((b, $index) => (
                          <React.Fragment key={$index}>
                            <Sx as="button" hover={{ borderColor: b?.hoverBorder, background: b?.hoverBg, boxShadow: "0 6px 16px -10px rgba(16,42,84,.35)", transform: "translateY(-1px)" }} active={{ transform: "translateY(0)", boxShadow: "none" }} onClick={b?.run} disabled={b?.disabled} aria-label={b?.aria} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 12px 12px 12px", borderRadius: "12px", borderWidth: "1px", borderStyle: "solid", borderColor: b?.border, background: b?.bg, boxShadow: b?.shadow, textAlign: "left", cursor: b?.cursor, transition: "border-color .15s,background-color .15s,box-shadow .15s,transform .15s" }}>
                              <span aria-hidden="true" style={{ width: "36px", height: "36px", borderRadius: "10px", background: b?.tileBg, color: b?.tileFg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: b?.anim }}>
                                  <path d={b?.icon} />
                                </svg>
                              </span>
                              <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "3px", minWidth: "0", lineHeight: "1.35" }}>
                                <span style={{ fontSize: "13.5px", fontWeight: "600", color: b?.fg }}>{b?.label}</span>
                                <span style={{ fontSize: "12px", color: b?.subFg }}>{b?.sub}</span>
                              </span>
                              <span aria-hidden="true" style={{ display: b?.ctaDisplay, alignItems: "center", gap: "4px", height: "30px", padding: "0 10px", borderRadius: "8px", background: b?.ctaBg, color: b?.ctaFg, fontSize: "12.5px", fontWeight: "600", whiteSpace: "nowrap", flexShrink: "0" }}>
                                <span>{b?.cta}</span>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                              </span>
                            </Sx>
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {(g?.isLogs) ? (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px 16px 16px" }}>
                        <div role="radiogroup" aria-label="Log source" style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "10px", background: "#F5F7FA", boxShadow: "inset 0 0 0 1px #E4E9F0", alignSelf: "flex-start", flexWrap: "wrap" }}>
                          {(g?.tabs ?? []).map((lt, $index) => (
                            <React.Fragment key={$index}>
                              <button role="radio" aria-checked={lt?.sel} onClick={lt?.pick} style={{ height: "34px", padding: "0 14px", border: "0", borderRadius: "8px", background: lt?.bg, boxShadow: lt?.shadow, color: lt?.fg, fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "background-color .15s" }}>{lt?.label}</button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div role="log" aria-label={g?.logAria} style={{ maxHeight: "300px", overflow: "auto", borderRadius: "12px", background: "#0C1B2E", padding: "12px 14px", fontFamily: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace", fontSize: "12.5px", lineHeight: "1.7" }}>
                          {(g?.lines ?? []).map((ln, $index) => (
                            <React.Fragment key={$index}>
                              <div style={{ display: "grid", gridTemplateColumns: "auto 56px minmax(0,1fr)", gap: "12px", whiteSpace: "pre-wrap" }}>
                                <span style={{ color: "#8FA3BF" }}>{ln?.t}</span>
                                <span style={{ color: ln?.fg, fontWeight: "600" }}>{ln?.lvl}</span>
                                <span style={{ color: "#E6ECF3", overflowWrap: "anywhere" }}>{ln?.msg}</span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </section>
              </React.Fragment>
            ))}
          </div>
        </div>
      </>
    ) : null)
  );
}
