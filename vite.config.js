import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// The portal frontend is a separate site. In development the API runs on http://127.0.0.1:5080 and Vite forwards
// /api and /health to it, so the browser sees one origin. In production config.json names the API address.
const api = {
  '/api': { target: 'http://127.0.0.1:5080', changeOrigin: false },
  '/health': { target: 'http://127.0.0.1:5080', changeOrigin: false }
};

// "npm run preview" serves the built app with the same security headers as public/web.config (IIS / Azure).
const headers = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
};

/**
 * The API address of a build (25 Nov 2026), configurable: VITE_API_BASE_URL from .env.production (or the environment,
 * e.g. `VITE_API_BASE_URL=https://other/SarasDevicePortal npm run build`). When set, the build writes it into
 * dist/config.json and allows its origin in the Content-Security-Policy (connect-src) of dist/web.config (IIS) and
 * dist/staticwebapp.config.json (Azure Static Web Apps), or the browser would block the calls. Empty: config.json keeps
 * "" (the API on the same address as the site). After deploying, config.json can still be edited on the site itself.
 */
function apiAddress(url) {
  return {
    name: 'portal-api-address',
    apply: 'build',
    closeBundle() {
      const out = path.resolve('dist');
      if (!url) {
        console.log('\n  API address: same address as the site (VITE_API_BASE_URL not set)');
        return;
      }
      let origin;
      try {
        const u = new URL(url);
        if (!/^https?:$/.test(u.protocol)) throw new Error('not http(s)');
        origin = u.origin;
      } catch {
        throw new Error(`VITE_API_BASE_URL is not an http(s) address: "${url}"`);
      }
      const base = url.replace(/\/+$/, '');
      fs.writeFileSync(path.join(out, 'config.json'), JSON.stringify({ apiBaseUrl: base }, null, 2) + '\n');
      const allow = text => text.replace(/connect-src 'self'(?![^;"]*\b) ?/, `connect-src 'self' ${origin} `).replace(`connect-src 'self' ${origin} ;`, `connect-src 'self' ${origin};`);
      for (const f of ['web.config', 'staticwebapp.config.json']) {
        const p = path.join(out, f);
        if (!fs.existsSync(p)) continue;
        const text = fs.readFileSync(p, 'utf8');
        if (!text.includes(`connect-src 'self' ${origin}`)) fs.writeFileSync(p, allow(text));
      }
      console.log(`\n  API address: ${base} (dist/config.json; ${origin} allowed in connect-src)`);
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve('.'), 'VITE_');   // .env.production, and VITE_ variables of the environment
  return {
    plugins: [react(), apiAddress((env.VITE_API_BASE_URL || '').trim())],
    server: { host: '127.0.0.1', port: 5173, proxy: api },
    preview: { host: '127.0.0.1', port: 4173, proxy: api, headers },
    build: { sourcemap: false }
  };
});
