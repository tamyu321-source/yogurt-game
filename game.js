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
    oat: { label: "燕麥", short: "麥", color: "#a47b42", bg: "#f4e3bf", hold: "燕麥", feature: "穀物耐力", effect: "穩定+", verb: "補穩" },
    matcha: { label: "抹茶", short: "茶", color: "#4f9a4b", bg: "#dff0d5", hold: "抹茶", feature: "茶香提神", effect: "瞬吸", verb: "醒神" },
    cocoa: { label: "可可", short: "可", color: "#7a4b35", bg: "#efd5c6", hold: "可可", feature: "濃厚爆點", effect: "爆點+", verb: "濃縮" },
    salt: { label: "海鹽", short: "鹽", color: "#5aa4c8", bg: "#d9f0fb", hold: "海鹽", feature: "鹹甜反衝", effect: "反衝", verb: "醒味" },
    crunch: { label: "脆粒", short: "脆", color: "#d48c32", bg: "#ffe1bd", hold: "脆粒", feature: "脆口節奏", effect: "連爆", verb: "加脆" },
    mix: { label: "混乳", short: "混", color: "#f4d16f", bg: "#fff2b8", stage: "混乳中", feature: "滑順混乳", effect: "接續快", verb: "滑順" },
    ferment: { label: "熟成", short: "酵", color: "#65a85f", bg: "#def3df", stage: "熟成中", feature: "低溫熟成", effect: "能量+", verb: "熟成" },
    strain: { label: "濾乳", short: "濾", color: "#9b6c53", bg: "#f4e0cf", stage: "希臘濾乳", feature: "綿密濾乳", effect: "精品+", verb: "濾厚" },
    qc: { label: "檢查", short: "檢", color: "#b44966", bg: "#f4d7df", stage: "純淨檢查", feature: "純淨把關", effect: "護盾", verb: "把關" },
    texture: { label: "口感", short: "滑", color: "#ef8b53", bg: "#ffe0cc", stage: "口感調整", feature: "口感研發", effect: "連線+", verb: "調滑" },
    chill: { label: "急冷", short: "冷", color: "#4b91b6", bg: "#dceffc", stage: "急冷定型", feature: "冰鎮定型", effect: "慢場", verb: "急冷" },
    swirl: { label: "旋打", short: "旋", color: "#7d5ba6", bg: "#eadfff", stage: "高速旋打", feature: "旋打爆氣", effect: "爽度+", verb: "旋打" },
    pack: { label: "貼標", short: "標", color: "#7d5ba6", bg: "#eadfff", stage: "封杯完成", feature: "精品封杯", effect: "熱度+", verb: "封杯" },
    ship: { label: "出貨", short: "出", color: "#4b91b6", bg: "#dceffc", stage: "冷鏈出貨", feature: "冷鏈保鮮", effect: "秒數+", verb: "保鮮" },
  };

  const HAZARDS = [
    { key: "flavor", label: "香精", short: "香", color: "#d8243c", feature: "非純淨", effect: "扣純" },
    { key: "coloring", label: "色素", short: "色", color: "#e22d48", feature: "人工色", effect: "扣秒" },
    { key: "dirty", label: "髒汙", short: "髒", color: "#a91527", feature: "品管失守", effect: "重扣" },
    { key: "sugar", label: "過糖", short: "糖", color: "#c91f33", feature: "甜感失衡", effect: "扣能" },
    { key: "sour", label: "過酸", short: "酸", color: "#f0444f", feature: "酸度失控", effect: "倒牙" },
    { key: "ice", label: "冰裂", short: "冰", color: "#b8122b", feature: "冷鏈裂杯", effect: "凍手" },
    { key: "sticky", label: "黏勺", short: "黏", color: "#d9342f", feature: "節奏卡住", effect: "卡手" },
  ];

  const BONUS = [
    { key: "calciumBoost", label: "鈣力慢拍", short: "鈣", color: "#4b91b6", feature: "鈣力補給", effect: "危險物慢" },
    { key: "probioticBoost", label: "益菌磁吸", short: "益", color: "#268aa1", feature: "益菌活力", effect: "目標貼近" },
    { key: "cleanBoost", label: "純淨盾", short: "淨", color: "#65a85f", feature: "純淨製作", effect: "擋添加物" },
    { key: "rushBoost", label: "爽感爆發", short: "爽", color: "#ef8b53", feature: "短暫爆速", effect: "全屏爆" },
    { key: "comboBoost", label: "連擊星糖", short: "連", color: "#f4d16f", feature: "連線補給", effect: "連擊+" },
    { key: "timeBurst", label: "冷鏈秒錶", short: "秒", color: "#7d5ba6", feature: "出貨加時", effect: "秒數++" },
  ];

  const FLAVOR_REWARD_KEYS = ["fruit", "honey", "matcha", "cocoa", "oat", "salt", "crunch"];
  const FLAVOR_REWARD_NAMES = ["果香蜂蜜", "抹茶海鹽", "可可脆粒", "燕麥蜜香", "莓果可可", "鹹甜脆脆"];

  const STATION_KEYS = ["mix", "ferment", "strain", "qc", "texture", "chill", "swirl", "pack", "ship"];

  const DIFFICULTY_TIERS = [
    { min: 1, name: "鮮奶新手線", speed: 202, sameLane: 0.9, required: 1.58, decoy: true, hazard: false, decoyMin: 1.55, decoyMax: 2.25, hazardMin: 9.5, hazardMax: 11.5, timeCap: 72, orderTime: 13, missPurity: 5, missTime: 0.8, timerDrain: 0.98, hazardTarget: 0, bonusChance: 0.46 },
    { min: 2, name: "純淨封杯線", speed: 212, sameLane: 0.84, required: 1.48, decoy: true, hazard: false, decoyMin: 1.7, decoyMax: 2.55, hazardMin: 8.0, hazardMax: 9.8, timeCap: 70, orderTime: 11, missPurity: 6, missTime: 1.0, timerDrain: 1.02, hazardTarget: 0.08, bonusChance: 0.5 },
    { min: 5, name: "益菌熟成線", speed: 224, sameLane: 0.8, required: 1.44, decoy: true, hazard: true, decoyMin: 2.05, decoyMax: 2.85, hazardMin: 5.2, hazardMax: 6.8, timeCap: 64, orderTime: 9, missPurity: 8, missTime: 1.3, timerDrain: 1.06, hazardTarget: 0.3, bonusChance: 0.45 },
    { min: 8, name: "口感研發線", speed: 262, sameLane: 0.66, required: 1.18, decoy: true, hazard: true, decoyMin: 1.45, decoyMax: 2.05, hazardMin: 3.0, hazardMax: 4.3, timeCap: 60, orderTime: 7, missPurity: 12, missTime: 1.8, timerDrain: 1.16, hazardTarget: 0.46, bonusChance: 0.4 },
    { min: 12, name: "精品爆單線", speed: 310, sameLane: 0.54, required: 0.94, decoy: true, hazard: true, decoyMin: 1.0, decoyMax: 1.52, hazardMin: 1.95, hazardMax: 2.95, timeCap: 54, orderTime: 5.2, missPurity: 17, missTime: 2.5, timerDrain: 1.34, hazardTarget: 0.62, bonusChance: 0.36 },
    { min: 16, name: "純淨極限線", speed: 370, sameLane: 0.43, required: 0.72, decoy: true, hazard: true, decoyMin: 0.72, decoyMax: 1.08, hazardMin: 1.05, hazardMax: 1.68, timeCap: 48, orderTime: 3.2, missPurity: 24, missTime: 3.6, timerDrain: 1.6, hazardTarget: 0.78, bonusChance: 0.3 },
    { min: 20, name: "爆速甜點線", speed: 430, sameLane: 0.38, required: 0.58, decoy: true, hazard: true, decoyMin: 0.56, decoyMax: 0.86, hazardMin: 0.78, hazardMax: 1.22, timeCap: 43, orderTime: 2.5, missPurity: 28, missTime: 4.1, timerDrain: 1.86, hazardTarget: 0.84, bonusChance: 0.32 },
    { min: 25, name: "極爽暴走線", speed: 505, sameLane: 0.32, required: 0.48, decoy: true, hazard: true, decoyMin: 0.44, decoyMax: 0.68, hazardMin: 0.58, hazardMax: 0.92, timeCap: 38, orderTime: 2.0, missPurity: 32, missTime: 4.8, timerDrain: 2.15, hazardTarget: 0.9, bonusChance: 0.34 },
  ];

  const MODIFIERS = [
    { id: "standard", unlock: 1, label: "標準批", desc: "穩定出貨", speed: 1, timerDrain: 1, requiredRate: 1, hazardRate: 1, hazardTarget: 0, orderTime: 1, purityPenalty: 1, bonusChance: 0, reward: 0 },
    { id: "coldRush", unlock: 5, label: "冷鏈急單", desc: "倒數加壓，出貨多加分", speed: 1.06, timerDrain: 1.12, requiredRate: 0.92, hazardRate: 1, hazardTarget: 0.04, orderTime: 0.82, purityPenalty: 1, bonusChance: -0.03, reward: 850 },
    { id: "boutiqueBoost", unlock: 6, label: "精品加料", desc: "加分物變多，但節奏更密", speed: 1.04, timerDrain: 1.05, requiredRate: 0.94, hazardRate: 1.08, hazardTarget: 0.03, orderTime: 0.9, purityPenalty: 1.05, bonusChance: 0.18, reward: 650 },
    { id: "audit", unlock: 8, label: "純淨稽核", desc: "添加物更兇，純淨率更容易掉", speed: 1.02, timerDrain: 1.05, requiredRate: 1, hazardRate: 0.82, hazardTarget: 0.14, orderTime: 0.94, purityPenalty: 1.32, bonusChance: -0.07, reward: 1100 },
    { id: "tripleLine", unlock: 10, label: "三軌快線", desc: "目標更常換軌，專打反應", speed: 1.1, timerDrain: 1.12, requiredRate: 0.9, hazardRate: 0.9, hazardTarget: 0.08, sameLane: -0.18, orderTime: 0.82, purityPenalty: 1.12, bonusChance: -0.04, reward: 1350 },
    { id: "additiveAlert", unlock: 13, label: "添加物警報", desc: "危險物會追線，撐住就高分", speed: 1.08, timerDrain: 1.18, requiredRate: 0.94, hazardRate: 0.68, hazardTarget: 0.24, orderTime: 0.74, purityPenalty: 1.55, bonusChance: -0.1, reward: 1950 },
    { id: "hyperRush", unlock: 16, label: "暴走快單", desc: "後期速度拉高，爽感與獎勵一起爆", speed: 1.22, timerDrain: 1.22, requiredRate: 0.82, hazardRate: 0.78, hazardTarget: 0.12, sameLane: -0.1, orderTime: 0.66, purityPenalty: 1.22, bonusChance: 0.06, reward: 2600 },
    { id: "bonusStorm", unlock: 18, label: "營養暴雨", desc: "bonus 更常出現，但畫面更亂", speed: 1.14, timerDrain: 1.18, requiredRate: 0.86, hazardRate: 0.82, hazardTarget: 0.1, sameLane: -0.08, orderTime: 0.7, purityPenalty: 1.18, bonusChance: 0.28, reward: 2300 },
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
    order("oatCrunch", 13, "燕麥脆粒優格", "穀香脆口", "#a47b42", [
      collect("milk", "接鮮奶"),
      collect("oat", "撒燕麥"),
      collect("crunch", "加脆粒"),
      work("mix", "拌開穀香"),
      work("texture", "保留脆口"),
      work("pack", "封杯貼標"),
      work("ship", "冷鏈出貨"),
    ]),
    order("matchaSalt", 15, "抹茶海鹽優格", "鹹甜反衝", "#4f9a4b", [
      collect("milk", "接鮮奶"),
      collect("matcha", "接抹茶"),
      collect("salt", "點海鹽"),
      work("swirl", "高速旋打"),
      work("chill", "急冷定型"),
      work("qc", "純淨檢查"),
      work("pack", "封杯貼標"),
      work("ship", "冷鏈出貨"),
    ]),
    order("cocoaRush", 18, "可可爆脆優格", "濃厚暴擊", "#7a4b35", [
      collect("milk", "接鮮奶"),
      collect("protein", "接蛋白"),
      collect("cocoa", "接可可"),
      collect("crunch", "加脆粒"),
      work("mix", "拌到濃厚"),
      work("swirl", "旋出爆點"),
      work("texture", "壓出口感"),
      work("chill", "急冷定型"),
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
    hitStop: 0,
    flash: 0,
    flashColor: "#ffffff",
    zoomKick: 0,
    speedLineTime: 0,
    comboSurge: 0,
    flavorCharge: 0,
    flavorRushTime: 0,
    flavorMultiplier: 1,
    flavorComboLabel: "",
    flavorCountdown: 0,
    flavorPending: null,
    flavorCueTime: 0,
    customFlavors: 0,
    idleTime: 0,
    idleToastCooldown: 0,
    hazardPressure: 0,
    rhythmSave: 100,
    controlGrace: 0,
    lastPlayerX: 190,
    lastPlayerLane: 1,
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
    reactionTimer: 0,
    reactionKey: null,
    reactionColor: COLORS.berry,
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
    targetX: null,
    startedAt: 0,
    startedInPlay: false,
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
    bpm: 88,
    melody: ["C5", null, "E5", "G5", null, "E5", "D5", null, "C5", null, "G4", "C5", "E5", null, "D5", null, "E5", null, "G5", "C6", null, "G5", "E5", null, "D5", null, "E5", "G5", "C5", null, null, null],
    hook: ["G5", null, null, "E5", null, "C5", null, null, "A5", null, "G5", null, "E5", null, "C5", null, "C6", null, null, "G5", null, "E5", null, null, "G5", null, "E5", null, "C5", null, null, null],
    bass: ["C3", null, "C3", null, "G2", null, "G2", null, "A2", null, "A2", null, "F2", null, "G2", null, "C3", null, "C3", null, "E3", null, "E3", null, "A2", null, "A2", null, "F2", null, "G2", null],
    sparkle: ["G6", null, "E6", null, "C6", null, "G6", null, "A6", null, "G6", null, "E6", null, "C6", null, "E6", null, "G6", null, "C7", null, "G6", null, "A6", null, "G6", null, "E6", null, "C6", null],
    chords: [["C4", "E4", "G4"], ["G3", "B3", "D4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["C4", "E4", "G4"], ["E3", "G3", "B3"], ["A3", "C4", "E4"], ["F3", "A3", "C4"]],
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
    const flavorSpeed = state.flavorRushTime > 0 ? 1.2 + Math.min(0.34, state.customFlavors * 0.018 + state.combo * 0.002) : 1;
    const comboSpeed = 1 + Math.min(0.42, state.combo * 0.008 + state.completedOrders * 0.018);
    const idleThreat = state.flavorRushTime > 0 ? 0 : clamp((state.idleTime - 0.85) * 0.34 + state.hazardPressure * 0.12, 0, 0.72);
    return {
      ...tier,
      speed: (tier.speed + pressure * 22 + latePressure * 13.5 + Math.max(0, state.level - 18) * 20 + state.completedOrders * 7.4) * modifier.speed * openingSpeed * flavorSpeed * comboSpeed,
      hazard: tier.hazard || state.completedOrders >= 1 || idleThreat > 0.18,
      sameLane: clamp(tier.sameLane - 0.36 - pressure * 0.02 + (modifier.sameLane || 0), 0.16, 0.64),
      required: Math.max(0.3, (tier.required - pressure * 0.044 - latePressure * 0.018 - state.combo * 0.0016) * modifier.requiredRate),
      decoyMin: Math.max(0.26, tier.decoyMin - pressure * 0.05 - latePressure * 0.018),
      decoyMax: Math.max(0.42, tier.decoyMax - pressure * 0.05 - latePressure * 0.018),
      hazardMin: Math.max(0.24, (tier.hazardMin - pressure * 0.085 - latePressure * 0.05) * modifier.hazardRate - idleThreat * 1.25),
      hazardMax: Math.max(0.42, (tier.hazardMax - pressure * 0.085 - latePressure * 0.05) * modifier.hazardRate - idleThreat * 1.55),
      orderTime: Math.max(2.2, tier.orderTime * modifier.orderTime),
      missPurity: Math.ceil(tier.missPurity * modifier.purityPenalty),
      missTime: tier.missTime * modifier.purityPenalty,
      timerDrain: tier.timerDrain * modifier.timerDrain * openingDrain * (1 + Math.min(0.36, state.completedOrders * 0.018 + state.combo * 0.004)),
      hazardTarget: clamp(tier.hazardTarget + modifier.hazardTarget + openingHazardTarget + idleThreat, 0, 0.98),
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
    triggerJuice(COLORS.berry, 1.55, { x: player.x + 58, y: player.y - 54, style: "stamp", hitStop: 0.11 });
    beep(980, 0.07, "square", 0.035);
    beep(1260, 0.08, "triangle", 0.025);
  }

  function getHitQuality(entity) {
    if (entity.required) return { grade: "perfect", label: "PERFECT", mult: 1.66, color: COLORS.berry, fever: 8, time: 0.55 };
    const center = entity.x + entity.w / 2;
    const distance = Math.abs(center - player.x);
    const arcadeBonus = (state.width < 620 ? 9 : 0) + Math.min(12, Math.floor(state.combo / 5) * 2);
    if (distance <= 24 + arcadeBonus) return { grade: "perfect", label: "PERFECT", mult: 1.58, color: COLORS.berry, fever: 7, time: 0.5 };
    if (distance <= 54 + arcadeBonus) return { grade: "good", label: "GOOD", mult: 1.24, color: COLORS.aquaDeep, fever: 4, time: 0.22 };
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
    window.addEventListener("pointerdown", primeAudio, { passive: true });
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

  function primeAudio() {
    if (audio.muted) return;
    ensureAudio();
    if (state.phase === "playing" && !audio.bgmTimer) startBgm(false);
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
        if (!isGameplayPointer(event)) return;
        event.preventDefault();
        touch.id = event.pointerId;
        touch.startX = event.clientX;
        touch.startY = event.clientY;
        touch.lastX = event.clientX;
        touch.lastY = event.clientY;
        touch.laneY = event.clientY;
        touch.targetX = pointerToPlayerX(event.clientX);
        touch.startedAt = performance.now();
        touch.startedInPlay = true;
        touch.dragging = false;
        followPointerLane(event.clientY);
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
        touch.targetX = pointerToPlayerX(event.clientX);
        followPointerLane(event.clientY);
        if (Math.abs(dy) > 30) {
          changeLane(dy > 0 ? 1 : -1);
          touch.laneY = event.clientY;
          touch.dragging = true;
        }
        if (Math.abs(dx) > 12) touch.dragging = true;
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
      if (touch.startedInPlay && totalMove < 28 && elapsed < 360) triggerAction();
      resetPointerControl();
      try {
        canvas.releasePointerCapture?.(event.pointerId);
      } catch {
        // Some browsers clear touch capture before pointercancel fires.
      }
    };

    canvas.addEventListener("pointerup", endTouch, { passive: false });
    canvas.addEventListener("pointercancel", endTouch, { passive: false });
  }

  function resetPointerControl() {
    touch.id = null;
    touch.targetX = null;
    touch.startedInPlay = false;
    touch.dragging = false;
  }

  function isGameplayPointer(event) {
    return event.clientY >= Math.max(120, state.lanes[0] - 150);
  }

  function pointerToPlayerX(x) {
    return clamp(x, 86, state.width * 0.58);
  }

  function followPointerLane(y) {
    const lane = nearestLane(y);
    if (lane !== null) setLane(lane);
  }

  function nearestLane(y) {
    if (!state.lanes.length || y < state.lanes[0] - 120) return null;
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < state.lanes.length; i += 1) {
      const distance = Math.abs(y - state.lanes[i]);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    }
    return best;
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
    const safeTop = state.width < 520 ? 226 : 188;
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
    state.hitStop = 0;
    state.flash = 0;
    state.flashColor = "#ffffff";
    state.zoomKick = 0;
    state.speedLineTime = 0;
    state.comboSurge = 0;
    state.flavorCharge = 0;
    state.flavorRushTime = 0;
    state.flavorMultiplier = 1;
    state.flavorComboLabel = "";
    state.flavorCountdown = 0;
    state.flavorPending = null;
    state.flavorCueTime = 0;
    state.customFlavors = 0;
    state.idleTime = 0;
    state.idleToastCooldown = 0;
    state.hazardPressure = 0;
    state.rhythmSave = 100;
    state.controlGrace = 0;
    state.entities = [];
    state.particles = [];
    state.bursts = [];
    state.floats = [];
    state.packages = [];
    player.x = Math.min(190, state.width * 0.34);
    player.lane = 1;
    player.targetLane = 1;
    player.y = state.lanes[1];
    state.lastPlayerX = player.x;
    state.lastPlayerLane = player.lane;
    player.actionTimer = 0;
    player.invuln = 0;
    player.laneRepeat = 0;
    player.reactionTimer = 0;
    player.reactionKey = null;
    resetPointerControl();
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
    const fxDt = dt;
    const worldDt = state.hitStop > 0 ? dt * 0.08 : dt;
    state.hitStop = Math.max(0, state.hitStop - fxDt);
    state.flash = Math.max(0, state.flash - fxDt * 3.8);
    state.zoomKick = Math.max(0, state.zoomKick - fxDt * 4.6);
    state.speedLineTime = Math.max(0, state.speedLineTime - fxDt);
    state.comboSurge = Math.max(0, state.comboSurge - fxDt * 2.4);
    state.flavorCueTime = Math.max(0, state.flavorCueTime - fxDt);
    if (state.flavorCountdown > 0) {
      state.flavorCountdown = Math.max(0, state.flavorCountdown - fxDt);
      state.speedLineTime = Math.max(state.speedLineTime, 0.35);
      state.comboSurge = Math.max(state.comboSurge, 0.8);
      if (state.flavorCountdown <= 0 && state.flavorPending) {
        activateFlavorCombo();
      }
    }
    if (state.flavorRushTime > 0) {
      state.flavorRushTime = Math.max(0, state.flavorRushTime - worldDt);
      if (state.flavorRushTime <= 0) {
        state.flavorMultiplier = 1;
        state.flavorComboLabel = "";
      }
    }
    state.timeRemaining -= worldDt * diff.timerDrain;
    if (state.timeRemaining <= 0) {
      endGame("時間歸零");
      return;
    }
    state.idleToastCooldown = Math.max(0, state.idleToastCooldown - fxDt);

    const feverBoost = state.feverTime > 0 ? 1.24 : 1;
    state.speed = diff.speed * feverBoost;
    state.requiredTimer -= worldDt;
    state.decoyTimer -= worldDt;
    state.hazardTimer -= worldDt;
    state.shake = Math.max(0, state.shake - fxDt * 9);
    player.actionTimer = Math.max(0, player.actionTimer - fxDt);
    player.invuln = Math.max(0, player.invuln - fxDt);
    player.reactionTimer = Math.max(0, player.reactionTimer - fxDt);
    state.slowTime = Math.max(0, state.slowTime - worldDt);
    state.magnetTime = Math.max(0, state.magnetTime - worldDt);

    if (state.feverTime > 0) {
      state.feverTime -= worldDt;
      if (state.feverTime <= 0) state.fever = 18;
    } else {
      state.fever = Math.max(0, state.fever - worldDt * 3.5);
    }

    processLaneControls(fxDt);
    const move = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    const maxX = state.width * 0.58;
    if (touch.id !== null && Number.isFinite(touch.targetX)) {
      const dx = touch.targetX - player.x;
      const followSpeed = state.feverTime > 0 ? 620 : 520;
      player.x = clamp(player.x + clamp(dx * 9, -followSpeed, followSpeed) * fxDt, 86, maxX);
      if (Math.abs(dx) < 2) player.x = clamp(touch.targetX, 86, maxX);
    } else {
      player.x = clamp(player.x + move * (state.feverTime > 0 ? 330 : 260) * fxDt, 86, maxX);
    }
    player.y += (state.lanes[player.lane] - player.y) * Math.min(1, fxDt * 13);
    player.stepBob += fxDt * (8 + Math.abs(move) * 6 + state.speed / 95 + state.comboSurge * 4);
    updateActivityPressure(worldDt, fxDt, move);

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
      entity.x -= (state.speed + entity.speedOffset) * slowFactor * worldDt;
      entity.anim += fxDt;
      entity.trailTimer -= fxDt;
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
      burst.life -= fxDt;
      burst.angle += burst.spin * fxDt;
    }
    state.bursts = state.bursts.filter((burst) => burst.life > 0);

    for (const particle of state.particles) {
      particle.x += particle.vx * fxDt;
      particle.y += particle.vy * fxDt;
      particle.vy += particle.gravity * fxDt;
      if (particle.friction) {
        const drag = Math.pow(particle.friction, fxDt * 60);
        particle.vx *= drag;
        particle.vy *= drag;
      }
      particle.angle = (particle.angle || 0) + (particle.spin || 0) * fxDt;
      if (particle.grow) particle.size = Math.max(1, particle.size + particle.grow * fxDt);
      particle.life -= fxDt;
    }
    state.particles = state.particles.filter((particle) => particle.life > 0);

    for (const text of state.floats) {
      text.y += text.vy * fxDt;
      text.life -= fxDt;
    }
    state.floats = state.floats.filter((text) => text.life > 0);

    for (const pack of state.packages) {
      pack.x -= state.speed * 0.55 * worldDt;
      pack.bob += fxDt;
    }
    state.packages = state.packages.filter((pack) => pack.x > -80);

    updateHud();
  }

  function noteActivePlay(strength = 1) {
    state.idleTime = 0;
    state.hazardPressure = Math.max(0, state.hazardPressure - strength * 0.55);
    state.rhythmSave = clamp(state.rhythmSave + strength * 14, 0, 100);
  }

  function updateActivityPressure(worldDt, fxDt, move) {
    const pointerActive = touch.id !== null && Number.isFinite(touch.targetX) && Math.abs(touch.targetX - player.x) > 2;
    const keyActive = Boolean(controls.left || controls.right || controls.up || controls.down || controls.action || move);
    const moved = Math.abs(player.x - state.lastPlayerX) > 0.8 || player.lane !== state.lastPlayerLane;
    const active = pointerActive || keyActive || moved;
    state.lastPlayerX = player.x;
    state.lastPlayerLane = player.lane;
    if (state.phase !== "playing") return;
    state.controlGrace = Math.max(0, state.controlGrace - fxDt);
    if (active) {
      state.controlGrace = 2.2;
      state.idleTime = Math.max(0, state.idleTime - fxDt * 4.5);
      state.hazardPressure = Math.max(0, state.hazardPressure - fxDt * 1.8);
      state.rhythmSave = clamp(state.rhythmSave + fxDt * 18, 0, 100);
      return;
    }

    if (state.flavorRushTime > 0) {
      state.idleTime = Math.max(0, state.idleTime - fxDt * 0.8);
      state.hazardPressure = Math.max(0, state.hazardPressure - fxDt * 2.2);
      return;
    }

    state.idleTime += fxDt;
    const grace = 0.95;
    if (state.idleTime <= grace) return;

    const over = state.idleTime - grace;
    state.hazardPressure = clamp(state.hazardPressure + worldDt * (0.75 + over * 0.55), 0, 3.2);
    state.rhythmSave = clamp(state.rhythmSave + worldDt * 5, 0, 100);
    state.fever = Math.max(0, state.fever - worldDt * Math.min(5, 1 + over * 1.4));
    const chaseDelay = clamp(0.62 - over * 0.18 - state.level * 0.006, 0.18, 0.62);
    state.hazardTimer = Math.min(state.hazardTimer, chaseDelay);
    if (over > 1.25 && state.combo > 0) {
      state.combo = 0;
      state.lastComboPrize = 0;
      state.multiplier = 1;
    }
    if (state.idleToastCooldown <= 0) {
      state.idleToastCooldown = 1.8;
      showToast("紅色添加物追過來了，滑動躲開");
      floatText("躲紅色!", player.x + 38, player.y - 118, COLORS.berry);
    }
  }

  function currentStep() {
    return state.order?.steps[state.stepIndex] || null;
  }

  function isNextTargetEntity(entity) {
    const step = currentStep();
    return Boolean(step && entity.required && entity.key === step.key && ((step.mode === "work") === (entity.type === "station")));
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
    if (state.magnetTime > 0 && state.idleTime < 0.8) return player.lane;
    if (state.completedOrders === 0 && state.stepIndex === 0) return player.lane;
    const sameLane = clamp(diff.sameLane - (state.idleTime > 1.2 ? 0.18 : 0), 0.12, 0.64);
    if (Math.random() < sameLane) return player.lane;
    return differentLane(player.lane);
  }

  function differentLane(lane) {
    const options = [0, 1, 2].filter((item) => item !== lane);
    return options[randomInt(0, options.length - 1)];
  }

  function spawnDecoy() {
    const step = currentStep();
    const diff = getDifficulty();
    const keys = Object.keys(TYPES).filter((key) => key !== step?.key && (state.level >= 4 || !STATION_KEYS.includes(key)));
    const key = keys[randomInt(0, keys.length - 1)];
    const asStation = STATION_KEYS.includes(key);
    const bonusChance = state.flavorRushTime > 0 ? Math.min(0.86, diff.bonusChance + 0.38) : diff.bonusChance;
    if (Math.random() < bonusChance) {
      const bonus = BONUS[randomInt(0, BONUS.length - 1)];
      spawnEntity({ type: "bonus", key: bonus.key, lane: randomInt(0, 2), bonus });
    } else {
      spawnEntity({ type: asStation ? "station" : "item", key, lane: randomInt(0, 2), required: false });
    }
  }

  function spawnHazard() {
    const idleThreat = state.idleTime > 1.05 || state.hazardPressure > 0.5;
    if (!idleThreat && !activeOpeningMode() && state.completedOrders === 0 && state.stepIndex < 2) return;
    if (state.flavorCountdown > 0 || state.flavorRushTime > 0) return;
    const diff = getDifficulty();
    const hazard = HAZARDS[randomInt(0, HAZARDS.length - 1)];
    const chaseChance = clamp(diff.hazardTarget + state.hazardPressure * 0.18 + (idleThreat ? 0.18 : 0), 0, 0.98);
    const lane = Math.random() < chaseChance ? player.lane : randomInt(0, 2);
    const speedOffset = random(18, 46) + Math.min(95, state.hazardPressure * 32 + Math.max(0, state.idleTime - 1) * 22);
    spawnEntity({ type: "hazard", key: hazard.key, lane, hazard, speedOffset });
    if (lane === player.lane) emitLaneFlash(lane, hazard.color);
  }

  function spawnEntity(options) {
    const def = TYPES[options.key] || options.hazard || options.bonus;
    const station = options.type === "station";
    const w = station ? 92 : options.type === "hazard" ? 64 : 58;
    const h = station ? 76 : options.type === "hazard" ? 58 : 54;
    const entity = {
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
      speedOffset: options.speedOffset ?? random(-12, 28),
      anim: random(0, 2),
      trailTimer: random(0.04, 0.16),
      hazard: options.hazard,
      bonus: options.bonus,
      pulse: 0,
    };
    state.entities.push(entity);
    return entity;
  }

  function handleCollision(entity) {
    if (entity.type === "hazard") {
      entity.done = true;
      entity.remove = true;
      emitHazardImpact(entity);
      setPlayerReaction(entity.key, entity.color, 1.35);
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
      if (match) {
        if (player.actionTimer <= 0) triggerAction();
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

  function setPlayerReaction(key, color, power = 1) {
    player.reactionKey = key;
    player.reactionColor = color || COLORS.berry;
    player.reactionTimer = Math.max(player.reactionTimer, 0.72 + power * 0.34);
  }

  function triggerJuice(color, power = 1, options = {}) {
    const x = options.x ?? player.x;
    const y = options.y ?? player.y - 44;
    state.hitStop = Math.max(state.hitStop, options.hitStop ?? 0.035 + power * 0.045);
    state.shake = Math.max(state.shake, 0.18 + power * 0.32);
    state.flash = Math.max(state.flash, 0.18 + power * 0.12);
    state.flashColor = color;
    state.zoomKick = Math.max(state.zoomKick, 0.35 + power * 0.78);
    state.speedLineTime = Math.max(state.speedLineTime, 0.16 + power * 0.16);
    state.comboSurge = Math.max(state.comboSurge, 0.3 + power * 0.38);
    emitImpactBurst(x, y, color, options.style || "spark", 0.8 + power * 0.35);
    if (power >= 0.9) emitScreenSparks(x, y, color, Math.round(10 + power * 10));
  }

  function dismissNeutral(entity) {
    entity.done = true;
    entity.required = false;
  }

  function skipRequired(entity) {
    const diff = getDifficulty();
    entity.done = true;
    entity.required = false;
    state.requiredTimer = Math.min(state.requiredTimer, 0.45);
    state.missed += 1;
    state.batchMistakes += 1;
    state.combo = 0;
    state.lastComboPrize = 0;
    state.multiplier = 1;
    state.fever = Math.max(0, state.fever - 8);
    state.timeRemaining = Math.max(0, state.timeRemaining - Math.min(1.8, diff.missTime * 0.45));
    state.hazardPressure = clamp(state.hazardPressure + 0.38, 0, 3.2);
    if (state.flavorRushTime <= 0) state.hazardTimer = Math.min(state.hazardTimer, 0.32);
    emitPop(entity.x + entity.w / 2, entity.y - 38, COLORS.berry, 9);
    floatText("漏接", entity.x + entity.w / 2, entity.y - 72, COLORS.berry);
  }

  function completeStep(entity) {
    const step = currentStep();
    const def = TYPES[step.key];
    const quality = getHitQuality(entity);
    const fever = state.feverTime > 0;
    noteActivePlay(1.3);
    applyHitQuality(entity, quality);
    setPlayerReaction(step.key, def.color, quality.grade === "perfect" ? 1.25 : 0.85);
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    handleComboPrize();
    const flavorMult = state.flavorRushTime > 0 ? state.flavorMultiplier : 1;
    const points = Math.round((step.points + state.combo * 30 + state.level * 20) * quality.mult * state.multiplier * flavorMult * (fever ? 2.2 : 1));
    state.score += points;
    state.fever = clamp(state.fever + 10 + Math.min(14, state.combo * 0.45), 0, 100);
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 0.7);
    state.carry = step.mode === "collect" ? def.hold || def.label : def.stage || def.label;
    applyElementFeature(step, def, entity, quality);
    addFlavorCharge(step, def, entity, quality);
    state.stepIndex += 1;
    state.shake = 0.34;
    emitPop(entity.x + entity.w / 2, entity.y - 28, def.color, 18);
    emitElementImpact(step.key, entity, def.color, quality.grade === "perfect");
    triggerJuice(def.color, quality.grade === "perfect" ? 1.15 : quality.grade === "good" ? 0.78 : 0.46, {
      x: entity.x + entity.w / 2,
      y: entity.y - 48,
      style: quality.grade === "perfect" ? "speed" : "spark",
    });
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
      triggerJuice(COLORS.aquaDeep, 1.45, { x: player.x + 58, y: player.y - 46, style: "orbit", hitStop: 0.1 });
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
    } else if (step.key === "oat") {
      time = perfect ? 0.65 : 0.35;
      purity = 1;
      text = "燕麥穩住";
    } else if (step.key === "matcha") {
      state.magnetTime = Math.max(state.magnetTime, perfect ? 2.4 : 1.5);
      state.requiredTimer = Math.min(state.requiredTimer, perfect ? 0.08 : 0.14);
      fever = perfect ? 9 : 5;
      text = "抹茶醒神";
    } else if (step.key === "cocoa") {
      points = 360 + state.level * 24;
      fever = perfect ? 7 : 3;
      text = "可可暴擊";
    } else if (step.key === "salt") {
      state.shake = Math.max(state.shake, 0.55);
      time = perfect ? 0.75 : 0.35;
      fever = 4;
      text = "鹹甜反衝";
    } else if (step.key === "crunch") {
      points = 180 + state.combo * 18;
      if (perfect) {
        state.combo += 1;
        state.maxCombo = Math.max(state.maxCombo, state.combo);
      }
      text = perfect ? "脆粒連爆+1" : "脆口加分";
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
    } else if (step.key === "chill") {
      state.slowTime = Math.max(state.slowTime, perfect ? 2.2 : 1.3);
      time = perfect ? 0.55 : 0.25;
      text = "急冷慢場";
    } else if (step.key === "swirl") {
      fever = perfect ? 12 : 7;
      points = 220 + state.level * 20;
      state.speedLineTime = Math.max(state.speedLineTime, 0.45);
      text = "旋打爆氣";
    } else if (step.key === "pack") {
      points = 180 + state.level * 12;
      text = "精品封杯";
    } else if (step.key === "ship") {
      time = perfect ? 1.0 : 0.65;
      text = "冷鏈保鮮";
    }

    if (points > 0) state.score += Math.round(points * state.multiplier * (state.flavorRushTime > 0 ? state.flavorMultiplier : 1));
    if (time > 0) state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + time);
    if (purity > 0) state.purity = clamp(state.purity + purity, 0, 100);
    if (fever > 0) state.fever = clamp(state.fever + fever, 0, 100);

    markBrandFeature(step.key, def, entity, text);
    if (text) {
      emitFeatureSpark(entity.x + entity.w / 2, entity.y - 42, def.color, perfect ? 10 : 6);
      emitBadgeBurst(entity.x + entity.w / 2, entity.y - 52, def.color, def.short);
    }
    handleComboPrize();
  }

  function addFlavorCharge(step, def, entity, quality) {
    const qualityCharge = quality.grade === "perfect" ? 1.35 : quality.grade === "good" ? 1.05 : 0.82;
    const workCharge = step.mode === "work" ? 0.9 : 1;
    state.flavorCharge += qualityCharge * workCharge;
    const threshold = Math.max(2.6, 4.25 - Math.min(1.35, state.level * 0.04 + state.completedOrders * 0.035));
    const fill = clamp(state.flavorCharge / threshold, 0, 1);
    if (fill >= 0.72 && state.flavorCueTime <= 0 && state.flavorCountdown <= 0 && state.flavorRushTime <= 0) {
      state.flavorCueTime = 1.4;
      emitFlavorPreview(entity.x + entity.w / 2, entity.y - 76, def.color);
      showToast("自搭配口味快好了，準備爽拿倍分");
    }
    if (fill < 1) {
      emitFeatureSpark(entity.x + entity.w / 2, entity.y - 82, def.color, quality.grade === "perfect" ? 5 : 3);
      return;
    }
    state.flavorCharge -= threshold;
    prepareFlavorCombo(entity, def);
  }

  function prepareFlavorCombo(entity, sourceDef) {
    if (state.flavorCountdown > 0 || state.flavorRushTime > 0) return;
    const first = FLAVOR_REWARD_KEYS[(state.customFlavors + state.level + state.combo) % FLAVOR_REWARD_KEYS.length];
    const second = FLAVOR_REWARD_KEYS[(state.customFlavors * 2 + state.completedOrders + 3) % FLAVOR_REWARD_KEYS.length];
    const fallback = FLAVOR_REWARD_NAMES[state.customFlavors % FLAVOR_REWARD_NAMES.length];
    const label = first === second ? fallback : `${TYPES[first].label}${TYPES[second].label}`;
    const multiplier = Math.min(4.2, 2.0 + state.level * 0.055 + state.combo * 0.026 + state.customFlavors * 0.05);
    const duration = 5.0 + Math.min(2.8, state.level * 0.07);
    const bonus = Math.round((520 + state.level * 95 + state.combo * 32) * multiplier);
    const x = entity?.x + entity?.w / 2 || player.x + 56;
    const y = entity?.y - 56 || player.y - 62;

    state.flavorPending = { first, second, label, multiplier, duration, bonus, x, y, color: sourceDef?.color || COLORS.berry };
    state.flavorCountdown = 1.15;
    state.flavorCueTime = 1.15;
    state.hitStop = Math.max(state.hitStop, 0.08);
    state.flash = Math.max(state.flash, 0.22);
    state.flashColor = sourceDef?.color || COLORS.berry;
    state.speedLineTime = Math.max(state.speedLineTime, 0.85);
    showToast(`自搭配即將開始：${label}`);
    emitFlavorPreview(x, y - 36, sourceDef?.color || COLORS.berry);
    beep(760, 0.06, "triangle", 0.035);
  }

  function activateFlavorCombo() {
    const pending = state.flavorPending;
    if (!pending) return;
    const { first, second, label, multiplier, duration, bonus, x, y, color } = pending;

    state.customFlavors += 1;
    state.flavorRushTime = Math.max(state.flavorRushTime, duration);
    state.flavorMultiplier = Math.max(state.flavorMultiplier, multiplier);
    state.flavorComboLabel = label;
    state.flavorCountdown = 0;
    state.flavorPending = null;
    state.score += bonus;
    state.fever = clamp(state.fever + 16, 0, 100);
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 1.15);
    state.speedLineTime = Math.max(state.speedLineTime, 1.8);
    state.comboSurge = Math.max(state.comboSurge, 1.7);
    clearHazardsForFlavorRush();

    showToast(`自搭配口味：${label} x${multiplier.toFixed(1)} 爽速`);
    floatText("JUICY RUSH", x, y - 84, COLORS.berry);
    floatText(`${label} x${multiplier.toFixed(1)}`, x, y - 58, COLORS.purple);
    floatText(`+${formatNumber(bonus)}`, x, y - 34, COLORS.leaf);
    emitFlavorRushStart(x, y - 18, color, first, second);
    emitPop(x, y - 18, color, 42);
    emitRingBurst(x, y - 26, COLORS.berry, 4, 36);
    emitFeatureSpark(x, y - 26, COLORS.yellow, 24);
    emitBadgeBurst(x, y - 38, COLORS.purple, "搭");
    emitLaneFlash(player.lane, COLORS.berry);
    setPlayerReaction("flavorCombo", COLORS.purple, 1.25);
    triggerJuice(COLORS.berry, 2.65, { x, y: y - 26, style: "confetti", hitStop: 0.18 });
    beep(980, 0.1, "triangle", 0.045);
  }

  function clearHazardsForFlavorRush() {
    for (const entity of state.entities) {
      if (entity.type !== "hazard" || entity.remove) continue;
      entity.remove = true;
      entity.done = true;
      emitImpactBurst(entity.x + entity.w / 2, entity.y - 42, entity.color, "hazard", 0.85);
      emitImpactParticles(entity.x + entity.w / 2, entity.y - 42, [entity.color, "#ffffff", COLORS.yellow], 12, { spread: Math.PI * 2, speedMin: 100, speedMax: 260, gravity: 220, spin: 10, shape: "shard" });
    }
    state.hazardTimer = Math.max(state.hazardTimer, 2.2);
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
    const orderMult = state.flavorRushTime > 0 ? state.flavorMultiplier : 1;
    const bonus = Math.round((800 + state.combo * 42 + state.timeRemaining * 18 + state.level * 80 + modifier.reward + (perfect ? 700 + state.level * 60 : 0)) * orderMult);
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
    if (state.level === 3 || state.level === 5 || state.level === 8 || state.level === 11 || state.level === 16 || state.level === 20 || state.level === 25) {
      floatText(getDifficulty().name, player.x + 96, player.y - 122, COLORS.berry);
    }
    emitPop(player.x + 70, player.y - 38, order.color, 30);
    emitRingBurst(player.x + 70, player.y - 48, order.color, perfect ? 4 : 3, 34);
    emitLaneFlash(player.lane, order.color);
    triggerJuice(order.color, perfect ? 1.9 : 1.35, { x: player.x + 70, y: player.y - 48, style: perfect ? "stamp" : "speed", hitStop: perfect ? 0.13 : 0.09 });
    beep(820, 0.08, "triangle", 0.04);
    if (state.fever >= 100 && state.feverTime <= 0) activateFever();
    spawnOrder(false);
  }

  function collectBonus(entity) {
    const bonus = entity.bonus;
    let text = "";
    let value = Math.round((180 + state.combo * 12) * state.multiplier);
    noteActivePlay(1);
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
    } else if (bonus.key === "rushBoost") {
      state.fever = clamp(state.fever + 24, 0, 100);
      state.speedLineTime = Math.max(state.speedLineTime, 1.0);
      value = 420 + state.level * 30;
      text = "爽感爆發";
    } else if (bonus.key === "comboBoost") {
      state.combo += 3;
      value = 260 + state.combo * 20;
      text = "連擊+4";
    } else if (bonus.key === "timeBurst") {
      state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 3.5);
      value = 180;
      text = "秒數++";
    }
    if (state.flavorRushTime > 0) value = Math.round(value * state.flavorMultiplier);
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
    emitBonusImpact(bonus.key, entity, bonus.color);
    setPlayerReaction(bonus.key, bonus.color, 1.1);
    triggerJuice(bonus.color, 1.25, { x: entity.x + entity.w / 2, y: entity.y - 46, style: "magnet", hitStop: 0.08 });
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
    triggerJuice(COLORS.yellow, milestone % 20 === 0 ? 1.75 : 1.35, { x: player.x + 56, y: player.y - 48, style: "confetti", hitStop: 0.1 });
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
      triggerJuice(COLORS.leaf, 1.2, { x: player.x + 18, y: player.y - 42, style: "shield", hitStop: 0.1 });
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
    triggerJuice(COLORS.berry, 0.85, { x: player.x + 20, y: player.y - 40, style: "hazard", hitStop: 0.09 });
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
    triggerJuice(COLORS.orange, 2.25, { x: player.x + 42, y: player.y - 54, style: "speed", hitStop: 0.16 });
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
    setLane(player.lane + delta);
  }

  function setLane(lane) {
    if (state.phase !== "playing") return;
    const nextLane = clamp(Math.round(lane), 0, 2);
    if (nextLane === player.lane) return;
    player.lane = nextLane;
    player.targetLane = player.lane;
    noteActivePlay(0.55);
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
    if (state.zoomKick > 0) {
      const zoom = 1 + state.zoomKick * 0.035;
      ctx.translate(state.width / 2, state.height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-state.width / 2, -state.height / 2);
    }
    drawBackground();
    drawSpeedLines();
    drawHitZone();
    const sorted = [...state.entities].sort((a, b) => a.y - b.y);
    for (const entity of sorted) drawEntity(entity);
    for (const pack of state.packages) drawPackage(pack);
    drawPlayer();
    drawActiveEffects();
    drawTouchCursor();
    for (const burst of state.bursts) drawBurst(burst);
    for (const particle of state.particles) drawParticle(particle);
    for (const text of state.floats) drawFloat(text);
    if (state.feverTime > 0) drawFeverOverlay();
    if (state.flavorCountdown > 0 || state.flavorRushTime > 0) drawFlavorRushOverlay();
    ctx.restore();
    drawScreenFlash();
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

    drawPixelSign(w * 0.5 - ((t * 34) % 460), wallTop + 34, "純粹優格多一點", COLORS.aquaDeep, 156);
    drawPixelSign(w * 0.82 - ((t * 34) % 560), wallTop + 84, "健康多一點", COLORS.leaf, 126);
    drawPixelSign(w * 0.28 - ((t * 30) % 620), wallTop + 126, "UGOODAYS", COLORS.berry, 112);
    drawCuteBrandDecals(w, wallTop, t);

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

  function drawCuteBrandDecals(w, wallTop, t) {
    ctx.save();
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 9; i += 1) {
      const x = ((i * 176 + 70 - t * (18 + i)) % (w + 180)) - 90;
      const y = wallTop + 20 + (i % 4) * 34;
      const color = i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#e3f8ff" : "#e6f5df";
      drawCircle(x, y, 7 + (i % 2) * 3, color);
      drawCircle(x + 12, y + 7, 4, "#ffffff");
      if (i % 3 === 0) {
        fillRect(x - 3, y - 16, 6, 6, COLORS.berry);
        fillRect(x + 3, y - 16, 6, 6, COLORS.berry);
        fillRect(x, y - 10, 6, 6, COLORS.berry);
      }
    }
    ctx.restore();
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
    fillRect(x - 20, y - 88, 40, 112, `rgba(180,73,102,${0.08 + pulse * 0.04})`);
    strokeRect(x - 20, y - 88, 40, 112, "rgba(180,73,102,.46)", 3);
    fillRect(x - 3, y - 96, 6, 124, "rgba(38,138,161,.55)");
    drawText("甜點區", x, y - 109, state.width < 520 ? 12 : 14, COLORS.berry, "center");
    const activeMult = state.multiplier * (state.flavorRushTime > 0 ? state.flavorMultiplier : 1);
    if (activeMult > 1) {
      drawText(`x${activeMult.toFixed(1)}`, x, y + 43, 18, COLORS.aquaDeep, "center");
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
    const target = isNextTargetEntity(entity);
    ctx.save();
    ctx.translate(x + 34, y + 34);
    ctx.scale(0.84, 0.84);
    ctx.translate(-(x + 34), -(y + 34));
    drawGoodItemAura(entity, x + 34, y + 34, color, target);
    drawPixelShadow(x + 10, entity.y - 10, entity.w + 8);
    if (entity.type === "bonus") {
      drawBonusSticker(entity, x, y);
    } else {
      drawIngredientIcon(entity.key, x, y, target);
    }
    if (target) drawFeatureChip(entity, x + entity.w / 2, y - 24);
    drawEntityLabel(entity, x + entity.w / 2, y + 76, target ? "target" : entity.type === "bonus" ? "bonus" : "plain");
    ctx.restore();
  }

  function drawGoodItemAura(entity, cx, cy, color, target) {
    const pulse = 0.45 + Math.sin(entity.anim * 8) * 0.28;
    const strong = target || entity.type === "bonus";
    ctx.save();
    ctx.globalAlpha = strong ? 0.24 + pulse * 0.16 : 0.08;
    drawCircle(cx, cy, strong ? 42 + pulse * 8 : 32, entity.type === "bonus" ? COLORS.yellow : color);
    ctx.globalAlpha = strong ? 0.55 : 0.22;
    for (let i = 0; i < (strong ? 6 : 3); i += 1) {
      const a = entity.anim * 2.6 + i * Math.PI * 2 / (strong ? 6 : 3);
      const r = strong ? 39 : 30;
      fillRect(cx + Math.cos(a) * r - 3, cy + Math.sin(a) * (r * 0.72) - 3, 6, 6, i % 2 ? "#ffffff" : color);
    }
    ctx.restore();
  }

  function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function strokeCircle(x, y, radius, color, width = 2) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawCapsule(x, y, w, h, leftColor, rightColor, border = COLORS.ink) {
    const r = h / 2;
    drawCircle(x + r, y + r, r, leftColor);
    drawCircle(x + w - r, y + r, r, rightColor);
    fillRect(x + r, y, w - h, h, leftColor);
    fillRect(x + w / 2, y, w / 2 - r, h, rightColor);
    strokeRect(x + r - 1, y, w - h + 2, h, border, 2);
    strokeCircle(x + r, y + r, r, border, 2);
    strokeCircle(x + w - r, y + r, r, border, 2);
  }

  function drawStickerBase(x, y, def, required) {
    const pulse = required ? 0.12 + Math.sin(state.time * 16) * 0.04 : 0;
    ctx.save();
    ctx.globalAlpha = 1;
    fillRect(x + 2, y + 6, 64, 60, "rgba(255,255,255,.92)");
    fillRect(x + 6, y + 10, 56, 52, def.bg || "#fff4dc");
    fillRect(x + 10, y + 14, 48, 44, "#ffffff");
    fillRect(x + 12, y + 16, 42, 8, `rgba(255,255,255,${0.56 + pulse})`);
    strokeRect(x + 6, y + 10, 56, 52, def.color, required ? 4 : 3);
    strokeRect(x + 10, y + 14, 48, 44, "rgba(36,50,58,.22)", 2);
    ctx.restore();
  }

  function drawTargetPips(x, y, color) {
    const pulse = Math.sin(state.time * 18) * 3;
    fillRect(x - 3, y + 6, 9, 9, color);
    fillRect(x + 62, y + 6, 9, 9, color);
    fillRect(x - 3, y + 61, 9, 9, color);
    fillRect(x + 62, y + 61, 9, 9, color);
    strokeRect(x - 6 - pulse, y - 7 - pulse, 80 + pulse * 2, 80 + pulse * 2, color, 2);
  }

  function drawIngredientIcon(key, x, y, required) {
    const def = TYPES[key];
    if (required) drawTargetPips(x, y, def.color);
    drawStickerBase(x, y, def, required);
    if (key === "milk") {
      fillRect(x + 21, y + 18, 26, 43, "#f7fdff");
      fillRect(x + 21, y + 18, 13, 9, "#ffffff");
      fillRect(x + 34, y + 18, 13, 9, "#cfefff");
      fillRect(x + 24, y + 30, 20, 17, "#dff6ff");
      drawCircle(x + 29, y + 51, 5, "#ffffff");
      drawCircle(x + 38, y + 51, 5, "#ffffff");
      strokeRect(x + 21, y + 18, 26, 43, COLORS.aquaDeep, 3);
      strokeRect(x + 24, y + 30, 20, 17, COLORS.aquaDeep, 2);
    } else if (key === "culture") {
      drawCapsule(x + 16, y + 28, 36, 15, "#ffffff", COLORS.yellow, COLORS.aquaDeep);
      drawCircle(x + 24, y + 50, 7, "#caeef6");
      drawCircle(x + 38, y + 51, 8, "#caeef6");
      strokeCircle(x + 24, y + 50, 7, COLORS.aquaDeep, 2);
      strokeCircle(x + 38, y + 51, 8, COLORS.aquaDeep, 2);
      for (let i = 0; i < 7; i += 1) {
        const bx = x + 16 + (i % 4) * 10;
        const by = y + 19 + Math.floor(i / 4) * 10;
        drawCircle(bx, by, 3, i % 2 ? COLORS.aquaDeep : COLORS.leaf);
        fillRect(bx + 4, by - 1, 5, 2, i % 2 ? COLORS.aquaDeep : COLORS.leaf);
      }
    } else if (key === "protein") {
      fillRect(x + 17, y + 28, 34, 28, "#fff5eb");
      fillRect(x + 22, y + 20, 24, 10, COLORS.orange);
      drawCircle(x + 32, y + 41, 11, "#ffd2b4");
      fillRect(x + 24, y + 38, 19, 6, COLORS.orange);
      strokeRect(x + 17, y + 28, 34, 28, COLORS.ink, 3);
      strokeRect(x + 22, y + 20, 24, 10, COLORS.ink, 2);
    } else if (key === "calcium") {
      fillRect(x + 15, y + 33, 38, 13, "#dceffc");
      fillRect(x + 27, y + 21, 13, 37, "#dceffc");
      drawCircle(x + 17, y + 29, 7, "#ffffff");
      drawCircle(x + 50, y + 29, 7, "#ffffff");
      drawCircle(x + 17, y + 51, 7, "#ffffff");
      drawCircle(x + 50, y + 51, 7, "#ffffff");
      strokeRect(x + 15, y + 33, 38, 13, "#4b91b6", 3);
      strokeRect(x + 27, y + 21, 13, 37, "#4b91b6", 3);
    } else if (key === "fruit") {
      drawCircle(x + 25, y + 43, 12, COLORS.berry);
      drawCircle(x + 43, y + 45, 11, COLORS.orange);
      drawCircle(x + 35, y + 32, 9, COLORS.leaf);
      strokeCircle(x + 25, y + 43, 12, COLORS.ink, 2);
      strokeCircle(x + 43, y + 45, 11, COLORS.ink, 2);
      fillRect(x + 30, y + 27, 13, 5, "#ffffff");
    } else if (key === "honey") {
      fillRect(x + 17, y + 27, 34, 30, COLORS.yellow);
      fillRect(x + 22, y + 19, 24, 10, "#fff8c6");
      fillRect(x + 25, y + 35, 18, 9, "#fff8c6");
      fillRect(x + 48, y + 20, 4, 27, "#7a5123");
      fillRect(x + 44, y + 27, 12, 5, "#7a5123");
      fillRect(x + 45, y + 34, 10, 5, "#7a5123");
      fillRect(x + 53, y + 42, 5, 9, COLORS.yellow);
      strokeRect(x + 17, y + 27, 34, 30, COLORS.ink, 3);
      strokeRect(x + 22, y + 19, 24, 10, COLORS.ink, 2);
    } else if (key === "oat") {
      for (let i = 0; i < 5; i += 1) {
        const ox = x + 14 + i * 8;
        const oy = y + 26 + (i % 2) * 8;
        fillRect(ox, oy, 10, 19, "#f4e3bf");
        fillRect(ox + 3, oy + 3, 4, 13, "#fff7da");
        strokeRect(ox, oy, 10, 19, "#a47b42", 2);
      }
      fillRect(x + 16, y + 52, 36, 5, "#a47b42");
    } else if (key === "matcha") {
      fillRect(x + 16, y + 39, 38, 16, "#dff0d5");
      fillRect(x + 20, y + 31, 30, 12, "#83c46a");
      fillRect(x + 25, y + 25, 4, 20, "#4f9a4b");
      fillRect(x + 34, y + 23, 4, 22, "#4f9a4b");
      fillRect(x + 43, y + 25, 4, 20, "#4f9a4b");
      strokeRect(x + 16, y + 39, 38, 16, "#4f9a4b", 3);
      strokeRect(x + 20, y + 31, 30, 12, COLORS.ink, 2);
    } else if (key === "cocoa") {
      fillRect(x + 17, y + 24, 34, 32, "#7a4b35");
      for (let row = 0; row < 2; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          fillRect(x + 21 + col * 9, y + 29 + row * 12, 7, 9, "#9b644a");
          strokeRect(x + 21 + col * 9, y + 29 + row * 12, 7, 9, "#4f3025", 1);
        }
      }
      fillRect(x + 13, y + 18, 40, 7, "#efd5c6");
      strokeRect(x + 17, y + 24, 34, 32, COLORS.ink, 3);
    } else if (key === "salt") {
      fillRect(x + 20, y + 25, 28, 32, "#d9f0fb");
      fillRect(x + 23, y + 17, 22, 10, "#ffffff");
      fillRect(x + 24, y + 34, 20, 8, "#ffffff");
      strokeRect(x + 20, y + 25, 28, 32, "#5aa4c8", 3);
      strokeRect(x + 23, y + 17, 22, 10, COLORS.ink, 2);
      for (let i = 0; i < 7; i += 1) fillRect(x + 14 + i * 7, y + 54 + (i % 2) * 3, 4, 4, i % 2 ? "#5aa4c8" : "#ffffff");
    } else if (key === "crunch") {
      for (let i = 0; i < 7; i += 1) {
        const cx = x + 13 + (i % 4) * 11;
        const cy = y + 26 + Math.floor(i / 4) * 15;
        fillRect(cx, cy, 10 + (i % 2) * 3, 9 + (i % 3), i % 2 ? COLORS.yellow : "#d48c32");
        strokeRect(cx, cy, 10 + (i % 2) * 3, 9 + (i % 3), COLORS.ink, 1);
      }
      fillRect(x + 23, y + 50, 23, 6, "#fff8c6");
    } else {
      drawCircle(x + 34, y + 38, 17, def.color);
      strokeCircle(x + 34, y + 38, 17, COLORS.ink, 2);
    }
  }

  function drawStation(entity) {
    const x = Math.round(entity.x);
    const y = Math.round(entity.y - 88);
    const def = TYPES[entity.key];
    const target = isNextTargetEntity(entity);
    ctx.save();
    ctx.translate(x + 52, y + 48);
    ctx.scale(0.86, 0.86);
    ctx.translate(-(x + 52), -(y + 48));
    drawPixelShadow(x + 16, entity.y - 12, entity.w + 20);
    if (target) drawBlinkFrame(x - 8, y - 12, 120, 104, def.color);
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
    } else if (entity.key === "chill") {
      fillRect(x + 22, y + 35, 60, 34, "#ffffff");
      strokeRect(x + 22, y + 35, 60, 34, COLORS.ink, 3);
      for (let i = 0; i < 4; i += 1) {
        fillRect(x + 28 + i * 12, y + 40 + ((entity.anim * 18 + i * 7) % 20), 8, 8, def.color);
      }
    } else if (entity.key === "swirl") {
      fillRect(x + 28, y + 36, 48, 36, "#fff9ef");
      strokeRect(x + 28, y + 36, 48, 36, COLORS.ink, 3);
      drawWhirl(x + 52, y + 54, entity.anim * 1.8, def.color);
      drawWhirl(x + 52, y + 54, -entity.anim * 1.5, COLORS.yellow);
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
    if (target) {
      drawText("碰做", x + 52, y - 15, 17, COLORS.berry, "center");
      drawFeatureChip(entity, x + 52, y - 38);
    }
    drawEntityLabel(entity, x + 52, y + 101, target ? "target" : "plain");
    ctx.restore();
  }

  function drawHazard(entity) {
    const x = Math.round(entity.x);
    const y = Math.round(entity.y - 72 + Math.sin(entity.anim * 8) * 4);
    drawHazardLaneWarning(entity);
    ctx.save();
    ctx.translate(x + 36, y + 36);
    ctx.scale(0.86, 0.86);
    ctx.translate(-(x + 36), -(y + 36));
    drawHazardAlert(entity, x, y);
    drawPixelShadow(x + 10, entity.y - 9, entity.w + 10);
    const pulse = 0.55 + Math.sin(entity.anim * 10) * 0.22;
    fillRect(x - 1, y + 3, 74, 66, `rgba(216,36,60,${0.15 + pulse * 0.08})`);
    for (let i = 0; i < 6; i += 1) {
      fillRect(x + 4 + i * 12, y + 7 + (i % 2) * 8, 7, 55, i % 2 ? "rgba(255,255,255,.72)" : "rgba(168,18,39,.2)");
    }
    fillRect(x + 5, y + 9, 62, 54, "#ffe8ed");
    fillRect(x + 9, y + 13, 54, 11, "rgba(216,36,60,.18)");
    strokeRect(x + 5, y + 9, 62, 54, COLORS.ink, 2);
    strokeRect(x + 5, y + 9, 62, 54, entity.color, 6);
    drawHazardSymbol(entity, x, y);
    drawText("!", x + 36, y + 41, 32, "#ffffff", "center");
    drawText(entity.short, x + 36, y + 74, 15, entity.color, "center");
    fillRect(x - 1, y + 2, 12, 12, entity.color);
    fillRect(x + 61, y + 2, 12, 12, entity.color);
    fillRect(x - 1, y + 58, 12, 12, entity.color);
    fillRect(x + 61, y + 58, 12, 12, entity.color);
    drawEntityLabel(entity, x + 36, y + 88, "danger");
    ctx.restore();
  }

  function drawHazardSymbol(entity, x, y) {
    const c = entity.color;
    fillRect(x + 16, y + 18, 40, 7, c);
    fillRect(x + 16, y + 49, 40, 7, c);
    if (entity.key === "flavor") {
      fillRect(x + 27, y + 24, 18, 29, "#ffffff");
      fillRect(x + 30, y + 18, 12, 8, c);
      fillRect(x + 31, y + 34, 12, 7, c);
      strokeRect(x + 27, y + 24, 18, 29, c, 2);
    } else if (entity.key === "coloring") {
      fillRect(x + 29, y + 21, 14, 12, "#ffffff");
      fillRect(x + 32, y + 32, 8, 18, c);
      fillRect(x + 27, y + 45, 18, 8, c);
      strokeRect(x + 29, y + 21, 14, 12, c, 2);
    } else if (entity.key === "dirty") {
      for (let i = 0; i < 6; i += 1) {
        const dx = x + 18 + (i % 3) * 14;
        const dy = y + 28 + Math.floor(i / 3) * 12;
        fillRect(dx, dy, 9, 9, i % 2 ? "#6f1020" : c);
        fillRect(dx - 2, dy + 3, 13, 3, i % 2 ? "#6f1020" : c);
      }
    } else if (entity.key === "sugar") {
      fillRect(x + 21, y + 30, 17, 17, "#ffffff");
      fillRect(x + 36, y + 25, 17, 17, "#ffd9df");
      strokeRect(x + 21, y + 30, 17, 17, c, 2);
      strokeRect(x + 36, y + 25, 17, 17, c, 2);
    } else if (entity.key === "sour") {
      fillRect(x + 18, y + 35, 36, 9, c);
      fillRect(x + 22, y + 28, 7, 7, c);
      fillRect(x + 36, y + 25, 7, 7, c);
      fillRect(x + 47, y + 32, 7, 7, c);
      drawText("酸", x + 36, y + 45, 18, "#ffffff", "center");
    } else if (entity.key === "ice") {
      fillRect(x + 25, y + 25, 22, 28, "#ffffff");
      strokeRect(x + 25, y + 25, 22, 28, c, 3);
      fillRect(x + 34, y + 25, 4, 28, c);
      fillRect(x + 28, y + 36, 16, 4, c);
    } else if (entity.key === "sticky") {
      fillRect(x + 21, y + 27, 30, 20, c);
      fillRect(x + 24, y + 46, 6, 10, c);
      fillRect(x + 36, y + 46, 6, 12, c);
      fillRect(x + 48, y + 46, 5, 8, c);
      drawText("黏", x + 36, y + 42, 14, "#ffffff", "center");
    } else {
      drawText("!", x + 36, y + 39, 30, c, "center");
    }
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
    fillRect(cx - 4, cy - 42 - pulse * 4, 8, 8, color);
    fillRect(cx - 4, cy + 34 + pulse * 4, 8, 8, color);
    fillRect(cx - 42 - pulse * 4, cy - 4, 8, 8, "#ffffff");
    fillRect(cx + 34 + pulse * 4, cy - 4, 8, 8, "#ffffff");
    ctx.globalAlpha = 0.72;
    for (let i = 0; i < 6; i += 1) {
      const a = entity.anim * 3 + i * Math.PI / 3;
      fillRect(cx + Math.cos(a) * 38 - 3, cy + Math.sin(a) * 29 - 3, 6, 6, i % 2 ? "#ffffff" : color);
    }
    ctx.restore();
  }

  function drawBonusSticker(entity, x, y) {
    const bonus = entity.bonus;
    const color = bonus.color;
    const cx = x + 34;
    const cy = y + 36;
    drawBonusAura(entity, cx, cy, color);
    fillRect(x + 6, y + 10, 58, 54, "#fff8c6");
    fillRect(x + 11, y + 15, 48, 44, "#ffffff");
    strokeRect(x + 6, y + 10, 58, 54, color, 4);
    strokeRect(x + 11, y + 15, 48, 44, "rgba(36,50,58,.2)", 2);

    if (bonus.key === "cleanBoost") {
      fillRect(cx - 18, cy - 13, 36, 30, "#def3df");
      fillRect(cx - 12, cy - 7, 10, 18, COLORS.leaf);
      fillRect(cx - 2, cy + 5, 20, 6, COLORS.leaf);
      strokeRect(cx - 18, cy - 13, 36, 30, COLORS.leaf, 3);
    } else if (bonus.key === "probioticBoost") {
      strokeCircle(cx, cy, 20, COLORS.aquaDeep, 3);
      for (let i = 0; i < 6; i += 1) {
        const a = entity.anim * 4 + i * Math.PI / 3;
        drawCircle(cx + Math.cos(a) * 18, cy + Math.sin(a) * 14, 4, i % 2 ? "#ffffff" : COLORS.aquaDeep);
      }
      drawCapsule(cx - 14, cy - 5, 28, 10, "#ffffff", COLORS.yellow, COLORS.aquaDeep);
    } else if (bonus.key === "calciumBoost") {
      fillRect(cx - 19, cy - 6, 38, 12, "#dceffc");
      fillRect(cx - 6, cy - 19, 12, 38, "#dceffc");
      strokeRect(cx - 19, cy - 6, 38, 12, "#4b91b6", 3);
      strokeRect(cx - 6, cy - 19, 12, 38, "#4b91b6", 3);
    } else if (bonus.key === "rushBoost") {
      fillRect(cx - 6, cy - 22, 12, 44, COLORS.orange);
      fillRect(cx - 22, cy - 6, 44, 12, COLORS.orange);
      fillRect(cx - 13, cy - 13, 26, 26, COLORS.yellow);
      strokeRect(cx - 16, cy - 16, 32, 32, COLORS.ink, 2);
    } else if (bonus.key === "comboBoost") {
      for (let i = 0; i < 5; i += 1) {
        const a = -Math.PI / 2 + i * Math.PI * 0.4;
        fillRect(cx + Math.cos(a) * 18 - 5, cy + Math.sin(a) * 16 - 5, 10, 10, i % 2 ? COLORS.berry : COLORS.yellow);
      }
      strokeCircle(cx, cy, 20, COLORS.yellow, 3);
    } else if (bonus.key === "timeBurst") {
      drawCircle(cx, cy, 19, "#eadfff");
      strokeCircle(cx, cy, 19, COLORS.purple, 3);
      fillRect(cx - 3, cy - 14, 6, 16, COLORS.purple);
      fillRect(cx, cy, 13, 5, COLORS.purple);
      fillRect(cx - 8, cy - 25, 16, 7, COLORS.purple);
    } else {
      drawPixelStar(cx, cy, color);
    }
  }

  function drawHazardAlert(entity, x, y) {
    const close = entity.lane === player.lane && entity.x > player.x + 8 && entity.x - player.x < Math.min(420, state.width * 0.62);
    if (state.phase !== "playing" || !close) return;
    const pulse = 0.5 + Math.sin(state.time * 20) * 0.3;
    ctx.save();
    ctx.globalAlpha = 0.35 + pulse * 0.35;
    for (let i = 0; i < 3; i += 1) {
      const tx = x - 24 - i * 18;
      fillRect(tx, y + 29, 9, 9, entity.color);
      fillRect(tx + 6, y + 38, 9, 9, entity.color);
      fillRect(tx, y + 47, 9, 9, entity.color);
    }
    for (let i = 0; i < 3; i += 1) {
      const tx = x + 78 + i * 14;
      fillRect(tx, y + 30, 9, 8, entity.color);
      fillRect(tx + 6, y + 38, 9, 8, entity.color);
      fillRect(tx, y + 46, 9, 8, entity.color);
    }
    ctx.restore();
  }

  function drawHazardLaneWarning(entity) {
    const close = entity.lane === player.lane && entity.x > player.x + 8 && entity.x - player.x < Math.min(520, state.width * 0.72);
    if (state.phase !== "playing" || !close) return;
    const laneY = state.lanes[entity.lane];
    const pulse = 0.45 + Math.sin(state.time * 18) * 0.25;
    ctx.save();
    ctx.globalAlpha = 0.14 + pulse * 0.1;
    fillRect(0, laneY - 82, state.width, 124, entity.color);
    ctx.globalAlpha = 0.38 + pulse * 0.24;
    for (let x = -40 - (state.time * state.speed * 0.75) % 72; x < state.width + 80; x += 72) {
      fillRect(x, laneY - 74, 34, 8, entity.color);
      fillRect(x + 18, laneY + 28, 34, 8, entity.color);
    }
    ctx.restore();
  }

  function drawEntityLabel(entity, cx, y, mode = "plain") {
    const text = entity.label || entity.short;
    const compact = state.width < 520;
    if (mode !== "target") {
      const color = mode === "danger" ? COLORS.berry : mode === "bonus" ? COLORS.yellow : entity.color || COLORS.ink;
      ctx.save();
      ctx.globalAlpha = mode === "plain" ? 0.86 : 1;
      drawText(text, cx + 1, y + 4, compact ? 11 : 12, "rgba(255,255,255,.86)", "center");
      drawText(text, cx, y + 3, compact ? 11 : 12, color, "center");
      ctx.restore();
      return;
    }
    const width = clamp(text.length * (compact ? 12 : 14) + (mode === "target" ? 30 : 18), compact ? 48 : 56, compact ? 112 : 138);
    const height = mode === "target" ? 24 : 20;
    const bg = "rgba(255,255,255,.96)";
    const border = entity.color || COLORS.ink;
    ctx.save();
    ctx.globalAlpha = 1;
    fillRect(cx - width / 2, y - height / 2, width, height, bg);
    strokeRect(cx - width / 2, y - height / 2, width, height, border, mode === "target" ? 3 : 2);
    fillRect(cx - width / 2 + 3, y - height / 2 + 3, 12, height - 6, border);
    drawText("目標", cx - width / 2 + 32, y + 3, compact ? 10 : 11, border, "center");
    drawText(text, cx + 18, y + 3, compact ? 12 : 13, COLORS.ink, "center");
    ctx.restore();
  }

  function getPlayerReaction() {
    if (player.reactionTimer <= 0) return null;
    const k = player.reactionKey;
    const t = player.reactionTimer;
    const wobble = Math.sin(t * 46);
    const presets = {
      milk: { kind: "milk", dx: wobble * 1.5, dy: -Math.abs(wobble) * 5, rot: wobble * 0.02, sx: 1.08, sy: 0.9 },
      culture: { kind: "float", dx: wobble * 2, dy: -Math.abs(wobble) * 7, rot: wobble * 0.025, sx: 0.96, sy: 1.1 },
      protein: { kind: "power", dx: wobble * 1.5, dy: -2, rot: -0.02, sx: 1.14, sy: 0.88 },
      calcium: { kind: "shield", dx: 0, dy: -1, rot: wobble * 0.012, sx: 0.94, sy: 1.12 },
      fruit: { kind: "fruit", dx: wobble * 4, dy: -Math.abs(wobble) * 2, rot: wobble * 0.04, sx: 1.04, sy: 0.94 },
      honey: { kind: "honey", dx: -Math.abs(wobble), dy: -Math.abs(wobble) * 2, rot: wobble * 0.02, sx: 0.98, sy: 1.06 },
      oat: { kind: "grain", dx: wobble * 1.5, dy: -1, rot: wobble * 0.015, sx: 1.05, sy: 0.96 },
      matcha: { kind: "leaf", dx: wobble * 2, dy: -Math.abs(wobble) * 5, rot: wobble * 0.035, sx: 1.04, sy: 0.96 },
      cocoa: { kind: "power", dx: wobble * 1.5, dy: 1, rot: wobble * 0.02, sx: 1.1, sy: 0.9 },
      salt: { kind: "crystal", dx: wobble * 4, dy: -2, rot: wobble * 0.04, sx: 1.02, sy: 0.98 },
      crunch: { kind: "crunch", dx: wobble * 2, dy: -3, rot: wobble * 0.035, sx: 1.1, sy: 0.86 },
      flavorCombo: { kind: "flavor", dx: wobble * 5, dy: -Math.abs(wobble) * 7, rot: wobble * 0.08, sx: 1.14, sy: 0.86 },
      cleanBoost: { kind: "shield", dx: 0, dy: -2, rot: 0, sx: 1.05, sy: 0.96 },
      probioticBoost: { kind: "float", dx: wobble * 1.5, dy: -Math.abs(wobble) * 5, rot: wobble * 0.02, sx: 1.03, sy: 0.97 },
      calciumBoost: { kind: "shield", dx: 0, dy: -1, rot: 0, sx: 1.04, sy: 0.98 },
      rushBoost: { kind: "boost", dx: wobble * 3, dy: -Math.abs(wobble) * 5, rot: wobble * 0.06, sx: 1.12, sy: 0.88 },
      comboBoost: { kind: "boost", dx: wobble * 2, dy: -3, rot: wobble * 0.04, sx: 1.08, sy: 0.92 },
      timeBurst: { kind: "time", dx: wobble, dy: -2, rot: wobble * 0.02, sx: 1, sy: 1 },
      flavor: { hazard: true, mark: "痛!", dx: wobble * 7, dy: 2, rot: wobble * 0.16, sx: 0.9, sy: 1.12 },
      coloring: { hazard: true, mark: "花!", dx: wobble * 7, dy: 2, rot: wobble * 0.15, sx: 0.92, sy: 1.1 },
      dirty: { hazard: true, mark: "髒!", dx: wobble * 8, dy: 3, rot: wobble * 0.18, sx: 0.88, sy: 1.14 },
      sugar: { hazard: true, mark: "膩!", dx: wobble * 6, dy: 4, rot: wobble * 0.12, sx: 1.1, sy: 0.9 },
      sour: { hazard: true, mark: "牙!", dx: wobble * 8, dy: 1, rot: wobble * 0.18, sx: 0.94, sy: 1.08 },
      ice: { hazard: true, mark: "冷!", dx: wobble * 2, dy: 0, rot: wobble * 0.04, sx: 0.9, sy: 1.16 },
      sticky: { hazard: true, mark: "卡!", dx: -Math.abs(wobble) * 4, dy: Math.abs(wobble) * 4, rot: wobble * 0.08, sx: 0.94, sy: 1.1 },
    };
    return presets[k] || { kind: "spark", dx: wobble * 2, dy: -2, rot: wobble * 0.02, sx: 1.04, sy: 0.96 };
  }

  function drawPlayer() {
    const reaction = getPlayerReaction();
    const x = Math.round(player.x + (reaction?.dx || 0));
    const y = Math.round(player.y - 76 + Math.sin(player.stepBob) * 3 + (reaction?.dy || 0));
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
    ctx.rotate(reaction?.rot || 0);
    ctx.scale(0.74 * (reaction?.sx || 1), 0.74 * (reaction?.sy || 1));
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
    if (reaction?.hazard) {
      fillRect(x - 14, y + 22, 12, 3, COLORS.berry);
      fillRect(x - 12, y + 18, 3, 12, COLORS.berry);
      fillRect(x + 4, y + 22, 12, 3, COLORS.berry);
      fillRect(x + 13, y + 18, 3, 12, COLORS.berry);
    } else if (reaction) {
      fillRect(x - 13, y + 25, 8, 3, player.reactionColor);
      fillRect(x + 6, y + 25, 8, 3, player.reactionColor);
    }
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
    if (reaction) drawPlayerReactionGlyphs(x, y, reaction);
    ctx.restore();
    if (reaction?.hazard) drawPlayerReactionCallout(x, y, reaction);
  }

  function drawPlayerReactionGlyphs(x, y, reaction) {
    const color = player.reactionColor || COLORS.berry;
    const t = state.time;
    ctx.save();
    if (reaction.hazard) {
      drawText(reaction.mark, x + 6, y - 12, 16, color, "center");
      for (let i = 0; i < 5; i += 1) {
        const a = t * 11 + i * Math.PI * 0.42;
        fillRect(x + Math.cos(a) * 35 - 4, y + 24 + Math.sin(a) * 23 - 4, 8, 8, i % 2 ? "#ffffff" : color);
      }
    } else {
      const colors = reaction.kind === "flavor" ? [COLORS.berry, COLORS.yellow, COLORS.leaf, COLORS.purple] : [color, "#ffffff", COLORS.yellow, COLORS.aqua];
      const count = reaction.kind === "flavor" ? 12 : 7;
      const orbitX = reaction.kind === "shield" ? 42 : 34;
      const orbitY = reaction.kind === "milk" || reaction.kind === "float" ? 30 : 24;
      for (let i = 0; i < count; i += 1) {
        const a = t * (reaction.kind === "flavor" ? 6.5 : 4.5) + i * Math.PI * 2 / count;
        const px = x + Math.cos(a) * orbitX;
        const py = y + 28 + Math.sin(a) * orbitY;
        if (reaction.kind === "milk" || reaction.kind === "honey") {
          fillRect(px - 3, py - 6, 6, 12, colors[i % colors.length]);
          fillRect(px - 5, py + 2, 10, 5, colors[i % colors.length]);
        } else if (reaction.kind === "shield" || reaction.kind === "crystal") {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(Math.PI / 4 + t * 2);
          fillRect(-4, -4, 8, 8, colors[i % colors.length]);
          ctx.restore();
        } else {
          fillRect(px - 4, py - 4, 8, 8, colors[i % colors.length]);
        }
      }
      if (reaction.kind === "flavor") {
        strokeRect(x - 45, y - 82, 90, 108, COLORS.berry, 3);
        strokeRect(x - 35, y - 72, 70, 88, COLORS.yellow, 2);
      }
    }
    ctx.restore();
  }

  function drawPlayerReactionCallout(x, y, reaction) {
    const alpha = clamp(player.reactionTimer * 1.8, 0, 1);
    const bob = Math.sin(state.time * 24) * 4;
    const color = player.reactionColor || COLORS.berry;
    const text = reaction.mark || "痛!";
    const w = clamp(text.length * 22 + 32, 64, 118);
    const bx = x + 44;
    const by = y - 34 + bob;
    ctx.save();
    ctx.globalAlpha = alpha;
    fillRect(bx - w / 2, by - 22, w, 34, "rgba(255,255,255,.95)");
    strokeRect(bx - w / 2, by - 22, w, 34, color, 4);
    fillRect(bx - 8, by + 10, 16, 10, "rgba(255,255,255,.95)");
    strokeRect(bx - 8, by + 10, 16, 10, color, 3);
    drawText(text, bx, by + 2, 21, color, "center");
    for (let i = 0; i < 6; i += 1) {
      const a = state.time * 10 + i * Math.PI / 3;
      const r = 34 + (i % 2) * 8;
      fillRect(x + Math.cos(a) * r - 4, y + 32 + Math.sin(a) * 24 - 4, 8, 8, i % 2 ? "#ffffff" : color);
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
    } else if (burst.type === "impact") {
      drawImpactBurst(burst, alpha, progress);
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

  function drawImpactBurst(burst, alpha, progress) {
    const x = burst.x;
    const y = burst.y;
    const size = burst.radius + burst.grow * progress;
    const color = burst.color;
    const spin = burst.angle + burst.spin * progress;
    ctx.globalAlpha = alpha * 0.88;

    if (burst.style === "splash") {
      strokeRect(x - size / 2, y - size / 2, size, size, color, 4);
      strokeRect(x - size * 0.34, y - size * 0.34, size * 0.68, size * 0.68, "#ffffff", 3);
      drawImpactSatellites(x, y, size * 0.45, spin, 8, color, 6);
    } else if (burst.style === "orbit" || burst.style === "magnet") {
      strokeRect(x - size / 2, y - size * 0.32, size, size * 0.64, color, 3);
      strokeRect(x - size * 0.32, y - size / 2, size * 0.64, size, "#ffffff", 2);
      drawImpactSatellites(x, y, size * 0.48, spin * 1.6, 10, color, 5);
    } else if (burst.style === "punch") {
      fillRect(x - size * 0.48, y - 5, size * 0.96, 10, color);
      fillRect(x - 5, y - size * 0.48, 10, size * 0.96, "#ffffff");
      strokeRect(x - size * 0.3, y - size * 0.3, size * 0.6, size * 0.6, color, 5);
    } else if (burst.style === "crystal" || burst.style === "slow") {
      strokeRect(x - size / 2, y - size / 2, size, size, color, 3);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4 + spin);
      strokeRect(-size * 0.36, -size * 0.36, size * 0.72, size * 0.72, "#ffffff", 2);
      ctx.restore();
      drawImpactSatellites(x, y, size * 0.52, spin, 6, color, 7);
    } else if (burst.style === "confetti") {
      drawImpactSatellites(x, y, size * 0.32, spin, 12, COLORS.berry, 7);
      drawImpactSatellites(x, y, size * 0.5, -spin, 10, COLORS.orange, 5);
    } else if (burst.style === "drip" || burst.style === "filter") {
      for (let i = -2; i <= 2; i += 1) {
        const h = size * (0.34 + (i + 3) * 0.05);
        fillRect(x + i * 14 - 4, y - size * 0.24, 8, h, i % 2 ? "#ffffff" : color);
      }
      strokeRect(x - size * 0.42, y - size * 0.28, size * 0.84, size * 0.22, color, 3);
    } else if (burst.style === "vortex") {
      for (let i = 0; i < 12; i += 1) {
        const a = spin + i * 0.72;
        const r = size * (0.12 + i * 0.035);
        fillRect(x + Math.cos(a) * r - 4, y + Math.sin(a) * r - 4, 8, 8, i % 3 ? color : "#ffffff");
      }
      strokeRect(x - size * 0.42, y - size * 0.42, size * 0.84, size * 0.84, color, 2);
    } else if (burst.style === "bubble") {
      for (let i = 0; i < 5; i += 1) {
        const s = size * (0.2 + i * 0.09);
        strokeRect(x - s / 2 + i * 8 - 16, y - s / 2 - i * 8, s, s, i % 2 ? "#ffffff" : color, 2);
      }
    } else if (burst.style === "scan") {
      fillRect(x - size * 0.68, y - 18, size * 1.36, 6, "#ffffff");
      fillRect(x - size * 0.58, y, size * 1.16, 7, color);
      fillRect(x - size * 0.46, y + 18, size * 0.92, 5, "#ffffff");
      strokeRect(x - size * 0.38, y - size * 0.38, size * 0.76, size * 0.76, color, 3);
    } else if (burst.style === "ribbon") {
      for (let i = -3; i <= 3; i += 1) {
        fillRect(x + i * 12, y + Math.sin(i + progress * 7) * 18, 18, 6, i % 2 ? "#ffffff" : color);
      }
      strokeRect(x - size * 0.46, y - size * 0.28, size * 0.92, size * 0.56, color, 2);
    } else if (burst.style === "stamp") {
      fillRect(x - size * 0.34, y - size * 0.28, size * 0.68, size * 0.56, "rgba(255,255,255,.82)");
      strokeRect(x - size * 0.34, y - size * 0.28, size * 0.68, size * 0.56, color, 5);
      fillRect(x - size * 0.22, y - 4, size * 0.44, 8, color);
    } else if (burst.style === "speed") {
      for (let i = 0; i < 6; i += 1) {
        fillRect(x - size * 0.72 - i * 18, y - 24 + i * 9, size * 1.05, 5, i % 2 ? "#ffffff" : color);
      }
      strokeRect(x - size * 0.16, y - size * 0.28, size * 0.5, size * 0.56, color, 3);
    } else if (burst.style === "shield") {
      strokeRect(x - size * 0.52, y - size * 0.52, size * 1.04, size * 1.04, color, 5);
      strokeRect(x - size * 0.34, y - size * 0.34, size * 0.68, size * 0.68, "#ffffff", 3);
      fillRect(x - 6, y - size * 0.3, 12, size * 0.6, color);
    } else if (burst.style === "hazard") {
      fillRect(x - size * 0.45, y - 5, size * 0.9, 10, color);
      fillRect(x - 5, y - size * 0.45, 10, size * 0.9, color);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      fillRect(-size * 0.48, -4, size * 0.96, 8, "#ffffff");
      ctx.restore();
    } else {
      strokeRect(x - size / 2, y - size / 2, size, size, color, 4);
      drawImpactSatellites(x, y, size * 0.45, spin, 8, color, 6);
    }
  }

  function drawImpactSatellites(x, y, radius, spin, count, color, size) {
    for (let i = 0; i < count; i += 1) {
      const a = spin + (i / count) * Math.PI * 2;
      fillRect(x + Math.cos(a) * radius - size / 2, y + Math.sin(a) * radius - size / 2, size, size, i % 2 ? "#ffffff" : color);
    }
  }

  function drawParticle(particle) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle || 0);
    if (particle.shape === "line") {
      fillRect(-particle.size * 1.8, -particle.size / 2, particle.size * 3.6, particle.size, particle.color);
    } else if (particle.shape === "diamond" || particle.shape === "shard") {
      ctx.rotate(Math.PI / 4);
      fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size, particle.color);
    } else if (particle.shape === "drop") {
      fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.45, particle.color);
      fillRect(-particle.size * 0.25, -particle.size, particle.size * 0.5, particle.size * 0.5, "#ffffff");
    } else if (particle.shape === "bubble") {
      strokeRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size, particle.color, 2);
      fillRect(-1, -1, 2, 2, "#ffffff");
    } else if (particle.shape === "confetti") {
      fillRect(-particle.size, -particle.size / 2, particle.size * 2, particle.size, particle.color);
    } else if (particle.shape === "zig") {
      fillRect(-particle.size, -particle.size / 2, particle.size * 1.4, particle.size, particle.color);
      fillRect(0, 0, particle.size * 1.4, particle.size, "#ffffff");
    } else if (particle.shape === "block") {
      fillRect(-particle.size / 2, -particle.size / 2, particle.size * 1.2, particle.size * 1.2, particle.color);
      strokeRect(-particle.size / 2, -particle.size / 2, particle.size * 1.2, particle.size * 1.2, "rgba(36,50,58,.28)", 1);
    } else {
      fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size, particle.color);
    }
    ctx.restore();
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

  function drawFlavorRushOverlay() {
    const countdown = state.flavorCountdown > 0;
    const alpha = countdown ? 0.18 + Math.sin(state.time * 28) * 0.06 : 0.1 + Math.sin(state.time * 18) * 0.04;
    const label = countdown ? state.flavorPending?.label || "自搭配" : state.flavorComboLabel;
    const centerX = state.width * 0.5;
    const top = state.width < 520 ? 300 : 138;
    ctx.save();
    ctx.globalAlpha = alpha;
    fillRect(0, 0, state.width, state.height, countdown ? COLORS.yellow : COLORS.berry);
    ctx.globalAlpha = countdown ? 0.72 : 0.46;
    for (let i = 0; i < 18; i += 1) {
      const x = (i * 83 + state.time * (countdown ? 520 : 720)) % (state.width + 160) - 80;
      const y = top + ((i * 47 + state.time * 260) % Math.max(180, state.height - top - 120));
      fillRect(x, y, 44 + (i % 4) * 16, i % 2 ? 8 : 5, i % 3 ? "#ffffff" : COLORS.yellow);
    }
    ctx.globalAlpha = 1;
    const w = clamp((label || "").length * 15 + 138, 190, state.width - 34);
    const h = countdown ? 54 : 46;
    const y = top + (countdown ? 38 : 22);
    fillRect(centerX - w / 2, y - h / 2, w, h, "rgba(255,255,255,.94)");
    strokeRect(centerX - w / 2, y - h / 2, w, h, countdown ? COLORS.yellow : COLORS.berry, 4);
    fillRect(centerX - w / 2 + 8, y - h / 2 + 8, 12, h - 16, countdown ? COLORS.yellow : COLORS.berry);
    drawText(countdown ? "JUICY READY" : `JUICY x${state.flavorMultiplier.toFixed(1)}`, centerX, y - 4, countdown ? 18 : 17, countdown ? COLORS.orange : COLORS.berry, "center");
    if (label) drawText(label, centerX, y + 18, 15, COLORS.ink, "center");
    ctx.restore();
  }

  function drawSpeedLines() {
    if (state.speedLineTime <= 0 && state.comboSurge <= 0) return;
    const alpha = clamp(state.speedLineTime * 2.6 + state.comboSurge * 0.16, 0, 0.72);
    const baseY = state.lanes[player.lane] - 62;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 0; i < 16; i += 1) {
      const y = baseY + ((i * 37 + state.time * 820) % 178) - 62;
      const x = state.width - ((i * 91 + state.time * 1100) % (state.width + 220));
      const w = 70 + (i % 4) * 30;
      fillRect(x, y, w, i % 3 === 0 ? 6 : 4, i % 2 ? "rgba(255,255,255,.86)" : state.flashColor);
    }
    ctx.globalAlpha = alpha * 0.28;
    fillRect(0, baseY - 64, state.width, 132, state.flashColor);
    ctx.restore();
  }

  function drawScreenFlash() {
    if (state.flash <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(0.38, state.flash * 0.45);
    fillRect(0, 0, state.width, state.height, state.flashColor);
    ctx.globalAlpha = Math.min(0.26, state.flash * 0.3);
    fillRect(0, 0, state.width, state.height, "#ffffff");
    ctx.restore();
  }

  function drawActiveEffects() {
    if (state.phase !== "playing") return;
    const items = [];
    if (state.shield > 0) items.push({ text: `盾x${state.shield}`, color: COLORS.leaf });
    if (state.magnetTime > 0) items.push({ text: `磁${Math.ceil(state.magnetTime)}`, color: COLORS.aquaDeep });
    if (state.slowTime > 0) items.push({ text: `慢${Math.ceil(state.slowTime)}`, color: COLORS.purple });
    if (state.brandHeat > 0) items.push({ text: `熱${state.brandHeat}`, color: COLORS.yellow });
    if (state.flavorRushTime > 0) items.push({ text: `搭x${state.flavorMultiplier.toFixed(1)}`, color: COLORS.berry });
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
    if (state.flavorRushTime > 0) {
      ctx.globalAlpha = 0.45 + Math.sin(state.time * 14) * 0.16;
      const orbit = 52;
      const colors = [COLORS.berry, COLORS.yellow, COLORS.leaf, COLORS.purple];
      for (let i = 0; i < 10; i += 1) {
        const a = state.time * 3.6 + i * Math.PI * 0.2;
        fillRect(player.x + Math.cos(a) * orbit - 5, player.y - 48 + Math.sin(a) * 34 - 5, 10, 10, colors[i % colors.length]);
      }
    }
    ctx.restore();
    const startX = player.x - (items.length * 42) / 2 + 21;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const x = startX + i * 42;
      const y = player.y - 112;
      const w = clamp(item.text.length * 10 + 12, 30, 52);
      fillRect(x - w / 2, y - 11, w, 22, "rgba(255,255,255,.86)");
      strokeRect(x - w / 2, y - 11, w, 22, item.color, 2);
      drawText(item.text, x, y + 1, item.text.length > 4 ? 10 : 11, item.color, "center");
    }
  }

  function drawTouchCursor() {
    if (touch.id === null || !Number.isFinite(touch.targetX)) return;
    const x = Math.round(touch.targetX);
    const y = state.lanes[player.lane];
    const pulse = 0.5 + Math.sin(state.time * 16) * 0.28;
    ctx.save();
    ctx.globalAlpha = 0.2 + pulse * 0.18;
    fillRect(x - 27, y - 105, 54, 132, COLORS.aquaDeep);
    ctx.globalAlpha = 0.76;
    strokeRect(x - 30, y - 108, 60, 138, "#ffffff", 3);
    strokeRect(x - 22, y - 96, 44, 116, COLORS.aquaDeep, 3);
    fillRect(x - 4, y - 118, 8, 20, "#ffffff");
    fillRect(x - 4, y + 22, 8, 20, "#ffffff");
    fillRect(x - 40, y - 42, 20, 8, "#ffffff");
    fillRect(x + 20, y - 42, 20, 8, "#ffffff");
    ctx.restore();
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

  function impactCenter(entity) {
    return { x: entity.x + entity.w / 2, y: entity.y - entity.h * 0.7 };
  }

  function emitFlavorPreview(x, y, color) {
    emitRingBurst(x, y, COLORS.yellow, 3, 30);
    emitImpactBurst(x, y, color, "vortex", 1.15);
    emitImpactParticles(x, y, [color, COLORS.yellow, COLORS.berry, "#ffffff"], 30, {
      spread: Math.PI * 2,
      speedMin: 70,
      speedMax: 230,
      friction: 0.92,
      spin: 18,
      shape: "line",
      sizeMin: 4,
      sizeMax: 12,
      lifeMin: 0.42,
      lifeMax: 0.9,
    });
    trimParticles();
  }

  function emitFlavorRushStart(x, y, color, firstKey, secondKey) {
    const first = TYPES[firstKey]?.color || COLORS.berry;
    const second = TYPES[secondKey]?.color || COLORS.yellow;
    emitImpactBurst(x, y, color, "confetti", 1.75);
    emitImpactBurst(x, y, COLORS.yellow, "vortex", 1.25);
    emitImpactParticles(x, y, [first, second, COLORS.berry, COLORS.yellow, "#ffffff"], 58, {
      start: Math.PI,
      spread: Math.PI * 1.35,
      speedMin: 190,
      speedMax: 520,
      friction: 0.975,
      gravity: 80,
      spin: 22,
      shape: "confetti",
      sizeMin: 5,
      sizeMax: 13,
      lifeMin: 0.55,
      lifeMax: 1.15,
      jitter: 34,
    });
    emitImpactParticles(x, y, [first, second, "#ffffff"], 34, {
      spread: Math.PI * 2,
      speedMin: 120,
      speedMax: 360,
      friction: 0.9,
      spin: 28,
      shape: "spark",
      sizeMin: 4,
      sizeMax: 10,
      lifeMin: 0.44,
      lifeMax: 0.82,
    });
    trimParticles();
  }

  function emitElementImpact(key, entity, color, perfect) {
    const { x, y } = impactCenter(entity);
    const intensity = perfect ? 1.35 : 1;
    const styles = {
      milk: "splash",
      culture: "orbit",
      protein: "punch",
      calcium: "crystal",
      fruit: "confetti",
      honey: "drip",
      oat: "filter",
      matcha: "scan",
      cocoa: "punch",
      salt: "crystal",
      crunch: "confetti",
      mix: "vortex",
      ferment: "bubble",
      strain: "filter",
      qc: "scan",
      texture: "ribbon",
      chill: "crystal",
      swirl: "vortex",
      pack: "stamp",
      ship: "speed",
    };
    emitImpactBurst(x, y, color, styles[key] || "spark", intensity);

    if (key === "milk") {
      emitImpactParticles(x, y, ["#ffffff", "#dff6ff", color], Math.round(18 * intensity), { start: -Math.PI / 2, spread: Math.PI * 1.45, speedMin: 90, speedMax: 250, gravity: 260, shape: "drop", sizeMin: 4, sizeMax: 9 });
    } else if (key === "culture") {
      emitImpactParticles(x, y, [color, COLORS.aqua, "#ffffff"], Math.round(16 * intensity), { spread: Math.PI * 2, speedMin: 80, speedMax: 190, gravity: -20, friction: 0.965, spin: 8, shape: "diamond" });
    } else if (key === "protein") {
      emitImpactParticles(x, y, [color, COLORS.yellow, "#ffffff"], Math.round(14 * intensity), { start: -Math.PI / 2, spread: Math.PI * 0.8, speedMin: 150, speedMax: 310, gravity: 340, shape: "block", sizeMin: 6, sizeMax: 12 });
    } else if (key === "calcium") {
      emitImpactParticles(x, y, [color, "#dceffc", "#ffffff"], Math.round(18 * intensity), { spread: Math.PI * 2, speedMin: 95, speedMax: 230, friction: 0.94, spin: 5, shape: "diamond", grow: -2 });
    } else if (key === "fruit") {
      emitImpactParticles(x, y, [COLORS.berry, COLORS.orange, COLORS.leaf, "#ffffff"], Math.round(22 * intensity), { start: -Math.PI / 2, spread: Math.PI * 1.65, speedMin: 120, speedMax: 290, gravity: 260, spin: 12, shape: "confetti" });
    } else if (key === "honey") {
      emitImpactParticles(x, y, [color, COLORS.yellow, "#fff8c6"], Math.round(17 * intensity), { start: Math.PI / 2, spread: Math.PI * 0.42, speedMin: 35, speedMax: 120, gravity: 120, shape: "line", sizeMin: 5, sizeMax: 11, grow: 5 });
    } else if (key === "oat") {
      emitImpactParticles(x, y, [color, "#f4e3bf", "#ffffff"], Math.round(17 * intensity), { start: -Math.PI / 2, spread: Math.PI * 1.1, speedMin: 75, speedMax: 210, gravity: 180, spin: 7, shape: "block", sizeMin: 4, sizeMax: 9 });
    } else if (key === "matcha") {
      emitImpactParticles(x, y, [color, "#dff0d5", "#ffffff"], Math.round(22 * intensity), { spread: Math.PI * 2, speedMin: 130, speedMax: 320, friction: 0.97, spin: 18, shape: "line", sizeMin: 4, sizeMax: 10 });
    } else if (key === "cocoa") {
      emitImpactParticles(x, y, [color, "#efd5c6", COLORS.yellow], Math.round(20 * intensity), { start: -Math.PI / 2, spread: Math.PI, speedMin: 170, speedMax: 350, gravity: 330, spin: 11, shape: "shard", sizeMin: 5, sizeMax: 11 });
    } else if (key === "salt") {
      emitImpactParticles(x, y, [color, "#ffffff", "#d9f0fb"], Math.round(24 * intensity), { spread: Math.PI * 2, speedMin: 140, speedMax: 310, friction: 0.95, spin: 9, shape: "diamond", sizeMin: 4, sizeMax: 9 });
    } else if (key === "crunch") {
      emitImpactParticles(x, y, [color, COLORS.yellow, "#ffffff"], Math.round(26 * intensity), { start: -Math.PI / 2, spread: Math.PI * 1.4, speedMin: 150, speedMax: 360, gravity: 300, spin: 18, shape: "block", sizeMin: 4, sizeMax: 10 });
    } else if (key === "mix") {
      emitImpactParticles(x, y, [color, COLORS.aqua, "#ffffff"], Math.round(19 * intensity), { spread: Math.PI * 2, speedMin: 70, speedMax: 210, friction: 0.92, spin: 11, shape: "line" });
    } else if (key === "ferment") {
      emitImpactParticles(x, y, [color, "#def3df", "#ffffff"], Math.round(18 * intensity), { start: -Math.PI / 2, spread: Math.PI * 0.95, speedMin: 55, speedMax: 180, gravity: -35, friction: 0.97, shape: "bubble", grow: 10 });
    } else if (key === "strain") {
      emitImpactParticles(x, y, [color, "#f4e0cf", "#ffffff"], Math.round(18 * intensity), { start: Math.PI / 2, spread: Math.PI * 0.28, speedMin: 50, speedMax: 155, gravity: 65, shape: "line", sizeMin: 5, sizeMax: 12 });
    } else if (key === "qc") {
      emitImpactParticles(x, y, [color, "#ffffff"], Math.round(16 * intensity), { start: 0, spread: Math.PI * 0.2, speedMin: 160, speedMax: 340, friction: 0.96, shape: "line", sizeMin: 4, sizeMax: 9 });
      emitImpactParticles(x, y, [color, "#ffffff"], Math.round(10 * intensity), { start: Math.PI, spread: Math.PI * 0.2, speedMin: 140, speedMax: 260, friction: 0.96, shape: "line", sizeMin: 4, sizeMax: 8 });
    } else if (key === "texture") {
      emitImpactParticles(x, y, [color, COLORS.yellow, "#ffffff"], Math.round(20 * intensity), { spread: Math.PI * 2, speedMin: 90, speedMax: 230, friction: 0.94, spin: 15, shape: "zig" });
    } else if (key === "chill") {
      emitImpactParticles(x, y, [color, "#dceffc", "#ffffff"], Math.round(22 * intensity), { spread: Math.PI * 2, speedMin: 80, speedMax: 230, friction: 0.91, spin: 7, shape: "diamond", grow: -3 });
    } else if (key === "swirl") {
      emitImpactParticles(x, y, [color, COLORS.yellow, "#ffffff"], Math.round(28 * intensity), { spread: Math.PI * 2, speedMin: 120, speedMax: 330, friction: 0.9, spin: 20, shape: "line", sizeMin: 4, sizeMax: 12 });
    } else if (key === "pack") {
      emitImpactParticles(x, y, [color, "#eadfff", "#ffffff"], Math.round(16 * intensity), { spread: Math.PI * 2, speedMin: 80, speedMax: 210, gravity: 140, spin: 8, shape: "block", sizeMin: 5, sizeMax: 11 });
    } else if (key === "ship") {
      emitImpactParticles(x - 8, y, [color, "#ffffff", "#dceffc"], Math.round(20 * intensity), { start: 0, spread: Math.PI * 0.32, speedMin: 180, speedMax: 420, friction: 0.98, shape: "line", sizeMin: 5, sizeMax: 12 });
    }
    trimParticles();
  }

  function emitBonusImpact(key, entity, color) {
    const { x, y } = impactCenter(entity);
    const style = key === "cleanBoost" ? "shield" : key === "probioticBoost" ? "magnet" : key === "rushBoost" ? "speed" : key === "comboBoost" ? "confetti" : key === "timeBurst" ? "stamp" : "slow";
    emitImpactBurst(x, y, color, style, 1.25);
    emitImpactParticles(x, y, [color, "#ffffff", COLORS.yellow], 24, { spread: Math.PI * 2, speedMin: 100, speedMax: 280, friction: 0.95, spin: 10, shape: key === "calciumBoost" ? "diamond" : "spark" });
    trimParticles();
  }

  function emitHazardImpact(entity) {
    const { x, y } = impactCenter(entity);
    emitImpactBurst(x, y, entity.color, "hazard", 1.15);
    emitImpactParticles(x, y, [entity.color, "#6b513f", "#ffffff"], 18, { spread: Math.PI * 2, speedMin: 110, speedMax: 260, gravity: 260, spin: 9, shape: "shard", sizeMin: 5, sizeMax: 11 });
    trimParticles();
  }

  function emitScreenSparks(x, y, color, count) {
    emitImpactParticles(x, y, [color, "#ffffff", COLORS.yellow], count, {
      start: Math.PI,
      spread: Math.PI * 0.7,
      speedMin: 180,
      speedMax: 460,
      friction: 0.985,
      spin: 16,
      shape: "line",
      sizeMin: 5,
      sizeMax: 13,
      lifeMin: 0.32,
      lifeMax: 0.62,
      jitter: 28,
    });
  }

  function emitImpactBurst(x, y, color, style, intensity = 1) {
    state.bursts.push({
      type: "impact",
      style,
      x,
      y,
      radius: 30 * intensity,
      grow: 58 * intensity,
      thickness: 4,
      color,
      angle: random(0, Math.PI),
      spin: random(-5, 5),
      life: 0.52 * intensity,
      maxLife: 0.52 * intensity,
    });
    trimBursts();
  }

  function emitImpactParticles(x, y, colors, count, options = {}) {
    const spread = options.spread ?? Math.PI * 2;
    const start = options.start ?? 0;
    const speedMin = options.speedMin ?? 80;
    const speedMax = options.speedMax ?? 220;
    const jitter = options.jitter ?? 14;
    for (let i = 0; i < count; i += 1) {
      const angle = start + random(-spread / 2, spread / 2);
      const speed = random(speedMin, speedMax);
      const life = random(options.lifeMin || 0.44, options.lifeMax || 0.9);
      state.particles.push({
        x: x + random(-jitter, jitter),
        y: y + random(-jitter * 0.7, jitter * 0.7),
        vx: Math.cos(angle) * speed + (options.vx || 0),
        vy: Math.sin(angle) * speed + (options.vy || 0),
        gravity: options.gravity || 0,
        friction: options.friction,
        angle: random(0, Math.PI),
        spin: random(-(options.spin || 0), options.spin || 0),
        grow: options.grow || 0,
        shape: options.shape || "square",
        size: randomInt(options.sizeMin || 3, options.sizeMax || 8),
        color: colors[i % colors.length],
        life,
        maxLife: life,
      });
    }
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
    const required = isNextTargetEntity(entity);
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
    const arcadeReach = (state.width < 620 ? 8 : 0) + Math.min(12, Math.floor(state.combo / 4) * 2);
    return { x: player.x - 23 - arcadeReach, y: player.y - 76, w: 46 + arcadeReach * 2, h: 78 };
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
        const status = index < state.stepIndex ? "完成" : index === state.stepIndex ? (step.mode === "work" ? "碰做" : "接") : "待";
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
      const idleText = state.idleTime > 1 ? "紅色危險物正在追線，滑動躲開" : "主動接好料，紅色添加物要閃開";
      dom.fact.textContent =
        current.mode === "work"
          ? `${pressureText} / ${idleText} / 挑戰：${missionText} / ${featureText}，處理「${def.label}」。`
          : `${pressureText} / ${idleText} / 挑戰：${missionText} / ${featureText}，接「${def.label}」。`;
    }
  }

  function buildCarryText() {
    const tags = [];
    if (state.multiplier > 1) tags.push(`x${state.multiplier.toFixed(1)}`);
    if (state.shield > 0) tags.push(`盾${state.shield}`);
    if (state.magnetTime > 0) tags.push(`磁${Math.ceil(state.magnetTime)}`);
    if (state.slowTime > 0) tags.push(`慢${Math.ceil(state.slowTime)}`);
    if (state.brandHeat > 0) tags.push(`熱${state.brandHeat}`);
    if (state.flavorRushTime > 0) tags.push(`自搭x${state.flavorMultiplier.toFixed(1)}`);
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
    resetPointerControl();
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
      audio.bgmGain.gain.linearRampToValueAtTime(audio.muted ? 0 : 0.095, audio.context.currentTime + 0.18);
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
      if (audio.context.state === "suspended") return audio.context.resume?.();
      return null;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audio.context = new AudioContext();
    audio.sfxGain = audio.context.createGain();
    audio.bgmGain = audio.context.createGain();
    audio.sfxGain.gain.value = 0.64;
    audio.bgmGain.gain.value = 0;
    audio.sfxGain.connect(audio.context.destination);
    audio.bgmGain.connect(audio.context.destination);
    if (audio.context.state === "suspended") return audio.context.resume?.();
    return null;
  }

  function beep(frequency, duration, type, volume) {
    if (audio.muted || !audio.context || audio.context.state === "suspended") return;
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
    const resumed = ensureAudio();
    if (audio.muted || !audio.context || !audio.bgmGain) return;
    if (audio.context.state === "suspended") {
      Promise.resolve(resumed).then(() => {
        if (!audio.muted && state.phase === "playing") startBgm(reset);
      });
      return;
    }
    if (reset || !audio.bgmTimer) {
      audio.bgmStep = 0;
      audio.bgmNextTime = audio.context.currentTime + 0.05;
    }
    const now = audio.context.currentTime;
    const volume = state.openingMode ? 0.108 : 0.095;
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
    const tempo = BGM.bpm + Math.min(10, Math.max(0, state.level - 1) * 0.45) + (state.flavorRushTime > 0 ? 6 : 0) + (state.feverTime > 0 ? 5 : 0);
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
    if (barStep === 0 || barStep === 8) {
      const chord = BGM.chords[Math.floor(step / 8) % BGM.chords.length];
      for (const note of chord) playTone(noteToFrequency(note), time, stepSeconds * 7.5, "sine", 0.034, 0.16, 1400);
    }
    if (beat === 0) playPerc(time, fever ? 0.012 : 0.008, 82, 0.045);
    if (barStep === 10 || fever && barStep === 6 || state.flavorRushTime > 0 && barStep === 14) playPerc(time + stepSeconds * 0.5, 0.006, 430, 0.02);

    const bass = BGM.bass[step];
    if (bass) playTone(noteToFrequency(bass), time, stepSeconds * 2.8, "sine", 0.09, 0.035, 820);

    const melody = BGM.melody[step];
    if (melody) {
      playTone(noteToFrequency(melody), time, stepSeconds * 2.35, "triangle", fever ? 0.125 : 0.104, 0.03, 2300);
      if (fever && (step % 8 === 2 || step % 8 === 4)) {
        playTone(noteToFrequency(melody) * 1.5, time + stepSeconds * 0.06, stepSeconds * 1.4, "sine", 0.03, 0.025, 2400);
      }
    }

    const hook = BGM.hook[step];
    if (hook && (barStep === 2 || barStep === 6 || barStep === 10 || barStep === 14 || state.flavorRushTime > 0)) {
      playTone(noteToFrequency(hook), time + stepSeconds * 0.5, stepSeconds * 1.3, "sine", state.flavorRushTime > 0 ? 0.062 : 0.038, 0.018, 3000);
    }

    const sparkle = BGM.sparkle[step];
    if (sparkle && (fever || state.flavorRushTime > 0 || step % 8 === 7 || state.combo >= 10)) {
      playTone(noteToFrequency(sparkle), time + stepSeconds * 0.22, stepSeconds * 1.2, "sine", state.flavorRushTime > 0 ? 0.058 : 0.04, 0.022, 3400);
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
