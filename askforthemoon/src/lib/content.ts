/* Every word the site says lives here. Facts from the brief are marked "brief";
   anything invented for the demo is marked "invented" so it can be swapped for the
   real thing before launch. */

export const book = {
  title: "Ask for the Moon",
  author: "Thea Brandt",
  publisher: "Bramber Press",
  published: "14 May 2026", // brief
  publishedISO: "2026-05-14",
  pages: 328, // brief
  trim: "234 × 153 mm", // invented — standard UK demy hardback
  sellingLine: [
    "Everything you need to know about getting what you want is in this book.",
    "None of it will help you.",
  ], // brief
  jacket:
    "Nadia Sremac has talked people out of buildings, out of court, and off ledges. She has eight days to sell her house, close three cases, and explain to her husband why she never came home.", // brief
  jacketClose: "Eight rooms. Eight negotiations. One she cannot win.", // brief
};

export const author = {
  opening:
    "For eleven years, Thea Brandt’s job was talking to people who had every reason not to listen.",
  /* Brief: eleven years, Met first, then private practice, left 2019, one short
     technical book. The split of years and the book's year are invented. */
  record: [
    {
      year: "2008",
      text: "Joins the Metropolitan Police as a hostage and crisis negotiator. Sieges, barricades, people on bridges.",
    },
    {
      year: "2013",
      text: "Private practice. Advises families and employers on kidnap-for-ransom cases in West Africa and Latin America. Never in the room. Always on the line.",
    },
    {
      year: "2016",
      text: "Writes a short technical book on crisis communication.",
    },
    { year: "2019", text: "Leaves." },
  ],
  /* the strongest proof on the page, lifted out of the timeline */
  proof: "It sold badly. Negotiators still pass it to each other.",
  proofNote: "Out of print · photocopies in circulation",
  quote: "I was good at it for too long.",
  quoteNote: "Her reason, in every interview since. She has never added to it.",
  after: [
    "Ask for the Moon is her first novel. She is Danish-British, fifty-two, and lives in Copenhagen. She does not do many events.",
    "Everything Nadia does in a room, Thea has done. What Nadia cannot do at home, she declines to discuss.",
  ],
};

export const novel = {
  premise: [
    "Each chapter is a different case. A kidnapping in Lagos. A divorce over a house neither of them wants. A hospital room where a family cannot agree to let their father go. Forty bakery workers who have stopped working. Different worlds, different stakes, same woman in the room.",
    "Underneath all of it, her own marriage is ending, and she is handling it appallingly. She can read a kidnapper’s silence from four thousand miles away and cannot say one true sentence to her husband.",
  ],
  method:
    "The title is the method. Open impossibly high, because the first number moves every number after it.",
};

/* Chapter titles and the mechanic per room are invented; the cases are the brief's.
   `lit` is how much of the row the light still covers — it wanes to nothing. */
export const rooms = [
  {
    n: "I",
    scene: "Then the number. Two hundred million naira. “By tomorrow. Or you know what happens.” She slid the next card across the table. It said: SAY NOTHING.", // invented
    title: "Proof of Life",
    where: "A kidnapping in Lagos, run from a borrowed boardroom in London.",
    knows: "Never bid against yourself.",
    lit: 88,
  },
  {
    n: "II",
    scene: "“I don’t want the house,” said Marcus. “I don’t want it either,” said Joanna. Their lawyers looked at each other across nine hundred pounds an hour of carpet. Nadia wrote: Nobody wants it. So what is it for?", // invented
    title: "Neither of Them Wants the House",
    where: "A divorce over a house neither of them wants.",
    knows: "Positions are not interests.",
    lit: 76,
  },
  {
    n: "III",
    scene: "The consultant said, gently, that there was no hurry, and then looked at the clock. Nobody spoke. The machine by the bed spoke for all of them, every four seconds, and Nadia let it.", // invented
    title: "Room Nine",
    where: "A family who cannot agree to let their father go.",
    knows: "Silence is a tool most people cannot survive four seconds of.",
    lit: 64,
  },
  {
    n: "IV",
    scene: "“Six o’clock,” said Graham, for the third time. “If they’re not back on the line by six, the dough’s done.” Nadia wrote 6.00 on her pad and drew a small box around it.", // invented
    title: "Proving",
    where: "Forty bakery workers who have stopped working.",
    knows: "Almost every deadline is invented.",
    lit: 52,
  },
  {
    n: "V",
    scene: "“It’s a very good offer,” said the man from the fund. “It is,” said Ruth. “For you.” She had started the company in a spare room in Leeds. She stood up, and for the first time that afternoon everyone else looked at the door.", // invented
    title: "Drag-Along",
    where: "A founder being bought out of the company she started.",
    knows: "Your power is your willingness to leave.",
    lit: 40,
  },
  {
    n: "VI",
    scene: "“Mum always said I could have the plates.” “Mum said a lot of things.” There were eleven of them, and nobody in the room had eaten off a plate like that in twenty years.", // invented
    title: "The Good Plates",
    where: "Two siblings and a dead mother’s flat.",
    knows: "Say what they are afraid of before they have to.",
    lit: 28,
  },
  {
    n: "VII",
    scene: "She said a number before he had taken his coat off. “Two thousand: the ceiling, the carpet and the month she’s had.” He had come to offer two hundred. He left having agreed to twelve hundred, and thanked her for her time.", // invented
    title: "Damp",
    where: "A landlord and a leak.",
    knows: "The first number moves every number after it.",
    lit: 15,
  },
  {
    n: "VIII",
    scene: "", // she has nothing to say there
    title: "The Kitchen Table",
    where: "",
    knows: "",
    lit: 0, // the light runs out: the bar crosses the whole row
  },
];

/* A page from the middle of the book — chapter IV. Invented prose. */
export const midBook = {
  chapter: "IV · Proving",
  /* {{REDACTED}} marks a name the reader cannot recover: it is not in the page. */
  footnote: "Her name is on page 212.",
  folios: [141, 142],
  paragraphs: [
    "“Six o’clock,” said Graham, for the third time. “If they’re not back on the line by six, the dough’s done, the ovens go cold, and the supermarket walks. Six. That’s not me being difficult. That’s physics.”",
    "Nadia wrote 6.00 on her pad and drew a small box around it.",
    "The canteen smelled of yeast and burnt coffee. Through the window in the swing door she could see the forty of them in the yard, under the loading-bay lights, not doing anything. Nobody was shouting. There was no banner. It was the most organised thing she had seen all year: forty people standing very still in the cold, in white hats, waiting for someone to notice.",
    "“Who says six?” she said.",
    "Graham looked at her as if she had asked who said Tuesday. “The dough says six.”",
    "“The dough was mixed at two. Your night shift didn’t mix it. Nobody’s been on the line since midnight.” She turned the pad round so he could see the box. “So who says six?”",
    "He opened his mouth and closed it. She watched him hear it for the first time himself: that six o’clock was a number he had said to {{REDACTED}}, the union rep, at half past twelve, in temper, and had repeated to his area manager, who had repeated it to the supermarket, and now there were three grown men in three different buildings holding on to a deadline none of them had set, like three men holding the same rope with nobody tied to the other end.",
    "“The contract,” he said, with less conviction. “First delivery’s at eight.”",
    "“Then the deadline’s eight, and it belongs to the supermarket, and they’d rather have bread at nine than a new supplier by Christmas.” She crossed out the 6.00. “Let’s go and ask your forty people what they want. I bet it isn’t what you think.”",
    "Her phone buzzed in her coat pocket. She knew without looking that it was the estate agent, confirming Saturday, ten o’clock, the viewing Tom had arranged and she had agreed to, in the one sentence she had managed to send him in two days. There was no reason the house had to be sold in eight days. She had not asked who said eight. She had not asked anyone anything.",
  ],
};

/* Chapter one, complete. Invented prose. `break` marks a section break. */
export const chapterOne = {
  number: "One",
  title: "Proof of Life",
  blocks: [
    "The brother’s name was Femi, and he had been told not to say anything clever.",
    "He sat at the end of a borrowed boardroom table in Canary Wharf with a mobile phone face up in front of him and a stack of index cards at his left hand, and he had the look Nadia had seen on perhaps two hundred people in the same chair: a man who had been good at something all his life and had just discovered it was the wrong thing.",
    "“He’ll call between eleven and one,” she said. “He’ll be angry. He’ll say a number. You won’t answer the number.”",
    "“What do I say?”",
    "“What’s on the card.”",
    "She had written the cards at six that morning in the hotel, in capitals, in black felt-tip, the way she had been taught in a Portakabin in Hendon nineteen years ago by a man who had since died of something ordinary. Each card had one sentence. Most of the sentences were questions. None of them contained a number.",
    "Femi’s sister had been taken from a car outside a hotel in Lekki nine days earlier. The company she worked for had a policy for this, and the policy had a phone number, and the phone number, eventually, was Nadia. She had never met the sister. She had a photograph, a date of birth, the name of her first dog, and the answers to four questions nobody but the sister could know. She had not slept properly since Tuesday. It was Friday.",
    "At 11.52 the phone lit up.",
    "Femi looked at her. She nodded once, and he picked it up, put it on speaker, and read the first card. “This is Femi. I’m listening.”",
    "The voice on the other end had been polite on day two and was not polite now. It said a great many things, fast, in English and then in something that wasn’t, and Nadia let it go past her like weather. She was not listening to the words. The words were for Femi. She was listening to the room behind them — a generator, a radio, a television with the sound down, a second man breathing close to the phone — and to the space between the sentences, which is where people keep what they mean.",
    "Then the number. Two hundred million naira. “By tomorrow. Or you know what happens.”",
    "Femi’s hand went to the cards and missed. She watched him decide to be brave. She slid the next card across the table before he could.",
    "It said: SAY NOTHING.",
    "He read it. He looked at her. She held up one finger, then a second, the way you would count a child across a road.",
    "One.",
    "The line hissed. Somewhere in a room she would never see, a radio was playing highlife very quietly.",
    "Two.",
    "Femi’s lips parted. She shook her head, barely.",
    "Three. This was the part nobody could do. Three seconds of silence on a phone felt like the line had gone dead, like you had lost, like the man at the other end was already walking out to the car. Every instinct a decent person had said: fill it. Say sorry. Say yes. Say a smaller number, quickly, to show you are reasonable.",
    "Four.",
    "“Hello?” said the voice. “Hello. You are there?”",
    "“I’m here,” Femi read, from the card she had already put down.",
    "“You heard me.”",
    "“I heard you.”",
    "And then — she felt it before she heard it, the way you feel a lift start — the voice said: “Listen. My boss says two hundred. But I am telling you, if the family can do something today, something serious, I can talk to him.”",
    "Femi looked at her as if she had performed a card trick. She didn’t smile. It wasn’t a trick. It was the first true thing the man had said in nine days, and it had cost them four seconds and nothing else.",
    "She wrote on the next card: WHAT WOULD HE NEED TO SEE?",
    "Her own phone, face down beside her elbow, buzzed twice.",
    "She didn’t turn it over. She knew who it was from the length of the buzz and the hour, the way she knew that the second man in the room in Lagos was younger than the first and more frightened. She let it buzz. She had a rule about that too.",
    "The call lasted eleven minutes. When it ended, Femi put the phone down very carefully, as if it might go off, and put his face in his hands, and she let him, and wrote the log: time, duration, demand, movement, tone, background, the second man. Her handwriting was very neat. People sometimes said it was the neatest thing about her.",
    "“He came down,” Femi said, through his fingers. “We didn’t say anything and he came down.”",
    "“He came down.”",
    "“How did you know he would?”",
    "She thought about how to answer. The true answer was that she hadn’t known; that she had known only that if Femi said a number first it would be the wrong number, because every number is the wrong number when you say it first, and you cannot talk a man down from a figure you have already offered him. The true answer was nineteen years long and started in a Portakabin in Hendon.",
    "“He wanted to be listened to,” she said. “Everyone does.”",
    { break: true },
    "She turned her phone over in the lift.",
    "Two messages. The first said: Estate agent says Sat 10am for the viewing. The second, a minute later, said: Are you coming home tonight",
    "No question mark. Tom had stopped using them about a year ago, around the time he had stopped using her name, and she had noticed both and said nothing about either, because she knew exactly what saying something would open, and she had a kidnapping to run.",
    "She typed: Yes.",
    "She looked at it. It was the shortest, easiest word in the language. She had spent her working life getting strangers to say it, and she found she did not believe it.",
    "She deleted it and typed: Late. Don’t wait up.",
    "The lift opened onto the lobby, and the glass, and the river, and the whole bright ordinary Friday going on without her, and she walked out into it with the phone in her hand and the message unsent — which is where it still was at Bank, and at Clapham North, and at her own front door at twenty past one in the morning, where she stood for a long time with the key in the lock, the way Femi had held the phone. As if it might go off.",
  ] as (string | { break: true })[],
};

/* Retailer links are title searches so the demo never points at a product page
   that doesn't exist. Swap for real product URLs at launch. Ebook and audiobook
   prices are invented; the hardback price is the brief's. */
const q = "ask for the moon thea brandt";
const enc = encodeURIComponent(q);

export type Format = {
  id: "hardback" | "ebook" | "audio";
  label: string;
  price: string;
  detail: string;
  shops: { name: string; note?: string; href: string }[];
};

export const formats: Format[] = [
  {
    id: "hardback",
    label: "Hardback",
    price: "£18.99",
    detail: "328 pages · cloth spine · first edition",
    shops: [
      {
        name: "Bookshop.org",
        note: "Every sale supports an independent bookshop",
        href: `https://uk.bookshop.org/search?keywords=${enc}`,
      },
      { name: "Waterstones", href: `https://www.waterstones.com/books/search/term/${enc}` },
      { name: "Blackwell’s", href: `https://blackwells.co.uk/bookshop/search/?keyword=${enc}` },
      { name: "Amazon", href: `https://www.amazon.co.uk/s?k=${enc}&i=stripbooks` },
    ],
  },
  {
    id: "ebook",
    label: "Ebook",
    price: "£9.99",
    detail: "EPUB and Kindle",
    shops: [
      { name: "Kobo", href: `https://www.kobo.com/gb/en/search?query=${enc}` },
      { name: "Google Play Books", href: `https://play.google.com/store/search?q=${enc}&c=books` },
      { name: "Kindle", href: `https://www.amazon.co.uk/s?k=${enc}&i=digital-text` },
    ],
  },
  {
    id: "audio",
    label: "Audiobook",
    price: "£19.99",
    detail: "Read by the author · 10 hr 12 min",
    shops: [
      { name: "Audible", href: `https://www.audible.co.uk/search?keywords=${enc}` },
      { name: "Kobo", href: `https://www.kobo.com/gb/en/search?query=${enc}&fclanguages=en&fcmedia=Audiobook` },
      { name: "Google Play Books", href: `https://play.google.com/store/search?q=${enc}&c=audiobooks` },
    ],
  },
];

/* The transcript that runs down the page: one night, one line per section
   boundary, never explained. N: is Nadia; X is the other party, redacted.
   Invented. */
export const log = {
  author: { t: "23.40.00", text: "LINE OPEN" },
  pause: { t: "23.41.12", who: "X", text: "—", pause: "[4 sec]" },
  novel: { t: "23.41.16", who: "N", text: "I’m here." },
  rooms: { t: "23.52.40", who: "X", text: "Two hundred." },
  read: { t: "23.52.41", who: "N", text: "—", pause: "[4 sec]" },
  buy: { t: "23.52.45", who: "X", text: "Something serious. Today." },
  footer: { t: "04.12.09", text: "LINE CLOSED" },
} as const;

/* The page's one passage of atmosphere. Invented. */
export const atmosphere =
  "A room where someone has decided not to talk is never silent. You hear the radiator, a car two streets away, your own breathing arranging itself to sound calm. The silence isn’t empty; it is addressed to you, and it is asking you to fill it with something you will regret. Most people last four seconds.";

/* Endorsements: invented people with generic roles — replace with real quotes
   before launch. Short, specific, about what the book does. */
export const endorsements = [
  {
    quote: "I have sat in every one of these rooms. She gets the silence exactly right, which almost nobody does.",
    name: "Dermot Keane",
    role: "Hostage negotiator, retired",
  },
  {
    quote: "Chapter two should be required reading for every family barrister, and kept well away from their clients.",
    name: "Priya Raman KC",
    role: "Family law",
  },
  {
    quote: "The bakery chapter is the most accurate account of a walkout I have read. The deadline is always invented. Always.",
    name: "Tom Adeyemi",
    role: "Union negotiator",
  },
  {
    quote: "A novel that makes you better at arguing with the people you love, and then shows you why that won’t save you.",
    name: "Imogen Hale",
    role: "Novelist",
  },
];

/* Where the sample stops, said plainly. Invented. */
export const sampleEnd = {
  mark: "p. 142 · the sample ends here",
  next: "Over the next four pages Nadia walks into the yard, asks the forty what they actually want, and gets an answer none of the three men holding the rope expected.",
};
