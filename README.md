# SKYHOP

A modular browser flight playground built with Vite, strict TypeScript, Three.js, HTML/CSS and Lucide. No backend, database, React, or remote models.

## Develop

Use Node.js 24 LTS and npm. `.node-version` pins the major version.

```sh
npm ci
npm run dev
```

Open the address printed by Vite. Start with **Let's fly**. W/S or ↑/↓ changes pitch; A/D or ←/→ turns; Shift/Ctrl adjusts throttle; Esc pauses. Keyboard controls currently require a desktop keyboard.

```sh
npm run typecheck
npm test
npm run build
npm run preview
npx playwright install chromium
npm run test:smoke
```

For a preinstalled Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Browser tests build and serve the production app themselves. In the managed cloud environment use `npm ci --cache /workspace/.npm` if the home cache is unavailable. No credentials or environment variables are required by the app.

## Modules

| Directory | Responsibility |
| --- | --- |
| `src/core` | Game composition, bounded animation loop, menu/flight/pause state |
| `src/world` | Spherical planet, deterministic low-poly terrain, clouds, airport |
| `src/aircraft` | Procedural visual, local GLB loader, physics-to-visual adapter |
| `src/physics` | Flight state and simulation; no renderer, DOM, camera or input listeners |
| `src/camera` | Smoothed follow camera |
| `src/input` | Keyboard events mapped to plain flight input |
| `src/ui` | HTML menu, live HUD and Lucide icons |
| `src/config` | Typed aircraft parameters and planet radius |

`Game` owns scene composition and disposal. `InputManager.read()` provides a plain input value; `FlightPhysics.step()` updates position and orientation; `FlightController` copies these into the aircraft; `FollowCamera` and `FlightHUD` read the simulation. These modules can evolve independently.

World coordinates use +Y up at the starting airport. Aircraft local axes are +Y up, +X right, -Z forward. Around the spherical planet, local up follows the outward radial direction. The simplified arcade simulation transports aircraft orientation along the sphere, bounds frame time and prevents entry below the surface. It is a foundation, not an aerodynamic model; landing, collisions with scenery and full roll dynamics are future work.

## Local GLB models

Place a model in `public/models/` and set `scout.modelPath` to `/models/your-aircraft.glb` in `src/config/aircraft.ts`. Export it centered at the origin, in meter-scale units, with +Y up and its nose facing -Z. `AircraftLoader` uses Three.js `GLTFLoader` and accepts only local `/models/*.glb` paths. Package textures with the GLB; no CDN assets are needed. Failed loading keeps the procedural aircraft. No GLB is bundled in this stage.

## Checks

Vitest tests cover spherical movement, local forward orientation, pitch, surface clearance, throttle, frame limits, state transitions and model path restrictions. Playwright checks production WebGL startup, starting flight, live HUD, pause/resume, viewport resize and browser errors. The cloud runtime can use system Chromium with SwiftShader for software WebGL.

## Cloudflare Pages

Connect this repository to Pages and select:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: `24`

`wrangler.jsonc` declares the Pages output directory for CLI workflows. This is a static site; no bindings, functions or secrets are required. Deployment is not performed by this scaffold.
