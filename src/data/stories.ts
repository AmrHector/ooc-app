import { StoryComment, StoryItem } from '../types/ooc';

interface RawRankRow {
  rank: number;
  title: string;
  views: string;
  author: string;
  original: boolean;
  genre: string;
  tagline?: string;
}

const RAW_TOP_100: RawRankRow[] = [
  { rank: 1, title: 'Lumencia Academy', views: '50.3M', author: 'OOC', original: true, genre: 'Academy', tagline: 'Enter the most prestigious arcane academy where every duel rewrites fate.' },
  { rank: 2, title: 'Sharing an apartment with the popular girl', views: '5.3M', author: 'Johnnyboy', original: false, genre: 'Romance', tagline: 'One lease, two opposite worlds, and a secret she only shows at home.' },
  { rank: 3, title: 'Reincarnated With an OP Skill', views: '21.3M', author: 'Nuzelle', original: false, genre: 'Fantasy', tagline: 'One broken System panel. Five forbidden starting skills. Survival starts now.' },
  { rank: 4, title: 'Hero Academia', views: '22.1M', author: 'OOC', original: true, genre: 'Academy', tagline: 'Awaken an unranked quirk-tier anomaly and climb past the top heroes.' },
  { rank: 5, title: 'Hero Academy Apex', views: '2.3M', author: 'OOC', original: true, genre: 'Academy', tagline: 'The elite Apex division admits no weakness—prove your rank on day one.' },
  { rank: 6, title: 'The Betrayal', views: '5.6M', author: 'Katzhen', original: false, genre: 'Fantasy', tagline: 'Left to die in the frozen spire by the saintess you swore to protect.' },
  { rank: 7, title: 'Psychic Academy NOVA', views: '8.1M', author: 'OOC', original: true, genre: 'Academy', tagline: 'Telekinesis, mind-shatter, and covert syndicate wars inside Sector NOVA.' },
  { rank: 8, title: 'Isekai Gone Wrong', views: '8.5M', author: 'DOO', original: false, genre: 'Isekai', tagline: 'You were supposed to be summoned as the hero—not wedged between two rival queens.' },
  { rank: 9, title: 'My High School Romance', views: '3.6M', author: 'OOC', original: true, genre: 'Romance', tagline: 'Cherry blossoms, rooftop lunches, and three childhood confessions at once.' },
  { rank: 10, title: 'APEX Heroes Academy', views: '7.3M', author: 'GlizzyMaster', original: false, genre: 'Academy', tagline: 'Suit up, sync your core, and outshine the prodigies of Class S.' },
  { rank: 11, title: 'ACADEMIA | MY HEROES', views: '4M', author: 'OOC', original: true, genre: 'Academy', tagline: 'Command a rogue squad of misfit cadets when the city barriers fall.' },
  { rank: 12, title: 'Hunter Academy', views: '323.1K', author: 'OOC', original: true, genre: 'Action', tagline: 'Rifts are opening inside campus grounds. Only awakened hunters graduate alive.' },
  { rank: 13, title: 'Titan Academy', views: '5.5M', author: 'GlizzyMaster', original: false, genre: 'Sci-Fi', tagline: 'Pilot towering neural mechs against colossal kaiju breaches.' },
  { rank: 14, title: 'Relic Academy', views: '4.5M', author: 'Kaiserr431', original: false, genre: 'Fantasy', tagline: 'Bond with a cursed sentient blade inside the Crimson Relic Halls.' },
  { rank: 15, title: 'Heros Chronicle', views: '2.8M', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'A quiet frontier village, a fox-kin companion, and an ancient prophecy.' },
  { rank: 16, title: 'A Trash Nobles Academy Survival', views: '242.2K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Reborn into the disgraced third son of House Valen with chapter-one foresight.' },
  { rank: 17, title: 'Chronicle Hero Academy', views: '646.6K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Ancient summoning circles hum beneath the lecture halls.' },
  { rank: 18, title: 'ISEKAI IN ANOTHER WORLD', views: '2M', author: 'Mrcream', original: false, genre: 'Isekai', tagline: 'Draw your fate from the Arcane Deck of Worlds.' },
  { rank: 19, title: 'Isekai Matriarchal World', views: '172.6K', author: 'Katzhen', original: false, genre: 'Isekai', tagline: 'Navigate royal court intrigue where five queens vie for your loyalty.' },
  { rank: 20, title: 'Im the Only Human in the Monster Academy', views: '234.1K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Conceal your human pulse while surrounded by apex vampires and dragonkin.' },
  { rank: 21, title: 'OOC Fight Academy', views: '4.7M', author: 'OOC', original: true, genre: 'Action', tagline: 'No powers, no weapons—just fists, turf wars, and the rooftop throne.' },
  { rank: 22, title: 'SOVEREIGN', views: '2.4M', author: 'OOC', original: true, genre: 'Sci-Fi', tagline: 'Airships, sky-pirates, and forgotten clockwork empires.' },
  { rank: 23, title: 'Class X | Villain Academia', views: '1.1M', author: 'Babble', original: false, genre: 'Academy', tagline: 'Rehabilitation or riot? You are the new warden of Class X.' },
  { rank: 24, title: 'Devil Hunter', views: '459.2K', author: 'OOC', original: true, genre: 'Urban', tagline: 'Neon alleys, cursed contracts, and a hunter who never misses.' },
  { rank: 25, title: 'LOOKISM Taste of Hierarchy', views: '3.5M', author: 'OOC', original: true, genre: 'Urban', tagline: 'Two bodies, one ruthless school hierarchy, and underground crews.' },
  { rank: 26, title: 'The Villain Who Stopped Laughing', views: '65.8K', author: 'ZeroPulse', original: false, genre: 'Fantasy', tagline: 'When the demon lord retires to the front row of the hero parade.' },
  { rank: 27, title: 'Choose Your Anime Isekai', views: '4.2M', author: 'SkyHeart', original: false, genre: 'Isekai', tagline: 'Four portals burn before you: Mecha, Magic, Cozy Farm, or Demon Realm.' },
  { rank: 28, title: 'I Became the Oyabun of a Failing Yakuza', views: '151.5K', author: 'OOC', original: true, genre: 'Urban', tagline: 'Rebuild a shattered syndicate in rain-soaked Shinjuku.' },
  { rank: 29, title: 'Reincarnated With an OP Skill 2', views: '6M', author: 'Nuzelle', original: false, genre: 'Fantasy', tagline: 'System. Skill. Adventure. Change your fate.' },
  { rank: 30, title: 'Astra Chronicles', views: '3.9M', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Shrine spirits and fallen blades in the crimson valleys of Astra.' },
  { rank: 31, title: 'Constellation The Ending War', views: '133.9K', author: 'OOC', original: true, genre: 'Action', tagline: 'The stars themselves sponsor your survival in the final scenario.' },
  { rank: 32, title: 'Summoned Into A Girls Only Dormitory', views: '52.1K', author: 'Chuuro', original: false, genre: 'Romance', tagline: 'A botched summoning circle drops you straight into Room 304.' },
  { rank: 33, title: 'The Groom Who Was Replaced', views: '79.1K', author: 'BlakZeus', original: false, genre: 'Romance', tagline: 'Walk out of the cathedral—and into a destiny they never saw coming.' },
  { rank: 34, title: 'My Friend Got Way Too Pretty', views: '293.8K', author: 'OOC', original: true, genre: 'Romance', tagline: 'Summer break changed everything about your childhood best friend.' },
  { rank: 35, title: 'Universe World Simulator', views: '2.9M', author: 'OOC', original: true, genre: 'Isekai', tagline: 'Into every world you imagine—anime, novels, comics, and beyond.' },
  { rank: 36, title: 'The Hero She Chose', views: '85.6K', author: 'So1o', original: false, genre: 'Fantasy', tagline: 'Forged in steel and oath beside the silver-armored vanguard.' },
  { rank: 37, title: 'Universe World Simulator 2', views: '1M', author: 'OOC', original: true, genre: 'Isekai', tagline: 'Make your own story across infinite parallel worlds.' },
  { rank: 38, title: 'Was School Easy', views: '980.8K', author: 'OOC', original: true, genre: 'Urban', tagline: 'Quiet earbuds, sharp eyes, and the secrets behind Class 2-B.' },
  { rank: 39, title: 'Failed Knight of the Swordsmanship Family', views: '1.3M', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Mocked for zero mana—until your wooden blade splits the sky.' },
  { rank: 40, title: 'OOC High Zombie Apocalypse', views: '2M', author: 'OOC', original: true, genre: 'Action', tagline: 'Barricade the third-floor gym before the infected horde breaches the gate.' },
  { rank: 41, title: 'My Online Wife Is the Schools Most Popular Girl', views: '43.1K', author: 'Hanusis', original: false, genre: 'Romance', tagline: 'Your raid partner in-game sits two desks away in homeroom.' },
  { rank: 42, title: 'Human Transfer Student at Beastfolk Academy', views: '168.2K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Ears, tails, and territorial duels on your first morning.' },
  { rank: 43, title: 'Seoul War', views: '180.7K', author: 'OOC', original: true, genre: 'Action', tagline: 'Awakened guilds clash beneath the shattered Han River skyline.' },
  { rank: 44, title: 'ASHFORD', views: '488.1K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Iron knights and shrouded intrigue in the mist-covered city of Ashford.' },
  { rank: 45, title: 'Boss Acts Weird Only Around Me', views: '373.9K', author: 'OOC', original: true, genre: 'Romance', tagline: 'He baked 50 loaves at midnight—and acts like nothing happened.' },
  { rank: 46, title: 'Kicked Out of the S Rank Party But Even Better', views: '611.7K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'They thought your support buff was useless. Now they cannot clear Floor 12.' },
  { rank: 47, title: 'A Menhera and Yandere Both Love Me No Way', views: '105K', author: 'OOC', original: true, genre: 'Romance', tagline: 'A menhera and a yandere both love me at once.' },
  { rank: 48, title: 'Selenia Academy', views: '529.5K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Vampire aristocrats rule the night curriculum at Selenia.' },
  { rank: 49, title: 'Traitor Girlfriend Get Revenge', views: '52.6K', author: 'WibbleWe', original: false, genre: 'Romance', tagline: 'Turn the tables on the noble house that framed you.' },
  { rank: 50, title: 'Once Yours', views: '81.5K', author: 'So1o', original: false, genre: 'Fantasy', tagline: 'Years after the crown divided you, the emerald empress sends a letter.' },
  { rank: 51, title: 'My Ex Fiancee Is My New Boss', views: '32.5K', author: 'rubbyboy', original: false, genre: 'Romance', tagline: 'Late-night overtime just got infinitely more complicated.' },
  { rank: 52, title: 'The Night She Chose Me', views: '40.4K', author: 'DrewBee', original: false, genre: 'Romance', tagline: 'One masquerade ballroom, one whispered deal under chandeliers.' },
  { rank: 53, title: 'How to Live as a Vampire in 21st-Century Korea', views: '87.3K', author: 'OOC', original: true, genre: 'Urban', tagline: 'Livestreaming at night, hiding fangs by day.' },
  { rank: 54, title: 'WORLDLINE', views: '3.3M', author: 'OOC', original: true, genre: 'Sci-Fi', tagline: 'Any world. Any anchor. Bend the line.' },
  { rank: 55, title: 'She Has Her Eyes on Me', views: '764.2K', author: 'OOC', original: true, genre: 'Romance', tagline: 'After-school classroom silence and an unreadable smile.' },
  { rank: 56, title: 'The Family We Found', views: '45.6K', author: 'HamezDaKing', original: false, genre: 'Romance', tagline: 'Warmth, second chances, and building a home from scratch.' },
  { rank: 57, title: 'Iron Fist Academy', views: '1.6M', author: 'OOC', original: true, genre: 'Action', tagline: 'Our neighborhood exercise class was secretly a martial arts sect.' },
  { rank: 58, title: 'HUNTERS', views: '1.7M', author: 'OOC', original: true, genre: 'Action', tagline: 'The dream is shattered. The Tower has broken.' },
  { rank: 59, title: 'Jujutsu Academy Human Yokai Special Task', views: '803.5K', author: 'OOC', original: true, genre: 'Action', tagline: 'Seal rogue curses alongside the Special Task division.' },
  { rank: 60, title: 'The Divorcee Wants to Be the Top Idol Again', views: '90.7K', author: 'OOC', original: true, genre: 'Romance', tagline: 'One last audition under stage lights.' },
  { rank: 61, title: 'Abyssus Perpetuum', views: '41.1K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Dive into the bioluminescent depths where ancient leviathans sleep.' },
  { rank: 62, title: 'I Became a National Power-Class Returnee', views: '223.8K', author: 'OOC', original: true, genre: 'Action', tagline: 'Ten years inside the Demon Gate—now you return at Level 999.' },
  { rank: 63, title: 'Monochrome City', views: '1.4M', author: 'OOC', original: true, genre: 'Urban', tagline: 'Noir rain, syndicate bounties, and cold steel.' },
  { rank: 64, title: 'Became the Witch Academys Only Male Student', views: '1.5M', author: 'OOC', original: true, genre: 'Academy', tagline: 'Forbidden grimoires and six coven leaders watching every spell.' },
  { rank: 65, title: 'Ubermorph City of Chaos', views: '35.1K', author: 'OOC', original: true, genre: 'Sci-Fi', tagline: 'Survive. Seize. Evolve.' },
  { rank: 66, title: 'A Free Life in Isekai', views: '2.2M', author: 'Smitty', original: false, genre: 'Isekai', tagline: 'Live freely. Choose your path across emerald valleys.' },
  { rank: 67, title: 'Transmigrated Sword Houses Magic Genius', views: '922.4K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Born with supreme arcane affinity inside a sword-obsessed clan.' },
  { rank: 68, title: 'Your Highschool Bully Needs a Place to Stay', views: '62K', author: 'BEEHGH', original: false, genre: 'Romance', tagline: 'Rain on the porch, a suitcase, and an unexpected truce.' },
  { rank: 69, title: 'Eclipse Academy', views: '88.6K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Light elves and shadow vampires share one uneasy academy.' },
  { rank: 70, title: 'Hey Loser', views: '733.5K', author: 'OOC', original: true, genre: 'Romance', tagline: 'Sharp tongue, secret kindness, and detention together.' },
  { rank: 71, title: 'I Was Summoned With 3 SSS-Rank Abilities', views: '1.2M', author: 'PlayerTfbLsA', original: false, genre: 'Isekai', tagline: 'Three SSS-rank blessings—and three goddesses arguing over you.' },
  { rank: 72, title: 'Came Back Only to Find Out Shes Moved On', views: '22.8K', author: 'Chris7', original: false, genre: 'Romance', tagline: 'Start over with clarity, grit, and a quiet smile.' },
  { rank: 73, title: 'Banished From the A Rank Party', views: '274.4K', author: 'NozzleVf', original: false, genre: 'Fantasy', tagline: 'Form a rival guild with the outcasts they underestimated.' },
  { rank: 74, title: 'Yanderes Double Life', views: '287.3K', author: 'OOC', original: true, genre: 'Romance', tagline: 'Class rep by morning, dangerously devoted shadow by night.' },
  { rank: 75, title: 'My Infinite Skill Draft Broke the System', views: '1.3M', author: 'DrippyIce', original: false, genre: 'Fantasy', tagline: 'You may select up to 10 skills—unless you find the hidden exploit.' },
  { rank: 76, title: 'Dating the Strongest Hero', views: '1.5M', author: 'PizzaEater9', original: false, genre: 'Action', tagline: 'Skyscrapers, paparazzi, and keeping your civilian identity secret.' },
  { rank: 77, title: 'Sword Prodigy in a Magic Supremacist World', views: '251.7K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Cut through seventh-circle spells with pure aura bladework.' },
  { rank: 78, title: 'My Ex Moved In', views: '25K', author: 'Gleetus', original: false, genre: 'Romance', tagline: 'One spare bedroom and far too much unfinished history.' },
  { rank: 79, title: 'Curse Management Bureau', views: '31.6K', author: 'OOC', original: true, genre: 'Urban', tagline: 'Brew containment potions and track anomalies for the Bureau.' },
  { rank: 80, title: 'Reincarnated With an OP Skill Remastered', views: '303.2K', author: 'Nuzelle', original: false, genre: 'Fantasy', tagline: 'The classic System survival saga rebuilt with deeper lore.' },
  { rank: 81, title: 'She Thinks I Am in Love With Her', views: '20.2K', author: 'rubbyboy', original: false, genre: 'Romance', tagline: 'A harmless umbrella share turns into a campus-wide rumor.' },
  { rank: 82, title: 'War of Heaven and Earth', views: '83.9K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Modern fantasy collides with angelic and demonic legions.' },
  { rank: 83, title: 'GenderReversed High School Life', views: '425.4K', author: 'OOC', original: true, genre: 'Romance', tagline: 'A world where every social role flipped overnight.' },
  { rank: 84, title: 'The Student Council President', views: '559.4K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Only me, hated by the student council president—or so it seems.' },
  { rank: 85, title: 'Gender Reversed Campus Life', views: '327K', author: 'OOC', original: true, genre: 'Romance', tagline: 'University life in an upside-down world.' },
  { rank: 86, title: 'I Possessed an Extra in an Otome Academy', views: '374K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Avoid the doom flags while the heroines notice you instead.' },
  { rank: 87, title: 'Dont Quit the Fandom', views: '19.6K', author: 'OOC', original: true, genre: 'Romance', tagline: 'Your favorite idol shows up at your part-time cafe.' },
  { rank: 88, title: 'The Older Woman Next Door', views: '538.6K', author: 'DOO', original: false, genre: 'Romance', tagline: 'Warm porch lights, late evening tea, and quiet confessions.' },
  { rank: 89, title: 'The Commoner Enrollee of the Noble Academy', views: '20K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Scholarship seat in an academy of proud bloodlines.' },
  { rank: 90, title: 'Weakest of the Academy', views: '708K', author: 'OOC', original: true, genre: 'Action', tagline: 'Crimson eyes awake when everyone thinks you are at zero.' },
  { rank: 91, title: 'OVERRULE What Makes a Hero', views: '422.7K', author: 'OOC', original: true, genre: 'Action', tagline: 'Rewrite the hero registry with sheer willpower.' },
  { rank: 92, title: 'Special Gifted High School', views: '373.3K', author: 'OOC', original: true, genre: 'Academy', tagline: 'Lightning sparks in Classroom 1-A.' },
  { rank: 93, title: 'The time I got reincarnated as a monster', views: '2.3M', author: 'GrumpyGoose', original: false, genre: 'Isekai', tagline: 'Level up from a tiny kobold beside a slime and wolf pup.' },
  { rank: 94, title: 'My Girlfriend is a Supervillain', views: '301.8K', author: 'Corduroy', original: false, genre: 'Action', tagline: 'Rooftop rendezvous with the citys most wanted mastermind.' },
  { rank: 95, title: 'Skyward Academy', views: '776K', author: 'GlizzyMaster', original: false, genre: 'Sci-Fi', tagline: 'Command floating fleet carriers above the cloudline.' },
  { rank: 96, title: 'Merit Supremacy', views: '1.2M', author: 'OOC', original: true, genre: 'Academy', tagline: 'Every exam score decides your dorm, budget, and authority.' },
  { rank: 97, title: 'Extra in the Zombie Apocalypse', views: '466.8K', author: 'OOC', original: true, genre: 'Action', tagline: 'Survive episode one when the broadcast goes dead.' },
  { rank: 98, title: 'Cianis Dating Inn', views: '249.8K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Our solo fantasy inn becomes a haven for wandering adventurers.' },
  { rank: 99, title: 'First National Hunter Academy', views: '388K', author: 'OOC', original: true, genre: 'Action', tagline: 'Mana blades and dungeon clear drills at dawn.' },
  { rank: 100, title: 'Im FRank but My Summons Are SSS-Rank', views: '14.3K', author: 'OOC', original: true, genre: 'Fantasy', tagline: 'Lowest physical stat in the class—highest-tier mythical summons.' },
];

const OP_SKILL_2_PROLOGUE = `One moment, you're alive.

The next—an impact, a flash of pain, and everything disappears.

No final speech. No dramatic revelation.

Just silence.

When awareness returns, you're standing in an endless white void.

There are no walls. No ceiling. No horizon. The ground beneath you is only slightly darker than the space around it—smooth, glasslike, stretching forever.

Your reflection faintly follows beneath your feet.

"...What the hell?"

Blue light flickers ahead.

Thin lines of energy trace themselves through the air, assembling into a massive translucent panel. A circular platform forms beneath it, casting a soft blue glow across the reflective floor.

The panel finishes materializing.

Five selections pulse softly beneath the display.`;

export const FEATURED_STORIES = [
  {
    rank: 47,
    title: 'A Menhera and Yandere Both Love Me No Way',
    subtitle: 'A menhera and a yandere both love me at once.',
    image: '/assets/covers/cover_047.jpg',
  },
  {
    rank: 29,
    title: 'Reincarnated With an OP Skill 2',
    subtitle: 'System. Skill. Adventure. Change your fate.',
    image: '/assets/scenes/op_skill_2_cover.jpg',
  },
  {
    rank: 1,
    title: 'Lumencia Academy',
    subtitle: 'Enter the arcane halls where every duel rewrites fate.',
    image: '/assets/covers/cover_001.jpg',
  },
  {
    rank: 35,
    title: 'Universe World Simulator',
    subtitle: 'Into every world you imagine.',
    image: '/assets/covers/cover_035.jpg',
  },
  {
    rank: 54,
    title: 'WORLDLINE',
    subtitle: 'Any world. Any anchor. Bend the line.',
    image: '/assets/covers/cover_054.jpg',
  },
  {
    rank: 66,
    title: 'A Free Life in Isekai',
    subtitle: 'Live freely and forge your own path across Arden.',
    image: '/assets/covers/cover_066.jpg',
  },
];

export const STORIES: StoryItem[] = RAW_TOP_100.map((item) => {
  const padRank = String(item.rank).padStart(3, '0');
  const cover = `/assets/covers/cover_${padRank}.jpg`;
  const isOpSkill2 = item.rank === 29;

  return {
    rank: item.rank,
    id: `story-${item.rank}`,
    title: item.title,
    views: item.views,
    author: item.author,
    original: item.original,
    cover,
    genre: item.genre,
    audience: 'All-oriented',
    imageCount: isOpSkill2 ? 50 : 12 + (item.rank % 24),
    tagline: item.tagline ?? 'Enter a living AI-directed world where every choice reshapes the plot.',
    tags: isOpSkill2
      ? ['#Fantasy', '#Isekai', '#RPG', '#System', '#World']
      : [`#${item.genre}`, '#OOC', '#Interactive', '#Storytelling'],
    likesCount: isOpSkill2 ? '28.7K' : `${(1.2 + ((101 - item.rank) * 0.4)).toFixed(1)}K`,
    commentsCount: isOpSkill2 ? '14.5K' : `${Math.max(120, (101 - item.rank) * 95)}`,
    prologue: isOpSkill2
      ? OP_SKILL_2_PROLOGUE
      : `${item.tagline}\n\nThe scene opens as your pulse steadies and the world sharpens around you. Every word you speak and every move you make will ripple across the narrative.`,
    loreSections: isOpSkill2
      ? [
          {
            heading: 'Same OP Skill. New world. Bigger journey.',
          },
          {
            heading: 'VESPER & THE GOLDEN COAST',
            image: '/assets/scenes/vesper_map.jpg',
          },
          {
            image: '/assets/scenes/coast.jpg',
          },
          {
            image: '/assets/scenes/port.jpg',
          },
          {
            heading: 'CALDER & IRONRIDGE',
            image: '/assets/scenes/calder_port.jpg',
          },
          {
            image: '/assets/scenes/ironridge_city.jpg',
            text: 'Every city in Arden has its own history, culture, people, and secrets waiting to be discovered. Welcome to Arden—your journey starts here.',
          },
        ]
      : [
          {
            heading: `World Overview — ${item.title}`,
            text: `${item.tagline} Dynamic factions, persistent relationships, and real-time consequences tracked across every turn.`,
          },
        ],
    openingImage: isOpSkill2 ? '/assets/scenes/system.jpg' : undefined,
    openingChoices: isOpSkill2
      ? [
          "I'll choose Skill Thief. If I'm starting over, I might as well stack the deck.",
          "This feels like a trap. I'm not picking anything yet. What exactly are you?",
          'I walk toward the display, smirk, and jab my finger hard at Authority.',
        ]
      : [
          'Take in my surroundings carefully before making a move.',
          'Step forward and announce my presence with confidence.',
          'Check my current status and inventory first.',
        ],
    worldDefaults: isOpSkill2
      ? {
          date: 'Monday, Jan 1, 742 A.E.',
          location: 'Aetheria / Arden / Westwood / — / —',
          time: '8:00 AM',
          bankName: 'Aurel Bank: Haven (265 km)',
          currencySymbol: '₳',
          startingObjective: 'Survive and explore.',
        }
      : {
          date: 'Day 1',
          location: `${item.genre} Sector / Starting Zone`,
          time: '9:00 AM',
          bankName: 'Guild Vault',
          currencySymbol: '₵',
          startingObjective: 'Begin the opening arc.',
        },
    systemPrompt: `You are the AI Dungeon Master for "${item.title}" by ${item.author} (Genre: ${item.genre}). Premise: ${item.tagline}. Write vivid second-person prose with crisp pacing, distinct dialogue formatting (Name | "Line"), reactive world consequences, and RPG status continuity.`,
  };
});

export const SAMPLE_COMMENTS: StoryComment[] = [
  {
    id: 'c1',
    author: 'NuzelleFan',
    handle: '@ShadowBlade',
    timeAgo: '2h ago',
    text: 'Picking Skill Thief right at the start and using Time Stop on the basilisk felt straight out of a top manhwa!',
    likes: 412,
  },
  {
    id: 'c2',
    author: 'ArdenExplorer',
    handle: '@VesperMerchant',
    timeAgo: '6h ago',
    text: 'The Full status HUD + Arden map lore makes keeping track of Haven, Calder, and Westwood so immersive.',
    likes: 189,
  },
  {
    id: 'c3',
    author: 'KatzhenReader',
    handle: '@ReinaMain',
    timeAgo: '1d ago',
    text: 'Tip: switch to Skillful or Superb when big party encounters start—dialogue gets insanely expressive.',
    likes: 94,
  },
];
