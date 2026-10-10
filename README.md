# Roman Foundation Repair — Website

Static, mobile-responsive website for Roman Foundation Repair (Houston, TX). Plain HTML, CSS and vanilla JavaScript — no build step, no database, ready for GitHub Pages.

## Project structure

```
roman-foundation-repair/
├── index.html          Homepage (all sections)
├── privacy.html        Privacy Policy (template — review before launch)
├── styles.css          All styles (brand colors as CSS variables at the top)
├── script.js           Menu, FAQ accordion, gallery filter + lightbox, form validation
├── robots.txt
├── .nojekyll           Tells GitHub Pages to serve files as-is
└── assets/
    ├── logo/
    │   ├── logo-horizontal.png   Header/footer logo (original artwork, margins trimmed, transparent background)
    │   ├── logo-circular.png     Circular badge logo
    │   ├── favicon-32.png
    │   └── apple-touch-icon.png
    └── images/
        ├── *.webp        15 project photos at 1400px (lightbox / large layouts)
        ├── *-sm.webp     Same photos at 700px (cards and gallery grid)
        └── og-image.jpg  Social-sharing preview image
```

All paths are relative, so the site works at `username.github.io/repo-name/` and on a custom domain.

## Preview locally

Any static server works. From inside the project folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening `index.html` directly by double-clicking also works for most things.)

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `roman-foundation-repair`), public.
2. Upload the **contents** of this folder to the repository root — `index.html` must be at the top level, not inside a subfolder. Include the hidden `.nojekyll` file.
   - Web: **Add file → Upload files**, drag everything in, commit.
   - Or Git:
     ```bash
     git init
     git add .
     git commit -m "Initial website"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/roman-foundation-repair.git
     git push -u origin main
     ```
3. In the repo go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and **Save**.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/roman-foundation-repair/`.
5. **Custom domain (optional):** in Settings → Pages enter the domain (e.g. `romanfoundationrepair.com`), then at your domain registrar add the DNS records GitHub shows (4 `A` records for the apex domain and/or a `CNAME` for `www`). Tick **Enforce HTTPS** once it's available.

### After you know the final URL

In `index.html`, replace the relative `og:image` with the full URL (e.g. `https://romanfoundationrepair.com/assets/images/og-image.jpg`), add `<meta property="og:url" content="https://…/">`, and add `"url"` to the structured data block. Social networks need absolute URLs to show the preview image.

## Connecting the estimate form

GitHub Pages can't process forms on its own. The form is built to work with a free form-to-email service:

1. Create a form at a service such as Formspree (formspree.io), Web3Forms, or Basin, and point it to the business email.
2. Copy the endpoint URL it gives you (e.g. `https://formspree.io/f/abcdwxyz`).
3. In `index.html`, find `data-endpoint=""` on the `<form id="estimate-form">` and paste it in:
   `data-endpoint="https://formspree.io/f/abcdwxyz"`
4. Submit a test request and confirm the email arrives.

**Until that's done**, the form still validates everything, but it does **not** pretend to send. It tells the visitor the request was not sent and shows two buttons: **Call (832) 468-3075** and **Text My Details**, which opens the visitor's messaging app with their request pre-filled to the business number. When an endpoint is connected, the success message only appears if the service returns a successful response; failures show an error with the phone number.

The form includes a hidden honeypot field (`_gotcha`) to reduce spam; Formspree recognizes it automatically.

## Details to confirm with the business

Nothing below was invented — these are placeholders or omissions waiting for real information:

- [ ] **ZIP code** for 10402 Moorberry Ln. Nearby addresses on the same street are listed as 77043, but the ZIP for this exact address wasn't verified, so it's left out of the page and structured data. Add `"postalCode"` once confirmed.
- [ ] **Map pin:** confirm the Google Maps link lands on the right spot. Ideally create/claim a Google Business Profile and link to that instead.
- [ ] **Free estimates?** If yes, change "Request an Estimate" to "Request a Free Estimate" (search and replace in `index.html` and `script.js`).
- [ ] **Concrete repair** — confirm it's offered as a service (the photos show concrete patching). If not, remove that service card, dropdown option, and footer reference.
- [ ] **Foundation inspection** — confirm it's offered, and whether it is free or paid.
- [ ] **Business email** (for the form service and possibly the contact section).
- [ ] **Business hours.**
- [ ] **Service area** — which Houston-area cities/neighborhoods to name.
- [ ] **Licenses, insurance, years in business, warranties** — add only verified facts.
- [ ] **Reviews/testimonials** — add only real ones, with permission (or link to Google reviews).
- [ ] **Actual process** — the 4 steps are kept general; update with how the company really works.
- [ ] **Repair methods** used (e.g. pressed concrete pilings, steel piers, shimming), so service descriptions can be more specific.
- [ ] **Privacy Policy** — review the template and name the form service used.
- [ ] **Domain name** — then update `og:image`/`og:url`/structured data URLs.
- [ ] **Photo usage** — confirm customers are comfortable with house photos being published. No locations or names are shown.

## Quality-check report

Tested in headless Chromium at 1440 px (desktop), 1100 px (small laptop), 820 px (tablet) and 390 px (mobile).

| Area | Result |
| --- | --- |
| **Responsiveness** | No horizontal scrolling at any tested width. Services: 3 → 2 → 1 columns; gallery 4 → 3 → 2; warning signs 5 → 3 → 1; process 4 → 2 → 1; contact and about stack on tablet/mobile. Hamburger menu below 1020 px. Sticky "Call Now / Request an Estimate" bar on phones. |
| **Image loading** | All 15 project photos and both logos load with no broken images or 404s. Photos converted from ~56 MB of PNG to ~7 MB WebP in two sizes; cards and grid use 700 px versions, lightbox uses 1400 px. Below-the-fold images use `loading="lazy"`; the hero image is preloaded. Every image has `width`/`height` to prevent layout shift and uses `object-fit: cover` — nothing is stretched. |
| **Navigation** | Header links scroll to each section with offset for the sticky header; current section is highlighted. Mobile menu opens/closes, closes on link click and Escape, and locks background scrolling. Every phone link uses `tel:+18324683075`. |
| **Gallery** | Filters (All / Excavation / Foundation Support / Concrete) work. Lightbox opens from any photo, supports previous/next, arrow keys, Escape, swipe on touch, keeps keyboard focus inside, and returns focus on close. No photos are labeled before/after. |
| **Accessibility basics** | Skip link; semantic landmarks (`header`, `nav`, `main`, `footer`); one `h1` and ordered headings; descriptive alt text on all content images (decorative backgrounds use `alt=""`); FAQ uses buttons with `aria-expanded`/`aria-controls`; form fields have labels and linked error messages; visible gold focus outline; respects reduced-motion settings. White text on navy and navy text on white pass WCAG AA contrast; a darker gold (#9C6B22) is used for small gold text on white. |
| **Contact form** | Required fields: name, 10-digit phone, ZIP (5 or 9 digit), service, description (10+ chars); email is validated if entered and required if "Email" is the preferred contact method. Errors appear inline and focus moves to the first problem. With no endpoint the honest call/text fallback appears (verified). |
| **Console** | No JavaScript errors. (In the test sandbox, Google Fonts was blocked by the network, so screenshots used fallback fonts; online, the page loads Barlow Condensed and Source Sans 3.) |

Recommended before launch: run Lighthouse in Chrome DevTools on the live URL, and test the form end-to-end once the endpoint is connected.
