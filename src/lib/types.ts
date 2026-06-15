export type ContentMode = "reel" | "status" | "meme" | "story" | "carousel";

export type ContentTone = "cinematic" | "playful" | "premium" | "warm" | "chaotic";

export type ContentLanguage = "hinglish" | "hindi" | "english";

export type CreatorProfile = {
  prompt: string;
  mode: ContentMode;
  tone: ContentTone;
  language: ContentLanguage;
  attachmentUri: string | null;
};

export type GeneratedPack = {
  id: string;
  createdAt: string;
  prompt: string;
  topic: string;
  title: string;
  assetLabel: string;
  hook: string;
  coverLine: string;
  caption: string;
  altCaptions: string[];
  script: string[];
  shotList: string[];
  hashtags: string[];
  cta: string;
  tips: string[];
  signatureLine: string;
  score: number;
  mode: ContentMode;
  tone: ContentTone;
  language: ContentLanguage;
  attachmentUri: string | null;
  sourceSummary: string;
};

export type AppSettings = {
  defaultMode: ContentMode;
  defaultTone: ContentTone;
  defaultLanguage: ContentLanguage;
  autoSave: boolean;
  cloudBoost: boolean;
  apiBaseUrl: string;
  apiModel: string;
  signature: string;
};

