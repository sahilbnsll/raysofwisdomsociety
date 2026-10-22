# 9th International Ancient Arts Festival 2026: event page (draft)

Event page for Rays of Wisdom Society with a live e-pass maker and an "e-passes downloaded" counter.
Next.js (App Router) + Tailwind 4. Look: cream paper, sage and olive greens from the festival poster,
and maroon kept for the e-pass and one dignified band (the award). Motion tokens follow the Portfolio
project; the "photographs develop from black and white" reveal and the chapter rail follow My Postcards.

```bash
npm install
npm run dev -- -p 3100   # http://localhost:3100
npm run build && npm start
```

## Content

All copy lives in **`src/content/event.ts`**: title, dates, venue, programme, performers, award, FAQs, gallery.
The text is the client's own, received 22 Oct 2026. Set `isDraft: false` there to remove the "DRAFT FOR REVIEW"
banner and allow search indexing.

Still to come from the client: venue street address, per-performance times and running order (the order inside
each evening follows their text), entry policy, social links, sponsors (the sponsor sheets IMG_8186 and IMG_8188 are
deliberately not used).

## Photographs and logos

Originals stay in `IAAF (2026) artist photographs/` (not served, and not in Git: about 380 MB, so keep them locally
or in shared storage). The web-sized results in `public/images/` are committed, so the site builds without them. `npm run images` (`scripts/prepare-images.mjs`)
makes web-sized JPEGs in `public/images/artists/` and transparent logos in `public/images/brand/`. To use another
photo, add a line to that script, re-run it, then reference it in `src/content/event.ts` (`photos`). Photographer
credits come from the file names (Avinash Pasricha, Ajay Lal, Priyanka, Sai Thejeswar Rao): confirm them with the client.

## How the e-pass works

1. The e-pass section shows a live ticket that redraws as the visitor types a name, picks 1 to 4 people and an evening.
2. "Download my e-pass" calls `POST /api/epass`, which validates, issues a pass number (`RWS26-XXXXXX`), stores it and
   returns the new total.
3. The browser draws the final ticket (QR code, logo, perforated stub) to a canvas and downloads it as a PNG
   (`src/lib/epass/render-pass.ts`). The same drawing is the preview, so what people see is what they get.
4. The QR code opens `/pass/<number>`, a page for gate staff that shows **Valid e-pass**, a masked name ("Asha V."),
   the number of people and the evening, or "not found".
5. The browser remembers its passes (`localStorage`), so reopening the page shows the pass again and never counts twice.
   "Get a pass for someone else" makes another one. The counter means **unique passes issued**, not button clicks.

The counter (`GET /api/epass`) refreshes every 30 s while the tab is visible. Abuse protection: hidden honeypot field and a
per-IP limit of 5 passes per 10 minutes (per server instance).

### Storage

* **Local / demo (default):** `.data/epass.json`, falling back to memory on read-only hosts. Memory resets on every
  deploy or cold start, and the QR page can only find passes the same instance holds, so don't use this for a live event.
* **Production:** create a free Supabase project, run `supabase/schema.sql` (it also upgrades an older table), then set
  `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (see `.env.example`). RLS is on with no policies, so only the server
  can read or write. The `epass_summary` view gives organisers passes and people per evening choice.

## Not built yet

* A staff check-in mode (mark a pass as used so a second scan is flagged).
* Confirmation e-mail or PDF pass (needs an e-mail provider; no e-mail addresses are stored).
* Hindi version, capacity limit.
