# REST Countries API — with color theme switcher

Lightweight Frontend Mentor challenge implementation using plain HTML, CSS and vanilla JavaScript.

This project displays country data from the REST Countries API and includes a dark/light theme toggle. A local `data.json` file is included as a fallback if the API is unavailable.

## Demo

Open `index.html` in a browser or run a static server (see below). The UI supports:

- Browse all countries in a responsive grid
- Live search by country name
- Filter by region
- Click a country to view a detail overlay (large flag + metadata)
- Click border-country buttons (they show full country names) to navigate to the neighbor's details
- Toggle between dark and light theme (persisted to `localStorage`)

## Quick start

1. Clone or download this repository.
2. From the project root, run a static server. Example using Python (no build step required):

```bash
python3 -m http.server 8000
```

3. Open your browser at: http://127.0.0.1:8000

The app will attempt to fetch country data from the REST Countries API. If that fails it will load `data.json` that's included in this repo.

## Project structure

- `index.html` — main markup and structure
- `style.css` — styles (CSS variables + light/dark themes)
- `script.js` — application logic: fetch, render, search, filter, details overlay, theme toggle
- `data.json` — fallback country data
- `img/` — small static assets (theme icon)

## Implementation notes

- Data fetching: `script.js` first requests the REST Countries endpoint. On failure it fetches `data.json` so you can work offline or when the API is down.
- Theme: the code toggles a `.light` class on `:root` and CSS variables are used to provide themed colors for both light and dark modes. The chosen theme is stored in `localStorage`.
- Border countries: when showing a country's details, border alpha3 codes are mapped to full names using the loaded dataset so the buttons read the country names and are clickable.
- Accessibility: basic keyboard support is provided — country cards are focusable and Enter opens details. This can be extended for full a11y compliance.

## Styling & UX

- Mobile-first layout with responsive grid for country cards.
- Hover effect on cards: a small lift + stronger shadow to indicate interactivity.
- Detail view implemented as an overlay for a lightweight UX. I can convert this to a separate detail page with deep linking (pushState) if you prefer.

## Next improvements (optional)

- Pixel-perfect design matching (fonts, spacing, icons). I can add Nunito Sans and tweak sizes to match the Frontend Mentor designs.
- Add deep links: each country would have a unique URL and browser Back/Forward would work naturally.
- Add loading indicators, better error messages, and automated tests.
- Improve accessibility (aria labels, focus trap in overlay, skip links, contrast checks).

## License & credits

- Country data and flags are sourced from the REST Countries API and the included `data.json`.
- This repository is provided for learning and demonstration purposes.

---

If you want me to polish visuals, add deep links, or improve accessibility next, tell me which one and I'll implement it and update the README with the final details.
