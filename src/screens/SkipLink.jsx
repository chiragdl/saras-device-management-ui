import React from 'react';
import Sx from '../components/Sx.jsx';

export default function SkipLink(v) {
  return (
    <Sx as="a" focus={{ left: "16px" }} href="#main" style={{ position: "fixed", left: "-9999px", top: "8px", zIndex: "100", background: "#FFFFFF", color: "#005BB8", padding: "10px 14px", borderRadius: "10px", fontWeight: "600" }}>Skip to main content</Sx>
  );
}
