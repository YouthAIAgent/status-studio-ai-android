# Status Studio AI

An Expo-based Android creator app that turns a short prompt, a reference image, and a few style choices into a ready-to-post content pack.

## What it does

- Generates hooks, captions, storyboards, shot lists, and hashtags
- Supports mode, tone, and language presets
- Accepts an optional reference image
- Saves drafts locally
- Copies and shares the finished pack
- Optionally uses an OpenAI-compatible endpoint for cloud boost

## Run it

```bash
cd status-studio-android
npm run web
```

For Android preview in Expo Go:

```bash
npm run android
```

## Storage

- Drafts and settings are stored locally
- API keys are stored with SecureStore on native builds and fall back to local storage on web

## Build notes

- Expo SDK 56
- React Native 0.85
- Portrait-first layout
- Dark creator-focused visual system

