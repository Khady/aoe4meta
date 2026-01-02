# Deployment Guide

This guide covers how to deploy your Age of Empires 4 Strategy Guide application to various hosting platforms.

## Overview

This is a **static website** (frontend-only) built with Vite and React. Since there's no backend server, you can deploy it to any static hosting service.

**Build Output**: The production build creates static files in the `dist/public` directory.

---

## Option 1: Replit Deployment (Recommended for Replit Users)

The easiest option if you're already using Replit.

### Steps:

1. Click the **"Publish"** button in your Replit workspace (top right)
2. Follow the deployment wizard
3. Your app will be automatically built and deployed
4. You'll get a live URL like `https://your-app-name.replit.app`

### Benefits:
- One-click deployment
- Automatic HTTPS
- Free tier available
- Integrated with your development environment

---

## Option 2: GitHub Pages

GitHub Pages hosts static websites for free directly from your repository.

### ⚠️ Important Limitations:
- GitHub Pages serves files from a subdirectory (e.g., `https://username.github.io/repo-name/`)
- You need to configure the base path in your Vite config

### Setup Steps:

#### 1. Update `vite.config.ts`

Add the `base` option to match your repository name:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  base: '/your-repo-name/', // ⭐ Add this line - must match your GitHub repo name
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
```

#### 2. Install GitHub Pages Package

```bash
npm install --save-dev gh-pages
```

#### 3. Update `package.json`

Add deployment scripts:

```json
{
  "scripts": {
    "dev": "vite --port 5000 --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "check": "tsc",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist/public"
  }
}
```

#### 4. Deploy to GitHub Pages

```bash
npm run deploy
```

This command will:
1. Build your app (`npm run build`)
2. Push the `dist/public` folder to the `gh-pages` branch
3. Make it available at `https://your-username.github.io/your-repo-name/`

#### 5. Configure GitHub Repository

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select the **gh-pages** branch
5. Click **Save**

Your site will be live in a few minutes!

### Alternative: GitHub Actions Auto-Deploy

For automatic deployments on every push to `main`:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist/public
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then configure GitHub Pages:
1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**

Now every push to `main` will automatically deploy!

---

## Option 3: Netlify

Netlify provides free static hosting with automatic builds from Git.

### Steps:

#### Method A: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build your app:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist/public
```

#### Method B: Netlify Web UI

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Netlify](https://netlify.com) and sign up/login
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
6. Click **Deploy**

Your site will be live at `https://random-name.netlify.app` (you can customize this)

### Benefits:
- Automatic deployments from Git
- Free SSL certificate
- Custom domains
- Built-in CDN
- Preview deployments for pull requests

---

## Option 4: Vercel

Vercel is optimized for frontend frameworks and offers excellent performance.

### Steps:

#### Method A: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

#### Method B: Vercel Web UI

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [Vercel](https://vercel.com) and sign up/login
3. Click **"Add New Project"**
4. Import your repository
5. Configure (Vercel usually auto-detects Vite settings):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
6. Click **Deploy**

Your site will be live at `https://your-project.vercel.app`

### Benefits:
- Fastest global CDN
- Automatic deployments from Git
- Preview deployments
- Free SSL
- Excellent Vite integration

---

## Option 5: Cloudflare Pages

Cloudflare offers fast global deployment with their CDN network.

### Steps:

1. Push your code to GitHub or GitLab
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Sign up/login and click **"Create a project"**
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/public`
6. Click **Save and Deploy**

Your site will be live at `https://your-project.pages.dev`

### Benefits:
- Cloudflare's global CDN
- Unlimited bandwidth
- Free SSL
- DDoS protection
- Fast build times

---

## General Build Instructions

For any platform that requires manual deployment:

### 1. Build the App

```bash
npm run build
```

This creates production-ready files in `dist/public/`

### 2. Preview the Build Locally (Optional)

```bash
npm run preview
```

This starts a local server to preview the production build.

### 3. Deploy the `dist/public` Folder

Upload the contents of `dist/public/` to your hosting provider.

---

## Comparison Table

| Platform | Best For | Free Tier | Auto-Deploy | Custom Domain | Difficulty |
|----------|----------|-----------|-------------|---------------|------------|
| **Replit** | Already using Replit | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |
| **GitHub Pages** | Open source projects | ✅ Yes | ✅ Yes (Actions) | ✅ Yes | ⭐⭐ Medium |
| **Netlify** | Small-medium projects | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |
| **Vercel** | Performance-critical apps | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |
| **Cloudflare Pages** | Global audience | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |

---

## Troubleshooting

### Routes Not Working (404 on Refresh)

Since this is a single-page application (SPA) using Wouter for routing, you need to configure your hosting to redirect all requests to `index.html`.

**GitHub Pages**: Create `client/public/.nolekyll` file and add a 404.html that redirects to index.html

**Netlify**: Create `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel**: Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Cloudflare Pages**: Add this to your project settings under **Redirects/Headers**:
```
/* /index.html 200
```

### Images Not Loading

Make sure images in `attached_assets/` are being copied to the build output. Vite should handle this automatically when you import them with `@assets/...`.

### Base Path Issues (GitHub Pages)

If your app is deployed to a subdirectory (like GitHub Pages), make sure:
1. `base` is set in `vite.config.ts`
2. All routes in your app are relative or use the base path
3. Images and assets use the `@assets/` import syntax

---

## Recommended Deployment

**For Replit Users**: Use Replit's built-in deployment for the easiest experience.

**For Everyone Else**: 
- **Netlify** or **Vercel** are the easiest with excellent features
- **GitHub Pages** is great if you want everything in one place (code + hosting)
- **Cloudflare Pages** if you need maximum global performance

All options are free for small-to-medium traffic websites!

---

## Need Help?

- Check your platform's documentation for specific issues
- Ensure `npm run build` works locally before deploying
- Test with `npm run preview` to see if the production build works
- Check browser console for errors after deployment
