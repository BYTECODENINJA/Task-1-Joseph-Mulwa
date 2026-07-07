# PulseBand — The AI-Powered Wellness Tracker

A static, multi-page marketing site for the PulseBand product launch.The first task at decode labs internship project. 100% static, no backend.
## Structure

```
tech-launch/
├─ index.html          Home — hero, CTA, feature highlights
├─ product.html        Product — full feature/sensor grid
├─ pricing.html        Pricing — plan cards + comparison table
├─ demo.html           Interactive demo (heart rate, sleep, hydration)
├─ signup.html         Signup / contact form
├─ about.html          Team & mission
├─ blog/
│  ├─ index.html       Blog list
│  └─ article-1.html   Example article
├─ css/styles.css       All styles (design tokens + components)
├─ js/
│  ├─ nav.js            Mobile nav toggle (aria-expanded)
│  ├─ demo.js           Demo widget logic (localStorage-backed)
│  └─ forms.js          Inline form validation
├─ assets/
│  ├─ images/           Product photography, app screens, logo
│  └─ icons/            Favicon (SVG)
└─ README.md
```

## Running locally

No build step is required. Serve the folder with any static file server, for example:

```bash
cd rootdirectory Name
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

Opening `index.html` directly by double-clicking also works, with the exception that some browsers restrict `fetch`/module features over the `file://` protocol not used here, so this isn't a concern.

## Wiring up the contact form

`signup.html` posts to a Formspree endpoint placeholder:

```html
<form id="signup-form" action="https://formspree.io/f/your-form-id" method="POST" data-static-demo="true" ...>
```

To go live:
1. Create a form at [formspree.io](https://formspree.io) and copy your endpoint.
2. Replace `your-form-id` in `signup.html` with your real endpoint.
3. Remove the `data-static-demo="true"` attribute, this attribute currently tells `js/forms.js` to intercept submission and show a simulated success message instead of posting anywhere, which is useful for local demos but should come out before launch.

Alternatively, swap the `action` for a `mailto:hello@getpulseband.com` link if you'd rather receive submissions by email (note: `mailto` forms rely on the visitor's local email client and aren't fully reliable across browsers).

## Demo page persistence

`demo.html` uses `localStorage`/`sessionStorage` only no server, no database:
- Last heart rate reading and selected activity mode
- Last selected sleep chart range (night vs. week)
- Whether the hydration nudge has already auto-shown this browser session

Clearing site data in the browser resets all of it.

## Design tokens

Colors, spacing and type scale live at the top of `css/styles.css` as CSS custom properties (`--mocha`, `--sky`, `--moon`, `--pulse`, `--gap-*`). Update values there to re-theme the whole site consistently.

Fonts: Inter (600/700, headlines) and Roboto (400, body), loaded from Google Fonts in each page's `<head>`.

## Accessibility notes

- Landmarks: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>` throughout.
- Skip-to-content link on every page.
- Mobile nav toggle uses `aria-expanded` and closes on `Escape`.
- Form fields have associated `<label>`s, inline error text, and `aria-invalid` on failure.
- Demo tabs follow the ARIA tabs pattern (`role="tablist"`, arrow-key navigation).
- Focus-visible outlines are defined globally; `prefers-reduced-motion` disables the animated pulse-line dividers and smooth scroll.

## Browser support

Built against evergreen browsers (Chrome, Firefox, Safari, Edge, current mobile versions). No polyfills included.