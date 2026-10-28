# koreamotors.export

A lightweight bilingual landing page for a Korean vehicle export business based in Daegu, South Korea, serving customers across Central Asia.

## Run locally

No build step or package installation is required. From the project directory, run:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in a browser. The page uses Bootstrap and Font Awesome from CDNs, so those assets require an internet connection.

The temporary admin page is available at <http://localhost:8000/admin/>.

## Project files

- `index.html` contains the page structure, search metadata, contact details, and external stylesheet/script references.
- `style.css` contains layout, theme, and responsive styles.
- `script.js` contains English/Russian translations, gallery rendering, theme and currency controls.

## Inventory

Sign in at `/admin/` with the demo credentials configured in `admin/admin.js`, then add, edit, or delete vehicles. Entries are saved in this browser's `localStorage` and remain after reloading the page. Enter vehicle prices in USD; the page formats them in USD or Kyrgyz som (KGS).

The login is only a demo gate: credentials are in public JavaScript and can be bypassed. This is not real security. Data is not shared with other browsers/devices, and clearing this browser's site data removes the inventory. Do not use this admin page on a public production deployment. Firebase Authentication and database access rules should replace it when the client project is available.

The conversion rate is configured by `USD_TO_KGS_RATE` in `script.js`. It is a manually maintained rate, not a live exchange-rate feed; update it before relying on converted prices commercially.

## Contact details

- Phone and WhatsApp: +82 10-5656-9626
- Telegram channel: <https://t.me/+C_CVCZLPf185NjYy>
- Instagram: <https://www.instagram.com/koreamotors.export/>
- Location: Daegu, South Korea
- Export region: worldwide

## Publish

This is a static site and can be deployed to any static web host, such as GitHub Pages, Netlify, or Cloudflare Pages. Check that the CDN assets load and that the contact links are correct on the deployed domain.
