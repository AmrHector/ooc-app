import { GoogleGenAI } from '@google/genai';
import { MODEL_TIERS } from '../data/models';
import { ChatMessage, HudState, ModelTierId, StatusDisplayMode, StoryItem } from '../types/ooc';

export interface DmTurnResult {
  narrative: string;
  hud?: HudState;
  infoBanner?: { title: string; detail?: string };
  image?: string;
  choices: string[];
  modePrompt?: boolean;
}

const DEFAULT_HUD: HudState = {
  date: 'Monday, Jan 1, 742 A.E.',
  location: 'Aetheria / Arden / Westwood / — / —',
  time: '8:00 AM',
  bankLabel: 'Aurel Bank: Haven (265 km)',
  cash: '₳0',
  card: '₳0',
  assets: 'None',
  inventory: 'None',
  adventurerCard: 'Unregistered',
  skillName: 'Skill Thief',
  abilities: ['Time Stop (5 sec) — 30s cooldown'],
  objective: '—',
  turn: 1,
};

function getLastHud(messages: ChatMessage[], story: StoryItem): HudState {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].hud) return messages[i].hud!;
  }
  const d = story.worldDefaults;
  return {
    ...DEFAULT_HUD,
    date: d?.date ?? DEFAULT_HUD.date,
    location: d?.location ?? DEFAULT_HUD.location,
    time: d?.time ?? DEFAULT_HUD.time,
    bankLabel: d?.bankName ?? DEFAULT_HUD.bankLabel,
    cash: `${d?.currencySymbol ?? '₳'}0`,
    card: `${d?.currencySymbol ?? '₳'}0`,
    objective: d?.startingObjective ?? '—',
    turn: 1,
  };
}

function getTurnCount(messages: ChatMessage[]): number {
  let maxTurn = 0;
  for (const m of messages) {
    if (m.hud && m.hud.turn > maxTurn) maxTurn = m.hud.turn;
  }
  return maxTurn;
}

/**
 * Handles the faithful scripted opening beats of "Reincarnated With an OP Skill 2"
 * before handing off seamlessly to live Gemini AI (or rich offline DM fallback).
 */
function tryScriptedOpSkill2Turn(
  story: StoryItem,
  userAction: string,
  messages: ChatMessage[],
  avatarName: string,
): DmTurnResult | null {
  if (story.rank !== 29) return null;

  const lower = userAction.toLowerCase();
  const hasChosenSkill = messages.some((m) => m.infoBanner?.title.includes('ACQUIRED'));
  const hasChosenMode = messages.some(
    (m) => m.hud !== undefined || m.content.includes('Are you ready to spawn'),
  );

  // Beat 1: Player chooses starting skill from the glowing SYSTEM panel
  if (!hasChosenSkill) {
    const pickedSkill = lower.includes('authority')
      ? 'AUTHORITY'
      : lower.includes('shapeshifter')
      ? 'SHAPESHIFTER'
      : lower.includes('adaptation')
      ? 'ADAPTATION'
      : lower.includes('beast')
      ? 'BEAST TAMER'
      : 'SKILL THIEF';

    const abilityLine =
      pickedSkill === 'SKILL THIEF'
        ? 'Starting Ability: ⏱️ Time Stop (5 seconds)\nAll abilities: 30-second cooldown after use.'
        : pickedSkill === 'AUTHORITY'
        ? 'Starting Ability: 👑 Command Pulse (3 seconds)\nAll abilities: 30-second cooldown after use.'
        : `Starting Ability: ✨ ${pickedSkill} Core\nAll abilities: 30-second cooldown after use.`;

    return {
      narrative: `The moment your finger touches the glowing text, the panel **shatters**.\n\nFragments of blue light scatter outward like broken glass—then freeze mid-air. Every shard reverses course, spiraling inward, converging on your chest.\n\nYou feel it hit.\n\nNot pain. Something deeper. Like a lock turning inside your ribcage. A mechanism clicking into place that was always meant to be there.\n\nYour vision whites out for half a second.\n\nWhen it clears, a single line of text burns in the air before you:\n\n[[INFO_BANNER]]\n\n${abilityLine}\n\nThe text fades. The void hums.\n\nThen a new panel assembles itself—three options this time, each one displayed with a brief example beneath it.\n\nC H O O S E   Y O U R   S T A T U S   D I S P L A Y\n\nThis choice is permanent. Choose carefully.`,
      infoBanner: {
        title: `💠 ${pickedSkill} — ACQUIRED`,
      },
      modePrompt: true,
      choices: [
        "I'll go with FULL. I want to know exactly what I'm dealing with in this new world.",
        "I'll choose MINIMAL. Just give me the essentials; I don't need my screen cluttered with useless noise.",
        "I ignore the prompts and try to punch the void. Seriously? I'm not choosing anything until someone explains what's going on.",
      ],
    };
  }

  // Beat 2: Player picks status display mode (FULL / MINIMAL / HIDDEN) -> spawns in Westwood with Arden map
  if (!hasChosenMode) {
    const modeLabel = lower.includes('minimal')
      ? 'MINIMAL'
      : lower.includes('hidden') || lower.includes('ignore')
      ? 'HIDDEN'
      : 'FULL';

    return {
      narrative: `You select '${modeLabel}'. The options dissolve, and the void around you begins to shimmer. It feels like the entire dimension is collapsing inward, funneling towards a single point.\n\nA bright light engulfs you, pulling you through a sensation of extreme pressure and then sudden, profound emptiness.\n\nThen, a forest.\n\nThe air is cool and damp, thick with the scent of rich earth and pine. Sunlight struggles to penetrate the dense canopy overhead, casting dappled shadows across the forest floor. You hear the rustling of leaves in a gentle breeze, the distant chirping of unseen birds.\n\nYou stand on a carpet of soft moss and fallen leaves. Around you, ancient trees with thick, gnarled trunks rise toward the sky. It's a primeval, vibrant green world.\n\nYou are alone.\n\n[[IMAGE]]\n\nAre you ready to spawn, ${avatarName}?`,
      image: '/assets/scenes/arden_map.jpg',
      choices: [
        "I'm ready. Let's see what this new world has to offer.",
        "I take a deep breath and start walking. I'm done waiting around.",
        "I stare at the status panel. Let's see who I can steal a skill from first.",
      ],
    };
  }

  // Beat 3: Turn 1 -> Westwood arrival
  const lastTurn = getTurnCount(messages);
  if (lastTurn === 0) {
    const hud: HudState = {
      ...DEFAULT_HUD,
      location: 'Aetheria / Arden / Westwood / — / —',
      time: '8:00 AM',
      objective: '—',
      turn: 1,
    };
    return {
      hud,
      narrative: `Turn 1\n\nYou are now in Westwood. The air is cool and damp, thick with the scent of rich earth and pine. Sunlight struggles to penetrate the dense canopy overhead, casting dappled shadows across the forest floor. You hear the rustling of leaves in a gentle breeze, the distant chirping of unseen birds. You stand on a carpet of soft moss and fallen leaves. Around you, ancient trees with thick, gnarled trunks rise toward the sky. It's a primeval, vibrant green world. You are alone.`,
      choices: [
        'I need to find civilization. I start walking in the direction where the trees seem thinner, keeping my eyes sharp for any tracks.',
        'This silence is unsettling. I crouch down and inspect the ground for footprints, trying to figure out what kind of creatures live here.',
        'I climb the highest nearby tree to get a better vantage point. I need a map, or at least a sign of where I actually am.',
      ],
    };
  }

  // Beat 4: Turn 2 -> Reptilian tracks
  if (lastTurn === 1 && (lower.includes('footprint') || lower.includes('track') || lower.includes('crouch'))) {
    const prev = getLastHud(messages, story);
    return {
      hud: { ...prev, time: '8:05 AM', objective: 'Survive and explore.', turn: 2 },
      narrative: `Turn 2\n\nYou crouch down, brushing aside a few damp leaves. The soil is soft, yielding easily to pressure. You scan the immediate area.\n\nAt first, you see nothing but the natural indentations of roots and rocks. But as you look closer, near the base of a particularly large oak, you spot something.\n\nIt's a track.\n\nIt's not a boot print. It's large—about the size of a dinner plate—and pressed deep into the mud. It looks reptilian, with three distinct, clawed toes pointing forward and a heavy heel pad. The edges of the print are sharp, suggesting whatever made it passed by recently.\n\nThe silence of the forest suddenly feels less peaceful and more expectant.`,
      choices: [
        'I should follow the trail. If I use my skill, I might be able to get the drop on whatever made that print.',
        'I retreat slowly, putting my back to a thick tree and staying as quiet as possible to avoid attracting anything.',
        "Time to test my luck. I shout into the forest, 'Hey! Come out and show yourself!' while readying my Time Stop.",
      ],
    };
  }

  // Beat 5: Turn 3 -> Basilisk encounter with artwork!
  if (lastTurn === 2 && (lower.includes('follow') || lower.includes('trail') || lower.includes('track'))) {
    const prev = getLastHud(messages, story);
    return {
      hud: {
        ...prev,
        location: 'Aetheria / Arden / Westwood / Deep Forest / —',
        time: '8:15 AM',
        objective: 'Track the creature.',
        turn: 3,
      },
      image: '/assets/scenes/basilisk.jpg',
      narrative: `Turn 3\n\nYou follow the prints deeper into Westwood. The tracks are consistent—heavy, deliberate, spaced evenly. Whatever made them wasn't running. It was **hunting**.\n\nThe forest grows denser. The canopy thickens overhead, filtering the morning light into thin, golden shafts that pierce through the gloom. The air feels heavier here. More humid. The birdsong has stopped entirely.\n\nYou push through a curtain of low-hanging vines and step into a small clearing.\n\nAnd you freeze.\n\n[[IMAGE]]\n\nIt's **massive**.\n\nThe creature coils in the center of the clearing, easily fifteen meters long from snout to tail. Its scales shimmer with an oily, greenish-black sheen, each one the size of your palm. The head is broad and angular, crowned with a ridge of bony spikes. Its eyes—slitted, yellow, unblinking—are fixed on something in the underbrush to your left.\n\nIt hasn't noticed you yet.\n\nIts body tenses. The muscles beneath those scales ripple. It's preparing to strike.\n\nThen you see what it's watching.\n\nA deer. Small, trembling, caught between two fallen logs with no escape route.\n\nThe basilisk's jaws part slightly. A low, rattling hiss escapes its throat.\n\nYou have maybe three seconds before it moves.`,
      choices: [
        'I hold my breath and activate Time Stop, sprinting toward the basilisk to strike at its eyes while it is frozen.',
        'I decide it is safer to retreat slowly, backing into the dense brush to avoid being spotted by the predator.',
        "I grab a heavy stone and hurl it at the basilisk's head, hoping to bait it into attacking me instead of the deer.",
      ],
    };
  }

  return null;
}

function buildLocalFallbackResponse(
  story: StoryItem,
  userAction: string,
  messages: ChatMessage[],
): DmTurnResult {
  const prev = getLastHud(messages, story);
  const nextTurn = prev.turn + 1;
  const lower = userAction.toLowerCase();

  // Check if user defeated something or used Time Stop
  if (story.rank === 29 && lower.includes('time stop') && prev.turn >= 3 && !prev.abilities.some((a) => a.includes('Acid Spray'))) {
    if (lower.includes('throat') || lower.includes('branch') || lower.includes('finish') || prev.turn >= 5) {
      return {
        hud: {
          ...prev,
          inventory: 'Heavy branch',
          abilities: [...prev.abilities, 'Acid Spray — Spit corrosive acid up to 10 meters (30s cooldown)'],
          objective: 'Meet the approaching adventurers.',
          turn: nextTurn,
        },
        infoBanner: {
          title: '💠 NEW ABILITY STOLEN',
          detail: 'Acid Spray — Spit corrosive acid up to 10 meters. (30s cooldown)',
        },
        image: '/assets/scenes/party.jpg',
        narrative: `Turn ${nextTurn}\n\nYou activate Time Stop.\n\nThe world **freezes again**. You drive a splintered branch deep into the basilisk's exposed throat.\n\nTime resumes.\n\n**CRACK—**\n\nThe basilisk thrashes violently before collapsing motionless onto the moss. A sharp pulse of electric energy surges into your chest.\n\n[[INFO_BANNER]]\n\nYou stand over the massive corpse, breathing hard. Then you hear voices—footsteps crunching through the underbrush.\n\n??? | "The tracking spell's going haywire—something killed it!"\n??? | "Move faster! If someone poached our quest target, I'm gonna be **pissed**."\n??? | "Reina, wait—we don't know what we're walking into."\n??? | "Then let's find out."\n\nFour figures emerge from the treeline on the opposite side of the clearing.\n\n[[IMAGE]]\n\nThey stop when they see you standing over the basilisk's corpse.`,
        choices: [
          'I drop the branch, hold up my hands, and smile. "Just finished a hunt. You guys lost?"',
          'I immediately sprint into the thickest part of the forest to hide before they spot me.',
          'I keep my guard up and ask who sent them after the basilisk.',
        ],
      };
    }
  }

  return {
    hud: {
      ...prev,
      turn: nextTurn,
    },
    narrative: `Turn ${nextTurn}\n\nYou commit to your decision: "${userAction}"\n\nThe world shifts smoothly around your action. Tension hangs in the air as nearby figures and environmental cues react to what you just did. Somewhere nearby, a new opportunity—or threat—begins to stir.\n\n*(Tip: Add your Gemini API key in **My → Gemini API Key** to enable live Gemini-powered Dungeon Master responses across every turn and all 100 stories.)*`,
    choices: [
      'Press forward and inspect the nearest clue.',
      'Hold position, watch carefully, and test my abilities.',
      'Speak up and try to negotiate or gather information.',
    ],
  };
}

export async function generateDmTurn(params: {
  apiKey: string;
  story: StoryItem;
  messages: ChatMessage[];
  userAction: string;
  tierId: ModelTierId;
  avatarName: string;
  userNotes: string;
  lengthDepth: string;
  writingStyle: string;
  memories: string[];
}): Promise<DmTurnResult> {
  const {
    apiKey,
    story,
    messages,
    userAction,
    tierId,
    avatarName,
    userNotes,
    lengthDepth,
    writingStyle,
    memories,
  } = params;

  // Preserve the faithful interactive opening sequence for Reincarnated With an OP Skill 2
  const scripted = tryScriptedOpSkill2Turn(story, userAction, messages, avatarName);
  if (scripted) {
    await new Promise((r) => setTimeout(r, 650));
    return scripted;
  }

  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    await new Promise((r) => setTimeout(r, 700));
    return buildLocalFallbackResponse(story, userAction, messages);
  }

  const tier = MODEL_TIERS.find((t) => t.id === tierId) ?? MODEL_TIERS[3];
  const lastHud = getLastHud(messages, story);
  const nextTurn = lastHud.turn + 1;

  const historyText = messages
    .slice(-10)
    .map((m) => `${m.role === 'user' ? 'PLAYER' : 'DM'}: ${m.content.slice(0, 700)}`)
    .join('\n\n');

  const prompt = `
${story.systemPrompt}

Player Avatar: ${avatarName}
Quality Tier: ${tier.name} (${tier.description})
Writing Style: ${writingStyle}
Target Length: ${lengthDepth}
Player Notes: ${userNotes || 'None'}
Key Memories: ${memories.length ? memories.join(' | ') : 'None'}

Current RPG HUD State:
${JSON.stringify({ ...lastHud, turn: nextTurn })}

Recent Transcript:
${historyText}

PLAYER ACTION:
${userAction}

Respond ONLY as valid JSON matching this exact schema (no markdown code fences around the JSON):
{
  "narrative": "Multi-paragraph immersive second-person RPG narrative starting with Turn ${nextTurn}. Use **bold** for dramatic emphasis words and Name | \"Dialogue\" for spoken lines.",
  "hud": {
    "date": "updated date string",
    "location": "Region / Area / Subarea",
    "time": "updated clock time",
    "bankLabel": "${lastHud.bankLabel}",
    "cash": "updated cash",
    "card": "updated card",
    "assets": "updated assets",
    "inventory": "updated comma-separated inventory",
    "adventurerCard": "updated rank or Unregistered",
    "skillName": "active primary skill",
    "abilities": ["ability 1", "ability 2"],
    "objective": "concise current objective",
    "turn": ${nextTurn}
  },
  "infoBanner": null or { "title": "💠 EVENT TITLE", "detail": "short detail" },
  "choices": [
    "Action option 1 written in first-person with a punchy opening sentence.",
    "Action option 2 written in first-person.",
    "Action option 3 written in first-person."
  ]
}
`;

  const ai = new GoogleGenAI({ apiKey: trimmedKey });
  const candidateModels = [tier.geminiModel, 'gemini-2.5-flash', 'gemini-2.0-flash'];

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.9,
        },
      });

      const rawText = response.text?.trim() ?? '';
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        narrative: String(parsed.narrative || `Turn ${nextTurn}\n\nThe story unfolds...`),
        hud: parsed.hud
          ? {
              date: String(parsed.hud.date ?? lastHud.date),
              location: String(parsed.hud.location ?? lastHud.location),
              time: String(parsed.hud.time ?? lastHud.time),
              bankLabel: String(parsed.hud.bankLabel ?? lastHud.bankLabel),
              cash: String(parsed.hud.cash ?? lastHud.cash),
              card: String(parsed.hud.card ?? lastHud.card),
              assets: String(parsed.hud.assets ?? lastHud.assets),
              inventory: String(parsed.hud.inventory ?? lastHud.inventory),
              adventurerCard: String(parsed.hud.adventurerCard ?? lastHud.adventurerCard),
              skillName: String(parsed.hud.skillName ?? lastHud.skillName),
              abilities: Array.isArray(parsed.hud.abilities)
                ? parsed.hud.abilities.map(String)
                : lastHud.abilities,
              objective: String(parsed.hud.objective ?? lastHud.objective),
              turn: Number(parsed.hud.turn ?? nextTurn),
            }
          : { ...lastHud, turn: nextTurn },
        infoBanner: parsed.infoBanner?.title
          ? {
              title: String(parsed.infoBanner.title),
              detail: parsed.infoBanner.detail ? String(parsed.infoBanner.detail) : undefined,
            }
          : undefined,
        choices: Array.isArray(parsed.choices) && parsed.choices.length > 0
          ? parsed.choices.slice(0, 3).map(String)
          : [
              'Investigate further and stay alert.',
              'Speak directly to those nearby.',
              'Prepare my skill and reposition.',
            ],
      };
    } catch (err) {
      // Try next fallback model if model name isn't enabled on this key
      if (modelName === candidateModels[candidateModels.length - 1]) {
        console.warn('Gemini DM call failed, falling back:', err);
        const fallback = buildLocalFallbackResponse(story, userAction, messages);
        fallback.narrative = `${fallback.narrative}\n\n*(Gemini API note: ${
          err instanceof Error ? err.message : 'Request failed'
        })*`;
        return fallback;
      }
    }
  }

  return buildLocalFallbackResponse(story, userAction, messages);
}
