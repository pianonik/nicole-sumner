/* ============================================================
   Courageous Teachers — content data
   ------------------------------------------------------------
   This is the single source of truth for the prototype. Every
   resource card is one object. When the PHP/MariaDB CMS is added
   later, this same shape becomes the `resources` table and this
   file is replaced by a generated JSON feed — no markup changes.

   resource = {
     id      : stable slug (used for deep links #r/<id>)
     title   : card heading
     topic   : one TOPIC id
     type    : one of TYPES (drives the colored tag + filter)
     grades  : array of GRADE ids ("all" = every band)
     voices  : people cited (powers the Voices index + search)
     body    : the substance of the slide
     source  : attribution / where it came from (optional)
   }
   ============================================================ */

const TOPICS = [
  { id: 'pain-bravery',     n: 'Pain & Bravery',              blurb: 'Handling uncertainty; turning grief and fear into courage.',           color: '#e8231f' },
  { id: 'beloved-community',n: 'Beloved Community',           blurb: 'Intersectionality, citizenship, and standing for justice together.',    color: '#3d6df0' },
  { id: 'brave-voices',     n: 'Brave Voices & Humility',     blurb: 'Cultural humility, brave space, and finding your movement work.',        color: '#13aab3' },
  { id: 'anti-racist',      n: 'Anti-Racist Practice & CRT',  blurb: 'Anti-racist teaching, critical race theory, and meeting pushback.',      color: '#c11a17' },
  { id: 'ethnic-studies',   n: 'Ethnic Studies',              blurb: 'Liberatory, identity-centered curriculum from TK through 12.',           color: '#ee7a2b' },
  { id: 'play-inquiry',     n: 'Play & Inquiry',              blurb: 'Reclaiming play as a social-justice and creative practice.',             color: '#0f9aa2' },
  { id: 'media-literacy',   n: 'Media Literacy',              blurb: 'Critiquing pop culture and historical narrative; visible thinking.',     color: '#5a5fd0' },
  { id: 'design-thinking',  n: 'Design Thinking',             blurb: 'Maker-centered learning and designing for justice, EC to 12.',           color: '#d98a1f' },
  { id: 'activism',         n: 'Activism & Artivism',         blurb: 'Feminism, art builds, and a spectrum of action you can take.',           color: '#d61e63' },
  { id: 'youth-voice',      n: 'Youth Voice & Poetry',        blurb: 'Spoken word, SLAM, and youth as citizen-activists.',                     color: '#b5388a' },
  { id: 'abolition',        n: 'Abolition & Peace',           blurb: 'Histories of abolition, peace studies, and image theatre.',              color: '#2c3a8c' },
  { id: 'arts-integration', n: 'Arts Integration',            blurb: 'Music, visual art, and cross-cutting concepts across subjects.',         color: '#ee5a2b' },
  { id: 'gender-books',     n: 'Gender & Banned Books',       blurb: 'Body, mind, gender identity, and confronting censorship.',               color: '#8a3fd0' },
  { id: 'scorecard',        n: 'Curriculum Scorecard',        blurb: 'A rubric to audit how culturally responsive your materials are.',        color: '#1b8f6a' },
];

/* Types echo Nicole's own color key (Activity / Thinking Routine /
   Resource), expanded with the content forms in the deck. */
const TYPES = [
  { id: 'activity',  n: 'Activity',         color: '#e8231f' }, /* her red */
  { id: 'routine',   n: 'Thinking Routine', color: '#13aab3' }, /* her cyan */
  { id: 'resource',  n: 'Resource',         color: '#1b1b1b' }, /* black */
  { id: 'quote',     n: 'Quote',            color: '#ee7a2b' }, /* logo orange */
  { id: 'concept',   n: 'Concept',          color: '#b5388a' },
  { id: 'definition',n: 'Definition',       color: '#3d6df0' },
  { id: 'media',     n: 'Media',            color: '#0f9aa2' },
];

const GRADES = [
  { id: 'ec',     n: 'Early Childhood' },
  { id: 'k5',     n: 'K–5' },
  { id: 'm',      n: '6–8' },
  { id: 'h',      n: '9–12' },
  { id: 'higher', n: 'Higher Ed' },
];

const RESOURCES = [
  /* ---------- PAIN & BRAVERY (fully populated section) ---------- */
  {
    id: 'macy-grief-love', topic: 'pain-bravery', type: 'quote', grades: ['all'],
    voices: ['Joanna Macy'],
    title: 'Our grief is a manifestation of our love',
    body: '“Our grief itself is a manifestation of our love — we wouldn’t mourn what we don’t love. Our fear demonstrates courage in the speaking of it. Our anger is an outcry of passion for justice. The emptiness we feel is actually, painful as it is, a place where the new can arise. Hope is the ground on which we meet.”',
    source: 'Joanna Macy, eco-philosopher',
  },
  {
    id: 'lens-to-mirror', topic: 'pain-bravery', type: 'concept', grades: ['higher'],
    voices: [],
    title: 'Shifting from “lens” to “mirror”',
    body: 'A core move of this work: stop treating equity as a lens you look through at others, and turn it into a mirror you look into yourself. The questions become about who we are becoming, not only what we observe.',
  },
  {
    id: 'three-universal-points', topic: 'pain-bravery', type: 'concept', grades: ['higher'],
    voices: ['Joanna Macy'],
    title: 'Three things to remember about uncertainty',
    body: 'Regardless of party or status: (1) This uncertainty about whether life will go on is universal. (2) This anguish is unprecedented. (3) We tend to block it because it’s so huge. Suppressing these emotions renders us obedient, passive, acquiescent — so the question is, how do we face them?',
    source: 'Joanna Macy',
  },
  {
    id: 'who-do-we-become', topic: 'pain-bravery', type: 'concept', grades: ['higher'],
    voices: ['Ben McBride', 'Shawn Ginwright'],
    title: 'The wrong first question, the right first question',
    body: 'The wrong first question is, “What do we need to do?” The right first question is, “Who do we need to become?” Hold three types of knowing together: foresight, hindsight, and insight.',
    source: 'Ben McBride, interviewed by Dr. Shawn Ginwright (The Four Pivots)',
  },
  {
    id: 'octavia-thousands', topic: 'pain-bravery', type: 'quote', grades: ['all'],
    voices: ['Octavia Butler'],
    title: 'You can be one of the thousands of answers',
    body: '“There’s no single answer that will solve all of our future problems. There’s no magic bullet. Instead there are thousands of answers — at least. You can be one of them if you choose to be.”',
    source: 'Octavia Butler',
  },
  {
    id: 'truth-mandala', topic: 'pain-bravery', type: 'activity', grades: ['m', 'h', 'higher'],
    voices: ['Joanna Macy'],
    title: 'The Truth Mandala — a ritual for honoring grief',
    body: 'A multi-age community ritual. The group sets up a mandala with four quadrants holding objects: a stone (fear), dry leaves (sorrow), a stick (anger), and an empty bowl (emptiness/need). A cloth in the center is for anything that doesn’t fit. Participants step in and speak their pain for the world. The ground of the whole mandala is hope. Three things NOT to do: don’t tell people what to feel; don’t judge by outer demeanor; don’t distract by over-comforting.',
    source: 'Joanna Macy, The Work That Reconnects',
  },
  {
    id: 'pain-as-compassion', topic: 'pain-bravery', type: 'concept', grades: ['all'],
    voices: ['Joanna Macy'],
    title: 'Reframing pain for the world as compassion',
    body: '“Please notice how the concerns you’ve been expressing extend beyond your individual ego… You are capable of suffering with our world. To suffer with — that’s the literal meaning of compassion… We reframe our pain for the world as compassion.”',
    source: 'Joanna Macy',
  },
  {
    id: 'emotions-of-world', topic: 'pain-bravery', type: 'routine', grades: ['m', 'h', 'higher'],
    voices: ['Joanna Macy'],
    title: 'Naming our emotions for a world in crisis',
    body: 'A reflective prompt: What is your response to a world in suffering? Name and sit with the full range — grief, fear, anger, guilt, futility, powerlessness, outrage — understanding they spring not from personal weakness but from our interconnectedness with all life.',
  },
  {
    id: 'vandana-shiva', topic: 'pain-bravery', type: 'resource', grades: ['h', 'higher'],
    voices: ['Vandana Shiva'],
    title: 'Learning from those with experience: Vandana Shiva',
    body: 'Indian quantum physicist turned ecologist, author of Oneness vs the 1%. “Every place with biodiversity, with wilderness, is a place where caring, compassionate, loving people are. We need to learn from indigenous people… how to create economies that do not push biodiversity to extinction.” Bring living leaders into the classroom.',
    source: 'Vandana Shiva (7-min video excerpt)',
  },
  {
    id: 'sadhguru-soil', topic: 'pain-bravery', type: 'quote', grades: ['h', 'higher'],
    voices: ['Sadhguru'],
    title: 'A wake-up call, not a doomsday prediction',
    body: '“This is not a doomsday prediction. This is a wakeup call… if we do the right things right now, in another 15–20 years we can make a significant turnaround… Soil is one thing which is a common factor for all of us.” How does our response change when we shift from prediction to a call to action?',
    source: 'Sadhguru, yogi and author',
  },
  {
    id: 'siara-edmond', topic: 'pain-bravery', type: 'quote', grades: ['all'],
    voices: ['Siara Edmond'],
    title: 'Follow the lead of courageous youth',
    body: '“I’d rather get the answer wrong than never attempt the problem.”',
    source: 'Siara Edmond, Oakland Youth Poet Laureate finalist, 2019',
  },
  {
    id: 'on-being-ecology', topic: 'pain-bravery', type: 'resource', grades: ['higher'],
    voices: ['Joanna Macy'],
    title: 'The On Being Project: Ecology & Nature',
    body: 'A resource pursuing deep thinking and moral imagination, social courage and joy — to renew inner life, outer life, and life together.',
    source: 'onbeing.org',
  },

  /* ---------- BELOVED COMMUNITY & INTERSECTIONALITY ---------- */
  {
    id: 'hooks-beloved', topic: 'beloved-community', type: 'quote', grades: ['all'],
    voices: ['bell hooks'],
    title: 'A beloved community stands for justice',
    body: '“If we want a beloved community, we must stand for justice, have recognition for difference without attaching difference to privilege.”',
    source: 'bell hooks',
  },
  {
    id: 'children-citizens', topic: 'beloved-community', type: 'concept', grades: ['ec', 'k5'],
    voices: ['Mara Krechevsky'],
    title: 'Children are citizens — now, not someday',
    body: 'Even four-year-olds are current citizens of their cities — not future, not hypothetical, not citizens-in-training. They make meaningful contributions, have ideas and opinions, and can shape a meaningful curriculum. How are we supporting children in participating in democracy?',
    source: 'Mara Krechevsky, Project Zero — Children Are Citizens',
  },
  {
    id: 'intersectionality', topic: 'beloved-community', type: 'definition', grades: ['h', 'higher'],
    voices: ['Kimberlé Crenshaw'],
    title: 'Intersectionality: ten key components',
    body: 'Coined by Kimberlé Williams Crenshaw, intersectionality recognizes that certain individuals face multiple, intersecting forms of structural discrimination. Ten components: multiple struggles, intersecting oppressions, voice, inclusivity, family, disaggregated data, intersecting & cross issues, collaboration, health, community.',
    source: 'See TheOpportunityAgenda for these ten in action',
  },
  {
    id: 'charles-white', topic: 'beloved-community', type: 'quote', grades: ['all'],
    voices: ['Charles White'],
    title: 'Art must ally itself with liberation',
    body: '“Art must be an integral part of the struggle. It can’t simply mirror what’s taking place… It must ally itself with the forces of liberation.”',
    source: 'Charles White: A Retrospective, MoMA, 2018–19',
  },
  {
    id: 'alicia-keys-culture', topic: 'beloved-community', type: 'quote', grades: ['h', 'higher'],
    voices: ['Alicia Keys'],
    title: 'Cultural change precedes policy change',
    body: '“Cultural change always precedes policy change. The energy that led the Women’s March precedes legislation on sexual harassment. The student outcry that became March for Our Lives precedes gun reform. The determination that launched Black Lives Matter will lead to laws that protect us.”',
    source: 'Alicia Keys',
  },

  /* ---------- BRAVE VOICES & CULTURAL HUMILITY ---------- */
  {
    id: 'brave-space', topic: 'brave-voices', type: 'definition', grades: ['m', 'h', 'higher'],
    voices: ['Brian Arao', 'Kristi Clemens'],
    title: 'From safe space to brave space',
    body: 'A brave space has five essentials: (1) controversy with civility, (2) owning intentions and impacts, (3) challenge by choice, (4) respect for one another’s personhood, (5) no attacks. It better prepares students for authentic, challenging dialogue across difference than a “safe space” does.',
    source: 'Arao & Clemens (2013), The Art of Effective Facilitation',
  },
  {
    id: 'land-acknowledgement', topic: 'brave-voices', type: 'activity', grades: ['all'],
    voices: ['Corbin Harney'],
    title: 'Whose land are you on?',
    body: 'As an educator: who are you, and who do you bring into the classroom? On whose shoulders do you stand? What land are you standing on? Use native-land.ca to research the land, and name the artists, ancestors, and activists you carry with you.',
    source: 'native-land.ca',
  },
  {
    id: 'cultural-humility-statement', topic: 'brave-voices', type: 'routine', grades: ['all'],
    voices: [],
    title: 'A cultural-humility statement before every lecture',
    body: '“I’ve done my best in thinking about this topic from an equity lens (insert your knowledge domain), but I don’t know everything about this. You may know more. I invite your feedback.” Put it on a slide, a poster, or simply say it.',
    source: 'Anti-Racism Coalition, Columbia University',
  },
  {
    id: 'cat-brooks-heart-sing', topic: 'brave-voices', type: 'quote', grades: ['all'],
    voices: ['Cat Brooks'],
    title: 'Find the movement work that makes your heart sing',
    body: '“Find the movement work that makes your heart sing and do that right.”',
    source: 'Cat Brooks',
  },

  /* ---------- ANTI-RACIST PRACTICE & CRT ---------- */
  {
    id: 'crt-definition', topic: 'anti-racist', type: 'definition', grades: ['h', 'higher'],
    voices: [],
    title: 'What is critical race theory?',
    body: 'CRT is “a practice of interrogating race and racism in society.” (California Board of Ed.) It recognizes that race is a social construct and that racism is embedded within systems and institutions that perpetuate racial inequality.',
    source: 'California Board of Education',
  },
  {
    id: 'sfsu-first-departments', topic: 'anti-racist', type: 'resource', grades: ['h', 'higher'],
    voices: [],
    title: 'Know your local history: SFSU, 1968',
    body: 'The first Black Studies and Ethnic Studies departments in the US both emerged from the 1968 SFSU student strike. Educate yourself about local history regarding critical education and ethnic studies — it’s a powerful response to censorship.',
    source: 'San Francisco State University',
  },
  {
    id: 'microaggressions-nadal', topic: 'anti-racist', type: 'media', grades: ['h', 'higher'],
    voices: ['Kevin Nadal'],
    title: 'Navigating microaggressions in everyday life',
    body: 'A video with Professor Kevin Nadal on recognizing and responding to microaggressions — useful for both educator self-education and classroom discussion.',
    source: 'Prof. Kevin Nadal (video)',
  },

  /* ---------- ETHNIC STUDIES ---------- */
  {
    id: 'me-bag-life-like-mine', topic: 'ethnic-studies', type: 'activity', grades: ['k5'],
    voices: ['Leah Aguilera'],
    title: 'Me Bag & “Life Like Mine”',
    body: 'Identity activities that build a circle of care. Students bring a picture of a proud moment and one of their family. They complete: “I am the ___ generation of my family to live in the US,” and trace where their ancestors came from. For families who identify as American or White, it can be the first time answering something they’re not the center of.',
    source: 'Gratitude to Leah Aguilera, OUSD teacher & mentor',
  },
  {
    id: 'power-definition', topic: 'ethnic-studies', type: 'definition', grades: ['k5', 'm'],
    voices: ['Leah Aguilera'],
    title: 'Defining power with students',
    body: '“We define power as the ability to control circumstances or make things happen. Power is neither good nor bad; it depends on how it is used.” Students can feel empowered by their own acts of care and take action toward a more humanizing world.',
    source: 'Leah Aguilera, 2nd-grade teacher',
  },
  {
    id: 'ethnic-studies-glossary', topic: 'ethnic-studies', type: 'definition', grades: ['k5', 'm'],
    voices: [],
    title: 'Useful terms for ethnic studies (Grade 5+)',
    body: 'Acculturation, appropriation, cultural shift, depiction, ethnicity, evolution, juxtaposition, minoritization, recontextualize, reinterpretation, stereotype — a working glossary for talking about culture and representation with older elementary students and up.',
  },

  /* ---------- PLAY & INQUIRY ---------- */
  {
    id: 'mlk-maladjusted', topic: 'play-inquiry', type: 'quote', grades: ['all'],
    voices: ['Martin Luther King Jr.'],
    title: 'The creatively maladjusted',
    body: '“Human salvation lies in the hands of the creatively maladjusted.”',
    source: 'Dr. Martin Luther King, Jr.',
  },
  {
    id: 'demand-impossible', topic: 'play-inquiry', type: 'quote', grades: ['all'],
    voices: [],
    title: 'Be realistic. Demand the impossible.',
    body: '“Be realistic. Demand the impossible.”',
    source: 'Slogan of student and labor protesters, Paris 1968',
  },
  {
    id: 'opposite-of-play', topic: 'play-inquiry', type: 'quote', grades: ['all'],
    voices: ['Brian Sutton-Smith'],
    title: 'The opposite of play is not work',
    body: '“The opposite of play is not work, it’s depression.”',
    source: 'Brian Sutton-Smith',
  },
  {
    id: 'play-deprivation-equity', topic: 'play-inquiry', type: 'concept', grades: ['ec', 'k5'],
    voices: ['Shawn Ginwright'],
    title: 'Play deprivation is a systemic equity issue',
    body: 'High-poverty schools are losing playground space and play time, affecting Latinx, Black, dis/abled and newcomer students more than their peers, while a privileged minority gets play-rich, inquiry-based curriculum. Name play deprivation as the collective trauma it is.',
  },
  {
    id: 'play-arts-graph', topic: 'play-inquiry', type: 'activity', grades: ['higher'],
    voices: ['Nicole Sumner'],
    title: 'XY Play & Arts Graph: Journeying Backwards',
    body: 'Map your own play and art history on an X–Y axis to surface cultural play forms, social skills, and art practices from your home community that can be called upon to build equity, collaboration, and cognitive learning in your students.',
    source: 'Email sumnernicole@gmail.com for the activity',
  },

  /* ---------- MEDIA LITERACY ---------- */
  {
    id: 'titus-kaphar-amend', topic: 'media-literacy', type: 'media', grades: ['m', 'h', 'higher'],
    voices: ['Titus Kaphar'],
    title: '“Amend, not erase” — Titus Kaphar',
    body: 'Kaphar’s son asked of a Teddy Roosevelt monument, “How come he gets to ride while they have to walk?” Kaphar wants us to amend public sculpture — to confront a painful history rather than forget it. “We can’t pretend like not talking about it is going to work. We have to create a space for conversation.”',
    source: 'Interview: How Can We Address Centuries of Racism In Art?',
  },
  {
    id: 'visible-thinking', topic: 'media-literacy', type: 'routine', grades: ['all'],
    voices: [],
    title: 'Visible Thinking routines (Project Zero)',
    body: 'A research-based Harvard Project Zero initiative with 30+ routines that make learning visible — students’ ideas get documented, voiced, discussed, and reflected on. Not to be confused with Hattie’s “visible learning.” A simple, flexible way to teach thinking dispositions at any grade.',
    source: 'Harvard Project Zero',
  },
  {
    id: 'disclaimers-disney-wb', topic: 'media-literacy', type: 'activity', grades: ['m', 'h'],
    voices: [],
    title: 'Disclaimers: who acknowledges the racism?',
    body: 'Warner Bros. says “These depictions were wrong then and are wrong today,” while many Disney films carry no disclaimer. Discuss: What are disclaimers? Who writes them? At what age can children understand a film is wrongly depicting people? How is a racist cartoon different from a textbook depicting the same racism?',
    source: 'Women’s Media Center',
  },

  /* ---------- DESIGN THINKING ---------- */
  {
    id: 'mini-design-project', topic: 'design-thinking', type: 'activity', grades: ['k5', 'm'],
    voices: [],
    title: 'A mini design-thinking project',
    body: 'Students are first the designer, then the user. They fill out an Empathy Map for themselves, then for a partner, and practice cardboard sculpture (and paper-mâché, time allowing). Even kindergartners can ideate, define, prototype and test their ideas.',
  },
  {
    id: 'justice-x-design', topic: 'design-thinking', type: 'resource', grades: ['m', 'h', 'higher'],
    voices: [],
    title: 'JusticexDesign: Voice, Choice & Mending',
    body: 'A project applying the Agency by Design framework to maker-centered learning. Its justice-directional tools help students look closely at context, history, legacy and representation in designed systems, and redesign their own participation in pattern-disruptive ways.',
    source: 'Try the “Voice, Choice & Mending” tool',
  },

  /* ---------- ACTIVISM, ARTIVISM, FEMINISM ---------- */
  {
    id: 'gay-feminism', topic: 'activism', type: 'definition', grades: ['h', 'higher'],
    voices: ['Roxane Gay'],
    title: 'What is feminism?',
    body: '“Feminism is a movement to ensure that people of all genders are treated equally, have equal access to healthcare, are paid equally for the labor they do, and are allowed to live lives free of violence.”',
    source: 'Roxane Gay',
  },
  {
    id: 'art-build', topic: 'activism', type: 'activity', grades: ['k5', 'm', 'h'],
    voices: ['Favianna Rodriguez'],
    title: 'Host an “Art Build”',
    body: 'An event where students create posters, banners and parachutes for campaigns and school issues. Help them with space and inspiring images, time and curricular connections, tools (poster paper, markers, paints, sheets), and a social-media platform to document and connect. Children and teens need artistic outlets for their sense of justice.',
    source: 'See Favianna Rodriguez & poster PDs',
  },
  {
    id: 'enslaved-who-resisted', topic: 'activism', type: 'activity', grades: ['m', 'h'],
    voices: ['Nikole Hannah-Jones'],
    title: 'Name the enslaved people who resisted',
    body: 'As a class, try to name every enslaved person you know of who fought back or escaped to freedom (no repeats). Then ask: why do we know so few names? Is it because few resisted — or because of how we tell the story of slavery?',
    source: 'Pairs with the 1619 Project',
  },
  {
    id: 'spectrum-of-action', topic: 'activism', type: 'routine', grades: ['higher'],
    voices: [],
    title: 'The Spectrum of Action',
    body: 'Where would you place yourself? From “Tell your students you support them,” to offering student choice of topics, to inviting a guest expert or youth group, to creating a full lesson plan on LGBTQ+ history and inviting student critique. A self-locating tool for deciding how you’ll act.',
    source: 'In reference to the “Don’t Say Gay” bill',
  },
  {
    id: 'mari-copeny', topic: 'activism', type: 'media', grades: ['k5', 'm'],
    voices: ['Mari Copeny'],
    title: 'Mari Copeny — youth activist',
    body: 'A 12-year-old activist and philanthropist who, instead of feeling helpless about the Flint water crisis, used her voice to fight for kids in Flint and has since helped communities nationwide facing toxic water. Include current youth activists in your curriculum.',
    source: 'Video about Mari Copeny',
  },

  /* ---------- YOUTH VOICE & POETRY ---------- */
  {
    id: 'slam-clubs', topic: 'youth-voice', type: 'resource', grades: ['k5', 'm', 'h'],
    voices: ['June Jordan'],
    title: 'Poetry & SLAM clubs in young voices',
    body: 'Poetry and SLAM clubs, starting in elementary school, give children and teens both written and performed self-expression on subjects they care deeply about. Bay Area resources: youthspeaks.org, Oakland Youth Poet Laureates, Slam Club Handbook, bayareacreative.org/sparcpoetry.',
    source: 'Youth Speaks; SPARC; Get Lit',
  },
  {
    id: 'alphabet-rockers', topic: 'youth-voice', type: 'media', grades: ['ec', 'k5'],
    voices: [],
    title: 'Alphabet Rockers',
    body: 'A Bay Area, Grammy-winning intergenerational hip-hop educational music group — a great source of music videos for the classroom.',
  },

  /* ---------- ABOLITION & PEACE STUDIES ---------- */
  {
    id: 'image-theatre', topic: 'abolition', type: 'activity', grades: ['m', 'h', 'higher'],
    voices: ['Augusto Boal', 'Paulo Freire'],
    title: 'Image Theatre',
    body: 'Participants sculpt their own or each other’s bodies into still images (freeze-frames) to explore abstract concepts — relationships, emotions, oppression. The images are then “dynamised,” brought to life. Developed by Augusto Boal (The Rainbow of Desire), building on Freire.',
    source: 'Augusto Boal + Paulo Freire',
  },
  {
    id: 'mary-hooks-divest', topic: 'abolition', type: 'quote', grades: ['h', 'higher'],
    voices: ['Mary Hooks'],
    title: '“Every generation has a demand”',
    body: '“Y’all said to us, ‘Every generation has a demand,’ and you right. We do! Here’s what it is: Divest! Divest from prisons, jails, courts. The vision of justice for us does not include cages… walk in our communities with safety and dignity for all Black people. That is public safety.”',
    source: 'Mary Hooks, Southerners on New Ground (SONG), 2016',
  },
  {
    id: 'becoming-abolitionists', topic: 'abolition', type: 'resource', grades: ['h', 'higher'],
    voices: ['Derecka Purnell'],
    title: 'Reading list on abolition',
    body: 'Becoming Abolitionists by Derecka Purnell; The Lightning Dreamer (Cuba’s greatest abolitionist) by Margarita Engle, for teens; Rhythm and Resistance: Teaching Poetry for Social Justice; the Vamos a Leer educator’s guide.',
  },

  /* ---------- ARTS INTEGRATION ---------- */
  {
    id: 'steve-locke-grays', topic: 'arts-integration', type: 'media', grades: ['h', 'higher'],
    voices: ['Steve Locke'],
    title: 'Three Deliberate Grays for Freddie',
    body: 'A memorial for Freddie Gray by artist Steve Locke: three monochromes made by averaging the pixels of a family photo, a still from his arrest, and an image of him on life support — a color timeline of his life, suffering, and death. A way into cross-cutting concepts (scale, structure & function) and social movement.',
    source: 'Steve Locke, Mass College of Art and Design',
  },
  {
    id: 'music-apps', topic: 'arts-integration', type: 'resource', grades: ['ec', 'k5'],
    voices: [],
    title: 'Music-making apps for children',
    body: 'So kids become creators, not just consumers. Try Kapu Bloom Tunes (3+, pitch & symmetry by color), Hello Everybody (acoustic, varied modes), Jungle Music (reading & solfège, 7–12), and Keezy (color-coded sampler, record your own loops). A kid’s music diet should include making their own music and a diverse selection of songs in many languages.',
  },

  /* ---------- GENDER & BANNED BOOKS ---------- */
  {
    id: 'what-is-gender', topic: 'gender-books', type: 'definition', grades: ['m', 'h'],
    voices: [],
    title: 'What is gender?',
    body: 'Gender is social and cultural — how your identity relates to society’s idea of what it means to be a woman, man, neither, or a mix. Gender identity is your deeply-held inner sense of self, which others can’t see, and may or may not match the sex assigned at birth. Terms include cisgender, transgender, agender, Two-Spirit, gender queer, non-binary, and gender fluid.',
  },
  {
    id: 'kobabe-banned', topic: 'gender-books', type: 'quote', grades: ['h', 'higher'],
    voices: ['Maia Kobabe'],
    title: 'On being the most-banned book',
    body: '“A book being banned doesn’t hurt the book — it hurts the communities where it is happening… young people are getting the message that we don’t care what you say or feel. Mostly books by people of color, about critical race theory — multiple marginalizations. The majority of people challenging the book have never read it.”',
    source: 'Maia Kobabe, author of Gender Queer',
  },
  {
    id: 'tge-myths', topic: 'gender-books', type: 'concept', grades: ['h', 'higher'],
    voices: [],
    title: 'Myths about transgender & gender-expansive youth',
    body: 'Three common myths to interrogate: (1) the number of TGE youth is “growing,” (2) gender expansiveness is not “normal” development, and (3) irreversible medical or surgical transition is being offered to children. Know how to describe yourself and support your students’ gender identities.',
  },

  /* ---------- CURRICULUM SCORECARD ---------- */
  {
    id: 'crc-scorecard', topic: 'scorecard', type: 'routine', grades: ['higher'],
    voices: [],
    title: 'Culturally Responsive Curriculum Scorecard',
    body: 'A teacher tool with rubrics and scoring guidelines across: Diversity of Characters, Diversity of Authors, Representation, Social Justice Orientation, and Teacher Materials. Use it to audit how culturally responsive your existing curriculum really is — an ideal candidate to become a live, interactive scoring tool on the site.',
  },

  /* ============================================================
     EXPANDED COVERAGE — the remaining sections, populated from
     the deck. Filtering groups everything by topic, so order here
     doesn't matter to the reader.
     ============================================================ */

  /* ---------- BELOVED COMMUNITY (more) ---------- */
  {
    id: 'beloved-community-king', topic: 'beloved-community', type: 'quote', grades: ['all'],
    voices: ['Martin Luther King Jr.', 'Josiah Royce'],
    title: 'The aftermath of nonviolence',
    body: 'Philosopher-theologian Josiah Royce coined “Beloved Community” in the early 20th century; Dr. King, a fellow member of the Fellowship of Reconciliation, gave it deeper meaning. In his 1957 speech Birth of a New Nation he said, “The aftermath of nonviolence is the creation of the beloved community.”',
    source: 'Dr. Martin Luther King, Jr., 1957',
  },
  {
    id: 'broadening-community', topic: 'beloved-community', type: 'concept', grades: ['all'],
    voices: [],
    title: 'Broaden the community in your curriculum',
    body: 'Classrooms and curricula should include inspiration from living activists, leaders, and visual & performing artists — not only historical figures. Make a practice of inviting all our intersecting identities and roles into the room.',
  },

  /* ---------- BRAVE VOICES (more) ---------- */
  {
    id: 'rhythm-resistance', topic: 'brave-voices', type: 'resource', grades: ['m', 'h', 'higher'],
    voices: [],
    title: 'Rhythm and Resistance',
    body: 'A conversation about teaching and writing poetry for social justice (watch on YouTube), paired with “Where Do You Know From?” — an exercise in placing ourselves together in the classroom.',
  },
  {
    id: 'poetry-as-container', topic: 'brave-voices', type: 'concept', grades: ['all'],
    voices: [],
    title: 'Poetry as a container for emotions',
    body: '“Know what you, as an educator, are capable of handling. Poetry can be a container for emotions… If you’re not ready to teach a topic, you can say, I know a lot is happening in the world, and I just want to acknowledge it.” Then point students to the resources available to them.',
  },
  {
    id: 'arat-brave-space', topic: 'brave-voices', type: 'resource', grades: ['higher'],
    voices: [],
    title: 'ARAT: from “safe” to “brave” space',
    body: 'Anti-Racist Art Teachers (antiracistartteachers.org) changed their well-known art-elements poster so the third element now reads “We create a brave space.” “Part of this work is both learning and unlearning… we have found the former to be a more accurate description of the space we aim to create.”',
    source: 'antiracistartteachers.org',
  },
  {
    id: 'amber-crowell-love', topic: 'brave-voices', type: 'concept', grades: ['higher'],
    voices: ['Amber Crowell'],
    title: 'A fighting, radical love',
    body: 'Dr. Amber Crowell describes a radical love and the need to hold onto hope — because without it you can’t even dream of a world without racist oppression. It looks like what you already know how to do: positive affirmation, honesty, reflection, collaboration. Honesty means normalizing others’ journeys by sharing your own.',
    source: 'Dr. Amber R. Crowell, Fresno State',
  },
  {
    id: 'chipko-movement', topic: 'brave-voices', type: 'activity', grades: ['m', 'h'],
    voices: [],
    title: 'The Chipko movement — bravery to integrate',
    body: 'Find examples of bravery for your curriculum. The women-led Chipko movement was one of the strongest forest-conservation movements in India: women set up cooperatives to guard local forests, organized fodder production, joined land-rotation schemes, replanted degraded land, and ran nurseries of species they selected.',
  },

  /* ---------- ANTI-RACIST PRACTICE & CRT (more) ---------- */
  {
    id: 'black-history-origins', topic: 'anti-racist', type: 'media', grades: ['m', 'h'],
    voices: ['Carter G. Woodson'],
    title: 'The origins of Black History Month',
    body: 'Schools have promoted US Black history since the earliest days of Black History Week (2nd week of February, 1926). Carter G. Woodson founded Black History Week and co-founded the ASALH (Association for the Study of African American Life and History). See the 6-minute video “Origins of Black History Month.”',
  },
  {
    id: 'csuf-pulled-teachers', topic: 'anti-racist', type: 'resource', grades: ['higher'],
    voices: [],
    title: 'When a district bans CRT: CSU Fullerton',
    body: 'CSU Fullerton scaled back and then paused student-teacher placements in a district that banned critical race theory, after candidates found mentor teachers couldn’t tell them whether they could teach state-standards-aligned curriculum on ethnic and cultural differences.',
    source: 'EdSource & CSUF News, Oct 2022',
  },
  {
    id: 'growth-mindset-race', topic: 'anti-racist', type: 'routine', grades: ['higher'],
    voices: [],
    title: 'A growth mindset about race — for ourselves',
    body: 'Are we applying a growth mindset about race to ourselves as educators? In what ways are we defending our current understanding by not taking action to educate ourselves?',
  },
  {
    id: 'distorted-history', topic: 'anti-racist', type: 'concept', grades: ['m', 'h'],
    voices: [],
    title: 'How textbooks have distorted the past',
    body: 'Understand that American history curricula and textbooks have long distorted the past — for example, portraying Confederate leaders as heroes and omitting the role of racism in American institutions.',
  },
  {
    id: 'mcmorrow-response', topic: 'anti-racist', type: 'quote', grades: ['higher'],
    voices: ['Mallory McMorrow'],
    title: 'Standing up to “groomer” attacks',
    body: 'After a state senator accused her of wanting to “groom and sexualize kindergarteners” and of “race-based education,” Mallory McMorrow replied: “People are in real danger if people like me, with the privilege to use my position for people who are regularly under attack, don’t stand up and push back.”',
    source: 'State Senator Mallory McMorrow, 2022',
  },

  /* ---------- ETHNIC STUDIES (more) ---------- */
  {
    id: 'ethnic-studies-history', topic: 'ethnic-studies', type: 'resource', grades: ['h', 'higher'],
    voices: ['Penny Nakatsu'],
    title: 'The first College of Ethnic Studies',
    body: 'In fall 1969, after a 5-month student strike, SFSU established the first College of Ethnic Studies in the country, with classes geared toward communities of color. Student Penny Nakatsu and her peers were tasked with designing a curriculum from scratch in months. SFSU also had the nation’s first Black Student Union.',
    source: 'San Francisco State University, 1969',
  },
  {
    id: 'ethnic-studies-tk5', topic: 'ethnic-studies', type: 'resource', grades: ['ec', 'k5'],
    voices: ['Wanda Watson'],
    title: 'Bringing ethnic studies to TK–5',
    body: 'Integrating ethnic studies at the TK–5 level in a transformative, liberatory way. Resource: “Bringing Our Humanity to the TK-5 Classroom Through an Ethnic Studies Stance,” from the Elementary Ethnic Studies Project.',
  },
  {
    id: 'wanda-watson-freedom', topic: 'ethnic-studies', type: 'quote', grades: ['ec', 'k5'],
    voices: ['Wanda Watson'],
    title: 'Take that freedom',
    body: '“Young people, age four, can engage with these meaningful questions. Teacher candidates ask me, will I have the freedom to do this? And I say, Take that freedom, because our lives depend on it.”',
    source: 'Wanda Watson, Elementary Ethnic Studies Project',
  },
  {
    id: 'vamos-a-leer', topic: 'ethnic-studies', type: 'resource', grades: ['k5', 'm'],
    voices: [],
    title: 'Vamos a Leer',
    body: 'A teacher resource that uses great literature to create globally literate students, engage in authentic discussions of culture, and think about social-justice issues.',
  },

  /* ---------- PLAY & INQUIRY (more) ---------- */
  {
    id: 'built-by-play', topic: 'play-inquiry', type: 'quote', grades: ['all'],
    voices: ['Stuart Brown'],
    title: 'We are built to play',
    body: '“Play helps us belong in the community… We are built to play, and built by play,” reminds Dr. Stuart Brown. The beloved community is best built with our whole, creative, inquiring selves, in community.',
    source: 'Dr. Stuart Brown',
  },
  {
    id: 'play-language-justice', topic: 'play-inquiry', type: 'concept', grades: ['ec', 'k5'],
    voices: [],
    title: 'The language of play is a language of justice',
    body: 'Just as you can find the roots of jazz in children’s improvised call-and-response, you can find roots of social justice in constructivist practices — building provocations from student inquiries about identity, privilege, access and race. Structuring play and arts forms rooted in students’ cultures builds agency and collaboration.',
  },
  {
    id: 'dey-problem-finders', topic: 'play-inquiry', type: 'quote', grades: ['ec', 'k5'],
    voices: [],
    title: 'The better problem-finders they are…',
    body: '“The better problem finders they are, the more engaged they’re going to become in the world, the better learners they’re going to be, and the better participants they’re going to be.”',
    source: 'DEY.org (Defending the Early Years)',
  },
  {
    id: 'carlsson-paige-play', topic: 'play-inquiry', type: 'quote', grades: ['ec', 'k5'],
    voices: ['Nancy Carlsson-Paige'],
    title: 'Kids are not playing like they used to',
    body: '“The trend towards standards & testing has eroded playtime in school. Add the number of hours on screens & digital devices, and kids are not playing like they used to. It’s something we need to remedy — fast.”',
    source: 'Nancy Carlsson-Paige',
  },

  /* ---------- MEDIA LITERACY (more) ---------- */
  {
    id: 'menders', topic: 'media-literacy', type: 'concept', grades: ['m', 'h', 'higher'],
    voices: ['Titus Kaphar', 'Sonya Clark', 'Dustin Klein'],
    title: 'Menders: mending distorted media',
    body: 'Meet the “menders” — artists working to mend distorted media representation, historical systems, and legacies through their art. US-based menders include Titus Kaphar, Dustin Klein, and Sonya Clark.',
  },
  {
    id: 'media-critics', topic: 'media-literacy', type: 'media', grades: ['m', 'h'],
    voices: ['Amber Ruffin', 'Xiran Jay Zhao'],
    title: 'Cultural critics of pop media',
    body: 'Use engaging cultural critics to build critical media literacy: Amber Ruffin and Xiran Jay Zhao, plus videos like “Everything Culturally Right and Wrong with Mulan” (1998 and 2020) and “Sita Sings the Blues.”',
  },

  /* ---------- DESIGN THINKING (more) ---------- */
  {
    id: 'design-thinking-process', topic: 'design-thinking', type: 'concept', grades: ['ec', 'k5'],
    voices: [],
    title: 'A 4-step design process, even in kindergarten',
    body: 'Very young children can use a four-step design-thinking process — ideate, define, prototype, test — to iterate on their own ideas and those of their peers. Build student agency through design & build.',
  },
  {
    id: 'collaborative-planning', topic: 'design-thinking', type: 'resource', grades: ['higher'],
    voices: [],
    title: 'There’s no “I” in Teacher',
    body: '“There’s No I in Teacher: 8 Tips for Collaborative Planning,” from Edutopia — a large site focused on Project-Based Learning and Design Thinking.',
    source: 'Edutopia.org',
  },

  /* ---------- ACTIVISM & ARTIVISM (more) ---------- */
  {
    id: 'baldwin-hate-pain', topic: 'activism', type: 'quote', grades: ['h', 'higher'],
    voices: ['James Baldwin'],
    title: 'Why people cling to their hates',
    body: '“I imagine one of the reasons people cling to their hates so stubbornly is because they sense, once hate is gone, they will be forced to deal with pain.”',
    source: 'James Baldwin, The Fire Next Time',
  },
  {
    id: 'blm-week-of-action', topic: 'activism', type: 'activity', grades: ['k5'],
    voices: [],
    title: '3rd-grade BLM Week of Action in art',
    body: 'A week of art-class topics: restorative justice; Black history and activism; diverse families; Black women artists. A model for integrating the Black Lives Matter at School Week of Action into elementary art.',
  },
  {
    id: 'prohibited-concepts', topic: 'activism', type: 'activity', grades: ['h', 'higher'],
    voices: [],
    title: 'Analyzing “prohibited concepts” laws',
    body: 'Show students the text of a state law banning “divisive concepts.” In pairs, have them discuss which prohibition feels weirdest or most troubling and why, then debate as a group. Ask: can you teach American history without making students feel “discomfort”? What are the authors of this law afraid of?',
  },
  {
    id: 'art-social-movements', topic: 'activism', type: 'resource', grades: ['k5', 'm'],
    voices: [],
    title: 'Art of Social Movements (4th–6th)',
    body: 'A slideshow and assignment connecting the art of social movements to 4th–6th grade California history, including a Padlet map.',
  },
  {
    id: 'florida-teen-stonewall', topic: 'activism', type: 'media', grades: ['h'],
    voices: ['Will Larkins', 'Miguel Blas'],
    title: 'A teen’s viral lesson on Stonewall',
    body: 'Student Will Larkins organized a walkout and went viral teaching the Stonewall riots in protest of Florida’s “Don’t Say Gay” bill. “When the bill first came out, I had a lot of fear about how us gay teenagers are going to have to start acting at school,” said classmate Miguel Blas, 16.',
  },

  /* ---------- YOUTH VOICE & POETRY (more) ---------- */
  {
    id: 'connect-to-movements', topic: 'youth-voice', type: 'concept', grades: ['m', 'h'],
    voices: [],
    title: 'Connect student interests to movements',
    body: 'Strategize around student concerns by connecting their interests to existing movements — especially youth-run orgs, actions, and campaigns. Provide tools for goal-setting, messaging, creative responses, forms of protest and direct action, and the steps of political campaigns.',
  },
  {
    id: 'teach-ins', topic: 'youth-voice', type: 'activity', grades: ['m', 'h'],
    voices: [],
    title: 'Build teach-ins into your curriculum',
    body: 'Build teach-ins on key activist topics: decision-making models (see TheDeciderApp), and the history of youth-led movements such as the East LA School Walkout / Chicano Blowout, with a lesson plan on youth-led movements.',
  },
  {
    id: 'rights-of-child', topic: 'youth-voice', type: 'resource', grades: ['k5'],
    voices: [],
    title: 'The right to play (Article 31)',
    body: 'The Convention on the Rights of the Child has 42 articles; Article 31 includes the right to play and to take part in cultural and creative activities. Child-friendly versions of all the articles are available with images.',
  },
  {
    id: 'youth-activism-resources', topic: 'youth-voice', type: 'resource', grades: ['m', 'h', 'higher'],
    voices: [],
    title: 'Youth activism & leadership resources',
    body: '“Too Young to Vote, Old Enough to Act: A Brief History of Major Youth-Led Movements,” Design an Action, Rethinking Schools, the Zinn Education Project, PoliceFreeSchools.org, the Black Organizing Project, Youth v Gov (Netflix), and Beautiful Trouble.',
  },

  /* ---------- ABOLITION & PEACE (more) ---------- */
  {
    id: 'peace-studies-questions', topic: 'abolition', type: 'concept', grades: ['h', 'higher'],
    voices: ['Thich Nhat Hanh'],
    title: 'Waging peace, not just war',
    body: 'Questions to sit with: What percentage of your curriculum is devoted to the waging of wars versus the waging of peace? We know the leaders of battles — but who are our leaders of peace activism? The late Thich Nhat Hanh connected inner mindfulness with outer activism.',
  },
  {
    id: 'divest-from-sros', topic: 'abolition', type: 'concept', grades: ['h', 'higher'],
    voices: [],
    title: 'Divesting from school police',
    body: 'Movements to redirect funds from school police (SROs) toward counselors and other school needs are underway in Oakland, Los Angeles, and many other US cities.',
  },
  {
    id: 'drama-games', topic: 'abolition', type: 'resource', grades: ['k5', 'm', 'h'],
    voices: [],
    title: 'Drama games for the classroom',
    body: 'Icebreakers, physical warm-ups, group dynamics, and creativity exercises drawn from traditional games and from directors, actors, and teachers — useful for introducing or developing curricular content.',
    source: 'DramaResource.com',
  },

  /* ---------- ARTS INTEGRATION (more) ---------- */
  {
    id: 'growth-forms-nature', topic: 'arts-integration', type: 'concept', grades: ['all'],
    voices: [],
    title: 'Growth forms in nature as metaphors',
    body: 'Use growth forms in nature as metaphors for learning — exploring and mapping connections. See also the Crosscutting Concepts & Cross-Curricular Mapping slideshow.',
  },
  {
    id: 'music-other-subjects', topic: 'arts-integration', type: 'activity', grades: ['k5', 'm'],
    voices: ['Roberta Flack', 'Lauryn Hill'],
    title: 'Integrating music with SS, ELA & math',
    body: 'Create an Árbol de Música poster of the music in students’ roots and playlists; use a song to introduce a writing unit (e.g., “Killing Me Softly”); give valentines with an affirmation and song title; provide backing tracks or a beatboxer for student poems; teach the history of call & response in social movements.',
  },
  {
    id: 'poetry-rhythm', topic: 'arts-integration', type: 'activity', grades: ['k5', 'm'],
    voices: ['Paul Flores'],
    title: 'Rhythm without rhyme',
    body: 'Add rhythm to poetry without rhyme, using repetition. Local poet Paul Flores creates rhythm by repeating the word “brown” — repetition in a list builds intensity and depth.',
  },
  {
    id: 'hesitant-students', topic: 'arts-integration', type: 'activity', grades: ['k5', 'm', 'h'],
    voices: [],
    title: 'Strategies for hesitant students',
    body: 'Reluctance comes with critique, but love makes it easier — make the love felt from the start (e.g., valentines with affirmations). Lower the stakes with a Blackout Poetry activity (found words), collaborative poetry exercises, and playful theater games.',
  },
  {
    id: 'healthy-music-diet', topic: 'arts-integration', type: 'concept', grades: ['ec', 'k5'],
    voices: [],
    title: 'A healthy music diet for kids',
    body: 'A kid’s music diet should include the chance to MAKE their own music, and a DIVERSE selection of rhymes and songs from their earliest ages, in multiple languages.',
  },

  /* ---------- GENDER & BANNED BOOKS (more) ---------- */
  {
    id: 'gender-history', topic: 'gender-books', type: 'concept', grades: ['h', 'higher'],
    voices: [],
    title: 'A short history of the “two-sex model”',
    body: 'Before the Enlightenment, gender was understood more fluidly, with many cultures acknowledging multiple genders or gender roles. During the Enlightenment, scientists and physicians adopted a “two-sex model,” viewing male and female bodies as distinct and opposite.',
  },
  {
    id: 'thorn-quote', topic: 'gender-books', type: 'quote', grades: ['ec', 'k5'],
    voices: ['Theresa Thorn'],
    title: 'On banning a gentle book',
    body: '“To me, this book is so mild. It’s just the inclusion of characters that are trans and non-binary. Parents don’t want their kids to have access to those words. It’s their own fear and prejudice… Overwhelming numbers of people on the banned-books list are people who have been marginalized.”',
    source: 'Theresa Thorn, It Feels Good to be Yourself',
  },
  {
    id: 'banned-books-why', topic: 'gender-books', type: 'concept', grades: ['h', 'higher'],
    voices: [],
    title: 'Why book-banning is used as a strategy',
    body: 'Three reasons people use book-banning: (1) ostensibly to keep young people safe; (2) for the majority, to erase people and materials they don’t agree with; (3) for some, a talking point that lends media publicity. There are dozens of laws and ~1,600 books on banned-book lists.',
  },
  {
    id: 'arts-for-anxiety', topic: 'gender-books', type: 'concept', grades: ['all'],
    voices: [],
    title: 'Using the arts to address anxiety',
    body: 'Use the arts to address anxiety in children and teens. Consider whether your school has an LGBTQ+ club and a chill-out room / safe space — and help set one up or stock it with resources if the library doesn’t have them.',
  },

  /* ---------- ARTS / RESOURCES (more) ---------- */
  {
    id: 'see-think-me-we', topic: 'scorecard', type: 'routine', grades: ['all'],
    voices: [],
    title: 'Thinking Routine: See, Think, Me, We',
    body: 'A Project Zero thinking routine that moves from close observation (“see”) and interpretation (“think”) to personal connection (“me”) and collective implication (“we”).',
  },
  {
    id: 'making-learning-visible', topic: 'scorecard', type: 'routine', grades: ['all'],
    voices: [],
    title: 'Making Learning Visible',
    body: 'Tools for deepening an inquiry: the Teaching for Understanding framework, and showing examples of completed projects so students can see the parts, purposes, and complexities of an inquiry. See also Project-Based Learning resources (Edutopia) and the Center for Ecoliteracy.',
  },
  {
    id: 'black-women-radicals', topic: 'scorecard', type: 'resource', grades: ['higher'],
    voices: [],
    title: 'Black Women Radicals: archiving as resistance',
    body: '“The Revolution Will Be Archived” — a discussion on archiving the Black narrative tradition. “Your archiving is inherently an act of resistance.” We are all walking archives; documenting what we live builds a more complete history for present and future generations.',
  },
  {
    id: 'girls-inc-eureka', topic: 'scorecard', type: 'resource', grades: ['m', 'h'],
    voices: [],
    title: 'Local resource: Girls Inc. — Eureka!',
    body: 'Girls Inc. of Alameda County (Oakland) runs Eureka!, a free 5-year teen achievement program open to girls and gender-expansive youth in 7th grade who live in Alameda County.',
    source: 'girlsinc-alameda.org',
  },
];

/* Hero quote rotation — the emotional front door. */
const HERO_QUOTES = [
  { q: 'Be realistic. Demand the impossible.', a: 'Paris, 1968' },
  { q: 'Human salvation lies in the hands of the creatively maladjusted.', a: 'Dr. Martin Luther King, Jr.' },
  { q: 'There are thousands of answers — at least. You can be one of them if you choose to be.', a: 'Octavia Butler' },
  { q: 'The opposite of play is not work, it’s depression.', a: 'Brian Sutton-Smith' },
  { q: 'Find the movement work that makes your heart sing and do that right.', a: 'Cat Brooks' },
];

/* Introductory questions from the deck — used on the landing page. */
const INTRO_QUESTIONS = [
  'What is equity-mindedness in action?',
  'How do I use intersectionality in my classroom?',
  'How do I handle pushback for addressing race?',
  'Where can I find resources for changing my curriculum?',
  'How do I integrate the arts?',
  'How do I grow my capacity to imagine more than what I see?',
];

const CT = { TOPICS, TYPES, GRADES, RESOURCES, HERO_QUOTES, INTRO_QUESTIONS };
if (typeof window !== 'undefined') window.CT = CT;
if (typeof module !== 'undefined' && module.exports) module.exports = CT;
