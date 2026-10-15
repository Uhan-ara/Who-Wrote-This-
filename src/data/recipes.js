/**
 * Sentence recipes and simulated bot phrase pools.
 * Keeps data modular and easy to extend or customize.
 */

export const DEFAULT_RECIPE = [
  {
    id: 'who',
    label: 'WHO',
    prompt: 'Who is the subject of the story?',
    placeholder: 'e.g. A dramatic raccoon, Shrek in a tuxedo, An anxious astronaut',
  },
  {
    id: 'when',
    label: 'WHEN',
    prompt: 'When is this taking place?',
    placeholder: 'e.g. at 3 AM on a Tuesday, during a royal wedding, in the year 3024',
  },
  {
    id: 'where',
    label: 'WHERE',
    prompt: 'Where are they?',
    placeholder: 'e.g. inside an abandoned IKEA, at the top of Mount Everest, in a drive-thru',
  },
  {
    id: 'action',
    label: 'DO WHAT',
    prompt: 'What are they doing?',
    placeholder: 'e.g. intensely arm-wrestling a goose, ordering 500 chicken nuggets, breakdancing',
  },
  {
    id: 'with_whom',
    label: 'WITH WHOM',
    prompt: 'With whom or what unexpected twist?',
    placeholder: 'e.g. with the town mayor, wearing squeaky neon Crocs, while being chased by bees',
  },
];

export const BOT_NAMES = [
  'Captain Waffles',
  'Barnaby',
  'PixelPanda',
  'Doctor Quack',
  'Ziggy Stardust',
  'Sir Fluffington',
  'Cosmo',
  'Noodle',
];

export const BOT_SUGGESTIONS = {
  WHO: [
    'A grumpy pirate',
    'A caffeine-addicted squirrel',
    'An undercover ninja dentist',
    'A polite Sasquatch',
    'A medieval knight on rollerblades',
    'A disco-dancing robot',
    'An anxious pug',
    'A suspicious mime',
  ],
  WHEN: [
    'at the stroke of midnight',
    'during an intense thunderstorm',
    'while everyone was sleeping',
    'on a foggy Sunday morning',
    'during a high-stakes bingo championship',
    'exactly 47 seconds ago',
    'during a total solar eclipse',
  ],
  WHERE: [
    'inside an abandoned bounce house',
    'in the VIP lounge of a submarine',
    'on the roof of a Walmart',
    'in a top-secret cheese vault',
    'behind the gym bleachers',
    'in a crowded elevator',
    'in the middle of a laser tag arena',
  ],
  'DO WHAT': [
    'furiously juggling pineapples',
    'attempting to speak French to a microwave',
    'auditioning for an opera about tacos',
    'trying to summon the WiFi ghost',
    'practicing karate against an inflatable tube man',
    'filming an unboxing video for a rock',
    'stealing the world’s largest rubber duck',
  ],
  'WITH WHOM': [
    'with a confused penguin',
    'while wearing a cape made of spaghetti',
    'alongside Gordon Ramsay in tears',
    'with an army of obedient pigeons',
    'while secretly live-streaming to 12 viewers',
    'with their childhood arch-nemesis',
    'wearing oversized foam hands',
  ],
};
