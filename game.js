(() => {
  const canvas = document.getElementById("sceneCanvas");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const dom = {
    level: document.getElementById("levelValue"),
    score: document.getElementById("scoreValue"),
    combo: document.getElementById("comboValue"),
    time: document.getElementById("timeValue"),
    highScore: document.getElementById("highScoreValue"),
    purityText: document.getElementById("purityText"),
    purityFill: document.getElementById("purityFill"),
    feverText: document.getElementById("feverText"),
    feverFill: document.getElementById("feverFill"),
    carry: document.getElementById("carryValue"),
    playerName: document.getElementById("playerNameLabel"),
    orderName: document.getElementById("orderName"),
    recipeList: document.getElementById("recipeList"),
    fact: document.getElementById("factText"),
    leaderboard: document.getElementById("leaderboardList"),
    toast: document.getElementById("toast"),
    startOverlay: document.getElementById("startOverlay"),
    gameOverOverlay: document.getElementById("gameOverOverlay"),
    startButton: document.getElementById("startButton"),
    restartButton: document.getElementById("restartButton"),
    shareButton: document.getElementById("shareButton"),
    muteButton: document.getElementById("muteButton"),
    muteIcon: document.getElementById("muteIcon"),
    nameInput: document.getElementById("nameInput"),
    resultTitle: document.getElementById("resultTitle"),
    resultCopy: document.getElementById("resultCopy"),
    finalScore: document.getElementById("finalScore"),
    finalCombo: document.getElementById("finalCombo"),
    finalLevel: document.getElementById("finalLevel"),
    upButton: document.getElementById("upButton"),
    leftButton: document.getElementById("leftButton"),
    rightButton: document.getElementById("rightButton"),
    downButton: document.getElementById("downButton"),
    actionButton: document.getElementById("purifyButton"),
  };

  const NAME_KEY = "ugoodays-pixel-player";
  const SCORE_KEY = "ugoodays-pixel-leaderboard";
  const HIGH_KEY = "ugoodays-pixel-high-score";
  const AUDIO_KEY = "ugoodays-pixel-muted";

  const COLORS = {
    ink: "#24323a",
    shadow: "rgba(36,50,58,.28)",
    milk: "#f7fdff",
    aqua: "#7fc3de",
    aquaDeep: "#268aa1",
    berry: "#b44966",
    orange: "#ef8b53",
    yellow: "#f4d16f",
    leaf: "#65a85f",
    cream: "#fff4dc",
    purple: "#7d5ba6",
  };

  const TYPES = {
    milk: { label: "鮮奶", short: "奶", color: "#7fc3de", bg: "#dff6ff", hold: "鮮奶", feature: "純淨基底", effect: "純淨+", verb: "補純" },
    culture: { label: "益菌", short: "菌", color: "#268aa1", bg: "#caeef6", hold: "益菌", feature: "8 種益菌", effect: "牽引", verb: "牽引" },
    protein: { label: "高蛋白", short: "蛋", color: "#ef8b53", bg: "#ffe0cc", hold: "蛋白", feature: "厚實飽足", effect: "分數+", verb: "加分" },
    calcium: { label: "鈣", short: "鈣", color: "#4b91b6", bg: "#dceffc", hold: "鈣", feature: "鈣力守護", effect: "慢拍", verb: "慢拍" },
    fruit: { label: "水果", short: "果", color: "#b44966", bg: "#f4d7df", hold: "水果", feature: "果香層次", effect: "能量+", verb: "提香" },
    honey: { label: "蜂蜜", short: "蜜", color: "#c58b27", bg: "#fff2b8", hold: "蜂蜜", feature: "自然甜感", effect: "秒數+", verb: "回甘" },
    mix: { label: "混乳", short: "混", color: "#f4d16f", bg: "#fff2b8", stage: "混乳中", feature: "滑順混乳", effect: "接續快", verb: "滑順" },
    ferment: { label: "熟成", short: "酵", color: "#65a85f", bg: "#def3df", stage: "熟成中", feature: "低溫熟成", effect: "能量+", verb: "熟成" },
    strain: { label: "濾乳", short: "濾", color: "#9b6c53", bg: "#f4e0cf", stage: "希臘濾乳", feature: "綿密濾乳", effect: "精品+", verb: "濾厚" },
    qc: { label: "檢查", short: "檢", color: "#b44966", bg: "#f4d7df", stage: "純淨檢查", feature: "純淨把關", effect: "護盾", verb: "把關" },
    texture: { label: "口感", short: "滑", color: "#ef8b53", bg: "#ffe0cc", stage: "口感調整", feature: "口感研發", effect: "連線+", verb: "調滑" },
    pack: { label: "貼標", short: "標", color: "#7d5ba6", bg: "#eadfff", stage: "封杯完成", feature: "精品封杯", effect: "熱度+", verb: "封杯" },
    ship: { label: "出貨", short: "出", color: "#4b91b6", bg: "#dceffc", stage: "冷鏈出貨", feature: "冷鏈保鮮", effect: "秒數+", verb: "保鮮" },
  };

  const HAZARDS = [
    { key: "flavor", label: "香精", short: "香", color: "#b44966", feature: "非純淨", effect: "扣純" },
    { key: "coloring", label: "色素", short: "色", color: "#8e4da8", feature: "人工色", effect: "扣秒" },
    { key: "dirty", label: "髒汙", short: "髒", color: "#6b513f", feature: "品管失守", effect: "重扣" },
    { key: "sugar", label: "過糖", short: "糖", color: "#d17a2f", feature: "甜感失衡", effect: "扣能" },
  ];

  const BONUS = [
    { key: "calciumBoost", label: "鈣力慢拍", short: "鈣", color: "#4b91b6", feature: "鈣力補給", effect: "危險物慢" },
    { key: "probioticBoost", label: "益菌磁吸", short: "益", color: "#268aa1", feature: "益菌活力", effect: "目標貼近" },
    { key: "cleanBoost", label: "純淨盾", short: "淨", color: "#65a85f", feature: "純淨製作", effect: "擋添加物" },
  ];

  const STATION_KEYS = ["mix", "ferment", "strain", "qc", "texture", "pack", "ship"];

  const DIFFICULTY_TIERS = [
    { min: 1, name: "鮮奶新手線", speed: 202, sameLane: 0.9, required: 1.58, decoy: true, hazard: false, decoyMin: 1.55, decoyMax: 2.25, hazardMin: 9.5, hazardMax: 11.5, timeCap: 72, orderTime: 13, missPurity: 5, missTime: 0.8, timerDrain: 0.98, hazardTarget: 0, bonusChance: 0.46 },
    { min: 2, name: "純淨封杯線", speed: 212, sameLane: 0.84, required: 1.48, decoy: true, hazard: false, decoyMin: 1.7, decoyMax: 2.55, hazardMin: 8.0, hazardMax: 9.8, timeCap: 70, orderTime: 11, missPurity: 6, missTime: 1.0, timerDrain: 1.02, hazardTarget: 0.08, bonusChance: 0.5 },
    { min: 5, name: "益菌熟成線", speed: 224, sameLane: 0.8, required: 1.44, decoy: true, hazard: true, decoyMin: 2.05, decoyMax: 2.85, hazardMin: 5.2, hazardMax: 6.8, timeCap: 64, orderTime: 9, missPurity: 8, missTime: 1.3, timerDrain: 1.06, hazardTarget: 0.3, bonusChance: 0.45 },
    { min: 8, name: "口感研發線", speed: 254, sameLane: 0.68, required: 1.24, decoy: true, hazard: true, decoyMin: 1.55, decoyMax: 2.2, hazardMin: 3.3, hazardMax: 4.6, timeCap: 60, orderTime: 7, missPurity: 12, missTime: 1.8, timerDrain: 1.16, hazardTarget: 0.46, bonusChance: 0.38 },
    { min: 12, name: "精品爆單線", speed: 292, sameLane: 0.56, required: 1.02, decoy: true, hazard: true, decoyMin: 1.16, decoyMax: 1.7, hazardMin: 2.25, hazardMax: 3.35, timeCap: 54, orderTime: 5.2, missPurity: 17, missTime: 2.5, timerDrain: 1.34, hazardTarget: 0.62, bonusChance: 0.34 },
    { min: 16, name: "純淨極限線", speed: 338, sameLane: 0.46, required: 0.82, decoy: true, hazard: true, decoyMin: 0.85, decoyMax: 1.28, hazardMin: 1.35, hazardMax: 2.1, timeCap: 48, orderTime: 3.2, missPurity: 24, missTime: 3.6, timerDrain: 1.6, hazardTarget: 0.78, bonusChance: 0.28 },
  ];

  const MODIFIERS = [
    { id: "standard", unlock: 1, label: "標準批", desc: "穩定出貨", speed: 1, timerDrain: 1, requiredRate: 1, hazardRate: 1, hazardTarget: 0, orderTime: 1, purityPenalty: 1, bonusChance: 0, reward: 0 },
    { id: "coldRush", unlock: 5, label: "冷鏈急單", desc: "倒數加壓，出貨多加分", speed: 1.06, timerDrain: 1.12, requiredRate: 0.92, hazardRate: 1, hazardTarget: 0.04, orderTime: 0.82, purityPenalty: 1, bonusChance: -0.03, reward: 850 },
    { id: "boutiqueBoost", unlock: 6, label: "精品加料", desc: "加分物變多，但節奏更密", speed: 1.04, timerDrain: 1.05, requiredRate: 0.94, hazardRate: 1.08, hazardTarget: 0.03, orderTime: 0.9, purityPenalty: 1.05, bonusChance: 0.18, reward: 650 },
    { id: "audit", unlock: 8, label: "純淨稽核", desc: "添加物更兇，純淨率更容易掉", speed: 1.02, timerDrain: 1.05, requiredRate: 1, hazardRate: 0.82, hazardTarget: 0.14, orderTime: 0.94, purityPenalty: 1.32, bonusChance: -0.07, reward: 1100 },
    { id: "tripleLine", unlock: 10, label: "三軌快線", desc: "目標更常換軌，專打反應", speed: 1.1, timerDrain: 1.12, requiredRate: 0.9, hazardRate: 0.9, hazardTarget: 0.08, sameLane: -0.18, orderTime: 0.82, purityPenalty: 1.12, bonusChance: -0.04, reward: 1350 },
    { id: "additiveAlert", unlock: 13, label: "添加物警報", desc: "危險物會追線，撐住就高分", speed: 1.08, timerDrain: 1.18, requiredRate: 0.94, hazardRate: 0.68, hazardTarget: 0.24, orderTime: 0.74, purityPenalty: 1.55, bonusChance: -0.1, reward: 1950 },
  ];

  const OPENING_MODES = [
    { id: "coldOpen", chance: 0.1, label: "快閃冷鏈局", desc: "開場直接第 5 關，秒數更少、節奏更密。", level: 5, timeRemaining: 38, purity: 96, requiredTimer: 0.24, decoyTimer: 0.9, hazardTimer: 1.6, modifierId: "coldRush", speed: 1.04, timerDrain: 1.08, hazardTarget: 0.12 },
    { id: "auditOpen", chance: 0.035, label: "黑標稽核局", desc: "開場就是稽核壓力，失誤很快會結束本局。", level: 8, timeRemaining: 30, purity: 88, requiredTimer: 0.18, decoyTimer: 0.72, hazardTimer: 0.9, modifierId: "audit", speed: 1.08, timerDrain: 1.14, hazardTarget: 0.2 },
  ];

  const MISSION_RULES = [
    { id: "noMiss", unlock: 1, label: "本批不碰添加物", points: 900, kind: "orderPerfect" },
    { id: "starterCombo4", unlock: 1, label: "4 連線完成手感", points: 980, target: 4, counter: "combo" },
    { id: "brandHeat3", unlock: 1, label: "集 3 個品牌亮點", points: 1100, target: 3, counter: "brandFeatures" },
    { id: "perfect3", unlock: 2, label: "連續 3 次 PERFECT", points: 1200, target: 3, counter: "perfectStreak" },
    { id: "collectPerfect2", unlock: 3, label: "原料 2 次 PERFECT", points: 1350, target: 2, counter: "collectPerfects" },
    { id: "bonus1", unlock: 4, label: "吃到 1 個營養道具", points: 1250, target: 1, counter: "bonuses" },
    { id: "lane4", unlock: 5, label: "換軌 4 次完成本批", points: 1550, target: 4, counter: "laneChanges", completeOnOrder: true },
    { id: "perfect5", unlock: 5, label: "累積 5 次 PERFECT", points: 1700, target: 5, counter: "perfectTotal" },
    { id: "workPerfect2", unlock: 6, label: "設備 2 次 PERFECT", points: 1850, target: 2, counter: "workPerfects" },
    { id: "combo12", unlock: 7, label: "12 連線不中斷", points: 2200, target: 12, counter: "combo" },
    { id: "goodBatch", unlock: 8, label: "整批 GOOD 以上", points: 2350, kind: "orderNoOk" },
    { id: "bonus3", unlock: 9, label: "吃到 3 個營養道具", points: 2600, target: 3, counter: "bonuses" },
    { id: "pure95", unlock: 10, label: "純淨率 95% 以上出貨", points: 2800, kind: "purityOrder", threshold: 95 },
    { id: "shieldBlock", unlock: 11, label: "純淨盾擋 1 次添加物", points: 3200, target: 1, counter: "shieldBlocks" },
    { id: "pureRush", unlock: 12, label: "打出 1 次 PURE RUSH", points: 3400, target: 1, counter: "pureRushes" },
    { id: "combo24", unlock: 14, label: "24 連線不中斷", points: 4200, target: 24, counter: "combo" },
  ];

  const ORDERS = [
    order("fresh", 1, "鮮奶優格 160g", "清爽不酸澀", "#7fc3de", [
      collect("milk", "接鮮奶"),
      work("mix", "滑順混乳"),
      work("pack", "封杯貼標"),
      work("ship", "冷鏈出貨"),
    ]),
    order("probiotic", 3, "8 種益菌優格", "益菌熟成", "#268aa1", [
      collect("milk", "接鮮奶"),
      collect("culture", "接益菌"),
      work("mix", "混進益菌"),
      work("ferment", "低溫熟成"),
      work("qc", "純淨檢查"),
      work("pack", "封杯貼標"),
      work("ship", "冷鏈出貨"),
    ]),
    order("drink", 5, "原味優格飲", "自然乳香可飲用", "#f4d16f", [
      collect("milk", "接鮮奶"),
      collect("calcium", "補鈣"),
      collect("culture", "接益菌"),
      work("mix", "調飲用濃度"),
      work("ferment", "低溫熟成"),
      work("texture", "保留乳香"),
      work("pack", "封瓶貼標"),
      work("ship", "冷鏈出貨"),
    ]),
    order("greek", 8, "希臘高蛋白優格", "綿密扎實", "#ef8b53", [
      collect("milk", "接鮮奶"),
      collect("protein", "接蛋白"),
      collect("culture", "接益菌"),
      work("mix", "拌到厚實"),
      work("ferment", "低溫熟成"),
      work("strain", "慢工濾乳"),
      work("qc", "精品檢查"),
      work("pack", "封杯貼標"),
      work("ship", "冷鏈出貨"),
    ]),
    order("boutique", 11, "精品蜂蜜水果優格", "果香綿滑", "#b44966", [
      collect("milk", "接鮮奶"),
      collect("culture", "接益菌"),
      collect("fruit", "接水果"),
      collect("honey", "接蜂蜜"),
      work("mix", "拌出層次"),
      work("ferment", "低溫熟成"),
      work("qc", "純淨檢查"),
      work("texture", "調綿滑口感"),
      work("pack", "精品貼標"),
      work("ship", "冷鏈出貨"),
    ]),
  ];

  const state = {
    phase: "ready",
    width: 0,
    height: 0,
    dpr: 1,
    lanes: [0, 0, 0],
    time: 0,
    last: 0,
    level: 1,
    score: 0,
    highScore: readNumber(HIGH_KEY),
    combo: 0,
    maxCombo: 0,
    purity: 100,
    fever: 0,
    feverTime: 0,
    completedOrders: 0,
    missed: 0,
    batchMistakes: 0,
    batchPerfects: 0,
    precisionStreak: 0,
    bestPrecisionStreak: 0,
    multiplier: 1,
    lastComboPrize: 0,
    brandHeat: 0,
    shield: 0,
    slowTime: 0,
    magnetTime: 0,
    openingMode: null,
    recentMissionIds: [],
    mission: null,
    modifier: null,
    order: null,
    stepIndex: 0,
    carry: "空手",
    speed: 250,
    timeRemaining: 45,
    playerName: localStorage.getItem(NAME_KEY) || "Guest",
    requiredTimer: 0,
    decoyTimer: 0,
    hazardTimer: 0,
    batchLaneChanges: 0,
    batchBonuses: 0,
    batchShieldBlocks: 0,
    batchWorkPerfects: 0,
    batchCollectPerfects: 0,
    batchOkHits: 0,
    batchPureRushes: 0,
    batchFeatureKeys: {},
    shake: 0,
    entities: [],
    particles: [],
    bursts: [],
    floats: [],
    packages: [],
  };

  const player = {
    x: 190,
    y: 0,
    lane: 1,
    targetLane: 1,
    actionTimer: 0,
    invuln: 0,
    stepBob: 0,
    laneRepeat: 0,
  };

  const controls = {
    left: false,
    right: false,
    up: false,
    down: false,
    action: false,
  };

  const touch = {
    id: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    laneY: 0,
    startedAt: 0,
    dragging: false,
  };

  const audio = {
    muted: localStorage.getItem(AUDIO_KEY) === "1",
    context: null,
    sfxGain: null,
    bgmGain: null,
    bgmTimer: null,
    bgmStep: 0,
    bgmNextTime: 0,
  };

  const BGM = {
    bpm: 96,
    melody: ["E5", null, "G5", null, "A5", "G5", null, "E5", "D5", null, "E5", "G5", null, "C6", "B5", null, "A5", null, "G5", "E5", null, "D5", "E5", null, "G5", null, "A5", "G5", "E5", null, "D5", null],
    bass: ["C3", null, null, null, "G2", null, null, null, "A2", null, null, null, "F2", null, "G2", null, "C3", null, null, null, "E3", null, null, null, "A2", null, null, null, "F2", null, "G2", null],
    sparkle: ["C6", null, null, null, "E6", null, null, "G6", null, null, "B5", null, "C6", null, null, null, "E6", null, null, "G6", null, "A6", null, null, "G6", null, "E6", null, null, "D6", null, null],
    chords: [["C4", "E4", "G4"], ["G3", "B3", "D4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"]],
  };

  const logo = new Image();
  logo.src = "./assets/ugoodays-logo.png";
  let entityId = 0;
  let toastTimer = 0;

  init();

  function order(id, unlock, name, texture, color, steps) {
    return { id, unlock, name, texture, color, steps };
  }

  function collect(key, label) {
    return { mode: "collect", key, label, points: 180 };
  }

  function work(key, label) {
    return { mode: "work", key, label, points: 250 };
  }

  function getDifficulty() {
    let tier = DIFFICULTY_TIERS[0];
    for (const item of DIFFICULTY_TIERS) {
      if (state.level >= item.min) tier = item;
    }
    const modifier = state.modifier || MODIFIERS[0];
    const pressure = Math.max(0, state.level - tier.min);
    const latePressure = Math.max(0, state.level - 8);
    const opening = activeOpeningMode();
    const openingSpeed = opening?.speed || 1;
    const openingDrain = opening?.timerDrain || 1;
    const openingHazardTarget = opening?.hazardTarget || 0;
    return {
      ...tier,
      speed: (tier.speed + pressure * 9.5 + latePressure * 3.6 + state.completedOrders * 2.8) * modifier.speed * openingSpeed,
      sameLane: clamp(tier.sameLane - pressure * 0.015 + (modifier.sameLane || 0), 0.28, 0.96),
      required: Math.max(0.54, (tier.required - pressure * 0.029 - latePressure * 0.008 - state.combo * 0.0009) * modifier.requiredRate),
      decoyMin: Math.max(0.68, tier.decoyMin - pressure * 0.025),
      decoyMax: Math.max(0.95, tier.decoyMax - pressure * 0.025),
      hazardMin: Math.max(0.72, (tier.hazardMin - pressure * 0.048 - latePressure * 0.025) * modifier.hazardRate),
      hazardMax: Math.max(1.02, (tier.hazardMax - pressure * 0.048 - latePressure * 0.025) * modifier.hazardRate),
      orderTime: Math.max(2.2, tier.orderTime * modifier.orderTime),
      missPurity: Math.ceil(tier.missPurity * modifier.purityPenalty),
      missTime: tier.missTime * modifier.purityPenalty,
      timerDrain: tier.timerDrain * modifier.timerDrain * openingDrain,
      hazardTarget: clamp(tier.hazardTarget + modifier.hazardTarget + openingHazardTarget, 0, 0.92),
      bonusChance: clamp(tier.bonusChance + modifier.bonusChance, 0.12, 0.72),
    };
  }

  function createModifier(forceFirst = false) {
    const opening = activeOpeningMode();
    if (opening?.modifierId) {
      return { ...(MODIFIERS.find((item) => item.id === opening.modifierId) || MODIFIERS[0]) };
    }
    if (forceFirst || state.level < 5) return { ...MODIFIERS[0] };
    const pool = MODIFIERS.filter((item) => item.unlock <= state.level);
    const index = (state.completedOrders * 2 + state.level + randomInt(0, Math.max(0, pool.length - 1))) % pool.length;
    return { ...pool[index] };
  }

  function createMission() {
    const candidates = MISSION_RULES.filter((rule) => rule.unlock <= state.level && missionAvailable(rule));
    const recent = new Set(state.recentMissionIds);
    const fresh = candidates.filter((rule) => !recent.has(rule.id));
    const pool = fresh.length ? fresh : candidates;
    const rule = pool[randomInt(0, pool.length - 1)] || MISSION_RULES[0];
    state.recentMissionIds.push(rule.id);
    state.recentMissionIds = state.recentMissionIds.slice(-4);
    return { ...rule, progress: 0, done: false };
  }

  function activeOpeningMode() {
    return state.openingMode && state.completedOrders === 0 ? state.openingMode : null;
  }

  function createOpeningMode() {
    const roll = Math.random();
    let mark = 0;
    for (const mode of OPENING_MODES) {
      mark += mode.chance;
      if (roll < mark) return { ...mode };
    }
    return null;
  }

  function missionAvailable(rule) {
    const steps = state.order?.steps || [];
    const collectCount = steps.filter((step) => step.mode === "collect").length;
    const workCount = steps.filter((step) => step.mode === "work").length;
    if (rule.counter === "collectPerfects") return collectCount >= rule.target;
    if (rule.counter === "workPerfects") return workCount >= rule.target;
    if (rule.id === "shieldBlock") return state.level >= 11;
    if (rule.id === "pureRush") return state.level >= 12 || Boolean(activeOpeningMode());
    return true;
  }

  function missionProgressText() {
    const mission = state.mission;
    if (!mission) return "穩穩完成這批";
    if (mission.done) return `${mission.label} 已達成`;
    if (mission.target) return `${mission.label} ${Math.min(mission.progress, mission.target)}/${mission.target}`;
    return mission.label;
  }

  function updateMissionOnStep(quality, step) {
    const mission = state.mission;
    if (!mission || mission.done) return;

    if (quality.grade === "ok") state.batchOkHits += 1;
    if (quality.grade === "perfect") {
      bumpMission("perfectStreak");
      bumpMission("perfectTotal");
      if (step?.mode === "collect") {
        state.batchCollectPerfects += 1;
        bumpMission("collectPerfects");
      }
      if (step?.mode === "work") {
        state.batchWorkPerfects += 1;
        bumpMission("workPerfects");
      }
    } else if (mission.counter === "perfectStreak") {
      mission.progress = 0;
    }

    setMissionProgress("combo", state.combo);
  }

  function updateMissionOnOrder(perfect) {
    const mission = state.mission;
    if (!mission || mission.done) return;
    if (mission.kind === "orderPerfect" && perfect) completeMission();
    if (mission.kind === "purityOrder" && state.purity >= mission.threshold) completeMission();
    if (mission.kind === "orderNoOk" && state.batchOkHits === 0 && perfect) completeMission();
    if (mission.completeOnOrder && mission.target && mission.progress >= mission.target) completeMission();
  }

  function bumpMission(counter, amount = 1) {
    const mission = state.mission;
    if (!mission || mission.done || mission.counter !== counter) return;
    mission.progress += amount;
    if (mission.target && mission.progress >= mission.target && !mission.completeOnOrder) completeMission();
  }

  function setMissionProgress(counter, value) {
    const mission = state.mission;
    if (!mission || mission.done || mission.counter !== counter) return;
    mission.progress = Math.max(mission.progress, value);
    if (mission.target && mission.progress >= mission.target && !mission.completeOnOrder) completeMission();
  }

  function completeMission() {
    const mission = state.mission;
    if (!mission || mission.done) return;
    const reward = mission.points + state.level * 80;
    mission.done = true;
    mission.progress = mission.target || 1;
    state.score += reward;
    state.fever = clamp(state.fever + 14, 0, 100);
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 1.8);
    showToast(`本批挑戰達成：${mission.label} +${formatNumber(reward)}`);
    floatText("挑戰達成！", player.x + 72, player.y - 132, COLORS.berry);
    floatText(`+${formatNumber(reward)}`, player.x + 72, player.y - 108, COLORS.leaf);
    emitPop(player.x + 56, player.y - 46, COLORS.berry, 22);
    beep(980, 0.07, "square", 0.035);
    beep(1260, 0.08, "triangle", 0.025);
  }

  function getHitQuality(entity) {
    const center = entity.x + entity.w / 2;
    const distance = Math.abs(center - player.x);
    if (distance <= 22) return { grade: "perfect", label: "PERFECT", mult: 1.48, color: COLORS.berry, fever: 6, time: 0.42 };
    if (distance <= 48) return { grade: "good", label: "GOOD", mult: 1.18, color: COLORS.aquaDeep, fever: 3, time: 0.18 };
    return { grade: "ok", label: "OK", mult: 1, color: COLORS.ink, fever: 0, time: 0 };
  }

  function applyHitQuality(entity, quality) {
    if (quality.grade === "perfect") {
      state.precisionStreak += 1;
      state.batchPerfects += 1;
    } else if (quality.grade === "good") {
      state.precisionStreak = Math.max(0, state.precisionStreak - 1);
    } else {
      state.precisionStreak = 0;
    }
    state.bestPrecisionStreak = Math.max(state.bestPrecisionStreak, state.precisionStreak);
    state.multiplier = 1 + Math.min(2.5, Math.floor(state.precisionStreak / 3) * 0.35);
    state.fever = clamp(state.fever + quality.fever, 0, 100);
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + quality.time);

    const label = state.multiplier > 1 ? `${quality.label} x${state.multiplier.toFixed(1)}` : quality.label;
    floatText(label, entity.x + entity.w / 2, entity.y - 98, quality.color);
    emitLaneFlash(entity.lane, quality.color);
    if (quality.grade === "perfect") {
      state.shake = Math.max(state.shake, 0.46);
      emitPop(entity.x + entity.w / 2, entity.y - 30, quality.color, 24);
      emitRingBurst(entity.x + entity.w / 2, entity.y - 34, quality.color, 2, 24);
      beep(760 + Math.min(520, state.precisionStreak * 28), 0.045, "square", 0.035);
    }
  }

  function init() {
    ctx.imageSmoothingEnabled = false;
    dom.nameInput.value = state.playerName === "Guest" ? "" : state.playerName;
    dom.playerName.textContent = state.playerName;
    dom.highScore.textContent = formatNumber(state.highScore);
    dom.muteIcon.textContent = audio.muted ? "靜" : "音";
    state.order = cloneOrder(ORDERS[0]);
    setupEvents();
    resize();
    renderRecipe();
    renderLeaderboard();
    updateHud();
    requestAnimationFrame(loop);

    const params = new URLSearchParams(window.location.search);
    if (params.get("start") === "1") {
      window.setTimeout(startGame, 160);
    }
  }

  function setupEvents() {
    dom.startButton.addEventListener("click", startGame);
    dom.restartButton.addEventListener("click", startGame);
    dom.shareButton.addEventListener("click", copyResult);
    dom.muteButton.addEventListener("click", toggleMute);
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    bindCanvasTouch();
    bindHold(dom.leftButton, "left");
    bindHold(dom.rightButton, "right");
    bindLaneHold(dom.upButton, "up", -1);
    bindLaneHold(dom.downButton, "down", 1);
    bindTap(dom.actionButton, triggerAction);
  }

  function bindHold(button, key) {
    if (!button) return;
    const down = (event) => {
      event.preventDefault();
      controls[key] = true;
    };
    const up = (event) => {
      event.preventDefault();
      controls[key] = false;
    };
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointerleave", up);
    button.addEventListener("pointercancel", up);
  }

  function bindLaneHold(button, key, delta) {
    if (!button) return;
    const down = (event) => {
      event.preventDefault();
      controls[key] = true;
      changeLane(delta);
      player.laneRepeat = 0.16;
    };
    const up = (event) => {
      event.preventDefault();
      controls[key] = false;
    };
    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointerleave", up);
    button.addEventListener("pointercancel", up);
  }

  function bindTap(button, action) {
    if (!button) return;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      action();
    });
  }

  function bindCanvasTouch() {
    canvas.addEventListener(
      "pointerdown",
      (event) => {
        if (event.pointerType === "mouse" || state.phase !== "playing") return;
        event.preventDefault();
        touch.id = event.pointerId;
        touch.startX = event.clientX;
        touch.startY = event.clientY;
        touch.lastX = event.clientX;
        touch.lastY = event.clientY;
        touch.laneY = event.clientY;
        touch.startedAt = performance.now();
        touch.dragging = false;
        canvas.setPointerCapture?.(event.pointerId);
      },
      { passive: false }
    );

    canvas.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerId !== touch.id) return;
        event.preventDefault();
        const dx = event.clientX - touch.startX;
        const dy = event.clientY - touch.laneY;
        if (Math.abs(dy) > 38) {
          changeLane(dy > 0 ? 1 : -1);
          touch.laneY = event.clientY;
          touch.dragging = true;
        }
        if (Math.abs(dx) > 20) {
          controls.left = dx < 0;
          controls.right = dx > 0;
          touch.dragging = true;
        } else if (Math.abs(dx) < 10) {
          controls.left = false;
          controls.right = false;
        }
        touch.lastX = event.clientX;
        touch.lastY = event.clientY;
      },
      { passive: false }
    );

    const endTouch = (event) => {
      if (event.pointerId !== touch.id) return;
      event.preventDefault();
      const totalMove = Math.hypot(event.clientX - touch.startX, event.clientY - touch.startY);
      const elapsed = performance.now() - touch.startedAt;
      controls.left = false;
      controls.right = false;
      if (totalMove < 24 && elapsed < 360) triggerAction();
      touch.id = null;
      touch.dragging = false;
      try {
        canvas.releasePointerCapture?.(event.pointerId);
      } catch {
        // Some browsers clear touch capture before pointercancel fires.
      }
    };

    canvas.addEventListener("pointerup", endTouch, { passive: false });
    canvas.addEventListener("pointercancel", endTouch, { passive: false });
  }

  function resize() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const safeBottom = state.height - (state.width < 520 ? 74 : 76);
    const safeTop = state.width < 520 ? 350 : 210;
    const gap = Math.max(68, Math.min(96, (safeBottom - safeTop) / 3));
    state.lanes = [safeBottom - gap * 2, safeBottom - gap, safeBottom];
    player.x = clamp(player.x || state.width * 0.22, 92, state.width * 0.5);
    player.y = state.lanes[player.lane];
  }

  function startGame() {
    ensureAudio();
    state.playerName = dom.nameInput.value.trim() || "Guest";
    localStorage.setItem(NAME_KEY, state.playerName);
    state.phase = "playing";
    state.level = 1;
    state.score = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.purity = 100;
    state.fever = 0;
    state.feverTime = 0;
    state.completedOrders = 0;
    state.missed = 0;
    state.batchMistakes = 0;
    state.batchPerfects = 0;
    state.precisionStreak = 0;
    state.bestPrecisionStreak = 0;
    state.multiplier = 1;
    state.lastComboPrize = 0;
    state.brandHeat = 0;
    state.shield = 0;
    state.slowTime = 0;
    state.magnetTime = 0;
    state.openingMode = createOpeningMode();
    state.recentMissionIds = [];
    state.mission = null;
    state.modifier = null;
    state.speed = 188;
    state.level = state.openingMode?.level || 1;
    state.purity = state.openingMode?.purity || 100;
    state.timeRemaining = state.openingMode?.timeRemaining || 64;
    state.requiredTimer = state.openingMode?.requiredTimer || 0.34;
    state.decoyTimer = state.openingMode?.decoyTimer || 1.25;
    state.hazardTimer = state.openingMode?.hazardTimer || 9;
    state.batchLaneChanges = 0;
    state.batchBonuses = 0;
    state.batchShieldBlocks = 0;
    state.batchWorkPerfects = 0;
    state.batchCollectPerfects = 0;
    state.batchOkHits = 0;
    state.batchPureRushes = 0;
    state.batchFeatureKeys = {};
    state.entities = [];
    state.particles = [];
    state.bursts = [];
    state.floats = [];
    state.packages = [];
    player.x = Math.min(190, state.width * 0.34);
    player.lane = 1;
    player.targetLane = 1;
    player.y = state.lanes[1];
    player.actionTimer = 0;
    player.invuln = 0;
    player.laneRepeat = 0;
    spawnOrder(!state.openingMode);
    dom.startOverlay.classList.add("hidden");
    dom.gameOverOverlay.classList.add("hidden");
    showToast(state.openingMode ? `${state.openingMode.label}：${state.openingMode.desc}` : "開工！先穩穩完成鮮奶線");
    startBgm(true);
    beep(560, 0.055, "square", 0.04);
  }

  function spawnOrder(forceFirst = false) {
    state.modifier = createModifier(forceFirst);
    const diff = getDifficulty();
    const pool = ORDERS.filter((item) => item.unlock <= state.level);
    const template = forceFirst ? ORDERS[0] : pool[(state.completedOrders + randomInt(0, pool.length - 1)) % pool.length];
    state.order = cloneOrder(template);
    state.stepIndex = 0;
    state.batchMistakes = 0;
    state.batchPerfects = 0;
    state.batchLaneChanges = 0;
    state.batchBonuses = 0;
    state.batchShieldBlocks = 0;
    state.batchWorkPerfects = 0;
    state.batchCollectPerfects = 0;
    state.batchOkHits = 0;
    state.batchPureRushes = 0;
    state.batchFeatureKeys = {};
    state.mission = createMission();
    state.carry = "空手";
    const opening = activeOpeningMode();
    state.requiredTimer = opening ? opening.requiredTimer : state.completedOrders === 0 ? 0.38 : Math.min(0.8, diff.required * 0.55);
    if (opening) {
      state.decoyTimer = opening.decoyTimer;
      state.hazardTimer = opening.hazardTimer;
    }
    renderRecipe();
    updateHud();
    if (!forceFirst && state.modifier.id !== "standard" && !opening) {
      showToast(`${state.modifier.label}：${state.modifier.desc}`);
    }
  }

  function loop(now) {
    const dt = Math.min(0.04, (now - (state.last || now)) / 1000);
    state.last = now;
    if (state.phase !== "over") state.time += dt;
    if (state.phase === "playing") update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    const diff = getDifficulty();
    state.timeRemaining -= dt * diff.timerDrain;
    if (state.timeRemaining <= 0) {
      endGame("時間歸零");
      return;
    }

    const feverBoost = state.feverTime > 0 ? 1.24 : 1;
    state.speed = diff.speed * feverBoost;
    state.requiredTimer -= dt;
    state.decoyTimer -= dt;
    state.hazardTimer -= dt;
    state.shake = Math.max(0, state.shake - dt * 9);
    player.actionTimer = Math.max(0, player.actionTimer - dt);
    player.invuln = Math.max(0, player.invuln - dt);
    state.slowTime = Math.max(0, state.slowTime - dt);
    state.magnetTime = Math.max(0, state.magnetTime - dt);

    if (state.feverTime > 0) {
      state.feverTime -= dt;
      if (state.feverTime <= 0) state.fever = 18;
    } else {
      state.fever = Math.max(0, state.fever - dt * 3.5);
    }

    processLaneControls(dt);
    const move = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    player.x = clamp(player.x + move * (state.feverTime > 0 ? 330 : 260) * dt, 86, state.width * 0.58);
    player.y += (state.lanes[player.lane] - player.y) * Math.min(1, dt * 13);
    player.stepBob += dt * (8 + Math.abs(move) * 6 + state.speed / 95);

    if (state.requiredTimer <= 0) {
      spawnRequired();
      state.requiredTimer = diff.required;
    }
    if (diff.decoy && state.decoyTimer <= 0) {
      spawnDecoy();
      state.decoyTimer = random(diff.decoyMin, diff.decoyMax);
    }
    if (diff.hazard && state.hazardTimer <= 0) {
      spawnHazard();
      state.hazardTimer = random(diff.hazardMin, diff.hazardMax);
    }

    for (const entity of state.entities) {
      const slowFactor = entity.type === "hazard" && state.slowTime > 0 ? 0.56 : 1;
      entity.x -= (state.speed + entity.speedOffset) * slowFactor * dt;
      entity.anim += dt;
      entity.trailTimer -= dt;
      if (entity.trailTimer <= 0 && entity.x > -40 && entity.x < state.width + 120) {
        emitEntityTrail(entity);
        entity.trailTimer = entity.type === "hazard" ? 0.1 : entity.type === "bonus" ? 0.07 : entity.required ? 0.12 : 0.18;
      }
      if (entity.required && !entity.done && entity.x + entity.w < player.x - 46) {
        skipRequired(entity);
      }
    }

    for (const entity of state.entities) {
      if (!entity.done && entity.lane === player.lane && overlap(playerRect(), entityRect(entity))) {
        handleCollision(entity);
      }
    }

    state.entities = state.entities.filter((entity) => entity.x + entity.w > -80 && !entity.remove);

    for (const burst of state.bursts) {
      burst.life -= dt;
      burst.angle += burst.spin * dt;
    }
    state.bursts = state.bursts.filter((burst) => burst.life > 0);

    for (const particle of state.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += particle.gravity * dt;
      particle.life -= dt;
    }
    state.particles = state.particles.filter((particle) => particle.life > 0);

    for (const text of state.floats) {
      text.y += text.vy * dt;
      text.life -= dt;
    }
    state.floats = state.floats.filter((text) => text.life > 0);

    for (const pack of state.packages) {
      pack.x -= state.speed * 0.55 * dt;
      pack.bob += dt;
    }
    state.packages = state.packages.filter((pack) => pack.x > -80);

    updateHud();
  }

  function currentStep() {
    return state.order?.steps[state.stepIndex] || null;
  }

  function spawnRequired() {
    const step = currentStep();
    if (!step) return;
    spawnEntity({
      type: step.mode === "work" ? "station" : "item",
      key: step.key,
      required: true,
      lane: chooseTargetLane(),
      label: step.label,
    });
  }

  function chooseTargetLane() {
    const diff = getDifficulty();
    if (state.magnetTime > 0) return player.lane;
    if (state.completedOrders === 0 || Math.random() < diff.sameLane) return player.lane;
    return clamp(player.lane + (Math.random() < 0.5 ? -1 : 1), 0, 2);
  }

  function spawnDecoy() {
    const step = currentStep();
    const diff = getDifficulty();
    const keys = Object.keys(TYPES).filter((key) => key !== step?.key && (state.level >= 4 || !STATION_KEYS.includes(key)));
    const key = keys[randomInt(0, keys.length - 1)];
    const asStation = STATION_KEYS.includes(key);
    if (Math.random() < diff.bonusChance) {
      const bonus = BONUS[randomInt(0, BONUS.length - 1)];
      spawnEntity({ type: "bonus", key: bonus.key, lane: randomInt(0, 2), bonus });
    } else {
      spawnEntity({ type: asStation ? "station" : "item", key, lane: randomInt(0, 2), required: false });
    }
  }

  function spawnHazard() {
    if (!activeOpeningMode() && state.completedOrders === 0 && state.stepIndex < 2) return;
    const diff = getDifficulty();
    const hazard = HAZARDS[randomInt(0, HAZARDS.length - 1)];
    const lane = Math.random() < diff.hazardTarget ? player.lane : randomInt(0, 2);
    spawnEntity({ type: "hazard", key: hazard.key, lane, hazard });
  }

  function spawnEntity(options) {
    const def = TYPES[options.key] || options.hazard || options.bonus;
    const station = options.type === "station";
    const w = station ? 104 : options.type === "hazard" ? 74 : 68;
    const h = station ? 86 : options.type === "hazard" ? 66 : 64;
    state.entities.push({
      id: entityId++,
      type: options.type,
      key: options.key,
      required: Boolean(options.required),
      done: false,
      remove: false,
      x: state.width + random(20, 120),
      lane: options.lane,
      y: state.lanes[options.lane],
      w,
      h,
      label: options.label || def.label,
      short: def.short,
      color: def.color,
      bg: def.bg || "#fff4dc",
      speedOffset: random(-12, 28),
      anim: random(0, 2),
      trailTimer: random(0.04, 0.16),
      hazard: options.hazard,
      bonus: options.bonus,
      pulse: 0,
    });
  }

  function handleCollision(entity) {
    if (entity.type === "hazard") {
      entity.done = true;
      entity.remove = true;
      registerMistake(`${entity.label}混進來了`);
      return;
    }

    if (entity.type === "bonus") {
      entity.done = true;
      entity.remove = true;
      collectBonus(entity);
      return;
    }

    const step = currentStep();
    const match = step && entity.key === step.key && ((step.mode === "work") === (entity.type === "station"));

    if (entity.type === "station") {
      if (player.actionTimer <= 0) return;
      if (match) {
        entity.done = true;
        entity.remove = true;
        completeStep(entity);
      } else {
        dismissNeutral(entity);
      }
      return;
    }

    if (match) {
      entity.done = true;
      entity.remove = true;
      completeStep(entity);
    } else {
      dismissNeutral(entity);
    }
  }

  function dismissNeutral(entity) {
    entity.done = true;
    entity.required = false;
  }

  function skipRequired(entity) {
    entity.done = true;
    entity.required = false;
    state.requiredTimer = Math.min(state.requiredTimer, 0.45);
  }

  function completeStep(entity) {
    const step = currentStep();
    const def = TYPES[step.key];
    const quality = getHitQuality(entity);
    const fever = state.feverTime > 0;
    applyHitQuality(entity, quality);
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    handleComboPrize();
    const points = Math.round((step.points + state.combo * 30 + state.level * 20) * quality.mult * state.multiplier * (fever ? 2.2 : 1));
    state.score += points;
    state.fever = clamp(state.fever + 10 + Math.min(14, state.combo * 0.45), 0, 100);
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 0.7);
    state.carry = step.mode === "collect" ? def.hold || def.label : def.stage || def.label;
    applyElementFeature(step, def, entity, quality);
    state.stepIndex += 1;
    state.shake = 0.34;
    emitPop(entity.x + entity.w / 2, entity.y - 28, def.color, 18);
    if (quality.grade !== "perfect") emitRingBurst(entity.x + entity.w / 2, entity.y - 34, def.color, 1, 20);
    floatText(`+${formatNumber(points)}`, entity.x + entity.w / 2, entity.y - 70, def.color);
    beep(520 + Math.min(620, state.combo * 22), 0.045, "square", 0.035);
    updateMissionOnStep(quality, step);

    if (state.combo > 0 && state.combo % 6 === 0) {
      const chainBonus = 420 + state.level * 55 + state.combo * 12;
      state.score += chainBonus;
      state.fever = clamp(state.fever + 8, 0, 100);
      state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 1.1);
      floatText("純淨連線！", player.x + 64, player.y - 112, COLORS.aquaDeep);
      floatText(`+${formatNumber(chainBonus)}`, player.x + 64, player.y - 88, COLORS.leaf);
      emitPop(player.x + 60, player.y - 36, COLORS.aquaDeep, 14);
      emitRingBurst(player.x + 60, player.y - 42, COLORS.aquaDeep, 2, 28);
    }

    if (state.fever >= 100 && state.feverTime <= 0) activateFever();

    if (state.stepIndex >= state.order.steps.length) {
      completeOrder();
    } else {
      state.requiredTimer = Math.min(state.requiredTimer, quality.grade === "perfect" ? 0.1 : quality.grade === "good" ? 0.18 : 0.32);
      renderRecipe();
    }
  }

  function applyElementFeature(step, def, entity, quality) {
    const perfect = quality.grade === "perfect";
    let points = 0;
    let time = 0;
    let purity = 0;
    let fever = 0;
    let text = def.effect;

    if (step.key === "milk") {
      purity = perfect ? 3 : 2;
      text = "鮮乳純淨";
    } else if (step.key === "culture") {
      state.magnetTime = Math.max(state.magnetTime, perfect ? 3.8 : 2.4);
      fever = perfect ? 5 : 3;
      text = "益菌牽引";
    } else if (step.key === "protein") {
      points = 220 + state.level * 18;
      text = "高蛋白加分";
    } else if (step.key === "calcium") {
      state.slowTime = Math.max(state.slowTime, perfect ? 2.6 : 1.7);
      purity = 1;
      text = "鈣力慢拍";
    } else if (step.key === "fruit") {
      fever = perfect ? 8 : 5;
      text = "果香能量";
    } else if (step.key === "honey") {
      time = perfect ? 0.9 : 0.55;
      points = 120;
      text = "自然回甘";
    } else if (step.key === "mix") {
      state.requiredTimer = Math.min(state.requiredTimer, 0.2);
      text = "滑順接續";
    } else if (step.key === "ferment") {
      purity = perfect ? 3 : 1;
      fever = 4;
      text = "低溫熟成";
    } else if (step.key === "strain") {
      points = 260 + state.level * 16;
      text = "濾出綿密";
    } else if (step.key === "qc") {
      purity = perfect ? 4 : 2;
      if (perfect) state.shield = Math.min(3, state.shield + 1);
      text = perfect ? "品檢補盾" : "純淨把關";
    } else if (step.key === "texture") {
      fever = 5;
      if (perfect) {
        state.combo += 1;
        state.maxCombo = Math.max(state.maxCombo, state.combo);
        text = "口感連線+1";
      } else {
        text = "口感滑順";
      }
    } else if (step.key === "pack") {
      points = 180 + state.level * 12;
      text = "精品封杯";
    } else if (step.key === "ship") {
      time = perfect ? 1.0 : 0.65;
      text = "冷鏈保鮮";
    }

    if (points > 0) state.score += Math.round(points * state.multiplier);
    if (time > 0) state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + time);
    if (purity > 0) state.purity = clamp(state.purity + purity, 0, 100);
    if (fever > 0) state.fever = clamp(state.fever + fever, 0, 100);

    markBrandFeature(step.key, def, entity, text);
    if (text) {
      floatText(text, entity.x + entity.w / 2, entity.y - 122, def.color);
      emitFeatureSpark(entity.x + entity.w / 2, entity.y - 42, def.color, perfect ? 10 : 6);
      emitBadgeBurst(entity.x + entity.w / 2, entity.y - 52, def.color, def.short);
    }
    handleComboPrize();
  }

  function markBrandFeature(key, def, entity, text) {
    if (state.batchFeatureKeys[key]) return;
    state.batchFeatureKeys[key] = true;
    state.brandHeat += 1;
    bumpMission("brandFeatures");
    if (state.brandHeat > 0 && state.brandHeat % 5 === 0) {
      const bonus = 520 + state.brandHeat * 70;
      state.score += bonus;
      state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 1.2);
      state.fever = clamp(state.fever + 9, 0, 100);
      floatText("品牌熱度！", player.x + 72, player.y - 148, COLORS.purple);
      floatText(`+${formatNumber(bonus)}`, player.x + 72, player.y - 122, COLORS.leaf);
      emitRingBurst(player.x + 58, player.y - 46, COLORS.purple, 3, 32);
      emitFeatureSpark(player.x + 58, player.y - 42, COLORS.purple, 18);
    } else if (text) {
      floatText("品牌亮點 +1", entity.x + entity.w / 2, entity.y - 146, COLORS.purple);
    }
  }

  function completeOrder() {
    const order = state.order;
    const diff = getDifficulty();
    const modifier = state.modifier || MODIFIERS[0];
    const perfect = state.batchMistakes === 0;
    updateMissionOnOrder(perfect);
    const bonus = Math.round(800 + state.combo * 42 + state.timeRemaining * 18 + state.level * 80 + modifier.reward + (perfect ? 700 + state.level * 60 : 0));
    state.score += bonus;
    state.completedOrders += 1;
    state.level += 1;
    state.combo += 3;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    handleComboPrize();
    state.purity = clamp(state.purity + (perfect ? 6 : 3), 0, 100);
    state.fever = clamp(state.fever + (perfect ? 12 : 4), 0, 100);
    state.timeRemaining = Math.min(diff.timeCap, state.timeRemaining + diff.orderTime);
    state.carry = "空手";
    state.packages.push({ x: player.x + 70, y: player.y - 20, color: order.color, bob: 0 });
    showToast(`${modifier.label} ${perfect ? "精品出貨" : "完成出貨"}：${order.name} +${formatNumber(bonus)}`);
    floatText(perfect ? "精品出貨！" : "出貨！", player.x + 90, player.y - 92, order.color);
    if (state.level === 3 || state.level === 5 || state.level === 8 || state.level === 11 || state.level === 16) {
      floatText(getDifficulty().name, player.x + 96, player.y - 122, COLORS.berry);
    }
    emitPop(player.x + 70, player.y - 38, order.color, 30);
    emitRingBurst(player.x + 70, player.y - 48, order.color, perfect ? 4 : 3, 34);
    emitLaneFlash(player.lane, order.color);
    beep(820, 0.08, "triangle", 0.04);
    if (state.fever >= 100 && state.feverTime <= 0) activateFever();
    spawnOrder(false);
  }

  function collectBonus(entity) {
    const bonus = entity.bonus;
    let text = "";
    let value = Math.round((180 + state.combo * 12) * state.multiplier);
    if (bonus.key === "cleanBoost") {
      state.shield = Math.min(3, state.shield + 1);
      state.purity = clamp(state.purity + 6, 0, 100);
      value = 220;
      text = `純淨盾x${state.shield}`;
    } else if (bonus.key === "probioticBoost") {
      state.magnetTime = Math.max(state.magnetTime, 6.5);
      state.requiredTimer = Math.min(state.requiredTimer, 0.16);
      text = "益菌磁吸";
    } else if (bonus.key === "calciumBoost") {
      state.slowTime = Math.max(state.slowTime, 5.5);
      state.purity = clamp(state.purity + 3, 0, 100);
      text = "鈣力慢拍";
    }
    state.score += value;
    state.fever = clamp(state.fever + 11, 0, 100);
    state.combo += 1;
    state.batchBonuses += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    bumpMission("bonuses");
    handleComboPrize();
    emitPop(entity.x, entity.y - 20, bonus.color, 12);
    emitRingBurst(entity.x + entity.w / 2, entity.y - 34, bonus.color, 2, 28);
    emitLaneFlash(entity.lane, bonus.color);
    floatText(text || `+${value}`, entity.x, entity.y - 64, bonus.color);
    floatText(`+${value}`, entity.x, entity.y - 88, COLORS.leaf);
    beep(700, 0.04, "triangle", 0.03);
  }

  function handleComboPrize() {
    const milestone = Math.floor(state.combo / 10) * 10;
    if (milestone < 10 || milestone === state.lastComboPrize) return;
    state.lastComboPrize = milestone;
    const prize = milestone * 90 + state.level * 120;
    state.score += prize;
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 1.4);
    state.fever = clamp(state.fever + 10, 0, 100);
    if (milestone % 20 === 0) state.shield = Math.min(3, state.shield + 1);
    floatText(`${milestone}連線！`, player.x + 62, player.y - 136, COLORS.berry);
    floatText(`+${formatNumber(prize)}`, player.x + 62, player.y - 112, COLORS.leaf);
    emitPop(player.x + 56, player.y - 42, COLORS.yellow, 24);
    emitRingBurst(player.x + 56, player.y - 48, COLORS.yellow, 3, 34);
    emitLaneFlash(player.lane, COLORS.yellow);
    beep(880 + Math.min(420, milestone * 4), 0.07, "square", 0.035);
  }

  function registerMistake(reason) {
    if (player.invuln > 0 || state.feverTime > 0) {
      floatText("擋下", player.x + 22, player.y - 88, COLORS.leaf);
      return;
    }
    if (state.shield > 0) {
      state.shield -= 1;
      player.invuln = 0.65;
      state.fever = clamp(state.fever + 6, 0, 100);
      state.batchShieldBlocks += 1;
      bumpMission("shieldBlocks");
      showToast(`純淨盾擋下${reason}`);
      floatText("純淨盾！", player.x + 28, player.y - 92, COLORS.leaf);
      emitPop(player.x + 18, player.y - 34, COLORS.leaf, 20);
      emitRingBurst(player.x + 18, player.y - 42, COLORS.leaf, 3, 30);
      emitLaneFlash(player.lane, COLORS.leaf);
      beep(620, 0.06, "square", 0.03);
      return;
    }
    const diff = getDifficulty();
    state.missed += 1;
    state.batchMistakes += 1;
    state.combo = 0;
    state.precisionStreak = 0;
    state.multiplier = 1;
    state.lastComboPrize = 0;
    state.purity = clamp(state.purity - diff.missPurity, 0, 100);
    state.timeRemaining = Math.max(0, state.timeRemaining - diff.missTime);
    state.fever = Math.max(0, state.fever - 8);
    state.shake = 0.65;
    player.invuln = 0.7;
    showToast(reason);
    floatText("純淨-", player.x + 22, player.y - 86, COLORS.berry);
    emitPop(player.x + 20, player.y - 30, COLORS.berry, 16);
    beep(150, 0.08, "sawtooth", 0.035);
    if (state.purity <= 0) endGame("純淨率歸零");
  }

  function activateFever() {
    state.feverTime = 7.2;
    state.fever = 100;
    state.shake = 0.8;
    state.batchPureRushes += 1;
    bumpMission("pureRushes");
    showToast("純淨能量滿格：PURE RUSH！");
    floatText("PURE!", player.x + 54, player.y - 110, COLORS.orange);
    emitRingBurst(player.x + 40, player.y - 46, COLORS.orange, 4, 38);
    emitLaneFlash(player.lane, COLORS.orange);
    beep(940, 0.12, "square", 0.04);
  }

  function triggerAction() {
    if (state.phase !== "playing") return;
    ensureAudio();
    controls.action = true;
    player.actionTimer = 0.22;
    state.shake = Math.max(state.shake, 0.12);
    window.setTimeout(() => {
      controls.action = false;
    }, 90);
  }

  function processLaneControls(dt) {
    const dir = (controls.down ? 1 : 0) - (controls.up ? 1 : 0);
    if (dir === 0) {
      player.laneRepeat = 0;
      return;
    }
    player.laneRepeat -= dt;
    if (player.laneRepeat <= 0) {
      changeLane(dir);
      player.laneRepeat = 0.14;
    }
  }

  function changeLane(delta) {
    if (state.phase !== "playing") return;
    const nextLane = clamp(player.lane + delta, 0, 2);
    if (nextLane === player.lane) return;
    player.lane = nextLane;
    player.targetLane = player.lane;
    state.batchLaneChanges += 1;
    bumpMission("laneChanges");
    beep(440 + player.lane * 80, 0.025, "square", 0.018);
  }

  function handleKeyDown(event) {
    if (document.activeElement === dom.nameInput) {
      if (event.key === "Enter") startGame();
      return;
    }
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") controls.left = true;
    if (key === "arrowright" || key === "d") controls.right = true;
    if (key === "arrowup" || key === "w") {
      event.preventDefault();
      controls.up = true;
      if (!event.repeat) {
        changeLane(-1);
        player.laneRepeat = 0.16;
      }
    }
    if (key === "arrowdown" || key === "s") {
      event.preventDefault();
      controls.down = true;
      if (!event.repeat) {
        changeLane(1);
        player.laneRepeat = 0.16;
      }
    }
    if (key === " " || key === "e") {
      event.preventDefault();
      if (!event.repeat) triggerAction();
    }
  }

  function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") controls.left = false;
    if (key === "arrowright" || key === "d") controls.right = false;
    if (key === "arrowup" || key === "w") controls.up = false;
    if (key === "arrowdown" || key === "s") controls.down = false;
  }

  function draw() {
    const shakeX = state.shake ? random(-state.shake * 8, state.shake * 8) : 0;
    const shakeY = state.shake ? random(-state.shake * 5, state.shake * 5) : 0;
    ctx.save();
    ctx.translate(Math.round(shakeX), Math.round(shakeY));
    drawBackground();
    drawHitZone();
    const sorted = [...state.entities].sort((a, b) => a.y - b.y);
    for (const entity of sorted) drawEntity(entity);
    for (const pack of state.packages) drawPackage(pack);
    drawPlayer();
    drawActiveEffects();
    for (const burst of state.bursts) drawBurst(burst);
    for (const particle of state.particles) drawParticle(particle);
    for (const text of state.floats) drawFloat(text);
    if (state.feverTime > 0) drawFeverOverlay();
    ctx.restore();
  }

  function drawBackground() {
    const w = state.width;
    const h = state.height;
    const t = state.time;
    fillRect(0, 0, w, h, "#9bdcf0");
    fillRect(0, 0, w, h * 0.34, "#bfeef8");

    for (let i = 0; i < 7; i += 1) {
      const x = ((i * 260 - t * 24) % (w + 300)) - 180;
      drawCloud(x, 72 + (i % 3) * 42);
    }

    const wallTop = Math.max(100, h * 0.14);
    fillRect(0, wallTop, w, h * 0.34, "#e8fbff");
    for (let x = -60 - (t * 28) % 64; x < w + 80; x += 64) {
      fillRect(x, wallTop, 4, h * 0.34, "rgba(38,138,161,.12)");
    }
    for (let y = wallTop; y < wallTop + h * 0.34; y += 42) {
      fillRect(0, y, w, 4, "rgba(38,138,161,.10)");
    }

    drawPixelSign(w * 0.5 - ((t * 34) % 460), wallTop + 34, "純淨製程", COLORS.aquaDeep, 112);
    drawPixelSign(w * 0.82 - ((t * 34) % 560), wallTop + 84, "精品優格", COLORS.berry, 128);
    drawPixelSign(w * 0.28 - ((t * 30) % 620), wallTop + 126, "UGOODAYS", COLORS.leaf, 112);

    const floorY = state.lanes[0] - 78;
    fillRect(0, floorY, w, h - floorY, "#fff4dc");
    for (let x = -80 - (t * state.speed * 0.22) % 80; x < w + 80; x += 80) {
      fillRect(x, floorY, 4, h - floorY, "rgba(36,50,58,.08)");
    }
    for (let y = floorY; y < h + 80; y += 54) {
      fillRect(0, y, w, 4, "rgba(36,50,58,.06)");
    }

    for (let i = 0; i < state.lanes.length; i += 1) {
      const y = state.lanes[i] + 8;
      fillRect(0, y, w, 6, i === player.lane ? "rgba(38,138,161,.32)" : "rgba(36,50,58,.12)");
      for (let x = -40 - (t * state.speed * 0.5) % 92; x < w + 90; x += 92) {
        fillRect(x, y - 11, 46, 6, "rgba(255,255,255,.58)");
      }
    }

    drawConveyor(w, h, t);
  }

  function drawConveyor(w, h, t) {
    const y = h - (state.width < 520 ? 74 : 44);
    fillRect(0, y, w, 34, "#334852");
    fillRect(0, y, w, 5, "#8fcfe0");
    for (let x = -80 - (t * state.speed * 0.85) % 72; x < w + 80; x += 72) {
      fillRect(x, y + 7, 34, 20, "#d7edf4");
    }
  }

  function drawHitZone() {
    if (state.phase !== "playing") return;
    const x = Math.round(player.x);
    const y = state.lanes[player.lane];
    const pulse = 0.55 + Math.sin(state.time * 9) * 0.22;
    fillRect(x - 24, y - 96, 48, 124, `rgba(180,73,102,${0.08 + pulse * 0.04})`);
    strokeRect(x - 24, y - 96, 48, 124, "rgba(180,73,102,.46)", 3);
    fillRect(x - 4, y - 102, 8, 134, "rgba(38,138,161,.55)");
    drawText("甜點區", x, y - 118, state.width < 520 ? 13 : 15, COLORS.berry, "center");
    if (state.multiplier > 1) {
      drawText(`x${state.multiplier.toFixed(1)}`, x, y + 43, 18, COLORS.aquaDeep, "center");
    }
  }

  function drawEntity(entity) {
    if (entity.type === "station") drawStation(entity);
    else if (entity.type === "hazard") drawHazard(entity);
    else drawItem(entity);
  }

  function drawItem(entity) {
    const x = Math.round(entity.x);
    const y = Math.round(entity.y - 76 + Math.sin(entity.anim * 7) * 5);
    const color = entity.color;
    drawPixelShadow(x + 10, entity.y - 10, entity.w + 8);
    if (entity.type === "bonus") {
      drawBonusAura(entity, x + 34, y + 34, color);
      drawPixelStar(x + 34, y + 34, color);
    } else {
      drawIngredientIcon(entity.key, x, y, entity.required);
    }
    if (entity.required || entity.type === "bonus") drawFeatureChip(entity, x + entity.w / 2, y - 24);
    if (entity.required || entity.type === "bonus") drawEntityLabel(entity, x + entity.w / 2, y + 76);
  }

  function drawIngredientIcon(key, x, y, required) {
    const def = TYPES[key];
    if (required) drawBlinkFrame(x - 7, y - 8, 82, 82, def.color);
    fillRect(x + 4, y + 8, 60, 56, "#ffffff");
    fillRect(x + 4, y + 8, 60, 10, def.color);
    strokeRect(x + 4, y + 8, 60, 56, COLORS.ink, 4);
    if (key === "milk") {
      fillRect(x + 16, y + 22, 34, 32, "#dff6ff");
      fillRect(x + 21, y + 14, 24, 10, "#ffffff");
      strokeRect(x + 16, y + 22, 34, 32, COLORS.aquaDeep, 3);
      drawText("奶", x + 34, y + 43, 25, COLORS.aquaDeep, "center");
    } else if (key === "culture") {
      fillRect(x + 14, y + 49, 40, 8, "#caeef6");
      strokeRect(x + 14, y + 49, 40, 8, COLORS.ink, 2);
      for (let i = 0; i < 4; i += 1) {
        fillRect(x + 17 + i * 10, y + 24 + (i % 2) * 4, 7, 25, i % 2 ? COLORS.yellow : COLORS.aquaDeep);
        strokeRect(x + 17 + i * 10, y + 24 + (i % 2) * 4, 7, 25, COLORS.ink, 2);
      }
      drawText("菌", x + 34, y + 20, 18, COLORS.aquaDeep, "center");
    } else if (key === "protein") {
      fillRect(x + 13, y + 24, 42, 34, "#ffe0cc");
      fillRect(x + 18, y + 18, 32, 12, COLORS.orange);
      strokeRect(x + 13, y + 24, 42, 34, COLORS.ink, 3);
      drawText("蛋", x + 34, y + 43, 25, COLORS.orange, "center");
    } else if (key === "calcium") {
      fillRect(x + 15, y + 31, 38, 18, "#dceffc");
      fillRect(x + 10, y + 25, 14, 14, "#dceffc");
      fillRect(x + 44, y + 25, 14, 14, "#dceffc");
      fillRect(x + 10, y + 43, 14, 14, "#dceffc");
      fillRect(x + 44, y + 43, 14, 14, "#dceffc");
      strokeRect(x + 15, y + 31, 38, 18, "#4b91b6", 3);
      drawText("Ca", x + 34, y + 42, 20, "#4b91b6", "center");
    } else if (key === "fruit") {
      fillRect(x + 15, y + 35, 18, 18, COLORS.berry);
      fillRect(x + 35, y + 37, 18, 18, COLORS.orange);
      fillRect(x + 25, y + 22, 17, 17, COLORS.leaf);
      strokeRect(x + 15, y + 35, 18, 18, COLORS.ink, 2);
      strokeRect(x + 35, y + 37, 18, 18, COLORS.ink, 2);
      drawText("果", x + 34, y + 20, 18, COLORS.berry, "center");
    } else if (key === "honey") {
      fillRect(x + 17, y + 25, 34, 34, COLORS.yellow);
      fillRect(x + 22, y + 18, 24, 10, "#fff8c6");
      fillRect(x + 26, y + 34, 16, 10, "#fff8c6");
      strokeRect(x + 17, y + 25, 34, 34, COLORS.ink, 3);
      drawText("蜜", x + 34, y + 45, 22, "#7a5123", "center");
    } else {
      drawText(def.short, x + 34, y + 43, 25, def.color, "center");
    }
    if (required) drawText("接", x + 34, y - 14, 17, COLORS.leaf, "center");
  }

  function drawStation(entity) {
    const x = Math.round(entity.x);
    const y = Math.round(entity.y - 88);
    const def = TYPES[entity.key];
    drawPixelShadow(x + 16, entity.y - 12, entity.w + 20);
    if (entity.required) drawBlinkFrame(x - 8, y - 12, 120, 104, def.color);
    fillRect(x, y + 28, 104, 58, def.bg);
    fillRect(x + 8, y + 15, 88, 20, "#ffffff");
    fillRect(x + 14, y + 8, 76, 10, def.color);
    strokeRect(x, y + 28, 104, 58, COLORS.ink, 4);
    strokeRect(x + 8, y + 15, 88, 20, COLORS.ink, 3);

    if (entity.key === "mix" || entity.key === "texture") {
      fillRect(x + 30, y + 38, 44, 32, "#fff9ef");
      strokeRect(x + 30, y + 38, 44, 32, COLORS.ink, 3);
      fillRect(x + 47, y + 22, 10, 22, COLORS.ink);
      drawWhirl(x + 52, y + 54, entity.anim, def.color);
    } else if (entity.key === "ferment") {
      fillRect(x + 32, y + 30, 40, 46, "#dff6ff");
      fillRect(x + 38, y + 22, 28, 10, COLORS.leaf);
      strokeRect(x + 32, y + 30, 40, 46, COLORS.ink, 3);
      for (let i = 0; i < 5; i += 1) fillRect(x + 40 + i * 6, y + 64 - ((entity.anim * 18 + i * 8) % 28), 5, 5, def.color);
    } else if (entity.key === "strain") {
      fillRect(x + 25, y + 34, 54, 12, "#fff9ef");
      fillRect(x + 34, y + 46, 36, 30, "#f4e0cf");
      strokeRect(x + 25, y + 34, 54, 12, COLORS.ink, 3);
      strokeRect(x + 34, y + 46, 36, 30, COLORS.ink, 2);
      for (let i = 0; i < 4; i += 1) fillRect(x + 39 + i * 8, y + 55 + ((entity.anim * 14 + i * 5) % 14), 4, 11, "#fff");
    } else if (entity.key === "qc") {
      fillRect(x + 22, y + 34, 60, 36, "#fff");
      strokeRect(x + 22, y + 34, 60, 36, COLORS.ink, 3);
      fillRect(x + 26 + ((entity.anim * 30) % 48), y + 34, 6, 36, def.color);
      drawText("OK", x + 52, y + 55, 17, def.color, "center");
    } else if (entity.key === "pack") {
      fillRect(x + 30, y + 43, 44, 25, "#ffffff");
      fillRect(x + 36, y + 48, 32, 9, def.color);
      fillRect(x + 25, y + 29, 54, 12, COLORS.purple);
      strokeRect(x + 30, y + 43, 44, 25, COLORS.ink, 3);
    } else if (entity.key === "ship") {
      fillRect(x + 20, y + 46, 62, 24, "#dceffc");
      fillRect(x + 28, y + 32, 42, 16, "#ffffff");
      fillRect(x + 72, y + 54, 16, 16, "#4b91b6");
      strokeRect(x + 20, y + 46, 62, 24, COLORS.ink, 3);
      fillRect(x + 28, y + 72, 12, 12, COLORS.ink);
      fillRect(x + 62, y + 72, 12, 12, COLORS.ink);
    }

    drawText(def.short, x + 52, y + 7, 20, def.color, "center");
    if (entity.required) {
      drawText("按做", x + 52, y - 15, 17, COLORS.berry, "center");
      drawFeatureChip(entity, x + 52, y - 38);
    }
    if (entity.required) drawEntityLabel(entity, x + 52, y + 101);
  }

  function drawHazard(entity) {
    const x = Math.round(entity.x);
    const y = Math.round(entity.y - 72 + Math.sin(entity.anim * 8) * 4);
    drawHazardAlert(entity, x, y);
    drawPixelShadow(x + 10, entity.y - 9, entity.w + 10);
    fillRect(x + 5, y + 9, 62, 54, "#fff0f3");
    strokeRect(x + 5, y + 9, 62, 54, entity.color, 6);
    fillRect(x + 17, y + 18, 38, 7, entity.color);
    fillRect(x + 17, y + 48, 38, 7, entity.color);
    drawText("!", x + 36, y + 38, 30, entity.color, "center");
    drawText(entity.short, x + 36, y + 74, 15, entity.color, "center");
    fillRect(x - 1, y + 2, 12, 12, entity.color);
    fillRect(x + 61, y + 2, 12, 12, entity.color);
    fillRect(x - 1, y + 58, 12, 12, entity.color);
    fillRect(x + 61, y + 58, 12, 12, entity.color);
    drawFeatureChip(entity, x + 36, y - 7);
    drawEntityLabel(entity, x + 36, y + 88);
  }

  function drawFeatureChip(entity, cx, y) {
    const def = entity.bonus || entity.hazard || TYPES[entity.key];
    if (!def?.effect) return;
    const text = def.effect;
    const compact = state.width < 520;
    const width = clamp(text.length * (compact ? 10 : 13) + (compact ? 14 : 18), 46, compact ? 84 : 112);
    const height = compact ? 18 : 22;
    const pulse = entity.required || entity.type === "bonus" ? Math.sin(entity.anim * 7) * 0.08 : 0;
    ctx.save();
    ctx.globalAlpha = 0.82 + pulse;
    fillRect(cx - width / 2, y - height / 2, width, height, "rgba(255,255,255,.88)");
    strokeRect(cx - width / 2, y - height / 2, width, height, def.color, 2);
    drawText(text, cx, y + 1, compact ? 10 : 11, def.color, "center");
    ctx.restore();
  }

  function drawBonusAura(entity, cx, cy, color) {
    const pulse = 0.5 + Math.sin(entity.anim * 8) * 0.5;
    ctx.save();
    ctx.globalAlpha = 0.18 + pulse * 0.2;
    strokeRect(cx - 32 - pulse * 5, cy - 32 - pulse * 5, 64 + pulse * 10, 64 + pulse * 10, color, 3);
    ctx.globalAlpha = 0.72;
    for (let i = 0; i < 6; i += 1) {
      const a = entity.anim * 3 + i * Math.PI / 3;
      fillRect(cx + Math.cos(a) * 38 - 3, cy + Math.sin(a) * 29 - 3, 6, 6, i % 2 ? "#ffffff" : color);
    }
    ctx.restore();
  }

  function drawHazardAlert(entity, x, y) {
    const close = entity.lane === player.lane && entity.x > player.x + 8 && entity.x - player.x < Math.min(420, state.width * 0.62);
    if (state.phase !== "playing" || !close) return;
    const pulse = 0.5 + Math.sin(state.time * 20) * 0.3;
    ctx.save();
    ctx.globalAlpha = 0.35 + pulse * 0.35;
    strokeRect(x - 8, y + 1, 88, 76, entity.color, 4);
    for (let i = 0; i < 3; i += 1) {
      const tx = x - 24 - i * 18;
      fillRect(tx, y + 29, 9, 9, entity.color);
      fillRect(tx + 6, y + 38, 9, 9, entity.color);
      fillRect(tx, y + 47, 9, 9, entity.color);
    }
    ctx.restore();
  }

  function drawEntityLabel(entity, cx, y) {
    fillRect(cx - 30, y - 12, 60, 20, "rgba(255,255,255,.86)");
    drawText(entity.label, cx, y + 3, 12, COLORS.ink, "center");
  }

  function drawPlayer() {
    const x = Math.round(player.x);
    const y = Math.round(player.y - 76 + Math.sin(player.stepBob) * 3);
    const flash = player.invuln > 0 && Math.floor(state.time * 16) % 2 === 0;
    if (flash) return;
    const work = player.actionTimer > 0;
    const armLift = work ? -13 : Math.sin(player.stepBob) * 3;
    const hair = "#342529";
    const hairLight = "#5a3f45";
    const skin = "#ffd9bd";
    const blush = "#f19aa0";
    const sweater = "#fff7ed";
    const sweaterShadow = "#eadfd3";
    const silver = "#d9e4ea";

    ctx.save();
    ctx.translate(x, y + 99);
    ctx.scale(0.86, 0.86);
    ctx.translate(-x, -(y + 99));

    drawPixelShadow(x - 2, player.y - 10, 68);

    // Oversized white knit sweater silhouette.
    fillRect(x - 23, y + 32, 46, 40, sweater);
    fillRect(x - 18, y + 69, 36, 8, sweaterShadow);
    strokeRect(x - 23, y + 32, 46, 40, COLORS.ink, 3);
    for (let i = 0; i < 4; i += 1) {
      fillRect(x - 18 + i * 11, y + 38, 4, 26, "rgba(213,199,186,.42)");
    }

    // Small UGOODAYS apron over the sweater.
    fillRect(x - 14, y + 43, 28, 26, COLORS.aqua);
    fillRect(x - 9, y + 51, 18, 8, "#dff6ff");
    drawText("UG", x, y + 58, 8, COLORS.aquaDeep, "center");

    fillRect(x - 12, y + 75, 10, 15, "#3e6676");
    fillRect(x + 6, y + 75, 10, 15, "#3e6676");
    fillRect(x - 16, y + 89, 18, 8, COLORS.ink);
    fillRect(x + 4, y + 89, 18, 8, COLORS.ink);

    // Rounded short bob, side part, and visible gold hair clip.
    fillRect(x - 22, y + 1, 44, 18, hair);
    fillRect(x - 26, y + 13, 13, 29, hair);
    fillRect(x + 12, y + 13, 13, 26, hair);
    fillRect(x - 17, y - 3, 24, 9, hairLight);
    fillRect(x - 9, y + 1, 18, 7, hair);
    fillRect(x - 20, y + 18, 7, 12, hairLight);
    fillRect(x + 13, y + 8, 17, 5, "#d6a845");
    fillRect(x + 18, y + 3, 5, 15, "#f2d37a");
    fillRect(x + 24, y + 7, 5, 8, "#f8e3a6");

    fillRect(x - 18, y + 14, 36, 28, skin);
    fillRect(x - 14, y + 41, 28, 5, "#f1c0aa");
    fillRect(x - 13, y + 22, 8, 8, "#ffffff");
    fillRect(x + 6, y + 22, 8, 8, "#ffffff");
    fillRect(x - 10, y + 24, 4, 5, COLORS.ink);
    fillRect(x + 9, y + 24, 4, 5, COLORS.ink);
    fillRect(x - 18, y + 31, 7, 4, blush);
    fillRect(x + 11, y + 31, 7, 4, blush);
    fillRect(x - 4, y + 34, 12, 4, COLORS.berry);
    fillRect(x + 3, y + 38, 7, 7, "#e66f82");
    fillRect(x + 5, y + 43, 4, 2, "#ffd1d7");

    // Left-handed tool arm: thick sweater sleeve, covered hand, and spoon.
    fillRect(x - 45, y + 43 + armLift, 24, 12, sweater);
    fillRect(x - 54, y + 38 + armLift, 16, 17, sweater);
    fillRect(x - 54, y + 51 + armLift, 12, 4, sweaterShadow);
    strokeRect(x - 45, y + 43 + armLift, 24, 12, COLORS.ink, 2);
    fillRect(x - 63, y + 40 + armLift, 22, 5, "#cbd8dd");
    fillRect(x - 72, y + 35 + armLift, 11, 11, "#e8f4f7");

    // Relaxed right hand with silver rings on index and ring fingers.
    const rightHandY = y + 45 - armLift * 0.3;
    fillRect(x + 19, rightHandY, 19, 10, sweater);
    fillRect(x + 34, rightHandY - 1, 15, 12, skin);
    fillRect(x + 35, rightHandY - 6, 5, 10, skin);
    fillRect(x + 43, rightHandY - 6, 5, 10, skin);
    fillRect(x + 35, rightHandY - 2, 5, 3, silver);
    fillRect(x + 43, rightHandY - 2, 5, 3, silver);
    fillRect(x + 36, rightHandY - 2, 3, 1, "#ffffff");
    fillRect(x + 44, rightHandY - 2, 3, 1, "#ffffff");

    if (work) {
      drawActionSlash(x - 76, y + 43 + armLift);
    }
    ctx.restore();
  }

  function drawActionSlash(x, y) {
    for (let i = 0; i < 4; i += 1) {
      fillRect(x - i * 8, y - i * 4, 32 - i * 4, 6, i % 2 ? COLORS.aqua : "#ffffff");
    }
  }

  function drawPackage(pack) {
    const x = Math.round(pack.x);
    const y = Math.round(pack.y + Math.sin(pack.bob * 5) * 4);
    fillRect(x, y, 44, 32, pack.color);
    fillRect(x + 7, y + 7, 30, 10, "#ffffff");
    strokeRect(x, y, 44, 32, COLORS.ink, 3);
  }

  function drawBurst(burst) {
    const alpha = Math.max(0, burst.life / burst.maxLife);
    const progress = 1 - alpha;
    ctx.save();
    if (burst.type === "lane") {
      ctx.globalAlpha = alpha * 0.2;
      fillRect(0, burst.y - 82, state.width, 118, burst.color);
      ctx.globalAlpha = alpha * 0.72;
      fillRect(0, burst.y - 16, state.width, 6, "#ffffff");
      fillRect(0, burst.y + 20, state.width, 4, burst.color);
    } else if (burst.type === "badge") {
      const y = burst.y - progress * 22;
      const size = burst.radius + progress * 14;
      ctx.globalAlpha = alpha * 0.86;
      fillRect(burst.x - size / 2, y - size / 2, size, size, "rgba(255,255,255,.88)");
      strokeRect(burst.x - size / 2, y - size / 2, size, size, burst.color, 3);
      drawText(burst.text, burst.x, y + 1, Math.max(12, size * 0.42), burst.color, "center");
    } else {
      const size = burst.radius + burst.grow * progress;
      ctx.globalAlpha = alpha * 0.9;
      strokeRect(burst.x - size / 2, burst.y - size / 2, size, size, burst.color, burst.thickness);
      ctx.globalAlpha = alpha * 0.62;
      const spin = burst.angle;
      for (let i = 0; i < 4; i += 1) {
        const a = spin + i * Math.PI * 0.5;
        fillRect(burst.x + Math.cos(a) * size * 0.42 - 4, burst.y + Math.sin(a) * size * 0.42 - 4, 8, 8, i % 2 ? "#ffffff" : burst.color);
      }
    }
    ctx.restore();
  }

  function drawParticle(particle) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.globalAlpha = alpha;
    fillRect(particle.x, particle.y, particle.size, particle.size, particle.color);
    ctx.globalAlpha = 1;
  }

  function drawFloat(text) {
    const alpha = Math.max(0, text.life / text.maxLife);
    ctx.globalAlpha = alpha;
    drawText(text.text, text.x, text.y, text.size, text.color, "center");
    ctx.globalAlpha = 1;
  }

  function drawFeverOverlay() {
    ctx.globalAlpha = 0.12 + Math.sin(state.time * 18) * 0.04;
    fillRect(0, 0, state.width, state.height, COLORS.orange);
    ctx.globalAlpha = 1;
    for (let x = -80 - (state.time * 380) % 120; x < state.width + 120; x += 120) {
      fillRect(x, 0, 38, state.height, "rgba(255,255,255,.18)");
    }
  }

  function drawActiveEffects() {
    if (state.phase !== "playing") return;
    const items = [];
    if (state.shield > 0) items.push({ text: `盾x${state.shield}`, color: COLORS.leaf });
    if (state.magnetTime > 0) items.push({ text: `磁${Math.ceil(state.magnetTime)}`, color: COLORS.aquaDeep });
    if (state.slowTime > 0) items.push({ text: `慢${Math.ceil(state.slowTime)}`, color: COLORS.purple });
    if (state.brandHeat > 0) items.push({ text: `熱${state.brandHeat}`, color: COLORS.yellow });
    if (!items.length) return;
    ctx.save();
    if (state.shield > 0) {
      ctx.globalAlpha = 0.32 + Math.sin(state.time * 10) * 0.12;
      strokeRect(player.x - 40, player.y - 95, 80, 108, COLORS.leaf, 4);
    }
    if (state.magnetTime > 0) {
      ctx.globalAlpha = 0.68;
      for (let i = 0; i < 5; i += 1) {
        const a = state.time * 4.2 + i * Math.PI * 0.4;
        fillRect(player.x + Math.cos(a) * 47 - 4, player.y - 48 + Math.sin(a) * 38 - 4, 8, 8, i % 2 ? "#ffffff" : COLORS.aquaDeep);
      }
    }
    if (state.slowTime > 0) {
      ctx.globalAlpha = 0.42 + Math.sin(state.time * 8) * 0.14;
      for (let i = 0; i < 3; i += 1) {
        fillRect(player.x - 48 + i * 32, player.y + 16 + i * 3, 18, 5, COLORS.purple);
      }
    }
    if (state.brandHeat > 0) {
      ctx.globalAlpha = 0.36 + Math.sin(state.time * 6) * 0.12;
      const orbit = 30 + Math.min(18, state.brandHeat * 1.6);
      for (let i = 0; i < Math.min(6, 2 + Math.floor(state.brandHeat / 3)); i += 1) {
        const a = state.time * 1.4 + i * Math.PI * 0.66;
        fillRect(player.x + Math.cos(a) * orbit - 4, player.y - 42 + Math.sin(a) * 28 - 4, 8, 8, i % 2 ? COLORS.yellow : COLORS.purple);
      }
    }
    ctx.restore();
    const startX = player.x - (items.length * 32) / 2 + 16;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const x = startX + i * 36;
      const y = player.y - 112;
      fillRect(x - 15, y - 11, 30, 22, "rgba(255,255,255,.86)");
      strokeRect(x - 15, y - 11, 30, 22, item.color, 2);
      drawText(item.text, x, y + 1, 11, item.color, "center");
    }
  }

  function drawCloud(x, y) {
    fillRect(x, y, 84, 22, "rgba(255,255,255,.75)");
    fillRect(x + 16, y - 14, 34, 24, "rgba(255,255,255,.85)");
    fillRect(x + 46, y - 8, 30, 18, "rgba(255,255,255,.8)");
  }

  function drawPixelSign(x, y, text, color, width) {
    fillRect(x, y, width, 34, "rgba(255,255,255,.75)");
    strokeRect(x, y, width, 34, color, 3);
    drawText(text, x + width / 2, y + 22, 14, color, "center");
  }

  function drawBlinkFrame(x, y, w, h, color) {
    const on = Math.floor(state.time * 8) % 2 === 0;
    strokeRect(x, y, w, h, on ? color : "#ffffff", 5);
  }

  function drawWhirl(x, y, anim, color) {
    for (let i = 0; i < 4; i += 1) {
      const a = anim * 7 + i * Math.PI * 0.5;
      fillRect(x + Math.cos(a) * 12 - 4, y + Math.sin(a) * 8 - 3, 8, 6, color);
    }
  }

  function drawPixelStar(x, y, color) {
    fillRect(x - 5, y - 22, 10, 44, color);
    fillRect(x - 22, y - 5, 44, 10, color);
    fillRect(x - 12, y - 12, 24, 24, "#ffffff");
    drawText("★", x, y + 6, 24, color, "center");
  }

  function drawPixelShadow(x, y, w) {
    fillRect(x - w / 2, y, w, 10, "rgba(36,50,58,.15)");
  }

  function emitPop(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      state.particles.push({
        x,
        y,
        vx: random(-130, 130),
        vy: random(-230, -60),
        gravity: random(180, 320),
        size: randomInt(4, 9),
        color: i % 4 === 0 ? "#ffffff" : color,
        life: random(0.34, 0.72),
        maxLife: 0.72,
      });
    }
    trimParticles();
  }

  function emitFeatureSpark(x, y, color, count) {
    for (let i = 0; i < count; i += 1) {
      state.particles.push({
        x: x + random(-18, 18),
        y: y + random(-10, 12),
        vx: random(-70, 70),
        vy: random(-120, -18),
        gravity: random(80, 150),
        size: randomInt(3, 7),
        color: i % 3 === 0 ? "#ffffff" : color,
        life: random(0.42, 0.86),
        maxLife: 0.86,
      });
    }
    trimParticles();
  }

  function emitEntityTrail(entity) {
    if (state.particles.length > 170) return;
    const def = entity.bonus || entity.hazard || TYPES[entity.key];
    const x = entity.x + entity.w * 0.25 + random(-6, 12);
    const y = entity.y - entity.h * 0.75 + random(-10, 18);
    const hazard = entity.type === "hazard";
    const bonus = entity.type === "bonus";
    const required = entity.required;
    if (!hazard && !bonus && !required) return;
    state.particles.push({
      x,
      y,
      vx: hazard ? random(-18, 18) : random(-48, -12),
      vy: hazard ? random(-42, -16) : random(-34, 18),
      gravity: hazard ? 18 : 30,
      size: bonus ? randomInt(4, 7) : hazard ? randomInt(5, 9) : randomInt(3, 6),
      color: hazard ? "rgba(180,73,102,.72)" : required && Math.random() < 0.45 ? "#ffffff" : def.color,
      life: hazard ? 0.58 : 0.48,
      maxLife: hazard ? 0.58 : 0.48,
    });
  }

  function trimParticles() {
    if (state.particles.length > 220) state.particles.splice(0, state.particles.length - 220);
  }

  function emitRingBurst(x, y, color, count = 1, radius = 24) {
    for (let i = 0; i < count; i += 1) {
      state.bursts.push({
        type: "ring",
        x,
        y,
        radius: radius + i * 11,
        grow: 42 + i * 15,
        thickness: Math.max(2, 5 - i),
        color,
        angle: random(0, Math.PI),
        spin: random(-2.8, 2.8),
        life: 0.42 + i * 0.05,
        maxLife: 0.42 + i * 0.05,
      });
    }
    trimBursts();
  }

  function emitBadgeBurst(x, y, color, text) {
    state.bursts.push({
      type: "badge",
      x,
      y,
      radius: 28,
      color,
      text,
      angle: 0,
      spin: 0,
      life: 0.48,
      maxLife: 0.48,
    });
    trimBursts();
  }

  function emitLaneFlash(lane, color) {
    const y = state.lanes[lane];
    if (!Number.isFinite(y)) return;
    state.bursts.push({
      type: "lane",
      y,
      color,
      angle: 0,
      spin: 0,
      life: 0.22,
      maxLife: 0.22,
    });
    trimBursts();
  }

  function trimBursts() {
    if (state.bursts.length > 90) state.bursts.splice(0, state.bursts.length - 90);
  }

  function floatText(text, x, y, color) {
    state.floats.push({
      text,
      x,
      y,
      vy: -64,
      size: text.length > 6 ? 18 : 24,
      color,
      life: 0.82,
      maxLife: 0.82,
    });
  }

  function playerRect() {
    return { x: player.x - 27, y: player.y - 78, w: 54, h: 80 };
  }

  function entityRect(entity) {
    return { x: entity.x - 4, y: entity.y - entity.h - 20, w: entity.w + 8, h: entity.h + 32 };
  }

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function renderRecipe() {
    if (!state.order) return;
    const modifier = state.modifier || MODIFIERS[0];
    dom.orderName.textContent = modifier.id === "standard" ? state.order.name : `${state.order.name}｜${modifier.label}`;
    const maxRows = state.width < 520 ? 5 : 8;
    const start = Math.max(0, Math.min(state.stepIndex - 2, state.order.steps.length - maxRows));
    const rows = state.order.steps.slice(start, start + maxRows);
    dom.recipeList.innerHTML = rows
      .map((step, offset) => {
        const index = start + offset;
        const def = TYPES[step.key];
        const status = index < state.stepIndex ? "完成" : index === state.stepIndex ? (step.mode === "work" ? "按做" : "接") : "待";
        const rowClass = index < state.stepIndex ? "done" : index === state.stepIndex ? "current" : "pending";
        return `
          <div class="recipe-row ${rowClass}">
            <span class="recipe-token" style="--token-bg:${def.bg};--token-accent:${def.color};--token-text:${def.color}">${escapeHtml(def.short)}</span>
            <span>${escapeHtml(step.label)}</span>
            <strong class="step-status">${status}</strong>
          </div>
        `;
      })
      .join("");
  }

  function updateHud() {
    const current = currentStep();
    const diff = getDifficulty();
    const modifier = state.modifier || MODIFIERS[0];
    dom.level.textContent = String(state.level);
    dom.score.textContent = formatNumber(state.score);
    dom.combo.textContent = String(state.combo);
    dom.time.textContent = String(Math.max(0, Math.ceil(state.timeRemaining)));
    dom.highScore.textContent = formatNumber(Math.max(state.highScore, state.score));
    dom.purityText.textContent = `${Math.round(state.purity)}%`;
    dom.purityFill.style.width = `${clamp(state.purity, 0, 100)}%`;
    dom.feverText.textContent = state.feverTime > 0 ? "PURE" : `${Math.round(state.fever)}%`;
    dom.feverFill.style.width = `${state.feverTime > 0 ? 100 : clamp(state.fever, 0, 100)}%`;
    dom.carry.textContent = buildCarryText();
    dom.playerName.textContent = state.playerName;
    if (current) {
      const def = TYPES[current.key];
      const missionText = missionProgressText();
      const pressureText = modifier.id === "standard" ? diff.name : `${diff.name}｜${modifier.label}`;
      const featureText = `${def.feature}會觸發「${def.effect}」`;
      dom.fact.textContent =
        current.mode === "work"
          ? `${pressureText} / 挑戰：${missionText} / ${featureText}，甜點區處理「${def.label}」。`
          : `${pressureText} / 挑戰：${missionText} / ${featureText}，甜點區接「${def.label}」。`;
    }
  }

  function buildCarryText() {
    const tags = [];
    if (state.multiplier > 1) tags.push(`x${state.multiplier.toFixed(1)}`);
    if (state.shield > 0) tags.push(`盾${state.shield}`);
    if (state.magnetTime > 0) tags.push(`磁${Math.ceil(state.magnetTime)}`);
    if (state.slowTime > 0) tags.push(`慢${Math.ceil(state.slowTime)}`);
    if (state.brandHeat > 0) tags.push(`熱${state.brandHeat}`);
    return tags.length ? `${state.carry}｜${tags.join(" ")}` : state.carry;
  }

  function renderLeaderboard() {
    const scores = getLeaderboard();
    if (!scores.length) {
      dom.leaderboard.innerHTML = `<div class="leader-row"><span>1</span><strong>等待開工</strong><em>0</em></div>`;
      return;
    }
    dom.leaderboard.innerHTML = scores
      .slice(0, 5)
      .map(
        (entry, index) => `
          <div class="leader-row">
            <span>${index + 1}</span>
            <strong>${escapeHtml(entry.name)}</strong>
            <em>${formatNumber(entry.score)}</em>
          </div>
        `
      )
      .join("");
  }

  function endGame(reason) {
    if (state.phase === "over") return;
    state.phase = "over";
    stopBgm(0.28);
    controls.left = false;
    controls.right = false;
    controls.up = false;
    controls.down = false;
    controls.action = false;
    state.shake = 0;
    state.feverTime = 0;
    state.highScore = Math.max(state.highScore, state.score);
    localStorage.setItem(HIGH_KEY, String(state.highScore));
    saveScore({
      name: state.playerName,
      score: state.score,
      combo: state.maxCombo,
      perfect: state.bestPrecisionStreak,
      orders: state.completedOrders,
      level: state.level,
      date: new Date().toISOString(),
    });
    renderLeaderboard();
    updateHud();
    dom.resultTitle.textContent = `完成 ${state.completedOrders} 批`;
    dom.resultCopy.textContent =
      state.completedOrders >= 10
        ? `連線很猛，最高 PERFECT 串到 ${state.bestPrecisionStreak}，${reason} 前已經像正式產線。`
        : state.completedOrders >= 5
          ? `手感有起來，最高 PERFECT ${state.bestPrecisionStreak}，${reason} 前差一點進入爆單節奏。`
          : `甜點區時機還能再壓，最高 PERFECT ${state.bestPrecisionStreak}，${reason}。`;
    dom.finalScore.textContent = formatNumber(state.score);
    dom.finalCombo.textContent = String(state.maxCombo);
    dom.finalLevel.textContent = String(Math.max(1, state.level));
    dom.gameOverOverlay.classList.remove("hidden");
  }

  function copyResult() {
    const text = `我在純粹好食純淨優格快線完成 ${state.completedOrders} 批，分數 ${formatNumber(state.score)}，最高連線 ${state.maxCombo}，最高 PERFECT ${state.bestPrecisionStreak}。`;
    navigator.clipboard?.writeText(text).then(
      () => showToast("戰績已複製"),
      () => showToast(text)
    );
  }

  function saveScore(entry) {
    const scores = getLeaderboard();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores.slice(0, 10)));
  }

  function getLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem(SCORE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 900);
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    localStorage.setItem(AUDIO_KEY, audio.muted ? "1" : "0");
    dom.muteIcon.textContent = audio.muted ? "靜" : "音";
    if (audio.bgmGain && audio.context) {
      audio.bgmGain.gain.cancelScheduledValues(audio.context.currentTime);
      audio.bgmGain.gain.setValueAtTime(audio.bgmGain.gain.value, audio.context.currentTime);
      audio.bgmGain.gain.linearRampToValueAtTime(audio.muted ? 0 : 0.026, audio.context.currentTime + 0.18);
    }
    if (!audio.muted) {
      ensureAudio();
      if (state.phase === "playing") startBgm(false);
      beep(520, 0.05, "square", 0.025);
    } else {
      stopBgm(0.18);
    }
  }

  function ensureAudio() {
    if (audio.muted) return;
    if (audio.context) {
      if (audio.context.state === "suspended") audio.context.resume?.();
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audio.context = new AudioContext();
    audio.sfxGain = audio.context.createGain();
    audio.bgmGain = audio.context.createGain();
    audio.sfxGain.gain.value = 0.72;
    audio.bgmGain.gain.value = 0;
    audio.sfxGain.connect(audio.context.destination);
    audio.bgmGain.connect(audio.context.destination);
  }

  function beep(frequency, duration, type, volume) {
    if (audio.muted || !audio.context) return;
    const now = audio.context.currentTime;
    const oscillator = audio.context.createOscillator();
    const gain = audio.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(audio.sfxGain || audio.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function startBgm(reset = false) {
    ensureAudio();
    if (audio.muted || !audio.context || !audio.bgmGain) return;
    if (reset || !audio.bgmTimer) {
      audio.bgmStep = 0;
      audio.bgmNextTime = audio.context.currentTime + 0.05;
    }
    const now = audio.context.currentTime;
    const volume = state.openingMode ? 0.026 : 0.022;
    audio.bgmGain.gain.cancelScheduledValues(now);
    audio.bgmGain.gain.setValueAtTime(audio.bgmGain.gain.value, now);
    audio.bgmGain.gain.linearRampToValueAtTime(volume, now + 0.35);
    if (!audio.bgmTimer) {
      scheduleBgm();
      audio.bgmTimer = window.setInterval(scheduleBgm, 80);
    }
  }

  function stopBgm(fade = 0.2) {
    if (audio.bgmTimer) {
      window.clearInterval(audio.bgmTimer);
      audio.bgmTimer = null;
    }
    if (!audio.context || !audio.bgmGain) return;
    const now = audio.context.currentTime;
    audio.bgmGain.gain.cancelScheduledValues(now);
    audio.bgmGain.gain.setValueAtTime(audio.bgmGain.gain.value, now);
    audio.bgmGain.gain.linearRampToValueAtTime(0, now + fade);
  }

  function scheduleBgm() {
    if (audio.muted || !audio.context || !audio.bgmGain || state.phase !== "playing") return;
    const tempo = BGM.bpm + Math.min(8, Math.max(0, state.level - 1) * 0.45) + (state.feverTime > 0 ? 6 : 0);
    const stepSeconds = 60 / tempo / 4;
    while (audio.bgmNextTime < audio.context.currentTime + 0.32) {
      scheduleBgmStep(audio.bgmStep, audio.bgmNextTime, stepSeconds);
      audio.bgmStep = (audio.bgmStep + 1) % BGM.melody.length;
      audio.bgmNextTime += stepSeconds;
    }
  }

  function scheduleBgmStep(step, time, stepSeconds) {
    const beat = step % 4;
    const barStep = step % 16;
    const fever = state.feverTime > 0;
    if (barStep === 0) {
      const chord = BGM.chords[Math.floor(step / 8) % BGM.chords.length];
      for (const note of chord) playTone(noteToFrequency(note), time, stepSeconds * 11.5, "sine", 0.026, 0.18, 1200);
    }
    if (beat === 0) playPerc(time, fever ? 0.012 : 0.008, 95, 0.04);
    if (barStep === 10 || fever && barStep === 6) playPerc(time + stepSeconds * 0.48, 0.006, 520, 0.018);

    const bass = BGM.bass[step];
    if (bass) playTone(noteToFrequency(bass), time, stepSeconds * 2.8, "sine", 0.075, 0.04, 760);

    const melody = BGM.melody[step];
    if (melody) {
      playTone(noteToFrequency(melody), time, stepSeconds * 2.2, "triangle", fever ? 0.1 : 0.078, 0.04, 1900);
      if (fever && (step % 8 === 2 || step % 8 === 4)) {
        playTone(noteToFrequency(melody) * 1.5, time + stepSeconds * 0.06, stepSeconds * 1.4, "sine", 0.03, 0.025, 2400);
      }
    }

    const sparkle = BGM.sparkle[step];
    if (sparkle && (fever || step % 8 === 7 || state.combo >= 10)) {
      playTone(noteToFrequency(sparkle), time + stepSeconds * 0.22, stepSeconds * 1.2, "sine", 0.032, 0.025, 3000);
    }
  }

  function playTone(frequency, time, duration, type, volume, attack, cutoff) {
    if (!audio.context || !audio.bgmGain || !frequency) return;
    const oscillator = audio.context.createOscillator();
    const filter = audio.context.createBiquadFilter();
    const gain = audio.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.setValueAtTime(0.8, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audio.bgmGain);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.03);
  }

  function playPerc(time, volume, frequency, duration) {
    if (!audio.context || !audio.bgmGain) return;
    const oscillator = audio.context.createOscillator();
    const gain = audio.context.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(45, frequency * 0.35), time + duration);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(gain);
    gain.connect(audio.bgmGain);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }

  function noteToFrequency(note) {
    const match = /^([A-G])(#?)(\d)$/.exec(note);
    if (!match) return 0;
    const semitones = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
    const octave = Number(match[3]);
    const offset = semitones[match[1]] + (match[2] ? 1 : 0) + (octave - 4) * 12;
    return 440 * 2 ** (offset / 12);
  }

  function cloneOrder(template) {
    return {
      ...template,
      steps: template.steps.map((step) => ({ ...step })),
    };
  }

  function fillRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function strokeRect(x, y, w, h, color, size = 2) {
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.strokeRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawText(text, x, y, size, color, align = "left") {
    ctx.font = `900 ${size}px "Microsoft JhengHei", "Noto Sans TC", sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.lineWidth = Math.max(3, Math.floor(size / 5));
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.strokeText(text, Math.round(x), Math.round(y));
    ctx.fillStyle = color;
    ctx.fillText(text, Math.round(x), Math.round(y));
  }

  function formatNumber(value) {
    return Math.round(value).toLocaleString("zh-Hant-TW");
  }

  function readNumber(key) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? value : 0;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
  }
})();
