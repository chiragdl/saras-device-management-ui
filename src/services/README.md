# Services

`portalApi.js` is the client for the portal API (`/api/v1`, the separate `../backend` codebase).

* `loadConfig()` reads `public/config.json` once at start-up; `apiBaseUrl` empty = same address as the page.
* Requests send the session cookie (`credentials: 'include'`); the API sets it HttpOnly, so no token is ever in JavaScript.
* Every change (POST, PUT, PATCH, DELETE) carries `X-Portal-Request: 1`; the API refuses changes without it.
* Errors come back as `ApiError` with the HTTP status (`0` = the server could not be reached) and the API's message.
* Patch files are sent in chunks (`putPatchChunk`): the raw bytes as `application/octet-stream`, with the same cookie and header, and an `AbortSignal` to stop the upload (an aborted request throws an `ApiError` with `aborted` set).

`src/app/AppLogic.jsx` calls it: `refreshData()` every minute for the fleet, `loadDevice()` for an open device page.
