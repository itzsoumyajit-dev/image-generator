# 🎨 Thoughtforge: AI Image Generator

<div align="center">
  <p><strong>Your next stunning visual already exists.</strong></p>
  <p>Describe any scene, pick a style, and let AI bring it to life in seconds. No design skills required.</p>
  
  <h3><a href="https://image-generator-sable-phi.vercel.app/">🌐 Live Demo</a></h3>
  ![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-5.x-purple?style=for-the-badge&logo=vite)
  ![NVIDIA API](https://img.shields.io/badge/NVIDIA-Powered-76B900?style=for-the-badge&logo=nvidia)
</div>

---

## ✨ Features

- ⚡ **Instant Generation:** From idea to image in seconds. Powered by Stable Diffusion 3 via the NVIDIA NIM API.
- 🎨 **Style Intelligence:** Choose between four distinct visual modes:
  - `Photorealistic` (Sharp & detailed, 8k)
  - `Artistic` (Abstract & dreamlike)
  - `Technical` (Blueprint, schematic)
  - `Minimalist` (Vector, flat & clean)
- 🌓 **Dynamic Themes:** Built-in Dark and Light mode support for a premium viewing experience.
- 🕒 **History Management:** Quickly access and reload your past image generations.
- 🔒 **Private by Default:** Your prompts and generated visual assets are securely processed.
- 📥 **Download Ready:** Export your generated visuals in full-resolution with a single click.

---

## 🚀 Quick Start

### 1. Clone & Install
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/itzsoumyajit-dev/image-generator.git
cd image-generator
npm install
```

### 2. Configure API Key
Create a `.env` file in the root directory and add your NVIDIA API key. You can get a free API key at [build.nvidia.com](https://build.nvidia.com/).
```env
VITE_NVIDIA_API_KEY=your_nvidia_api_key_here
```

### 3. Start Development Server
Run the Vite development server to launch the app locally:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser to start creating! 

---

## 🛠️ Project Structure

```text
src/
├── components/
│   ├── LoadingScreen.jsx  # Animated entry screen
│   └── ParticleCanvas.jsx # Interactive 3D background effects
├── App.jsx                # Core UI & Application logic
├── main.jsx               # React entry point
├── nvidia.js              # NVIDIA API Integration
└── index.css              # Global styles, layout, animations & theming
```

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut (Windows/Linux) | Shortcut (Mac) |
| :--- | :--- | :--- |
| **Generate Image** | `Ctrl` + `Enter` | `⌘` + `Enter` |
| **Download Image** | (Click the Download button below the result) | (Click the Download button below the result) |

---

<div align="center">
  <p>Built with ❤️</p>
</div>
