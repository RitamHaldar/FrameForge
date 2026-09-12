# FrameForge Frontend 🎨

The FrameForge Frontend is a high-fidelity client Single Page Application (SPA) designed with a **Technical Obsidian & Cyan** cyberpunk aesthetic, ultra-responsive glassmorphic layouts, and 60/120 FPS spring-physics animations. It serves as the primary developer cockpit for orchestrating AI code generation, editing files with Monaco Editor, inspecting live sandbox container runtimes, and executing terminal commands.

---

## 💻 Tech Stack & Key Technologies

- **React 19 & Vite 8**: Bleeding-edge React 19 concurrent architecture combined with Vite 8 for sub-second hot module replacement (HMR) and lightweight production bundles.
- **Tailwind CSS v4**: Next-generation utility-first engine with `@tailwindcss/vite` and dynamic CSS design tokens.
- **Redux Toolkit (`@reduxjs/toolkit` / `react-redux`)**: Centralized state orchestration managing authentication, sandboxes, active file trees, Monaco editor buffers, terminal sockets, and system toasts.
- **Framer Motion 12**: Spring-physics animation engine orchestrating layout transitions (`layoutId`), staggered list reveals, popLayout toast queues, and gesture micro-interactions.
- **GSAP 3 & ScrollTrigger**: High-performance scrolling timelines and scrubbed layout pin sequences.
- **Lenis 1.3**: Inertial smooth scrolling engine synchronized with the GSAP ticker for stutter-free page movement.
- **Three.js**: Declarative WebGL particle visualizer and ambient geometric grid renderers.
- **Monaco Editor (`@monaco-editor/react` & `monacopilot`)**: The full VS Code core running in-browser with AI autocomplete and code optimization shortcuts.
- **Xterm.js (`xterm` & `xterm-addon-fit`)**: Interactive virtual terminal communicating over WebSockets with isolated Kubernetes Docker pods.
- **Lucide Icons**: Clean, pixel-perfect icon set tailored to technical IDE layouts.

---

## 🎨 Design System: Technical Obsidian & Cyan

FrameForge implements a bespoke theme configured in [`src/app/App.css`](file:///c:/Users/RH/Desktop/FrameForge/frontend/src/app/App.css):

```css
/* Technical Obsidian & Cyan Theme Tokens */
--color-obsidian: #08090A;
--color-obsidian-50: #15171B;
--color-obsidian-100: #111418;
--color-obsidian-200: #0D0F11;
--color-obsidian-border: rgba(255, 255, 255, 0.07);
--color-obsidian-borderHigh: rgba(255, 255, 255, 0.14);
--color-cyanAccent: #00F0FF;
--color-cyanAccent-dim: rgba(0, 240, 255, 0.15);
--color-cyanAccent-glow: rgba(0, 240, 255, 0.35);
--color-textPrimary: #F5F5F5;
--color-textSecondary: #969BA3;
--color-textMuted: #5D636C;
```

### Aesthetic Pillars
- **Layered Glassmorphism**: Deep obsidian panels (`#08090D` to `#0E1118`) paired with hairline glass borders (`border-white/[0.08]`) and multi-layer backdrop blurs (`backdrop-blur-2xl`).
- **Ambient Neon Auras**: Volumetric radial glows in cyan (`rgba(0, 240, 255, 0.06)`) and electric violet (`rgba(168, 85, 247, 0.05)`), complemented by razor-sharp top gradient accent lines.
- **Micro-Detailing & Haptic Feedback**: Every interactive component features responsive hover shifts, active spring presses (`whileTap={{ scale: 0.98 }}`), and rotational cues.
- **Typography Hierarchy**:
  - **Headings & Brand**: *Hanken Grotesk* for sleek, modern display typography.
  - **Body & Controls**: *Inter* for legible UI and label rendering.
  - **Code & Telemetry**: *JetBrains Mono* for system logs, terminal streams, and file tree listings.

---

## 📂 Codebase Architecture

```bash
frontend/
├── public/                     # Static assets (favicons, platform icons)
├── src/
│   ├── app/                    # Root configuration & routing
│   │   ├── store/              # Redux Toolkit store definitions
│   │   │   └── store.js        # Configured reducers (auth, toast, home)
│   │   ├── app.routes.jsx      # React Router 7 route definitions
│   │   ├── App.css             # Theme tokens, fonts, and custom utilities
│   │   └── App.jsx             # Root layout & authentication hydration
│   ├── features/               # Domain-driven feature modules
│   │   ├── Auth/               # User Authentication & verification
│   │   │   ├── components/     # Sign In, Sign Up, and OTP input fields
│   │   │   ├── hooks/          # useAuth hook (login, register, verify, logout)
│   │   │   ├── pages/          # AuthPage & VerifyOtpPage views
│   │   │   ├── services/       # Axios client mapping to /api/auth/*
│   │   │   └── auth.slice.js   # User session and token state management
│   │   └── Home/               # Primary workspace & platform pages
│   │       ├── components/     # Core dashboard & UI components
│   │       │   ├── AgentWorkspace.jsx   # AI chat, multi-engine selector & tool cards
│   │       │   ├── Sidebar.jsx          # File explorer with tree navigation
│   │       │   ├── CenterZone.jsx       # Split Monaco editor & live sandbox preview
│   │       │   ├── MenuSidebar.jsx      # Slide-out workspace drawer & switcher
│   │       │   ├── Toast.jsx            # Pause-on-hover notifications
│   │       │   ├── Logos.jsx            # SVG filetype & technology brand logos
│   │       │   └── CyberGridBackground  # WebGL 3D particle constellation canvas
│   │       ├── Hooks/          # Custom hooks (useHome for sandbox, files & sockets)
│   │       ├── pages/          # Top-level route pages
│   │       │   ├── LandingPage.jsx      # Product landing page with 3D canvas
│   │       │   ├── DashboardPage.jsx    # IDE cockpit (Sidebar + CenterZone + Agent)
│   │       │   ├── ProjectsPage.jsx     # Workspace management & project launch
│   │       │   ├── SolutionsPage.jsx    # Enterprise architecture & pipeline tracker
│   │       │   └── DocsPage.jsx         # Searchable technical documentation
│   │       ├── service/        # API communication (sandboxes, files, AI agents)
│   │       └── slices/         # Slices (toastSlice)
│   └── main.jsx                # Application bootstrap & React 19 root mount
├── package.json
└── vite.config.js              # Vite configuration & proxy settings
```

---

## 🌟 Major Features & Recent Enhancements

### 1. Modernized File Explorer (`Sidebar.jsx`)
- **Gliding Active File Indicator**: Implemented Framer Motion's `layoutId="activeFileIndicator"`, smoothly gliding a neon cyan accent rail across files when switching active tabs.
- **Real-Time Search & Character Highlighting**: Instant filter input with inline `HighlightedText` highlighting query matches. Matching folders automatically expand.
- **Dynamic File Icon Previews**: During file creation, typing extensions (e.g. `Navbar.jsx`, `styles.css`, `schema.json`) dynamically switches the live SVG icon preview in the input field.
- **Click-Outside Auto-Dismiss**: Creation inputs automatically cancel and close when clicking anywhere outside or blurring the browser window.
- **Folder Expansion & Collapse All**: Integrated a global `ChevronsDownUp` control allowing developers to expand or collapse the entire workspace directory tree with one click.
- **Hover Quick Actions**: Contextual shortcuts reveal inline buttons to add files (`FilePlus`), add subfolders (`FolderPlus`), or trigger file/folder deletion.
- **Animated Delete Modal**: Cyberpunk confirmation dialog with a crimson warning aura, item name badge, and spring transitions.
- **Live Status Footer**: Features an animated pulsing emerald sync beacon (`animate-ping`) and active file path snippet.

### 2. Multi-Engine AI Workspace (`AgentWorkspace.jsx`)
- **Engine Tier Selector**: Seamless model switching with fluid crossfades and spring hover animations:
  - **Fast (Mistral)**: Powered by `codestral-latest` for rapid, code-optimized responses without rate-limit bottlenecks.
  - **Medium (Groq)**: Powered by `qwen/qwen3.8-27b` delivering ~600 tokens/sec ultra-fast throughput.
  - **Pro (DeepSeek)**: Powered by NVIDIA NIM `deepseek-ai/deepseek-v4-flash-0731` with disabled chain-of-thought (`enable_thinking: false`) to achieve 0.5s latency.
- **Custom SSE Event Cards**: Visual representation of LangChain tool calls (`createFile`, `deleteFile`, `writeCodeToFile`, `runShellCommand`) streaming live in real time.
- **Code Optimization Shortcuts**: Direct button to trigger `/optimize-code` for the active Monaco buffer.

### 3. Glassmorphic Hub Drawer (`MenuSidebar.jsx`)
- **Slide-Out Control Panel**: Glassmorphic drawer (`#090B10/95`) with smooth spring physics (`stiffness: 260, damping: 28`).
- **Active Session Card**: Live user avatar with cross-origin fallback handling (`referrerPolicy="no-referrer"`), active session orb, and 1-click logout.
- **Instant Workspace Switcher**: Searchable workspace list with 1-click ID copy to clipboard, relative creation timestamps, and live project switching (`initWorkspace`).

### 4. Interactive PopLayout Notifications (`Toast.jsx`)
- **Framer Motion `popLayout`**: When a toast dismisses, remaining notifications glide up smoothly using spring physics.
- **Pause-on-Hover Countdown**: Hardware-accelerated progress rail pauses countdown whenever the user hovers to read details, resuming seamlessly on mouse leave.
- **1-Click Copy**: Built-in copy button with checkmark confirmation for error traces or terminal paths.
- **Category Styling**: Distinct visual treatments for `success` (emerald), `error` (rose), `warning` (amber), and `info` (cyan).

### 5. Floating Landing Navigation (`LandingPage.jsx`)
- **Streamlined Top Bar**: Floating pill navigation bar with active tab sliding pill indicators and quick actions.
- **Interactive Visuals**: Real-time cursor-tracking spotlight, WebGL particle grid, and interactive terminal simulation.

---

## 📊 Client Build & Performance Metrics

Built using Vite 8 with Tailwind CSS v4 and React 19:

- **Modules Transformed**: **`2,289 modules`**
- **Build Execution Time**: **`~650ms – 1.1s`**
- **Production Asset Distribution**:
  - `dist/index.html`: **`1.05 kB`** (gzip: `0.53 kB`)
  - `dist/assets/index.css`: **`154.32 kB`** (gzip: `19.99 kB`)
  - `dist/assets/index.js`: **`1,866.97 kB`** (gzip: `523.17 kB` — includes Monaco Editor, Xterm.js, Three.js, GSAP, and Framer Motion)

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 20.0.0`
- npm `>= 10.0.0`

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The client will start on `http://localhost:5173`.

### 3. Production Build & Verification
```bash
npm run lint    # ESLint verification (0 errors, 0 warnings)
npm run build   # Production bundle compilation
npm run preview # Preview the production bundle locally
```
