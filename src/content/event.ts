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
  mantraTemple: art("mantra-temple", 2200, 1467, "Two Odissi dancers seated in a carved stone temple doorway", { position: "50% 60%" }),
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
  abhaySantoor: art("abhay-santoor", 2000, 1694, "Abhay Sopori in a cream embroidered kurta seated behind his santoor", { position: "50% 40%" }),
  abhayPortrait: art("abhay-portrait", 1261, 1800, "Abhay Sopori in a cream embroidered kurta, hands poised over the santoor strings", { position: "50% 22%" }),
  mukeshRabab: art("mukesh-rabab", 1280, 1060, "Mukesh Sharma in a dark kurta playing the rabab", { position: "36% 30%" }),
  mishraDuo: art("mishra-duo", 1201, 1800, "Ritesh and Rajnish Mishra in brown silk kurtas seated close together against a black backdrop", { position: "50% 30%" }),
  madhavi: art("madhavi-color-a", 1333, 1800, "Madhavi Mudgal in a red Odissi costume with silver jewellery, mid-gesture", { credit: "Ajay Lal", position: "50% 25%" }),
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

export interface Logo {
  name: string;
  src: string;
  w: number;
  h: number;
}

export const brand = {
  logo: { src: "/images/brand/iaaf-logo.png", w: 900, h: 901, alt: "Ancient Arts festival emblem: a dancer in silhouette inside a twelve-petal lotus" },
  rays: { src: "/images/brand/rays-logo.png", w: 700, h: 616, alt: "Rays of Wisdom Society logo: a tree beneath a rising sun" },
};

/** Sponsors, in the order they appear on the printed pass. */
export const sponsors: Logo[] = [
  { name: "Chadha Papers", src: "/images/brand/chadha-papers.png", w: 600, h: 370 },
  { name: "Modi Groups", src: "/images/brand/modi-groups.png", w: 640, h: 276 },
];

export const curator = {
  name: "Dr. Reela Hota",
  roles: "Odissi dancer, choreographer, author and researcher",
  affiliations: ["Senior Fellow, Ministry of Culture", "Founder and Director, Rays of Wisdom Society"],
  bio: [
    "Reela Hota began learning Odissi at eight under Guru Gangadhar Pradhan and went on to study with Guru Kelucharan Mohapatra and Madhavi Mudgal, this year's Ancient Arts Award laureate.",
    "Raised around dance, yoga and ashram life by her mother, the yoga teacher Bijoylaxmi Hota, she has spent her career bringing the spiritual and therapeutic side of Odissi to the stage, the subject of her book Odissi Dance: Therapeutics, Aesthetics and Metaphysics.",
  ],
  // The namaste pose is the festival director's pose on the official poster.
  photo: photos.reelaSeated,
};

export interface Artist {
  name: string;
  role: string;
  bio?: string;
  /** Portrait for the bio sheet; artists without a photograph get a monogram. */
  photo?: Photo;
}

export interface Session {
  id: string;
  time?: string; // omit until the client supplies per-performance times
  title: string;
  artForm: string;
  note: string;
  /** Short line under the title naming who performs. */
  performers: string;
  images: Photo[];
  artists: Artist[];
}

export interface Day {
  id: "day-1" | "day-2";
  evening: "day1" | "day2";
  label: string;
  date: string; // ISO yyyy-mm-dd
  theme: string;
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
  isDraft: true,
  slug: "iaaf-2026",
  edition: "9th",
  title: "International Ancient Arts Festival",
  shortTitle: "IAAF 2026",
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
  // Official festival poster (1080 x 1080): used for social sharing previews.
  poster: {
    src: "/images/poster.jpg",
    width: 1080,
    height: 1080,
    alt: "Poster for the 9th International Ancient Art Festival 2026 with nine classical dancers and musicians in colourful costume.",
  },
  /** The five arches under the hero title: dance and music, one photograph of each tradition. */
  arcade: [
    { photo: photos.reelaPoseB, label: "Odissi" },
    { photo: photos.arupaSeated, label: "Bharatanatyam" },
    { photo: photos.amritaRed, label: "Kuchipudi" },
    { photo: photos.gauriTwirl, label: "Kathak" },
    { photo: photos.abhayPortrait, label: "Santoor" },
  ],
  intro: "Art has always been more than a performance.",
  about: [
    "Across civilisations, ancient arts have offered a way to understand ourselves, connect with others, and experience the deeper unity that binds humanity.",
    "Since its inception in 2010, the International Ancient Arts Festival has sought to highlight two essential dimensions of ancient arts: their relevance to our well-being and the unifying power of the aesthetic experience.",
    "In a world marked by stress, conflict and growing divisions, these traditions remind us of our shared humanity and our connection to a universal consciousness and energy. When we experience each other's traditions, we begin to recognise what connects us rather than what divides us.",
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
      theme: "Dance",
      blurb:
        "The evening opens with the sacred language of mantra and moves through classical dance, ending with a meeting of Indian and Russian circle dance.",
      sessions: [
        {
          id: "mantra-bhasha",
          title: "Sanskrit: The Mantra Bhasha",
          artForm: "Odissi and Classical Ballet",
          performers: "Reela Hota, Joe Mathew, Princess Panigrahi and Priyanka Das",
          note: "An innovative collaboration exploring the healing potential of ancient language, movement and music, as Odissi and classical ballet share one stage.",
          images: [photos.mantraTemple, photos.mantraDuo],
          artists: [
            {
              name: "Reela Hota",
              role: "Odissi, festival director",
              bio: "An Odissi dancer, choreographer and author trained by Guru Gangadhar Pradhan, Guru Kelucharan Mohapatra and Madhavi Mudgal, known for bringing the spiritual and therapeutic dimension of Odissi to the stage.",
              photo: photos.reelaPortrait,
            },
            { name: "Joe Mathew", role: "Dancer" },
            { name: "Princess Panigrahi", role: "Dancer" },
            { name: "Priyanka Das", role: "Dancer" },
          ],
        },
        {
          id: "bharatanatyam",
          title: "Bharatanatyam",
          artForm: "Bharatanatyam",
          performers: "Arupa Lahiri",
          note: "Where dance reaches back to its sacred origins and becomes a pathway to prayer and inner stillness.",
          images: [photos.arupa],
          artists: [
            {
              name: "Arupa Lahiri",
              role: "Bharatanatyam",
              photo: photos.arupaSeated,
              bio: "A dancer of the Vazhuvoor style, she trained for more than fifteen years under Padma Shri Chitra Visweswaran in Chennai. She received the Sangeet Natak Akademi's Ustad Bismillah Khan Yuva Puraskar in 2019 and has performed across India and in the UK, USA, France, Germany and Australia.",
            },
          ],
        },
        {
          id: "kuchipudi",
          title: "Kuchipudi",
          artForm: "Kuchipudi",
          performers: "Amrita Lahiri",
          note: "An ancient tradition that continues to evolve through generations of artists.",
          images: [photos.amritaLeap, photos.amritaRays],
          artists: [
            {
              name: "Amrita Lahiri",
              role: "Kuchipudi",
              bio: "She began Kuchipudi in Washington, D.C. with Anuradha Nehru, made her solo debut at the India International Centre in 1996 and went on to train in Bharatanatyam with Leela Samson. An empanelled artist of the Indian Council for Cultural Relations, she has toured as a soloist in India and abroad and has led dance programming at the National Centre for the Performing Arts, Mumbai.",
              photo: photos.amritaPortrait,
            },
          ],
        },
        {
          id: "kathak-sudarushka",
          title: "Kathak meets Sudarushka",
          artForm: "Kathak and Russian folk dance",
          performers: "Gauri Diwakar with Mariia Timashova, Mariia Agafonova and Yana",
          note: "Indian classical dance in dialogue with the Russian folk circle dance: two traditions, rooted in different histories, in one shared circle of movement.",
          images: [photos.sudarushkaStage, photos.gauriBend],
          artists: [
            {
              name: "Gauri Diwakar",
              role: "Kathak",
              bio: "Born in Jamshedpur, she trained at Kathak Kendra, New Delhi under Pandit Jaikishan Maharaj and Pandit Birju Maharaj, and was for many years a lead dancer with Aditi Mangaldas's Drishtikon Dance Foundation. A recipient of the Ustad Bismillah Khan Yuva Puraskar (2008), she has presented her work at Sadler's Wells in London and the Edinburgh Festival Fringe, and teaches at Kathak Kendra.",
              photo: photos.gauriPortrait,
            },
            {
              name: "Mariia Timashova, Mariia Agafonova and Yana",
              role: "Sudarushka, Russian folk dance",
              bio: "Sudarushka, loosely \"sweetheart\", is a Russian folk dance. Here it is danced in the spirit of the khorovod, the old Slavic circle dance in which dancers join hands and move together in a ring.",
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
      theme: "Music",
      blurb:
        "The evening turns to the meditative dimensions of music, from the strings of the santoor and rabab to the raga of the Banaras Gharana.",
      sessions: [
        {
          id: "santoor-rabab",
          title: "Santoor and rabab",
          artForm: "Instrumental",
          performers: "Pandit Abhay Sopori and Pandit Mukesh Sharma, with Rishi Shankar Upadhyay and Durjay Bhowmick",
          note: "The resonance of the Iranian rabab and the Indian santoor in a dialogue across cultures, celebrating music's capacity to carry memory and identity beyond the boundaries of language.",
          images: [photos.abhaySantoor, photos.mukeshRabab],
          artists: [
            {
              name: "Pandit Abhay Rustum Sopori",
              role: "Santoor",
              photo: photos.abhayPortrait,
              bio: "A santoor player, composer and conductor from Kashmir, he is the son and disciple of the santoor maestro Pandit Bhajan Sopori and carries forward the Sufiana gharana, a family tradition of more than 300 years. He is among the youngest recipients of the Ustad Bismillah Khan Yuva Puraskar.",
            },
            {
              name: "Pandit Mukesh Sharma",
              role: "Rabab",
              photo: photos.mukeshRabab,
              bio: "A Delhi-based sarod virtuoso who also plays the rabab, the older lute from which the sarod descends. He has toured widely and collaborated with musicians in France and Germany and with flamenco artists in Spain.",
            },
            {
              name: "Rishi Shankar Upadhyay",
              role: "Pakhawaj",
              bio: "A pakhawaj player from Gaya, Bihar, trained by his father Pandit Ravi Shankar Upadhyay in the family's Pandit Vasudev Upadhyay tradition. He received the Ustad Bismillah Khan Yuva Puraskar in 2023 and is an A-grade artist of All India Radio.",
            },
            { name: "Durjay Bhowmick", role: "Tabla" },
          ],
        },
        {
          id: "vocal",
          title: "Hindustani classical vocal",
          artForm: "Banaras Gharana",
          performers: "Pandit Ritesh Mishra and Pandit Rajnish Mishra, with Durjay Bhowmick and Sumit Mishra",
          note: "Two voices, one musical lineage: the raga as a vehicle for emotion, devotion and contemplation, passed from generation to generation.",
          images: [photos.mishraDuo],
          artists: [
            {
              name: "Pandit Ritesh Mishra and Pandit Rajnish Mishra",
              role: "Vocal duo, Banaras Gharana",
              photo: photos.mishraDuo,
              bio: "Sons of Padma Bhushan Pandit Rajan Mishra and nephews of Pandit Sajan Mishra, the brothers are the sixth generation of a Banaras Gharana family with a musical lineage of some 400 years. Singing together for more than three decades, they have performed at the BBC Proms at the Royal Albert Hall, at Lincoln Center in New York and at the closing ceremony of the 2002 Commonwealth Games, and are Top Grade vocalists of All India Radio.",
            },
            { name: "Durjay Bhowmick", role: "Tabla" },
            {
              name: "Sumit Mishra",
              role: "Harmonium",
              bio: "A harmonium player of the Banaras Gharana, taught by his father Pandit Sohan Lal Mishra and uncle Pandit Mohan Lal Mishra with guidance from Pandit Kishan Maharaj, he has accompanied Pandit Rajan and Sajan Mishra on tours of Europe.",
            },
          ],
        },
      ],
    },
  ] as Day[],
  award: {
    title: "Ancient Arts Award 2026",
    recipient: "Padma Shri Madhavi Mudgal",
    text: "A special highlight of the festival: the presentation of the Ancient Arts Award 2026, honouring Padma Shri Madhavi Mudgal's outstanding contribution to Indian classical dance.",
    bio: [
      "Born in 1951 into the family of Vinay Chandra Maudgalya, founder of Delhi's Gandharva Mahavidyalaya, Madhavi Mudgal studied Kathak and Bharatanatyam before giving her life to Odissi under gurus including Kelucharan Mohapatra.",
      "Across more than five decades as a dancer, choreographer and teacher she has taken Odissi to stages around the world and trained generations of dancers, among them the festival's own director. Her honours include the Padma Shri (1990) and the Sangeet Natak Akademi Award (2000).",
    ],
    portrait: photos.madhavi,
    archiveIntro: "Photographs from her early years on stage, from 1976 to 1984.",
    archive: [
      { year: "1976", title: "In profile", caption: "The eyes and hands that carry Odissi's storytelling.", photo: art("madhavi-1976", 893, 1400, "Black and white profile portrait of a young Madhavi Mudgal in Odissi make-up and jewellery", { credit: "Avinash Pasricha" }) },
      { year: "1977", title: "Abhinaya", caption: "A seated moment of expression, the dancer's art of telling a story without words.", photo: art("madhavi-1977", 969, 1400, "Black and white photograph of Madhavi Mudgal seated in an Odissi pose with a garland of flowers in her hair", { credit: "Avinash Pasricha" }) },
      { year: "1979", title: "Among temple spires", caption: "Dancing before ancient stone, where India's classical dance first found its home.", photo: art("madhavi-1979", 1059, 1400, "Black and white photograph of Madhavi Mudgal dancing in front of ancient temple spires", { credit: "Avinash Pasricha" }) },
      { year: "1981", title: "Tribhangi", caption: "The triple bend of head, torso and hip at the heart of Odissi.", photo: art("madhavi-1981", 988, 1400, "Black and white photograph of Madhavi Mudgal in a standing Odissi pose", { credit: "Avinash Pasricha" }) },
      { year: "1984", title: "Joy", caption: "A smile caught mid-performance, light and unguarded.", photo: art("madhavi-1984", 1018, 1400, "Black and white close portrait of Madhavi Mudgal smiling, hand at her chin, in a high-contrast print", { credit: "Avinash Pasricha" }) },
      { title: "With Pandit Durga Lal", caption: "In duet with the Kathak maestro: two traditions sharing one stage.", photo: art("madhavi-duet", 1137, 1400, "Black and white photograph of Madhavi Mudgal and Pandit Durga Lal dancing a Kathak duet", { credit: "Avinash Pasricha" }) },
    ] as ArchivePrint[],
  },
  faqs: [
    {
      q: "Do I need an e-pass?",
      a: "Yes. Make one in the e-pass section, then show it at the gate on your phone or as a printout.",
    },
    {
      q: "Can one pass cover my family?",
      a: "Yes. A single e-pass admits up to 4 people, including you. For a larger group, make another pass with \"Get a pass for someone else\".",
    },
    {
      q: "Is one pass valid for both evenings?",
      a: "Choose \"Both evenings\" when you make it and it is checked in once each evening. A pass for one date is valid on that evening only.",
    },
    {
      q: "I lost my pass. What now?",
      a: "Open this page on the same phone and your pass is still there. You can also tell the gate team your name and pass number.",
    },
    {
      q: "Who do I contact with questions?",
      a: `Call ${org.landline} or ${org.mobile}, or write to ${org.email}.`,
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
