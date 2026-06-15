import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  ArrowRight,
  Check,
  Copy,
  ImagePlus,
  Layers3,
  LibraryBig,
  LoaderCircle,
  Palette,
  Save,
  Settings2,
  Share2,
  Shuffle,
  Sparkles,
  Trash2,
  WandSparkles,
  Image as ImageIcon,
  PenLine,
  ScrollText,
  SlidersHorizontal,
  TextCursorInput,
  Film,
} from "lucide-react-native";

import { contentLanguages, contentModes, contentTones, defaultSettings, starterPrompts, templatePlaybooks } from "./src/data/presets";
import { buildCompactShareText, buildFullCopyText, generateContentPack } from "./src/lib/generator";
import { clearAllStorage, clearDrafts, loadApiKey, loadDrafts, loadSettings, saveApiKey, saveDrafts, saveSettings } from "./src/lib/storage";
import type { AppSettings, ContentLanguage, ContentMode, ContentTone, GeneratedPack } from "./src/lib/types";

type TabId = "create" | "templates" | "library" | "settings";

type IconType = typeof Sparkles;

type SectionCardProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

type DraftActionProps = {
  label: string;
  icon: IconType;
  onPress: () => void;
};

const tabItems: Array<{ id: TabId; label: string; icon: IconType }> = [
  { id: "create", label: "Create", icon: Sparkles },
  { id: "templates", label: "Templates", icon: Layers3 },
  { id: "library", label: "Library", icon: LibraryBig },
  { id: "settings", label: "Settings", icon: Settings2 },
];

const palette = {
  background: "#070b10",
  surface: "#101720",
  surfaceAlt: "#16202b",
  surfaceSoft: "#0e151d",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(182,255,87,0.22)",
  text: "#f3f7fb",
  muted: "#93a1b2",
  accent: "#b6ff57",
  accent2: "#28e0d0",
  accent3: "#ff8a65",
  danger: "#ff6b6b",
};

const DEFAULT_TAB: TabId = "create";

function shortDate(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingBlock}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

function PillButton({
  label,
  selected,
  onPress,
  icon: Icon,
  compact = false,
}: {
  label: string;
  selected?: boolean;
  compact?: boolean;
  onPress: () => void;
  icon?: IconType;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, compact && styles.pillCompact, selected && styles.pillSelected, pressed && styles.pillPressed]}>
      {Icon ? <Icon size={14} color={selected ? palette.background : palette.muted} /> : null}
      <Text style={[styles.pillText, selected && styles.pillTextSelected]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function IconButton({
  label,
  icon: Icon,
  onPress,
  danger = false,
  compact = false,
}: {
  label: string;
  icon: IconType;
  onPress: () => void;
  danger?: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.iconButton, compact && styles.iconButtonCompact, danger && styles.iconButtonDanger, pressed && styles.iconButtonPressed]}>
      <Icon size={15} color={danger ? palette.danger : palette.text} />
      {!compact ? <Text style={[styles.iconButtonLabel, danger && styles.iconButtonLabelDanger]}>{label}</Text> : null}
    </Pressable>
  );
}

function PrimaryButton({
  label,
  icon: Icon,
  onPress,
  disabled = false,
}: {
  label: string;
  icon: IconType;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryButtonShell, disabled && styles.disabled, pressed && !disabled && styles.primaryButtonPressed]}>
      <LinearGradient colors={[palette.accent2, palette.accent]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryButton}>
        {disabled ? <LoaderCircle size={16} color={palette.background} /> : <Icon size={16} color={palette.background} />}
        <Text style={styles.primaryButtonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function TemplateCard({
  title,
  description,
  mode,
  tone,
  language,
  onPress,
}: {
  title: string;
  description: string;
  mode: ContentMode;
  tone: ContentTone;
  language: ContentLanguage;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.templateCard, pressed && styles.templateCardPressed]}>
      <View style={styles.templateCardTop}>
        <Text style={styles.templateTitle}>{title}</Text>
        <ArrowRight size={16} color={palette.muted} />
      </View>
      <Text style={styles.templateDescription}>{description}</Text>
      <View style={styles.templateMetaRow}>
        <View style={styles.templateMetaPill}>
          <Text style={styles.templateMetaText}>{mode}</Text>
        </View>
        <View style={styles.templateMetaPill}>
          <Text style={styles.templateMetaText}>{tone}</Text>
        </View>
        <View style={styles.templateMetaPill}>
          <Text style={styles.templateMetaText}>{language}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function DraftCard({
  draft,
  onReuse,
  onCopy,
  onShare,
  onDelete,
}: {
  draft: GeneratedPack;
  onReuse: () => void;
  onCopy: () => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.draftCard}>
      <View style={styles.draftHeader}>
        <View style={styles.draftHeaderBlock}>
          <Text style={styles.draftTitle} numberOfLines={1}>
            {draft.title}
          </Text>
          <Text style={styles.draftMeta}>
            {draft.mode} • {draft.tone} • {shortDate(draft.createdAt)}
          </Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{draft.score}</Text>
        </View>
      </View>
      <Text style={styles.draftHook} numberOfLines={2}>
        {draft.hook}
      </Text>
      <View style={styles.draftActionRow}>
        <DraftAction label="Reuse" icon={Sparkles} onPress={onReuse} />
        <DraftAction label="Copy" icon={Copy} onPress={onCopy} />
        <DraftAction label="Share" icon={Share2} onPress={onShare} />
        <DraftAction label="Delete" icon={Trash2} onPress={onDelete} />
      </View>
    </View>
  );
}

function DraftAction({ label, icon: Icon, onPress }: DraftActionProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.draftAction, pressed && styles.draftActionPressed]}>
      <Icon size={14} color={palette.text} />
      <Text style={styles.draftActionText}>{label}</Text>
    </Pressable>
  );
}

function PackPreview({
  pack,
  onCopyPack,
  onCopyHook,
  onShare,
  onSave,
}: {
  pack: GeneratedPack;
  onCopyPack: () => void;
  onCopyHook: () => void;
  onShare: () => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.previewRoot}>
      <LinearGradient colors={["rgba(38,224,208,0.20)", "rgba(182,255,87,0.05)", "rgba(255,138,101,0.08)"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.previewCard}>
        <View style={styles.previewTopRow}>
          <View>
            <Text style={styles.previewLabel}>{pack.assetLabel}</Text>
            <Text style={styles.previewTitle} numberOfLines={2}>
              {pack.title}
            </Text>
          </View>
          <View style={styles.scoreBadgeLarge}>
            <Text style={styles.scoreBadgeLargeValue}>{pack.score}</Text>
            <Text style={styles.scoreBadgeLargeLabel}>score</Text>
          </View>
        </View>

        {pack.attachmentUri ? (
          <View style={styles.previewImageShell}>
            <Image source={{ uri: pack.attachmentUri }} style={styles.previewImage} />
            <LinearGradient colors={["transparent", "rgba(7,11,16,0.90)"]} style={styles.previewImageOverlay} />
            <View style={styles.previewImageTextBlock}>
              <Text style={styles.previewImageCaption}>{pack.coverLine}</Text>
              <Text style={styles.previewImageSignature}>{pack.signatureLine}</Text>
            </View>
          </View>
        ) : (
          <LinearGradient colors={["rgba(15,21,29,0.95)", "rgba(8,13,18,0.95)"]} style={styles.previewEmptyFrame}>
            <Text style={styles.previewEmptyTitle}>{pack.coverLine}</Text>
            <Text style={styles.previewEmptyBody}>{pack.signatureLine}</Text>
          </LinearGradient>
        )}
      </LinearGradient>

      <View style={styles.previewMetaGrid}>
        <StatTile value={pack.mode} label="Mode" />
        <StatTile value={pack.tone} label="Tone" />
        <StatTile value={pack.language} label="Language" />
      </View>

      <SectionCard
        title="Hook"
        subtitle={pack.sourceSummary}
        action={<IconButton label="Copy" icon={Copy} compact onPress={onCopyHook} />}
      >
        <Text style={styles.copyBlock}>{pack.hook}</Text>
      </SectionCard>

      <SectionCard
        title="Caption"
        action={<IconButton label="Copy" icon={Copy} compact onPress={onCopyPack} />}
      >
        <Text style={styles.copyBlock}>{pack.caption}</Text>
      </SectionCard>

      <SectionCard title="Alt captions">
        <View style={styles.listStack}>
          {pack.altCaptions.map((caption) => (
            <View key={caption} style={styles.listRow}>
              <View style={styles.listBullet} />
              <Text style={styles.listText}>{caption}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Storyboard">
        <View style={styles.listStack}>
          {pack.script.map((line, index) => (
            <View key={`${pack.id}-${index}`} style={styles.listRow}>
              <View style={styles.listNumber}>
                <Text style={styles.listNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.listText}>{line}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Shot list">
        <View style={styles.listStack}>
          {pack.shotList.map((line, index) => (
            <View key={`${pack.id}-shot-${index}`} style={styles.listRow}>
              <View style={styles.listBullet} />
              <Text style={styles.listText}>{line}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Hashtags" action={<IconButton label="Copy" icon={Copy} compact onPress={onCopyPack} />}>
        <Text style={styles.copyBlock}>{pack.hashtags.join(" ")}</Text>
      </SectionCard>

      <SectionCard title="CTA">
        <Text style={styles.copyBlock}>{pack.cta}</Text>
      </SectionCard>

      <View style={styles.previewActions}>
        <PrimaryButton label="Save" icon={Save} onPress={onSave} />
        <IconButton label="Copy" icon={Copy} onPress={onCopyPack} />
        <IconButton label="Share" icon={Share2} onPress={onShare} />
      </View>
    </View>
  );
}

function SettingsRow({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "url" | "numeric";
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.textField}
      />
    </View>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const reveal = useRef(new Animated.Value(0)).current;
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [apiKey, setApiKey] = useState("");
  const [drafts, setDrafts] = useState<GeneratedPack[]>([]);
  const [prompt, setPrompt] = useState(starterPrompts[0].prompt);
  const [mode, setMode] = useState<ContentMode>(defaultSettings.defaultMode);
  const [tone, setTone] = useState<ContentTone>(defaultSettings.defaultTone);
  const [language, setLanguage] = useState<ContentLanguage>(defaultSettings.defaultLanguage);
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedPack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [savePulse, setSavePulse] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [storedSettings, storedDrafts, storedApiKey] = await Promise.all([loadSettings(), loadDrafts(), loadApiKey()]);

      if (!mounted) {
        return;
      }

      setSettings(storedSettings);
      setDrafts(storedDrafts);
      setApiKey(storedApiKey);
      setMode(storedSettings.defaultMode);
      setTone(storedSettings.defaultTone);
      setLanguage(storedSettings.defaultLanguage);
      setIsReady(true);
      setStatusMessage(storedDrafts.length > 0 ? "Library loaded" : "Ready");
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!generated) {
      return;
    }

    reveal.setValue(0);
    Animated.spring(reveal, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      damping: 14,
      stiffness: 140,
      mass: 0.9,
    }).start();
  }, [generated, reveal]);

  const stats = useMemo(
    () => [
      { value: String(drafts.length), label: "Drafts" },
      { value: settings.cloudBoost ? "On" : "Off", label: "Cloud" },
      { value: settings.autoSave ? "Auto" : "Manual", label: "Save" },
      { value: generated ? String(generated.score) : "--", label: "Score" },
    ],
    [drafts.length, generated, settings.autoSave, settings.cloudBoost]
  );

  const currentDraft = generated;

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setStatusMessage("Add a prompt");
      return;
    }

    setIsGenerating(true);
    setStatusMessage("Building pack");

    try {
      const pack = await generateContentPack(
        {
          prompt: trimmedPrompt,
          mode,
          tone,
          language,
          attachmentUri,
        },
        settings,
        apiKey
      );

      setGenerated(pack);
      setStatusMessage(`${pack.score}/100 ready`);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (settings.autoSave) {
        await savePack(pack);
      }
    } catch {
      setStatusMessage("Fallback used");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGenerating(false);
    }
  };

  const savePack = async (pack: GeneratedPack = generated as GeneratedPack) => {
    if (!pack) {
      setStatusMessage("Generate first");
      return;
    }

    const updated = [pack, ...drafts.filter((draft) => draft.id !== pack.id)].slice(0, 24);
    setDrafts(updated);
    setSavePulse(true);
    setTimeout(() => setSavePulse(false), 500);
    await saveDrafts(updated);
    setStatusMessage("Saved");
    await Haptics.selectionAsync();
  };

  const handleCopyText = async (text: string, message: string) => {
    await Clipboard.setStringAsync(text);
    setStatusMessage(message);
    await Haptics.selectionAsync();
  };

  const handleShare = async (pack: GeneratedPack = generated as GeneratedPack) => {
    if (!pack) {
      setStatusMessage("Generate first");
      return;
    }

    const message = buildCompactShareText(pack);

    try {
      await Share.share({ message });
      setStatusMessage("Shared");
      await Haptics.selectionAsync();
    } catch {
      await handleCopyText(message, "Copied");
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setStatusMessage("Photo access denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.85,
      aspect: [4, 5],
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      setAttachmentUri(result.assets[0]?.uri ?? null);
      setStatusMessage("Image attached");
      await Haptics.selectionAsync();
    }
  };

  const handleShuffle = async () => {
    const randomPrompt = starterPrompts[Math.floor(Math.random() * starterPrompts.length)];
    setPrompt(randomPrompt.prompt);
    setMode(randomPrompt.mode);
    setTone(randomPrompt.tone);
    setLanguage(randomPrompt.language);
    setAttachmentUri(null);
    setStatusMessage("Template loaded");
    await Haptics.selectionAsync();
  };

  const handleApplyTemplate = async (index: number) => {
    const template = templatePlaybooks[index];
    setPrompt(template.prompt);
    setMode(template.mode);
    setTone(template.tone);
    setLanguage(template.language);
    setActiveTab("create");
    setStatusMessage(template.title);
    await Haptics.selectionAsync();
  };

  const handleReuseDraft = async (draft: GeneratedPack) => {
    setPrompt(draft.prompt);
    setMode(draft.mode);
    setTone(draft.tone);
    setLanguage(draft.language);
    setAttachmentUri(draft.attachmentUri);
    setGenerated(draft);
    setActiveTab("create");
    setStatusMessage("Draft loaded");
    await Haptics.selectionAsync();
  };

  const handleSaveSettings = async () => {
    await Promise.all([saveSettings(settings), saveApiKey(apiKey)]);
    setStatusMessage("Settings saved");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setApiKey("");
    setMode(defaultSettings.defaultMode);
    setTone(defaultSettings.defaultTone);
    setLanguage(defaultSettings.defaultLanguage);
    setStatusMessage("Settings reset");
  };

  const handleResetLibrary = () => {
    Alert.alert("Clear library?", "This removes all local drafts.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearDrafts();
          setDrafts([]);
          setStatusMessage("Library cleared");
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleResetEverything = () => {
    Alert.alert("Reset all?", "This clears drafts, settings, and the secret key.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: async () => {
          await clearAllStorage();
          setDrafts([]);
          setGenerated(null);
          setPrompt(starterPrompts[0].prompt);
          setAttachmentUri(null);
          setSettings(defaultSettings);
          setApiKey("");
          setMode(defaultSettings.defaultMode);
          setTone(defaultSettings.defaultTone);
          setLanguage(defaultSettings.defaultLanguage);
          setStatusMessage("Reset complete");
        },
      },
    ]);
  };

  const renderCreateTab = () => (
    <View style={styles.tabStack}>
      <SectionCard
        title="Prompt"
        subtitle={statusMessage}
        action={<IconButton label="Shuffle" icon={Shuffle} onPress={handleShuffle} />}
      >
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Describe the moment, product, roast, or story"
          placeholderTextColor={palette.muted}
          style={[styles.textArea, styles.promptBox]}
          multiline
          textAlignVertical="top"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {starterPrompts.map((item) => (
            <PillButton
              key={item.id}
              label={item.label}
              selected={prompt === item.prompt}
              onPress={async () => {
                setPrompt(item.prompt);
                setMode(item.mode);
                setTone(item.tone);
                setLanguage(item.language);
                setStatusMessage(item.label);
                await Haptics.selectionAsync();
              }}
            />
          ))}
        </ScrollView>
      </SectionCard>

      <SectionCard
        title="Reference"
        subtitle={attachmentUri ? "Attached" : "Optional"}
        action={
          <View style={styles.sectionActionRow}>
            {attachmentUri ? <IconButton label="Clear" icon={Trash2} compact onPress={() => setAttachmentUri(null)} danger /> : null}
            <IconButton label="Add image" icon={ImagePlus} compact onPress={handlePickImage} />
          </View>
        }
      >
        {attachmentUri ? (
          <View style={styles.referencePreview}>
            <Image source={{ uri: attachmentUri }} style={styles.referenceImage} />
          </View>
        ) : (
          <View style={styles.emptyReference}>
            <ImageIcon size={18} color={palette.muted} />
            <Text style={styles.emptyReferenceText}>No image attached</Text>
          </View>
        )}
      </SectionCard>

      <SectionCard title="Mode">
        <View style={styles.chipGrid}>
          {contentModes.map((item) => (
            <PillButton
              key={item.id}
              label={item.label}
              selected={mode === item.id}
              onPress={async () => {
                setMode(item.id);
                setStatusMessage(item.label);
                await Haptics.selectionAsync();
              }}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Tone">
        <View style={styles.chipGrid}>
          {contentTones.map((item) => (
            <PillButton
              key={item.id}
              label={item.label}
              selected={tone === item.id}
              onPress={async () => {
                setTone(item.id);
                setStatusMessage(item.label);
                await Haptics.selectionAsync();
              }}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Language">
        <View style={styles.chipGrid}>
          {contentLanguages.map((item) => (
            <PillButton
              key={item.id}
              label={item.label}
              selected={language === item.id}
              onPress={async () => {
                setLanguage(item.id);
                setStatusMessage(item.label);
                await Haptics.selectionAsync();
              }}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard
        title="Generate"
        subtitle={savePulse ? "Saved" : isGenerating ? "Working" : "Ready"}
        action={<PrimaryButton label="Generate" icon={isGenerating ? LoaderCircle : WandSparkles} onPress={handleGenerate} disabled={isGenerating} />}
      >
        <View style={styles.actionRow}>
          <IconButton
            label="Save"
            icon={Save}
            onPress={() => {
              if (currentDraft) {
                void savePack(currentDraft);
              } else {
                setStatusMessage("Generate first");
              }
            }}
          />
          <IconButton
            label="Copy"
            icon={Copy}
            onPress={() => {
              if (currentDraft) {
                void handleCopyText(buildFullCopyText(currentDraft), "Pack copied");
              } else {
                setStatusMessage("Generate first");
              }
            }}
          />
          <IconButton
            label="Share"
            icon={Share2}
            onPress={() => {
              if (currentDraft) {
                void handleShare(currentDraft);
              } else {
                setStatusMessage("Generate first");
              }
            }}
          />
        </View>
      </SectionCard>

      {currentDraft ? (
        <Animated.View
          style={[
            styles.generatedShell,
            {
              opacity: reveal,
              transform: [
                {
                  translateY: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <PackPreview
            pack={currentDraft}
            onCopyPack={() => void handleCopyText(buildFullCopyText(currentDraft), "Pack copied")}
            onCopyHook={() => void handleCopyText(currentDraft.hook, "Hook copied")}
            onShare={() => void handleShare(currentDraft)}
            onSave={() => void savePack(currentDraft)}
          />
        </Animated.View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No pack yet</Text>
          <Text style={styles.emptyStateBody}>Use a template or write a prompt, then hit Generate.</Text>
        </View>
      )}
    </View>
  );

  const renderTemplatesTab = () => (
    <View style={styles.tabStack}>
      {templatePlaybooks.map((template, index) => (
        <TemplateCard
          key={template.id}
          title={template.title}
          description={template.description}
          mode={template.mode}
          tone={template.tone}
          language={template.language}
          onPress={() => void handleApplyTemplate(index)}
        />
      ))}
    </View>
  );

  const renderLibraryTab = () => (
    <View style={styles.tabStack}>
      {drafts.length === 0 ? (
        <View style={styles.emptyLibrary}>
          <LibraryBig size={26} color={palette.muted} />
          <Text style={styles.emptyStateTitle}>No drafts</Text>
          <Text style={styles.emptyStateBody}>Save one pack and it will live here.</Text>
        </View>
      ) : (
        drafts.map((draft) => (
          <DraftCard
            key={draft.id}
            draft={draft}
            onReuse={() => void handleReuseDraft(draft)}
            onCopy={() => void handleCopyText(buildFullCopyText(draft), "Pack copied")}
            onShare={() => void handleShare(draft)}
            onDelete={async () => {
              const updated = drafts.filter((item) => item.id !== draft.id);
              setDrafts(updated);
              await saveDrafts(updated);
              setStatusMessage("Draft removed");
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          />
        ))
      )}
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabStack}>
      <SectionCard title="Defaults">
        <View style={styles.settingsStack}>
          <View style={styles.settingsToggleRow}>
            <View>
              <Text style={styles.fieldLabel}>Auto-save</Text>
              <Text style={styles.settingNote}>Keeps the latest pack in the library.</Text>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={(value) => setSettings((current) => ({ ...current, autoSave: value }))}
              thumbColor={Platform.OS === "android" ? palette.background : undefined}
              trackColor={{ false: "rgba(255,255,255,0.18)", true: palette.accent2 }}
            />
          </View>

          <View style={styles.settingsToggleRow}>
            <View>
              <Text style={styles.fieldLabel}>Cloud boost</Text>
              <Text style={styles.settingNote}>Uses your endpoint when configured.</Text>
            </View>
            <Switch
              value={settings.cloudBoost}
              onValueChange={(value) => setSettings((current) => ({ ...current, cloudBoost: value }))}
              thumbColor={Platform.OS === "android" ? palette.background : undefined}
              trackColor={{ false: "rgba(255,255,255,0.18)", true: palette.accent }}
            />
          </View>

          <SettingsRow
            label="Base URL"
            value={settings.apiBaseUrl}
            onChangeText={(text) => setSettings((current) => ({ ...current, apiBaseUrl: text }))}
            placeholder="https://api.openai.com/v1"
            keyboardType="url"
          />
          <SettingsRow
            label="Model"
            value={settings.apiModel}
            onChangeText={(text) => setSettings((current) => ({ ...current, apiModel: text }))}
            placeholder="gpt-4.1-mini"
          />
          <SettingsRow
            label="API key"
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="sk-..."
            secureTextEntry
          />
          <SettingsRow
            label="Signature"
            value={settings.signature}
            onChangeText={(text) => setSettings((current) => ({ ...current, signature: text }))}
            placeholder="Built for fast, shareable creator packs."
          />

          <View style={styles.settingsToggleGroup}>
            <Text style={styles.fieldLabel}>Default mode</Text>
            <View style={styles.chipGrid}>
              {contentModes.map((item) => (
                <PillButton
                  key={item.id}
                  label={item.label}
                  selected={settings.defaultMode === item.id}
                  onPress={() => setSettings((current) => ({ ...current, defaultMode: item.id }))}
                />
              ))}
            </View>
          </View>

          <View style={styles.settingsToggleGroup}>
            <Text style={styles.fieldLabel}>Default tone</Text>
            <View style={styles.chipGrid}>
              {contentTones.map((item) => (
                <PillButton
                  key={item.id}
                  label={item.label}
                  selected={settings.defaultTone === item.id}
                  onPress={() => setSettings((current) => ({ ...current, defaultTone: item.id }))}
                />
              ))}
            </View>
          </View>

          <View style={styles.settingsToggleGroup}>
            <Text style={styles.fieldLabel}>Default language</Text>
            <View style={styles.chipGrid}>
              {contentLanguages.map((item) => (
                <PillButton
                  key={item.id}
                  label={item.label}
                  selected={settings.defaultLanguage === item.id}
                  onPress={() => setSettings((current) => ({ ...current, defaultLanguage: item.id }))}
                />
              ))}
            </View>
          </View>
        </View>
      </SectionCard>

      <View style={styles.settingsActionRow}>
        <PrimaryButton label="Save settings" icon={Save} onPress={handleSaveSettings} />
        <IconButton label="Reset" icon={SlidersHorizontal} onPress={handleResetSettings} />
      </View>

      <SectionCard title="Library" subtitle={`${drafts.length} local drafts`}>
        <View style={styles.actionRow}>
          <IconButton label="Clear" icon={Trash2} danger onPress={handleResetLibrary} />
          <IconButton label="Reset all" icon={Palette} danger onPress={handleResetEverything} />
        </View>
      </SectionCard>

      <View style={styles.statusBlock}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={styles.statusValue}>{statusMessage}</Text>
        <Text style={styles.statusMeta}>Android ready</Text>
      </View>
    </View>
  );

  const activeContent = {
    create: renderCreateTab(),
    templates: renderTemplatesTab(),
    library: renderLibraryTab(),
    settings: renderSettingsTab(),
  }[activeTab];

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <LinearGradient colors={[palette.background, "#0b1218", "#05070b"]} style={StyleSheet.absoluteFill} />
        <View style={styles.loadingRoot}>
          <LoaderCircle size={28} color={palette.accent} />
          <Text style={styles.loadingTitle}>Status Studio AI</Text>
          <Text style={styles.loadingSubtitle}>Loading local data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <LinearGradient colors={["#05070b", "#091017", "#040509"]} style={StyleSheet.absoluteFill} />
      <View style={[styles.shell, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Status Studio AI</Text>
            <Text style={styles.appSubtitle}>{statusMessage}</Text>
          </View>
          <View style={styles.headerBadge}>
            <Sparkles size={13} color={palette.background} />
            <Text style={styles.headerBadgeText}>{settings.cloudBoost ? "Cloud on" : "Local"}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {stats.map((item) => (
            <StatTile key={item.label} value={item.value} label={item.label} />
          ))}
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.contentWrap}>
          <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {activeContent}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.bottomNav, { paddingBottom: Math.max(10, insets.bottom) }]}>
          {tabItems.map((item) => {
            const Icon = item.icon;
            const selected = activeTab === item.id;
            return (
              <Pressable key={item.id} onPress={() => setActiveTab(item.id)} style={({ pressed }) => [styles.navItem, selected && styles.navItemSelected, pressed && styles.navItemPressed]}>
                <Icon size={17} color={selected ? palette.background : palette.muted} />
                <Text style={[styles.navLabel, selected && styles.navLabelSelected]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  shell: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  appTitle: {
    color: palette.text,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 0,
  },
  appSubtitle: {
    marginTop: 4,
    color: palette.muted,
    fontSize: 13,
    letterSpacing: 0,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: palette.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerBadgeText: {
    color: palette.background,
    fontSize: 12,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statTile: {
    flex: 1,
    minHeight: 66,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  statValue: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: palette.muted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  contentWrap: {
    flex: 1,
  },
  contentScroll: {
    paddingBottom: 120,
    gap: 12,
  },
  tabStack: {
    gap: 12,
  },
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionHeadingBlock: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: palette.muted,
    fontSize: 12,
  },
  sectionActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textArea: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
    color: palette.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 110,
  },
  promptBox: {
    minHeight: 120,
  },
  quickRow: {
    gap: 8,
    paddingTop: 8,
  },
  pill: {
    minHeight: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  pillCompact: {
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillSelected: {
    borderColor: palette.accent,
    backgroundColor: palette.accent,
  },
  pillPressed: {
    opacity: 0.85,
  },
  pillText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "600",
  },
  pillTextSelected: {
    color: palette.background,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  previewRoot: {
    gap: 12,
  },
  generatedShell: {
    width: "100%",
  },
  previewCard: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  previewTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  previewLabel: {
    color: palette.accent2,
    textTransform: "uppercase",
    letterSpacing: 0,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  previewTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 30,
    maxWidth: 220,
  },
  scoreBadgeLarge: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: "rgba(7,11,16,0.42)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreBadgeLargeValue: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  scoreBadgeLargeLabel: {
    color: palette.muted,
    fontSize: 10,
    textTransform: "uppercase",
  },
  previewImageShell: {
    borderRadius: 20,
    overflow: "hidden",
    minHeight: 230,
    backgroundColor: palette.surfaceAlt,
  },
  previewImage: {
    width: "100%",
    height: 250,
  },
  previewImageOverlay: {
    ...StyleSheet.absoluteFill,
  },
  previewImageTextBlock: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    gap: 6,
  },
  previewImageCaption: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
  },
  previewImageSignature: {
    color: "rgba(243,247,251,0.82)",
    fontSize: 12,
  },
  previewEmptyFrame: {
    minHeight: 230,
    borderRadius: 20,
    padding: 16,
    justifyContent: "flex-end",
  },
  previewEmptyTitle: {
    color: palette.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
  },
  previewEmptyBody: {
    marginTop: 6,
    color: "rgba(243,247,251,0.82)",
    fontSize: 12,
  },
  previewMetaGrid: {
    flexDirection: "row",
    gap: 8,
  },
  copyBlock: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 22,
  },
  listStack: {
    gap: 10,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  listBullet: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 6,
    backgroundColor: palette.accent2,
  },
  listNumber: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: palette.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  listNumberText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: "700",
  },
  listText: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    lineHeight: 21,
  },
  previewActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconButton: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  iconButtonCompact: {
    paddingHorizontal: 10,
  },
  iconButtonDanger: {
    borderColor: "rgba(255,107,107,0.28)",
  },
  iconButtonPressed: {
    opacity: 0.88,
  },
  iconButtonLabel: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "600",
  },
  iconButtonLabelDanger: {
    color: palette.danger,
  },
  primaryButtonShell: {
    borderRadius: 999,
    overflow: "hidden",
  },
  primaryButton: {
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: palette.background,
    fontSize: 13,
    fontWeight: "800",
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.74,
  },
  templateCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 8,
  },
  templateCardPressed: {
    borderColor: palette.accent2,
    transform: [{ scale: 0.99 }],
  },
  templateCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  templateTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  templateDescription: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  templateMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 4,
  },
  templateMetaPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  templateMetaText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  draftCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 10,
  },
  draftHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  draftHeaderBlock: {
    flex: 1,
    gap: 4,
  },
  draftTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
  },
  draftMeta: {
    color: palette.muted,
    fontSize: 11,
  },
  scoreBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(182,255,87,0.12)",
    borderWidth: 1,
    borderColor: palette.borderStrong,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreBadgeText: {
    color: palette.accent,
    fontSize: 16,
    fontWeight: "800",
  },
  draftHook: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 20,
  },
  draftActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  draftAction: {
    minHeight: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  draftActionPressed: {
    opacity: 0.88,
  },
  draftActionText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "600",
  },
  settingsStack: {
    gap: 12,
  },
  settingsToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  settingNote: {
    color: palette.muted,
    fontSize: 11,
    marginTop: 2,
  },
  fieldBlock: {
    gap: 6,
  },
  fieldLabel: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  textField: {
    minHeight: 44,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
    color: palette.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  settingsToggleGroup: {
    gap: 10,
  },
  settingsActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusBlock: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 14,
    gap: 6,
  },
  statusLabel: {
    color: palette.muted,
    fontSize: 11,
    textTransform: "uppercase",
  },
  statusValue: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
  },
  statusMeta: {
    color: palette.accent2,
    fontSize: 12,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: "rgba(7,11,16,0.96)",
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navItemSelected: {
    backgroundColor: palette.accent,
    borderColor: palette.accent,
  },
  navItemPressed: {
    opacity: 0.88,
  },
  navLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  navLabelSelected: {
    color: palette.background,
  },
  loadingRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  loadingSubtitle: {
    color: palette.muted,
    fontSize: 13,
  },
  emptyState: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  emptyStateTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyStateBody: {
    color: palette.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  emptyLibrary: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    padding: 18,
    alignItems: "center",
    gap: 8,
  },
  emptyReference: {
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
    minHeight: 116,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyReferenceText: {
    color: palette.muted,
    fontSize: 12,
  },
  referencePreview: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceAlt,
  },
  referenceImage: {
    width: "100%",
    height: 170,
  },
  generatedSpacer: {
    height: 8,
  },
});
