import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { defaultSettings } from "../data/presets";
import type { AppSettings, GeneratedPack } from "./types";

export const STORAGE_KEYS = {
  settings: "status-studio.settings",
  drafts: "status-studio.drafts",
  apiKey: "status-studio.api-key",
} as const;

const isWeb = Platform.OS === "web";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.settings);
  const parsed = safeParse<Partial<AppSettings>>(raw, {});
  return { ...defaultSettings, ...parsed };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export async function loadDrafts(): Promise<GeneratedPack[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.drafts);
  return safeParse<GeneratedPack[]>(raw, []);
}

export async function saveDrafts(drafts: GeneratedPack[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.drafts, JSON.stringify(drafts));
}

export async function clearDrafts(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.drafts);
}

export async function loadApiKey(): Promise<string> {
  if (isWeb) {
    return (await AsyncStorage.getItem(STORAGE_KEYS.apiKey)) ?? "";
  }

  return (await SecureStore.getItemAsync(STORAGE_KEYS.apiKey)) ?? "";
}

export async function saveApiKey(apiKey: string): Promise<void> {
  if (isWeb) {
    if (!apiKey) {
      await AsyncStorage.removeItem(STORAGE_KEYS.apiKey);
      return;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
    return;
  }

  if (!apiKey) {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.apiKey);
    return;
  }

  await SecureStore.setItemAsync(STORAGE_KEYS.apiKey, apiKey);
}

export async function clearAllStorage(): Promise<void> {
  await Promise.all([AsyncStorage.removeItem(STORAGE_KEYS.settings), AsyncStorage.removeItem(STORAGE_KEYS.drafts)]);

  if (isWeb) {
    await AsyncStorage.removeItem(STORAGE_KEYS.apiKey);
    return;
  }

  await SecureStore.deleteItemAsync(STORAGE_KEYS.apiKey);
}

