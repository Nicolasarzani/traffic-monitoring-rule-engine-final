# Traffic Monitoring — Compliance Rule Management (mockup)

React + Vite + Tailwind dashboard for activation scope and validation rules (SNS Core News paths).

### Stack

Same idea as the official **React + Vite** scaffold: **HMR**, `vite build`, and **ESLint** (hooks + refresh). This repo uses [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react); [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) is the SWC-based alternative. **React Compiler** is off by default ([docs](https://react.dev/learn/react-compiler)). For **TypeScript** + type-aware ESLint, use Vite’s [React + TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) as a reference if you migrate.

## Run locally (needs Node once)

```bash
npm install
npm run dev
```

## Share with tech & sales (no Node for them)

See **[DEPLOY.md](./DEPLOY.md)** — StackBlitz, Netlify Drop, and git-connected hosting.

This repo includes **`netlify.toml`**, **`vercel.json`**, **`.stackblitzrc`**, and **`.github/workflows/github-pages.yml`** so those deployment flows work once the app source and `package.json` are in the repository.
