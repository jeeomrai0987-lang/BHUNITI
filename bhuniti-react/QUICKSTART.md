# BHUNITI React - Quick Start Guide

## 1. Installation (30 seconds)

```bash
npm install
```

## 2. Development (HMR enabled)

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 3. Demo Credentials

Use one of these to test:

| User | Pass | Portal |
|------|------|--------|
| `citizen` | `1234` | Citizen (Search Records, Applications, Services) |
| `revenue_officer` | `1234` | Revenue Officer (GIS, Mutations, Analytics) |
| `district_officer` | `1234` | Admin (District overview, Monitoring) |

## 4. Production Build

```bash
npm run build
```

Output: `dist/` folder (ready for any static host — S3, Vercel, Netlify, GitHub Pages)

## 5. Key Paths

- **Home page**: http://localhost:5173
- **Login**: http://localhost:5173/login
- **Citizen portal**: http://localhost:5173/citizen (after login with `citizen/1234`)
- **Revenue officer**: http://localhost:5173/revenue-officer (after login with `revenue_officer/1234`)
- **Admin panel**: http://localhost:5173/administration (after login with `district_officer/1234`)

## 6. What You Get

✅ All 27 pages converted from Stitch to React  
✅ Two design themes (public site + dashboards) via CSS variables  
✅ Client-side routing, no backend needed  
✅ GIS drawer toggle, animated counters, scroll-to-cards all working  
✅ Ready to wire to real APIs  

## 7. What's Next?

- **See the README.md** for detailed docs on theming, routes, deployment
- **Connect to APIs**: Replace mock content with real `/api/` calls
- **Add authentication**: Replace demo credentials with your auth system
- **Deploy**: `npm run build` then upload `dist/` to your host

---

**Questions?** See README.md for full documentation.
