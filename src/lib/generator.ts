import type { AppSettings, ContentLanguage, ContentMode, ContentTone, CreatorProfile, GeneratedPack } from "./types";

type RemotePackShape = Partial<Pick<GeneratedPack, "title" | "assetLabel" | "hook" | "coverLine" | "caption" | "altCaptions" | "script" | "shotList" | "hashtags" | "cta" | "tips" | "signatureLine" | "score">> & {
  topic?: string;
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "my",
  "your",
  "our",
  "this",
  "that",
  "is",
  "it",
  "me",
  "we",
  "you",
  "ko",
  "ka",
  "ki",
  "ke",
  "se",
  "aur",
  "hai",
  "haii",
  "yeh",
  "ye",
  "mera",
  "meri",
  "mere",
  "ho",
  "haii",
  "bhi",
  "par",
  "please",
  "make",
  "turn",
  "create",
  "into",
  "feel",
  "like",
  "pack",
  "status",
  "reel",
  "meme",
  "story",
  "carousel",
  "viral",
]);

const assetLabels: Record<ContentMode, Record<ContentLanguage, string>> = {
  reel: { english: "Reel pack", hinglish: "Reel pack", hindi: "Reel pack" },
  status: { english: "Status drop", hinglish: "Status drop", hindi: "Status drop" },
  meme: { english: "Meme drop", hinglish: "Meme drop", hindi: "Meme drop" },
  story: { english: "Story arc", hinglish: "Story arc", hindi: "Story arc" },
  carousel: { english: "Carousel deck", hinglish: "Carousel deck", hindi: "Carousel deck" },
};

const modeLabels: Record<ContentMode, Record<ContentLanguage, string>> = {
  reel: { english: "Reel", hinglish: "Reel", hindi: "Reel" },
  status: { english: "Status", hinglish: "Status", hindi: "Status" },
  meme: { english: "Meme", hinglish: "Meme", hindi: "Meme" },
  story: { english: "Story", hinglish: "Story", hindi: "Story" },
  carousel: { english: "Carousel", hinglish: "Carousel", hindi: "Carousel" },
};

const hookBank: Record<ContentLanguage, Record<ContentTone, string[]>> = {
  english: {
    cinematic: [
      "This is the moment where {topic} stops being ordinary.",
      "Wait for the last beat - that's where {topic} lands.",
    ],
    playful: [
      "I turned {topic} into something people actually want to send.",
      "{topic} went from random to repostable in one pass.",
    ],
    premium: [
      "A cleaner way to present {topic} without the clutter.",
      "{topic} but polished, minimal, and ready to post.",
    ],
    warm: [
      "A small {topic} moment that feels more personal than it looks.",
      "{topic} can be simple and still hit hard.",
    ],
    chaotic: [
      "I tried to make {topic} normal and it got louder instead.",
      "{topic} chose maximum energy and zero chill.",
    ],
  },
  hinglish: {
    cinematic: [
      "{topic} ka real climax last second mein aata hai.",
      "Ruko zara - {topic} ko yahan se cinematic banana hai.",
    ],
    playful: [
      "Maine {topic} ko aisa pack bana diya jo seedha forward ho.",
      "{topic} ab random nahi, proper repost material hai.",
    ],
    premium: [
      "{topic} ka sabse clean aur premium version yeh raha.",
      "{topic} ko simple, sharp, aur expensive feel dene ka tareeka.",
    ],
    warm: [
      "{topic} ka yeh version thoda personal hai, aur isi liye strong hai.",
      "{topic} ko soft rakho, but impact bada do.",
    ],
    chaotic: [
      "{topic} ko thoda tame kiya, phir bhi kaafi loud nikla.",
      "{topic} ne aaj full volume pe entry li.",
    ],
  },
  hindi: {
    cinematic: [
      "{topic} का असली असर आख़िरी पल में आता है।",
      "ज़रा रुकिए - {topic} को यहां cinematic बनाना है।",
    ],
    playful: [
      "मैंने {topic} को ऐसा पैक बना दिया जिसे लोग भेजना चाहेंगे।",
      "{topic} अब random नहीं, बल्कि share-worthy है।",
    ],
    premium: [
      "{topic} का सबसे साफ़ और premium version यही है।",
      "{topic} को simple, sharp, और classy feel देने का तरीका।",
    ],
    warm: [
      "{topic} का यह version थोड़ा personal है, और इसी वजह से मजबूत है।",
      "{topic} को soft रखिए, impact अपने आप बढ़ जाएगा।",
    ],
    chaotic: [
      "{topic} को थोड़ा संभाला, फिर भी energy पूरी बची रही।",
      "{topic} ने आज full volume पर entry ली।",
    ],
  },
};

const captionBank: Record<ContentLanguage, Record<ContentTone, string[]>> = {
  english: {
    cinematic: [
      "If you want {topic} to feel bigger than the raw clip, this is the angle.",
      "The trick is not adding noise - it is giving {topic} a clean story arc.",
    ],
    playful: [
      "Proof that {topic} becomes shareable the second you give it a sharp hook.",
      "Low effort is a trap. Give {topic} a better frame and it starts working harder.",
    ],
    premium: [
      "Minimal text, strong pacing, and one clear idea. That is the whole game for {topic}.",
      "A cleaner edit makes {topic} feel instantly more valuable.",
    ],
    warm: [
      "{topic} does not need to shout if the story feels honest.",
      "The best version of {topic} is the one that sounds like a person, not a promo.",
    ],
    chaotic: [
      "{topic} came in loud, and the pack leaned into it.",
      "If the idea is messy, the edit should at least be smart.",
    ],
  },
  hinglish: {
    cinematic: [
      "Agar {topic} ko bigger feel dena hai, angle pe kaam karo.",
      "{topic} ko loud nahi, bas sahi arc chahiye.",
    ],
    playful: [
      "{topic} ko sharp hook do aur dekhna kaise share-worthy ban jaata hai.",
      "Random clip ko pack mein badalne ka asli hack yahi hai.",
    ],
    premium: [
      "Less noise, better pacing, aur ek clear idea - {topic} ke liye yahi kaafi hai.",
      "{topic} ka clean edit usko instantly premium bana deta hai.",
    ],
    warm: [
      "{topic} ko shout karne ki zarurat nahi hoti, bas honest rehna hota hai.",
      "Best version wahi hai jo insaan jaisa lage, ad jaisa nahi.",
    ],
    chaotic: [
      "{topic} already loud hai, toh pack ne usko aur punch de diya.",
      "Idea messy ho sakta hai, par structure clean hona chahiye.",
    ],
  },
  hindi: {
    cinematic: [
      "यदि {topic} को बड़ा दिखाना है, तो angle पर ध्यान दीजिए।",
      "{topic} को आवाज़ नहीं, सही कहानी चाहिए।",
    ],
    playful: [
      "{topic} को sharp hook दीजिए और देखिए कैसे वह shareable बनता है।",
      "Random clip को pack में बदलने का असली तरीका यही है।",
    ],
    premium: [
      "कम noise, बेहतर pacing, और एक साफ़ idea - {topic} के लिए यही काफी है।",
      "{topic} का clean edit उसे तुरंत premium बना देता है।",
    ],
    warm: [
      "{topic} को चिल्लाने की ज़रूरत नहीं, बस honest होना चाहिए।",
      "सबसे अच्छा version वही है जो इंसान जैसा लगे, ad जैसा नहीं।",
    ],
    chaotic: [
      "{topic} पहले से loud है, pack ने बस उसे और punch दे दिया।",
      "Idea messy हो सकता है, लेकिन structure साफ़ होना चाहिए।",
    ],
  },
};

const ctaBank: Record<ContentLanguage, Record<ContentTone, string[]>> = {
  english: {
    cinematic: [
      "Save this idea and build the full cut from here.",
      "Post it once, then remix it for the next angle.",
    ],
    playful: [
      "Save it, share it, and let someone else copy the format.",
      "Post the version you would actually send to a friend.",
    ],
    premium: [
      "Keep the visual system consistent and the message sharp.",
      "Post the clean version first, then iterate on the next one.",
    ],
    warm: [
      "Save this for the next time the story needs a softer touch.",
      "Send it to the person who would feel seen by it.",
    ],
    chaotic: [
      "Ship it before the energy cools off.",
      "Post first, overthink later.",
    ],
  },
  hinglish: {
    cinematic: [
      "Is idea ko save karo aur full cut yahin se build karo.",
      "Ek baar post karo, phir next angle pe remix kar do.",
    ],
    playful: [
      "Save karo, bhejo, aur dekhna kaise format copy hota hai.",
      "Wahi version post karo jo tum sach mein friend ko bhejoge.",
    ],
    premium: [
      "Visual system consistent rakho aur message sharp.",
      "Pehle clean version post karo, phir next iterate karo.",
    ],
    warm: [
      "Jab story ko soft touch chahiye, is pack ko yaad rakhna.",
      "Us insaan ko bhejo jise yeh genuinely feel hoga.",
    ],
    chaotic: [
      "Energy thandi hone se pehle ship karo.",
      "Pehle post, baad mein overthink.",
    ],
  },
  hindi: {
    cinematic: [
      "इस आइडिया को सेव कीजिए और यहीं से पूरा cut बनाइए।",
      "एक बार पोस्ट करिए, फिर अगले angle पर remix कीजिए।",
    ],
    playful: [
      "सेव कीजिए, भेजिए, और देखिए format कैसे copy होता है।",
      "वही version पोस्ट कीजिए जो आप सच में दोस्त को भेजेंगे।",
    ],
    premium: [
      "Visual system को consistent रखिए और message को sharp।",
      "पहले clean version पोस्ट कीजिए, फिर अगला iterate करिए।",
    ],
    warm: [
      "जब story को softer touch चाहिए, इस pack को याद रखिए।",
      "उसे भेजिए जिसे यह सच में feel होगा।",
    ],
    chaotic: [
      "Energy ठंडी होने से पहले इसे ship कर दीजिए।",
      "पहले पोस्ट, बाद में overthink।",
    ],
  },
};

const coverBank: Record<ContentLanguage, Record<ContentTone, string[]>> = {
  english: {
    cinematic: ["Big move. Clean frame.", "Wait for the last beat."],
    playful: ["Sendable by design.", "Small clip, loud result."],
    premium: ["Minimal. Sharp. Ready.", "Quiet look, strong message."],
    warm: ["Feels personal on purpose.", "Soft story, solid impact."],
    chaotic: ["Maximum energy mode.", "Chaos, but organized."],
  },
  hinglish: {
    cinematic: ["Big move. Clean frame.", "Last beat tak ruko."],
    playful: ["Forward karne layak.", "Chhota clip, loud result."],
    premium: ["Minimal. Sharp. Ready.", "Quiet look, strong message."],
    warm: ["Personal feel by design.", "Soft story, solid impact."],
    chaotic: ["Maximum energy mode.", "Chaos, but organized."],
  },
  hindi: {
    cinematic: ["बड़ा move. साफ़ frame.", "अंतिम beat तक रुको।"],
    playful: ["भेजने लायक design.", "छोटा clip, बड़ा असर."],
    premium: ["Minimal. Sharp. Ready.", "शांत look, मजबूत message."],
    warm: ["जानबूझकर personal.", "नरम कहानी, मजबूत असर."],
    chaotic: ["Maximum energy mode.", "Chaos, but organized."],
  },
};

const titleSuffixes: Record<ContentMode, Record<ContentLanguage, string[]>> = {
  reel: { english: ["reel", "reel pack"], hinglish: ["reel", "reel pack"], hindi: ["रील", "रील पैक"] },
  status: { english: ["status", "status drop"], hinglish: ["status", "status drop"], hindi: ["स्टेटस", "स्टेटस ड्रॉप"] },
  meme: { english: ["meme drop", "meme pack"], hinglish: ["meme drop", "meme pack"], hindi: ["मीम ड्रॉप", "मीम पैक"] },
  story: { english: ["story arc", "story pack"], hinglish: ["story arc", "story pack"], hindi: ["स्टोरी आर्क", "स्टोरी पैक"] },
  carousel: { english: ["carousel", "slide deck"], hinglish: ["carousel", "slide deck"], hindi: ["carousel", "स्लाइड डेक"] },
};

const tipsByMode: Record<ContentMode, string[]> = {
  reel: [
    "Open with a face, result, or strong motion in the first 2 seconds.",
    "Keep caption text short enough to read at thumb speed.",
    "Use one clear transition instead of stacking too many edits.",
  ],
  status: [
    "Keep the visual quiet so the line can land.",
    "Use a strong center line and a short footer.",
    "Make it easy to screenshot and forward.",
  ],
  meme: [
    "Put the punchline in the first half, not the last frame.",
    "Let the text do the heavy lifting.",
    "Make sure the joke is readable without audio.",
  ],
  story: [
    "Start with the feeling, then reveal the detail.",
    "One honest sentence beats three generic ones.",
    "Leave enough space for a human pause.",
  ],
  carousel: [
    "Use one idea per slide.",
    "Make slide 1 impossible to ignore.",
    "End with a simple action the reader can actually do.",
  ],
};

const stopWords = new Set([...STOP_WORDS]);

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function pick<T>(items: T[], seed: number, offset = 0): T {
  if (items.length === 0) {
    throw new Error("Cannot pick from an empty list.");
  }

  return items[(seed + offset) % items.length];
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => {
      if (!part) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ")
    .trim();
}

function extractKeywords(prompt: string): string[] {
  const words = prompt
    .toLowerCase()
    .match(/[\p{L}\p{N}]+/gu)
    ?.map((word) => word.trim())
    .filter(Boolean)
    .filter((word) => !stopWords.has(word)) ?? [];

  return unique(words.filter((word) => word.length > 2));
}

function buildTopic(prompt: string, keywords: string[], language: ContentLanguage): string {
  const fallback = language === "hindi" ? "यह idea" : language === "hinglish" ? "yeh idea" : "this idea";
  const topWords = keywords.slice(0, 3);

  if (topWords.length === 0) {
    return fallback;
  }

  return titleCase(topWords.join(" "));
}

function buildSignature(settings: AppSettings, language: ContentLanguage): string {
  if (settings.signature.trim()) {
    return settings.signature.trim();
  }

  if (language === "hindi") {
    return "तेज़, साफ़, और share करने लायक.";
  }

  if (language === "hinglish") {
    return "Fast, clean, aur share-ready.";
  }

  return "Fast, clean, and share-ready.";
}

function interpolate(template: string, topic: string): string {
  return template.replaceAll("{topic}", topic);
}

function buildOutlineLines(topic: string, mode: ContentMode, language: ContentLanguage, seed: number): string[] {
  const intro = [
    { english: "Hook the audience in the first 2 seconds.", hinglish: "First 2 seconds mein hook do.", hindi: "पहले 2 सेकंड में hook दीजिए।" },
    { english: "Show the real moment, not just the polished end card.", hinglish: "Real moment dikhao, sirf end card nahi.", hindi: "असल moment दिखाइए, सिर्फ end card नहीं।" },
    { english: "Push the best visual beat to the middle.", hinglish: "Best visual beat ko middle mein rakho.", hindi: "सबसे अच्छा visual beat बीच में रखिए।" },
  ];
  const middle = [
    { english: "Give {topic} one emotional turn.", hinglish: "{topic} ko ek emotional turn do.", hindi: "{topic} में एक emotional turn दीजिए।" },
    { english: "Let the pacing breathe for one line.", hinglish: "Ek line ke liye pacing ko saans lene do.", hindi: "एक line के लिए pacing को थोड़ा सांस लेने दीजिए।" },
    { english: "Use a clean reveal instead of extra clutter.", hinglish: "Extra clutter ke bajay clean reveal rakho.", hindi: "Extra clutter की जगह clean reveal रखिए।" },
  ];
  const close = tipsByMode[mode];

  return [
    interpolate(pick(intro, seed)[language], topic),
    interpolate(pick(middle, seed, 1)[language], topic),
    close[0],
    close[1],
  ];
}

function buildShotList(topic: string, language: ContentLanguage, seed: number): string[] {
  const shots = [
    { english: `Close-up of ${topic} with a confident opening line.`, hinglish: `${topic} ka close-up, strong opening line ke saath.`, hindi: `${topic} का close-up, एक दमदार opening line के साथ.` },
    { english: `Cut to the main proof or transformation for ${topic}.`, hinglish: `${topic} ka main proof ya transformation dikhाओ.`, hindi: `${topic} का मुख्य proof या transformation दिखाइए।` },
    { english: "Add a clean motion beat or a subtle zoom.", hinglish: "Ek clean motion beat ya subtle zoom add karo.", hindi: "एक clean motion beat या subtle zoom जोड़िए।" },
    { english: `Finish with a clear CTA tied to ${topic}.`, hinglish: `${topic} se connected clear CTA ke saath end karo.`, hindi: `${topic} से जुड़ा साफ़ CTA के साथ end कीजिए।` },
  ];

  return shots.map((item) => item[language]);
}

function buildHashtags(keywords: string[], mode: ContentMode): string[] {
  const base = [
    "viral",
    "reels",
    "shorts",
    "creator",
    "status",
    mode === "meme" ? "meme" : mode,
  ];

  const topicTags = keywords
    .slice(0, 3)
    .map((word) => word.replace(/[^a-z0-9]+/gi, "").toLowerCase())
    .filter(Boolean);

  return unique(
    [...base, ...topicTags].map((tag) => `#${tag}`).slice(0, 7)
  );
}

function buildAltCaptions(topic: string, tone: ContentTone, language: ContentLanguage, seed: number): string[] {
  const candidates = [
    interpolate(pick(captionBank[language][tone], seed), topic),
    interpolate(pick(captionBank[language][tone], seed, 1), topic),
    language === "hindi"
      ? `${topic} को इतना clean बनाओ कि लोग save करने पर मजबूर हो जाएं.`
      : language === "hinglish"
        ? `${topic} ko itna clean rakho ki log save kare bina na rah saken.`
        : `Make ${topic} so clean that people hit save without thinking.`,
  ];

  return unique(candidates).slice(0, 3);
}

function buildCaption(topic: string, tone: ContentTone, language: ContentLanguage, seed: number): string {
  const lines = captionBank[language][tone].map((template) => interpolate(template, topic));
  const first = pick(lines, seed);
  const second = pick(lines, seed, 1);

  return `${first} ${second}`;
}

function buildHook(topic: string, tone: ContentTone, language: ContentLanguage, seed: number): string {
  const hooks = hookBank[language][tone].map((template) => interpolate(template, topic));
  return pick(hooks, seed);
}

function buildCoverLine(topic: string, tone: ContentTone, language: ContentLanguage, seed: number): string {
  const lines = coverBank[language][tone];
  const base = pick(lines, seed);
  return base.replace("topic", topic);
}

function buildTitle(topic: string, mode: ContentMode, language: ContentLanguage, seed: number): string {
  const suffixes = titleSuffixes[mode][language];
  const suffix = pick(suffixes, seed);

  if (language === "hindi") {
    return `${topic} ${suffix}`;
  }

  if (language === "hinglish") {
    return `${topic} ${suffix}`;
  }

  return `${topic} ${suffix}`;
}

function buildCta(topic: string, tone: ContentTone, language: ContentLanguage, seed: number): string {
  const ctas = ctaBank[language][tone];
  return interpolate(pick(ctas, seed), topic);
}

function clampScore(score: number): number {
  return Math.max(58, Math.min(98, Math.round(score)));
}

function buildSourceSummary(attachmentUri: string | null, mode: ContentMode, language: ContentLanguage): string {
  if (attachmentUri) {
    return language === "hindi"
      ? "आपकी attached photo को first frame के रूप में इस्तेमाल किया गया."
      : language === "hinglish"
        ? "Your attached photo is treated as the first frame."
        : "Your attached photo is treated as the first frame.";
  }

  const modeText = modeLabels[mode][language];
  return language === "hindi"
    ? `Text-first ${modeText} pack with no attachment.`
    : `Text-first ${modeText} pack with no attachment.`;
}

function normalizeRemotePack(raw: RemotePackShape, fallback: GeneratedPack): GeneratedPack {
  return {
    ...fallback,
    topic: raw.topic?.trim() || fallback.topic,
    title: raw.title?.trim() || fallback.title,
    assetLabel: raw.assetLabel?.trim() || fallback.assetLabel,
    hook: raw.hook?.trim() || fallback.hook,
    coverLine: raw.coverLine?.trim() || fallback.coverLine,
    caption: raw.caption?.trim() || fallback.caption,
    altCaptions: Array.isArray(raw.altCaptions) && raw.altCaptions.length > 0 ? raw.altCaptions.slice(0, 3).map(String) : fallback.altCaptions,
    script: Array.isArray(raw.script) && raw.script.length > 0 ? raw.script.slice(0, 5).map(String) : fallback.script,
    shotList: Array.isArray(raw.shotList) && raw.shotList.length > 0 ? raw.shotList.slice(0, 5).map(String) : fallback.shotList,
    hashtags: Array.isArray(raw.hashtags) && raw.hashtags.length > 0 ? raw.hashtags.slice(0, 7).map((item) => item.startsWith("#") ? item : `#${item}`) : fallback.hashtags,
    cta: raw.cta?.trim() || fallback.cta,
    tips: Array.isArray(raw.tips) && raw.tips.length > 0 ? raw.tips.slice(0, 5).map(String) : fallback.tips,
    signatureLine: raw.signatureLine?.trim() || fallback.signatureLine,
    score: typeof raw.score === "number" ? clampScore(raw.score) : fallback.score,
  };
}

async function tryCloudBoost(profile: CreatorProfile, settings: AppSettings, apiKey: string): Promise<GeneratedPack | null> {
  const baseUrl = settings.apiBaseUrl.trim().replace(/\/+$/, "");
  const model = settings.apiModel.trim();

  if (!baseUrl || !model || !apiKey.trim()) {
    return null;
  }

  const endpoint = baseUrl.endsWith("/chat/completions")
    ? baseUrl
    : baseUrl.endsWith("/v1")
      ? `${baseUrl}/chat/completions`
      : `${baseUrl}/v1/chat/completions`;

  const localFallback = buildLocalPack(profile, settings);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content:
            "You are a mobile creator strategist. Return only valid JSON with keys title, assetLabel, hook, coverLine, caption, altCaptions, script, shotList, hashtags, cta, tips, signatureLine, score, topic. Do not include markdown fences or commentary.",
        },
        {
          role: "user",
          content: [
            `Prompt: ${profile.prompt}`,
            `Mode: ${profile.mode}`,
            `Tone: ${profile.tone}`,
            `Language: ${profile.language}`,
            `Attachment: ${profile.attachmentUri ? "yes" : "no"}`,
            `Default signature: ${settings.signature}`,
            "Make the output feel ready to post, practical, and specific.",
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Cloud AI responded with ${response.status}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = payload.choices?.[0]?.message?.content?.trim();

  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as RemotePackShape;
    return normalizeRemotePack(parsed, localFallback);
  } catch {
    return null;
  }
}

export function buildLocalPack(profile: CreatorProfile, settings: AppSettings): GeneratedPack {
  const keywords = extractKeywords(profile.prompt);
  const seed = hashString(profile.prompt + profile.mode + profile.tone + profile.language + (profile.attachmentUri ?? ""));
  const topic = buildTopic(profile.prompt, keywords, profile.language);
  const title = buildTitle(topic, profile.mode, profile.language, seed);
  const assetLabel = assetLabels[profile.mode][profile.language];
  const hook = buildHook(topic, profile.tone, profile.language, seed);
  const coverLine = buildCoverLine(topic, profile.tone, profile.language, seed);
  const caption = buildCaption(topic, profile.tone, profile.language, seed);
  const altCaptions = buildAltCaptions(topic, profile.tone, profile.language, seed);
  const script = buildOutlineLines(topic, profile.mode, profile.language, seed);
  const shotList = buildShotList(topic, profile.language, seed);
  const hashtags = buildHashtags(keywords, profile.mode);
  const cta = buildCta(topic, profile.tone, profile.language, seed);
  const tips = [
    ...tipsByMode[profile.mode],
    profile.attachmentUri
      ? "Use the attached image as the visual anchor or opening frame."
      : profile.language === "hindi"
        ? "पहले 3 सेकंड में scroll-stopping visual डालिए."
        : profile.language === "hinglish"
          ? "First 3 seconds mein scroll-stopping visual rakho."
          : "Put a scroll-stopping visual in the first 3 seconds.",
  ];

  const keywordBonus = Math.min(8, keywords.length * 2);
  const modeBonus = profile.mode === "reel" ? 6 : profile.mode === "meme" ? 5 : 3;
  const toneBonus = profile.tone === "premium" ? 6 : profile.tone === "chaotic" ? 4 : 5;
  const lengthPenalty = profile.prompt.length > 160 ? 2 : 0;
  const score = clampScore(68 + keywordBonus + modeBonus + toneBonus - lengthPenalty + (seed % 7));

  return {
    id: `${Date.now()}-${seed.toString(16)}`,
    createdAt: new Date().toISOString(),
    prompt: profile.prompt.trim(),
    topic,
    title,
    assetLabel,
    hook,
    coverLine,
    caption,
    altCaptions,
    script,
    shotList,
    hashtags,
    cta,
    tips,
    signatureLine: buildSignature(settings, profile.language),
    score,
    mode: profile.mode,
    tone: profile.tone,
    language: profile.language,
    attachmentUri: profile.attachmentUri,
    sourceSummary: buildSourceSummary(profile.attachmentUri, profile.mode, profile.language),
  };
}

export async function generateContentPack(
  profile: CreatorProfile,
  settings: AppSettings,
  apiKey: string
): Promise<GeneratedPack> {
  const local = buildLocalPack(profile, settings);

  if (!settings.cloudBoost || !apiKey.trim()) {
    return local;
  }

  try {
    const cloudPack = await tryCloudBoost(profile, settings, apiKey);
    return cloudPack ?? local;
  } catch {
    return local;
  }
}

export function buildCompactShareText(pack: GeneratedPack): string {
  return [
    pack.title,
    "",
    `Hook: ${pack.hook}`,
    `Caption: ${pack.caption}`,
    `CTA: ${pack.cta}`,
    `Hashtags: ${pack.hashtags.join(" ")}`,
  ].join("\n");
}

export function buildFullCopyText(pack: GeneratedPack): string {
  return [
    pack.title,
    "",
    `Hook`,
    pack.hook,
    "",
    `Cover line`,
    pack.coverLine,
    "",
    `Caption`,
    pack.caption,
    "",
    `Alt captions`,
    ...pack.altCaptions.map((caption) => `- ${caption}`),
    "",
    `Storyboard`,
    ...pack.script.map((line, index) => `${index + 1}. ${line}`),
    "",
    `Shot list`,
    ...pack.shotList.map((line, index) => `${index + 1}. ${line}`),
    "",
    `Hashtags`,
    pack.hashtags.join(" "),
    "",
    `CTA`,
    pack.cta,
    "",
    `Signature`,
    pack.signatureLine,
    "",
    `Source`,
    pack.sourceSummary,
  ].join("\n");
}
