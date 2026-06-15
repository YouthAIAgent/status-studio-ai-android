# Status Studio AI MVP Plan

## Product Goal

Turn a rough idea, photo, or one-line prompt into a shareable creator pack in under a minute.

## Core User Loop

1. Start with a prompt or a template
2. Pick mode, tone, and language
3. Add an optional reference image
4. Generate a pack
5. Copy, share, or save it

## Shipped MVP Screens

### Create

- Prompt field
- Template shortcuts
- Reference image picker
- Mode chips
- Tone chips
- Language chips
- Generate action
- Pack preview

### Templates

- Preset ideas for common creator use cases
- One-tap apply to the Create screen

### Library

- Local draft list
- Reuse
- Copy
- Share
- Delete

### Settings

- Default mode
- Default tone
- Default language
- Auto-save toggle
- Cloud boost toggle
- OpenAI-compatible base URL
- Model name
- Secret API key field
- Signature line
- Reset actions

## Data Model

### Draft

- id
- createdAt
- prompt
- topic
- title
- assetLabel
- hook
- coverLine
- caption
- altCaptions
- script
- shotList
- hashtags
- cta
- tips
- signatureLine
- score
- mode
- tone
- language
- attachmentUri
- sourceSummary

### Settings

- defaultMode
- defaultTone
- defaultLanguage
- autoSave
- cloudBoost
- apiBaseUrl
- apiModel
- signature

## Acceptance Criteria

- App opens on Android and web
- A pack can be generated without an API key
- Drafts persist after reload
- Copy and share actions work
- Reference image attachment works
- Settings save and restore correctly

## Phase 2

- Voice note capture
- Auto transcript
- Video storyboard export
- Custom fonts and branded themes
- Team workspace sync

