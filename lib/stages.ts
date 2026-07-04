import { CardType } from "./gameData";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Ingredient {
  emoji: string;
  name: string;
  amount: string;
}

export interface IngredientTag {
  emoji: string;
  name: string;
}

export interface RealStep {
  card: CardType;
  title: string;
  detail: string;
  /** Short label shown on the in-game step card, e.g. "ごはんをまぜる" */
  gameLabel: string;
  /** Ingredients touched in this step, shown on the in-game step card */
  ingredients?: IngredientTag[];
  /** Countdown timer in seconds; show timer-start button when set */
  timer?: number;
  safetyNote?: string;
}

export interface RealRecipe {
  prepTime: string;
  servings: string;
  ingredients: Ingredient[];
  steps: RealStep[];
  cookingTip?: string;
  parentNote?: string;
}

export interface StageDefinition {
  id: number;
  level: number;
  levelName: string;
  levelIcon: string;
  levelColor: string;
  title: string;
  icon: string;
  description: string;
  coinReward: number;
  successSubMessage: string;
  realRecipe: RealRecipe;
}

// ── Level metadata ──────────────────────────────────────────────────────────────

export const LEVELS = [
  {
    id: 1,
    name: "はじめの一歩",
    icon: "🖐️",
    color: "green",
    description: "ほうちょうも火もつかわないよ！ひとりでできるよ！",
    toolName: null as string | null,
    toolIcon: null as string | null,
    unlockCost: 0,
  },
  {
    id: 2,
    name: "チン＆トースター",
    icon: "⚡",
    color: "blue",
    description: "電子レンジやトースターをつかってみよう！",
    toolName: "レンジ・トースター",
    toolIcon: "⚡",
    unlockCost: 20,
  },
  {
    id: 3,
    name: "ほうちょうデビュー",
    icon: "🔪",
    color: "orange",
    description: "はじめてほうちょうをつかうよ！おうちのひとといっしょに",
    toolName: "ほうちょう",
    toolIcon: "🔪",
    unlockCost: 50,
  },
  {
    id: 4,
    name: "コンロマスター",
    icon: "🔥",
    color: "rose",
    description: "フライパンやコンロをつかうほんとうのりょうり！かならずおうちのひとと",
    toolName: "コンロ・フライパン",
    toolIcon: "🔥",
    unlockCost: 90,
  },
];

// ── Stage definitions ─────────────────────────────────────────────────────────

export const ALL_STAGES: StageDefinition[] = [

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 1 — はじめの一歩 (No knife, no heat)
  // ════════════════════════════════════════════════════════════════════

  {
    id: 1,
    level: 1,
    levelName: "はじめの一歩",
    levelIcon: "🖐️",
    levelColor: "green",
    title: "おにぎり",
    icon: "🍙",
    description: "ごはんとツナをまぜて、ラップでむすぼう！",
    coinReward: 10,
    successSubMessage: "ぱくぱくおにぎりのできあがり！🍙",
    realRecipe: {
      prepTime: "10分",
      servings: "1〜2こ",
      ingredients: [
        { emoji: "🍚", name: "ごはん", amount: "茶わん1ぱい（160g）" },
        { emoji: "🧂", name: "しお", amount: "ひとつまみ" },
        { emoji: "🐟", name: "ツナかん", amount: "1/2かん" },
        { emoji: "📦", name: "ラップ", amount: "1まい" },
      ],
      steps: [
        {
          card: "mix",
          title: "ごはんとツナ、しおをまぜよう",
          detail: "ボウルにごはんを入れて、ツナとしおをくわえてよくまぜよう。手をよくあらってからね！",
          gameLabel: "ごはん・しお・ツナをまぜる",
          ingredients: [
            { emoji: "🍚", name: "ごはん" },
            { emoji: "🧂", name: "しお" },
            { emoji: "🐟", name: "ツナ" },
          ],
        },
        {
          card: "place",
          title: "ラップにごはんをのせよう",
          detail: "ラップを広げて、まんなかにごはんをのせよう。",
          gameLabel: "ラップにごはんをのせる",
          ingredients: [
            { emoji: "📦", name: "ラップ" },
            { emoji: "🍚", name: "ごはん" },
          ],
        },
        {
          card: "sandwich",
          title: "ラップでつつんでにぎろう！",
          detail: "ラップのはしをまとめて、三角形になるようにやさしくにぎろう。形がととのったらできあがり！",
          gameLabel: "にぎる",
        },
      ],
      cookingTip: "手をぬらしておくと、ごはんがくっつきにくいよ！",
    },
  },

  {
    id: 2,
    level: 1,
    levelName: "はじめの一歩",
    levelIcon: "🖐️",
    levelColor: "green",
    title: "チョコサンド",
    icon: "🍫",
    description: "チョコをぬって、マシュマロをはさもう！",
    coinReward: 10,
    successSubMessage: "あまあまチョコサンドのできあがり！🍫",
    realRecipe: {
      prepTime: "5分",
      servings: "1人分",
      ingredients: [
        { emoji: "🍞", name: "食パン", amount: "2まい" },
        { emoji: "🍫", name: "チョコレートスプレッド", amount: "大さじ2" },
        { emoji: "☁️", name: "マシュマロ", amount: "5こ" },
      ],
      steps: [
        {
          card: "place",
          title: "パンにチョコをぬろう",
          detail: "食パン1まいにチョコレートスプレッドをスプーンでまんべんなくぬろう！",
          gameLabel: "パンにチョコをぬる",
          ingredients: [
            { emoji: "🍞", name: "パン" },
            { emoji: "🍫", name: "チョコ" },
          ],
        },
        {
          card: "place",
          title: "マシュマロをのせよう",
          detail: "チョコの上にマシュマロをちらしてのせよう！",
          gameLabel: "マシュマロをのせる",
          ingredients: [{ emoji: "☁️", name: "マシュマロ" }],
        },
        {
          card: "sandwich",
          title: "もう1まいのパンではさもう",
          detail: "もう1まいのパンをのせて、そっとおさえよう！",
          gameLabel: "パンではさむ",
          ingredients: [{ emoji: "🍞", name: "パン" }],
        },
      ],
    },
  },

  {
    id: 3,
    level: 1,
    levelName: "はじめの一歩",
    levelIcon: "🖐️",
    levelColor: "green",
    title: "ハムチーズロール",
    icon: "🌯",
    description: "ハムとチーズをのせて、くるくるまこう！",
    coinReward: 10,
    successSubMessage: "くるくるハムチーズロールのできあがり！🌯",
    realRecipe: {
      prepTime: "5分",
      servings: "1人分",
      ingredients: [
        { emoji: "🥓", name: "スライスハム", amount: "3まい" },
        { emoji: "🧀", name: "スライスチーズ", amount: "3まい" },
      ],
      steps: [
        {
          card: "place",
          title: "ハムの上にチーズをのせよう",
          detail: "まないたの上にハムを広げて、その上にチーズを1まいずつのせよう。",
          gameLabel: "ハムにチーズをのせる",
          ingredients: [
            { emoji: "🥓", name: "ハム" },
            { emoji: "🧀", name: "チーズ" },
          ],
        },
        {
          card: "roll",
          title: "はしからくるくるまこう",
          detail: "はしからくるくるとまいていこう。まきおわったらできあがり！",
          gameLabel: "まく",
        },
      ],
      cookingTip: "ようじでとめると食べやすいよ！",
    },
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 2 — チン＆トースター (Microwave / toaster — still no knife)
  // ════════════════════════════════════════════════════════════════════

  {
    id: 4,
    level: 2,
    levelName: "チン＆トースター",
    levelIcon: "⚡",
    levelColor: "blue",
    title: "マグカップパンケーキ",
    icon: "☕",
    description: "カップでまぜて、レンジでチン！",
    coinReward: 15,
    successSubMessage: "ふっくらマグカップパンケーキのできあがり！🥞",
    realRecipe: {
      prepTime: "5分",
      servings: "1人分",
      ingredients: [
        { emoji: "🫙", name: "ホットケーキミックス", amount: "大さじ3" },
        { emoji: "🥛", name: "ぎゅうにゅう", amount: "大さじ2" },
        { emoji: "🥚", name: "たまご", amount: "1/2こ" },
      ],
      steps: [
        {
          card: "mix",
          title: "カップにぜんぶ入れてまぜよう",
          detail: "大きめのマグカップにホットケーキミックス・ぎゅうにゅう・たまごを入れてよくまぜよう（だまがなくなるまで）。",
          gameLabel: "ミックス・ぎゅうにゅう・たまごをまぜる",
          ingredients: [
            { emoji: "🫙", name: "ミックス" },
            { emoji: "🥛", name: "ぎゅうにゅう" },
            { emoji: "🥚", name: "たまご" },
          ],
        },
        {
          card: "microwave",
          title: "電子レンジで1分30びょうチン！",
          detail: "マグカップにラップをふんわりかけて、600Wで1分30びょうかねつしよう。",
          gameLabel: "チンする",
          timer: 90,
          safetyNote: "とり出すときはアツアツ！ふきんやミトンをつかってね！",
        },
        {
          card: "wait",
          title: "すこしさましてから食べよう",
          detail: "とり出したらすこしさましてから食べよう。",
          gameLabel: "まつ",
        },
      ],
      cookingTip: "ちょっとふくらむのでカップは大きめがいいよ！",
      parentNote: "電子レンジからとり出すときはあついので大人が手つだってあげてください。",
    },
  },

  {
    id: 5,
    level: 2,
    levelName: "チン＆トースター",
    levelIcon: "⚡",
    levelColor: "blue",
    title: "チーズトースト",
    icon: "🧀",
    description: "チーズをのせて、トースターでやこう！",
    coinReward: 15,
    successSubMessage: "とろとろチーズトーストのできあがり！🧀",
    realRecipe: {
      prepTime: "5分",
      servings: "1人分",
      ingredients: [
        { emoji: "🍞", name: "食パン（6まいぎり）", amount: "1まい" },
        { emoji: "🧀", name: "スライスチーズ", amount: "1〜2まい" },
      ],
      steps: [
        {
          card: "place",
          title: "パンにチーズをのせよう",
          detail: "食パンの上にスライスチーズをはみ出さないようにのせよう！",
          gameLabel: "パンにチーズをのせる",
          ingredients: [
            { emoji: "🍞", name: "パン" },
            { emoji: "🧀", name: "チーズ" },
          ],
        },
        {
          card: "toast",
          title: "トースターで2〜3分やこう",
          detail: "チーズがとけてふつふつしてきたらできあがり！こげないように見ておこう。",
          gameLabel: "やく",
          timer: 150,
          safetyNote: "トースターはかならずおうちのひとといっしょにつかおう！",
        },
        {
          card: "wait",
          title: "とり出してすこしさまそう",
          detail: "トースターからとり出すときはやけどに気をつけて！すこしさましてから食べよう。",
          gameLabel: "まつ",
          safetyNote: "パンがアツアツ！やけどにちゅうい！",
        },
      ],
      cookingTip: "チーズがきつね色になったらおいしい合図だよ！",
      parentNote: "トースターのとり出しは大人が行ってください。やけどにちゅうい。",
    },
  },

  {
    id: 6,
    level: 2,
    levelName: "チン＆トースター",
    levelIcon: "⚡",
    levelColor: "blue",
    title: "シナモントースト",
    icon: "🍞",
    description: "バターとシナモンをまぜてぬって、やこう！",
    coinReward: 15,
    successSubMessage: "こうばしシナモントーストのできあがり！🍞✨",
    realRecipe: {
      prepTime: "8分",
      servings: "1人分",
      ingredients: [
        { emoji: "🍞", name: "食パン（6まいぎり）", amount: "1まい" },
        { emoji: "🧈", name: "バター（じょうおん）", amount: "小さじ1（5g）" },
        { emoji: "🍬", name: "さとう", amount: "小さじ1" },
        { emoji: "🌿", name: "シナモンパウダー", amount: "少し" },
      ],
      steps: [
        {
          card: "mix",
          title: "バター・さとう・シナモンをまぜよう",
          detail: "小ざらにじょうおんのバター・さとう・シナモンを入れてよくまぜよう。ペーストじょうになるまでね！",
          gameLabel: "バター・さとう・シナモンをまぜる",
          ingredients: [
            { emoji: "🧈", name: "バター" },
            { emoji: "🍬", name: "さとう" },
            { emoji: "🌿", name: "シナモン" },
          ],
        },
        {
          card: "place",
          title: "食パンにぬろう",
          detail: "まぜたシナモンバターをナイフやスプーンで食パンにまんべんなくぬろう！",
          gameLabel: "パンにぬる",
          ingredients: [{ emoji: "🍞", name: "パン" }],
        },
        {
          card: "toast",
          title: "トースターで2分やこう",
          detail: "バターがとけてこんがりするまで2分ほどやこう。",
          gameLabel: "やく",
          timer: 120,
          safetyNote: "トースターはかならずおうちのひとといっしょにつかおう！",
        },
      ],
      cookingTip: "バターはれいぞうこから出して少しやわらかくしておくとまぜやすいよ！",
      parentNote: "トースターのとり出しは大人が行ってください。やけどにちゅうい。",
    },
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 3 — ほうちょうデビュー (Knife introduced)
  // ════════════════════════════════════════════════════════════════════

  {
    id: 7,
    level: 3,
    levelName: "ほうちょうデビュー",
    levelIcon: "🔪",
    levelColor: "orange",
    title: "ハムチーズサンド",
    icon: "🥪",
    description: "ハムとチーズをはさんで、はんぶんに切ろう！",
    coinReward: 20,
    successSubMessage: "ふわふわハムチーズサンドのできあがり！🥪",
    realRecipe: {
      prepTime: "8分",
      servings: "1人分",
      ingredients: [
        { emoji: "🍞", name: "食パン", amount: "2まい" },
        { emoji: "🥓", name: "スライスハム", amount: "2まい" },
        { emoji: "🧀", name: "スライスチーズ", amount: "1まい" },
      ],
      steps: [
        {
          card: "place",
          title: "パンにハムとチーズをのせよう",
          detail: "パン1まいにハムとチーズをかさねてのせよう！",
          gameLabel: "パンにハムとチーズをのせる",
          ingredients: [
            { emoji: "🍞", name: "パン" },
            { emoji: "🥓", name: "ハム" },
            { emoji: "🧀", name: "チーズ" },
          ],
        },
        {
          card: "sandwich",
          title: "もう1まいのパンではさもう",
          detail: "もう1まいのパンをのせて、上からそっとおさえよう！",
          gameLabel: "パンではさむ",
          ingredients: [{ emoji: "🍞", name: "パン" }],
        },
        {
          card: "cut",
          title: "はんぶんに切ろう",
          detail: "ほうちょうでまんなかから半分に切ろう。ゆっくり、ゆびに気をつけて！",
          gameLabel: "切る",
          safetyNote: "ほうちょうをつかうときはおうちのひとにそばにいてもらおう！",
        },
      ],
      parentNote: "ほうちょうをつかうときはかならず大人がそばで見まもってください。",
    },
  },

  {
    id: 8,
    level: 3,
    levelName: "ほうちょうデビュー",
    levelIcon: "🔪",
    levelColor: "orange",
    title: "ホットドッグ",
    icon: "🌭",
    description: "ソーセージに切りこみを入れて、あたためよう！",
    coinReward: 20,
    successSubMessage: "アツアツホットドッグのできあがり！🌭",
    realRecipe: {
      prepTime: "8分",
      servings: "1人分",
      ingredients: [
        { emoji: "🌭", name: "ソーセージ", amount: "1本" },
        { emoji: "🍞", name: "コッペパン", amount: "1こ" },
        { emoji: "🍅", name: "ケチャップ", amount: "おこのみで" },
      ],
      steps: [
        {
          card: "cut",
          title: "ソーセージに切りこみを入れよう",
          detail: "ほうちょうでソーセージのひょうめんにななめの切りこみを2〜3本入れよう。",
          gameLabel: "ソーセージに切りこみをいれる",
          ingredients: [{ emoji: "🌭", name: "ソーセージ" }],
          safetyNote: "ほうちょうをつかうときはおうちのひとにそばにいてもらおう！",
        },
        {
          card: "microwave",
          title: "電子レンジであたためよう",
          detail: "600Wで40びょうほどあたためよう。",
          gameLabel: "ソーセージをあたためる",
          timer: 40,
          safetyNote: "とり出すときはアツアツ！気をつけて！",
        },
        {
          card: "sandwich",
          title: "パンにはさもう",
          detail: "コッペパンに切れ目を入れて、あたためたソーセージをはさもう。",
          gameLabel: "パンにはさむ",
          ingredients: [{ emoji: "🍞", name: "パン" }],
        },
        {
          card: "drizzle",
          title: "ケチャップをかけよう",
          detail: "すきなだけケチャップをかけたらできあがり！",
          gameLabel: "ケチャップをかける",
          ingredients: [{ emoji: "🍅", name: "ケチャップ" }],
        },
      ],
      parentNote: "ほうちょうをつかうときはかならず大人がそばで見まもってください。",
    },
  },

  {
    id: 9,
    level: 3,
    levelName: "ほうちょうデビュー",
    levelIcon: "🔪",
    levelColor: "orange",
    title: "ピザトースト",
    icon: "🍕",
    description: "ハムを切って、トッピングをたくさんのせてやこう！",
    coinReward: 20,
    successSubMessage: "アツアツピザトーストのできあがり！🍕",
    realRecipe: {
      prepTime: "10分",
      servings: "1人分",
      ingredients: [
        { emoji: "🍞", name: "食パン（6まいぎり）", amount: "1まい" },
        { emoji: "🍅", name: "トマトケチャップ", amount: "大さじ1" },
        { emoji: "🥓", name: "ハム", amount: "2まい" },
        { emoji: "🌽", name: "コーン", amount: "おこのみで" },
        { emoji: "🧀", name: "ピザ用チーズ", amount: "20g" },
      ],
      steps: [
        {
          card: "cut",
          title: "ハムを小さく切ろう",
          detail: "ほうちょうでハムを食べやすい大きさに切ろう。",
          gameLabel: "ハムを切る",
          ingredients: [{ emoji: "🥓", name: "ハム" }],
          safetyNote: "ほうちょうをつかうときはおうちのひとにそばにいてもらおう！",
        },
        {
          card: "place",
          title: "ケチャップをぬろう",
          detail: "食パンにトマトケチャップをスプーンでまんべんなくぬろう！",
          gameLabel: "パンにケチャップをぬる",
          ingredients: [
            { emoji: "🍞", name: "パン" },
            { emoji: "🍅", name: "ケチャップ" },
          ],
        },
        {
          card: "place",
          title: "ハムとコーンをのせよう",
          detail: "切ったハムとコーンをちらしてのせよう！",
          gameLabel: "ハムとコーンをのせる",
          ingredients: [
            { emoji: "🥓", name: "ハム" },
            { emoji: "🌽", name: "コーン" },
          ],
        },
        {
          card: "place",
          title: "チーズをのせよう",
          detail: "ピザ用チーズをたっぷりのせよう！",
          gameLabel: "チーズをのせる",
          ingredients: [{ emoji: "🧀", name: "チーズ" }],
        },
        {
          card: "toast",
          title: "トースターで3〜4分やこう",
          detail: "チーズがとけてぷつぷつしてきたらできあがり！こげないよう、ようすを見よう。",
          gameLabel: "やく",
          timer: 180,
          safetyNote: "トースターはかならずおうちのひとといっしょにつかおう！",
        },
      ],
      parentNote: "ほうちょうとトースターのとり出しは大人が見まもってください。",
    },
  },

  // ════════════════════════════════════════════════════════════════════
  // LEVEL 4 — コンロマスター (Stove / frying pan)
  // ════════════════════════════════════════════════════════════════════

  {
    id: 10,
    level: 4,
    levelName: "コンロマスター",
    levelIcon: "🔥",
    levelColor: "rose",
    title: "目玉やき",
    icon: "🍳",
    description: "たまごをわって、フライパンでやこう！",
    coinReward: 25,
    successSubMessage: "ぷるぷる目玉やきのできあがり！🍳",
    realRecipe: {
      prepTime: "5分",
      servings: "1人分",
      ingredients: [
        { emoji: "🥚", name: "たまご", amount: "1こ" },
        { emoji: "🧈", name: "バター", amount: "少々" },
        { emoji: "🧂", name: "しお", amount: "少々" },
      ],
      steps: [
        {
          card: "break",
          title: "たまごをわろう",
          detail: "たまごをボウルのふちでかるくコンコンとたたいて、しずかにわり入れよう。",
          gameLabel: "たまごをわる",
          ingredients: [{ emoji: "🥚", name: "たまご" }],
        },
        {
          card: "toast",
          title: "フライパンでやこう",
          detail: "フライパンにバターをとかして、たまごをそっと入れて弱火でやこう。",
          gameLabel: "バターでやく",
          ingredients: [{ emoji: "🧈", name: "バター" }],
          timer: 180,
          safetyNote: "コンロの火をつかうので、かならずおうちのひとといっしょに！",
        },
        {
          card: "drizzle",
          title: "しおをかけよう",
          detail: "おさらにのせて、おこのみでしおをかけたらできあがり！",
          gameLabel: "しおをかける",
          ingredients: [{ emoji: "🧂", name: "しお" }],
        },
      ],
      parentNote: "コンロの火はかならず大人がそばで見まもり、火かげんをちょうせいしてください。",
    },
  },

  {
    id: 11,
    level: 4,
    levelName: "コンロマスター",
    levelIcon: "🔥",
    levelColor: "rose",
    title: "フライパンパンケーキ",
    icon: "🥞",
    description: "生地をまぜて、フライパンでりょうめんやこう！",
    coinReward: 25,
    successSubMessage: "ふっくらパンケーキのできあがり！🥞",
    realRecipe: {
      prepTime: "15分",
      servings: "1〜2人分",
      ingredients: [
        { emoji: "🫙", name: "ホットケーキミックス", amount: "100g" },
        { emoji: "🥚", name: "たまご", amount: "1こ" },
        { emoji: "🥛", name: "ぎゅうにゅう", amount: "70ml" },
        { emoji: "🍁", name: "メープルシロップ", amount: "おこのみで" },
      ],
      steps: [
        {
          card: "mix",
          title: "生地をまぜよう",
          detail: "ボウルにホットケーキミックス・たまご・ぎゅうにゅうを入れてなめらかになるまでまぜよう。",
          gameLabel: "ミックス・たまご・ぎゅうにゅうをまぜる",
          ingredients: [
            { emoji: "🫙", name: "ミックス" },
            { emoji: "🥚", name: "たまご" },
            { emoji: "🥛", name: "ぎゅうにゅう" },
          ],
        },
        {
          card: "toast",
          title: "フライパンでりょうめんやこう",
          detail: "弱火にねっしたフライパンに生地をながし入れ、ふつふつしてきたらひっくりかえしてりょうめんやこう。",
          gameLabel: "やく",
          timer: 240,
          safetyNote: "コンロの火をつかうので、かならずおうちのひとといっしょに！",
        },
        {
          card: "place",
          title: "おさらにのせよう",
          detail: "やけたパンケーキをおさらにのせよう。",
          gameLabel: "のせる",
        },
        {
          card: "drizzle",
          title: "シロップをかけよう",
          detail: "メープルシロップをたっぷりかけたらできあがり！",
          gameLabel: "シロップをかける",
          ingredients: [{ emoji: "🍁", name: "シロップ" }],
        },
      ],
      parentNote: "コンロの火はかならず大人がそばで見まもり、ひっくりかえすのを手つだってください。",
    },
  },

  {
    id: 12,
    level: 4,
    levelName: "コンロマスター",
    levelIcon: "🔥",
    levelColor: "rose",
    title: "たまごチャーハン",
    icon: "🍚",
    description: "やさいを切って、フライパンでいためよう！",
    coinReward: 25,
    successSubMessage: "パラパラたまごチャーハンのできあがり！🍚",
    realRecipe: {
      prepTime: "15分",
      servings: "1人分",
      ingredients: [
        { emoji: "🍚", name: "ごはん", amount: "茶わん1ぱい（160g）" },
        { emoji: "🥚", name: "たまご", amount: "1こ" },
        { emoji: "🧅", name: "玉ねぎ", amount: "1/4こ" },
        { emoji: "🥕", name: "にんじん", amount: "少々" },
        { emoji: "🍶", name: "しょうゆ", amount: "小さじ1" },
      ],
      steps: [
        {
          card: "cut",
          title: "玉ねぎとにんじんを小さく切ろう",
          detail: "ほうちょうで玉ねぎとにんじんをみじん切りにしよう。",
          gameLabel: "玉ねぎとにんじんを切る",
          ingredients: [
            { emoji: "🧅", name: "玉ねぎ" },
            { emoji: "🥕", name: "にんじん" },
          ],
          safetyNote: "ほうちょうをつかうときはおうちのひとにそばにいてもらおう！",
        },
        {
          card: "mix",
          title: "たまごをといておこう",
          detail: "ボウルにたまごをわり入れて、よくといておこう。",
          gameLabel: "たまごをとく",
          ingredients: [{ emoji: "🥚", name: "たまご" }],
        },
        {
          card: "toast",
          title: "フライパンでいためよう",
          detail: "ねっしたフライパンでたまご・野さい・ごはんのじゅんにいためよう。",
          gameLabel: "ごはんをいためる",
          ingredients: [{ emoji: "🍚", name: "ごはん" }],
          timer: 300,
          safetyNote: "コンロの火をつかうので、かならずおうちのひとといっしょに！",
        },
        {
          card: "drizzle",
          title: "しょうゆをかけよう",
          detail: "さい後にしょうゆをまわしかけて、さっとまぜたらできあがり！",
          gameLabel: "しょうゆをかける",
          ingredients: [{ emoji: "🍶", name: "しょうゆ" }],
        },
      ],
      parentNote: "ほうちょうとコンロの火はかならず大人がそばで見まもってください。",
    },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getStage(id: number): StageDefinition | undefined {
  return ALL_STAGES.find((s) => s.id === id);
}

export function getLevelStages(levelId: number): StageDefinition[] {
  return ALL_STAGES.filter((s) => s.level === levelId);
}

export function getLevel(levelId: number) {
  return LEVELS.find((l) => l.id === levelId);
}

/** Level 1 needs no tool. Level N (N>1) unlocks once its tool has been bought with coins. */
export function isLevelUnlocked(
  levelId: number,
  unlockedLevelIds: Set<number>
): boolean {
  if (levelId <= 1) return true;
  return unlockedLevelIds.has(levelId);
}

/**
 * A level's tool can be bought once the previous level is unlocked and
 * there are enough coins — tools are bought in order, one at a time.
 */
export function canBuyLevel(
  levelId: number,
  unlockedLevelIds: Set<number>,
  totalCoins: number
): boolean {
  const level = getLevel(levelId);
  if (!level || isLevelUnlocked(levelId, unlockedLevelIds)) return false;
  if (!isLevelUnlocked(levelId - 1, unlockedLevelIds)) return false;
  return totalCoins >= level.unlockCost;
}

/** True once every recipe in the level has been cooked for real. */
export function isLevelComplete(
  levelId: number,
  cookingDoneIds: Set<number>
): boolean {
  return getLevelStages(levelId).every((s) => cookingDoneIds.has(s.id));
}
