# FrameForge Frontend 🎨

The FrameForge Frontend is a high-fidelity client SPA designed with premium obsidian aesthetics, glassmorphic layouts, and high-performance spring-physics scroll animations. It functions as the central cockpit where developers edit files in Monaco Editor, interact with real-time terminals, and view active sandboxes.

---

## 💻 Tech Stack & Key Libraries

- **React 19 & Vite 8**: Extremely fast development compiling and lightweight production builds.
- **Redux Toolkit (`@reduxjs/toolkit` / `react-redux`)**: Global state management orchestrating authentication, sandboxes, file trees, file loads, and terminal connections.
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
│   │   │   └── store.js    # Global Redux store configuration (toast & auth reducers)
│   │   ├── App.css         # Styling system theme values & animations (Tailwind v4)
│   │   └── App.jsx         # Router path declarations (/, /auth, /verify-otp, /dashboard)
│   ├── features/           # Core feature modules
│   │   ├── Auth/           # User Authentication module
│   │   │   ├── components/ # Login/Register forms with two-way state binding & colored Google logo
│   │   │   ├── hooks/      # useAuth custom hook for register, login, OTP verify, and session restore
│   │   │   ├── pages/      # Route entrypoints (AuthPage.jsx & VerifyOtpPage.jsx)
│   │   │   ├── services/   # Axios API client (auth.api.js) mapping back to /api/auth/*
│   │   │   └── auth.slice  # Redux Toolkit state slice (managing user, loading, and error states)
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
- **Obsidian Palette**: Deep slate backgrounds (`#131313`, `#0e0e0e`) offset by vibrant borders (`rgba(255,255,255,0.08)`).
- **Interactive glows**: Background tracking orbs that shift position elegantly based on mouse movements.
- **Glassmorphism**: Backdrop blur overlays (`glass-panel`) mixed with volumetric lighting effects.
- **Typography**: Hanken Grotesk for gorgeous high-tech headings, Inter for standard forms/labels, and JetBrains Mono for accurate telemetry listings.

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

*Note: For full connectivity, ensure the backend services (`skaffold dev`) are active so that socket requests, database connections, RabbitMQ alerts, and sandbox requests resolve properly.*

---

## 🔒 Security & Verification Workflow
- Both **Login** and **Register** forms use standard React `useState` **two-way data binding** to handle inputs responsively.
- The `useAuth` hook integrates React Router's `useNavigate` to automatically direct unverified sign-ins and new registrations to `/verify-otp`.
- The **Verify OTP Screen** features smooth entrance animations, focus-management (auto-tabbing between 6 fields), full paste detection, validation handling, and loads users to their workspace `/dashboard` automatically on success.

## 🎛️ Workspace Menu Sidebar
- Replaces the static `READY` status text in `AgentWorkspace.jsx` top bar with a premium `Menu` toggle button.
- Slides a high-fidelity glassmorphic drawer from the right containing the user's name, avatar image, and session controls.
- Fetches all user projects from database and showcases them in an active switcher list; selecting any card dynamically restarts the active sandbox environment (`initWorkspace(projectId, true)`).
- Fixes Google accounts cross-origin avatar load failures by adding `referrerPolicy="no-referrer"` to the `<img />` tags, coupled with fallback listeners for image failures (`imageError`).

## 📖 Animated Documentation Hub (`/docs`)
- A beautiful, searchable, and responsive page detailing platform features, core cloud architecture, container pods, and backend REST APIs.
- Features smooth scrolling using **Lenis** and fluid entrance/active-indicator animations using **Framer Motion**.
- Fully accessible from the Landing Page navbar and hero CTA button.

