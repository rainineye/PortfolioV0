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
    subtitle: "OBJECTIVE Gallery · Xintiandi, Shanghai · 2020",
    caption:
      "Objective curates 'narrative environments' rather than white-cube showcases — the gallery becomes a room, and furniture, lighting, and art are read in the atmosphere they're meant to inhabit. Coexist makes that premise literal: art, design, and craft sharing one space.",
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
    title: "Marshmallow Sofa",
    subtitle: "Coexist exhibition · OBJECTIVE Gallery",
    caption:
      "Soft against stone, warmth against the cool of metal — the pieces talk to each other before they talk to anyone in the room. A quiet chord, held still.",
    meta: "Lifestyle pairing · Coexist exhibition",
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
    title: "Petal Series",
    subtitle: "Collection #2 · OBJECTIVE Gallery · 2021 · special staging",
    caption:
      "Objective Gallery's Collection #2 — soft curves drawn from petal forms and translated into furniture. For this seasonal staging, the silhouettes are unchanged from the catalog; only the surfaces shift, with bespoke fabrics in fresh colors and dynamic textures commissioned specifically for the show. The opening spread arranges the first three pieces in front of a painted fireplace — the room they were curated to live in.",
    meta: "Collection opener · editorial",
  },
  {
    id: "aria-pink",
    chapter: "Objects",
    src: "assets/craft/20201229_OBJECTIVE3985_master.jpg",
    title: "Aria Armchair",
    subtitle: "OBJ+ · 2020 · Pink Toile colorway",
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
    title: "Brown Sugar Marshmallow Sofa",
    subtitle: "Limited edition · LV VIP Lounge · from behind",
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
    title: "Four Seasons Coffee Table",
    subtitle: "Wagyu · Special Edition · in detail",
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
    title: "French Fine-dining Restaurant",
    subtitle: "Cruiseship · Studio Jouin Manku, Paris",
    caption:
      "A French restaurant aboard a cruiseship, designed during my time at Studio Jouin Manku in Paris. Translucent screens — drawn from the studio's vocabulary and shaped after underwater portholes — give each seating area its own pocket of privacy; digital walls run continuous undersea footage to keep the meal immersive. The axonometric came last, distilled from several rounds of plan iteration and 3D study.",
    meta: "Axonometric · line drawing",
  },
  {
    id: "a1a2-main-lobby",
    chapter: "Drawings",
    src: "assets/craft/A1A2 Lobby.JPG",
    title: "Tomson Riviera",
    subtitle: "Shanghai · public area · Main Lobby",
    caption:
      "Public-area design for Tomson Riviera, a high-end residence in Shanghai. The brief calls for a colonial-era French Art Deco language; FF&E and art pieces were reselected to fit, then drawn into the lobby as a hand-rendered elevation. Vaulted ceiling, sculptural chandelier, a single figurative sculpture closing the axis.",
    meta: "Hand drawing · mixed media",
  },
  {
    id: "a1a2-sub-lobby",
    chapter: "Drawings",
    src: "assets/craft/A1 A2 Sub Lobby af.jpg",
    title: "Tomson Riviera",
    subtitle: "Shanghai · public area · Sub Lobby",
    caption:
      "A smaller companion to the main lobby, with a branch-motif backdrop and elevator openings flanking a centered plinth. Same project, same palette, same pencil — smaller room.",
    meta: "Hand drawing · mixed media",
  },
  {
    id: "living-room-sketch",
    chapter: "Drawings",
    src: "assets/craft/living room.jpg",
    title: "私人住宅",
    subtitle: "Living Room · hand-drawn elevation",
    caption:
      "Minimalism softened with warmth. Fluted marble door frames, a fireplace of scrolled stonework, an earth-tone palette; a row of monochrome gradient panels stepping across the wall above the sofa and a plaster-textured French chandelier overhead. The sketch comes before anything is modeled — proportion first, finish later.",
    meta: "Hand drawing",
  },
  {
    id: "spa-room",
    chapter: "Drawings",
    src: "assets/craft/SPA.jpg",
    title: "私人住宅",
    subtitle: "Spa Room · hand-drawn sketch",
    caption:
      "A private wellness space tucked within the residence. Oriental sensibility paired with marble and brass — natural, unhurried, settled into stillness. A program that asks to feel held, not watched.",
    meta: "Hand drawing",
  },

  // ---------------------------------------------------------------------
  // Chapter 03 — Renders (3D modeled)
  // ---------------------------------------------------------------------
  {
    id: "living-room-oil",
    chapter: "Renders",
    src: "assets/craft/living_textured oil painting.jpg",
    title: "私人住宅",
    subtitle: "Living Room · oil-pass rendering",
    caption:
      "The living room of the residence, rendered as an oil pass. Atmosphere over precision — the way the space is meant to feel before it gets built.",
    meta: "Designed, modelled, rendered & post-produced by Mian",
  },
  {
    id: "residence-tearoom",
    chapter: "Renders",
    src: "assets/craft/Tearoom_textured.jpg",
    title: "私人住宅",
    subtitle: "Study + Japanese tea room · oil-pass rendering",
    caption:
      "The study, opened up around a renovated Japanese tea room. A caned tatami platform anchors the space, an oriental chandelier overhead; entry is marked by a Carrara marble stepping stone — a small ritual built into the threshold. Lattice windows filter the strong outside light, leaving the room soft and quietly held.",
    meta: "Designed, modelled, rendered & post-produced by Mian",
  },
];
