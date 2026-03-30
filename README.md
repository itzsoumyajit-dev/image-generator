# Image Generator

Convert bare-bones prompts into detailed Image Generation prompts.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Edit the `.env` file and replace the placeholder:
```
VITE_API_KEY=your_api_key_here
```

### 3. Run
```bash
npm run dev
```

Open http://localhost:5173

---

## Features

- **Prompt styles** — Precise, Creative, Technical, Concise
- **History** — Last generated prompts
- **Copy to clipboard** — One click

## Project structure

```
src/
  App.jsx       # Main UI component
  index.css     # Global styles
  main.jsx      # React entry point
.env            # Your API key (never commit this)
```
