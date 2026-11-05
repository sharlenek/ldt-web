// constants/board.ts
// Board roster, one entry per year. The FIRST year in BOARDS is the current
// board and shows at the top of the board page; older years are listed below it.
//
// To add a person: copy a member block, fill it in, and put it in the right year.
// Cards appear on the page in the same order they're listed here.
//
// Photos: put files in assets/images/board/<year>/prof/ (portrait) and
// assets/images/board/<year>/shoot/ (photoshoot, shown on hover), then run
//   ./scripts/optimize-board-photos.sh
// to shrink them and convert to .webp, and point `photo` / `photoshoot` at the
// .webp files with require(...). Both are optional — a missing portrait shows the
// lion placeholder; leave out `photoshoot` and the card just shows the portrait
// (no hover swap).

import type { ImageSourcePropType } from "react-native";

export type BoardSection = "exec" | "chair"; // "exec" = Executive Board, "chair" = Chair Board

export type BoardMember = {
  name: string;
  role: string; // shown on the card pill, e.g. "President", "Show Director"
  section: BoardSection;
  photo?: ImageSourcePropType;
  photoshoot?: ImageSourcePropType;
  major?: string;
  year?: string; // class year during this term, e.g. "2nd"
  pronouns?: string;
  instagram?: string;
  website?: string;
  newRow?: boolean; // true = start a new row with this person (e.g. keep the webmasters together)
  // Which part of the portrait stays visible when the card crops it:
  // 0 = keep the very top, 50 = centered (default), 100 = keep the bottom.
  // Lower it if someone's head is cut off.
  photoFocus?: number;
};

export type BoardTerm = {
  label: string; // e.g. "2026–27"
  groupPhoto?: ImageSourcePropType;
  members: BoardMember[];
};

export const BOARDS: BoardTerm[] = [
  // ───────────────────────────── 2026–27 (current) ─────────────────────────────
  {
    label: "2026–27",
    // groupPhoto: require("../assets/images/board/2026-27/shoot/boardphotoshoot.webp"),
    members: [
      // ---- Executive Board ----
      {
        name: "Han Nguyen",
        role: "President",
        section: "exec",
        photo: require("../assets/images/board/2026-27/prof/han.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/hanphotoshoot.webp"),
        major:
          "Food & Resource Economics and International Studies, Minor in Latin American Studies",
        year: "3rd",
        pronouns: "he/him",
        instagram: "https://www.instagram.com/hantheburgher/",
      },
      {
        name: "Kelvin Nguyen",
        role: "Internal Vice President",
        section: "exec",
        photo: require("../assets/images/board/2026-27/prof/kelvin.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/kelvinphotoshoot.webp"),
        major: "Finance, Minors in Spanish & Economics, Pre-Law Track",
        year: "3rd",
        pronouns: "he/him",
        instagram: "https://www.instagram.com/kelvin.saito/",
      },
      {
        name: "Selina Si",
        role: "External Vice President",
        section: "exec",
        photo: require("../assets/images/board/2026-27/prof/selina.webp"),
        photoFocus: 20,
        // photoshoot: require("../assets/images/board/2026-27/shoot/selinaphotoshoot.webp"),
        major: "Health Science, Pre-Pharmacy Track",
        year: "2nd",
        pronouns: "she/her",
        // instagram: "",
      },
      {
        name: "Colby White",
        role: "Performance Vice President",
        section: "exec",
        newRow: true,
        photo: require("../assets/images/board/2026-27/prof/colby.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/colbyphotoshoot.webp"),
        major: "Criminology, Minor in Sociology",
        year: "4th",
        pronouns: "he/him",
        // instagram: "",
      },
      {
        name: "Natalee Hardy",
        role: "Performance Vice President + Multimedia Director",
        section: "exec",
        photo: require("../assets/images/board/2026-27/prof/natalee.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/nataleephotoshoot.webp"),
        major: "Graphic Design, Minor in Mass Communication",
        year: "2nd",
        pronouns: "she/her",
        instagram: "https://www.instagram.com/natalee_hardy_/",
      },
      {
        name: "Laura Chen",
        role: "Treasurer",
        section: "exec",
        photo: require("../assets/images/board/2026-27/prof/laura.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/lauraphotoshoot.webp"),
        major: "Music, Pre-PA Track",
        year: "2nd",
        pronouns: "she/her",
        // instagram: "",
      },

      // ---- Chair Board ----
      {
        name: "Melora Saing",
        role: "Performance Coordinator",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/melora.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/meloraphotoshoot.webp"),
        major: "Health Science, Pre-Med Track",
        year: "2nd",
        pronouns: "she/her",
        // instagram: "",
      },
      {
        name: "Anatta Putlek",
        role: "Performance Coordinator",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/anatta.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/anattaphotoshoot.webp"),
        major: "Microbiology",
        year: "2nd",
        pronouns: "she/her",
        // instagram: "",
      },
      {
        name: "Dominic Hung",
        role: "Performance Coordinator",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/dominic.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/dominicphotoshoot.webp"),
        major: "Mechanical & Aerospace Engineering",
        year: "2nd",
        pronouns: "he/him",
        // instagram: "",
      },
      {
        name: "Daniel Nguyen",
        role: "Performance Coordinator",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/daniel.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/danielphotoshoot.webp"),
        major: "Information Systems",
        year: "2nd",
        pronouns: "he/him",
        // instagram: "",
      },
      {
        name: "Khanh Duong",
        role: "Performance Coordinator",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/khanh.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/khanhphotoshoot.webp"),
        major: "Biology, Pre-Dental Track",
        year: "2nd",
        pronouns: "she/her",
        // instagram: "",
      },
      {
        name: "Daniel Baik",
        role: "Performance Coordinator",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/danielb.webp"),
        major: "Behavioral & Cognitive Neuroscience",
        year: "2nd",
        pronouns: "he/him",
        //instagram: "",
      },
      {
        name: "Michael Nagim",
        role: "Public Relations Director",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/michael.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/michaelphotoshoot.webp"),
        major: "Health Science, Pre-PA Track",
        year: "2nd",
        pronouns: "he/him",
        // instagram: "",
      },
      {
        name: "Sharlene Kho",
        role: "Webmaster",
        section: "chair",
        photo: require("../assets/images/board/2026-27/prof/sharlene.webp"),
        // photoshoot: require("../assets/images/board/2026-27/shoot/sharlenephotoshoot.webp"),
        major: "Computer Science, Minor in Statistics",
        year: "3rd",
        pronouns: "she/her",
        instagram: "https://www.instagram.com/sharlenekho/",
      },
    ],
  },

  // ───────────────────────────────── 2025–26 ─────────────────────────────────
  {
    label: "2025–26",
    groupPhoto: require("../assets/images/board/shoot/boardphotoshoot.webp"),
    members: [
      // ---- Executive Board ----
      {
        name: "Steven Tran",
        role: "President",
        section: "exec",
        photo: require("../assets/images/board/prof/steven.webp"),
        photoshoot: require("../assets/images/board/shoot/stevenphotoshoot.webp"),
        major:
          "Digital Arts & Sciences, Minor in Media Production, Management & Technology",
        year: "3rd",
        pronouns: "he/him",
        instagram: "https://www.instagram.com/stevendangkhoi/",
      },
      {
        name: "Colin Liang",
        role: "Vice President",
        section: "exec",
        photo: require("../assets/images/board/prof/colin.webp"),
        photoshoot: require("../assets/images/board/shoot/colinphotoshoot.webp"),
        major: "Chemistry, Pre-Med Track",
        year: "2nd",
        pronouns: "he/him",
        instagram: "https://www.instagram.com/_jhapu/",
      },
      {
        name: "Kelvin Nguyen",
        role: "Treasurer",
        section: "exec",
        photo: require("../assets/images/board/prof/kelvin.webp"),
        photoshoot: require("../assets/images/board/shoot/kelvinphotoshoot.webp"),
        major: "Finance, Minor in Spanish, Pre-Law Track",
        year: "2nd",
        pronouns: "he/him",
        instagram: "https://www.instagram.com/kelvin.saito/",
      },

      // ---- Chair Board ----
      {
        name: "Han Nguyen",
        role: "Show Director",
        section: "chair",
        photo: require("../assets/images/board/prof/han.webp"),
        photoshoot: require("../assets/images/board/shoot/hanphotoshoot.webp"),
        major: "Food & Resource Economics",
        year: "2nd",
        pronouns: "he/him",
        instagram: "https://www.instagram.com/hantheburgher/",
      },
      {
        name: "Matt Baterna",
        role: "Show Director",
        section: "chair",
        photo: require("../assets/images/board/prof/matt.webp"),
        photoshoot: require("../assets/images/board/shoot/mattphotoshoot.webp"),
        major: "Exercise & Sports Science, Pre-Physical Therapy Track",
        year: "2nd",
        pronouns: "he/him",
        instagram: "https://www.instagram.com/amattforbats/",
      },
      {
        name: "Kayla Le",
        role: "Show Director",
        section: "chair",
        photo: require("../assets/images/board/prof/kayla.webp"),
        photoshoot: require("../assets/images/board/shoot/kaylaphotoshoot.webp"),
        major: "Accounting",
        year: "2nd",
        pronouns: "she/her",
        instagram: "https://www.instagram.com/k.la_009/",
      },
      {
        name: "Tracy Nguyen",
        role: "Show Director",
        section: "chair",
        photo: require("../assets/images/board/prof/tracy25.webp"),
        major: "Applied Physiology and Kinesiology",
        year: "4th",
        pronouns: "she/they",
        instagram: "https://www.instagram.com/tracyynnguyen/",
      },
      {
        name: "Sharlene Kho",
        role: "Outreach Director",
        section: "chair",
        photo: require("../assets/images/board/prof/shar25.webp"),
        major: "Computer Science",
        year: "2nd",
        pronouns: "she/her",
        instagram: "https://www.instagram.com/sharlenekho/",
      },
      {
        name: "Natalee Hardy",
        role: "Multimedia Director",
        section: "chair",
        photo: require("../assets/images/board/prof/natalee25.webp"),
        major: "Graphic Design",
        year: "1st",
        pronouns: "she/her",
        instagram: "https://www.instagram.com/natalee_hardy_/",
      },
      {
        name: "Lili Pittman",
        role: "Multimedia Director",
        section: "chair",
        photo: require("../assets/images/board/prof/lili25.webp"),
        major: "Graphic Design",
        year: "1st",
        pronouns: "she/her",
        instagram: "https://www.instagram.com/lili.pittman/",
      },
      {
        name: "Alice Jiang",
        role: "Webmaster",
        section: "chair",
        newRow: true,
        photo: require("../assets/images/board/prof/alice.webp"),
        photoshoot: require("../assets/images/board/shoot/alicephotoshoot.webp"),
        major:
          "Computer Science, Minor in Business Administration, Pre-Law Track",
        year: "3rd",
        pronouns: "she/her",
        instagram: "https://instagram.com/alicezzjiang",
      },
      {
        name: "Lynette Hemingway",
        role: "Webmaster",
        section: "chair",
        photo: require("../assets/images/board/prof/lynette.webp"),
        photoshoot: require("../assets/images/board/shoot/lynphotoshoot.webp"),
        major:
          "Computer Science, Minor in Digital Arts & Sciences, GIS Certificate",
        year: "3rd",
        pronouns: "she/her",
        instagram: "https://www.instagram.com/lynette_hemingway/",
      },

      // ---- missing 2025–26 members: add them here ----
      // {
      //   name: "",
      //   role: "",
      //   section: "chair",
      //   photo: require("../assets/images/board/prof/first.webp"),
      //   photoshoot: require("../assets/images/board/shoot/firstphotoshoot.webp"),
      //   major: "",
      //   year: "",
      //   pronouns: "",
      //   instagram: "",
      // },
    ],
  },
];
