import type { AppSettings, ContentLanguage, ContentMode, ContentTone } from "../lib/types";

export const contentModes: Array<{
  id: ContentMode;
  label: string;
  description: string;
}> = [
  { id: "reel", label: "Reel", description: "Fast hook, kinetic pacing, and a sharp payoff." },
  { id: "status", label: "Status", description: "Short, sticky, and easy to send to friends." },
  { id: "meme", label: "Meme", description: "Funny first, explain later." },
  { id: "story", label: "Story", description: "Personal, honest, and conversational." },
  { id: "carousel", label: "Carousel", description: "Swipeable steps that land cleanly." },
];

export const contentTones: Array<{
  id: ContentTone;
  label: string;
  description: string;
}> = [
  { id: "cinematic", label: "Cinematic", description: "Dramatic, visual, and trailer-like." },
  { id: "playful", label: "Playful", description: "Bright, social, and easy to repost." },
  { id: "premium", label: "Premium", description: "Minimal, polished, and high-end." },
  { id: "warm", label: "Warm", description: "Human, kind, and relatable." },
  { id: "chaotic", label: "Chaotic", description: "Fast, meme-heavy, and energetic." },
];

export const contentLanguages: Array<{
  id: ContentLanguage;
  label: string;
  description: string;
}> = [
  { id: "hinglish", label: "Hinglish", description: "Mixed Hindi-English voice for India-first sharing." },
  { id: "hindi", label: "Hindi", description: "Natural Hindi copy with a clean social cadence." },
  { id: "english", label: "English", description: "Clear English for broad creator audiences." },
];

export const starterPrompts: Array<{
  id: string;
  label: string;
  prompt: string;
  mode: ContentMode;
  tone: ContentTone;
  language: ContentLanguage;
}> = [
  {
    id: "morning",
    label: "Morning routine",
    prompt: "Turn my morning routine into a reel that feels cinematic but still real.",
    mode: "reel",
    tone: "cinematic",
    language: "hinglish",
  },
  {
    id: "roast",
    label: "Friend roast",
    prompt: "Make a funny friend roast status about always being late but still acting important.",
    mode: "meme",
    tone: "playful",
    language: "hinglish",
  },
  {
    id: "launch",
    label: "Brand launch",
    prompt: "Create a premium launch pack for a new AI creator app.",
    mode: "carousel",
    tone: "premium",
    language: "english",
  },
  {
    id: "study",
    label: "Study grind",
    prompt: "Make my study grind look motivating and shareable.",
    mode: "story",
    tone: "warm",
    language: "hindi",
  },
  {
    id: "travel",
    label: "Travel flex",
    prompt: "Turn a short travel clip into a clean status that feels expensive.",
    mode: "status",
    tone: "premium",
    language: "hinglish",
  },
  {
    id: "chaos",
    label: "Chaos mode",
    prompt: "Make this random idea feel like a viral meme drop.",
    mode: "meme",
    tone: "chaotic",
    language: "english",
  },
];

export const templatePlaybooks: Array<{
  id: string;
  title: string;
  description: string;
  prompt: string;
  mode: ContentMode;
  tone: ContentTone;
  language: ContentLanguage;
}> = [
  {
    id: "glow-up",
    title: "Glow-up reveal",
    description: "Best for before-after moments, personal wins, and transformation clips.",
    prompt: "My glow-up story should feel powerful, honest, and instantly shareable.",
    mode: "reel",
    tone: "cinematic",
    language: "hinglish",
  },
  {
    id: "brand-teaser",
    title: "Brand teaser",
    description: "A polished launch frame for creators, founders, and side projects.",
    prompt: "Create a premium teaser for my new creator brand launch.",
    mode: "carousel",
    tone: "premium",
    language: "english",
  },
  {
    id: "status-checkin",
    title: "Night status",
    description: "Soft, reflective copy that feels personal and easy to forward.",
    prompt: "Turn a late-night thought into a clean WhatsApp status pack.",
    mode: "status",
    tone: "warm",
    language: "hindi",
  },
  {
    id: "campus-clip",
    title: "Campus clip",
    description: "Perfect for college creators, inside jokes, and social proof moments.",
    prompt: "Make my campus moment feel fun, slightly chaotic, and very repostable.",
    mode: "meme",
    tone: "playful",
    language: "hinglish",
  },
  {
    id: "product-drop",
    title: "Product drop",
    description: "A clear structure for app demos, feature reveals, and launch content.",
    prompt: "Explain my product in a short reel that makes people want to try it.",
    mode: "reel",
    tone: "premium",
    language: "english",
  },
  {
    id: "confession",
    title: "Confession story",
    description: "For vulnerable posts, personal stories, and emotional hooks.",
    prompt: "Make a story pack that sounds honest, human, and easy to relate to.",
    mode: "story",
    tone: "warm",
    language: "hinglish",
  },
];

export const defaultSettings: AppSettings = {
  defaultMode: "reel",
  defaultTone: "playful",
  defaultLanguage: "hinglish",
  autoSave: true,
  cloudBoost: false,
  apiBaseUrl: "",
  apiModel: "",
  signature: "Built for fast, shareable creator packs.",
};

