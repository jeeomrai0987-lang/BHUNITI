/** @type {import('tailwindcss').Config} */

/*
 * Every type token in this file used to be the bare family ["Inter"], which
 * left Hindi to whatever the OS picked -- usually a mismatched default with a
 * different x-height, so switching language visibly broke the layout. Inter has
 * no Devanagari coverage, so the browser falls through per glyph: Latin text and
 * digits stay in Inter, Devanagari renders in Noto Sans Devanagari, and mixed
 * strings like "खसरा 1024" come out consistent.
 */
const sansStack = [
  "Inter",
  "Noto Sans Devanagari",
  "system-ui",
  "-apple-system",
  "Segoe UI",
  "sans-serif",
];

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "background": "var(--color-background)",
        "border-subtle": "var(--color-border-subtle)",
        "error": "var(--color-error)",
        "error-container": "var(--color-error-container)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        "inverse-primary": "var(--color-inverse-primary)",
        "inverse-surface": "var(--color-inverse-surface)",
        "on-background": "var(--color-on-background)",
        "on-error": "var(--color-on-error)",
        "on-error-container": "var(--color-on-error-container)",
        "on-primary": "var(--color-on-primary)",
        "on-primary-container": "var(--color-on-primary-container)",
        "on-primary-fixed": "var(--color-on-primary-fixed)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
        "on-secondary": "var(--color-on-secondary)",
        "on-secondary-container": "var(--color-on-secondary-container)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",
        "on-tertiary": "var(--color-on-tertiary)",
        "on-tertiary-container": "var(--color-on-tertiary-container)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
        "outline": "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",
        "primary": "var(--color-primary)",
        "primary-container": "var(--color-primary-container)",
        "primary-fixed": "var(--color-primary-fixed)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim)",
        "secondary": "var(--color-secondary)",
        "secondary-container": "var(--color-secondary-container)",
        "secondary-fixed": "var(--color-secondary-fixed)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
        "status-error": "var(--color-status-error)",
        "status-success": "var(--color-status-success)",
        "status-warning": "var(--color-status-warning)",
        "surface": "var(--color-surface)",
        "surface-bright": "var(--color-surface-bright)",
        "surface-container": "var(--color-surface-container)",
        "surface-container-high": "var(--color-surface-container-high)",
        "surface-container-highest": "var(--color-surface-container-highest)",
        "surface-container-low": "var(--color-surface-container-low)",
        "surface-container-lowest": "var(--color-surface-container-lowest)",
        "surface-dim": "var(--color-surface-dim)",
        "surface-tint": "var(--color-surface-tint)",
        "surface-variant": "var(--color-surface-variant)",
        "surface-white": "var(--color-surface-white)",
        "tertiary": "var(--color-tertiary)",
        "tertiary-container": "var(--color-tertiary-container)",
        "tertiary-fixed": "var(--color-tertiary-fixed)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      /*
       * Two dashboards paint their backdrop with `bg-gradient-radial`, which
       * Tailwind 3 does not ship -- only the linear `bg-gradient-to-*`
       * directions exist. The class was therefore inert and the blobs rendered
       * as flat blurs, so the utility is declared here rather than rewritten at
       * each call site.
       */
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      /*
       * `container-max` is declared under `spacing` below, which gives
       * `w-`/`px-`/`mx-` but not `max-w-` -- Tailwind 3's maxWidth scale does
       * not read from spacing. Nine call sites ask for `max-w-container-max`
       * (three in Features/HowItWorks, six in the registry section) and until
       * this entry existed every one of them was an inert class name, so those
       * containers stretched to the full viewport instead of centring at the
       * 1440px the design calls for.
       */
      maxWidth: {
        "container-max": "1440px",
      },
      spacing: {
        "container-max": "1440px",
        unit: "4px",
        base: "4px",
        "margin-mobile": "16px",
        gutter: "16px",
        "margin-desktop": "32px",
        "table-row-height": "40px",
        "sidebar-width": "280px",
      },
      fontFamily: {
        sans: sansStack,
        "tabular-nums": sansStack,
        display: sansStack,
        "headline-md": sansStack,
        "body-md": sansStack,
        "headline-lg": sansStack,
        "body-sm": sansStack,
        "headline-lg-mobile": sansStack,
        "body-lg": sansStack,
        "label-caps": sansStack,
        "label-md": sansStack,
      },
      fontSize: {
        "tabular-nums": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        // "display" and "headline-lg" differ between the marketing site and the
        // three dashboards, so their size/line-height are resolved via the
        // --fs-* CSS variables set per theme scope (see src/index.css)
        display: [
          "var(--fs-display-size)",
          { lineHeight: "var(--fs-display-lh)", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-lg": [
          "var(--fs-headline-lg-size)",
          {
            lineHeight: "var(--fs-headline-lg-lh)",
            letterSpacing: "var(--fs-headline-lg-ls)",
            fontWeight: "600",
          },
        ],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
      },

      /*
       * Five animations were already being asked for in the markup and none of
       * them existed: `animate-scaleUp` on the three modals, `bg-pan` on the AI
       * module card, `dash` on the governance flow connectors, `progress` on the
       * how-it-works bar, and `ping` referenced through an arbitrary value
       * (`animate-[ping_2s_…]`), which does not pull in Tailwind's built-in
       * keyframes the way the bare `animate-ping` utility would. Every one of
       * those classes compiled to nothing before this block.
       */
      keyframes: {
        scaleUp: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "bg-pan": {
          from: { backgroundPosition: "0% 0%" },
          to: { backgroundPosition: "100% 0%" },
        },
        dash: {
          to: { strokeDashoffset: "-40" },
        },
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        // The three below belong to the registry section: a determinate
        // progress bar on the tracking page (it lived in a page-level <style>
        // tag in the original HTML), and the drifting compass rose and
        // breathing halo on the parcel map.
        loadProgress: {
          "0%": { width: "0%" },
          "100%": { width: "33.33%" },
        },
        slowSpin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulseScale: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "0.4" },
        },
      },
      animation: {
        scaleUp: "scaleUp 180ms ease-out",
        "bg-pan": "bg-pan 4s linear infinite",
        dash: "dash 20s linear infinite",
        progress: "progress 2s ease-in-out infinite",
        // The markup asks for the same fade under two names (`animate-fadeIn` in
        // the viewers and Home, `animate-fade-in` in the analytics pages), so
        // both are declared against the one keyframe rather than renaming
        // classes across seven call sites.
        fadeIn: "fadeIn 200ms ease-out",
        "fade-in": "fadeIn 200ms ease-out",
        "scale-in": "scaleIn 180ms ease-out",
        loadProgress: "loadProgress 1.5s ease-out forwards",
        slowSpin: "slowSpin 120s linear infinite",
        pulseScale: "pulseScale 15s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
