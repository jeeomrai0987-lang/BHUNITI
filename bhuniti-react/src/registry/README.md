# Digital Registry section (`src/registry`)

The six-step land-registration wizard, mounted inside the BHUNITI site at **`/registry`**.

It arrived as a standalone Vite app (five HTML prototypes rebuilt as React + React Router) and
was folded in whole: its own catalogs, its own chrome, its own stylesheet. Nothing outside this
folder was rewritten to accommodate it, and nothing inside it reaches out except for two
deliberate seams — the router mount and the locale bridge — both described below.

## Where it hangs off the site

`src/App.jsx` owns every route in the app, including these:

| Step(s)     | Route                              | Page component            |
| ----------- | ---------------------------------- | ------------------------- |
| 1           | `/registry/parcel-identification`  | `ParcelIdentification`    |
| 2           | `/registry/owner-and-party`        | `OwnerAndParty`           |
| 3 + 4       | `/registry/transaction-documents`  | `TransactionsDocuments`   |
| 5 + 6       | `/registry/review-submission`      | `ReviewSubmission`        |
| post-submit | `/registry/registry-tracking`      | `RegistryTracking`        |

`/registry` and any unknown child redirect to step 1.

`routes.js` is the single source of truth. `REGISTRY_SEGMENT` (`'registry'`) is both the parent
`<Route path>` in `src/App.jsx` and the base that `PATHS` is built from, so the mount point and
the links cannot drift apart. `SEGMENTS` is what `<Route path>` needs (relative); `PATHS` is what
`<Link>`, `navigate()` and every `pathname` comparison needs (absolute). The header nav, both
stepper variants, the breadcrumb and the Previous/Continue buttons all read from this file, so
changing a URL here moves everything.

Outside this folder the paths are reached through the re-export in `src/routes.js`:

```js
export { PATHS as REGISTRY_ROUTES, REGISTRY_BASE } from "./registry/routes.js";
```

`src/pages/main/Platform.jsx` is currently the only host-side caller — its Digital Registry card
navigates straight to `REGISTRY_ROUTES.parcel` (the other three module cards still go through the
demo OTP modal).

## `App.jsx` is a layout element, not a page

`RegistrySection` is the `element` of the parent `/registry` route rather than a component each
page renders. React Router keeps a layout mounted while you move between its children, so the
draft application in `RegistryContext` survives step 1 → step 6 and is discarded when the visitor
leaves for the rest of the site — the lifetime a draft should have. It sits beside `MainLayout`
rather than inside it because the wizard brings its own fixed header, breadcrumb and footer.

The standalone `main.jsx` (HashRouter + three providers + route table) is gone; the site owns the
router, and `RegistrySection` is what remains: the three providers, `components/Layout.jsx` and
an `<Outlet />`.

## Two i18n runtimes, one language choice

The wizard keeps its own 332-key catalogs under `i18n/` — its vocabulary is its own and does not
belong in the site's — but the *choice* of language is the visitor's and has to be one choice.
The site's `LanguageProvider` owns it; `RegistrySection` passes it down and hands the wizard's own
switcher back up:

```jsx
const { locale, setLocale } = useSiteI18n()          // ../i18n
<I18nProvider locale={locale} onLocaleChange={setLocale}>
```

Given `locale`, the registry provider runs **controlled**: it stops persisting to `localStorage`
and stops writing `<html lang>` and `document.title`, leaving all three to the site so the two
runtimes cannot fight over them. Without the props it still runs standalone-style, so this folder
remains testable on its own.

Both sides support exactly `en` + `hi`, and `tools/registry_check_runtime.mjs` compares the two
lists on every run — if either side gains or loses a locale, the check fails rather than the
wizard silently falling back to English.

Everything else about the runtime is unchanged: `t()` walks dotted keys and returns the key
itself on a miss (so use `tOr(key, fallback)`, not `t(key) || fallback`), `_one`/`_other` is
chosen only when the caller passes a numeric `count`, Hindi falls back to English per key, and
numbers, currency and dates go through `Intl` with `en-IN` / `hi-IN`. `translator.js` is
deliberately React-free so bare `node` can import it. Stored `<select>` values stay canonical
English and only their labels are translated, so switching language cannot rewrite a record.

## Theme and stylesheet scoping

The wrapper is `theme-main registry-scope bg-background font-body-md text-on-surface`.

Every Tailwind colour utility in this project resolves to a CSS variable, and `.theme-main` /
`.theme-dashboard` swap all 52 of them. The wizard's 52 hex values were byte-identical to
`.theme-main`, so embedding changes nothing about how it looks.

`registry-scope` exists because `index.css` carries the prototypes' old `<style>` blocks —
scrollbar rules the stepper needs (the site hides scrollbars globally), a focusable-skip-link
rule, and the Leaflet map styles. **Every selector in `index.css` must begin with
`.registry-scope`**, so none of it leaks into the rest of the site;
`tools/registry_check_source.mjs` enforces that and the presence of both classes on the wrapper.

Four tokens were merged into the shared `tailwind.config.js` for this section:
`maxWidth['container-max']` (`1440px` — note that in Tailwind v3 the `maxWidth` scale does *not*
inherit from `spacing`, which is why declaring it only there left `max-w-container-max` inert),
plus the `loadProgress`, `slowSpin` and `pulseScale` keyframes/animations. The content glob
already covered `./src/**/*.{js,jsx}`.

## Checking it

From `bhuniti-react/`:

```bash
npm run check:registry   # the three checkers below, in order
npm run verify           # those plus the site's syntax + i18n checks
```

- `tools/registry_check_catalogs.mjs` — parity between the two catalogs, matching
  `{{placeholder}}` sets, and Hindi entries that are still English.
- `tools/registry_check_source.mjs` — JSX tag balance, imports, the route table, the Tailwind
  tokens the markup asks for, the mount-point block in `src/App.jsx`, every host-side
  `REGISTRY_ROUTES.*` reference, and the class/CSS scoping guard.
- `tools/registry_check_runtime.mjs` — resolves every key in both locales, renders the enumerated
  patterns, checks the fee arithmetic, and compares the site and registry locale lists.

All three run on plain `node` with nothing installed. The site's `check_i18n.mjs` deliberately
skips this folder — its `t()` calls resolve against these catalogs, not the site's, so measured
against the site's vocabulary all 244 of them would read as undefined; the two checkers above
cover them instead.
