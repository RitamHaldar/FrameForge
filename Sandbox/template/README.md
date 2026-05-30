# FrameForge Sandbox Boilerplate Canvas 🧪🎨

This is the specialized boilerplate application loaded dynamically inside every isolated FrameForge development sandbox container. It serves as the live canvas for real-time AI-orchestrated code synthesis, edits, and immediate developer browser previews.

---

## 💻 Custom Tech Stack

- **Core Library**: React 19 (`react` & `react-dom` ^19.2.6)
- **Bundler & Dev Server**: Vite 8 (`vite` ^8.0.12)
- **Styling**: Tailwind CSS v4 (`tailwindcss` & `@tailwindcss/vite` ^4.3.0) for zero-config compilation and premium aesthetic controls.

---

## ⚡ Real-time Synchronization Design

To support instantaneous hot module replacement (HMR) across container boundaries inside Kubernetes pods, the Vite configuration ([vite.config.js](file:///c:/Users/RH/Desktop/FrameForge/Sandbox/template/vite.config.js)) has been optimized with aggressive file-system watching parameters:

- **Aggressive Watch Polling**: Polling is enabled (`usePolling: true`) with a check interval of `1000ms`.
- **HMR Stability Threshold**: Dev watch parameters are tuned with `stabilityThreshold: 500ms` and `pollInterval: 100ms` to guarantee that JIT edits written by the sandbox agent are immediately compiled and rendered on the user's browser preview without file write delay.
- **Allowed Hosts Wildcard**: Configured with `allowedHosts: true` to support dynamic subdomains routed through the router gateway (e.g. `*.preview.localhost`).

---

## 📁 Workspace Blueprint

```bash
├── src/
│   ├── assets/           # Dynamic assets & illustrations
│   ├── App.jsx           # Canvas entry interface where AI renders synthesized components
│   ├── index.css         # Tailwind v4 directives & custom styling utilities
│   └── main.jsx          # React app mounting script
├── index.html            # Core HTML entrypoint
├── package.json          # Dependency mappings (React 19, Vite 8, Tailwind 4)
└── vite.config.js        # Polling and hot-reload Dev server configs
```
