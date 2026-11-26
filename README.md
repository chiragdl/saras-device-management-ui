# SARAS Device Management — web frontend

## For the UI/UX team

This is the source of the portal's website only (React 18 + Vite, no UI library: the styles are in the components and
`src/styles/`). Where to look:

| What | Where |
|---|---|
| Sign-in screen | `src/screens/LoginScreen.jsx` |
| Header, footer, toasts, outage banner | `src/screens/AppHeader.jsx`, `AppFooter.jsx`, `Toast.jsx`, `OutageBanner.jsx` |
| Fleet overview (dashboard) | `src/screens/Dashboard.jsx`, `FleetBar.jsx`, `AlertsDrawer.jsx` |
| Device page | `src/screens/DeviceDetail.jsx`, `PatchList.jsx`, `PatchDialog.jsx`, `BoxKeyDialog.jsx` |
| Settings (devices, parameters, alerts, e-mail, users, agents, audit log) | `src/screens/SettingsPage.jsx`, `RegisterDrawer.jsx`, `PasswordDialog.jsx` |
| Colours, fonts, global styles | `src/styles/global.css`; the screens set their colours inline (`SettingsPage.jsx` has a `C` colour table) |
| Images, logo, animations | `public/assets/` |
| Behaviour and texts shown on the screens | `src/app/AppLogic.jsx` (keep logic changes out of the screens) |

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run lint       # before a pull request
```

The screens show live data from the portal API, which is not in this repository: without it you see the sign-in
screen only. To see the other screens, ask the development team for an API address and a test account, and put the
address in `target` of the `api` table at the top of `vite.config.js` (do not commit it). Keep the existing texts,
roles and behaviour; propose layout and visual changes in pull requests.

React 18 + Vite app built from the Claude Design "SARAS Device Management". It shows live data from the portal API
(`../backend`, a separate codebase): the fleet, each box's health, alerts, and a day-by-day summary that shows which
readings arrived on time and which were recorded while a box was offline and uploaded later.

## Run locally

```bash
npm install
npm run dev        # http://127.0.0.1:5173 — needs the API on http://127.0.0.1:5080 (../backend/local/run-api.sh)
```

The dev server forwards `/api` and `/health` to the API, so the browser sees one address. Sign in with a portal user
(the first admin's password is printed once by the API, in `../backend/local/api.log`).

```bash
npm run lint
npm run build      # dist/
npm run preview    # serves dist/ on http://127.0.0.1:4173 with the production security headers
```

## Screens and where their data comes from

| Screen | API |
|---|---|
| Sign-in, session, change password | `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`, `POST /auth/change-password` |
| Fleet overview: status tiles, active alerts, last 30 days per box, device types, device cards/table, search, filters, Excel export | `GET /fleet/summary`, `/fleet/devices`, `/fleet/daily`, `/alerts`, `/notifications` (refreshed every minute) |
| Device page: overview, **daily summary** (calendar + 24-hour timeline), hardware with history chart, storage, services, software, synchronization (incl. offline periods recovered), AI workload, alerts, diagnostics | `GET /devices/{key}`, `/daily`, `/timeline`, `/history`, `/reading/latest` (support and admin) |
| Acknowledge an alert (support, admin) | `POST /alerts/{id}/ack` |
| Stop / start watching a service on a box (admin) | `PUT /devices/{key}/service-watch` |
| Register a box (admin): shows the one-time box key and the install command | `POST /devices` |

Thresholds (warning / critical), offline times and the reading interval shown on the screens come from the API, so an
admin's change applies everywhere. Remote actions that need a command channel to the box (OTA updates, restarting a
service, collecting logs) and camera monitoring are marked "coming later".

## Code layout

```
src/
  main.jsx                 reads public/config.json, then renders
  app/AppLogic.jsx         all state and behaviour: session, data loading/polling, every screen's values
  views/AppView.jsx        composes the screens
  screens/*.jsx            presentational screens (design markup); BoxKeyDialog and PasswordDialog are new
  components/              Sx (hover/focus styles), DailySummary (device days), FleetDaily (fleet grid)
  services/portalApi.js    the API client (cookie session, X-Portal-Request header on changes)
  data/mockData.js         live lists filled from the API (name kept from the design) and formatters
public/
  config.json              { "apiBaseUrl": "" } — empty means "same address as this site"
  web.config               IIS / Azure: route fallback, security headers (CSP), caching
```

## Build for hosting

```bash
./deploy/package.sh
#   dist/                                       → IIS: copy into the site folder
#   out/saras-device-portal-web-<version>.zip   → Azure App Service: zip deploy
```

* IIS needs the **URL Rewrite** module (installed on Azure App Service).
* If the API has its own host name, set `apiBaseUrl` in `config.json` (for example `https://api.devices.example.com`),
  add that address to `connect-src` in `web.config`, and add this site's address to the API's `Cors__AllowedOrigins`.
  Keep both on the same site (see the API README, "Frontend and API on the same site").
* Fonts and images are bundled; the app loads nothing from other sites.
