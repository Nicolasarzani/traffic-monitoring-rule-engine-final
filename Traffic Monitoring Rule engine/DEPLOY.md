# Share the mockup (no Node for viewers)

Anyone **viewing** the demo only needs a browser. Someone must **build or import** the app once (online IDE or your CI).

---

## Option A — StackBlitz (no local install)

1. Push this project to **GitHub** (or GitLab).
2. Open: `https://stackblitz.com/github/YOUR_USER/YOUR_REPO`  
   Replace with your real org/user and repo name.
3. StackBlitz installs dependencies and runs `npm run dev` in the browser. Share that URL with tech and sales.

**Tip:** If the repo is private, use StackBlitz with a connected account or use Option B/C.

---

## Option B — Netlify Drop (static files, ~30 seconds)

Someone with Node **once** (any machine):

```bash
npm install
npm run build
```

Then zip the **`dist`** folder contents (not the folder name itself—`index.html` at zip root), or drag the **`dist`** folder onto **[Netlify Drop](https://app.netlify.com/drop)**.

Share the generated `*.netlify.app` URL. No install for stakeholders.

---

## Option C — Netlify / Vercel (git connect)

This repo includes:

- **`netlify.toml`** — build: `npm run build`, publish: `dist`
- **`vercel.json`** — same for Vercel

Connect the Git repo in the Netlify or Vercel dashboard; every push can auto-deploy a preview URL.

---

## Option D — GitHub Pages (CI builds for you)

This repo includes **`.github/workflows/github-pages.yml`**.

1. Push the project (with `package.json` and the Vite app) to GitHub.
2. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
3. Push to `main` or `master`; the workflow runs `npm ci`, `npm run build`, and publishes **`dist`**.

If the live URL is `https://<user>.github.io/<repo>/` (project site), add to `vite.config.js`:

```js
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  // ...
})
```

Use `base: '/'` for a custom domain or `username.github.io` root site.

---

### Summary

| Audience        | Needs Node? |
|----------------|-------------|
| Viewers (sales) | No — open the hosted link |
| One-time build  | Yes, or use StackBlitz / CI |
