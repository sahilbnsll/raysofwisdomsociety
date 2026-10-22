/**
 * Everything the event page shows lives here. Copy is the client's own text (received 22 Oct 2026);
 * photographs come from "IAAF (2026) artist photographs/" via `npm run images`.
 *
 * Still to come from the client: venue street address, per-performance times and running order
 * (the order inside each evening follows their text), entry policy, social links.
 *
 * `isDraft: true` shows the "DRAFT FOR REVIEW" banner and blocks search indexing.
 */

export interface Photo {
  src: string;
  w: number;
  h: number;
  alt: string;
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
  mantraTemple: art("mantra-temple", 2200, 1467, "Two Odissi dancers seated in a carved stone temple doorway", { position: "50% 55%" }),
  mantraDuo: art("mantra-duo", 2200, 1467, "Two Odissi dancers in green and blue costumes in a playful duet on a dark stage"),
  mantraPair: art("mantra-pair", 2200, 1467, "Two Odissi dancers in matching poses, in green and blue silk"),
  reelaPortrait: art("reela-portrait", 1201, 1800, "Odissi dancer in red silk and silver jewellery with hands in a close, expressive mudra", { position: "50% 30%" }),
  reelaSeated: art("reela-seated", 1201, 1800, "Odissi dancer seated in a namaste pose in a red and maroon costume"),
  reelaPoseA: art("reela-pose-a", 1201, 1800, "Odissi dancer in red and magenta mid-movement against a white backdrop"),
  reelaPoseB: art("reela-pose-b", 1200, 1800, "Odissi dancer in a copper and red costume in a graceful tribhangi pose"),
  arupa: art("arupa-bharatanatyam", 1200, 1800, "Bharatanatyam dancer balanced on one leg in a tan and red costume with a fanned skirt", { position: "50% 30%" }),
  amritaRed: art("amrita-red", 1200, 1800, "Kuchipudi dancer in a red costume with one arm raised high", { position: "50% 25%" }),
  amritaLeap: art("amrita-leap", 1200, 1800, "Kuchipudi dancer in a blue costume leaping with an arm stretched to the sky", { credit: "Priyanka" }),
  amritaRays: art("amrita-rays", 1440, 1800, "Kuchipudi dancer in a red costume lit from behind by a burst of light rays", { credit: "Sai Thejeswar Rao" }),
  amritaPortrait: art("amrita-portrait", 1280, 1600, "Portrait of a Kuchipudi dancer in a cream and blue sari, pointing into the distance", { position: "50% 25%" }),
  gauriTwirl: art("gauri-twirl", 1420, 1800, "Kathak dancer in a purple costume mid-twirl on a dark stage", { position: "50% 35%" }),
  gauriBend: art("gauri-bend", 1286, 1800, "Kathak dancer in purple leaning back with arms stretched wide", { position: "50% 30%" }),
  gauriPortrait: art("gauri-portrait", 2000, 1325, "Kathak dancer in a purple striped dupatta looking to the side with hands raised", { position: "50% 30%" }),
  sudarushkaStage: art("sudarushka-stage", 2000, 1346, "Three Russian dancers in blue sarafans holding embroidered shawls wide on a lit stage", { position: "50% 45%" }),
  sudarushkaGroup: art("sudarushka-group", 1030, 1600, "Russian dancers in blue and white folk costume gathered together in a forest", { position: "50% 35%" }),
  abhaySantoor: art("abhay-santoor", 2000, 1694, "Santoor player in a cream embroidered kurta seated behind his instrument", { position: "50% 35%" }),
  abhayPortrait: art("abhay-portrait", 1261, 1800, "Santoor player in a cream embroidered kurta, hands poised over the strings", { position: "50% 35%" }),
  mukeshRabab: art("mukesh-rabab", 1280, 1060, "Rabab player in a dark kurta with his instrument", { position: "30% 40%" }),
  mishraDuo: art("mishra-duo", 1201, 1800, "Two Hindustani vocalists in brown silk kurtas seated close together against a black backdrop", { position: "50% 35%" }),
  madhavi: art("madhavi-color-a", 1333, 1800, "Madhavi Mudgal in a red Odissi costume with silver jewellery, mid-gesture", { credit: "Ajay Lal", position: "50% 30%" }),
  madhaviB: art("madhavi-color-b", 1600, 1150, "Madhavi Mudgal with hands raised to her ears in an expressive mudra", { credit: "Ajay Lal" }),
  madhaviC: art("madhavi-color-c", 1600, 1067, "Madhavi Mudgal in a red sari, hands curved in a graceful gesture", { credit: "Ajay Lal" }),
};

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
} as const;

export const brand = {
  logo: { src: "/images/brand/iaaf-logo.png", w: 900, h: 901, alt: "Ancient Arts festival emblem: a dancer in silhouette inside a twelve-petal lotus" },
  rays: { src: "/images/brand/rays-logo.png", w: 700, h: 616, alt: "Rays of Wisdom Society logo: a tree beneath a rising sun" },
};

export const curator = {
  name: "Dr. Reela Hota",
  roles: "Odissi Dancer | Choreographer | Author | Researcher",
  affiliations: ["Senior Fellow, Ministry of Culture", "Founder & Director, Rays of Wisdom Society"],
  // The namaste pose is the festival director's pose on the official poster.
  photo: photos.reelaSeated,
};

export interface Session {
  time?: string; // omit until the client supplies per-performance times
  title: string;
  artForm: string;
  performers: string;
  note: string;
  images: Photo[];
}

export interface Day {
  id: string;
  label: string;
  date: string; // ISO yyyy-mm-dd
  theme: string;
  blurb: string;
  sessions: Session[];
}

export interface Act {
  name: string;
  detail: string;
  day: 1 | 2;
  photo: Photo;
}

export interface ArchivePrint {
  photo: Photo;
  /** Year from the photo's file name; omitted when the file name gives none. */
  year?: string;
  title: string;
  caption: string;
}

export const event = {
  isDraft: true,
  slug: "iaaf-2026",
  edition: "9th",
  title: "International Ancient Arts Festival",
  shortTitle: "IAAF 2026",
  subtitle: "Ancient Arts. Universal Consciousness. A World Beyond Boundaries.",
  motto: ["Art", "Heals", "Connects", "Awakens"],
  startDate: "2026-11-25",
  endDate: "2026-11-26",
  start: "6:30 pm",
  timeLabel: "6:30 pm onwards",
  venue: {
    name: "Kamani Auditorium",
    area: "New Delhi",
    address: "", // street address not supplied yet
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kamani+Auditorium+New+Delhi",
  },
  entry: {
    label: "Download your e-pass",
    detail: "Make your e-pass in a minute and show it at the gate on either evening.",
  },
  // Official festival poster (1080 x 1080): used for social sharing previews.
  poster: {
    src: "/images/poster.jpg",
    width: 1080,
    height: 1080,
    alt: "Poster for the 9th International Ancient Art Festival 2026 with nine classical dancers and musicians in colourful costume.",
  },
  intro: "Art has always been more than a performance.",
  about: [
    "Across civilisations, ancient arts have offered a way to understand ourselves, connect with others, and experience the deeper unity that binds humanity.",
    "Since its inception in 2010, the International Ancient Arts Festival has sought to highlight two essential dimensions of ancient arts: their relevance to our well-being and the unifying power of the aesthetic experience.",
    "In a world marked by stress, conflict and growing divisions, these traditions remind us of our shared humanity and our connection to a universal consciousness and energy. They invite us to look beyond geography, language and culture, recognising that understanding one another is an essential step towards a more peaceful society. When we experience each other's traditions, we begin to recognise what connects us rather than what divides us.",
    "In this spirit, the 9th International Ancient Arts Festival 2026, curated and directed by Reela Hota, brings together India's rich classical traditions and international artistic expressions through an exciting programme of dance and music.",
  ],
  closing:
    "The International Ancient Arts Festival celebrates ancient arts not merely as inherited forms, but as living sources of well-being, reflection and connection. Join us for two evenings of classical brilliance, cross-cultural collaboration and the timeless wisdom of ancient arts.",
  programmeIntro:
    "Across these two evenings, dance becomes prayer, movement becomes a shared language, instrumental music opens a dialogue between cultures, and classical singing carries forward the wisdom of an ancient musical heritage.",
  // Running order inside each evening follows the order of the client's text; confirm with them.
  days: [
    {
      id: "day-1",
      label: "Day 1",
      date: "2026-11-25",
      theme: "Dance",
      blurb:
        "The first evening opens with the sacred language of mantra and moves through classical dance, ending with a meeting of Indian and Russian circle dance.",
      sessions: [
        {
          title: "Sanskrit: The Mantra Bhasha",
          artForm: "Odissi & Classical Ballet",
          performers: "Reela Hota, Joe Mathew, Princess Panigrahi and Priyanka Das",
          note: "An innovative collaboration exploring the healing potential of ancient language, movement and music.",
          images: [photos.mantraTemple],
        },
        {
          title: "Bharatanatyam",
          artForm: "Bharatanatyam",
          performers: "Arupa Lahiri",
          note: "Where dance becomes a pathway to prayer and inner stillness.",
          images: [photos.arupa],
        },
        {
          title: "Kuchipudi",
          artForm: "Kuchipudi",
          performers: "Amrita Lahiri",
          note: "An ancient tradition that continues to evolve through generations of artists.",
          images: [photos.amritaLeap],
        },
        {
          title: "Kathak meets Sudarushka",
          artForm: "Kathak & Russian folk dance",
          performers: "Gauri Diwakar with Mariia Timashova, Mariia Agafonova and Yana",
          note: "Indian classical dance in dialogue with the Russian folk circle dance.",
          images: [photos.sudarushkaStage, photos.gauriBend],
        },
      ],
    },
    {
      id: "day-2",
      label: "Day 2",
      date: "2026-11-26",
      theme: "Music",
      blurb:
        "The second evening turns to the meditative dimensions of music, from the strings of the santoor and rabab to the raga of the Banaras Gharana.",
      sessions: [
        {
          title: "Santoor and rabab",
          artForm: "Instrumental",
          performers:
            "Pandit Abhay Sopori (santoor) and Pandit Mukesh Sharma (rabab), with Rishi Shankar Upadhyay (pakhawaj) and Durjay Bhowmick (tabla)",
          note: "The resonance of the Iranian rabab and the Indian santoor in a dialogue across cultures.",
          images: [photos.abhaySantoor, photos.mukeshRabab],
        },
        {
          title: "Hindustani classical vocal recital",
          artForm: "Banaras Gharana",
          performers:
            "Pandit Ritesh Mishra and Pandit Rajnish Mishra, with Durjay Bhowmick (tabla) and Sumit Mishra (harmonium)",
          note: "Two voices, one musical lineage, and a living tradition passed from generation to generation.",
          images: [photos.mishraDuo],
        },
      ],
    },
  ] as Day[],
  acts: [
    { name: "Reela Hota & ensemble", detail: "Odissi and Classical Ballet · Sanskrit: The Mantra Bhasha", day: 1, photo: photos.reelaPortrait },
    { name: "Arupa Lahiri", detail: "Bharatanatyam", day: 1, photo: photos.arupa },
    { name: "Amrita Lahiri", detail: "Kuchipudi", day: 1, photo: photos.amritaPortrait },
    { name: "Gauri Diwakar", detail: "Kathak", day: 1, photo: photos.gauriBend },
    { name: "Mariia Timashova, Mariia Agafonova & Yana", detail: "Sudarushka, the Russian folk circle dance", day: 1, photo: photos.sudarushkaGroup },
    { name: "Pandit Abhay Sopori", detail: "Santoor", day: 2, photo: photos.abhayPortrait },
    { name: "Pandit Mukesh Sharma", detail: "Rabab", day: 2, photo: photos.mukeshRabab },
    { name: "Pandit Ritesh Mishra & Pandit Rajnish Mishra", detail: "Hindustani classical vocal · Banaras Gharana", day: 2, photo: photos.mishraDuo },
  ] as Act[],
  alsoOnStage: [
    "Joe Mathew",
    "Princess Panigrahi",
    "Priyanka Das",
    "Rishi Shankar Upadhyay (pakhawaj)",
    "Durjay Bhowmick (tabla)",
    "Sumit Mishra (harmonium)",
  ],
  award: {
    title: "Ancient Arts Award 2026",
    recipient: "Padma Shri Madhavi Mudgal",
    text: "A special highlight of the festival: the presentation of the Ancient Arts Award 2026, honouring Padma Shri Madhavi Mudgal's outstanding contribution to Indian classical dance.",
    portrait: photos.madhavi,
    archiveIntro: "Photographs from her early years on stage, from 1976 to 1984.",
    archive: [
      { year: "1976", title: "In profile", caption: "The eyes and hands that carry Odissi's storytelling.", photo: art("madhavi-1976", 893, 1400, "Black and white profile portrait of a young Madhavi Mudgal in Odissi make-up and jewellery", { credit: "Avinash Pasricha" }) },
      { year: "1977", title: "Abhinaya", caption: "A seated moment of expression, the dancer's art of telling a story without words.", photo: art("madhavi-1977", 969, 1400, "Black and white photograph of Madhavi Mudgal seated in an Odissi pose with a garland of flowers in her hair", { credit: "Avinash Pasricha" }) },
      { year: "1979", title: "Among temple spires", caption: "Dancing before ancient stone, where India's classical dance first found its home.", photo: art("madhavi-1979", 1059, 1400, "Black and white photograph of Madhavi Mudgal dancing in front of the Khajuraho temples", { credit: "Avinash Pasricha" }) },
      { year: "1981", title: "Tribhangi", caption: "The triple bend of head, torso and hip at the heart of Odissi.", photo: art("madhavi-1981", 988, 1400, "Black and white photograph of Madhavi Mudgal in a standing Odissi pose", { credit: "Avinash Pasricha" }) },
      { year: "1984", title: "Joy", caption: "A smile caught mid-performance, light and unguarded.", photo: art("madhavi-1984", 1018, 1400, "Black and white close portrait of Madhavi Mudgal smiling, hand at her chin, in a high-contrast print", { credit: "Avinash Pasricha" }) },
      { title: "With Pandit Durga Lal", caption: "In duet with the Kathak maestro: two traditions sharing one stage.", photo: art("madhavi-duet", 1137, 1400, "Black and white photograph of Madhavi Mudgal and Pandit Durga Lal dancing a Kathak duet", { credit: "Avinash Pasricha" }) },
    ] as ArchivePrint[],
  },
  gallery: [
    { photo: photos.mantraDuo, caption: "Odissi duet" },
    { photo: photos.amritaRays, caption: "Kuchipudi" },
    { photo: photos.reelaPoseA, caption: "Odissi" },
    { photo: photos.gauriPortrait, caption: "Kathak" },
    { photo: photos.madhaviB, caption: "Madhavi Mudgal" },
    { photo: photos.mantraPair, caption: "Odissi" },
    { photo: photos.reelaPoseB, caption: "Odissi" },
    { photo: photos.sudarushkaStage, caption: "Sudarushka" },
    { photo: photos.reelaSeated, caption: "Odissi" },
    { photo: photos.madhaviC, caption: "Madhavi Mudgal" },
  ] as { photo: Photo; caption: string }[],
  faqs: [
    {
      q: "When and where is the festival?",
      a: "25 and 26 November 2026 at Kamani Auditorium, New Delhi. Each evening begins at 6:30 pm.",
    },
    {
      q: "How do I get an e-pass?",
      a: "Scroll to the e-pass section, enter your name, the number of people and the evening you plan to attend. Your pass saves to your device as an image with a personal QR code.",
    },
    {
      q: "Can I bring guests?",
      a: "Yes. A single e-pass can cover up to 4 people, including you.",
    },
    {
      q: "What should I show at the gate?",
      a: "Show the e-pass on your phone or a printout. Scanning its QR code opens a page confirming the pass is valid.",
    },
    {
      q: "Who do I contact with questions?",
      a: `Call ${org.landline} or ${org.mobile}, or write to ${org.email}.`,
    },
  ],
};

/** One credits line for the footer, instead of a caption on every picture. Names come from the photo file names. */
export const photoCredits =
  "Photographs of Madhavi Mudgal by Avinash Pasricha (archive) and Ajay Lal. Kuchipudi photographs by Priyanka and Sai Thejeswar Rao.";

/** Start of the first evening, in India time, for the countdown. */
export const eventStartsAt = `${event.startDate}T18:30:00+05:30`;

export type Evenings = "both" | "day1" | "day2";
export const eveningLabels: Record<Evenings, { short: string; long: string }> = {
  both: { short: "Both evenings", long: "25 and 26 November" },
  day1: { short: "25 Nov", long: "Evening of 25 November" },
  day2: { short: "26 Nov", long: "Evening of 26 November" },
};
