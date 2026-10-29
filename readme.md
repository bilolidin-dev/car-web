# Website Project

A static website built with HTML, CSS, and JavaScript modules. No build process or package installation is required.

## Run locally

From the project directory, start a local server:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000> in your browser. The page loads some visual assets from external CDNs, so an internet connection is needed for those assets.

The administration page is available at `/admin/`.

## Project structure

- `index.html` — public page markup.
- `style.css` — public page styles and responsive layouts.
- `script.js` — language and currency controls, catalog rendering, and public-page interactions.
- `admin/index.html` — demo administration page markup.
- `admin/admin.css` — administration page styles.
- `firebase-config.js` — Firebase app settings and Cloudinary upload configuration.
- `firestore.rules` — public catalog read rules and verified-admin write rules.
- `admin/admin.js` — Firebase Authentication, Firestore catalog editing, and Cloudinary uploads.

## Firebase and Cloudinary setup

1. In Firebase Console, enable **Authentication → Email/Password** and create the administrator account. Verify its email.
2. Create a **Firestore Database** and publish the rules from `firestore.rules`.
3. In Firestore, create `admins/uBv4FEsvuRVoRDVrzrL9w19o27L2` with a field `role` set to `admin`. The rules only grant write access to this UID when its verified Firebase email is `biloldin111fifa@gmail.com`.
4. In Cloudinary, create an unsigned upload preset, restrict its allowed formats and maximum file size, and set its folder. Add the Cloudinary cloud name and preset name to `firebase-config.js`.
5. Add the website domain to Firebase Authentication's authorized domains. Run the website over HTTP/HTTPS; browser module imports do not work from a `file://` URL.

The Firebase Web config is public by design. Never put a Firebase service-account key or Cloudinary API secret in frontend files. Unsigned Cloudinary uploads use a public preset and can be called outside the admin page; restrict the preset in Cloudinary. For uploads that must be admin-only, use a trusted backend to sign them.

Firestore reads the catalog publicly, while create/update/delete require a signed-in user with verified email and an `admins/{uid}` document. Admin documents cannot be created or changed from the client. Existing entries in browser `localStorage` are not migrated automatically; add them to Firestore through the admin page.

Prices are entered in USD and can be displayed in USD or KGS. The KGS conversion rate is manually configured in `script.js` and is not fetched live.
