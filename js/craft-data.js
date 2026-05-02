// Craft slide deck — single source of truth.
// Each entry becomes one slide. Images are shown with `object-fit: contain`;
// never cropped, so any aspect ratio is fine.
// Chapters are labels only — all 16 slides live in one linear sequence.
window.CRAFT_SLIDES = [
  // ---------------------------------------------------------------------
  // Chapter 01 — Objects (Furniture & Exhibition, OBJECTIVE Gallery)
  // ---------------------------------------------------------------------
  {
    id: "coexist-exhibition",
    chapter: "Objects",
    src: "assets/craft/024-coexist-exhibition-shanghai-by-objective-960x1440.jpg",
    title: "Coexist",
    subtitle: "OBJECTIVE Gallery · Shanghai · 2020",
    caption:
      "An exhibition staged as a living room. Caning chairs framed by an open door, a side table holding a single vessel. Furniture shown in the atmosphere it's meant to create.",
    meta: "Exhibition design · photography",
  },
  {
    id: "jewel-side-table",
    chapter: "Objects",
    src: "assets/craft/union_page_12.jpg",
    title: "Jewel Side Table",
    subtitle: "Jewel-inspired side table",
    caption:
      "Inspired by a 1930s Italian jewel. Steel, bronze, and clear acrylic stacked like gem settings — the contrast conceals the joinery between materials.",
    meta: "Designed by Mian · © Mian",
  },
  {
    id: "marshmallow-sofa-context",
    chapter: "Objects",
    src: "assets/craft/obj_page_61_right.jpg",
    title: "Marshmallow Sofa · in a room",
    subtitle: "Lifestyle · OBJECTIVE Gallery",
    caption:
      "The sofa as it lives — pale-green Dedar velvet beside a Four Seasons side table in Italian marble, the cool of an aluminum side panel just catching the light at the arm. The room sets the temperature before the page turns to the object itself.",
    meta: "Lifestyle pairing · Dedar Velvet · Italian Marble",
  },
  {
    id: "marshmallow-sofa-object",
    chapter: "Objects",
    src: "assets/craft/obj_page_58.jpg",
    title: "Marshmallow Sofa",
    subtitle: "OBJ+ · sage colorway",
    caption:
      "Minimal and architectural — a study in proportion and asymmetry. Two backrests sit at offset heights, a single aluminum panel caps one end like a bookend, and the rounded forms are kept so comfort still reads first. Dedar velvet against cool aluminum: the contrast lives in the texture, not the color.",
    meta: "Designed by Mian · © Mian",
  },
  {
    id: "petal-opener",
    chapter: "Objects",
    src: "assets/craft/obj_2023_p22_petal_opener.jpg",
    title: "Petal Series · with Chen Peng",
    subtitle: "Collection #2 · OBJECTIVE Gallery · 2021",
    caption:
      "The opening spread of the Petal Series — Brown Sugar sofa, Aria armchair in pink toile, and a small marble side table, arranged in front of a painted fireplace. The scene the first three pieces were made for.",
    meta: "Collection opener · editorial",
  },
  {
    id: "aria-pink",
    chapter: "Objects",
    src: "assets/craft/20201229_OBJECTIVE3985_master.jpg",
    title: "Aria Armchair · Pink Toile",
    subtitle: "Acrylic armchair · OBJ+ · 2020",
    caption:
      "OBJECTIVE Gallery's long-running best seller. An acrylic frame that disappears into the room so the upholstery does all the talking — this pink toile version remains the signature piece.",
    meta: "Designed by Mian · © Mian",
  },
  {
    id: "brown-sugar-front",
    chapter: "Objects",
    src: "assets/craft/union_page_04.jpg",
    title: "Brown Sugar Marshmallow Sofa",
    subtitle: "Limited edition · Louis Vuitton VIP Lounge",
    caption:
      "A specially curated edition of the Marshmallow Sofa, reworked for Louis Vuitton's VIP lounge. The silhouette stays; the materials change — softer at the seat, rougher at the wrap.",
    meta: "Designed by Mian · © Mian",
  },
  {
    id: "brown-sugar-back",
    chapter: "Objects",
    src: "assets/craft/union_page_05.jpg",
    title: "Brown Sugar · from behind",
    subtitle: "Limited edition · rear view",
    caption:
      "The back is where the rework reads. Confectionery-rough upholstery climbs the arms while the seat keeps a smooth velvet face — same piece, two textures, the contrast that names it.",
    meta: "Designed by Mian · © Mian",
  },
  {
    id: "wagyu-table",
    chapter: "Objects",
    src: "assets/craft/union_page_06.jpg",
    title: "Four Seasons Coffee Table",
    subtitle: "Wagyu · Special Edition",
    caption:
      "A special edition of the Four Seasons Coffee Table, custom-cut in an Italian marble chosen to echo the '盘花卷红烛' (coiled flowers, curling red candles) theme. Four slabs, each a season, each grained like a slice of wagyu — held by a bronze cruciform base, heavy and grounded.",
    meta: "Designed by Mian · © Mian",
  },
  {
    id: "wagyu-detail",
    chapter: "Objects",
    src: "assets/craft/union_page_07.jpg",
    title: "Wagyu · in detail",
    subtitle: "Special edition · marble + bronze",
    caption:
      "The same table, closer in. Grain, fat, fault line in the marble; the bronze cruciform just visible at the edge. A second look at the special-edition piece.",
    meta: "Designed by Mian · © Mian",
  },

  // ---------------------------------------------------------------------
  // Chapter 02 — Drawings (by hand)
  // ---------------------------------------------------------------------
  {
    id: "cruise-restaurant",
    chapter: "Drawings",
    src: "assets/craft/AXO.jpg",
    title: "Restaurant",
    subtitle: "Cruiseship · Studio Jouin Manku, Paris",
    caption:
      "A French restaurant aboard a cruiseship, designed during my time at Studio Jouin Manku in Paris. Translucent screens — drawn from the studio's vocabulary and shaped after underwater portholes — give each seating area its own pocket of privacy; digital walls run continuous undersea footage to keep the meal immersive. The axonometric came last, distilled from several rounds of plan iteration and 3D study.",
    meta: "Axonometric · line drawing",
  },
  {
    id: "a1a2-main-lobby",
    chapter: "Drawings",
    src: "assets/craft/A1A2 Lobby.JPG",
    title: "A1/A2 · Main Lobby",
    subtitle: "Tomson Riviera · Shanghai · public area",
    caption:
      "Public-area design for Tomson Riviera, a high-end residence in Shanghai. The brief calls for a colonial-era French Art Deco language; FF&E and art pieces were reselected to fit, then drawn into the lobby as a hand-rendered elevation. Vaulted ceiling, sculptural chandelier, a single figurative sculpture closing the axis.",
    meta: "Hand drawing · mixed media",
  },
  {
    id: "a1a2-sub-lobby",
    chapter: "Drawings",
    src: "assets/craft/A1 A2 Sub Lobby af.jpg",
    title: "A1/A2 · Sub Lobby",
    subtitle: "Same project · secondary lobby",
    caption:
      "A smaller companion to the main lobby, with a branch-motif backdrop and elevator openings flanking a centered plinth. Same palette, same pencil, smaller room.",
    meta: "Hand drawing · mixed media",
  },
  {
    id: "living-room-sketch",
    chapter: "Drawings",
    src: "assets/craft/living room.jpg",
    title: "Living Room",
    subtitle: "Tomson Riviera · private residence proposal",
    caption:
      "A private-residence proposal at Tomson Riviera, designed for the family's eldest son — minimalism softened with warmth. Fluted marble door frames, a fireplace of scrolled stonework, an earth-tone palette; a row of monochrome gradient panels stepping across the wall above the sofa and a plaster-textured French chandelier overhead. The sketch comes before anything is modeled — proportion first, finish later.",
    meta: "Hand drawing",
  },
  {
    id: "spa-room",
    chapter: "Drawings",
    src: "assets/craft/SPA.jpg",
    title: "Spa Room",
    subtitle: "Treatment suite · warm palette",
    caption:
      "Warm stone, wood, and a single dark painting on the long wall. A program that asks to feel held, not watched.",
    meta: "Hand drawing",
  },

  // ---------------------------------------------------------------------
  // Chapter 03 — Renders (3D modeled)
  // ---------------------------------------------------------------------
  {
    id: "living-room-oil",
    chapter: "Renders",
    src: "assets/craft/living_textured oil painting.jpg",
    title: "Living Room · Oil Pass",
    subtitle: "Residence · painterly render",
    caption:
      "The living room of the same residence, rendered as an oil painting. Same geometry as the tearoom, different language — choosing the rendering style is part of designing the space.",
    meta: "Designed, modelled, rendered & post-produced by Mian",
  },
  {
    id: "residence-tearoom",
    chapter: "Renders",
    src: "assets/craft/Tearoom_textured.jpg",
    title: "Tearoom",
    subtitle: "Residence · photoreal render",
    caption:
      "A tatami platform tucked behind a patterned screen, with the city thirty floors below. Same residence as the oil-pass living room — one home, two rooms, one model, two rendering languages.",
    meta: "Designed, modelled, rendered & post-produced by Mian",
  },
];
