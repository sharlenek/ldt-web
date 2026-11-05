// app/board.tsx
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import Header, { HEADER_H } from "../app/header";
import {
  BOARDS,
  type BoardMember,
  type BoardSection,
  type BoardTerm,
} from "../constants/board";

const PAPER = "#f7f4f1ff";
const ACCENT = "#d9cdbb";
const PURPLE = "#6f00ff";
const INK = "#161616";

const TABLET_BP = 600;
const BREAKPOINT = 900;
const CONTAINER_MAX = 1100;
const PLACEHOLDER = require("../assets/images/lions.png");

const SECTION_TITLES: Record<BoardSection, string> = {
  exec: "Executive Board",
  chair: "Chair Board",
};
const SECTION_ORDER: BoardSection[] = ["exec", "chair"];

// ---------- utils ----------
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(n, hi));
}
function rsize(
  winW: number,
  pref: number,
  min: number,
  max: number,
  base = 1200,
) {
  return clamp(pref * (winW / base), min, max);
}
function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
// split into rows of `cols`, also breaking before anyone marked `newRow`
function toRows(members: BoardMember[], cols: number): BoardMember[][] {
  const groups: BoardMember[][] = [];
  for (const m of members) {
    if (m.newRow || groups.length === 0) groups.push([]);
    groups[groups.length - 1].push(m);
  }
  return groups.flatMap((g) => chunk(g, cols));
}
// "2026–27" -> "2026–2027"
function fullYearLabel(label: string) {
  const [a, b] = label.split(/[–-]/);
  if (a?.length === 4 && b?.length === 2) return `${a}–${a.slice(0, 2)}${b}`;
  return label;
}

// ---------- board ----------
export default function Board() {
  const { width: winW, height: winH } = useWindowDimensions();
  const isTablet = winW >= TABLET_BP && winW < BREAKPOINT;
  const isMobile = winW < TABLET_BP;

  const H1 = Math.round(rsize(winW, 48, 34, 64));
  const H1_LH = Math.round(H1 * 1.08);
  const H2 = Math.round(rsize(winW, 34, 26, 44));
  const KICKER_SIZE = Math.round(rsize(winW, 14, 12, 16));
  const COPY_SIZE = Math.round(rsize(winW, 16, 14, 18));
  const COPY_LH = Math.round(COPY_SIZE * 1.35);
  const SECTION_H = Math.round(rsize(winW, 20, 16, 26));
  const text = { H1, H1_LH, H2, KICKER_SIZE, COPY_SIZE, COPY_LH, SECTION_H };

  const numColumns = winW < 520 ? 1 : winW < 820 ? 2 : winW < 1100 ? 3 : 4;
  const gutter = isMobile ? 16 : isTablet ? 20 : 24;
  // every card is the same width; rows with fewer cards just leave space
  const rowW = Math.min(winW - 32, CONTAINER_MAX);
  const CARD_W = Math.floor((rowW - (numColumns - 1) * gutter) / numColumns);

  const [current] = BOARDS;
  const headerOffset = Platform.OS === "web" ? HEADER_H : 0;

  return (
    <View style={{ flex: 1, backgroundColor: PAPER }}>
      <Header />

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          minHeight: winH - (Platform.OS === "web" ? 0 : HEADER_H),
          paddingTop: headerOffset,
          paddingBottom: 32,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        {/* page header: text only, unless the current board has a group photo */}
        {!current?.groupPhoto && (
          <View style={styles.hero}>
            <Text style={[styles.kicker, { fontSize: KICKER_SIZE }]}>
              UF LION DANCE TEAM {fullYearLabel(current?.label ?? "")}
            </Text>
            <Text style={[styles.h1, { fontSize: H1, lineHeight: H1_LH }]}>
              BOARD MEMBERS
            </Text>
            <Text
              style={[
                styles.copyCenter,
                { fontSize: COPY_SIZE, lineHeight: COPY_LH },
              ]}
            >
              Meet the team!
            </Text>
          </View>
        )}

        {BOARDS.map((term, i) => (
          <TermBlock
            key={term.label}
            term={term}
            isCurrent={i === 0}
            numColumns={numColumns}
            gutter={gutter}
            cardWidth={CARD_W}
            text={text}
            isMobile={isMobile}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type TextSizes = {
  H1: number;
  H1_LH: number;
  H2: number;
  KICKER_SIZE: number;
  COPY_SIZE: number;
  COPY_LH: number;
  SECTION_H: number;
};

// ---------- group photo + title (original board hero layout) ----------
function GroupHero({
  term,
  isCurrent,
  text,
}: {
  term: BoardTerm;
  isCurrent: boolean;
  text: TextSizes;
}) {
  const { width: winW, height: winH } = useWindowDimensions();
  const isMobile = winW < TABLET_BP;
  const isWideHero = winW >= BREAKPOINT;
  const headerOffset = Platform.OS === "web" ? HEADER_H : 0;

  const HERO_MAX_W = clamp(winW - 32, 980, 1400);
  const COL_GAP = isMobile ? 16 : winW < BREAKPOINT ? 20 : 28;
  const GROUP_AR_WIDE = 4 / 3;
  const GROUP_AR_MOBILE = 4 / 5;
  const heroViewportH = Math.max(620, winH - headerOffset);
  // same sizing as the original hero, but never so wide that the title gets squeezed out
  const maxImgW = HERO_MAX_W - 40 - COL_GAP - 320;
  const IMG_W = isWideHero
    ? Math.round(
        Math.min(clamp(heroViewportH - 40, 420, 1080) * GROUP_AR_WIDE, maxImgW),
      )
    : 0;
  const IMG_H = isWideHero ? Math.round(IMG_W / GROUP_AR_WIDE) : undefined;

  const kicker = `UF LION DANCE TEAM ${fullYearLabel(term.label)}`;
  const title = isCurrent ? "BOARD MEMBERS" : `${term.label} BOARD`;

  const titleBlock = (align: "left" | "center") => (
    <>
      <Text style={[styles.kicker, { fontSize: text.KICKER_SIZE }]}>
        {kicker}
      </Text>
      <Text style={[styles.h1, { fontSize: text.H1, lineHeight: text.H1_LH }]}>
        {title}
      </Text>
      {isCurrent && (
        <Text
          style={[
            styles.copyCenter,
            {
              textAlign: align,
              fontSize: text.COPY_SIZE,
              lineHeight: text.COPY_LH,
            },
          ]}
        >
          Meet the team!
        </Text>
      )}
    </>
  );

  // phones: text only, no big photo (same as the original page)
  if (isMobile) {
    return (
      <View style={[styles.hero, { maxWidth: HERO_MAX_W, paddingTop: 8 }]}>
        {titleBlock("center")}
      </View>
    );
  }

  return (
    <View
      style={[styles.heroCard, { maxWidth: HERO_MAX_W, padding: 20, gap: 16 }]}
    >
      <View
        style={{
          width: "100%",
          flexDirection: isWideHero ? "row" : "column",
          alignItems: isWideHero ? "stretch" : "center",
          justifyContent: isWideHero ? "space-between" : "center",
          gap: COL_GAP,
        }}
      >
        <View
          style={[
            styles.groupWrap,
            isWideHero
              ? {
                  width: IMG_W,
                  height: IMG_H,
                  alignSelf: "center",
                  flexShrink: 0,
                }
              : {
                  width: "100%",
                  maxWidth: (heroViewportH - 24) * GROUP_AR_MOBILE,
                  aspectRatio: GROUP_AR_MOBILE,
                },
          ]}
        >
          <Image
            source={term.groupPhoto}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            accessible
            accessibilityLabel={`UF Lion Dance Team — Board ${term.label} group photo`}
          />
          <View style={styles.groupCaptionPill}>
            <Text style={styles.groupCaptionText}>Board {term.label}</Text>
          </View>
        </View>

        <View
          style={{
            ...(isWideHero ? { flex: 1 } : { width: "100%" }),
            alignItems: isWideHero ? "flex-start" : "center",
            justifyContent: "center",
            gap: 8,
            minWidth: 0,
          }}
        >
          {titleBlock(isWideHero ? "left" : "center")}
        </View>
      </View>
    </View>
  );
}

// ---------- one year's board ----------
function TermBlock({
  term,
  isCurrent,
  numColumns,
  gutter,
  cardWidth,
  text,
  isMobile,
}: {
  term: BoardTerm;
  isCurrent: boolean;
  numColumns: number;
  gutter: number;
  cardWidth: number;
  text: TextSizes;
  isMobile: boolean;
}) {
  const sectionSize = text.SECTION_H;
  return (
    <View style={styles.term}>
      {!isCurrent && <View style={styles.sectionRule} />}

      {term.groupPhoto ? (
        <GroupHero term={term} isCurrent={isCurrent} text={text} />
      ) : (
        !isCurrent && (
          <Text
            style={[
              styles.h1,
              styles.termTitle,
              { fontSize: text.H2, lineHeight: Math.round(text.H2 * 1.1) },
            ]}
          >
            {term.label} BOARD
          </Text>
        )
      )}

      <View style={[styles.sectionRule, { marginBottom: 6 }]} />
      <View style={{ height: isMobile ? 8 : 48 }} />

      {SECTION_ORDER.map((section) => {
        const members = term.members.filter((m) => m.section === section);
        if (members.length === 0) return null;
        return (
          <View key={section} style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.sectionHeaderWrap}>
              <Text
                style={[
                  styles.sectionHeader,
                  { fontSize: sectionSize, color: PURPLE },
                ]}
              >
                {SECTION_TITLES[section]}
              </Text>
            </View>

            {toRows(members, numColumns).map((row, r) => (
              <View
                key={r}
                style={[styles.row, { gap: gutter, marginBottom: gutter }]}
              >
                {row.map((member) => (
                  <MemberCard
                    key={`${term.label}-${member.name}-${member.role}`}
                    member={member}
                    cardWidth={cardWidth}
                  />
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

// ---- member card with crossfade hover ----
function MemberCard({
  member,
  cardWidth,
}: {
  member: BoardMember;
  cardWidth: number;
}) {
  const mainSrc = member.photo ?? PLACEHOLDER;
  const altSrc = member.photoshoot;

  // the photoshoot image isn't mounted (so isn't downloaded) until first hover/tap
  const [altMounted, setAltMounted] = useState(false);
  const altOp = useRef(new Animated.Value(0)).current; // 0 main, 1 alt
  const FADE_MS = 180;

  const fadeTo = (toValue: number) =>
    Animated.timing(altOp, {
      toValue,
      duration: FADE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

  const showAlt = () => {
    if (!altSrc) return;
    setAltMounted(true);
    fadeTo(1);
  };
  const showMain = () => fadeTo(0);

  const a11y = `${member.name} — ${member.role}`;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Pressable
        disabled={!altSrc}
        onPress={() => {
          altOp.stopAnimation((v) => (v < 0.5 ? showAlt() : showMain()));
        }}
        onHoverIn={showAlt}
        onHoverOut={showMain}
      >
        <View style={styles.photoWrap}>
          <ExpoImage
            source={mainSrc}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            contentPosition={{
              left: "50%",
              top: `${member.photoFocus ?? 50}%`,
            }}
            accessible
            accessibilityLabel={a11y}
          />
          {altSrc && altMounted && (
            <Animated.Image
              source={altSrc}
              style={[
                styles.photo,
                StyleSheet.absoluteFillObject,
                { opacity: altOp },
              ]}
            />
          )}
          <View style={styles.rolePill}>
            <Text style={styles.rolePillText}>{member.role}</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.meta}>
        <Text style={styles.name}>{member.name}</Text>

        <View style={styles.detailsBlock}>
          {!!member.major && (
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Major: </Text>
              {member.major}
            </Text>
          )}
          {!!member.year && (
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Year: </Text>
              {member.year}
            </Text>
          )}
          {!!member.pronouns && (
            <Text style={styles.detailText}>
              <Text style={styles.detailLabel}>Pronouns: </Text>
              {member.pronouns}
            </Text>
          )}
        </View>

        <View style={styles.flexSpacer} />

        <View style={styles.socialRow}>
          {!!member.instagram && (
            <Chip label="Instagram" href={member.instagram} />
          )}
          {!!member.website && <Chip label="Website" href={member.website} />}
        </View>
      </View>
    </View>
  );
}

function Chip({ label, href }: { label: string; href: string }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(href)}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: pressed ? PURPLE : ACCENT,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // page header
  hero: {
    width: "100%",
    maxWidth: CONTAINER_MAX,
    alignSelf: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 8,
  },
  kicker: { color: INK, fontWeight: "900", letterSpacing: 1 },
  h1: { color: PURPLE, fontWeight: "900", letterSpacing: 1 },
  copyCenter: { color: INK, maxWidth: 680, textAlign: "center" },

  // one year's board
  term: { width: "100%", alignItems: "center", gap: 12 },
  termTitle: { textAlign: "center", marginBottom: 8 },

  // group image (original hero)
  heroCard: {
    width: "100%",
    backgroundColor: PAPER,
    borderRadius: 10,
    position: "relative",
    overflow: "visible",
  },
  groupWrap: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: "#eadfce",
  },
  groupCaptionPill: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(22,22,22,0.85)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  groupCaptionText: {
    color: "#fff",
    fontWeight: "900",
    letterSpacing: 0.4,
    fontSize: 12,
  },

  sectionRule: {
    height: 2,
    backgroundColor: ACCENT,
    width: "100%",
    maxWidth: CONTAINER_MAX,
    alignSelf: "center",
    marginTop: 8,
  },

  // section header
  sectionHeaderWrap: {
    width: "100%",
    maxWidth: CONTAINER_MAX,
    alignSelf: "center",
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionHeader: {
    color: INK,
    fontWeight: "900",
    letterSpacing: 0.6,
    textAlign: "center",
  },

  row: {
    width: "100%",
    maxWidth: CONTAINER_MAX,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
  },

  // grid card (fixed width — never stretches to fill a short row)
  card: {
    backgroundColor: PAPER,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: ACCENT,
    flexGrow: 0,
    flexShrink: 0,
  },
  photoWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: "#eadfce",
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },
  rolePill: {
    position: "absolute",
    left: 10,
    bottom: 10,
    backgroundColor: INK,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  rolePillText: {
    color: "#fff",
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 12,
  },

  meta: { padding: 12, gap: 8, flex: 1 },
  flexSpacer: { flexGrow: 1 },
  name: { color: INK, fontWeight: "900", fontSize: 18, letterSpacing: 0.3 },

  socialRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: PAPER,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
  },
  chipText: { color: INK, fontWeight: "700", fontSize: 12, letterSpacing: 0.2 },

  detailsBlock: {
    gap: 2,
    minHeight: 56,
  },
  detailText: {
    color: INK,
    opacity: 0.8,
    fontSize: 13,
    lineHeight: 18,
    ...(Platform.OS === "web" ? { wordBreak: "break-word" } : {}),
  },
  detailLabel: {
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
