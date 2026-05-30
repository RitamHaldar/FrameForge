# FrameForge Frontend 🎨

The FrameForge Frontend is a high-fidelity client SPA designed with premium obsidian aesthetics, glassmorphic layouts, and high-performance spring-physics scroll animations. It functions as the central cockpit where developers edit files in Monaco Editor, interact with real-time terminals, and view active sandboxes.

---

## 💻 Tech Stack & Key Libraries

- **React 19 & Vite 8**: Extremely fast development compiling and lightweight production builds.
- **Redux Toolkit (`@reduxjs/toolkit` / `react-redux`)**: Global state management orchestrating sandboxes, file trees, file loads, and terminal connections.
- **Framer Motion 12**: Spring-physics animation framework. Orchestrates staggered elements, 3D scroll tilts, and glass card slide-ins.
- **Lenis 1.3**: Advanced scroll smoothing that makes all page transitions and scroll-linked animations incredibly fluid.
- **Monaco Editor (`@monaco-editor/react`)**: Incorporates the full VS Code engine directly in the browser with custom autocomplete socket connections.
- **Xterm.js**: Renders robust interactive developer terminals communicating seamlessly with sandboxed Docker containers.
- **Lucide Icons**: Modern vector icon set mapping out controls across files and sidebar layers.

---

## 📂 Codebase Structure

```bash
├── logo/                   # Brand visual elements (Logo, Mockups)
├── src/
│   ├── app/                # Root App configurations
│   │   ├── store/          # Redux toolkit store definitions
│   │   │   └── store.js    # Global Redux store configuration
│   │   ├── App.css         # Styling system theme values & animations
│   │   └── App.jsx         # Router path declarations & route definitions
│   ├── features/           # Core feature modules
│   │   ├── Auth/           # User Authentication module
│   │   │   ├── components/ # Login/Register form UI components, background, and social logins
│   │   │   └── pages/      # Route entrypoints (AuthPage.jsx)
│   │   └── Home/           # Home/Dashboard workspace module
│   │       ├── components/ # Core dashboard UI components (Sidebar, CenterZone, Terminals)
│   │       ├── Hooks/      # Custom React hooks managing states and sockets (useHome)
│   │       ├── pages/      # Route entrypoints (LandingPage, DashboardPage)
│   │       ├── service/    # Axios and Fetch client communication layers (api.js)
│   │       └── slices/     # Redux Toolkit state slices
│   └── main.jsx            # Index launcher injecting Redux providers & React render root
└── vite.config.js          # Vite configurations (CORS, Socket Proxy mappings)
```

---

## 🛠️ Design System & Styling

FrameForge uses a tailwind-extended obsidian theme declared inside [App.css](file:///c:/Users/RH/Desktop/FrameForge/frontend/src/app/App.css):
- ** obsidian Palette**: Deep slate backgrounds (`#131313`, `#0e0e0e`) offset by vibrant borders (`rgba(255,255,255,0.08)`).
- **Interactive glows**: Background tracking orbs that shift position elegantly based on mouse movements.
- **Glassmorphism**: Backdrop blur overlays (`glass-panel`) mixed with volumetric lighting effects.
- **Typography**: Hanken Grotesk for gorgeous high-tech headings and JetBrains Mono for accurate telemetry listings.

---

## 🚀 Running Locally

Follow these instructions to run the frontend independently in development mode:

### 1. Install dependencies
Make sure you are in the `/frontend` directory:
```bash
cd frontend
npm install
```

### 2. Launch Developer Mode
```bash
npm run dev
```
The server launches on `http://localhost:5173`. 

*Note: For full connectivity, ensure the backend services (`skaffold dev`) are active so that socket requests and sandbox requests resolve properly.*
