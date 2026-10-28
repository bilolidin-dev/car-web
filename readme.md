# Website Project

A static website built with HTML, CSS, and JavaScript. No build process or package installation is required.

## Run locally

From the project directory, start a local server:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in your browser. The page loads some visual assets from external CDNs, so an internet connection is needed for those assets.

The optional demo administration page is available at `/admin/`.

## Project structure

- `index.html` — public page markup.
- `style.css` — public page styles and responsive layouts.
- `script.js` — language and currency controls, catalog rendering, and public-page interactions.
- `admin/index.html` — demo administration page markup.
- `admin/admin.css` — administration page styles.
- `admin/admin.js` — demo sign-in and catalog editing.

## Demo catalog

The administration page can add, edit, or delete catalog entries. In this demo, catalog data is saved in the current browser's `localStorage`; it is not synchronized to other devices or browsers. Clearing browser site data removes the saved entries.

The demo sign-in is not real security: its check runs in public JavaScript and can be bypassed. Do not rely on it for a public production deployment. A server-backed authentication system and database access rules are required for real protection and shared data.

Prices are entered in USD and can be displayed in USD or KGS. The KGS conversion rate is manually configured in `script.js` and is not fetched live.
