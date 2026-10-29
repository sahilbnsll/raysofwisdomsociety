/**
 * Everything the event page shows lives here. Copy is the client's own text (received 22 Oct 2026);
 * photographs come from "IAAF (2026) artist photographs/" via `npm run images`.
 *
 * Artist bios were written from published sources (listed in README.md, "Bio sources") and the
 * Mishra brothers' own profile. Artists with no reliable public profile get their role only.
 * On the page itself each photograph appears once; the "Meet the artists" sheets reuse portraits.
 *
 * Still to come from the client: per-performance times and running order (the order inside each
 * evening follows their text), entry policy, social links, official sponsor artwork.
 */

export interface Photo {
  src: string;
  w: number;
  h: number;
  alt: string;
  /** A line shown under the photograph in the gallery viewer (falls back to the alt text). */
  caption?: string;
  /** CSS object-position for crops, e.g. "50% 20%" keeps faces in frame. */
  position?: string;
  credit?: string;
}

const art = (file: string, w: number, h: number, alt: string, extra: Partial<Photo> = {}): Photo => ({
  src: `/images/artists/${file}.jpg`,
  w,
  h,
  alt,
  ...extra,
});

export const photos = {
  mantraTemple: art("mantra-temple", 2200, 1467, "Princess Panigrahi and Priyanka Das in Odissi costume, seated in a carved stone temple doorway", { position: "50% 60%" }),
  mantraPairHead: art("mantra-pair-head", 400, 400, "Princess Panigrahi and Priyanka Das, in Odissi costume", { position: "50% 40%" }),
  mantraDuo: art("mantra-duo", 2200, 1467, "Two Odissi dancers in green and blue costumes in a playful duet on a dark stage", { position: "45% 50%" }),
  reelaPortrait: art("reela-portrait", 1201, 1800, "Reela Hota in red silk and silver jewellery, hands raised in an expressive mudra", { position: "50% 22%" }),
  reelaSeated: art("reela-seated", 1201, 1800, "Reela Hota seated in a namaste pose in a red and maroon Odissi costume", { position: "50% 38%" }),
  reelaPoseB: art("reela-pose-b", 1200, 1800, "Odissi dancer in a copper and red costume in a graceful tribhangi pose", { position: "50% 18%" }),
  arupa: art("arupa-bharatanatyam", 1200, 1800, "Arupa Lahiri balanced on one leg in a tan and red Bharatanatyam costume with a fanned skirt", { position: "50% 35%" }),
  arupaSeated: art("arupa-seated", 918, 918, "Arupa Lahiri in a red and blue Bharatanatyam costume, kneeling in a pose of abhinaya", { position: "50% 30%" }),
  amritaRed: art("amrita-red", 1200, 1800, "Amrita Lahiri in a red Kuchipudi costume with one arm raised high", { position: "50% 22%" }),
  amritaLeap: art("amrita-leap", 1200, 1800, "Amrita Lahiri in a blue costume leaping with an arm stretched to the sky", { credit: "Priyanka", position: "50% 30%" }),
  amritaRays: art("amrita-rays", 1440, 1800, "Amrita Lahiri in red, lit from behind by a burst of light on a dark stage", { credit: "Sai Thejeswar Rao", position: "50% 40%" }),
  amritaPortrait: art("amrita-portrait", 1280, 1600, "Amrita Lahiri in a cream and blue sari, pointing into the distance", { position: "50% 20%" }),
  gauriTwirl: art("gauri-twirl", 1420, 1800, "Gauri Diwakar in a purple costume mid-twirl on a dark stage", { position: "50% 30%" }),
  gauriBend: art("gauri-bend", 1286, 1800, "Gauri Diwakar in purple, leaning back with arms stretched wide", { position: "50% 28%" }),
  gauriPortrait: art("gauri-portrait", 2000, 1325, "Gauri Diwakar in a purple striped dupatta looking to the side with hands raised", { position: "55% 25%" }),
  sudarushkaStage: art("sudarushka-stage", 2000, 1346, "Three Russian dancers in blue sarafans holding embroidered shawls wide on a lit stage", { position: "50% 45%" }),
  sudarushkaGroup: art("sudarushka-group", 1030, 1600, "Russian dancers in blue and white folk costume gathered together in a forest", { position: "50% 30%" }),
  abhaySantoor: art("abhay-santoor", 2000, 1694, "Abhay Sopori in a cream embroidered kurta seated behind his santoor", { position: "64% 50%" }),
  abhayPortrait: art("abhay-portrait", 1261, 1800, "Abhay Sopori in a cream embroidered kurta, hands poised over the santoor strings", { position: "50% 22%" }),
  joeMathew: art("joe-mathew-1", 1086, 1448, "Joe Mathew in white, leaning back with one arm raised and his gaze lifted", { position: "50% 22%" }),
  joeMathewB: art("joe-mathew-2", 1086, 1448, "Joe Mathew in white, arms spread wide in a balanced ballet pose", { position: "55% 24%" }),
  joeMathewHead: art("joe-mathew-head", 400, 400, "Joe Mathew, head and shoulders", { position: "50% 40%" }),
  mukeshPortrait: art("mukesh-portrait", 959, 1280, "Pandit Mukesh Sharma in a cream kurta and blue shawl, holding the rabab", { position: "55% 30%" }),
  mukeshHead: art("mukesh-head", 400, 400, "Pandit Mukesh Sharma, head and shoulders", { position: "50% 40%" }),
  mukeshRabab: art("mukesh-rabab", 1280, 1060, "Mukesh Sharma in a dark kurta playing the rabab", { position: "36% 30%" }),
  mishraDuo: art("mishra-duo", 1201, 1800, "Ritesh and Rajnish Mishra in brown silk kurtas seated close together against a black backdrop", { position: "50% 30%" }),
  madhavi: art("madhavi-color-a", 1333, 1800, "Madhavi Mudgal in a red Odissi costume with silver jewellery, mid-gesture", { credit: "Ajay Lal", position: "50% 25%" }),
};

/**
 * What a visitor reads under a photograph in the viewer. The alt text above stays a plain description for
 * screen readers; these are written to sit beside the dancers and musicians: what you actually see, said simply.
 */
const captions: Partial<Record<keyof typeof photos, string>> = {
  mantraTemple: "Odissi began in temples, so a carved stone doorway suits Princess Panigrahi and Priyanka Das.",
  mantraDuo: "A small conversation in movement: one dancer leans in, the other reaches back.",
  reelaPortrait: "Reela Hota, hands raised in a mudra. In Odissi the hands do half the talking.",
  reelaSeated: "Namaste. An Odissi recital opens by saluting the earth, the stage and the audience, and this is where it starts.",
  reelaPoseB: "Tribhangi, the three bends of head, torso and hips. Reela learned it from Gurus Gangadhar Pradhan and Kelucharan Mohapatra.",
  joeMathew: "Ballet's long reaching line, in Joe Mathew's arm and in his gaze.",
  joeMathewB: "Arms open, feet crossed, the balance of ballet, about to meet Odissi on one stage.",
  arupa: "Balanced on one leg, skirt fanned wide. Arupa trained for over fifteen years with Chitra Visweswaran, and stillness like this is what that looks like.",
  arupaSeated: "Abhinaya: telling a whole story with only the face and hands. Arupa Lahiri's was shaped in Chennai, under Chitra Visweswaran.",
  amritaRed: "Amrita Lahiri began Kuchipudi in Washington, D.C., a long way from Andhra Pradesh, where the form was born. One arm high in red silk, and she looks entirely at home.",
  amritaLeap: "Arm to the sky, mid-leap. Kuchipudi grew out of dance-drama, and its stage has always had room for this.",
  amritaRays: "Lit from behind in red, as if she is stepping out of the light itself.",
  amritaPortrait: "In cream and blue, pointing past the camera at something only she can see.",
  gauriTwirl: "A chakkar, the Kathak spin. Gauri Diwakar learned hers at Kathak Kendra, in the line of Pandit Birju Maharaj.",
  gauriBend: "Leaning right back, arms wide, trusting the spin to bring her round.",
  gauriPortrait: "Gauri Diwakar, hands lifted, a glance to one side. Kathak tells its stories in moments like this.",
  sudarushkaStage: "Shawls held wide in blue sarafans, a khorovod circle about to form.",
  sudarushkaGroup: "Mariia Timashova, Mariia Agafonova and Yana among the trees. In a khorovod everyone joins hands, and the circle is the whole point.",
  abhaySantoor: "Mallets hovering over the strings. The Sopori family has played the santoor in Kashmir for over three hundred years, and Abhay is the one holding them now.",
  abhayPortrait: "Hands poised over the strings, the breath before the first note.",
  mukeshRabab: "Pandit Mukesh Sharma on stage with the rabab, the older lute the sarod grew out of.",
  mukeshPortrait: "Pandit Mukesh Sharma with the rabab, in cream and a blue shawl.",
  mishraDuo: "The Mishra brothers, sixth generation of a Banaras Gharana family, and still sitting close when they sing.",
  madhavi: "Madhavi Mudgal in red. Kathak first, then Odissi under Guru Kelucharan Mohapatra, and a whole life of dance since.",
};
for (const [key, caption] of Object.entries(captions)) photos[key as keyof typeof photos].caption = caption;

export const org = {
  name: "Rays of Wisdom Society",
  short: "RWS",
  tagline: "Spreading the wisdom behind ancient rituals and practices",
  address: "5th Floor, 86, Padma Palace, Nehru Place, New Delhi 110019",
  landline: "+91 11 40814540",
  mobile: "+91 99538 24452",
  email: "raysofwisdom@gmail.com",
  site: "https://www.raysofwisdomsociety.net",
  registration: "Regd. no. 54348/80 G",
  /** Festival contact for visitors and the press. */
  coordinator: { name: "Nishant Sharma", role: "Project Coordinator, IAAF 2026", phone: "+91 89555 91445" },
} as const;

export interface Logo {
  name: string;
  src: string;
  w: number;
  h: number;
}

export const brand = {
  logo: { src: "/images/brand/iaaf-logo.png", w: 512, h: 513, alt: "Ancient Arts festival emblem: a dancer in silhouette inside a twelve-petal lotus" },
  /** A 192 px copy of the emblem for the small festival seals (the full one is 512 px). */
  logoSmall: { src: "/images/brand/iaaf-logo-sm.webp", w: 192, h: 192 },
  /** The emblem pre-toned to one warm colour for the slowly turning watermark behind the hero title. */
  emblem: { src: "/images/brand/emblem-soft.webp", w: 640, h: 641 },
  /** The performing artists, cut out and grouped; it fills the right of the hero, standing on the hills. */
  collage: { src: "/images/artists-collage.webp", w: 2000, h: 1375, alt: "The festival's artists together: Odissi, Bharatanatyam, Kuchipudi and Kathak dancers, a Russian folk dancer, a santoor player, a rabab player and a ballet dancer" },
  rays: { src: "/images/brand/rays-logo.png", w: 360, h: 317, alt: "Rays of Wisdom Society logo: a tree beneath a rising sun" },
};

/** Sponsors, in the order they appear on the printed pass. */
export const sponsors: Logo[] = [
  { name: "Chadha Papers", src: "/images/brand/chadha-papers.png", w: 360, h: 222 },
  { name: "Modi Groups", src: "/images/brand/modi-groups.png", w: 360, h: 155 },
];

export const curator = {
  name: "Dr. Reela Hota",
  roles: "Odissi dancer, choreographer, author and researcher",
  affiliations: ["Senior Fellow, Ministry of Culture", "Founder and Director, Rays of Wisdom Society"],
  bio: [
    "Reela Hota began Odissi at eight under Guru Gangadhar Pradhan, then studied with Guru Kelucharan Mohapatra and Madhavi Mudgal, this year's Ancient Arts Award laureate.",
    "Raised on dance, yoga and ashram life by her mother, the yoga teacher Bijoylaxmi Hota, she brings the spiritual and therapeutic side of Odissi to the stage, the subject of her book Odissi Dance: Therapeutics, Aesthetics and Metaphysics.",
  ],
  // The namaste pose is the festival director's pose on the official poster.
  photo: photos.reelaSeated,
};

export interface Artist {
  name: string;
  role: string;
  /** "lead" artists are the faces of a performance; "guest" artists appear briefly and are kept quieter. */
  billing?: "lead" | "guest";
  bio?: string;
  /** What we know from the programme, shown when there is no bio yet. Replace it with a bio once the artist sends one. */
  details?: string;
  /** Portrait for the bio sheet; artists without a photograph get a monogram. */
  photo?: Photo;
  /** Small head-and-shoulders picture for the round portraits under a performance. */
  thumb?: Photo;
}

export interface Session {
  id: string;
  time?: string; // omit until the client supplies per-performance times
  title: string;
  /** One line from the client's text that sets the scene, shown above the title. */
  tagline?: string;
  artForm: string;
  /** Leave the art form out of the title line and the artist sheet (when the title already says it). */
  hideArtForm?: boolean;
  /** The client's own description of the performance. */
  note: string;
  /** Large photographs of the lead artists, one or two. */
  leadPhotos: Photo[];
  /** An optional smaller picture of the performance itself. */
  stage?: Photo;
  /**
   * More photographs for the gallery viewer. They never appear on the page itself, so the page stays
   * calm: visitors open them from the "Photographs" link. Photographs dropped into the gallery folder
   * (see README, "Adding photographs") are added automatically; list one here only to reuse a picture.
   */
  gallery?: Photo[];
  artists: Artist[];
}

export interface Day {
  id: "day-1" | "day-2";
  evening: "day1" | "day2";
  label: string;
  date: string; // ISO yyyy-mm-dd
  /** Shown beside the evening: "First evening: Classical and Folk Dance". */
  theme: string;
  /** One word for tight spaces, such as the e-pass tiles. */
  short: string;
  blurb: string;
  sessions: Session[];
}

export interface ArchivePrint {
  photo: Photo;
  /** Year from the photo's file name; omitted when the file name gives none. */
  year?: string;
  title: string;
  caption: string;
}

export type Evenings = "both" | "day1" | "day2";

export const event = {
  // Kept out of search engines until NEXT_PUBLIC_INDEXABLE=true is set on the live site (after client sign-off).
  isDraft: process.env.NEXT_PUBLIC_INDEXABLE !== "true",
  slug: "iaaf-2026",
  edition: "9th",
  title: "International Ancient Arts Festival",
  shortTitle: "IAAF 2026",
  /** What people type into a search box, and the festival hashtag: the same word as the web address. */
  searchName: "IAAF26",
  /** When the content last changed, for the sitemap. Update it whenever the programme, artists or details change. */
  updatedAt: "2026-10-29",
  subtitle: "Ancient Arts. Universal Consciousness. A World Beyond Boundaries.",
  motto: ["Art", "Heals", "Connects", "Awakens"],
  director: "Reela Hota",
  startDate: "2026-11-25",
  endDate: "2026-11-26",
  start: "6:30 pm",
  timeLabel: "6:30 pm onwards",
  venue: {
    name: "Kamani Auditorium",
    area: "New Delhi",
    address: "1, Copernicus Marg, Mandi House, New Delhi 110001",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kamani+Auditorium+New+Delhi",
    metro: "Mandi House metro station (Blue and Violet lines) is about a 5 to 10 minute walk away.",
  },
  // Official festival poster (supplied at 1000 x 1000, resized to 1080): the top of the e-pass and the social sharing images.
  poster: {
    src: "/images/poster-v2.jpg",
    width: 1080,
    height: 1080,
    alt: "Poster for the 9th International Ancient Arts Festival 2026 with classical dancers and musicians in colourful costume.",
  },
  /** The five arches under the hero title: dance and music, one photograph of each tradition. */
  arcade: [
    { photo: photos.reelaPoseB, label: "Odissi" },
    { photo: photos.arupaSeated, label: "Bharatanatyam" },
    { photo: photos.amritaRed, label: "Kuchipudi" },
    { photo: photos.gauriTwirl, label: "Kathak" },
    { photo: photos.abhayPortrait, label: "Santoor" },
  ],
  /** Meta description: under about 160 characters, with the name people search for at the front. */
  seoDescription:
    "IAAF26: two evenings of Indian classical and folk dance and classical music at Kamani Auditorium, New Delhi, 25 and 26 Nov 2026. Get your e-pass.",
  intro: "Art has always been more than a performance.",
  // The client's own words, as in the script they sent (22 Oct 2026)
  about: [
    "Across civilisations, ancient arts have offered a way to understand ourselves, connect with others, and experience the deeper unity that binds humanity.",
    "Since its inception in 2010, the International Ancient Arts Festival has sought to highlight two essential dimensions of ancient arts: their relevance to our well-being and the unifying power of the aesthetic experience.",
    "In a world marked by stress, conflict and growing divisions, these traditions remind us of our shared humanity and our connection to a universal consciousness and energy. They invite us to look beyond geography, language and culture, recognising that understanding one another is an essential step towards a more peaceful society. When we experience each other's traditions, we begin to recognise what connects us rather than what divides us.",
    "In this spirit, the 9th International Ancient Arts Festival 2026, curated and directed by Reela Hota, brings together India's rich classical traditions and international artistic expressions through an exciting programme of dance and music.",
  ],
  closing:
    "Join us for two evenings of classical brilliance, cross-cultural collaboration and the timeless wisdom of ancient arts.",
  programmeIntro:
    "Across these two evenings, dance becomes prayer, movement becomes a shared language, instrumental music opens a dialogue between cultures, and classical singing carries forward the wisdom of an ancient musical heritage.",
  // Running order inside each evening follows the order of the client's text; confirm with them.
  days: [
    {
      id: "day-1",
      evening: "day1",
      label: "First evening",
      date: "2026-11-25",
      theme: "Classical and Folk Dance",
      short: "Dance",
      blurb:
        "The first evening opens with Sanskrit: The Mantra Bhasha, then moves through Bharatanatyam and Kuchipudi to a Kathak and Sudarushka collaboration.",
      sessions: [
        {
          id: "mantra-bhasha",
          title: "Sanskrit: The Mantra Bhasha",
          tagline: "A meeting of sacred movement, language and sound",
          artForm: "Odissi and Classical Ballet",
          note: "An innovative collaboration exploring the healing potential of ancient language, movement and music through Odissi and Classical Ballet.",
          leadPhotos: [photos.reelaPoseB],
          stage: photos.mantraTemple,
          gallery: [photos.mantraDuo, photos.joeMathewB],
          artists: [
            {
              name: "Reela Hota",
              role: "Odissi, festival director",
              billing: "lead",
              bio: "An Odissi dancer, choreographer and author, trained by Gurus Gangadhar Pradhan and Kelucharan Mohapatra and by Madhavi Mudgal, known for the spiritual and therapeutic side of Odissi.",
              photo: photos.reelaPortrait,
              thumb: photos.reelaPortrait,
            },
            {
              name: "Joe Mathew",
              role: "Ballet dancer",
              details: "Brings classical ballet to Sanskrit: The Mantra Bhasha, the Odissi and ballet collaboration led by Reela Hota.",
              photo: photos.joeMathew,
              thumb: photos.joeMathewHead,
            },
            {
              name: "Princess Panigrahi and Priyanka Das",
              role: "Dancers",
              details: "Dance with Reela Hota in Sanskrit: The Mantra Bhasha, exploring the healing potential of ancient language, movement and music.",
              photo: photos.mantraTemple,
              thumb: photos.mantraPairHead,
            },
          ],
        },
        {
          id: "bharatanatyam",
          title: "Bharatanatyam",
          artForm: "Bharatanatyam",
          note: "Where dance reaches back to its sacred origins and becomes a pathway to prayer and inner stillness.",
          leadPhotos: [photos.arupa],
          artists: [
            {
              name: "Arupa Lahiri",
              role: "Bharatanatyam",
              billing: "lead",
              photo: photos.arupaSeated,
              bio: "A Bharatanatyam dancer of the Vazhuvoor style, trained for over fifteen years by Padma Shri Chitra Visweswaran. She won the Ustad Bismillah Khan Yuva Puraskar in 2019 and has performed across India and in the UK, USA, France, Germany and Australia.",
            },
          ],
        },
        {
          id: "kuchipudi",
          title: "Kuchipudi",
          artForm: "Kuchipudi",
          note: "Celebrating an ancient tradition that continues to evolve through generations of artists.",
          leadPhotos: [photos.amritaRed],
          stage: photos.amritaLeap,
          gallery: [photos.amritaRays],
          artists: [
            {
              name: "Amrita Lahiri",
              role: "Kuchipudi",
              billing: "lead",
              bio: "She began Kuchipudi in Washington, D.C. with Anuradha Nehru, made her solo debut at the India International Centre in 1996 and trained in Bharatanatyam with Leela Samson. An empanelled artist of the Indian Council for Cultural Relations, she has toured widely and led dance programming at the NCPA, Mumbai.",
              photo: photos.amritaPortrait,
            },
          ],
        },
        {
          id: "kathak-sudarushka",
          title: "Indian Kathak meets Russian Sudarushka",
          tagline: "Two traditions in one shared circle of movement",
          artForm: "Classical and folk dance",
          hideArtForm: true,
          note: "Indian classical dance in dialogue with Sudarushka, the Russian folk circle dance. Two traditions, rooted in different histories, come together in a shared circle of movement, demonstrating how artistic expression can celebrate cultural diversity while revealing a common human language.",
          leadPhotos: [photos.gauriTwirl, photos.sudarushkaGroup],
          stage: photos.sudarushkaStage,
          gallery: [photos.gauriBend],
          artists: [
            {
              name: "Gauri Diwakar",
              role: "Kathak",
              billing: "lead",
              bio: "Trained at Kathak Kendra, New Delhi under Pandit Jaikishan Maharaj and Pandit Birju Maharaj, and for many years a lead dancer with Aditi Mangaldas's Drishtikon. She won the Ustad Bismillah Khan Yuva Puraskar (2008), has performed at Sadler's Wells and the Edinburgh Fringe, and teaches at Kathak Kendra.",
              photo: photos.gauriPortrait,
            },
            {
              name: "Mariia Timashova, Mariia Agafonova and Yana",
              role: "Sudarushka",
              billing: "lead",
              bio: "Sudarushka, loosely \"sweetheart\", is a Russian folk dance, here in the spirit of the khorovod, the old Slavic circle dance in which dancers join hands and move in a ring.",
              photo: photos.sudarushkaGroup,
            },
          ],
        },
      ],
    },
    {
      id: "day-2",
      evening: "day2",
      label: "Second evening",
      date: "2026-11-26",
      theme: "Classical Music",
      short: "Music",
      blurb:
        "The second evening turns to the meditative dimensions of music, and concludes with a Hindustani classical vocal recital.",
      sessions: [
        {
          id: "santoor-rabab",
          title: "Santoor and rabab",
          tagline: "The ancient stringed voices of different musical traditions",
          artForm: "Instrumental",
          note: "The resonance of the Iranian rabab and the Indian santoor creates a dialogue across cultures, celebrating music's capacity to carry memory, emotion and cultural identity beyond the boundaries of language.",
          leadPhotos: [photos.abhaySantoor],
          stage: photos.abhayPortrait,
          gallery: [photos.mukeshRabab],
          artists: [
            {
              name: "Pandit Abhay Rustum Sopori",
              role: "Santoor",
              billing: "lead",
              photo: photos.abhayPortrait,
              thumb: photos.abhayPortrait,
              bio: "A santoor player, composer and conductor from Kashmir, son and disciple of Pandit Bhajan Sopori and carrier of the Sufiana gharana, a family tradition of over 300 years. One of the youngest recipients of the Ustad Bismillah Khan Yuva Puraskar.",
            },
            {
              name: "Pandit Mukesh Sharma",
              role: "Rabab",
              billing: "guest",
              photo: photos.mukeshPortrait,
              thumb: photos.mukeshHead,
              bio: "A Delhi-based sarod virtuoso who also plays the rabab, the older lute from which the sarod descends. He has toured widely and worked with musicians in France and Germany and flamenco artists in Spain.",
            },
            {
              name: "Rishi Shankar Upadhyay",
              role: "Pakhawaj",
              bio: "A pakhawaj player from Gaya, Bihar, trained by his father Pandit Ravi Shankar Upadhyay. He won the Ustad Bismillah Khan Yuva Puraskar in 2023 and is an A-grade artist of All India Radio.",
            },
            {
              name: "Durjay Bhowmick",
              role: "Tabla",
              details: "Accompanies on tabla for both musical performances of the second evening: the santoor and rabab, and the Banaras Gharana vocal recital.",
            },
          ],
        },
        {
          id: "vocal",
          title: "Hindustani classical vocal",
          tagline: "The closing recital of the festival",
          artForm: "Banaras Gharana",
          note: "A musical lineage in which the raga becomes a vehicle for emotion, devotion and contemplative experience: two voices, one musical lineage, and a living tradition passed from generation to generation.",
          leadPhotos: [photos.mishraDuo],
          artists: [
            {
              name: "Pandit Ritesh Mishra and Pandit Rajnish Mishra",
              role: "Sons of Pandit Rajan Mishra",
              billing: "lead",
              photo: photos.mishraDuo,
              bio: "Sons of Padma Bhushan Pandit Rajan Mishra and nephews of Pandit Sajan Mishra, the brothers are the sixth generation of a 400-year Banaras Gharana lineage. Singing together for over three decades, they have performed at the BBC Proms and Lincoln Center and are Top Grade vocalists of All India Radio.",
            },
            {
              name: "Durjay Bhowmick",
              role: "Tabla",
              details: "Accompanies on tabla for both musical performances of the second evening: the santoor and rabab, and the Banaras Gharana vocal recital.",
            },
            {
              name: "Sumit Mishra",
              role: "Harmonium",
              bio: "A Banaras Gharana harmonium player, taught by his father Pandit Sohan Lal Mishra and uncle Pandit Mohan Lal Mishra, who has accompanied Pandit Rajan and Sajan Mishra on tours of Europe.",
            },
          ],
        },
      ],
    },
  ] as Day[],
  award: {
    title: "Ancient Arts Award 2026",
    recipient: "Padma Shri Madhavi Mudgal",
    text: "A highlight of the festival: the Ancient Arts Award 2026, honouring Padma Shri Madhavi Mudgal's contribution to Indian classical dance.",
    bio: [
      "Some journeys begin in childhood and become a lifetime of devotion. Madhavi Mudgal grew up in a family deeply connected with music, art and learning. Her father, a distinguished educationist, encouraged her artistic journey, and Kathak became her first training ground.",
      "She then turned to Odissi under the legendary Guru Kelucharan Mohapatra, developing a language of dance at once disciplined, lyrical and deeply expressive. Her artistry travelled to prestigious festivals around the world, and as a choreographer she explored new possibilities in group presentations and collaborated closely with musicians, expanding the vocabulary of Odissi while preserving its classical integrity.",
      "In 1990 she received the Padma Shri, recognising her outstanding contribution to Indian dance. At Gandharva Mahavidyalaya, the institution founded by her father, her journey continues as Guru Madhavi Mudgal, shaping young dancers with the same rigour, sensitivity and commitment that shaped her own life.",
    ],
    legacy: "A lifetime given to dance, and a legacy passed on through her disciples.",
    portrait: photos.madhavi,
    archiveIntro: "Photographs from her early years on stage, from 1976 to 1984.",
    archive: [
      { year: "1976", title: "In profile", caption: "Forehead to fingertips in one line: the Odissi she learned from Guru Kelucharan Mohapatra.", photo: art("madhavi-1976", 893, 1400, "Black and white profile portrait of a young Madhavi Mudgal in Odissi make-up and jewellery", { credit: "Avinash Pasricha" }) },
      { year: "1977", title: "Abhinaya", caption: "The art of telling a story with the face and hands, and she is deep in one here.", photo: art("madhavi-1977", 969, 1400, "Black and white photograph of Madhavi Mudgal seated in an Odissi pose with a garland of flowers in her hair", { credit: "Avinash Pasricha" }) },
      { year: "1979", title: "Among temple spires", caption: "In front of old stone temples, whose carved figures Odissi's poses are so often compared to.", photo: art("madhavi-1979", 1059, 1400, "Black and white photograph of Madhavi Mudgal dancing in front of ancient temple spires", { credit: "Avinash Pasricha" }) },
      { year: "1981", title: "Tribhangi", caption: "Head, chest and hip each bending their own way: the stance Odissi is known by.", photo: art("madhavi-1981", 988, 1400, "Black and white photograph of Madhavi Mudgal in a standing Odissi pose", { credit: "Avinash Pasricha" }) },
      { year: "1984", title: "Joy", caption: "Mid-performance, and smiling like someone who loves this.", photo: art("madhavi-1984", 1018, 1400, "Black and white close portrait of Madhavi Mudgal smiling, hand at her chin, in a high-contrast print", { credit: "Avinash Pasricha" }) },
      { title: "With Pandit Durga Lal", caption: "On stage with a Kathak master, the form she first learned.", photo: art("madhavi-duet", 1137, 1400, "Black and white photograph of Madhavi Mudgal and Pandit Durga Lal dancing a Kathak duet", { credit: "Avinash Pasricha" }) },
    ] as ArchivePrint[],
  },
  // Six questions, each answering what people search for or ask at the gate. Keep the facts in step with `days` above.
  faqs: [
    {
      q: "What is IAAF26?",
      a: "IAAF26 is the 9th International Ancient Arts Festival 2026: two evenings of classical and folk dance and classical music at Kamani Auditorium, New Delhi, on 25 and 26 November 2026, presented by Rays of Wisdom Society and curated and directed by Dr. Reela Hota.",
    },
    {
      q: "When and where is it?",
      a: "On 25 and 26 November 2026, from 6:30 pm, at Kamani Auditorium, 1 Copernicus Marg, Mandi House, New Delhi 110001. The nearest metro station is Mandi House (Blue and Violet lines), a 5 to 10 minute walk.",
    },
    {
      q: "What will I see and hear?",
      a: "The first evening, 25 November, is classical and folk dance: Odissi and classical ballet, Bharatanatyam, Kuchipudi, and Kathak meeting the Russian folk dance Sudarushka. The second, 26 November, is classical music: santoor and rabab, then a Hindustani classical vocal recital in the Banaras Gharana tradition. Artists include Dr. Reela Hota, Gauri Diwakar, Arupa Lahiri, Amrita Lahiri, Pandit Abhay Rustum Sopori, Pandit Mukesh Sharma, and Pandit Ritesh Mishra and Pandit Rajnish Mishra. The Ancient Arts Award 2026 goes to Padma Shri Madhavi Mudgal.",
    },
    {
      q: "Do I need an e-pass, and who does it cover?",
      a: "Yes. Make one in the e-pass section and show it at the gate, on your phone or printed. One e-pass admits up to 4 people, including you; for a larger group, make another with \"Get a pass for someone else\". Choose \"Both evenings\" and it is checked in once each evening, or pick a single evening and it is valid that evening only.",
    },
    {
      q: "What if I lose my pass?",
      a: "Open this page on the same phone and it is still there. Or give the gate team your name and pass number.",
    },
    {
      q: "Who can I contact?",
      a: `Call the project coordinator, ${org.coordinator.name}, on ${org.coordinator.phone}, or the office on ${org.mobile} or ${org.landline}. You can also write to ${org.email}.`,
    },
  ],
};

/** Start of the first evening, in India time, for the countdown. */
export const eventStartsAt = `${event.startDate}T18:30:00+05:30`;

export const eveningLabels: Record<Evenings, { short: string; long: string }> = {
  both: { short: "Both evenings", long: "25 and 26 November" },
  day1: { short: "25 Nov", long: "Evening of 25 November" },
  day2: { short: "26 Nov", long: "Evening of 26 November" },
};

/** Totals for the guide line under the hero. */
export const totals = {
  evenings: event.days.length,
  performances: event.days.reduce((n, d) => n + d.sessions.length, 0),
  artists: new Set(event.days.flatMap((d) => d.sessions.flatMap((s) => s.artists.flatMap((a) => (a.name.includes(" and ") ? a.name.split(/, | and /) : [a.name]))))).size,
};
