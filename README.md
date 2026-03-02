# Portfolio · UX & Product Designer

Static portfolio site (single-page). Deploy-ready for Vercel.

## Deploy to Vercel

1. Push this repo to GitHub (only deploy-needed files are tracked; `node_modules/`, `scripts/`, `mcps/` are in `.gitignore`).
2. In [Vercel](https://vercel.com), import the GitHub repo.
3. Leave **Build Command** empty, **Output Directory** empty (root is the site).
4. Deploy. The site is static: `index.html` is the entry, `assets/` and `006_Trillion.html` are served as-is.

## Repo structure (what gets pushed)

```
├── index.html          # Main page
├── 006_Trillion.html   # Trillion overlay content
├── vercel.json         # Static site config
├── .gitignore
├── README.md
└── assets/
    ├── library/        # SVG icons (full-story, product, whitepaper, lock)
    └── optimized/      # Project card images (PNG); add before deploy if missing
```

Ensure `assets/optimized/` contains the project images referenced in `index.html` (e.g. `01-savvy-defi-1.png`, `02-evmos-1.png`, …), or the script that generates them, before pushing.
