# 9th International Ancient Arts Festival 2026: event page (draft)

Event page for Rays of Wisdom Society with a live e-pass maker and a live count of guests who already hold a pass.
Next.js (App Router) + Tailwind 4. Look: cream paper, sage and olive greens from the festival poster,
and maroon kept for the e-pass and one dignified band (the award). Motion tokens follow the Portfolio
project; the "photographs develop from black and white" reveal and the chapter rail follow My Postcards.

```bash
npm install
npm run dev -- -p 3100   # http://localhost:3100
npm run build && npm start
```

## Content

All copy lives in **`src/content/event.ts`**: title, dates, venue, programme (each performance carries its
artists and bios), award, sponsors, FAQs. The text is the client's own, received 22 Oct 2026. While
`isDraft: true` the page asks search engines not to index it.

Page order: hero (styled after the printed pass) → presented by / in association with → about and the
director → programme (two evenings, "Meet the artists" sheets, an e-pass call per evening) → e-pass → Ancient
Arts Award → plan your visit and FAQ. Each photograph is used in one place only.

Still to come from the client: per-performance times and running order (the order inside each evening follows
their text), entry policy, social links, and official sponsor artwork. Chadha Papers is cut from the supplied
image; the Modi Groups mark is redrawn from a photo of their wall sign (`scripts/prepare-images.mjs`).

## Photographs and logos

Originals stay in `IAAF (2026) artist photographs/` (not served, and not in Git: about 380 MB, so keep them locally
or in shared storage). The web-sized results in `public/images/` are committed, so the site builds without them. `npm run images` (`scripts/prepare-images.mjs`)
makes web-sized JPEGs in `public/images/artists/` and transparent logos in `public/images/brand/`. To use another
photo, add a line to that script, re-run it, then reference it in `src/content/event.ts` (`photos`). Photographer
credits come from the file names (Avinash Pasricha, Ajay Lal, Priyanka, Sai Thejeswar Rao): confirm them with the client.

## How the e-pass works

1. The e-pass section shows a live ticket, drawn after the physical pass (logo row with the sponsors, title,
   date and venue, director, motto, watercolour hills), that redraws as the visitor types a name and picks
   1 to 4 people and an evening. A three-step guide follows what the visitor has done.
2. "Make and download my e-pass" calls `POST /api/epass`, which validates, issues a pass number
   (`RWS26-XXXXXX`), stores it and returns the new total. The PNG downloads straight away.
3. The ready view offers **Show at the gate** (a full-screen QR for the foyer), download again, save to photos /
   share, add to calendar, and a switcher when a family holds several passes. Passes stay on the phone
   (`localStorage`), so reopening the page shows them again and never counts twice.

### The QR code at the venue

The QR holds the short address `/p/RWS26-XXXXXX`:

* **A guest** who scans it sees "This is a genuine e-pass" with a masked name (e.g. "Asha V."), the party size
  and evening.
* **Gate staff** sign in once on `/gate` with the PIN (`GATE_PIN`). On that phone the same QR opens a
  verdict card: **Valid pass, check in N people**, **Already checked in at 6:42 pm**, **Not for tonight**
  (with "Admit anyway") or **Pass not found**, plus undo. A both-evenings pass is checked in once per evening.
* `/gate` is the console: evening switch, live "inside tonight" numbers, a camera scanner (jsQR, works on
  iPhone and Android), manual pass-number entry (tolerant of lowercase and missing dash) and recent checks.

API: `GET/POST /api/gate/check` (lookup, admit, undo), `GET /api/gate/stats`, `POST/DELETE /api/gate/session`.
Staff sessions are signed, HttpOnly cookies (14 hours); PIN attempts are rate limited.

### Storage

* **Local / demo (default):** `.data/epass.json`, falling back to memory on read-only hosts. Memory resets on
  every deploy or cold start, and each server instance has its own copy, so **don't run the event on this**.
* **Production:** create a free Supabase project, run `supabase/schema.sql` (also upgrades older tables), then
  set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `GATE_PIN` (see `.env.example`). Check-ins use a
  conditional update, so two gate phones scanning the same pass can't both admit it.

## Bio sources

Artist bios were written from these sources; confirm with the client before launch.
Ritesh and Rajnish Mishra: their own "Profile 2026.pdf". Reela Hota: Wikipedia, odisha.plus. Arupa Lahiri
(spelled "Lahiry" in most sources): Herald Goa, NCPA. Amrita Lahiri: Abhivyakti, Deccan Herald, NCPA.
Gauri Diwakar: Sangeet Natak Akademi citation, Open magazine, Indian Embassy Berlin. Abhay Sopori: Wikipedia,
The Tribune. Mukesh Sharma: World Music Central. Rishi Shankar Upadhyay: Ashirvachan, Daily Excelsior. Sumit
Mishra: Naad / Bimhuis and Trafó concert listings. Madhavi Mudgal: Wikipedia, Sahapedia, Kennedy Center.
Kamani Auditorium and metro: kamaniauditorium.org. No reliable public profile was found for Joe Mathew,
Princess Panigrahi, Priyanka Das, Durjay Bhowmick or the Sudarushka dancers, so they are listed by role only.

## Not built yet

* Confirmation e-mail or PDF pass (needs an e-mail provider; no e-mail addresses are stored).
* Hindi version, capacity limit.
