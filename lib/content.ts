// All site copy and media in one place. Copy and order follow Taylor's notes
// in "Taylor's Website.docx". Open questions are tagged Qn (see PLAN.md).
import { PHOTOS, POSTERS } from "./photos.generated";

export type Photo = { src: string; w: number; h: number; alt?: string };

type PhotoKey = keyof typeof PHOTOS;
type VideoId = keyof typeof POSTERS;

const photo = (key: PhotoKey, alt = ""): Photo => ({ ...PHOTOS[key], alt });

// Every photo in a project, in the order prepare-assets.py numbered them.
const series = (prefix: string, alt: string): Photo[] =>
  (Object.keys(PHOTOS) as PhotoKey[]).filter((k) => k.startsWith(`${prefix}-`)).map((k) => photo(k, alt));

const video = (id: VideoId) => ({ yt: id, poster: { ...POSTERS[id], alt: "" } });

export const NAME = "Taylor Lauren Hughes";

// Q11: final domain.
export const SITE_URL = "https://taylorlaurenhughes.com";

export const ROLES = ["Dancer", "Choreographer", "Dance Educator"];

export type NavKey = "about" | "choreo" | "perf" | "teach" | "md" | "portfolio";

export const NAV: { key: NavKey; label: string; path: string }[] = [
  { key: "about", label: "About", path: "/about" },
  { key: "choreo", label: "Choreography", path: "/choreography" },
  { key: "perf", label: "Dance Performance", path: "/performance" },
  { key: "teach", label: "Teaching Philosophy", path: "/teaching" },
  { key: "md", label: "Movement Direction", path: "/movement-direction" },
  { key: "portfolio", label: "Portfolio", path: "/portfolio" },
];

// Single-use photos placed outside the project lists.
export const PLACED = {
  heroStill: photo("md-owens-03", NAME), // MD(3), shown until the reel plays
  about: photo("studio-06", NAME), // IMG_9710, behind the About text and beside the home bio
  teaching: photo("studio-01", "Dancers in the studio"), // IMG_9731
  teaching2: photo("studio-05", "Dancers getting ready for class"), // IMG_9736
};

// Taylor's new bio (Q5 spelling fixes applied: The Place Theatre, Vesper Club, Karhu).
export const BIO =
  "Taylor Lauren Hughes is a choreographer, dancer, and movement artist from Southern California. She trained in contemporary, ballet, jazz, and commercial styles, and holds a BFA in Dance Performance from Chapman University and an MA in Dance Performance from London Contemporary Dance School. Taylor has performed and premiered work across the UK, US, and Europe, including Before the After at The Place Theatre and Act 2 at Vesper Club in London. She has toured internationally with Ballet Nights and appeared in campaigns for Claude x Formula 1 and Zomer x Karhu, featured in Vogue Japan. Her practice explores movement across fashion, commercial, and live performance spaces.";

// Q6: keep under the bio?
export const FACTS: [string, string][] = [
  ["MA", "Dance Performance, London Contemporary Dance School"],
  ["BFA", "Dance Performance, Chapman University"],
  ["Touring", "Ballet Nights"],
  ["Campaigns", "Claude × Formula 1, Zomer × Karhu"],
];

export type Work = {
  id: string;
  title: string;
  detail: string;
  venue?: string;
  yt?: VideoId;
  poster: Photo;
  photos?: Photo[];
  press?: { name: string; href: string }[];
};

// Order as Taylor listed it. Terra (JmEd65aymy4) dropped (Q3).
export const CHOREO: Work[] = [
  { id: "before-the-after", title: "Before the After", detail: "Performer & Choreographer, World Premiere, Resolution Dance Festival", venue: "The Place Theatre, London, UK", ...video("cP7MPj4-uPo") },
  { id: "the-space-between", title: "The Space Between", detail: "Choreographer, Premiere, London Contemporary Dance School", venue: "The Place, London, UK", ...video("7jJ3gfekW1s") },
  { id: "ecid-eht-llor", title: "ecid eht llor", detail: "Choreographer, Spring Dance Concert", venue: "Musco Center for the Arts, Orange, CA", ...video("sU9FKLZcwwg") },
  { id: "locus", title: "Locus", detail: "Dance visual, choreographed and performed by Taylor Lauren Hughes", ...video("qeiWKer3oGQ") }, // Q9: venue
  {
    // No video; the doc places MD(1), MD(3), MD(2) under Abri Residency (Q4, Q9: role).
    id: "act-2", title: "Act 2", detail: "Premiere at Equinox Show with Abri Creative Residency", venue: "Vesper Club, London, UK",
    poster: photo("md-owens-02", "Act 2"),
    photos: [photo("md-owens-02", "Act 2"), photo("md-owens-03", "Act 2"), photo("md-owens-06", "Act 2")],
  },
  { id: "1-618", title: "1.618", detail: "Choreographer, Intime Dance Concert", venue: "Waltmar Theater, Orange, CA", ...video("JM6zBSPJVGE") },
];

export const PERF: Work[] = [
  { id: "claude-f1", title: "Claude × F1", detail: "Dancer, campaign: The Atlassian Williams F1 team is now thinking with Claude", ...video("xpmag2Gvi0g") },
  {
    // Q8: credits (doc says "with Benjamin Jonsson"; Dazed credits Imruh Asha and Danial Aitouganov).
    id: "zomer-karhu", title: "Zomer × Karhu", detail: "Dancer, campaign", venue: "London, UK",
    poster: photo("zomer-01", "Zomer × Karhu campaign"),
    photos: series("zomer", "Zomer × Karhu campaign"),
    press: [
      { name: "Dazed", href: "https://www.dazeddigital.com/fashion/article/66131/1/zomer-karhu-collaboration-new-campaign-imruh-asha-danial-aitouganov-mestari-kesa" },
      { name: "Vogue Japan", href: "https://www.vogue.co.jp/article/karhu-zomer-sneaker-collaboration-interview-masayo-ugawa" },
    ],
  },
  { id: "dis-information", title: "Dis(Information)", detail: "Dancer, by Benjamin Jonsson", ...video("orMNvNEUzB8") },
  { id: "breath", title: "Breath", detail: "Dancer, by Liam Woodvine with Ballet Nights Company", venue: "UK tour", poster: photo("breath-01", "Breath, Ballet Nights Company"), photos: series("breath", "Breath, Ballet Nights Company") },
  { id: "before-the-after-perf", title: "Before the After", detail: "Choreography and performance by Taylor Lauren Hughes", ...video("CWFmWHok1bY") },
  { id: "a-veil-between", title: "Much A Do About Something: A Veil Between", detail: "Dancer, by Riley Roberts Castellant", ...video("lYgOe6lZSsU") },
];

// Home, bottom block: "a video trailer or a recent piece" (Q2).
export const FEATURED = CHOREO[0];

export type Project = { id: string; title: string; role?: string; location?: string; photos: Photo[] };

// Order and copy as Taylor listed them.
export const PROJECTS: Project[] = [
  {
    id: "breath", title: "Breath UK Tour with Ballet Nights Company", role: "Dancer",
    location: "Leicester: The Curve, Glasgow: The Royal Theatre, London: Cadogan Hall, Darlington: The Hippodrome, Leeds: Leeds Playhouse",
    photos: series("breath", "Breath, Ballet Nights Company"),
  },
  { id: "zomer", title: "Zomer × Karhu Campaign (featured in Vogue Japan) with Benjamin Jonsson", role: "Dancer", location: "London, UK", photos: series("zomer", "Zomer × Karhu campaign") },
  { id: "italic", title: "Italic, performed at Femmanifesto Festival", role: "Dancer", location: "Hackney Baths, London, UK", photos: series("italic", "Italic, Femmanifesto Festival") },
  { id: "body-fischer", title: "Body Fischer Choreographic Residency and United States Tour with Yeji Kim", role: "Dancer", location: "Herberger Theater, Phoenix, Arizona", photos: series("body-fischer", "Body Fischer, Yeji Kim") },
  { id: "studio", title: "Studio Session with Isaac Qureshi", role: "Dancer", location: "London, UK", photos: series("studio", "Studio session with Isaac Qureshi") },
  { id: "mokita", title: "Mokita with Dickson Mbi", role: "Dancer", location: "London, UK", photos: series("mokita", "Mokita, Dickson Mbi") },
];

// Patrick Owens first (Taylor's note). Q4: project names.
export const MD: Project[] = [
  { id: "md-owens", title: "Photography by Patrick Owens", photos: series("md-owens", "Movement direction, photographed by Patrick Owens") },
  { id: "md-clandestine", title: "Photography by Clandestine Pilot", photos: series("md-clandestine", "Movement direction, photographed by Clandestine Pilot") },
];

export const TEACH = [
  "My teaching practice stems from the belief that dance is a combination of physical and technical training while also being a creative and expressive outlet. I value diverse training and conditioning the body in a way that gives artists access to a variety of frameworks and allows them to be physically adaptable. In my practice, physical rigor is vital while concurrently ensuring that the delivery is supportive, inclusive, and follows safe practice. I believe that technical training, movement research, and individual agency can work together to develop dancers who are prepared to thrive as thoughtful artists in the current freelance dance industry.",
  "In regard to technique classes, I begin with entering the space and getting the dancers physically and mentally prepared for class by moving through a warm-up that can be repeated every class, with some special emphasis on what will be utilized later in the class. I believe a structured and repetitive warm-up can serve as a marker of improvement while also creating a consistent framework for students to understand and develop their movement practice. I then move into either creative research or progressions across the space. Alongside physical research, I value communication with my students, asking questions and having them reflect on the material and tasks in class. I want students to develop an understanding of not only what they are doing physically, but also why they are making certain choices and how those choices can inform their movement practice. I conclude with some form of choreographic material, which I move through in sections. As I teach, I utilize demonstration, imagery, rhythm, and auditory cues.",
  "Inclusion is a priority and I aim to curate an environment that supports dancers of all genders, identities, and lived experiences. I prioritize inclusivity in my teaching practice by offering different variations and entry points to help dancers at varying levels, experiences, and backgrounds engage with the material. I also encourage them to interact with what is offered in a way that suits their learning, meaning they have agency to adjust the work appropriately to accommodate their needs. It is vital to me that students feel seen; individual feedback is essential. In this way, I aim to create a rigorous environment while also allowing students to learn in a safe way.",
  "As an active dancer, choreographer, and movement artist, I allow the work I am doing in the industry to inform my teaching practice. I bring my experience choreographing and devising material into the space and equip students with the tools to develop their artistic voice, make movement, and collaborate with others. My goal is to support and guide my students to be proficient movers and technicians while also being able to interact with other artists, share ideas, and explain their point of view, as I find these are essential skills for freelance industry dancers and makers. Ultimately, I want students to leave my class with the physical skills to engage with a variety of movement practices, the ability to reflect on and articulate their choices, and the adaptability to apply those skills within different creative environments.",
];

// Q10: confirm email and handle.
export const CONTACT = {
  email: "hello@taylorlaurenhughes.com",
  ig: "@taylorlaurenhughes",
  igHref: "https://instagram.com/taylorlaurenhughes",
};

export const embedUrl = (yt: string) => `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`;
