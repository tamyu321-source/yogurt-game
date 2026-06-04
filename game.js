(() => {
  const canvas = document.getElementById("sceneCanvas");
  let ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const dom = {
    root: document.querySelector(".game-root"),
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
    pauseOverlay: document.getElementById("pauseOverlay"),
    pauseLandmarkTitle: document.getElementById("pauseLandmarkTitle"),
    pauseGameVisual: document.getElementById("pauseGameVisual"),
    pauseRealVisual: document.getElementById("pauseRealVisual"),
    pauseGameCaption: document.getElementById("pauseGameCaption"),
    pauseRealCaption: document.getElementById("pauseRealCaption"),
    pauseOverview: document.getElementById("pauseOverview"),
    pauseRealLook: document.getElementById("pauseRealLook"),
    pauseSourceLink: document.getElementById("pauseSourceLink"),
    pauseContinueButton: document.getElementById("pauseContinueButton"),
    startOverlay: document.getElementById("startOverlay"),
    gameOverOverlay: document.getElementById("gameOverOverlay"),
    startButton: document.getElementById("startButton"),
    restartButton: document.getElementById("restartButton"),
    shareButton: document.getElementById("shareButton"),
    muteButton: document.getElementById("muteButton"),
    muteIcon: document.getElementById("muteIcon"),
    pauseButton: document.getElementById("pauseButton"),
    pauseIcon: document.getElementById("pauseIcon"),
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
  const SCORE_KEY = "ugoodays-arcade-leaderboard";
  const HIGH_KEY = "ugoodays-arcade-high-score";
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

  const WEATHER_DEFS = {
    sunny: { label: "晴天", cloud: 0.08, rain: 0, fog: 0, snow: 0, wind: 0, tint: "rgba(255,240,176,.08)" },
    cloudy: { label: "陰天", cloud: 0.72, rain: 0, fog: 0.1, snow: 0, wind: 0.12, tint: "rgba(100,126,140,.12)" },
    lightRain: { label: "小雨", cloud: 0.68, rain: 0.36, fog: 0.08, snow: 0, wind: 0.16, tint: "rgba(91,129,152,.13)" },
    rain: { label: "中雨", cloud: 0.82, rain: 0.66, fog: 0.13, snow: 0, wind: 0.22, tint: "rgba(64,103,134,.18)" },
    heavyRain: { label: "大雨", cloud: 0.92, rain: 1, fog: 0.16, snow: 0, wind: 0.34, tint: "rgba(42,79,112,.24)" },
    snow: { label: "下雪", cloud: 0.76, rain: 0, fog: 0.18, snow: 0.78, wind: 0.12, tint: "rgba(218,238,248,.2)" },
    fog: { label: "大霧天", cloud: 0.62, rain: 0, fog: 0.82, snow: 0, wind: 0.06, tint: "rgba(220,238,238,.3)" },
    typhoon: { label: "颱風", cloud: 1, rain: 1.15, fog: 0.22, snow: 0, wind: 1, tint: "rgba(24,55,82,.32)" },
  };

  const WEATHER_PROFILES = [
    { sunny: 54, cloudy: 15, lightRain: 14, rain: 6, heavyRain: 2, snow: 0, fog: 7, typhoon: 2 },
    { sunny: 48, cloudy: 12, lightRain: 9, rain: 8, heavyRain: 8, snow: 0, fog: 4, typhoon: 11 },
    { sunny: 58, cloudy: 14, lightRain: 8, rain: 5, heavyRain: 2, snow: 0, fog: 9, typhoon: 4 },
    { sunny: 52, cloudy: 18, lightRain: 5, rain: 3, heavyRain: 1, snow: 7, fog: 13, typhoon: 1 },
  ];

  const PAUSE_LANDMARKS = [
    {
      name: "純粹好食門市",
      kind: "ugoodays",
      model: "ugoodaysStore",
      color: "#f7fdff",
      accent: "#7fc3de",
      weight: 4,
      overview: "遊戲裡最重要的純粹補給站，提醒玩家把好料吃對，把紅色添加物閃開。",
      realLook: "白色門面搭配藍色純粹好食招牌，店面乾淨明亮，是品牌記憶點最高的地標。",
      realTags: ["藍色招牌", "白色門面", "富農街"],
      sourceLabel: "純粹好食官網",
      sourceUrl: "https://www.ugoodays.com/",
      photo: "./assets/landmarks/ugoodays-store.jpg",
    },
    {
      name: "臺南車站",
      kind: "station",
      model: "tainanStation",
      color: "#f3dfbf",
      accent: "#6f9fb0",
      overview: "臺南城市入口意象，放在快線旁讓跑酷路線更像真的穿過市區。",
      realLook: "古典車站量體、中央鐘面與溫暖牆色，是臺南日常交通記憶的一部分。",
      realTags: ["古典站體", "鐘面", "市區入口"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/attractions",
    },
    {
      name: "南紡購物中心",
      kind: "mall",
      model: "nanfangMall",
      color: "#e9f6f8",
      accent: "#82c6d8",
      overview: "現代商圈節點，讓道路兩側不只有古蹟，也有臺南生活感。",
      realLook: "大片玻璃、俐落量體與購物中心招牌，視覺上偏現代明亮。",
      realTags: ["現代商場", "玻璃量體", "後甲商圈"],
      sourceLabel: "南紡購物中心",
      sourceUrl: "https://www.tsrd.com.tw/footer/about",
    },
    {
      name: "善化車站",
      kind: "station",
      model: "shanhuaStation",
      color: "#f4e2c4",
      accent: "#8cb8c7",
      overview: "北臺南生活圈的車站地標，讓快線有更多城市縱深。",
      realLook: "低矮站體、屋頂線條與站名牌，呈現樸實的地方車站感。",
      realTags: ["地方車站", "站名牌", "屋頂線條"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/attractions",
    },
    {
      name: "赤崁樓",
      kind: "fort",
      model: "chihkanTower",
      color: "#d98975",
      accent: "#b44966",
      overview: "府城代表古蹟之一，在遊戲中用紅牆與層疊屋頂強化辨識度。",
      realLook: "紅牆、飛簷與庭園基座，是臺南歷史景點中很有記憶點的樣貌。",
      realTags: ["紅牆", "飛簷", "府城古蹟"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/674",
      photo: "./assets/landmarks/chihkan-tower.jpg",
    },
    {
      name: "河樂廣場",
      kind: "plaza",
      model: "helePlaza",
      color: "#dff6ff",
      accent: "#61c7de",
      overview: "親水廣場讓路邊畫面多一點清爽感，呼應優格的輕盈印象。",
      realLook: "下凹式水景、階梯與藍白水面，是市中心很醒目的開放空間。",
      realTags: ["親水廣場", "階梯", "藍白水景"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/attractions",
    },
    {
      name: "大魚的祝福",
      kind: "fish",
      model: "bigFish",
      color: "#e7f7fa",
      accent: "#7fc3de",
      overview: "用魚形藝術裝置打破建築節奏，讓玩家路過時更容易記住。",
      realLook: "大型魚形裝置結合光影與海洋意象，靠近安平港邊風景。",
      realTags: ["魚形裝置", "光影", "海洋意象"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/5625",
      photo: "./assets/landmarks/big-fish.jpg",
    },
    {
      name: "安平古堡",
      kind: "fort",
      model: "anpingFort",
      color: "#c57563",
      accent: "#934b42",
      overview: "紅磚城牆與堡壘感讓臺南古城氛圍更明顯。",
      realLook: "紅磚牆、瞭望塔與開闊基地，是安平代表性的歷史景觀。",
      realTags: ["紅磚牆", "瞭望塔", "安平古蹟"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/671",
      photo: "./assets/landmarks/anping-fort.jpg",
    },
    {
      name: "億載金城",
      kind: "fort",
      model: "eternalCastle",
      color: "#d99b72",
      accent: "#a85f4f",
      overview: "遊戲裡以城門與砲臺感呈現，增加道路兩側的冒險味。",
      realLook: "城門、土堤與砲臺輪廓明顯，帶有防禦工事的厚重感。",
      realTags: ["城門", "砲臺", "防禦工事"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/673",
      photo: "./assets/landmarks/eternal-castle.jpg",
    },
    {
      name: "德記洋行",
      kind: "colonial",
      model: "taitMerchant",
      color: "#f5f0df",
      accent: "#9dbf8f",
      overview: "洋行建築讓臺南街景多一點異國歷史層次。",
      realLook: "白色洋樓、拱窗與綠意庭院，和安平樹屋形成很強的景點記憶。",
      realTags: ["白色洋樓", "拱窗", "綠意庭院"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/687",
      photo: "./assets/landmarks/tait-merchant.jpg",
    },
    {
      name: "水仙宮市場",
      kind: "market",
      model: "shuixianMarket",
      color: "#fff4dc",
      accent: "#65a85f",
      overview: "市場招牌讓跑酷路線更有臺南庶民小吃街的熱鬧感。",
      realLook: "傳統市場攤位密集、招牌與騎樓交錯，是府城日常生活風景。",
      realTags: ["傳統市場", "騎樓", "小吃街景"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/attractions",
    },
    {
      name: "國華街",
      kind: "street",
      model: "guohuaStreet",
      color: "#ffe5c7",
      accent: "#ef8b53",
      overview: "把臺南小吃街節奏放進路邊，讓玩家感覺一路跑進府城味。",
      realLook: "騎樓、攤車與小店招牌連成街景，是臺南美食散步路線。",
      realTags: ["騎樓", "攤車", "美食街"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/1351",
      photo: "./assets/landmarks/shennong-street.jpg",
    },
    {
      name: "富農街",
      kind: "street",
      model: "funongStreet",
      color: "#ffe5c7",
      accent: "#c85f45",
      overview: "以街區型地標補上在地生活感，讓城市不只像觀光明信片。",
      realLook: "住宅、小店與街邊招牌混合，呈現臺南日常街廓。",
      realTags: ["日常街廓", "小店", "街邊招牌"],
      sourceLabel: "純粹好食官網",
      sourceUrl: "https://www.ugoodays.com/",
    },
    {
      name: "神農街",
      kind: "street",
      model: "shennongStreet",
      color: "#f4dfc8",
      accent: "#8f5f42",
      overview: "老街燈籠與窄巷感讓遊戲街景更有夜遊臺南的味道。",
      realLook: "老屋立面、木窗、燈籠與窄街，是臺南老街代表場景。",
      realTags: ["老屋", "燈籠", "窄街"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/1351",
      photo: "./assets/landmarks/shennong-street.jpg",
    },
    {
      name: "四草綠隧",
      kind: "tunnel",
      model: "sicaoTunnel",
      color: "#dbe8c9",
      accent: "#65a85f",
      overview: "綠色隧道讓路邊風景更有療癒感，和品牌健康感相連。",
      realLook: "紅樹林枝葉交疊成綠色拱廊，水道穿過其中。",
      realTags: ["紅樹林", "綠色拱廊", "水道"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/1324",
      photo: "./assets/landmarks/sicao-tunnel.jpg",
    },
    {
      name: "漁光島",
      kind: "island",
      model: "yuguangIsland",
      color: "#f7e2bd",
      accent: "#f4d16f",
      overview: "海岸意象讓快線偶爾換成放鬆的臺南海風節奏。",
      realLook: "沙灘、樹影與海岸線，視覺比市區更開闊。",
      realTags: ["沙灘", "樹影", "海岸線"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/5520",
      photo: "./assets/landmarks/yuguang-island.jpg",
    },
    {
      name: "林百貨",
      kind: "deco",
      model: "hayashi",
      color: "#e9e1cf",
      accent: "#8a9aa1",
      overview: "老百貨建築帶出臺南摩登時代的城市記憶。",
      realLook: "裝飾藝術風立面、窗格與復古招牌，是市區經典建築。",
      realTags: ["裝飾藝術", "窗格", "復古百貨"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/739",
      photo: "./assets/landmarks/hayashi.jpg",
    },
    {
      name: "大天后宮",
      kind: "temple",
      model: "mazuTemple",
      color: "#f5d4b2",
      accent: "#d8243c",
      overview: "廟宇屋簷與紅色柱列讓街景更有府城信仰特色。",
      realLook: "紅柱、飛簷、廟埕與層次豐富的屋脊裝飾很醒目。",
      realTags: ["紅柱", "飛簷", "廟埕"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/675",
      photo: "./assets/landmarks/mazu-temple.jpg",
    },
    {
      name: "奇美博物館",
      kind: "museum",
      model: "chimeiMuseum",
      color: "#eef5f8",
      accent: "#7aa9b6",
      overview: "歐式博物館量體讓兩側風景更華麗，也讓路線更有變化。",
      realLook: "白色建築、圓頂、柱廊與橋景，整體有歐式古典感。",
      realTags: ["白色建築", "圓頂", "柱廊"],
      sourceLabel: "奇美博物館",
      sourceUrl: "https://www.chimeimuseum.com.tw/",
      photo: "./assets/landmarks/chimei-museum.jpg",
    },
    {
      name: "臺南美術館",
      kind: "museum",
      model: "tainanArtMuseum",
      color: "#f3f5f0",
      accent: "#c9a57c",
      overview: "美術館讓路邊多一點幾何與藝文氣質。",
      realLook: "幾何屋頂、白色量體與俐落線條，現代感很強。",
      realTags: ["幾何屋頂", "白色量體", "藝文空間"],
      sourceLabel: "臺南市美術館",
      sourceUrl: "https://www.tnam.museum/cms/index.php",
    },
    {
      name: "花園夜市",
      kind: "market",
      model: "gardenNightMarket",
      color: "#ffe3b6",
      accent: "#ef8b53",
      overview: "夜市燈牌讓遊戲在夜間更熱鬧，提升跑酷路線的節奏感。",
      realLook: "攤位、燈箱與人潮密集，是臺南夜晚很有代表性的景象。",
      realTags: ["攤位", "燈箱", "夜市人潮"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/5572",
      photo: "./assets/landmarks/garden-night-market.jpg",
    },
    {
      name: "臺南孔廟",
      kind: "temple",
      model: "confuciusTemple",
      color: "#f3d0b8",
      accent: "#b44966",
      overview: "以紅牆與院落感補足府城文化路線。",
      realLook: "朱紅牆面、傳統屋瓦與安靜庭院，是臺南文化地標。",
      realTags: ["朱紅牆", "傳統屋瓦", "庭院"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/800",
      photo: "./assets/landmarks/confucius-temple.jpg",
    },
    {
      name: "安平樹屋",
      kind: "treehouse",
      model: "anpingTreeHouse",
      color: "#d8c1a2",
      accent: "#65a85f",
      overview: "樹根與老屋交纏的造型讓路邊畫面更有故事感。",
      realLook: "榕樹根系包覆老屋牆面，形成很特別的自然與建築共生景觀。",
      realTags: ["榕樹根", "老屋", "共生景觀"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/806",
      photo: "./assets/landmarks/anping-tree-house.jpg",
    },
    {
      name: "司法博物館",
      kind: "museum",
      model: "judicialMuseum",
      color: "#eef4f4",
      accent: "#7aa9b6",
      overview: "以圓頂、拱窗與厚實牆面做成路邊模型，讓街景多一點古典司法建築的氣勢。",
      realLook: "原臺南地方法院建築帶有圓頂、柱廊與對稱立面，是府城很有辨識度的國定古蹟。",
      realTags: ["圓頂", "柱廊", "國定古蹟"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/680",
      photo: "./assets/landmarks/judicial-museum.jpg",
    },
    {
      name: "臺南市美術館",
      kind: "museum",
      model: "tainanArtMuseum",
      color: "#f3f5f0",
      accent: "#c9a57c",
      overview: "用白色量體與幾何屋頂呈現藝術館氣質，讓跑酷路線有更現代的文化地標。",
      realLook: "建築線條俐落，白色外觀與幾何造型醒目，和府城街區形成新舊對比。",
      realTags: ["白色量體", "幾何造型", "藝術館"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/753",
      photo: "./assets/landmarks/tainan-art-museum.jpg",
    },
    {
      name: "藍晒圖文創園區",
      kind: "deco",
      model: "blueprintPark",
      color: "#dceffc",
      accent: "#4b91b6",
      overview: "把藍白線稿牆面做成遊戲路邊裝置，讓道路旁多一個很容易認出的拍照點。",
      realLook: "藍色牆面搭配白色線條，像把建築藍圖放大成街區裝置。",
      realTags: ["藍色牆面", "白色線稿", "文創園區"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/740",
      photo: "./assets/landmarks/blueprint-park.jpg",
    },
    {
      name: "十鼓文創園區",
      kind: "factory",
      model: "tenDrum",
      color: "#e7c0a7",
      accent: "#a85f4f",
      overview: "以紅磚糖廠、煙囪與鼓形裝置強化節奏感，讓街景更有跑酷舞台感。",
      realLook: "舊糖廠空間保留紅磚、煙囪與工業感建築，轉化成文創與表演園區。",
      realTags: ["紅磚糖廠", "煙囪", "文創園區"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/816",
      photo: "./assets/landmarks/ten-drum.jpg",
    },
    {
      name: "關子嶺溫泉",
      kind: "resort",
      model: "guanzilingHotSpring",
      color: "#f3e6c4",
      accent: "#7aa9b6",
      overview: "用蒸氣、屋簷與溫泉旅宿造型做出山城休憩感，讓道路節奏有喘息感。",
      realLook: "關子嶺以泥漿溫泉聞名，山景與溫泉旅宿是它最明顯的印象。",
      realTags: ["泥漿溫泉", "山景", "旅宿"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/590",
      photo: "./assets/landmarks/guanziling-hot-spring.jpg",
    },
    {
      name: "新化老街",
      kind: "street",
      model: "xinhuaOldStreet",
      color: "#f1d2bd",
      accent: "#934b42",
      overview: "以連續街屋與老街招牌呈現，增加道路兩側的日常府城味。",
      realLook: "街屋立面、拱廊與老街店面連成一排，是新化很具代表性的街景。",
      realTags: ["街屋立面", "拱廊", "老街"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/559",
      photo: "./assets/landmarks/xinhua-old-street.jpg",
    },
    {
      name: "安平老街",
      kind: "street",
      model: "anpingOldStreet",
      color: "#f4dfc8",
      accent: "#c85f45",
      overview: "用小店、騎樓與紅瓦街屋做出安平人潮感，讓街景更熱鬧。",
      realLook: "安平老街以小吃、店家與窄街巷聞名，街屋密集又有生活氣。",
      realTags: ["小吃街", "騎樓", "安平街巷"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/812",
      photo: "./assets/landmarks/anping-old-street.jpg",
    },
    {
      name: "延平郡王祠",
      kind: "temple",
      model: "koxingaShrine",
      color: "#f3d0b8",
      accent: "#c85f45",
      overview: "以朱紅屋簷、廟埕與柱列做成路邊模型，補強府城歷史感。",
      realLook: "建築具有傳統廟宇屋簷與庭院配置，是紀念鄭成功的重要地標。",
      realTags: ["朱紅屋簷", "廟埕", "鄭成功"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/792",
      photo: "./assets/landmarks/koxinga-shrine.jpg",
    },
    {
      name: "吳園藝文中心",
      kind: "garden",
      model: "wuGarden",
      color: "#f3e6c4",
      accent: "#65a85f",
      overview: "用庭園、亭閣與綠意讓道路兩側不只有建築，也有臺南老園林的雅緻。",
      realLook: "吳園保留庭園空間與歷史建築，呈現市中心少見的園林氛圍。",
      realTags: ["庭園", "亭閣", "藝文中心"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/760",
      photo: "./assets/landmarks/wu-garden.jpg",
    },
    {
      name: "西市場",
      kind: "market",
      model: "westMarket",
      color: "#f1d2bd",
      accent: "#b44966",
      overview: "以拱形入口與市場店面做出府城商業街景，讓路邊畫面更有生活密度。",
      realLook: "西市場保有老市場立面與街區感，是中西區具代表性的歷史市場。",
      realTags: ["老市場", "拱形入口", "街區商業"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/746",
      photo: "./assets/landmarks/west-market.jpg",
    },
    {
      name: "海安路藝術街",
      kind: "street",
      model: "haiAnArtStreet",
      color: "#dceffc",
      accent: "#7d5ba6",
      overview: "把彩色牆面與街頭藝術放進道路兩側，讓城市風景更活潑。",
      realLook: "海安路以街道藝術、裝置與夜間散步氛圍聞名，是臺南很有創意感的街廓。",
      realTags: ["街道藝術", "彩色牆面", "散步街廓"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/1345",
      photo: "./assets/landmarks/haian-art-street.jpg",
    },
    {
      name: "月津港親水公園",
      kind: "festival",
      model: "yuejinHarbor",
      color: "#dff6ff",
      accent: "#f4d16f",
      overview: "用水岸、燈籠與光點做出夜間節慶感，搭配日夜變化更有氣氛。",
      realLook: "月津港親水公園有水岸步道與燈節意象，夜晚視覺尤其醒目。",
      realTags: ["水岸", "燈節", "親水公園"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/4282",
      photo: "./assets/landmarks/yuejin-harbor.jpg",
    },
    {
      name: "山上花園水道博物館",
      kind: "museum",
      model: "waterworksMuseum",
      color: "#e7c0a7",
      accent: "#a85f4f",
      overview: "用紅磚建築、水塔與拱窗做出工業遺產感，讓郊區路線更有變化。",
      realLook: "園區保留水道設施、紅磚建築與水塔結構，是臺南很有特色的博物館。",
      realTags: ["紅磚", "水塔", "水道博物館"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/5816",
      photo: "./assets/landmarks/waterworks-museum.jpg",
    },
    {
      name: "七股鹽山",
      kind: "deco",
      model: "qiguSaltMountain",
      color: "#f7fdff",
      accent: "#7fc3de",
      overview: "以白色鹽山和鹽田感做出路邊奇景，讓臺南海線特色更明顯。",
      realLook: "大面積白色鹽山像小山丘，是七股很具辨識度的觀光地標。",
      realTags: ["白色鹽山", "海線", "鹽業地景"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/471",
      photo: "./assets/landmarks/qigu-salt-mountain.jpg",
    },
    {
      name: "國立臺灣歷史博物館",
      kind: "museum",
      model: "taiwanHistoryMuseum",
      color: "#e8f0ee",
      accent: "#8a9aa1",
      overview: "以現代博物館量體、大片玻璃與斜屋頂呈現，增加新市區文化感。",
      realLook: "建築外觀現代，寬闊基地與館舍量體清楚，是臺南代表性的博物館之一。",
      realTags: ["現代館舍", "大片玻璃", "博物館"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/852",
      photo: "./assets/landmarks/taiwan-history-museum.jpg",
    },
    {
      name: "北門水晶教堂",
      kind: "chapel",
      model: "beimenCrystalChurch",
      color: "#e7f7fa",
      accent: "#7fc3de",
      overview: "用白色三角水晶教堂造型做出很亮眼的海線地標。",
      realLook: "白色晶體般的教堂造型坐落在水岸旁，外型簡潔又很容易辨識。",
      realTags: ["白色教堂", "水岸", "晶體造型"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/5622",
      photo: "./assets/landmarks/beimen-crystal-church.jpg",
    },
    {
      name: "井仔腳瓦盤鹽田",
      kind: "salt",
      model: "jingzaijiaoSaltFields",
      color: "#f7e2bd",
      accent: "#7aa9b6",
      overview: "用一格格瓦盤鹽田與小鹽堆做出海線地景，讓道路兩側更有地方特色。",
      realLook: "鹽田格線、反光水面與夕陽景色是井仔腳最醒目的視覺印象。",
      realTags: ["瓦盤鹽田", "格線水面", "海線夕景"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/587",
      photo: "./assets/landmarks/jingzaijiao-salt-fields.jpg",
    },
    {
      name: "麻豆代天府",
      kind: "temple",
      model: "madouDaitianTemple",
      color: "#f5d4b2",
      accent: "#d8243c",
      overview: "用大型廟宇屋脊、紅柱與牌樓感呈現，讓道路旁的廟宇不再都長一樣。",
      realLook: "麻豆代天府具有華麗廟宇立面與層次豐富的屋頂裝飾，是麻豆重要信仰地標。",
      realTags: ["華麗廟宇", "紅柱", "麻豆地標"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/479",
      photo: "./assets/landmarks/madou-daitian-temple.jpg",
    },
    {
      name: "虎頭埤風景區",
      kind: "lake",
      model: "hutoupi",
      color: "#d5ead4",
      accent: "#4a9f72",
      overview: "以湖面、拱橋和樹影做成風景區模型，讓街景有更自然的節奏。",
      realLook: "虎頭埤以湖泊、步道和綠意聞名，是臺南很經典的風景區。",
      realTags: ["湖泊", "步道", "綠意"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/562",
      photo: "./assets/landmarks/hutoupi.jpg",
    },
    {
      name: "蕭壠文化園區",
      kind: "factory",
      model: "soulanghCulturalPark",
      color: "#e8d0b8",
      accent: "#a85f4f",
      overview: "用紅磚廠房、連續屋頂和藝文招牌做成路邊建築，補強郊區文創路線。",
      realLook: "園區由糖廠空間轉型，保留廠房量體並加入藝文展演用途。",
      realTags: ["糖廠廠房", "紅磚", "文化園區"],
      sourceLabel: "臺南旅遊網",
      sourceUrl: "https://www.twtainan.net/zh-tw/Attractions/Detail/484",
      photo: "./assets/landmarks/soulangh-cultural-park.jpg",
    },
  ];

  const TYPES = {
    milk: { label: "鮮奶", short: "奶", color: "#7fc3de", bg: "#dff6ff", hold: "鮮奶", feature: "純淨基底", effect: "純淨+", verb: "補純" },
    culture: { label: "益菌", short: "菌", color: "#268aa1", bg: "#caeef6", hold: "益菌", feature: "8 種益菌", effect: "牽引", verb: "牽引" },
    protein: { label: "高蛋白", short: "蛋", color: "#ef8b53", bg: "#ffe0cc", hold: "蛋白", feature: "厚實飽足", effect: "積分+", verb: "加分" },
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
    { key: "flavor", label: "香精", short: "香", color: "#d8243c", feature: "非天然香氣", effect: "扣純" },
    { key: "coloring", label: "色素", short: "色", color: "#e22d48", feature: "人工色", effect: "扣純" },
    { key: "dirty", label: "增稠劑", short: "稠", color: "#a91527", feature: "化學添加", effect: "重扣" },
    { key: "sugar", label: "加糖", short: "糖", color: "#c91f33", feature: "額外添加糖", effect: "增重" },
    { key: "sour", label: "過酸粉", short: "酸", color: "#f0444f", feature: "調味失衡", effect: "扣秒" },
    { key: "ice", label: "鮮奶油", short: "油", color: "#b8122b", feature: "厚重油脂", effect: "增重" },
    { key: "sticky", label: "膠感粉", short: "膠", color: "#d9342f", feature: "增黏添加", effect: "卡手" },
  ];

  const BONUS = [
    { key: "calciumBoost", label: "鈣力慢拍", short: "鈣", color: "#4b91b6", feature: "鈣力補給", effect: "危險物慢" },
    { key: "probioticBoost", label: "益菌磁吸", short: "益", color: "#268aa1", feature: "益菌活力", effect: "目標貼近" },
    { key: "cleanBoost", label: "純淨盾", short: "淨", color: "#65a85f", feature: "純淨製作", effect: "擋添加物" },
    { key: "rushBoost", label: "飛鞋加速", short: "鞋", color: "#ef8b53", feature: "短暫加速", effect: "跑速+" },
    { key: "comboBoost", label: "連擊星糖", short: "連", color: "#f4d16f", feature: "連線補給", effect: "連擊+" },
    { key: "timeBurst", label: "冷鏈秒錶", short: "秒", color: "#7d5ba6", feature: "出貨加時", effect: "秒數++" },
    { key: "roadSweep", label: "道路清場", short: "清", color: "#49a8b8", feature: "清出路線", effect: "掃紅色" },
    { key: "streetGuard", label: "安心護欄", short: "欄", color: "#8bc46b", feature: "短暫護欄", effect: "免撞擊" },
    { key: "yogurtMagnet", label: "優格磁場", short: "磁", color: "#ffb85c", feature: "好料牽引", effect: "優格靠近" },
    { key: "pureWave", label: "純淨波", short: "波", color: "#61c7de", feature: "洗掉添加", effect: "純淨回升" },
  ];

  const FLAVOR_REWARD_KEYS = ["fruit", "honey", "matcha", "cocoa", "oat", "salt", "crunch"];
  const FLAVOR_REWARD_NAMES = ["果香蜂蜜", "抹茶海鹽", "可可脆粒", "燕麥蜜香", "莓果可可", "鹹甜脆脆"];

  const STATION_KEYS = ["mix", "ferment", "strain", "qc", "texture", "chill", "swirl", "pack", "ship"];
  const LANE_RULES = [
    { label: "純淨基底", hint: "鮮奶 / 益菌 / 營養", keys: ["milk", "culture", "protein", "calcium"], hazards: ["dirty", "ice"] },
    { label: "風味自搭", hint: "水果 / 蜂蜜 / 燕麥 / 可可", keys: ["fruit", "honey", "oat", "matcha", "cocoa", "salt", "crunch"], hazards: ["sugar", "flavor", "coloring"] },
    { label: "工序加速", hint: "混乳 / 熟成 / 封杯 / 冷藏", keys: ["mix", "ferment", "strain", "qc", "texture", "chill", "swirl", "pack", "ship"], hazards: ["sticky", "sour", "dirty"] },
  ];

  const ITEM_POINTS = {
    milk: 1,
    culture: 2,
    protein: 2,
    calcium: 2,
    fruit: 2,
    honey: 2,
    oat: 2,
    matcha: 3,
    cocoa: 3,
    salt: 2,
    crunch: 2,
    mix: 2,
    ferment: 3,
    strain: 3,
    qc: 3,
    texture: 3,
    chill: 2,
    swirl: 3,
    pack: 2,
    ship: 2,
  };

  const YOGURT_RECIPES = [
    { id: "greek160", label: "希臘優格 160g", points: 31, color: "#ef8b53", needs: { milk: 1, culture: 1, protein: 1, strain: 1, pack: 1 } },
    { id: "drink", label: "原味優格飲", points: 28, color: "#f4d16f", needs: { milk: 1, culture: 1, calcium: 1, mix: 1, chill: 1 } },
    { id: "fresh160", label: "鮮奶優格 160g", points: 24, color: "#7fc3de", needs: { milk: 1, culture: 1, mix: 1, pack: 1 } },
    { id: "fruitHoney", label: "蜂蜜水果特調", points: 11, color: "#b44966", needs: { milk: 1, culture: 1, fruit: 1, honey: 1, swirl: 1 } },
    { id: "oatCrunch", label: "燕麥脆粒特調", points: 10, color: "#a47b42", needs: { milk: 1, culture: 1, oat: 1, crunch: 1, texture: 1 } },
    { id: "matchaSalt", label: "抹茶海鹽特調", points: 9, color: "#4f9a4b", needs: { milk: 1, culture: 1, matcha: 1, salt: 1, qc: 1 } },
    { id: "cocoaCrunch", label: "可可脆脆特調", points: 9, color: "#7a4b35", needs: { milk: 1, culture: 1, cocoa: 1, crunch: 1, pack: 1 } },
  ];

  const WEIGHT_LIMIT_KG = 70;
  const WEIGHT_ALERT_KG = 67.5;
  const PURITY_ALERT_PERCENT = 18;
  const MOBILE_CONTROL_LIFT = 118;
  const MOBILE_SCENE_SCALE = 0.68;
  const ROUTE_FORK_CUE_SECONDS = 2.2;
  const ROUTE_FORK_MIN_GAP = 12;
  const ROUTE_FORK_MAX_GAP = 18;
  const ROUTE_FORK_MIN_TIME = 8.2;
  const ROUTE_FORK_MAX_TIME = 10.8;
  const JUMP_DODGE_SECONDS = 1.05;
  const SLIDE_DODGE_SECONDS = 0.95;
  const PLAYER_VISUAL_SCALE = 0.66;
  const OFFICIAL_YOGURT_IDS = new Set(["greek160", "drink", "fresh160"]);
  const PURE_BASE_KEYS = new Set(["milk", "culture", "protein", "calcium", "mix", "ferment", "strain", "qc", "texture", "chill", "pack", "ship"]);
  const FLAVOR_WEIGHT_KEYS = new Set(["fruit", "honey", "oat", "matcha", "cocoa", "salt", "crunch", "swirl"]);
  const KCAL_PER_WEIGHT_KG = 7000;
  const ARCADE_KCAL_SCALE = 22;
  const GAME_DAY_SECONDS = 300;
  const NORMAL_DAILY_BURN_PER_KG = 30;
  const ITEM_KCAL = {
    milk: 70,
    culture: 8,
    protein: 58,
    calcium: 4,
    fruit: 46,
    honey: 64,
    oat: 82,
    matcha: 16,
    cocoa: 72,
    salt: 0,
    crunch: 88,
    swirl: 55,
  };
  const BONUS_KCAL = {
    rushBoost: 96,
    comboBoost: 82,
    cleanBoost: -38,
    probioticBoost: -42,
    calciumBoost: -32,
    timeBurst: -18,
    roadSweep: -22,
    streetGuard: -16,
    yogurtMagnet: -24,
    pureWave: -55,
  };
  const HAZARD_KCAL = {
    flavor: 420,
    coloring: 360,
    sugar: 440,
    dirty: 310,
    sour: 280,
    ice: 260,
    sticky: 300,
  };
  const RECIPE_NUTRITION = {
    greek160: { kcal: 105, credit: 260, craft: "小份希臘優格，濾出扎實口感，補足飽足感。" },
    drink: { kcal: 170, credit: 300, craft: "原味優格飲用冷鏈鎖住乳香，輕鬆補給。" },
    fresh160: { kcal: 100, credit: 240, craft: "小杯鮮奶優格，鮮乳發酵後封杯冷藏。" },
    fruitHoney: { kcal: 190, credit: 80, craft: "水果和蜂蜜做香氣點綴，爽感高但熱量也更明顯。" },
    oatCrunch: { kcal: 220, credit: 70, craft: "燕麥和脆粒堆出口感，咀嚼感強、熱量也偏高。" },
    matchaSalt: { kcal: 150, credit: 70, craft: "抹茶和海鹽做鹹甜平衡，適合偶爾自搭配。" },
    cocoaCrunch: { kcal: 235, credit: 60, craft: "可可加脆粒做甜點感，分數低一些也更容易累積熱量。" },
  };

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
    { id: "combo12", unlock: 1, label: "連吃 12 個好料", points: 8, target: 12, counter: "combo" },
    { id: "bonus2", unlock: 2, label: "吃到 2 個營養道具", points: 10, target: 2, counter: "bonuses" },
    { id: "lane4", unlock: 3, label: "換軌 4 次躲紅色", points: 12, target: 4, counter: "laneChanges" },
    { id: "shieldBlock", unlock: 5, label: "純淨盾擋 1 次添加物", points: 14, target: 1, counter: "shieldBlocks" },
    { id: "pureRush", unlock: 8, label: "打出 1 次 PURE RUSH", points: 16, target: 1, counter: "pureRushes" },
    { id: "combo30", unlock: 10, label: "連吃 30 個好料", points: 20, target: 30, counter: "combo" },
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
    paused: false,
    pauseLandmark: null,
    width: 0,
    height: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    sceneScale: 1,
    dpr: 1,
    lanes: [0, 0, 0],
    routeForkTimer: 0,
    routeForkCueTimer: 0,
    nextForkTimer: 7.5,
    routeForkCount: 0,
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
    rewardWaveCooldown: 0,
    flavorCharge: 0,
    flavorRushTime: 0,
    flavorMultiplier: 1,
    flavorComboLabel: "",
    flavorCountdown: 0,
    flavorPending: null,
    flavorCueTime: 0,
    customFlavors: 0,
    weightKg: 52,
    weightDisplayKg: 52,
    weightPulse: 0,
    officialYogurtStreak: 0,
    weightLossCount: 0,
    weightGainSources: {},
    weightGainTotal: 0,
    weightLossTotal: 0,
    calorieIntakeKcal: 0,
    calorieBurnKcal: 0,
    gameOverKind: "",
    inventory: {},
    yogurts: {},
    totalYogurts: 0,
    survivalTime: 0,
    settlementReveal: 0,
    sceneryOffset: 0,
    weatherType: "sunny",
    weatherNextType: "sunny",
    weatherBlend: 0,
    weatherTimer: 24,
    weatherSeed: 1,
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
    brandBursts: [],
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
    jumpTimer: 0,
    slideTimer: 0,
    jumpDodgeBuffer: 0,
    slideDodgeBuffer: 0,
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
    basePlayerX: 0,
    indirect: false,
    startedAt: 0,
    startedInPlay: false,
    dragging: false,
    gestureDone: false,
  };

  const audio = {
    muted: localStorage.getItem(AUDIO_KEY) === "1",
    context: null,
    sfxGain: null,
    bgmGain: null,
    bgmCompressor: null,
    bgmDelay: null,
    bgmDelayGain: null,
    bgmTimer: null,
    bgmStep: 0,
    bgmNextTime: 0,
  };

  const BGM = {
    bpm: 82,
    melody: [
      "E5", null, "G5", "A5", null, "G5", "E5", null, "D5", null, "E5", "G5", null, "E5", null, null,
      "E5", null, "G5", "A5", "C6", null, "A5", "G5", "E5", null, "D5", null, "C5", null, null, null,
      "G5", null, "A5", "C6", "D6", null, "C6", "A5", "G5", null, "E5", "G5", "A5", null, "G5", null,
      "E5", null, "G5", "A5", "C6", null, "A5", "G5", "E5", null, "D5", null, "C5", null, null, null,
    ],
    harmony: [
      null, null, "E5", null, null, "E5", null, null, null, null, "C5", null, null, "C5", null, null,
      null, null, "E5", null, "G5", null, "F5", null, null, null, "B4", null, "G4", null, null, null,
      null, null, "F5", null, "A5", null, "A5", null, null, null, "C5", null, "F5", null, "E5", null,
      null, null, "E5", null, "G5", null, "F5", null, null, null, "B4", null, "G4", null, null, null,
    ],
    hook: [
      null, null, "C6", null, null, null, "B5", null, null, null, "G5", null, null, "E5", null, null,
      null, null, "C6", null, "E6", null, "D6", null, null, null, "B5", null, "G5", null, null, null,
      "E6", null, null, "D6", null, "C6", null, null, "A5", null, null, "G5", null, "E5", null, null,
      null, null, "C6", null, "E6", null, "D6", null, null, null, "B5", null, "C6", null, null, null,
    ],
    bass: [
      "C3", null, null, null, "G2", null, null, null, "A2", null, null, null, "F2", null, "G2", null,
      "C3", null, null, null, "G2", null, null, null, "A2", null, null, null, "F2", null, "G2", null,
      "D3", null, null, null, "G2", null, null, null, "E3", null, null, null, "F2", null, "G2", null,
      "C3", null, null, null, "G2", null, null, null, "A2", null, null, null, "F2", null, "C3", null,
    ],
    arpeggio: [
      "C5", null, "G5", null, "D5", null, "B4", null, "C5", null, "E5", null, "A4", null, "C5", null,
      "C5", null, "G5", null, "D5", null, "B4", null, "C5", null, "E5", null, "A4", null, "D5", null,
      "F5", null, "A5", null, "D5", null, "G5", null, "E5", null, "B4", null, "F5", null, "G5", null,
      "C5", null, "G5", null, "D5", null, "B4", null, "C5", null, "E5", null, "G4", null, "C5", null,
    ],
    sparkle: [
      null, null, null, null, "E6", null, null, "G6", null, null, "C6", null, null, null, "G6", null,
      null, null, null, "E6", null, null, "A6", null, null, "G6", null, null, "E6", null, null, null,
      null, null, "A6", null, null, "C7", null, null, "G6", null, null, "E6", null, null, "C6", null,
      null, null, null, "E6", null, null, "A6", null, null, "G6", null, null, "E6", null, null, null,
    ],
    chords: [
      ["C4", "E4", "G4", "D5"],
      ["G3", "D4", "G4", "B4"],
      ["A3", "E4", "G4", "C5"],
      ["F3", "C4", "E4", "A4"],
      ["D3", "A3", "C4", "F4"],
      ["G3", "D4", "E4", "B4"],
      ["E3", "B3", "D4", "G4"],
      ["F3", "C4", "E4", "G4"],
    ],
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
    const flavorSpeed = state.flavorRushTime > 0 ? 1.14 + Math.min(0.26, state.customFlavors * 0.014 + state.combo * 0.0016) : 1;
    const arcadePressure = Math.max(0, state.survivalTime / 15 + state.totalYogurts * 0.42);
    const lateRamp = clamp((state.survivalTime - 45) / 100 + Math.max(0, state.level - 10) * 0.035 + Math.max(0, state.totalYogurts - 4) * 0.025, 0, 0.9);
    const comboSpeed = 1 + Math.min(0.3, state.combo * 0.0028 + state.totalYogurts * 0.011 + arcadePressure * 0.007 + lateRamp * 0.08);
    const comboDensity = Math.min(0.24, state.combo * 0.0022 + state.totalYogurts * 0.01 + arcadePressure * 0.004 + lateRamp * 0.08);
    const rushDensity = state.flavorRushTime > 0 ? 0.09 : 0;
    const idleThreat = state.flavorRushTime > 0 ? 0 : clamp((state.idleTime - 0.85) * 0.34 + state.hazardPressure * 0.12, 0, 0.72);
    return {
      ...tier,
      speed: (tier.speed * 0.78 + pressure * 8 + latePressure * 5 + Math.max(0, state.level - 18) * 8 + state.totalYogurts * 2.5 + arcadePressure * 2.6 + lateRamp * 85) * modifier.speed * openingSpeed * flavorSpeed * comboSpeed,
      hazard: state.survivalTime > 3.2 || idleThreat > 0.18,
      sameLane: clamp(tier.sameLane - 0.36 - pressure * 0.02 + (modifier.sameLane || 0), 0.16, 0.64),
      required: Math.max(1.05, (2.08 - arcadePressure * 0.014 - comboDensity * 0.24) * modifier.requiredRate),
      decoyMin: Math.max(0.95, 1.62 - arcadePressure * 0.01 - comboDensity * 0.14),
      decoyMax: Math.max(1.35, 2.38 - arcadePressure * 0.014 - comboDensity * 0.2),
      hazardMin: Math.max(0.9, (2.75 - arcadePressure * 0.018 - latePressure * 0.012 - lateRamp * 0.48) * modifier.hazardRate - idleThreat * 0.22),
      hazardMax: Math.max(1.28, (4.05 - arcadePressure * 0.026 - latePressure * 0.018 - lateRamp * 0.78) * modifier.hazardRate - idleThreat * 0.34),
      orderTime: Math.max(2.2, tier.orderTime * modifier.orderTime),
      missPurity: Math.ceil((9 + Math.min(22, arcadePressure * 0.96 + lateRamp * 7)) * modifier.purityPenalty),
      missTime: (1.25 + Math.min(2.2, arcadePressure * 0.08)) * modifier.purityPenalty,
      timerDrain: (0.72 + Math.min(0.86, arcadePressure * 0.019 + lateRamp * 0.42)) * modifier.timerDrain * openingDrain,
      hazardTarget: clamp(tier.hazardTarget + modifier.hazardTarget + openingHazardTarget + idleThreat + lateRamp * 0.16, 0, 0.98),
      bonusChance: clamp(0.13 + comboDensity * 0.78 + rushDensity + modifier.bonusChance * 0.42, 0.1, state.flavorRushTime > 0 ? 0.42 : 0.28),
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
    triggerBrandBurst("挑戰達成", {
      sub: mission.label,
      x: player.x + 72,
      y: player.y - 148,
      color: COLORS.berry,
      style: "rush",
      power: 1.32,
    });
    floatText(`+${formatNumber(reward)}`, player.x + 72, player.y - 108, COLORS.leaf);
    emitPop(player.x + 56, player.y - 46, COLORS.berry, 22);
    triggerJuice(COLORS.berry, 1.55, { x: player.x + 58, y: player.y - 54, style: "stamp", hitStop: 0.11 });
    beep(980, 0.07, "square", 0.035);
    beep(1260, 0.08, "triangle", 0.025);
  }

  function getHitQuality(entity) {
    if (entity.required) return { grade: "good", label: "JUICY", mult: 1.24, color: COLORS.aquaDeep, fever: 4, time: 0.22 };
    const center = entity.x + entity.w / 2;
    const distance = Math.abs(center - player.x);
    const arcadeBonus = (state.width < 620 ? 9 : 0) + Math.min(12, Math.floor(state.combo / 5) * 2);
    if (distance <= 24 + arcadeBonus) return { grade: "good", label: "JUICY", mult: 1.24, color: COLORS.aquaDeep, fever: 4, time: 0.22 };
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
      state.shake = Math.max(state.shake, 0.16);
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
    dom.pauseButton?.addEventListener("click", togglePause);
    dom.pauseContinueButton?.addEventListener("click", () => {
      if (state.paused) togglePause();
    });
    window.addEventListener("pointerdown", primeAudio, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    bindCanvasTouch();
    bindHold(dom.leftButton, "left");
    bindHold(dom.rightButton, "right");
    bindTap(dom.upButton, () => setLane(1));
    bindTap(dom.downButton, () => setLane(1));
    bindTap(dom.actionButton, triggerAction);
  }

  function primeAudio() {
    if (audio.muted) return;
    ensureAudio();
    if (state.phase === "playing" && !state.paused && !audio.bgmTimer) startBgm(false);
  }

  function bindHold(button, key) {
    if (!button) return;
    const down = (event) => {
      event.preventDefault();
      if (state.phase !== "playing" || state.paused) return;
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
      if (state.phase !== "playing" || state.paused) return;
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
        if (state.paused) return;
        if (!isGameplayPointer(event)) return;
        event.preventDefault();
        touch.id = event.pointerId;
        touch.startX = event.clientX;
        touch.startY = event.clientY;
        touch.lastX = event.clientX;
        touch.lastY = event.clientY;
        touch.indirect = isMobileLayout();
        touch.basePlayerX = player.x;
        touch.laneY = pointerToLaneControlY(event.clientY);
        touch.targetX = touch.indirect ? null : pointerToPlayerX(event.clientX);
        touch.startedAt = performance.now();
        touch.startedInPlay = true;
        touch.dragging = false;
        touch.gestureDone = false;
        if (!touch.indirect) followPointerLane(touch.targetX);
        try {
          canvas.setPointerCapture?.(event.pointerId);
        } catch {
          // Synthetic touch events used by some test runners do not own a captureable pointer.
        }
      },
      { passive: false }
    );

    canvas.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerId !== touch.id) return;
        event.preventDefault();
        const dx = event.clientX - touch.startX;
        const rawDy = event.clientY - touch.startY;
        if (touch.indirect) {
          if (!touch.gestureDone && Math.max(Math.abs(dx), Math.abs(rawDy)) > 42) {
            if (Math.abs(dx) >= Math.abs(rawDy)) {
              runDodge(dx > 0 ? "right" : "left");
              touch.gestureDone = true;
              touch.dragging = true;
            }
          }
        } else {
          const controlY = pointerToLaneControlY(event.clientY);
          const dy = controlY - touch.laneY;
          touch.targetX = pointerToPlayerX(event.clientX);
          followPointerLane(touch.targetX);
          if (Math.abs(dy) > 30) {
            setLane(nearestLane(touch.targetX) ?? player.lane);
            touch.laneY = controlY;
            touch.dragging = true;
          }
          if (Math.abs(dx) > 12) touch.dragging = true;
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
    touch.basePlayerX = 0;
    touch.indirect = false;
    touch.startedInPlay = false;
    touch.dragging = false;
    touch.gestureDone = false;
  }

  function isGameplayPointer(event) {
    const road = getRoadMetrics();
    const threshold = road.horizonY * getSceneScale() - (isMobileLayout() ? 42 : 20);
    return event.clientY >= Math.max(120, threshold);
  }

  function pointerToPlayerX(x) {
    const bounds = getPlayerRoadBounds();
    if (touch.indirect) {
      return clamp(touch.basePlayerX + (x - touch.startX) / getSceneScale() * 1.12, bounds.left, bounds.right);
    }
    return clamp(screenToWorldX(x), bounds.left, bounds.right);
  }

  function pointerToLaneControlY(y) {
    return isMobileLayout() ? screenToWorldY(y - MOBILE_CONTROL_LIFT) : screenToWorldY(y);
  }

  function isMobileLayout() {
    return state.viewportWidth < 520;
  }

  function getSceneScale() {
    return state.sceneScale || 1;
  }

  function screenToWorldX(x) {
    return x / getSceneScale();
  }

  function screenToWorldY(y) {
    return y / getSceneScale();
  }

  function isForkRouteOpen() {
    return true;
  }

  function getForkVisualAmount() {
    return 1;
  }

  function getPlayableLanes() {
    return [0, 1, 2];
  }

  function isLaneOpen(lane) {
    return getPlayableLanes().includes(clamp(Math.round(lane), 0, 2));
  }

  function normalizePlayableLane(lane) {
    const nextLane = clamp(Math.round(lane), 0, 2);
    return isLaneOpen(nextLane) ? nextLane : 1;
  }

  function randomPlayableLane() {
    const lanes = getPlayableLanes();
    return lanes[randomInt(0, lanes.length - 1)] ?? 1;
  }

  function getRoadMetrics() {
    const mobile = isMobileLayout();
    const scale = getSceneScale();
    const fork = getForkVisualAmount();
    const horizonY = mobile ? 250 / scale : Math.max(172, state.height * 0.22);
    const nearY = state.height - (mobile ? 138 / scale : 58);
    const centerX = state.width * 0.5;
    const singleNear = Math.min(state.width * (mobile ? 0.42 : 0.6), mobile ? 330 / scale : 660);
    const forkNear = Math.min(state.width * (mobile ? 0.56 : 0.8), mobile ? 430 / scale : 900);
    const nearWidth = singleNear + (forkNear - singleNear) * fork;
    const singleFar = Math.max(mobile ? 58 : 84, singleNear * (mobile ? 0.22 : 0.2));
    const forkFar = Math.max(mobile ? 76 : 108, forkNear * (mobile ? 0.24 : 0.22));
    const farWidth = singleFar + (forkFar - singleFar) * fork;
    return { horizonY, nearY, centerX, nearWidth, farWidth };
  }

  function roadDepthAtY(y) {
    const road = getRoadMetrics();
    return clamp((y - road.horizonY) / Math.max(1, road.nearY - road.horizonY), 0, 1);
  }

  function roadWidthAtDepth(depth) {
    const road = getRoadMetrics();
    const eased = depth ** 1.18;
    return road.farWidth + (road.nearWidth - road.farWidth) * eased;
  }

  function roadLaneCenter(lane, y = getRoadMetrics().nearY) {
    const road = getRoadMetrics();
    const depth = roadDepthAtY(y);
    const width = roadWidthAtDepth(depth);
    const offset = (lane - 1) * width * (isMobileLayout() ? 0.32 : 0.27);
    return road.centerX + offset;
  }

  function roadEntityScale(y) {
    const depth = roadDepthAtY(y);
    return 0.32 + depth ** 1.05 * 0.92;
  }

  function getPlayerRoadBounds() {
    const road = getRoadMetrics();
    const margin = Math.max(24, road.nearWidth * 0.08);
    return {
      left: road.centerX - road.nearWidth * 0.44 + margin,
      right: road.centerX + road.nearWidth * 0.44 - margin,
    };
  }

  function nearestLane(x) {
    if (!state.lanes.length) return null;
    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < state.lanes.length; i += 1) {
      const distance = Math.abs(x - state.lanes[i]);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    }
    return best;
  }

  function playerEffectiveLane() {
    return clamp(Math.round(player.lane), 0, 2);
  }

  function followPointerLane(x) {
    const lane = nearestLane(x);
    if (lane !== null) setLane(lane);
  }

  function resize() {
    state.viewportWidth = window.innerWidth;
    state.viewportHeight = window.innerHeight;
    state.sceneScale = state.viewportWidth < 520 ? MOBILE_SCENE_SCALE : 1;
    state.width = state.viewportWidth / state.sceneScale;
    state.height = state.viewportHeight / state.sceneScale;
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(state.viewportWidth * state.dpr);
    canvas.height = Math.floor(state.viewportHeight * state.dpr);
    canvas.style.width = `${state.viewportWidth}px`;
    canvas.style.height = `${state.viewportHeight}px`;
    ctx.setTransform(state.dpr * state.sceneScale, 0, 0, state.dpr * state.sceneScale, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const road = getRoadMetrics();
    state.lanes = [roadLaneCenter(0, road.nearY), roadLaneCenter(1, road.nearY), roadLaneCenter(2, road.nearY)];
    const bounds = getPlayerRoadBounds();
    player.x = clamp(player.x || state.lanes[player.lane] || road.centerX, bounds.left, bounds.right);
    player.y = road.nearY;
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
    state.openingMode = null;
    state.routeForkTimer = 0;
    state.routeForkCueTimer = 0;
    state.nextForkTimer = 6.8;
    state.routeForkCount = 0;
    state.recentMissionIds = [];
    state.mission = null;
    state.modifier = { ...MODIFIERS[0] };
    state.order = null;
    state.stepIndex = 0;
    state.speed = 188;
    state.level = 1;
    state.purity = 100;
    state.timeRemaining = 64;
    state.requiredTimer = 0.9;
    state.decoyTimer = 1.2;
    state.hazardTimer = 3.15;
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
    state.rewardWaveCooldown = 0;
    state.flavorCharge = 0;
    state.flavorRushTime = 0;
    state.flavorMultiplier = 1;
    state.flavorComboLabel = "";
    state.flavorCountdown = 0;
    state.flavorPending = null;
    state.flavorCueTime = 0;
    state.customFlavors = 0;
    state.weightKg = 52;
    state.weightDisplayKg = 52;
    state.weightPulse = 0;
    state.officialYogurtStreak = 0;
    state.weightLossCount = 0;
    state.weightGainSources = {};
    state.weightGainTotal = 0;
    state.weightLossTotal = 0;
    state.calorieIntakeKcal = 0;
    state.calorieBurnKcal = 0;
    state.gameOverKind = "";
    state.inventory = {};
    state.yogurts = {};
    state.totalYogurts = 0;
    state.survivalTime = 0;
    state.settlementReveal = 0;
    state.sceneryOffset = 0;
    resetWeather();
    state.idleTime = 0;
    state.idleToastCooldown = 0;
    state.hazardPressure = 0;
    state.rhythmSave = 100;
    state.controlGrace = 0;
    state.entities = [];
    state.particles = [];
    state.bursts = [];
    state.brandBursts = [];
    state.floats = [];
    state.packages = [];
    player.x = state.lanes[1] || state.width * 0.5;
    player.lane = 1;
    player.targetLane = 1;
    player.y = getRoadMetrics().nearY;
    state.lastPlayerX = player.x;
    state.lastPlayerLane = player.lane;
    player.actionTimer = 0;
    player.invuln = 0;
    player.laneRepeat = 0;
    player.jumpTimer = 0;
    player.slideTimer = 0;
    player.jumpDodgeBuffer = 0;
    player.slideDodgeBuffer = 0;
    player.reactionTimer = 0;
    player.reactionKey = null;
    resetPointerControl();
    state.paused = false;
    updatePauseUi();
    dom.startOverlay.classList.add("hidden");
    dom.gameOverOverlay.classList.add("hidden");
    state.pauseLandmark = null;
    hidePauseDomOverlay();
    renderRecipe();
    updateHud();
    showToast("優格快線：吃好料、閃紅色、做官方優格");
    startBgm(true);
    beep(560, 0.055, "square", 0.04);
  }

  function resetWeather() {
    const seasonIndex = getWorldMood(0).seasonIndex;
    const forcedWeather = new URLSearchParams(window.location.search).get("weather");
    const type = WEATHER_DEFS[forcedWeather] ? forcedWeather : pickWeatherForSeason(seasonIndex);
    state.weatherType = type;
    state.weatherNextType = type;
    state.weatherBlend = 0;
    state.weatherTimer = getWeatherDuration(type);
    state.weatherSeed = randomInt(1, 9999);
  }

  function pickWeatherForSeason(seasonIndex, avoidType = "") {
    const profile = WEATHER_PROFILES[positiveModulo(seasonIndex, WEATHER_PROFILES.length)] || WEATHER_PROFILES[0];
    const entries = Object.entries(profile);
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = random(0, total);
    for (const [type, weight] of entries) {
      roll -= weight;
      if (roll <= 0) return type === avoidType && Math.random() < 0.28 ? "sunny" : type;
    }
    return "sunny";
  }

  function getWeatherDuration(type) {
    if (type === "sunny") return random(28, 54);
    if (type === "typhoon") return random(12, 24);
    if (type === "heavyRain") return random(14, 26);
    if (type === "fog") return random(16, 32);
    if (type === "snow") return random(14, 28);
    if (type === "cloudy") return random(22, 42);
    return random(16, 34);
  }

  function updateWeather(dt) {
    if (state.weatherBlend > 0) {
      state.weatherBlend = Math.min(1, state.weatherBlend + dt / 6);
      if (state.weatherBlend >= 1) {
        state.weatherType = state.weatherNextType || state.weatherType || "sunny";
        state.weatherNextType = state.weatherType;
        state.weatherBlend = 0;
        state.weatherSeed = randomInt(1, 9999);
      }
      return;
    }
    state.weatherTimer -= dt;
    if (state.weatherTimer > 0) return;
    const mood = getWorldMood();
    const nextType = pickWeatherForSeason(mood.seasonIndex, state.weatherType);
    state.weatherTimer = getWeatherDuration(nextType);
    if (nextType === state.weatherType) return;
    state.weatherNextType = nextType;
    state.weatherBlend = 0.001;
  }

  function getWeatherVisual() {
    return {
      current: state.weatherType || "sunny",
      next: state.weatherNextType || state.weatherType || "sunny",
      blend: clamp(state.weatherBlend || 0, 0, 1),
      seed: state.weatherSeed || 1,
    };
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

  function updateRouteFlow(dt) {
    state.routeForkTimer = 0;
    state.routeForkCueTimer = 0;
    state.nextForkTimer = ROUTE_FORK_MAX_GAP;
  }

  function clearForkSideEntities() {
    let cleared = 0;
    for (const entity of state.entities) {
      if (entity.done || entity.remove || entity.lane === 1) continue;
      if (entity.y > player.y + 80) continue;
      entity.remove = true;
      cleared += 1;
      if (entity.type !== "hazard") emitPop(entity.x + entity.w / 2, entity.y - 34, COLORS.aquaDeep, 6);
    }
    if (cleared > 0) floatText("路線合流", player.x + 42, player.y - 104, COLORS.aquaDeep);
  }

  function startRouteFork() {
    state.routeForkTimer = random(ROUTE_FORK_MIN_TIME, ROUTE_FORK_MAX_TIME);
    state.nextForkTimer = 0;
    state.routeForkCueTimer = 0;
    state.routeForkCount += 1;
    state.requiredTimer = Math.min(state.requiredTimer, 0.16);
    state.decoyTimer = Math.min(state.decoyTimer, 0.28);
    state.hazardTimer = Math.max(state.hazardTimer, 0.9);
    showToast("優格快線加速，追好料閃紅色");
    floatText("快線衝刺", player.x + 50, player.y - 132, COLORS.orange);
    emitRingBurst(player.x + 38, player.y - 50, COLORS.orange, 3, 36);
    triggerJuice(COLORS.orange, 1.35, { x: player.x + 38, y: player.y - 48, style: "speed", hitStop: 0.08 });
  }

  function loop(now) {
    const dt = Math.min(0.04, (now - (state.last || now)) / 1000);
    state.last = now;
    if (state.phase !== "over" && !state.paused) state.time += dt;
    if (state.phase === "playing" && !state.paused) update(dt);
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
    state.weightPulse = Math.max(0, state.weightPulse - fxDt * 3.2);
    state.weightDisplayKg += (state.weightKg - state.weightDisplayKg) * Math.min(1, fxDt * 7.5);
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
    state.survivalTime += worldDt;
    updateWeather(worldDt);
    applyDailyCalorieBurn(worldDt);
    state.level = Math.max(1, 1 + Math.floor(state.survivalTime / 12) + Math.floor(state.totalYogurts / 3));
    state.timeRemaining = Math.max(0, state.timeRemaining - worldDt * diff.timerDrain);
    if (state.timeRemaining <= 0) {
      state.hazardPressure = clamp(state.hazardPressure + worldDt * 0.1, 0, 1);
    }
    state.idleToastCooldown = Math.max(0, state.idleToastCooldown - fxDt);

    const feverBoost = state.feverTime > 0 ? 1.24 : 1;
    state.speed = diff.speed * feverBoost;
    state.requiredTimer -= worldDt;
    state.decoyTimer -= worldDt;
    state.hazardTimer -= worldDt;
    state.rewardWaveCooldown = Math.max(0, (state.rewardWaveCooldown || 0) - worldDt);
    state.shake = Math.max(0, state.shake - fxDt * 12);
    player.actionTimer = Math.max(0, player.actionTimer - fxDt);
    player.invuln = Math.max(0, player.invuln - fxDt);
    player.jumpTimer = Math.max(0, player.jumpTimer - fxDt);
    player.slideTimer = Math.max(0, player.slideTimer - fxDt);
    player.jumpDodgeBuffer = Math.max(0, player.jumpDodgeBuffer - fxDt);
    player.slideDodgeBuffer = Math.max(0, player.slideDodgeBuffer - fxDt);
    player.reactionTimer = Math.max(0, player.reactionTimer - fxDt);
    state.slowTime = Math.max(0, state.slowTime - worldDt);
    state.magnetTime = Math.max(0, state.magnetTime - worldDt);
    updateRouteFlow(worldDt);

    if (state.feverTime > 0) {
      state.feverTime -= worldDt;
      if (state.feverTime <= 0) state.fever = 18;
    } else {
      state.fever = Math.max(0, state.fever - worldDt * 3.5);
    }

    processLaneControls(fxDt);
    const laneInput = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    const move = 0;
    const road = getRoadMetrics();
    const bounds = getPlayerRoadBounds();
    const weightMove = 1 - getWeightBurden();
    if (touch.id !== null && Number.isFinite(touch.targetX)) {
      const dx = touch.targetX - player.x;
      const followSpeed = (state.feverTime > 0 ? 620 : 520) * weightMove;
      player.x = clamp(player.x + clamp(dx * 9, -followSpeed, followSpeed) * fxDt, bounds.left, bounds.right);
      if (Math.abs(dx) < 2) player.x = clamp(touch.targetX, bounds.left, bounds.right);
    } else {
      const laneTarget = state.lanes[player.lane] || road.centerX;
      const guidedX = Math.abs(move) > 0 ? player.x : player.x + (laneTarget - player.x) * Math.min(1, fxDt * 7.5);
      player.x = clamp(guidedX + move * (state.feverTime > 0 ? 360 : 286) * weightMove * fxDt, bounds.left, bounds.right);
    }
    state.sceneryOffset += state.speed * worldDt * 0.48;
    player.y += (road.nearY - player.y) * Math.min(1, fxDt * 13);
    player.stepBob += fxDt * (8 + Math.abs(laneInput) * 6 + state.speed / 95 + state.comboSurge * 4);
    updateActivityPressure(worldDt, fxDt, laneInput);

    if (state.requiredTimer <= 0) {
      spawnArcadePositive();
      state.requiredTimer = diff.required;
    }
    if (diff.decoy && state.decoyTimer <= 0) {
      spawnArcadeExtra();
      state.decoyTimer = random(diff.decoyMin, diff.decoyMax);
    }
    if (diff.hazard && state.hazardTimer <= 0) {
      spawnHazard();
      state.hazardTimer = random(diff.hazardMin, diff.hazardMax);
    }

    for (const entity of state.entities) {
      const slowFactor = entity.type === "hazard" && state.slowTime > 0 ? 0.56 : 1;
      const travelFactor = entity.type === "hazard" ? 0.74 : entity.type === "bonus" ? 0.82 : 0.86;
      entity.y += (state.speed + entity.speedOffset) * slowFactor * worldDt * travelFactor;
      entity.depthScale = roadEntityScale(entity.y);
      entity.x = roadLaneCenter(entity.lane, entity.y) - entity.w / 2 + (entity.lateralOffset || 0) * entity.depthScale;
      if (state.magnetTime > 0 && entity.type !== "hazard" && !entity.done && entity.y > road.horizonY && entity.y < player.y + 90) {
        const pull = clamp(player.x - (entity.x + entity.w / 2), -260, 260);
        const strength = entity.type === "bonus" ? 4.2 : 3.4;
        entity.x += pull * Math.min(1, worldDt * strength);
      }
      entity.anim += fxDt;
      entity.resolveTimer = Math.max(0, (entity.resolveTimer || 0) - fxDt);
      entity.trailTimer -= fxDt;
      if (entity.trailTimer <= 0 && entity.y > road.horizonY - 60 && entity.y < state.height + 120) {
        emitEntityTrail(entity);
        entity.trailTimer = entity.type === "hazard" ? 0.1 : entity.type === "bonus" ? 0.07 : entity.required ? 0.12 : 0.18;
      }
      if (entity.type === "hazard") resolveHazardAtPlayerLine(entity);
      if (entity.type !== "hazard" && !entity.done && entity.y > player.y + 48) missPositive(entity);
    }

    const playerHitBox = playerRect();
    for (const entity of state.entities) {
      if (entity.type === "hazard") continue;
      if (!entity.done && canEntityCollideWithPlayer(entity) && overlap(playerHitBox, entityRect(entity))) {
        handleCollision(entity);
      }
    }

    state.entities = state.entities.filter((entity) => entity.y < state.height + 160 && !entity.remove);

    if (state.weightKg >= WEIGHT_LIMIT_KG) {
      triggerWeightFail();
      return;
    }
    if (state.purity <= 0) {
      state.gameOverKind = "purity";
      endGame("純淨率歸零");
      return;
    }

    for (const burst of state.bursts) {
      burst.life -= fxDt;
      burst.angle += burst.spin * fxDt;
    }
    state.bursts = state.bursts.filter((burst) => burst.life > 0);

    for (const burst of state.brandBursts) {
      burst.life -= fxDt;
      burst.x += (burst.vx || 0) * fxDt;
      burst.y += (burst.vy || 0) * fxDt;
      burst.angle += (burst.spin || 0) * fxDt;
    }
    state.brandBursts = state.brandBursts.filter((burst) => burst.life > 0);

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
    const pointerActive = touch.id !== null && Number.isFinite(touch.targetX) && (isMobileLayout() || Math.abs(touch.targetX - player.x) > 2);
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
    return null;
  }

  function isNextTargetEntity(entity) {
    return false;
  }

  function laneForKey(key) {
    const index = LANE_RULES.findIndex((rule) => rule.keys.includes(key));
    return index >= 0 ? index : 1;
  }

  function summarizeRecipeProgress(recipe) {
    let ownedUnits = 0;
    let totalUnits = 0;
    let missingUnits = 0;
    const missing = [];
    const needs = [];
    for (const [key, count] of Object.entries(recipe.needs)) {
      const have = state.inventory[key] || 0;
      const ready = have >= count;
      const lack = Math.max(0, count - have);
      totalUnits += count;
      ownedUnits += Math.min(have, count);
      needs.push({ key, count, have: Math.min(have, count), missing: lack, ready, lane: laneForKey(key) });
      if (!ready) {
        missingUnits += lack;
        missing.push({ key, count: lack, lane: laneForKey(key) });
      }
    }
    return {
      recipe,
      official: OFFICIAL_YOGURT_IDS.has(recipe.id),
      ownedUnits,
      totalUnits,
      missingUnits,
      missing,
      needs,
      ready: missingUnits === 0,
    };
  }

  function sortRecipeHints(a, b) {
    if (a.ready !== b.ready) return a.ready ? -1 : 1;
    if (a.missingUnits !== b.missingUnits) return a.missingUnits - b.missingUnits;
    if (a.official !== b.official) return a.official ? -1 : 1;
    if (a.ownedUnits !== b.ownedUnits) return b.ownedUnits - a.ownedUnits;
    return b.recipe.points - a.recipe.points;
  }

  function getRecipeHint(options = {}) {
    const officialOnly = Boolean(options.officialOnly);
    const pool = officialOnly ? YOGURT_RECIPES.filter((recipe) => OFFICIAL_YOGURT_IDS.has(recipe.id)) : YOGURT_RECIPES;
    const hints = pool.map(summarizeRecipeProgress).sort(sortRecipeHints);
    return hints[0] || null;
  }

  function chooseHintIngredient() {
    const hint = getRecipeHint({ officialOnly: Math.random() < 0.82 });
    if (!hint || !hint.missing.length) return null;
    const close = hint.missing.filter((item) => item.count > 0);
    const pool = close.length ? close : hint.missing;
    const preferred = pool.slice(0, Math.min(3, pool.length));
    return preferred[randomInt(0, preferred.length - 1)]?.key || null;
  }

  function spawnArcadePositive(forceLane = null) {
    if (!canSpawnCollectible()) return null;
    let lane = forceLane === null ? chooseArcadeLane() : normalizePlayableLane(forceLane);
    let key = null;
    if (forceLane === null && state.flavorRushTime <= 0 && Math.random() < 0.66) {
      key = chooseHintIngredient();
      if (key) lane = normalizePlayableLane(laneForKey(key));
    }
    const rule = LANE_RULES[lane];
    if (!key) key = pickLaneKey(rule, state.flavorRushTime > 0);
    const asStation = STATION_KEYS.includes(key);
    return spawnEntity({
      type: asStation ? "station" : "item",
      key,
      required: false,
      lane,
      label: TYPES[key].label,
      speedOffset: state.flavorRushTime > 0 ? random(-18, 8) : random(-10, 24),
    });
  }

  function chooseArcadeLane() {
    if (state.magnetTime > 0 && Math.random() < 0.52) return player.lane;
    if (isForkRouteOpen() && Math.random() < 0.48) return differentLane(player.lane);
    const pressureLane = state.combo > 10 && Math.random() < 0.42 ? differentLane(player.lane) : randomPlayableLane();
    return pressureLane;
  }

  function pickLaneKey(rule, rush = false) {
    const keys = rush && rule.keys.some((key) => FLAVOR_REWARD_KEYS.includes(key))
      ? rule.keys.filter((key) => FLAVOR_REWARD_KEYS.includes(key))
      : rule.keys;
    return keys[randomInt(0, keys.length - 1)];
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
    const options = getPlayableLanes().filter((item) => item !== lane);
    if (!options.length) return 1;
    return options[randomInt(0, options.length - 1)];
  }

  function spawnArcadeExtra() {
    const diff = getDifficulty();
    if (!canSpawnCollectible()) return null;
    const bonusChance = state.flavorRushTime > 0 ? Math.min(0.48, diff.bonusChance + 0.12) : diff.bonusChance;
    if (Math.random() < bonusChance) {
      const lane = state.magnetTime > 0 && Math.random() < 0.52 ? player.lane : randomPlayableLane();
      const entity = spawnBonusPickup(lane, random(-16, 20));
      if (state.flavorRushTime > 0 && Math.random() < 0.45) spawnArcadePositive(differentLane(lane));
      return entity;
    }
    return spawnArcadePositive(randomPlayableLane());
  }

  function spawnBonusPickup(lane = randomPlayableLane(), speedOffset = random(-16, 20)) {
    if (!canSpawnCollectible()) return null;
    const bonus = BONUS[randomInt(0, BONUS.length - 1)];
    return spawnEntity({ type: "bonus", key: bonus.key, lane: normalizePlayableLane(lane), bonus, speedOffset });
  }

  function collectibleCap() {
    return (isMobileLayout() ? 7 : 10) + (state.flavorRushTime > 0 ? 2 : 0);
  }

  function activeCollectibleCount() {
    return state.entities.filter((entity) => entity.type !== "hazard" && !entity.done && !entity.remove && entity.y < state.height + 80).length;
  }

  function canSpawnCollectible(extra = 0) {
    return activeCollectibleCount() + extra < collectibleCap();
  }

  function spawnRewardWave(originLane = player.lane, options = {}) {
    if (!options.ignoreCooldown && (state.rewardWaveCooldown || 0) > 0) return 0;
    const lanes = getPlayableLanes();
    if (!lanes.length) return 0;
    const room = Math.max(0, collectibleCap() - activeCollectibleCount());
    if (room <= 1) return 0;
    const focusLane = normalizePlayableLane(originLane);
    const focusIndex = Math.max(0, lanes.indexOf(focusLane));
    const bonusCount = Math.min(options.bonusCount ?? (state.flavorRushTime > 0 ? 1 : 0), Math.max(0, room - 1));
    const count = Math.min(options.count ?? (state.flavorRushTime > 0 ? 3 : 2), Math.max(1, room - bonusCount));
    let spawned = 0;
    for (let i = 0; i < count; i += 1) {
      const lane = lanes[(focusIndex + i) % lanes.length] ?? randomPlayableLane();
      const entity = spawnArcadePositive(lane);
      if (!entity) continue;
      entity.speedOffset = (entity.speedOffset || 0) + random(-18, 12) - i * 4;
      entity.trailTimer = 0.02 + i * 0.03;
      spawned += 1;
    }
    for (let i = 0; i < bonusCount; i += 1) {
      const lane = lanes[(focusIndex + i + 1) % lanes.length] ?? focusLane;
      const entity = spawnBonusPickup(lane, random(-20, 10));
      if (!entity) continue;
      entity.trailTimer = 0.02 + i * 0.04;
      spawned += 1;
    }
    if (spawned <= 0) return 0;
    state.requiredTimer = Math.min(state.requiredTimer, 0.24);
    state.decoyTimer = Math.min(state.decoyTimer, 0.38);
    state.rewardWaveCooldown = options.cooldown ?? (state.flavorRushTime > 0 ? 1.4 : 2.15);
    state.speedLineTime = Math.max(state.speedLineTime, 0.7);
    state.comboSurge = Math.max(state.comboSurge, 0.9);
    if (options.text) floatText(options.text, player.x + 58, player.y - 144, COLORS.yellow);
    return spawned;
  }

  function spawnHazard() {
    const idleThreat = state.idleTime > 1.05 || state.hazardPressure > 0.5;
    const activeHazards = state.entities.filter((item) => item.type === "hazard" && !item.done && !item.remove && item.y < player.y + 120).length;
    const lateRamp = clamp((state.survivalTime - 45) / 95 + Math.max(0, state.level - 12) * 0.035, 0, 0.85);
    const hazardCap = state.survivalTime < 12 ? 1 : state.survivalTime < 28 ? 2 : state.survivalTime < 70 ? 3 : 4;
    if (activeHazards >= hazardCap) return;
    const diff = getDifficulty();
    const chaseChance = state.survivalTime < 10 ? 0.1 : clamp(diff.hazardTarget * 0.42 + state.hazardPressure * 0.08 + lateRamp * 0.14 + (idleThreat ? 0.1 : 0), 0, 0.7);
    const clusterChance = clamp(-0.1 + state.level * 0.008 + state.survivalTime * 0.0014 + state.hazardPressure * 0.03 + lateRamp * 0.18, 0, 0.38);
    const playable = getPlayableLanes();
    const count = (state.level >= 10 || state.survivalTime > 65) && Math.random() < clusterChance ? 2 : 1;
    const used = new Set();
    for (let i = 0; i < count; i += 1) {
      let lane = i === 0 && Math.random() < chaseChance ? player.lane : randomPlayableLane();
      if (used.has(lane)) lane = differentLane(lane);
      used.add(lane);
      const hazardPool = LANE_RULES[lane].hazards;
      const hazardKey = hazardPool[randomInt(0, hazardPool.length - 1)];
      const hazard = HAZARDS.find((item) => item.key === hazardKey) || HAZARDS[randomInt(0, HAZARDS.length - 1)];
      const speedOffset = random(-8, 14) + Math.min(50, state.hazardPressure * 12 + Math.max(0, state.idleTime - 1) * 8 + state.level * 0.95 + lateRamp * 22);
      spawnEntity({ type: "hazard", key: hazard.key, lane, hazard, speedOffset, dodge: "avoid", gapLane: null });
      if (lane === player.lane && state.survivalTime > 12) emitLaneFlash(lane, hazard.color);
    }
  }

  function pickHazardDodge() {
    if (!isForkRouteOpen()) return Math.random() < 0.54 ? "jump" : "slide";
    const roll = Math.random();
    const actionChance = clamp(0.34 + state.level * 0.014, 0.34, 0.58);
    if (roll < actionChance * 0.5) return "jump";
    if (roll < actionChance) return "slide";
    return Math.random() < 0.5 ? "left" : "right";
  }

  function isLaneGapDodge(dodge) {
    return dodge === "left" || dodge === "right";
  }

  function isLaneGapHazard(entity) {
    return entity?.type === "hazard" && isLaneGapDodge(entity.dodge) && Number.isFinite(entity.gapLane);
  }

  function getGapLaneForDodge(dodge, lane) {
    if (!isLaneGapDodge(dodge)) return null;
    return dodge === "left" ? 0 : 2;
  }

  function spawnEntity(options) {
    const def = TYPES[options.key] || options.hazard || options.bonus;
    const station = options.type === "station";
    const w = station ? 92 : options.type === "hazard" ? 64 : 58;
    const h = station ? 76 : options.type === "hazard" ? 58 : 54;
    const road = getRoadMetrics();
    const spawnY = road.horizonY - random(16, 58);
    const lane = normalizePlayableLane(options.lane ?? 1);
    const entity = {
      id: entityId++,
      type: options.type,
      key: options.key,
      required: Boolean(options.required),
      done: false,
      remove: false,
      x: roadLaneCenter(lane, spawnY) - w / 2,
      lane,
      y: spawnY,
      w,
      h,
      label: options.label || def.label,
      short: def.short,
      color: def.color,
      bg: def.bg || "#fff4dc",
      speedOffset: options.speedOffset ?? random(-12, 28),
      lateralOffset: random(-8, 8),
      depthScale: roadEntityScale(spawnY),
      anim: random(0, 2),
      trailTimer: random(0.04, 0.16),
      hazard: options.hazard,
      bonus: options.bonus,
      dodge: options.dodge || "lane",
      gapLane: Number.isFinite(options.gapLane) ? options.gapLane : null,
      resolved: "",
      resolveTimer: 0,
      resolveDodge: "",
      pulse: 0,
    };
    state.entities.push(entity);
    return entity;
  }

  function handleCollision(entity) {
    if (entity.type === "hazard") {
      entity.done = true;
      entity.remove = false;
      handleHazardImpact(entity);
      return;
    }

    if (entity.type === "bonus") {
      entity.done = true;
      entity.remove = true;
      collectBonus(entity);
      return;
    }

    if (entity.type === "station") {
      if (player.actionTimer <= 0) triggerAction();
      entity.done = true;
      entity.remove = true;
      collectArcadeItem(entity);
      return;
    }

    entity.done = true;
    entity.remove = true;
    collectArcadeItem(entity);
  }

  function resolveHazardAtPlayerLine(entity) {
    if (entity.done || entity.remove) return;
    const passLine = player.y - (isLaneGapHazard(entity) ? 24 : 18);
    if (entity.y < passLine) return;

    if (isHazardOutsidePlayerLane(entity)) {
      entity.done = true;
      entity.remove = false;
      entity.resolved = "clear";
      entity.resolveTimer = 0.5;
      entity.resolveDodge = "";
      state.hazardPressure = Math.max(0, state.hazardPressure - 0.12);
      return;
    }

    if (isHazardSafelyDodged(entity)) {
      resolveDodgedHazard(entity);
      return;
    }

    entity.done = true;
    entity.remove = true;
    handleHazardImpact(entity);
  }

  function isHazardSafelyDodged(entity) {
    const currentLane = playerEffectiveLane();
    if (entity.dodge === "jump") return player.jumpTimer > 0.04 || player.jumpDodgeBuffer > 0 || getJumpLift() > 8;
    if (entity.dodge === "slide") return player.slideTimer > 0.04 || player.slideDodgeBuffer > 0;
    if (isLaneGapHazard(entity)) return currentLane === entity.gapLane;
    return false;
  }

  function isHazardOutsidePlayerLane(entity) {
    return !isLaneGapHazard(entity) && Number.isFinite(entity.lane) && entity.lane !== playerEffectiveLane();
  }

  function handleHazardImpact(entity) {
    entity.resolved = "impact";
    entity.resolveTimer = Math.max(entity.resolveTimer || 0, 1.05);
    entity.resolveDodge = entity.dodge || "";
    entity.remove = true;
    emitHazardImpact(entity);
    setPlayerReaction(entity.key, entity.color, 1.35);
    registerMistake(`${entity.label}撞上來了`, entity);
  }

  function resolveDodgedHazard(entity) {
    entity.done = true;
    entity.remove = false;
    entity.resolved = "dodge";
    entity.resolveTimer = Math.max(entity.resolveTimer || 0, 0.95);
    entity.resolveDodge = entity.dodge || "";
    const value = 1 + Math.min(3, Math.floor(state.survivalTime / 24));
    state.score += value;
    state.fever = clamp(state.fever + 3, 0, 100);
    state.hazardPressure = Math.max(0, state.hazardPressure - 0.38);
    noteActivePlay(1.25);
    emitPop(entity.x + entity.w / 2, entity.y - 34, COLORS.aquaDeep, 12);
    emitRingBurst(entity.x + entity.w / 2, entity.y - 40, COLORS.aquaDeep, 2, 25);
    triggerJuice(COLORS.aquaDeep, 0.78, { x: entity.x + entity.w / 2, y: entity.y - 52, style: "speed", hitStop: 0.045 });
    beep(760, 0.035, "triangle", 0.022);
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
    const shakePower = options.shake ?? (options.style === "hazard" ? 0.28 : power >= 1.9 ? 0.08 + power * 0.12 : 0);
    if (shakePower > 0) state.shake = Math.max(state.shake, shakePower);
    state.flash = Math.max(state.flash, 0.18 + power * 0.12);
    state.flashColor = color;
    state.zoomKick = Math.max(state.zoomKick, 0.35 + power * 0.78);
    state.speedLineTime = Math.max(state.speedLineTime, 0.16 + power * 0.16);
    state.comboSurge = Math.max(state.comboSurge, 0.3 + power * 0.38);
    emitImpactBurst(x, y, color, options.style || "spark", 0.8 + power * 0.35);
    if (power >= 0.9) emitScreenSparks(x, y, color, Math.round(10 + power * 10));
  }

  function triggerBrandBurst(label, options = {}) {
    const color = options.color || COLORS.aquaDeep;
    const power = options.power || 1;
    const x = options.x ?? player.x + 52;
    const y = options.y ?? player.y - 132;
    state.brandBursts.push({
      label,
      sub: options.sub || "純粹優格多一點",
      x,
      y,
      vx: options.vx || 0,
      vy: options.vy ?? -12,
      color,
      style: options.style || "shine",
      power,
      angle: random(0, Math.PI),
      spin: random(-1.6, 1.6),
      life: options.life || 1.05 + power * 0.18,
      maxLife: options.life || 1.05 + power * 0.18,
    });
    if (state.brandBursts.length > 5) state.brandBursts.splice(0, state.brandBursts.length - 5);
    emitRingBurst(x, y - 6, color, power >= 1.5 ? 4 : 3, 34 + power * 8);
    emitImpactBurst(x, y - 6, color, options.style === "rush" ? "confetti" : options.style === "shield" ? "shield" : "stamp", 1.05 + power * 0.25);
    emitImpactParticles(x, y - 8, [color, COLORS.aqua, COLORS.yellow, "#ffffff"], Math.round(16 + power * 18), {
      spread: Math.PI * 2,
      speedMin: 120,
      speedMax: 360 + power * 80,
      friction: 0.955,
      gravity: 70,
      spin: 18,
      shape: options.style === "rush" ? "confetti" : "spark",
      sizeMin: 4,
      sizeMax: 11,
      lifeMin: 0.42,
      lifeMax: 0.9,
      jitter: 26,
    });
    state.flash = Math.max(state.flash, 0.2 + power * 0.08);
    state.flashColor = color;
    state.speedLineTime = Math.max(state.speedLineTime, 0.48 + power * 0.22);
    state.comboSurge = Math.max(state.comboSurge, 0.45 + power * 0.25);
  }

  function collectArcadeItem(entity) {
    const def = TYPES[entity.key];
    const fever = state.feverTime > 0;
    const rushMult = state.flavorRushTime > 0 ? state.flavorMultiplier : 1;
    const comboBonus = Math.min(4, Math.floor(state.combo / 12));
    const base = ITEM_POINTS[entity.key] || 1;
    const value = Math.max(1, Math.round((base + comboBonus) * rushMult * (fever ? 1.35 : 1)));

    noteActivePlay(1.15);
    state.inventory[entity.key] = (state.inventory[entity.key] || 0) + 1;
    state.score += value;
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.fever = clamp(state.fever + 5 + Math.min(6, state.combo * 0.045), 0, 100);
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 0.16);
    state.carry = def.hold || def.stage || def.label;
    applyItemWeightEffect(entity.key, entity.x + entity.w / 2, entity.y - 98);
    if (state.phase === "over") return;

    applyArcadeFeature(entity.key, def, entity);
    const crafted = craftYogurts(entity, def);
    addFlavorChargeArcade(entity, def, crafted);
    handleComboPrize();
    triggerQuickComboSurge(entity, def);
    renderRecipe();
    if (state.fever >= 100 && state.feverTime <= 0 && state.combo >= 24 && state.totalYogurts >= 3) activateFever();

    emitPop(entity.x + entity.w / 2, entity.y - 28, def.color, 14);
    emitElementImpact(entity.key, entity, def.color, false);
    emitRingBurst(entity.x + entity.w / 2, entity.y - 34, def.color, 1, 20);
    emitLaneFlash(entity.lane, def.color);
    setPlayerReaction(entity.key, def.color, 0.9);
    triggerJuice(def.color, state.flavorRushTime > 0 ? 1.28 : 0.9, {
      x: entity.x + entity.w / 2,
      y: entity.y - 48,
      style: state.flavorRushTime > 0 ? "confetti" : "spark",
      hitStop: state.flavorRushTime > 0 ? 0.085 : 0.055,
    });
    floatText(`+${value}`, entity.x + entity.w / 2, entity.y - 70, def.color);
    beep(500 + Math.min(520, state.combo * 12), 0.04, "square", 0.028);
    updateHud();
  }

  function triggerQuickComboSurge(entity, def) {
    if (state.combo < 5 || state.combo % 5 !== 0) return;
    const surgeValue = Math.min(16, 3 + Math.floor(state.combo / 5) * 2);
    state.score += surgeValue;
    state.fever = clamp(state.fever + 6 + Math.min(6, Math.floor(state.combo / 10)), 0, 100);
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 0.28);
    state.speedLineTime = Math.max(state.speedLineTime, 0.62);
    state.comboSurge = Math.max(state.comboSurge, 0.72);
    state.zoomKick = Math.max(state.zoomKick, 0.42);
    spawnRewardWave(entity.lane, {
      count: state.combo % 10 === 0 ? 2 : 1,
      bonusCount: state.combo % 10 === 0 ? 1 : 0,
      cooldown: state.combo % 10 === 0 ? 1.45 : 2.1,
      text: state.combo % 10 === 0 ? "好料雨" : "好料連發",
    });
    if (state.combo % 10 === 0) {
      state.magnetTime = Math.max(state.magnetTime, 1.35);
      emitScreenSparks(player.x, player.y - 54, def.color, 12);
      triggerBrandBurst("好料連發", {
        sub: `${state.combo} 連吃`,
        x: player.x + 58,
        y: player.y - 136,
        color: def.color,
        style: "shine",
        power: 1.05,
      });
    }
    emitRingBurst(player.x, player.y - 48, def.color, state.combo % 10 === 0 ? 3 : 2, state.combo % 10 === 0 ? 38 : 28);
    emitPop(player.x, player.y - 36, def.color, state.combo % 10 === 0 ? 24 : 16);
    if (state.combo % 10 !== 0) floatText(`連吃 x${state.combo}`, player.x + 58, player.y - 118, def.color);
    floatText(`+${surgeValue}`, player.x + 58, player.y - 94, COLORS.leaf);
    beep(760 + Math.min(360, state.combo * 6), 0.045, "triangle", 0.028);
  }

  function missPositive(entity) {
    entity.done = true;
    entity.required = false;
    state.combo = 0;
    state.lastComboPrize = 0;
    state.multiplier = 1;
    state.fever = Math.max(0, state.fever - 3);
    state.hazardPressure = clamp(state.hazardPressure + 0.12, 0, 3.2);
  }

  function applyItemWeightEffect(key, x = player.x, y = player.y - 110) {
    if (PURE_BASE_KEYS.has(key)) {
      if (state.combo > 0 && state.combo % 20 === 0) floatText("0負擔", x, y, COLORS.aquaDeep);
      return;
    }
    state.officialYogurtStreak = 0;
    const kcal = ITEM_KCAL[key] ?? (FLAVOR_WEIGHT_KEYS.has(key) ? 60 : 30);
    const def = TYPES[key] || {};
    adjustCalories(kcal, x, y, COLORS.berry, {
      sourceKey: `item:${key}`,
      sourceLabel: def.label || key,
      sourceKind: "風味加料",
      sourceColor: def.color || COLORS.berry,
    });
  }

  function applyRecipeWeightEffect(recipe, x = player.x, y = player.y - 110) {
    const nutrition = RECIPE_NUTRITION[recipe.id] || { kcal: 160, credit: 80 };
    const netKcal = nutrition.kcal - nutrition.credit;
    if (OFFICIAL_YOGURT_IDS.has(recipe.id)) {
      state.officialYogurtStreak += 1;
      const streakKcal = state.officialYogurtStreak >= 3 ? 110 + Math.min(80, state.weightLossCount * 12) : 0;
      adjustCalories(netKcal - streakKcal, x, y, COLORS.leaf, {
        sourceKey: `recipe:${recipe.id}`,
        sourceLabel: recipe.label,
        sourceKind: "官方優格合成",
        sourceColor: recipe.color,
        kcalIntake: nutrition.kcal,
        kcalBurn: nutrition.credit + streakKcal,
      });
      if (streakKcal > 0) {
        state.weightLossCount += 1;
        state.officialYogurtStreak = 0;
        floatText("連吃減重", x, y - 24, COLORS.leaf);
      } else {
        floatText("合成減重", x, y, COLORS.aquaDeep);
      }
      return;
    }
    state.officialYogurtStreak = 0;
    adjustCalories(netKcal, x, y, COLORS.berry, {
      sourceKey: `recipe:${recipe.id}`,
      sourceLabel: recipe.label,
      sourceKind: "自搭配口味",
      sourceColor: recipe.color,
      kcalIntake: nutrition.kcal,
      kcalBurn: nutrition.credit,
    });
  }

  function applyBonusWeightEffect(key, x = player.x, y = player.y - 110) {
    const kcal = BONUS_KCAL[key] ?? 60;
    if (kcal <= 0) {
      adjustCalories(kcal, x, y, COLORS.leaf, {
        sourceKey: `bonus:${key}`,
        sourceLabel: (BONUS.find((item) => item.key === key) || {}).label || key,
        sourceKind: "輕盈道具",
        sourceColor: COLORS.leaf,
      });
      return;
    }
    const bonus = BONUS.find((item) => item.key === key) || {};
    adjustCalories(kcal, x, y, COLORS.berry, {
      sourceKey: `bonus:${key}`,
      sourceLabel: bonus.label || key,
      sourceKind: "爽感道具",
      sourceColor: bonus.color || COLORS.berry,
    });
  }

  function gainHazardWeight(entity) {
    const kcal = HAZARD_KCAL[entity.key] ?? 300;
    adjustCalories(kcal, player.x + 22, player.y - 112, entity.color || COLORS.berry, {
      sourceKey: `hazard:${entity.key}`,
      sourceLabel: entity.label || "紅色危險物",
      sourceKind: "紅色危險物",
      sourceColor: entity.color || COLORS.berry,
    });
  }

  function applyDailyCalorieBurn(dt) {
    if (dt <= 0 || state.phase !== "playing") return;
    const burnKcal = getDailyBurnKcal() / GAME_DAY_SECONDS * dt;
    const loss = kcalToWeightDelta(-burnKcal);
    const before = state.weightKg;
    state.weightKg = clamp(state.weightKg + loss, 48, WEIGHT_LIMIT_KG);
    const actualLoss = Math.max(0, before - state.weightKg);
    if (actualLoss > 0) {
      state.weightLossTotal += actualLoss;
      state.calorieBurnKcal += burnKcal;
    }
  }

  function getDailyBurnKcal() {
    return Math.max(1320, state.weightKg * NORMAL_DAILY_BURN_PER_KG);
  }

  function kcalToWeightDelta(kcal) {
    return kcal / KCAL_PER_WEIGHT_KG * ARCADE_KCAL_SCALE;
  }

  function weightDeltaToKcal(delta) {
    return Math.abs(delta) * KCAL_PER_WEIGHT_KG / ARCADE_KCAL_SCALE;
  }

  function adjustCalories(kcal, x = player.x, y = player.y - 110, color = COLORS.berry, options = {}) {
    adjustWeight(kcalToWeightDelta(kcal), x, y, color, {
      ...options,
      kcal,
      kcalIntake: options.kcalIntake ?? (kcal > 0 ? kcal : 0),
      kcalBurn: options.kcalBurn ?? (kcal < 0 ? Math.abs(kcal) : 0),
    });
  }

  function adjustWeight(amount, x = player.x, y = player.y - 110, color = COLORS.berry, options = {}) {
    if (state.phase === "over" || amount === 0) return;
    const opts = typeof options === "object" && options ? options : { forceFail: Boolean(options) };
    const delta = amount;
    state.weightKg = clamp(state.weightKg + delta, 48, WEIGHT_LIMIT_KG);
    state.weightPulse = Math.min(1.5, state.weightPulse + Math.max(0.18, Math.abs(delta) * 0.45));
    recordWeightChange(delta, opts);
    const label = `${delta > 0 ? "+" : ""}${delta.toFixed(1)}kg`;
    if (Math.abs(delta) >= 0.08) floatText(label, x, y, color);
    if (opts.forceFail || state.weightKg >= WEIGHT_LIMIT_KG) {
      triggerWeightFail();
    }
  }

  function recordWeightChange(delta, opts) {
    const intake = Math.max(0, opts.kcalIntake || 0);
    const burn = Math.max(0, opts.kcalBurn || 0);
    state.calorieIntakeKcal += intake;
    state.calorieBurnKcal += burn;
    if (delta > 0 && opts.sourceKey) {
      const source = state.weightGainSources[opts.sourceKey] || {
        label: opts.sourceLabel || "未知來源",
        kind: opts.sourceKind || "增重來源",
        color: opts.sourceColor || COLORS.berry,
        amount: 0,
        kcal: 0,
        count: 0,
      };
      source.amount += delta;
      source.kcal += Math.max(0, opts.kcal ?? weightDeltaToKcal(delta));
      source.count += 1;
      state.weightGainSources[opts.sourceKey] = source;
      state.weightGainTotal += delta;
    } else if (delta < 0) {
      state.weightLossTotal += Math.abs(delta);
    }
  }

  function triggerWeightFail() {
    if (state.phase === "over") return;
    state.weightKg = WEIGHT_LIMIT_KG;
    state.weightDisplayKg = WEIGHT_LIMIT_KG;
    state.weightPulse = 1.5;
    state.gameOverKind = "weight";
    endGame("體重衝到 70kg");
  }

  function getWeightBurden() {
    return Math.min(0.18, Math.max(0, state.weightKg - 52) * 0.012);
  }

  function getPlayerWeightScale() {
    const delta = state.weightDisplayKg - 52;
    const bodyShift = delta >= 0 ? Math.min(0.42, delta * 0.022) : Math.max(-0.08, delta * 0.012);
    return 1 + bodyShift + state.weightPulse * 0.025;
  }

  function getWeightStage(weight = state.weightDisplayKg) {
    if (weight >= 68) return "danger";
    if (weight >= 64) return "heavy";
    if (weight >= 58) return "warning";
    return "normal";
  }

  function applyArcadeFeature(key, def, entity) {
    let text = def.effect;
    let purity = 0;
    let fever = 0;
    let time = 0;

    if (key === "milk") {
      purity = 1;
      text = "鮮甜";
    } else if (key === "culture") {
      state.magnetTime = Math.max(state.magnetTime, 2.2);
      fever = 2;
      text = "輕盈";
    } else if (key === "protein") {
      fever = 3;
      text = "飽足";
    } else if (key === "calcium") {
      state.slowTime = Math.max(state.slowTime, 1.8);
      text = "穩住";
    } else if (key === "honey" || key === "oat" || key === "ship") {
      time = 0.35;
    } else if (key === "fruit" || key === "matcha" || key === "cocoa" || key === "swirl") {
      fever = 3;
    } else if (key === "qc") {
      purity = 2;
      if (state.combo >= 16 && state.shield < 2) state.shield += 1;
    } else if (key === "chill") {
      state.slowTime = Math.max(state.slowTime, 1.6);
      time = 0.25;
    } else if (key === "pack") {
      purity = 1;
    }

    if (purity > 0) state.purity = clamp(state.purity + purity, 0, 100);
    if (fever > 0) state.fever = clamp(state.fever + fever, 0, 100);
    if (time > 0) state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + time);
    state.brandHeat += 1;
    if (text) {
      emitFeatureSpark(entity.x + entity.w / 2, entity.y - 42, def.color, 6);
      emitBadgeBurst(entity.x + entity.w / 2, entity.y - 52, def.color, def.short);
    }
  }

  function craftYogurts(entity, sourceDef) {
    let crafted = 0;
    let lastRecipe = null;
    const recipes = [...YOGURT_RECIPES].sort((a, b) => {
      const officialDelta = Number(OFFICIAL_YOGURT_IDS.has(b.id)) - Number(OFFICIAL_YOGURT_IDS.has(a.id));
      return officialDelta || b.points - a.points;
    });
    let made = true;
    while (made) {
      made = false;
      for (const recipe of recipes) {
        if (!canCraft(recipe)) continue;
        consumeRecipe(recipe);
        const rushMult = state.flavorRushTime > 0 ? state.flavorMultiplier : 1;
        const points = Math.round(recipe.points * rushMult);
        state.yogurts[recipe.id] = (state.yogurts[recipe.id] || 0) + 1;
        state.totalYogurts += 1;
        state.completedOrders = state.totalYogurts;
        state.score += points;
        applyRecipeWeightEffect(recipe, player.x + 92, player.y - 122 - crafted * 18);
        if (state.phase === "over") return crafted;
        state.fever = clamp(state.fever + 6, 0, 100);
        state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 0.7);
        state.packages.push({ x: player.x + 70, y: player.y - 20, color: recipe.color, bob: 0 });
        lastRecipe = recipe;
        floatText(`${recipe.label} +${points}`, player.x + 94, player.y - 96 - crafted * 20, recipe.color);
        emitPop(player.x + 70, player.y - 38, recipe.color, 22);
        emitRingBurst(player.x + 70, player.y - 48, recipe.color, 3, 30);
        triggerJuice(recipe.color, state.flavorRushTime > 0 ? 1.8 : 1.35, { x: player.x + 70, y: player.y - 48, style: "stamp", hitStop: 0.09 });
        crafted += 1;
        made = true;
        break;
      }
    }
    if (crafted > 0) {
      state.level = Math.max(state.level, 1 + Math.floor(state.survivalTime / 12) + Math.floor(state.totalYogurts / 3));
      renderRecipe();
      spawnRewardWave(player.lane, {
        count: Math.min(3, 1 + crafted),
        bonusCount: crafted >= 2 || state.totalYogurts % 4 === 0 ? 1 : 0,
        cooldown: 1.65,
        text: "優格補給",
      });
      triggerBrandBurst(crafted >= 2 ? "優格連做" : "做出優格", {
        sub: crafted >= 2 ? `${crafted} 杯純粹補給` : lastRecipe?.label || "純粹好食",
        x: player.x + 76,
        y: player.y - 146,
        color: lastRecipe?.color || sourceDef?.color || COLORS.aquaDeep,
        style: crafted >= 2 ? "rush" : "shine",
        power: crafted >= 2 ? 1.35 : 1.12,
      });
      showToast(`做出 ${crafted} 杯優格，繼續自搭`);
      beep(820, 0.07, "triangle", 0.035);
    }
    return crafted;
  }

  function canCraft(recipe) {
    return Object.entries(recipe.needs).every(([key, count]) => (state.inventory[key] || 0) >= count);
  }

  function consumeRecipe(recipe) {
    for (const [key, count] of Object.entries(recipe.needs)) {
      state.inventory[key] = Math.max(0, (state.inventory[key] || 0) - count);
    }
  }

  function addFlavorChargeArcade(entity, def, crafted) {
    if (state.flavorCountdown > 0 || state.flavorRushTime > 0) return;
    const charge = 0.62 + (crafted > 0 ? 1.15 + crafted * 0.35 : 0) + Math.min(0.45, state.combo * 0.008);
    state.flavorCharge += charge;
    const threshold = 15 + state.customFlavors * 3.5 + Math.min(8, state.level * 0.45);
    const fill = clamp(state.flavorCharge / threshold, 0, 1);
    const rushReady = state.combo >= 14 && state.totalYogurts >= 2;
    if (fill >= 0.76 && rushReady && state.flavorCueTime <= 0) {
      state.flavorCueTime = 1.2;
      emitFlavorPreview(entity.x + entity.w / 2, entity.y - 76, def.color);
      showToast("自搭口味快爆發了，保持連吃別碰紅色");
    }
    if (fill < 1 || !rushReady) {
      if (fill < 1) emitFeatureSpark(entity.x + entity.w / 2, entity.y - 82, def.color, 3);
      return;
    }
    state.flavorCharge -= threshold;
    prepareFlavorCombo(entity, def);
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
    if (quality.grade === "perfect" || state.combo > 0 && state.combo % 16 === 0) {
      state.shake = Math.max(state.shake, quality.grade === "perfect" ? 0.12 : 0.08);
    }
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
      state.shake = Math.max(state.shake, 0.18);
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
    const multiplier = Math.min(2.6, 1.55 + state.level * 0.025 + state.combo * 0.012 + state.customFlavors * 0.04);
    const duration = 4.6 + Math.min(2.2, state.level * 0.055);
    const bonus = Math.round((8 + state.level + Math.min(18, Math.floor(state.combo / 2))) * multiplier);
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
    triggerBrandBurst("自搭配爆發", {
      sub: `${label} x${multiplier.toFixed(1)}`,
      x,
      y: y - 98,
      color: COLORS.berry,
      style: "rush",
      power: 1.75,
      life: 1.45,
    });
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
      triggerBrandBurst("品牌熱度", {
        sub: `純粹亮點 x${state.brandHeat}`,
        x: player.x + 72,
        y: player.y - 150,
        color: COLORS.purple,
        style: "shine",
        power: 1.22,
      });
      floatText(`+${formatNumber(bonus)}`, player.x + 72, player.y - 122, COLORS.leaf);
      emitRingBurst(player.x + 58, player.y - 46, COLORS.purple, 3, 32);
      emitFeatureSpark(player.x + 58, player.y - 42, COLORS.purple, 18);
    } else if (text) {
      emitBadgeBurst(entity.x + entity.w / 2, entity.y - 92, COLORS.purple, "純");
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
    triggerBrandBurst(perfect ? "精品出貨" : "完成出貨", {
      sub: order.name,
      x: player.x + 86,
      y: player.y - 138,
      color: order.color,
      style: perfect ? "rush" : "shine",
      power: perfect ? 1.45 : 1.18,
    });
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

  function clearHazardsNearPlayer(range = 520, color = COLORS.aquaDeep) {
    let cleared = 0;
    for (const hazard of state.entities) {
      if (hazard.type !== "hazard" || hazard.done || hazard.remove) continue;
      const visible = hazard.y > getRoadMetrics().horizonY - 70 && hazard.y < player.y + 120;
      const close = player.y - hazard.y < range;
      if (!visible || !close) continue;
      hazard.done = true;
      hazard.remove = true;
      cleared += 1;
      emitPop(hazard.x + hazard.w / 2, hazard.y - 30, color, 10);
      emitRingBurst(hazard.x + hazard.w / 2, hazard.y - 36, color, 1, 22);
    }
    if (cleared > 0) {
      state.hazardTimer = Math.max(state.hazardTimer, 0.42);
      triggerJuice(color, Math.min(1.9, 0.9 + cleared * 0.22), { x: player.x, y: player.y - 62, style: "speed", hitStop: 0.08 });
      floatText(`清掉${cleared}個`, player.x + 58, player.y - 124, color);
    }
    return cleared;
  }

  function collectBonus(entity) {
    const bonus = entity.bonus;
    let text = "";
    let value = 4 + Math.min(5, Math.floor(state.combo / 12));
    noteActivePlay(1);
    if (bonus.key === "cleanBoost") {
      state.shield = Math.min(3, state.shield + 1);
      state.purity = clamp(state.purity + 6, 0, 100);
      value = 5;
      text = `純淨盾x${state.shield}`;
    } else if (bonus.key === "probioticBoost") {
      state.magnetTime = Math.max(state.magnetTime, 4.2);
      state.requiredTimer = Math.min(state.requiredTimer, 0.22);
      text = "益菌磁吸";
    } else if (bonus.key === "calciumBoost") {
      state.slowTime = Math.max(state.slowTime, 3.6);
      state.purity = clamp(state.purity + 3, 0, 100);
      text = "鈣力慢拍";
    } else if (bonus.key === "rushBoost") {
      state.fever = clamp(state.fever + 16, 0, 100);
      state.feverTime = Math.max(state.feverTime, 3.8);
      state.speedLineTime = Math.max(state.speedLineTime, 1.0);
      value = 7;
      text = "飛鞋加速";
    } else if (bonus.key === "comboBoost") {
      state.combo += 3;
      value = 6;
      text = "連擊+4";
    } else if (bonus.key === "timeBurst") {
      state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 2.2);
      value = 4;
      text = "秒數++";
    } else if (bonus.key === "roadSweep") {
      const cleared = clearHazardsNearPlayer(720, bonus.color);
      state.purity = clamp(state.purity + 3 + cleared, 0, 100);
      value = 5 + cleared * 2;
      text = cleared ? "道路清場" : "路線預清";
    } else if (bonus.key === "streetGuard") {
      state.shield = Math.min(4, state.shield + 2);
      player.invuln = Math.max(player.invuln, 3.2);
      state.purity = clamp(state.purity + 2, 0, 100);
      value = 7;
      text = `無敵x${state.shield}`;
    } else if (bonus.key === "yogurtMagnet") {
      state.magnetTime = Math.max(state.magnetTime, 5.8);
      state.requiredTimer = Math.min(state.requiredTimer, 0.08);
      spawnArcadePositive(player.lane);
      if (state.level >= 5) spawnArcadePositive(differentLane(player.lane));
      value = 6;
      text = "優格磁場";
    } else if (bonus.key === "pureWave") {
      const cleared = clearHazardsNearPlayer(420, bonus.color);
      state.purity = clamp(state.purity + 10 + cleared * 2, 0, 100);
      state.slowTime = Math.max(state.slowTime, 1.2);
      value = 6 + cleared;
      text = "純淨波";
    }
    if (state.flavorRushTime > 0) value = Math.round(value * state.flavorMultiplier);
    state.score += value;
    applyBonusWeightEffect(bonus.key, entity.x + entity.w / 2, entity.y - 96);
    if (state.phase === "over") return;
    state.fever = clamp(state.fever + 11, 0, 100);
    state.combo += 1;
    state.batchBonuses += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    bumpMission("bonuses");
    addFlavorChargeArcade(entity, bonus, 0);
    handleComboPrize();
    if (bonus.key === "rushBoost" || bonus.key === "yogurtMagnet" || bonus.key === "comboBoost") {
      spawnRewardWave(entity.lane, {
        count: bonus.key === "rushBoost" ? 2 : 1,
        bonusCount: 0,
        cooldown: 1.75,
        text: bonus.key === "yogurtMagnet" ? "磁吸好料" : "道具連發",
      });
    }
    if (state.fever >= 100 && state.feverTime <= 0 && state.combo >= 24 && state.totalYogurts >= 3) activateFever();
    emitPop(entity.x, entity.y - 20, bonus.color, 12);
    emitRingBurst(entity.x + entity.w / 2, entity.y - 34, bonus.color, 2, 28);
    emitLaneFlash(entity.lane, bonus.color);
    emitBonusImpact(bonus.key, entity, bonus.color);
    setPlayerReaction(bonus.key, bonus.color, 1.1);
    state.speedLineTime = Math.max(state.speedLineTime, bonus.key === "rushBoost" || bonus.key === "roadSweep" ? 1.25 : 0.82);
    state.comboSurge = Math.max(state.comboSurge, 0.9);
    state.zoomKick = Math.max(state.zoomKick, 0.62);
    emitScreenSparks(entity.x + entity.w / 2, entity.y - 46, bonus.color, bonus.key === "comboBoost" || bonus.key === "rushBoost" ? 18 : 10);
    triggerJuice(bonus.color, bonus.key === "rushBoost" || bonus.key === "roadSweep" ? 1.65 : 1.38, { x: entity.x + entity.w / 2, y: entity.y - 46, style: "magnet", hitStop: 0.095 });
    triggerBrandBurst(text || bonus.label, {
      sub: bonus.feature || "純粹補給",
      x: entity.x + entity.w / 2,
      y: entity.y - 126,
      color: bonus.color,
      style: bonus.key === "rushBoost" || bonus.key === "roadSweep" ? "rush" : bonus.key === "cleanBoost" || bonus.key === "streetGuard" ? "shield" : "shine",
      power: bonus.key === "rushBoost" || bonus.key === "roadSweep" || bonus.key === "pureWave" ? 1.35 : 1.08,
    });
    floatText(`+${value}`, entity.x, entity.y - 88, COLORS.leaf);
    beep(700, 0.04, "triangle", 0.03);
  }

  function handleComboPrize() {
    const milestone = Math.floor(state.combo / 8) * 8;
    if (milestone < 8 || milestone === state.lastComboPrize) return;
    state.lastComboPrize = milestone;
    const prize = Math.min(40, 6 + Math.floor(milestone / 10) * 3 + state.level);
    state.score += prize;
    state.timeRemaining = Math.min(getDifficulty().timeCap, state.timeRemaining + 0.65);
    state.fever = clamp(state.fever + 10, 0, 100);
    if (milestone % 24 === 0) state.shield = Math.min(3, state.shield + 1);
    floatText(`+${prize}`, player.x + 62, player.y - 112, COLORS.leaf);
    emitPop(player.x + 56, player.y - 42, COLORS.yellow, 24);
    emitRingBurst(player.x + 56, player.y - 48, COLORS.yellow, 3, 34);
    emitLaneFlash(player.lane, COLORS.yellow);
    triggerJuice(COLORS.yellow, milestone % 20 === 0 ? 1.75 : 1.35, { x: player.x + 56, y: player.y - 48, style: "confetti", hitStop: 0.1 });
    triggerBrandBurst(`${milestone}連吃`, {
      sub: "純粹節奏達成",
      x: player.x + 66,
      y: player.y - 146,
      color: COLORS.yellow,
      style: milestone % 16 === 0 ? "rush" : "shine",
      power: milestone % 32 === 0 ? 1.45 : milestone % 16 === 0 ? 1.22 : 1.05,
    });
    beep(880 + Math.min(420, milestone * 4), 0.07, "square", 0.035);
  }

  function registerMistake(reason, entity = null) {
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
    state.shake = 0.52;
    player.invuln = 0.7;
    if (entity) {
      gainHazardWeight(entity);
      if (state.phase === "over") return;
    }
    showToast(reason);
    floatText("純淨-", player.x + 22, player.y - 86, COLORS.berry);
    emitPop(player.x + 20, player.y - 30, COLORS.berry, 16);
    triggerJuice(COLORS.berry, 0.85, { x: player.x + 20, y: player.y - 40, style: "hazard", hitStop: 0.09 });
    beep(150, 0.08, "sawtooth", 0.035);
    if (state.purity <= 0) {
      state.gameOverKind = "purity";
      endGame("純淨率歸零");
    }
  }

  function activateFever() {
    state.feverTime = 7.2;
    state.fever = 100;
    state.shake = 0.42;
    state.batchPureRushes += 1;
    bumpMission("pureRushes");
    showToast("純淨能量滿格：PURE RUSH！");
    triggerBrandBurst("PURE RUSH", {
      sub: "純淨能量滿格",
      x: player.x + 54,
      y: player.y - 144,
      color: COLORS.orange,
      style: "rush",
      power: 1.58,
      life: 1.35,
    });
    emitRingBurst(player.x + 40, player.y - 46, COLORS.orange, 4, 38);
    emitLaneFlash(player.lane, COLORS.orange);
    triggerJuice(COLORS.orange, 2.25, { x: player.x + 42, y: player.y - 54, style: "speed", hitStop: 0.16 });
    beep(940, 0.12, "square", 0.04);
  }

  function triggerAction() {
    if (state.phase !== "playing" || state.paused) return;
    ensureAudio();
    controls.action = true;
    player.actionTimer = 0.22;
    state.shake = Math.max(state.shake, 0.06);
    window.setTimeout(() => {
      controls.action = false;
    }, 90);
  }

  function runDodge(direction) {
    if (state.phase !== "playing" || state.paused) return;
    if (direction === "left") {
      changeLane(-1);
    } else if (direction === "right") {
      changeLane(1);
    }
  }

  function triggerJump() {
    if (state.phase !== "playing" || state.paused) return;
    player.jumpTimer = Math.max(player.jumpTimer, JUMP_DODGE_SECONDS);
    player.jumpDodgeBuffer = Math.max(player.jumpDodgeBuffer, 1.55);
    player.slideTimer = 0;
    noteActivePlay(0.65);
    state.speedLineTime = Math.max(state.speedLineTime, 0.12);
    beep(620, 0.035, "triangle", 0.022);
  }

  function triggerSlide() {
    if (state.phase !== "playing" || state.paused) return;
    player.slideTimer = Math.max(player.slideTimer, SLIDE_DODGE_SECONDS);
    player.slideDodgeBuffer = Math.max(player.slideDodgeBuffer, 1.45);
    player.jumpTimer = 0;
    noteActivePlay(0.65);
    state.speedLineTime = Math.max(state.speedLineTime, 0.1);
    beep(360, 0.035, "square", 0.02);
  }

  function processLaneControls(dt) {
    const dir = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    if (dir === 0) {
      player.laneRepeat = 0;
      return;
    }
    player.laneRepeat -= dt;
    if (player.laneRepeat <= 0) {
      changeLane(dir);
      player.laneRepeat = 0.2;
    }
  }

  function changeLane(delta) {
    if (state.phase !== "playing" || state.paused) return;
    setLane(player.lane + delta);
  }

  function setLane(lane) {
    if (state.phase !== "playing" || state.paused) return;
    const nextLane = normalizePlayableLane(lane);
    if (nextLane === player.lane) return;
    player.lane = nextLane;
    player.targetLane = player.lane;
    noteActivePlay(0.55);
    state.batchLaneChanges += 1;
    bumpMission("laneChanges");
    state.decoyTimer = Math.min(state.decoyTimer, 0.68);
    beep(440 + player.lane * 80, 0.025, "square", 0.018);
  }

  function handleKeyDown(event) {
    if (document.activeElement === dom.nameInput) {
      if (event.key === "Enter") startGame();
      return;
    }
    const key = event.key.toLowerCase();
    if ((key === "p" || key === "escape") && !event.repeat) {
      event.preventDefault();
      togglePause();
      return;
    }
    if (state.paused) return;
    if (key === "arrowleft" || key === "a") {
      event.preventDefault();
      controls.left = true;
      if (!event.repeat) {
        changeLane(-1);
        player.laneRepeat = 0.18;
      }
    }
    if (key === "arrowright" || key === "d") {
      event.preventDefault();
      controls.right = true;
      if (!event.repeat) {
        changeLane(1);
        player.laneRepeat = 0.18;
      }
    }
    if (key === "arrowup" || key === "w") {
      event.preventDefault();
      controls.up = true;
      if (!event.repeat) setLane(1);
    }
    if (key === "arrowdown" || key === "s") {
      event.preventDefault();
      controls.down = true;
      if (!event.repeat) setLane(1);
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
    const shakeX = state.shake ? random(-state.shake * 5.2, state.shake * 5.2) : 0;
    const shakeY = state.shake ? random(-state.shake * 3.4, state.shake * 3.4) : 0;
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
    for (const burst of state.brandBursts) drawBrandBurst(burst);
    for (const text of state.floats) drawFloat(text);
    if (state.feverTime > 0) drawFeverOverlay();
    if (state.flavorCountdown > 0 || state.flavorRushTime > 0) drawFlavorRushOverlay();
    ctx.restore();
    drawDangerAlertOverlay();
    drawPauseOverlay();
    drawScreenFlash();
  }

  function drawDangerAlertOverlay() {
    if (state.phase !== "playing" || state.paused) return;
    const weightRisk = state.weightKg >= WEIGHT_ALERT_KG;
    const purityRisk = state.purity <= PURITY_ALERT_PERCENT;
    if (!weightRisk && !purityRisk) return;

    const w = state.width;
    const h = state.height;
    const critical = state.weightKg >= 69 || state.purity <= 8;
    const pulse = 0.5 + Math.sin(state.time * (critical ? 15 : 9)) * 0.5;
    const color = critical ? "#d8243c" : COLORS.orange;
    const title = weightRisk && purityRisk
      ? "雙重警戒"
      : weightRisk
        ? "70kg 快到了"
        : "純淨率快歸零";
    const subtitle = weightRisk && purityRisk
      ? "紅色先躲開，立刻改吃官方純粹優格"
      : weightRisk
        ? "換吃純粹好食優格，別再碰紅色添加物"
        : "連吃好料補純淨，紅色危險物全躲";
    const stat = weightRisk && purityRisk
      ? `${state.weightKg.toFixed(1)}kg / 純淨 ${Math.round(state.purity)}%`
      : weightRisk
        ? `剩 ${(WEIGHT_LIMIT_KG - state.weightKg).toFixed(1)}kg 就失敗`
        : `純淨只剩 ${Math.round(state.purity)}%`;
    const cardW = Math.min(w - 28, isMobileLayout() ? 344 : 520);
    const cardH = isMobileLayout() ? 82 : 92;
    const x = (w - cardW) / 2;
    const y = isMobileLayout() ? 168 : Math.max(150, h * 0.23);

    ctx.save();
    const edge = 8 + pulse * 6;
    fillRect(0, 0, w, edge, `rgba(216,36,60,${0.22 + pulse * 0.22})`);
    fillRect(0, h - edge, w, edge, `rgba(216,36,60,${0.22 + pulse * 0.22})`);
    fillRect(0, 0, edge, h, `rgba(216,36,60,${0.18 + pulse * 0.18})`);
    fillRect(w - edge, 0, edge, h, `rgba(216,36,60,${0.18 + pulse * 0.18})`);
    fillRect(x + 7, y + 7, cardW, cardH, "rgba(36,50,58,.22)");
    fillRect(x, y, cardW, cardH, critical ? "rgba(255,235,238,.96)" : "rgba(255,244,220,.96)");
    strokeRect(x, y, cardW, cardH, color, 4);
    fillRect(x + 14, y + 16, 26, 26, color);
    fillRect(x + 23, y + 22, 8, 25, "#ffffff");
    fillRect(x + 23, y + 52, 8, 8, "#ffffff");
    drawText(title, x + 54, y + 27, isMobileLayout() ? 22 : 28, color, "left");
    drawText(stat, x + cardW - 18, y + 27, isMobileLayout() ? 14 : 18, COLORS.ink, "right");
    drawText(subtitle, x + 54, y + 60, isMobileLayout() ? 13 : 16, COLORS.ink, "left");
    ctx.globalAlpha = 0.25 + pulse * 0.25;
    for (let i = 0; i < 6; i += 1) {
      const xx = x + 16 + i * (cardW - 32) / 5;
      fillRect(xx, y - 12, 16, 6, color);
      fillRect(xx + 8, y + cardH + 8, 16, 6, color);
    }
    ctx.restore();
  }

  function drawPauseOverlay() {
    if (!state.paused || state.phase !== "playing") return;
    if (dom.pauseOverlay) return;
    const w = state.width;
    const h = state.height;
    const compact = isMobileLayout() || w < 620;
    const landmark = state.pauseLandmark || pickPauseLandmark();
    state.pauseLandmark = landmark;
    ctx.save();
    fillRect(0, 0, w, h, "rgba(36,50,58,.28)");
    const cardW = Math.min(compact ? w - 28 : 690, w - 36);
    const cardH = Math.min(compact ? 462 : 392, h - 58);
    const x = (w - cardW) / 2;
    const preferredY = compact ? Math.max(256, h * 0.31) : Math.max(236, h * 0.26);
    const y = clamp(preferredY, 24, Math.max(24, h - cardH - 18));
    fillRect(x + 8, y + 8, cardW, cardH, "rgba(36,50,58,.18)");
    fillRect(x, y, cardW, cardH, "rgba(255,255,255,.94)");
    strokeRect(x, y, cardW, cardH, COLORS.ink, 4);
    const headerH = compact ? 86 : 92;
    fillRect(x + 16, y + 16, cardW - 32, headerH - 18, "rgba(223,246,255,.7)");
    strokeRect(x + 16, y + 16, cardW - 32, headerH - 18, COLORS.aquaDeep, 3);
    fillRect(x + 28, y + 31, 14, 44, COLORS.aquaDeep);
    fillRect(x + 50, y + 31, 14, 44, COLORS.aquaDeep);
    drawText("已暫停", x + (compact ? 102 : 112), y + 42, compact ? 25 : 30, COLORS.ink, "left");
    drawText("按 P 或點右上角繼續", x + (compact ? 102 : 112), y + 70, compact ? 13 : 15, COLORS.aquaDeep, "left");
    drawText("臺南地標小檔案", x + cardW - 26, y + 43, compact ? 16 : 20, landmark.accent || COLORS.aquaDeep, "right");
    drawText(landmark.name, x + cardW - 26, y + 70, compact ? 13 : 16, COLORS.ink, "right");
    drawPauseLandmarkFeature(landmark, x + 18, y + headerH + 14, cardW - 36, cardH - headerH - 30, compact);
    ctx.restore();
  }

  function pickPauseLandmark(previousModel = "") {
    const withPhotos = PAUSE_LANDMARKS.filter((landmark) => landmark.photo);
    const pool = withPhotos.length ? withPhotos : PAUSE_LANDMARKS;
    const weighted = [];
    for (const landmark of pool) {
      const weight = Math.max(1, landmark.weight || 1);
      for (let i = 0; i < weight; i += 1) weighted.push(landmark);
    }
    if (!weighted.length) return pool[0] || PAUSE_LANDMARKS[0];
    let picked = weighted[randomInt(0, weighted.length - 1)];
    if (previousModel && weighted.length > 1) {
      for (let i = 0; i < 5 && picked.model === previousModel; i += 1) {
        picked = weighted[randomInt(0, weighted.length - 1)];
      }
    }
    return picked;
  }

  function renderPauseDomOverlay() {
    if (!dom.pauseOverlay) return;
    const landmark = state.pauseLandmark || pickPauseLandmark();
    state.pauseLandmark = landmark;
    dom.pauseOverlay.classList.remove("hidden");
    if (dom.pauseLandmarkTitle) dom.pauseLandmarkTitle.textContent = landmark.name;
    if (dom.pauseOverview) dom.pauseOverview.textContent = landmark.overview || "遊戲中的臺南地標，讓路線更有城市感。";
    if (dom.pauseRealLook) dom.pauseRealLook.textContent = `真實樣貌：${landmark.realLook || "依地標外觀特徵整理成遊戲示意。"}`;
    if (dom.pauseGameCaption) {
      dom.pauseGameCaption.textContent = "";
      dom.pauseGameCaption.hidden = true;
    }
    if (dom.pauseRealCaption) dom.pauseRealCaption.textContent = (landmark.realTags || []).slice(0, 3).join("、") || "依線上資料整理真實外觀特徵。";
    if (dom.pauseSourceLink) {
      dom.pauseSourceLink.textContent = `資料來源：${landmark.sourceLabel || "線上景點資料"}`;
      dom.pauseSourceLink.href = landmark.sourceUrl || "https://www.twtainan.net/zh-tw/attractions";
    }
    const gameSnapshot = createPauseGameLandmarkSnapshot(landmark);
    renderPauseVisual(dom.pauseGameVisual, landmark, false, gameSnapshot);
    renderPauseVisual(dom.pauseRealVisual, landmark, true);
  }

  function hidePauseDomOverlay() {
    dom.pauseOverlay?.classList.add("hidden");
  }

  function renderPauseVisual(target, landmark, real, gameSnapshot = "") {
    if (!target) return;
    const kind = landmark.kind || "building";
    target.className = `pause-visual ${real ? "is-real" : "is-game"} kind-${kind}`;
    target.style.setProperty("--landmark-color", landmark.color || "#f7fdff");
    target.style.setProperty("--landmark-accent", landmark.accent || COLORS.aquaDeep);
    const tags = (real ? landmark.realTags : [landmark.modelLabel || "遊戲建模", landmark.kind || "地標", "路邊展示"]).slice(0, 3);
    if (real && landmark.photo) {
      target.innerHTML = `
        <img class="pause-real-photo" src="${escapeHtml(landmark.photo)}" alt="${escapeHtml(landmark.name)}真實照片" />
        <div class="pause-real-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      `;
      return;
    }
    if (!real && gameSnapshot) {
      target.innerHTML = `<img class="pause-game-shot" src="${escapeHtml(gameSnapshot)}" alt="${escapeHtml(landmark.name)}遊戲路邊模型" />`;
      return;
    }
    target.innerHTML = `
      <div class="pause-real-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="pause-building" data-label="${escapeHtml(real ? "真實特徵" : landmark.name)}"></div>
    `;
  }

  function createPauseGameLandmarkSnapshot(landmark) {
    if (!canvas || !ctx) return "";
    const previewW = 700;
    const previewH = 300;
    const pixelScale = Math.min(window.devicePixelRatio || state.dpr || 1, 2);
    const snapshot = document.createElement("canvas");
    snapshot.width = Math.max(1, Math.round(previewW * pixelScale));
    snapshot.height = Math.max(1, Math.round(previewH * pixelScale));
    const snapshotCtx = snapshot.getContext("2d");
    if (!snapshotCtx) return "";
    const previousCtx = ctx;
    const previousState = {
      width: state.width,
      height: state.height,
      viewportWidth: state.viewportWidth,
      viewportHeight: state.viewportHeight,
      sceneScale: state.sceneScale,
      dpr: state.dpr,
      routeForkTimer: state.routeForkTimer,
      routeForkCueTimer: state.routeForkCueTimer,
      routeForkCount: state.routeForkCount,
    };
    try {
      ctx = snapshotCtx;
      state.width = previewW;
      state.height = previewH;
      state.viewportWidth = previewW;
      state.viewportHeight = previewH;
      state.sceneScale = 1;
      state.dpr = pixelScale;
      state.routeForkTimer = 0;
      state.routeForkCueTimer = 0;
      state.routeForkCount = 0;
      ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
      ctx.imageSmoothingEnabled = false;
      drawPauseGameLandmarkScene(landmark, previewW, previewH, state.time || 0);
      return snapshot.toDataURL("image/png");
    } catch {
      return "";
    } finally {
      ctx = previousCtx;
      Object.assign(state, previousState);
      ctx.setTransform(state.dpr * state.sceneScale, 0, 0, state.dpr * state.sceneScale, 0, 0);
      ctx.imageSmoothingEnabled = false;
    }
  }

  function drawPauseGameLandmarkScene(landmark, w, h, t) {
    const mood = getWorldMood(t);
    const weather = getWeatherVisual();
    fillRect(0, 0, w, h, mood.skyBase);
    fillRect(0, 0, w, h * 0.42, mood.skyTop);
    drawDayNightSky(w, h, mood, t);
    drawWeatherSky(w, h, mood, weather, t);

    ctx.save();
    ctx.globalAlpha = (1 - mood.night * 0.5) * (1 - getWeatherCloudAmount(weather) * 0.26);
    for (let i = 0; i < 5; i += 1) {
      const x = ((i * 220 - t * 14) % (w + 260)) - 150;
      drawCloud(x, 54 + (i % 3) * 36 + Math.sin(t * 0.25 + i) * 4);
    }
    ctx.restore();

    const road = getRoadMetrics();
    fillRect(0, road.horizonY - 42, w, h - road.horizonY + 42, mood.ground);
    fillRect(0, road.horizonY - 42, w, 18, mood.seasonWash);
    fillRect(0, road.horizonY - 38, w, 8, `rgba(38,138,161,${0.16 + mood.night * 0.12})`);
    drawSeasonDetails(w, h, road, mood, t);
    drawCuteBrandDecals(w, road.horizonY - 90, t);
    drawPseudoRoad(w, h, t);
    drawRoadsideGreenBelts(road, 0.18, {});
    drawMoodOverlay(w, h, mood);
    drawWeatherEffects(w, h, mood, weather, t);
    drawConveyor(w, h, t);
    drawPauseSnapshotRoadsideLandmark(landmark, road, w, h);
  }

  function drawPauseSnapshotRoadsideLandmark(landmark, road, w, h) {
    const modelKey = landmark.model || landmark.kind || landmark.name || "";
    const side = modelKey.length % 2 === 0 ? -1 : 1;
    const modelSize = getRoadsideModelSize(landmark);
    const scenicModels = new Set(["sicaoTunnel", "anpingTreeHouse", "yuguangIsland", "jingzaijiaoSaltFields", "hutoupi", "bigFish", "beimenCrystalChurch"]);
    const maxW = w * (scenicModels.has(modelKey) ? 0.42 : 0.36);
    const maxH = h * (landmark.kind === "street" || landmark.kind === "market" ? 0.48 : 0.64);
    const scale = Math.min(maxW / Math.max(1, modelSize.w), maxH / Math.max(1, modelSize.h), scenicModels.has(modelKey) ? 1.78 : 1.42);
    const modelW = modelSize.w * scale;
    const groundY = h - 48;
    let x = side < 0 ? 30 : w - modelW - 30;
    x = clamp(x, 24, Math.max(24, w - modelW - 24));
    const roadEdge = side < 0 ? x + modelW + 4 * scale : x - 4 * scale;

    ctx.save();
    ctx.globalAlpha *= 0.98;
    drawQuad(
      x - 12 * scale,
      groundY + 8 * scale,
      x + modelW + 12 * scale,
      groundY + 8 * scale,
      x + modelW + side * 30 * scale,
      groundY + 26 * scale,
      x + side * 30 * scale,
      groundY + 26 * scale,
      "rgba(36,50,58,.16)"
    );
    if (!drawPauseSnapshotSpecialLandmark(landmark, x, groundY, scale, side, roadEdge)) {
      drawRoadsideModel(landmark, x, groundY, scale, side, 17, roadEdge);
    }
    drawPauseSnapshotFocusBadge(landmark, x, groundY, modelW, scale);
    ctx.restore();
  }

  function drawPauseSnapshotSpecialLandmark(landmark, x, groundY, scale, side, roadEdge) {
    void roadEdge;
    const model = landmark.model || landmark.kind;
    const accent = landmark.accent || COLORS.aquaDeep;
    const size = getRoadsideModelSize(landmark);
    const w = size.w * scale;

    if (model === "sicaoTunnel" || model === "anpingTreeHouse") {
      const water = model === "sicaoTunnel";
      drawQuad(x + 4 * scale, groundY - 34 * scale, x + w - 4 * scale, groundY - 34 * scale, x + w + side * 18 * scale, groundY + 6 * scale, x + side * 18 * scale, groundY + 6 * scale, water ? "#8fcfe0" : "#d8c1a2");
      if (water) {
        for (let i = 0; i < 5; i += 1) {
          const wx = x + (20 + i * 31) * scale;
          fillRect(wx, groundY - 22 * scale + (i % 2) * 4 * scale, 24 * scale, 4 * scale, "rgba(255,255,255,.52)");
        }
      } else {
        fillRect(x + 42 * scale, groundY - 70 * scale, w - 84 * scale, 46 * scale, "#d8c1a2");
        drawBrickPattern(x + 42 * scale, groundY - 70 * scale, w - 84 * scale, 46 * scale, "#8f5f42");
      }
      for (let i = 0; i < 7; i += 1) {
        const ratio = i / 6;
        const tx = x + (16 + ratio * (size.w - 32)) * scale;
        const crownY = groundY - (86 + Math.sin(ratio * Math.PI) * 36) * scale;
        const treeScale = scale * (0.86 + Math.sin(ratio * Math.PI) * 0.24);
        fillRect(tx - 5 * treeScale, crownY + 24 * treeScale, 10 * treeScale, groundY - crownY - 18 * treeScale, "#5f7a45");
        drawCircle(tx - 12 * treeScale, crownY, 22 * treeScale, "#4a9f72");
        drawCircle(tx + 9 * treeScale, crownY - 9 * treeScale, 24 * treeScale, "#76b96c");
        drawCircle(tx + side * 5 * treeScale, crownY + 12 * treeScale, 18 * treeScale, "#8ac277");
      }
      strokePerspectiveLine(x + 34 * scale, groundY - 95 * scale, x + w - 34 * scale, groundY - 98 * scale, "rgba(101,168,95,.72)", Math.max(2, 4 * scale));
      drawRoadsideSign(landmark, x + w * 0.14, groundY - 116 * scale, w * 0.72, scale * 0.72);
      return true;
    }

    if (model === "yuguangIsland") {
      drawQuad(x + 4 * scale, groundY - 44 * scale, x + w - 4 * scale, groundY - 44 * scale, x + w + side * 14 * scale, groundY - 8 * scale, x + side * 14 * scale, groundY - 8 * scale, "#8fcfe0");
      drawQuad(x + 10 * scale, groundY - 24 * scale, x + w - 6 * scale, groundY - 24 * scale, x + w + side * 20 * scale, groundY + 4 * scale, x + side * 20 * scale, groundY + 4 * scale, "#f2d4a8");
      for (let i = 0; i < 4; i += 1) fillRect(x + (18 + i * 36) * scale, groundY - (38 + (i % 2) * 5) * scale, 24 * scale, 5 * scale, "#dff6ff");
      drawCircle(x + 36 * scale, groundY - 76 * scale, 19 * scale, "#f4d16f");
      fillRect(x + w * 0.66, groundY - 99 * scale, 17 * scale, 58 * scale, "#f7fdff");
      fillRect(x + w * 0.66 - 6 * scale, groundY - 107 * scale, 29 * scale, 9 * scale, "#d8484f");
      fillRect(x + w * 0.66 + 2 * scale, groundY - 77 * scale, 14 * scale, 9 * scale, "#d8484f");
      drawCircle(x + w * 0.82, groundY - 33 * scale, 17 * scale, "#7aa15f");
      drawCircle(x + w * 0.91, groundY - 39 * scale, 15 * scale, "#7aa15f");
      drawRoadsideSign(landmark, x + w * 0.12, groundY - 106 * scale, w * 0.5, scale * 0.72);
      return true;
    }

    return false;
  }

  function drawPauseSnapshotFocusBadge(landmark, x, groundY, modelW, scale) {
    const badgeW = Math.min(modelW * 0.72, Math.max(92 * scale, landmark.name.length * 12 * scale));
    const badgeH = 24 * scale;
    const badgeX = x + modelW / 2 - badgeW / 2;
    const badgeY = groundY + 9 * scale;
    fillRect(badgeX + 3 * scale, badgeY + 3 * scale, badgeW, badgeH, "rgba(36,50,58,.14)");
    fillRect(badgeX, badgeY, badgeW, badgeH, "rgba(255,255,255,.94)");
    strokeRect(badgeX, badgeY, badgeW, badgeH, landmark.accent || COLORS.aquaDeep, Math.max(1, 2 * scale));
    drawText(landmark.name, badgeX + badgeW / 2, badgeY + badgeH * 0.66, Math.max(9, 13 * scale), landmark.accent || COLORS.aquaDeep, "center");
  }

  function drawPauseLandmarkFeature(landmark, x, y, w, h, compact) {
    const gap = compact ? 8 : 12;
    const previewH = Math.min(compact ? 148 : 168, h * (compact ? 0.42 : 0.5));
    const panelW = (w - gap) / 2;
    drawPausePreviewPanel("遊戲樣貌", x, y, panelW, previewH, landmark.accent || COLORS.aquaDeep, () => {
      drawPauseGameLandmark(landmark, x + 8, y + 28, panelW - 16, previewH - 36);
    });
    drawPausePreviewPanel("真實樣貌", x + panelW + gap, y, panelW, previewH, landmark.accent || COLORS.aquaDeep, () => {
      drawPauseRealLandmark(landmark, x + panelW + gap + 8, y + 28, panelW - 16, previewH - 36);
    });

    const textY = y + previewH + (compact ? 22 : 26);
    drawText(landmark.name, x + 4, textY, compact ? 22 : 26, landmark.accent || COLORS.aquaDeep, "left");
    const detailX = x + 4;
    const detailW = w - 8;
    let nextY = drawWrappedText(landmark.overview, detailX, textY + (compact ? 25 : 30), detailW, compact ? 16 : 18, compact ? 12 : 14, COLORS.ink, compact ? 2 : 2);
    nextY += compact ? 8 : 10;
    fillRect(x + 2, nextY - 5, w - 4, 2, "rgba(38,138,161,.18)");
    drawText("真實特色", x + 4, nextY + 17, compact ? 13 : 15, COLORS.berry, "left");
    drawWrappedText(landmark.realLook, detailX + (compact ? 70 : 82), nextY + 17, detailW - (compact ? 76 : 90), compact ? 16 : 18, compact ? 12 : 14, "#60717b", compact ? 2 : 2);
  }

  function drawPausePreviewPanel(label, x, y, w, h, color, drawer) {
    fillRect(x + 4, y + 5, w, h, "rgba(36,50,58,.12)");
    fillRect(x, y, w, h, "rgba(255,255,255,.88)");
    strokeRect(x, y, w, h, COLORS.ink, 3);
    fillRect(x, y, w, 24, color);
    drawText(label, x + w / 2, y + 13, 13, "#ffffff", "center");
    ctx.save();
    ctx.beginPath();
    ctx.rect(x + 6, y + 27, w - 12, h - 33);
    ctx.clip();
    drawer();
    ctx.restore();
  }

  function drawPauseGameLandmark(landmark, x, y, w, h) {
    const size = getRoadsideModelSize(landmark);
    const scale = Math.min(w / Math.max(90, size.w * 1.16), h / Math.max(88, size.h * 1.08), 0.88);
    fillRect(x, y, w, h, "#e7f7fa");
    fillRect(x, y + h * 0.62, w, h * 0.38, "#fff4dc");
    drawQuad(x + w * 0.12, y + h, x + w * 0.34, y + h * 0.34, x + w * 0.72, y + h * 0.34, x + w * 0.92, y + h, "rgba(126,195,222,.54)");
    strokePerspectiveLine(x + w * 0.34, y + h * 0.34, x + w * 0.12, y + h, COLORS.aquaDeep, 2);
    strokePerspectiveLine(x + w * 0.72, y + h * 0.34, x + w * 0.92, y + h, COLORS.aquaDeep, 2);
    const modelW = size.w * scale;
    const groundY = y + h - 12;
    const modelX = x + w * 0.5 - modelW * 0.5;
    drawRoadsideModel(landmark, modelX, groundY, scale, 1, 7, x + w * 0.32);
  }

  function drawPauseRealLandmark(landmark, x, y, w, h) {
    fillRect(x, y, w, h, "#eff9fb");
    fillRect(x, y + h * 0.62, w, h * 0.38, "#efe0c9");
    const model = landmark.model || landmark.kind;
    const accent = landmark.accent || COLORS.aquaDeep;
    const cx = x + w / 2;
    const ground = y + h - 12;
    const bw = w * 0.66;
    const bh = h * 0.54;
    const bx = cx - bw / 2;
    const by = ground - bh;
    if (model === "ugoodaysStore") {
      fillRect(bx - 12, by - 14, bw + 24, bh + 14, "#f7fdff");
      strokeRect(bx - 12, by - 14, bw + 24, bh + 14, COLORS.ink, 2);
      fillRect(bx - 8, by - 10, bw + 16, 26, "#ffffff");
      for (let i = 0; i < 14; i += 1) fillRect(bx - 4 + i * ((bw + 8) / 14), by - 10, 2, 26, "rgba(36,50,58,.12)");
      drawBrandLogo(bx + 2, by - 8, Math.min(86, bw * 0.58), 36, COLORS.aquaDeep);
      fillRect(bx - 8, by + 20, bw + 16, 18, COLORS.aqua);
      fillRect(bx + 4, by + 45, bw * 0.42, bh - 48, "#dceffc");
      fillRect(bx + bw * 0.54, by + 45, bw * 0.34, bh - 48, "#e3d4c4");
      fillRect(bx + bw * 0.57, by + 52, bw * 0.28, 9, "#b44966");
      strokeRect(bx + 4, by + 45, bw * 0.42, bh - 48, COLORS.ink, 2);
      strokeRect(bx + bw * 0.54, by + 45, bw * 0.34, bh - 48, COLORS.ink, 2);
    } else if (landmark.kind === "station") {
      fillRect(bx, by + 20, bw, bh - 20, "#f4e2c4");
      drawTriangle(bx + bw * 0.33, by + 20, cx, by - 10, bx + bw * 0.67, by + 20, "#8cb8c7");
      fillRect(cx - 15, by + 22, 30, 30, "#f7fdff");
      strokeCircle(cx, by + 37, 10, accent, 2);
      for (let i = 0; i < 3; i += 1) strokeRect(bx + 12 + i * bw * 0.3, by + 60, 22, 28, "#6f9fb0", 2);
      strokeRect(bx, by + 20, bw, bh - 20, COLORS.ink, 2);
    } else if (landmark.kind === "mall") {
      fillRect(bx - 8, by + 12, bw + 16, bh - 12, "#dff2f6");
      for (let i = 0; i < 4; i += 1) fillRect(bx + 5 + i * bw * 0.23, by + 24, bw * 0.16, bh - 38, i % 2 ? "#ffffff" : "#bce3ed");
      fillRect(bx + bw * 0.42, by + 4, bw * 0.46, 24, "#ffffff");
      drawText("南紡", bx + bw * 0.65, by + 18, 15, accent, "center");
      strokeRect(bx - 8, by + 12, bw + 16, bh - 12, COLORS.ink, 2);
    } else if (landmark.kind === "fort") {
      fillRect(bx, by + 36, bw, bh - 36, "#c57563");
      for (let i = 0; i < 6; i += 1) fillRect(bx + i * bw / 6 + 3, by + 45, bw / 8, 10, "#d99b72");
      fillRect(bx + bw * 0.14, by + 8, bw * 0.28, 34, "#b44966");
      fillRect(bx + bw * 0.58, by + 16, bw * 0.24, 26, "#934b42");
      strokeRect(bx, by + 36, bw, bh - 36, COLORS.ink, 2);
    } else if (landmark.kind === "temple") {
      drawQuad(bx - 8, by + 22, bx + bw * 0.2, by - 4, bx + bw * 0.8, by - 4, bx + bw + 8, by + 22, "#b44966");
      drawQuad(bx, by + 36, bx + bw * 0.14, by + 18, bx + bw * 0.86, by + 18, bx + bw, by + 36, "#d8243c");
      fillRect(bx + 10, by + 38, bw - 20, bh - 38, "#f3d0b8");
      for (let i = 0; i < 4; i += 1) fillRect(bx + 22 + i * bw * 0.2, by + 52, 8, bh - 52, "#8f3550");
      strokeRect(bx + 10, by + 38, bw - 20, bh - 38, COLORS.ink, 2);
    } else if (landmark.kind === "fish") {
      drawCircle(cx, by + bh * 0.52, Math.min(w, h) * 0.22, "#dff6ff");
      strokeCircle(cx, by + bh * 0.52, Math.min(w, h) * 0.22, accent, 3);
      drawTriangle(cx - bw * 0.34, by + bh * 0.5, cx - bw * 0.52, by + bh * 0.36, cx - bw * 0.5, by + bh * 0.68, accent);
      for (let i = 0; i < 6; i += 1) drawCircle(cx - 24 + i * 10, by + bh * 0.47 + (i % 2) * 9, 4, i % 2 ? COLORS.leaf : COLORS.aquaDeep);
    } else if (landmark.kind === "museum") {
      fillRect(bx, by + 30, bw, bh - 30, "#eef5f8");
      drawQuad(bx - 10, by + 30, bx + bw * 0.16, by + 6, bx + bw * 0.84, by + 6, bx + bw + 10, by + 30, "#ffffff");
      for (let i = 0; i < 5; i += 1) fillRect(bx + 18 + i * bw * 0.16, by + 48, 8, bh - 52, "#c8dce3");
      strokeRect(bx, by + 30, bw, bh - 30, COLORS.ink, 2);
    } else if (landmark.kind === "treehouse" || landmark.kind === "tunnel") {
      fillRect(bx + 10, by + 46, bw - 20, bh - 46, "#d8c1a2");
      strokeRect(bx + 10, by + 46, bw - 20, bh - 46, COLORS.ink, 2);
      for (let i = 0; i < 6; i += 1) {
        const tx = bx + 12 + i * bw * 0.15;
        fillRect(tx, by + 16 + (i % 2) * 9, 8, bh - 18, "#7a5e44");
        drawCircle(tx + 4, by + 18, 22, i % 2 ? "#65a85f" : "#4a9f72");
      }
    } else if (landmark.kind === "market" || landmark.kind === "street") {
      for (let i = 0; i < 3; i += 1) {
        const sx = bx + i * bw * 0.32;
        fillRect(sx, by + 36 + i * 4, bw * 0.3, bh - 36 - i * 4, i % 2 ? "#ffe5c7" : "#fff4dc");
        drawQuad(sx - 4, by + 36 + i * 4, sx + bw * 0.15, by + 18 + i * 2, sx + bw * 0.32, by + 36 + i * 4, sx + bw * 0.28, by + 44 + i * 4, i % 2 ? COLORS.orange : COLORS.berry);
        strokeRect(sx, by + 36 + i * 4, bw * 0.3, bh - 36 - i * 4, COLORS.ink, 2);
      }
    } else {
      fillRect(bx, by + 20, bw, bh - 20, landmark.color || "#ffffff");
      drawQuad(bx - 8, by + 20, bx + bw * 0.22, by, bx + bw * 0.78, by, bx + bw + 8, by + 20, accent);
      for (let i = 0; i < 4; i += 1) strokeRect(bx + 14 + i * bw * 0.2, by + 45, 18, 24, accent, 2);
      strokeRect(bx, by + 20, bw, bh - 20, COLORS.ink, 2);
    }
    fillRect(x + 10, ground + 2, w - 20, 4, "rgba(36,50,58,.18)");
  }

  function drawWrappedText(text, x, y, maxWidth, lineHeight, size, color, maxLines = 3) {
    ctx.save();
    ctx.font = `900 ${size}px "Microsoft JhengHei", "Noto Sans TC", sans-serif`;
    const chars = String(text || "").split("");
    const lines = [];
    let line = "";
    for (const char of chars) {
      const next = line + char;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = next;
      }
      if (lines.length >= maxLines) break;
    }
    if (line && lines.length < maxLines) lines.push(line);
    ctx.restore();
    lines.forEach((lineText, index) => drawText(lineText, x, y + index * lineHeight, size, color, "left"));
    return y + Math.max(0, lines.length - 1) * lineHeight;
  }

  function drawBackground() {
    const w = state.width;
    const h = state.height;
    const t = state.time;
    const mood = getWorldMood(t);
    const weather = getWeatherVisual();
    fillRect(0, 0, w, h, mood.skyBase);
    fillRect(0, 0, w, h * 0.42, mood.skyTop);
    drawDayNightSky(w, h, mood, t);
    drawWeatherSky(w, h, mood, weather, t);

    ctx.save();
    ctx.globalAlpha = (1 - mood.night * 0.5) * (1 - getWeatherCloudAmount(weather) * 0.26);
    for (let i = 0; i < 7; i += 1) {
      const x = ((i * 260 - t * 14) % (w + 300)) - 180;
      drawCloud(x, 72 + (i % 3) * 42 + Math.sin(t * 0.25 + i) * 5);
    }
    ctx.restore();

    const road = getRoadMetrics();
    fillRect(0, road.horizonY - 42, w, h - road.horizonY + 42, mood.ground);
    fillRect(0, road.horizonY - 42, w, 18, mood.seasonWash);
    fillRect(0, road.horizonY - 38, w, 8, `rgba(38,138,161,${0.16 + mood.night * 0.12})`);
    drawPixelSign(w * 0.5 - ((t * 22) % 460), road.horizonY - 36, "純粹優格多一點", COLORS.aquaDeep, 156);
    drawPixelSign(w * 0.82 - ((t * 20) % 560), road.horizonY - 6, "健康多一點", COLORS.leaf, 126);
    drawSeasonDetails(w, h, road, mood, t);
    drawCuteBrandDecals(w, road.horizonY - 90, t);
    drawPseudoRoad(w, h, t);
    drawTainanRoadside(w, h, t);
    drawMoodOverlay(w, h, mood);
    drawWeatherEffects(w, h, mood, weather, t);
    drawConveyor(w, h, t);
  }

  function getWorldMood(t = state.time) {
    const dayProgress = positiveModulo(t / 68 + 0.5, 1);
    const sunAmount = 0.5 + Math.sin(dayProgress * Math.PI * 2 - Math.PI / 2) * 0.5;
    const nightRaw = clamp((0.56 - sunAmount) / 0.52, 0, 1);
    const night = nightRaw * nightRaw * (3 - nightRaw * 2);
    const duskRaw = clamp(1 - Math.abs(sunAmount - 0.48) / 0.22, 0, 1);
    const dusk = duskRaw * duskRaw * (3 - duskRaw * 2) * (1 - night * 0.38);
    const seasonProgress = positiveModulo(t / 288, 1);
    const seasonPhase = seasonProgress * 4;
    const seasonIndex = Math.floor(seasonPhase) % 4;
    const seasonNextIndex = positiveModulo(seasonIndex + 1, 4);
    const seasonFrac = seasonPhase - Math.floor(seasonPhase);
    const seasonBlendRaw = clamp((seasonFrac - 0.64) / 0.36, 0, 1);
    const seasonBlend = seasonBlendRaw * seasonBlendRaw * (3 - seasonBlendRaw * 2);
    const seasons = [
      { name: "春", leaf: "#7bbf6a", flower: "#f19aa0", ground: "#fff5dc", wash: "#f6a6b5" },
      { name: "夏", leaf: "#3f9e58", flower: "#ef6f53", ground: "#fff0c9", wash: "#65a85f" },
      { name: "秋", leaf: "#c78f3a", flower: "#f4b84f", ground: "#f5d7a5", wash: "#f4a13e" },
      { name: "冬", leaf: "#75a8b8", flower: "#e8f7ff", ground: "#e8f5f8", wash: "#7fc3de" },
    ];
    const season = seasons[seasonIndex];
    const nextSeason = seasons[seasonNextIndex];
    const seasonLeaf = mixColor(season.leaf, nextSeason.leaf, seasonBlend);
    const seasonFlower = mixColor(season.flower, nextSeason.flower, seasonBlend);
    const seasonGround = mixColor(season.ground, nextSeason.ground, seasonBlend);
    const seasonWashColor = mixColor(season.wash, nextSeason.wash, seasonBlend);
    const washRgb = hexToRgb(seasonWashColor);
    const skyDayTop = mixColor("#bfeef8", "#ffd8b3", dusk * 0.45);
    const skyDayBase = mixColor("#9bdcf0", "#f8c8a0", dusk * 0.42);
    const skyTop = mixColor(skyDayTop, "#152747", night);
    const skyBase = mixColor(skyDayBase, "#36546f", night);
    return {
      dayProgress,
      sunAmount,
      night,
      dusk,
      seasonIndex,
      seasonBlend,
      seasonName: seasonBlend > 0.5 ? nextSeason.name : season.name,
      seasonLeaf,
      seasonFlower,
      seasonWash: `rgba(${washRgb.r},${washRgb.g},${washRgb.b},${0.18 + (1 - night) * 0.1})`,
      skyTop,
      skyBase,
      ground: mixColor(seasonGround, "#c7d8df", night * 0.42),
    };
  }

  function drawDayNightSky(w, h, mood, t) {
    const road = getRoadMetrics();
    const sunX = w * (0.12 + mood.dayProgress * 0.76);
    const arc = Math.sin(mood.dayProgress * Math.PI);
    const sunY = road.horizonY - 72 - arc * Math.max(80, h * 0.18);
    ctx.save();
    if (mood.night < 0.95) {
      ctx.globalAlpha = 0.42 + (1 - mood.night) * 0.3;
      drawCircle(sunX, sunY, 30, mood.dusk > 0.25 ? "#f4b84f" : "#f4d16f");
      drawCircle(sunX + 9, sunY - 8, 42, "rgba(255,255,255,.18)");
    }
    if (mood.night > 0.08) {
      ctx.globalAlpha = mood.night * 0.9;
      const moonX = w - sunX;
      const moonY = road.horizonY - 116 - Math.sin((mood.dayProgress + 0.5) * Math.PI) * Math.max(50, h * 0.1);
      drawCircle(moonX, moonY, 24, "#fff8d7");
      drawCircle(moonX + 9, moonY - 5, 22, mood.skyTop);
      for (let i = 0; i < 24; i += 1) {
        const x = positiveModulo(i * 97 + t * 4, w + 80) - 40;
        const y = 28 + positiveModulo(i * 37, Math.max(80, road.horizonY - 76));
        fillRect(x, y, i % 3 === 0 ? 5 : 3, i % 3 === 0 ? 5 : 3, i % 2 ? "#ffffff" : "#f4d16f");
      }
    }
    ctx.restore();
  }

  function getWeatherCloudAmount(weather) {
    const current = WEATHER_DEFS[weather.current] || WEATHER_DEFS.sunny;
    const next = WEATHER_DEFS[weather.next] || current;
    return current.cloud * (1 - weather.blend) + next.cloud * weather.blend;
  }

  function drawWeatherSky(w, h, mood, weather, t) {
    drawWeatherSkyLayer(weather.current, 1 - weather.blend, w, h, mood, t, weather.seed);
    if (weather.blend > 0) drawWeatherSkyLayer(weather.next, weather.blend, w, h, mood, t, weather.seed + 97);
  }

  function drawWeatherSkyLayer(type, amount, w, h, mood, t, seed) {
    if (amount <= 0.01) return;
    const def = WEATHER_DEFS[type] || WEATHER_DEFS.sunny;
    const road = getRoadMetrics();
    ctx.save();
    if (type === "sunny") {
      const day = 1 - mood.night;
      if (day > 0.12) {
        ctx.globalAlpha = amount * day * 0.18;
        fillRect(0, 0, w, h * 0.72, def.tint);
        ctx.globalAlpha = amount * day * 0.12;
        for (let i = 0; i < 5; i += 1) {
          const x = positiveModulo(i * 220 + t * 12, w + 240) - 120;
          drawQuad(x, road.horizonY - 150, x + 46, road.horizonY - 150, x + 180, h, x + 84, h, "rgba(255,248,198,.3)");
        }
      }
      ctx.restore();
      return;
    }

    ctx.globalAlpha = amount;
    fillRect(0, 0, w, h, def.tint);
    if (def.cloud > 0.18) {
      const cloudRows = type === "typhoon" || type === "heavyRain" ? 4 : 3;
      for (let row = 0; row < cloudRows; row += 1) {
        const y = 30 + row * 52 + mood.night * 10;
        const count = type === "typhoon" ? 8 : 6;
        for (let i = 0; i < count; i += 1) {
          const drift = t * (type === "typhoon" ? 42 : 18 + row * 4);
          const x = positiveModulo(seed * 31 + i * 210 - drift + row * 70, w + 260) - 130;
          ctx.globalAlpha = amount * (0.16 + def.cloud * 0.34) * (1 - row * 0.1);
          drawCloud(x, y + Math.sin(t * 0.22 + i) * 5);
          ctx.globalAlpha = amount * (0.08 + def.cloud * 0.16);
          fillRect(x - 44, y + 24, 188, 18 + row * 2, type === "typhoon" ? "rgba(31,50,66,.45)" : "rgba(255,255,255,.6)");
        }
      }
    }
    ctx.restore();
  }

  function drawWeatherEffects(w, h, mood, weather, t) {
    drawWeatherEffectLayer(weather.current, 1 - weather.blend, w, h, mood, t, weather.seed);
    if (weather.blend > 0) drawWeatherEffectLayer(weather.next, weather.blend, w, h, mood, t, weather.seed + 197);
  }

  function drawWeatherEffectLayer(type, amount, w, h, mood, t, seed) {
    if (amount <= 0.01) return;
    const def = WEATHER_DEFS[type] || WEATHER_DEFS.sunny;
    ctx.save();
    if (def.rain > 0) drawRainLayer(w, h, t, seed, amount * def.rain, type === "typhoon");
    if (def.snow > 0) drawSnowLayer(w, h, t, seed, amount * def.snow);
    if (def.fog > 0) drawFogLayer(w, h, t, seed, amount * def.fog);
    if (def.wind > 0.2) drawWindLayer(w, h, t, seed, amount * def.wind, type === "typhoon");
    if (type === "cloudy") {
      ctx.globalAlpha = amount * 0.08;
      fillRect(0, 0, w, h, "rgba(95,116,126,.22)");
    }
    ctx.restore();
  }

  function drawRainLayer(w, h, t, seed, intensity, typhoon) {
    const drops = Math.round((typhoon ? 130 : 72) * intensity);
    const slant = typhoon ? -44 : -16;
    ctx.save();
    ctx.strokeStyle = typhoon ? "rgba(210,240,255,.62)" : "rgba(210,240,255,.52)";
    ctx.lineWidth = typhoon ? 2.2 : 1.5;
    ctx.globalAlpha = clamp(0.35 + intensity * 0.45, 0.35, 0.88);
    ctx.beginPath();
    for (let i = 0; i < drops; i += 1) {
      const base = seed * 37 + i * 97;
      const x = positiveModulo(base + t * (typhoon ? 520 : 260), w + 180) - 90;
      const y = positiveModulo(seed * 19 + i * 53 + t * (typhoon ? 760 : 430), h + 160) - 80;
      const len = (typhoon ? 34 : 22) + (i % 5) * 4;
      ctx.moveTo(x, y);
      ctx.lineTo(x + slant, y + len);
    }
    ctx.stroke();
    ctx.globalAlpha = intensity * 0.18;
    fillRect(0, getRoadMetrics().horizonY - 8, w, h, "rgba(127,195,222,.24)");
    ctx.restore();
  }

  function drawSnowLayer(w, h, t, seed, intensity) {
    const flakes = Math.round(64 * intensity);
    ctx.save();
    ctx.globalAlpha = clamp(0.38 + intensity * 0.45, 0.38, 0.88);
    for (let i = 0; i < flakes; i += 1) {
      const x = positiveModulo(seed * 41 + i * 83 + Math.sin(t * 0.7 + i) * 34, w + 80) - 40;
      const y = positiveModulo(seed * 13 + i * 47 + t * (48 + i % 5 * 10), h + 90) - 45;
      const size = 3 + i % 4;
      fillRect(x, y, size, size, i % 3 ? "rgba(255,255,255,.86)" : "rgba(220,246,255,.9)");
    }
    ctx.restore();
  }

  function drawFogLayer(w, h, t, seed, intensity) {
    const road = getRoadMetrics();
    ctx.save();
    ctx.globalAlpha = clamp(intensity * 0.42, 0, 0.7);
    fillRect(0, road.horizonY - 72, w, h - road.horizonY + 96, "rgba(232,246,246,.78)");
    for (let i = 0; i < 7; i += 1) {
      const y = road.horizonY - 40 + i * 58;
      const x = positiveModulo(seed * 29 + i * 173 - t * (18 + i * 3), w + 260) - 130;
      ctx.globalAlpha = intensity * (0.13 + i * 0.025);
      fillRect(x, y, w * 0.62, 18 + i * 5, "rgba(255,255,255,.72)");
    }
    ctx.restore();
  }

  function drawWindLayer(w, h, t, seed, intensity, typhoon) {
    ctx.save();
    ctx.strokeStyle = typhoon ? "rgba(255,255,255,.62)" : "rgba(255,255,255,.42)";
    ctx.lineWidth = typhoon ? 3 : 2;
    ctx.globalAlpha = clamp(intensity * 0.42, 0.08, 0.72);
    ctx.beginPath();
    const lines = typhoon ? 22 : 12;
    for (let i = 0; i < lines; i += 1) {
      const y = positiveModulo(seed * 17 + i * 71 + t * (typhoon ? 190 : 90), h + 90) - 45;
      const x = positiveModulo(seed * 43 + i * 131 - t * (typhoon ? 420 : 220), w + 220) - 110;
      ctx.moveTo(x, y);
      ctx.lineTo(x + (typhoon ? 96 : 64), y - (typhoon ? 24 : 12));
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawSeasonDetails(w, h, road, mood, t) {
    ctx.save();
    const seasonName = mood.seasonName;
    if (seasonName === "春") {
      ctx.globalAlpha = 0.52 + mood.dusk * 0.12;
      const count = isMobileLayout() ? 24 : 38;
      for (let i = 0; i < count; i += 1) {
        const drift = Math.sin(t * 0.55 + i * 1.7) * 34;
        const x = positiveModulo(i * 83 + drift - state.sceneryOffset * 0.045, w + 160) - 80;
        const y = positiveModulo(i * 57 + t * (24 + i % 5 * 4), h + 120) - 70;
        const size = 4 + i % 4;
        drawPetal(x, y, size, i % 3 ? "#f19aa0" : "#ffd7e6", t * 0.9 + i);
      }
    } else if (seasonName === "夏") {
      ctx.globalAlpha = 0.32;
      for (let i = 0; i < 16; i += 1) {
        const x = positiveModulo(i * 121 - state.sceneryOffset * 0.07, w + 120) - 60;
        const y = road.horizonY - 18 + (i % 5) * 24 + Math.sin(t + i) * 5;
        drawCircle(x, y, 3 + i % 2, i % 2 ? "#f4d16f" : "#ffffff");
      }
      ctx.globalAlpha = 0.12;
      fillRect(0, road.horizonY - 62, w, h - road.horizonY + 62, "rgba(244,184,79,.28)");
    } else if (seasonName === "秋") {
      ctx.globalAlpha = 0.5 + mood.dusk * 0.14;
      const count = isMobileLayout() ? 18 : 30;
      for (let i = 0; i < count; i += 1) {
        const x = positiveModulo(i * 101 + Math.sin(t * 0.75 + i) * 38 - state.sceneryOffset * 0.07, w + 140) - 70;
        const y = positiveModulo(i * 53 + t * (18 + i % 3 * 4), h + 100) - 45;
        drawLeaf(x, y, 5 + i % 4, i % 2 ? "#c78f3a" : "#ef8b53", t + i);
      }
    } else {
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 22; i += 1) {
        const x = positiveModulo(i * 97 - state.sceneryOffset * 0.06, w + 120) - 60;
        const y = road.horizonY - 36 + (i % 5) * 23 + Math.sin(t * 0.45 + i) * 4;
        drawCircle(x, y, 3 + (i % 3), "rgba(255,255,255,.78)");
      }
      ctx.globalAlpha = 0.16;
      fillRect(0, road.horizonY - 28, w, 34, "rgba(232,246,255,.72)");
    }
    ctx.restore();
  }

  function drawPetal(x, y, size, color, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(spin) * 0.9);
    drawQuad(-size, 0, 0, -size * 0.7, size * 1.5, 0, 0, size * 0.9, color);
    drawCircle(size * 0.35, -size * 0.05, size * 0.42, "rgba(255,255,255,.44)");
    ctx.restore();
  }

  function drawLeaf(x, y, size, color, spin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(spin) * 0.7);
    drawQuad(0, -size, size * 1.3, 0, 0, size * 1.8, -size * 1.1, 0, color);
    strokePerspectiveLine(0, -size * 0.7, 0, size * 1.3, "rgba(143,95,66,.5)", Math.max(1, size * 0.22));
    ctx.restore();
  }

  function drawMoodOverlay(w, h, mood) {
    if (mood.night <= 0.04 && mood.dusk <= 0.08) return;
    ctx.save();
    if (mood.dusk > 0.08) {
      fillRect(0, 0, w, h, `rgba(244,139,83,${mood.dusk * 0.08})`);
    }
    if (mood.night > 0.04) {
      fillRect(0, 0, w, h, `rgba(16,31,58,${mood.night * 0.34})`);
      fillRect(0, 0, w, h * 0.45, `rgba(8,18,38,${mood.night * 0.18})`);
    }
    ctx.restore();
  }

  function drawPseudoRoad(w, h, t) {
    const road = getRoadMetrics();
    const fork = getForkVisualAmount();
    const leftFar = road.centerX - road.farWidth / 2;
    const rightFar = road.centerX + road.farWidth / 2;
    const leftNear = road.centerX - road.nearWidth / 2;
    const rightNear = road.centerX + road.nearWidth / 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(leftFar, road.horizonY);
    ctx.lineTo(rightFar, road.horizonY);
    ctx.lineTo(rightNear, road.nearY + 95);
    ctx.lineTo(leftNear, road.nearY + 95);
    ctx.closePath();
    ctx.fillStyle = "#8fd7e9";
    ctx.fill();
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.moveTo(leftFar - 28, road.horizonY);
    ctx.lineTo(leftFar, road.horizonY);
    ctx.lineTo(leftNear, road.nearY + 95);
    ctx.lineTo(leftNear - 68, road.nearY + 95);
    ctx.closePath();
    ctx.fillStyle = "#ffe9cc";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(rightFar, road.horizonY);
    ctx.lineTo(rightFar + 28, road.horizonY);
    ctx.lineTo(rightNear + 68, road.nearY + 95);
    ctx.lineTo(rightNear, road.nearY + 95);
    ctx.closePath();
    ctx.fillStyle = "#ffe9cc";
    ctx.fill();
    ctx.globalAlpha = 1;
    strokePerspectiveLine(leftFar, road.horizonY, leftNear, road.nearY + 92, "rgba(38,138,161,.55)", 4);
    strokePerspectiveLine(rightFar, road.horizonY, rightNear, road.nearY + 92, "rgba(38,138,161,.55)", 4);
    if (fork > 0.06) {
      const splitY = road.horizonY + (road.nearY - road.horizonY) * 0.23;
      const splitLeft = road.centerX - roadWidthAtDepth(0.23) * 0.16;
      const splitRight = road.centerX + roadWidthAtDepth(0.23) * 0.16;
      ctx.globalAlpha = 0.2 + fork * 0.38;
      strokePerspectiveLine(splitLeft, splitY, roadLaneCenter(0, road.nearY), road.nearY + 70, "rgba(255,255,255,.72)", 5);
      strokePerspectiveLine(splitRight, splitY, roadLaneCenter(2, road.nearY), road.nearY + 70, "rgba(255,255,255,.72)", 5);
      ctx.globalAlpha = 1;
      for (let lane = 0; lane < 3; lane += 1) {
        const laneX = roadLaneCenter(lane, road.nearY);
        const farX = lane === 1 ? road.centerX : lane < 1 ? splitLeft : splitRight;
        const color = lane === player.lane ? "rgba(255,255,255,.76)" : `rgba(255,255,255,${0.18 + fork * 0.22})`;
        strokePerspectiveLine(farX, lane === 1 ? road.horizonY + 4 : splitY, laneX, road.nearY + 60, color, lane === player.lane ? 4 : 2);
      }
    } else {
      strokePerspectiveLine(road.centerX, road.horizonY + 4, road.centerX, road.nearY + 60, "rgba(255,255,255,.38)", 2);
    }
    for (let i = 0; i < 16; i += 1) {
      const depth = positiveModulo(i * 0.09 + state.sceneryOffset * 0.00065, 1);
      const y = road.horizonY + (road.nearY - road.horizonY) * depth ** 1.15;
      const width = roadWidthAtDepth(depth);
      const x = road.centerX;
      const stripeW = Math.max(12, width * 0.035);
      const stripeH = 4 + depth * 12;
      fillRect(x - stripeW / 2, y - stripeH / 2, stripeW, stripeH, depth > 0.42 ? "rgba(255,255,255,.68)" : "rgba(255,255,255,.36)");
      if (i % 3 === 0) {
        fillRect(x - width * 0.48, y, width * 0.12, 4 + depth * 6, "rgba(255,255,255,.42)");
        fillRect(x + width * 0.36, y, width * 0.12, 4 + depth * 6, "rgba(255,255,255,.42)");
      }
    }
    ctx.restore();
  }

  function drawRouteForkBanner(road, fork) {
    void road;
    void fork;
  }

  function strokePerspectiveLine(x1, y1, x2, y2, color, width) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function drawTainanRoadside(w, h, t) {
    const road = getRoadMetrics();
    const landmarks = [
      { name: "純粹好食門市", kind: "ugoodays", model: "ugoodaysStore", color: "#f7fdff", accent: "#7fc3de" },
      { name: "臺南車站", kind: "station", model: "tainanStation", color: "#f3dfbf", accent: "#6f9fb0" },
      { name: "南紡購物中心", kind: "mall", model: "nanfangMall", color: "#e9f6f8", accent: "#82c6d8" },
      { name: "善化車站", kind: "station", model: "shanhuaStation", color: "#f4e2c4", accent: "#8cb8c7" },
      { name: "赤崁樓", kind: "fort", model: "chihkanTower", color: "#d98975", accent: "#b44966" },
      { name: "河樂廣場", kind: "plaza", model: "helePlaza", color: "#dff6ff", accent: "#61c7de" },
      { name: "大魚的祝福", kind: "fish", model: "bigFish", color: "#e7f7fa", accent: "#7fc3de" },
      { name: "安平古堡", kind: "fort", model: "anpingFort", color: "#c57563", accent: "#934b42" },
      { name: "億載金城", kind: "fort", model: "eternalCastle", color: "#d99b72", accent: "#a85f4f" },
      { name: "德記洋行", kind: "colonial", model: "taitMerchant", color: "#f5f0df", accent: "#9dbf8f" },
      { name: "司法博物館", kind: "museum", model: "judicialMuseum", color: "#eef4f4", accent: "#7aa9b6" },
      { name: "知事官邸", kind: "colonial", model: "governorResidence", color: "#f3e6c4", accent: "#89b381" },
      { name: "水仙宮市場", kind: "market", model: "shuixianMarket", color: "#fff4dc", accent: "#65a85f" },
      { name: "國華街", kind: "street", model: "guohuaStreet", color: "#ffe5c7", accent: "#ef8b53" },
      { name: "富農街", kind: "street", model: "funongStreet", color: "#ffe5c7", accent: "#c85f45" },
      { name: "神農街", kind: "street", model: "shennongStreet", color: "#f4dfc8", accent: "#8f5f42" },
      { name: "四草綠隧", kind: "tunnel", model: "sicaoTunnel", color: "#dbe8c9", accent: "#65a85f" },
      { name: "漁光島", kind: "island", model: "yuguangIsland", color: "#f7e2bd", accent: "#f4d16f" },
      { name: "林百貨", kind: "deco", model: "hayashi", color: "#e9e1cf", accent: "#8a9aa1" },
      { name: "大天后宮", kind: "temple", model: "mazuTemple", color: "#f5d4b2", accent: "#d8243c" },
      { name: "奇美博物館", kind: "museum", model: "chimeiMuseum", color: "#eef5f8", accent: "#7aa9b6" },
      { name: "臺南美術館", kind: "museum", model: "tainanArtMuseum", color: "#f3f5f0", accent: "#c9a57c" },
      { name: "花園夜市", kind: "market", model: "gardenNightMarket", color: "#ffe3b6", accent: "#ef8b53" },
      { name: "台南孔廟", kind: "temple", model: "confuciusTemple", color: "#f3d0b8", accent: "#b44966" },
      { name: "藍晒圖園區", kind: "deco", model: "blueprintPark", color: "#dceffc", accent: "#4b91b6" },
      { name: "十鼓仁糖", kind: "factory", model: "tenDrum", color: "#e7c0a7", accent: "#a85f4f" },
      { name: "關子嶺溫泉", kind: "resort", model: "guanzilingHotSpring", color: "#f3e6c4", accent: "#7aa9b6" },
      { name: "新化老街", kind: "street", model: "xinhuaOldStreet", color: "#f1d2bd", accent: "#934b42" },
      { name: "安平老街", kind: "street", model: "anpingOldStreet", color: "#f4dfc8", accent: "#c85f45" },
      { name: "安平樹屋", kind: "treehouse", model: "anpingTreeHouse", color: "#d8c1a2", accent: "#65a85f" },
      { name: "安平砲臺", kind: "fort", model: "anpingBattery", color: "#c7846d", accent: "#934b42" },
      { name: "延平郡王祠", kind: "temple", model: "koxingaShrine", color: "#f3d0b8", accent: "#c85f45" },
      { name: "吳園藝文中心", kind: "garden", model: "wuGarden", color: "#f3e6c4", accent: "#65a85f" },
      { name: "西市場", kind: "market", model: "westMarket", color: "#f1d2bd", accent: "#b44966" },
      { name: "海安路藝術街", kind: "street", model: "haiAnArtStreet", color: "#dceffc", accent: "#7d5ba6" },
      { name: "保安路", kind: "street", model: "baoAnRoad", color: "#ffe5c7", accent: "#ef8b53" },
      { name: "台江國家公園", kind: "wetland", model: "taijiangPark", color: "#d5ead4", accent: "#4a9f72" },
      { name: "月津港燈節", kind: "festival", model: "yuejinHarbor", color: "#dff6ff", accent: "#f4d16f" },
      { name: "臺南市圖", kind: "library", model: "tainanLibrary", color: "#eef4f4", accent: "#8a9aa1" },
      { name: "山上水道", kind: "museum", model: "waterworksMuseum", color: "#e7c0a7", accent: "#a85f4f" },
      { name: "七股鹽山", kind: "deco", model: "qiguSaltMountain", color: "#f7fdff", accent: "#7fc3de" },
      { name: "臺史博", kind: "museum", model: "taiwanHistoryMuseum", color: "#e8f0ee", accent: "#8a9aa1" },
      { name: "北門水晶教堂", kind: "chapel", model: "beimenCrystalChurch", color: "#e7f7fa", accent: "#7fc3de" },
      { name: "井仔腳鹽田", kind: "salt", model: "jingzaijiaoSaltFields", color: "#f7e2bd", accent: "#7aa9b6" },
      { name: "麻豆代天府", kind: "temple", model: "madouDaitianTemple", color: "#f5d4b2", accent: "#d8243c" },
      { name: "虎頭埤", kind: "lake", model: "hutoupi", color: "#d5ead4", accent: "#4a9f72" },
      { name: "蕭壠文化園區", kind: "factory", model: "soulanghCulturalPark", color: "#e8d0b8", accent: "#a85f4f" },
      { name: "鳳凰木綠廊", kind: "flora", model: "flameTree", color: "#dbe8c9", accent: "#ef6f53" },
      { name: "府城榕樹蔭", kind: "flora", model: "banyanShade", color: "#dfe9cf", accent: "#65a85f" },
      { name: "四草紅樹林", kind: "flora", model: "mangrove", color: "#d5ead4", accent: "#4a9f72" },
      { name: "九重葛花牆", kind: "flora", model: "bougainvillea", color: "#f8dfec", accent: "#b44966" },
      { name: "芒果樹小徑", kind: "flora", model: "mangoGrove", color: "#f2e5b8", accent: "#f4b84f" },
      { name: "白河蓮田", kind: "flora", model: "lotusPond", color: "#dff6ef", accent: "#7fc3de" },
    ];
    const buildingLandmarks = landmarks.filter((landmark) => landmark.kind !== "flora");
    const floraLandmarks = landmarks.filter((landmark) => landmark.kind === "flora");
    const roadsideSequence = ["building", "building", "flora", "building", "building", "flora", "building", "building", "flora", "building", "building", "flora", "building"];
    const entries = [];
    const mobile = isMobileLayout();
    const slotCount = mobile ? 20 : 36;
    const scroll = state.sceneryOffset * (mobile ? 0.00074 : 0.0008);
    const trackLength = 2.08;
    const usedBuildingModels = new Set();
    for (let slot = 0; slot < slotCount; slot += 1) {
      const rawProgress = slot / slotCount * trackLength + scroll;
      const depth = positiveModulo(rawProgress, trackLength) - 0.08;
      if (depth < 0) continue;
      const cycle = Math.floor(rawProgress / trackLength);
      const sideSlot = Math.floor(slot / 2);
      const kind = roadsideSequence[positiveModulo(sideSlot + cycle, roadsideSequence.length)];
      const pool = kind === "flora" ? floraLandmarks : buildingLandmarks;
      let landmarkIndex = positiveModulo(sideSlot * 3 + slot + cycle * 5, pool.length);
      let landmark = pool[landmarkIndex];
      if (kind !== "flora") {
        for (let tries = 0; tries < pool.length && usedBuildingModels.has(landmark.model); tries += 1) {
          landmarkIndex = positiveModulo(landmarkIndex + 1, pool.length);
          landmark = pool[landmarkIndex];
        }
        usedBuildingModels.add(landmark.model);
      }
      const side = slot % 2 === 0 ? -1 : 1;
      entries.push({ type: kind, landmark, depth, side, index: landmarkIndex + cycle * slotCount });
    }
    entries.sort((a, b) => a.depth - b.depth);
    const buildingDepthsBySide = {
      "-1": entries.filter((entry) => entry.type !== "flora" && entry.side < 0).map((entry) => entry.depth),
      "1": entries.filter((entry) => entry.type !== "flora" && entry.side > 0).map((entry) => entry.depth),
    };
    drawRoadsideGreenBelts(road, scroll, buildingDepthsBySide);
    const drawRoadsideEntry = (entry) => {
      if (entry.type === "flora") {
        const sameSideBuildings = buildingDepthsBySide[String(entry.side)] || [];
        if (sameSideBuildings.some((depth) => Math.abs(depth - entry.depth) < 0.3)) return;
      }
      const eased = Math.max(0, entry.depth) ** 1.12;
      const y = road.horizonY + (road.nearY - road.horizonY) * eased;
      const roadW = roadWidthAtDepth(Math.min(eased, 1.18));
      const mobile = isMobileLayout();
      const scale = (mobile ? 0.42 : 0.54) + eased * (mobile ? 0.98 : 1.34);
      const alpha = clamp(0.72 + Math.min(1, eased) * 0.28, 0.72, 1);
      const roadEdge = road.centerX + entry.side * roadW * 0.5;
      const sideGap = entry.type === "flora" ? 0 : (mobile ? 0.75 + eased * 1.4 : 1 + eased * 1.8);
      const drawRoadEdge = roadEdge;
      ctx.save();
      ctx.globalAlpha *= entry.type === "flora" ? alpha * 0.9 : alpha;
      const modelSize = getRoadsideModelSize(entry.landmark);
      const modelW = modelSize.w * scale;
      const modelH = modelSize.h * scale;
      const groundY = y + (entry.type === "flora" ? 62 : 74) * scale;
      const visualTop = groundY - modelH - (entry.type === "flora" ? 126 * scale : 86 * scale);
      const visualBottom = groundY + 40 * scale;
      const lowerCull = h + Math.max(260, modelH + 150 * scale);
      if (visualBottom < -140 || visualTop > lowerCull) {
        ctx.restore();
        return;
      }
      const x = entry.side < 0 ? drawRoadEdge - sideGap - modelW : drawRoadEdge + sideGap;
      drawRoadsideModel(entry.landmark, x, groundY, scale, entry.side, entry.index, drawRoadEdge);
      ctx.restore();
    };
    entries.filter((entry) => entry.type === "flora").forEach(drawRoadsideEntry);
    entries.filter((entry) => entry.type !== "flora").forEach(drawRoadsideEntry);
  }

  function drawRoadsideGreenBelts(road, scroll, blockedDepthsBySide = {}) {
    const mobile = isMobileLayout();
    const stripOffset = mobile ? 16 : 22;
    const stripWidth = mobile ? 42 : 54;

    for (const side of [-1, 1]) {
      ctx.save();
      drawRoadsideGroundMarks(road, side, scroll, stripOffset, stripWidth, blockedDepthsBySide);
      ctx.globalAlpha *= 0.9;
      drawRoadsideVegetationColumns(road, side, scroll, stripOffset, stripWidth, blockedDepthsBySide);
      ctx.restore();
    }
  }

  function drawRoadsideGroundMarks(road, side, scroll, stripOffset, stripWidth, blockedDepthsBySide = {}) {
    const mobile = isMobileLayout();
    const mood = getWorldMood();
    const marks = mobile ? 7 : 10;

    ctx.save();
    for (let i = 0; i < marks; i += 1) {
      const depth = positiveModulo(i / marks + scroll * 0.72, 1);
      if (depth < 0.04 || depth > 0.98) continue;
      if (roadsideDepthBlocked(blockedDepthsBySide, side, depth, 0.12)) continue;
      const eased = depth ** 1.18;
      const y = road.horizonY + (road.nearY - road.horizonY) * eased;
      const edge = road.centerX + side * roadWidthAtDepth(eased) * 0.5;
      const scale = (mobile ? 0.3 : 0.34) + eased * (mobile ? 0.42 : 0.5);
      const x = edge + side * (stripOffset + stripWidth * 0.38) * (0.78 + eased * 0.25);
      const markW = (mobile ? 18 : 25) * scale;
      const markH = Math.max(2, 4 * scale);
      const markX = side < 0 ? x - markW : x;
      ctx.globalAlpha = 0.16 + eased * 0.1;
      fillRect(markX, y + 40 * scale, markW, markH, mixColor(mood.seasonLeaf, "#ffffff", 0.32));
    }
    ctx.restore();
  }

  function roadsideDepthBlocked(blockedDepthsBySide, side, depth, margin) {
    const depths = blockedDepthsBySide[String(side)] || [];
    return depths.some((item) => item >= 0 && Math.abs(item - depth) < margin);
  }

  function drawRoadsideVegetationColumns(road, side, scroll, stripOffset, stripWidth, blockedDepthsBySide = {}) {
    const mobile = isMobileLayout();
    const columns = mobile ? 3 : 4;
    const rows = mobile ? 15 : 20;
    const cycle = 1.22;
    const plantScroll = scroll * 1.18;
    const plants = [];

    for (let col = 0; col < columns; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const rawDepth = positiveModulo(row / rows * cycle + plantScroll + col * 0.08, cycle) - 0.08;
        if (rawDepth < 0.02 || rawDepth > 0.96) continue;
        if (roadsideDepthBlocked(blockedDepthsBySide, side, rawDepth, 0.17)) continue;
        plants.push({ col, row, depth: rawDepth });
      }
    }

    plants.sort((a, b) => a.depth - b.depth);
    for (const plant of plants) {
      const eased = plant.depth ** 1.18;
      const y = road.horizonY + (road.nearY - road.horizonY) * eased;
      const roadW = roadWidthAtDepth(eased);
      const edge = road.centerX + side * roadW * 0.5;
      const colRatio = columns === 1 ? 0.5 : plant.col / (columns - 1);
      const offset = (stripOffset + stripWidth * (0.28 + colRatio * 0.54)) * (0.72 + eased * 0.42);
      const x = edge + side * offset;
      const scale = (mobile ? 0.28 : 0.34) + eased * (mobile ? 0.58 : 0.72);
      drawRoadsideColumnPlant(x, y + 46 * scale, scale, side, plant.row + plant.col * 7);
    }
  }

  function drawRoadsideColumnPlant(x, groundY, scale, side, index) {
    const mood = getWorldMood();
    const leaf = mood.seasonLeaf;
    const leafLight = mixColor(leaf, "#ffffff", 0.18);
    const leafDark = mixColor(leaf, "#2f6f49", 0.18);
    const flowerColors = [mood.seasonFlower, "#ef6f53", "#f19aa0", "#f4d16f", "#b44966", "#7fc3de"];
    const treeType = index % 4;
    ctx.save();
    ctx.globalAlpha *= 0.95;
    fillRect(x - 18 * scale, groundY + 3 * scale, 36 * scale, 5 * scale, "rgba(68,125,73,.42)");
    if (treeType === 0) {
      fillRect(x - 4 * scale, groundY - 38 * scale, 8 * scale, 42 * scale, "#8b6b4e");
      drawCircle(x - 10 * scale, groundY - 48 * scale, 17 * scale, leaf);
      drawCircle(x + 9 * scale, groundY - 52 * scale, 18 * scale, leafLight);
      drawCircle(x + side * 6 * scale, groundY - 58 * scale, 6 * scale, flowerColors[index % flowerColors.length]);
    } else if (treeType === 1) {
      fillRect(x - 3 * scale, groundY - 32 * scale, 6 * scale, 36 * scale, "#8b6b4e");
      for (let i = 0; i < 4; i += 1) {
        const a = -Math.PI / 2 + (i - 1.5) * 0.46;
        drawQuad(
          x,
          groundY - 32 * scale,
          x + Math.cos(a) * 29 * scale,
          groundY - 32 * scale + Math.sin(a) * 16 * scale,
          x + Math.cos(a + 0.16) * 18 * scale,
          groundY - 28 * scale + Math.sin(a + 0.16) * 12 * scale,
          x,
          groundY - 27 * scale,
          leaf
        );
      }
    } else if (treeType === 2) {
      for (let i = 0; i < 4; i += 1) {
        const px = x + (i - 1.5) * 9 * scale;
        fillRect(px - 2 * scale, groundY - 22 * scale, 4 * scale, 22 * scale, "#65a85f");
        drawCircle(px, groundY - 26 * scale, 6 * scale, flowerColors[(index + i) % flowerColors.length]);
      }
      drawCircle(x - 10 * scale, groundY - 10 * scale, 8 * scale, leafLight);
      drawCircle(x + 9 * scale, groundY - 11 * scale, 8 * scale, leaf);
    } else {
      fillRect(x - 5 * scale, groundY - 34 * scale, 10 * scale, 38 * scale, "#8b6b4e");
      drawCircle(x - 13 * scale, groundY - 43 * scale, 18 * scale, leafDark);
      drawCircle(x + 12 * scale, groundY - 47 * scale, 20 * scale, leaf);
      strokePerspectiveLine(x, groundY - 5 * scale, x - side * 18 * scale, groundY + 10 * scale, "#8b6b4e", Math.max(1, 2 * scale));
    }
    ctx.restore();
  }

  function drawConnectedRoadsidePlant(x, groundY, scale, side, index) {
    const flowerColors = ["#f19aa0", "#f4d16f", "#7fc3de", "#b44966", "#ef8b53"];
    fillRect(x - 22 * scale, groundY + 2 * scale, 44 * scale, 7 * scale, "rgba(101,168,95,.72)");

    for (let i = 0; i < 4; i += 1) {
      const tx = x + side * (i - 1.5) * 12 * scale;
      fillRect(tx - 3 * scale, groundY - 16 * scale, 6 * scale, 20 * scale, "#9b7b50");
      drawCircle(tx - 5 * scale, groundY - 20 * scale, 10 * scale, i % 2 ? "#8ec47d" : "#65a85f");
      drawCircle(tx + 5 * scale, groundY - 23 * scale, 11 * scale, "#6fb56a");
      drawCircle(tx + side * 5 * scale, groundY - 18 * scale, 2.6 * scale, flowerColors[(index + i) % flowerColors.length]);
    }

    for (let i = 0; i < 5; i += 1) {
      const fx = x + (i - 2) * 9 * scale;
      drawCircle(fx, groundY + 6 * scale, 4.5 * scale, i % 2 ? "#89b381" : "#65a85f");
      drawCircle(fx + 2 * scale, groundY + scale, 2.4 * scale, flowerColors[(index + i + 2) % flowerColors.length]);
    }
  }

  function drawRoadsideStandalonePlanters(road) {
    const mobile = isMobileLayout();
    const count = mobile ? 7 : 12;
    const scroll = state.sceneryOffset * (mobile ? 0.0005 : 0.00062);
    const planters = [];
    for (let i = 0; i < count; i += 1) {
      const depth = positiveModulo((i + 0.5) / count + scroll, 1);
      planters.push({ depth, side: i % 2 === 0 ? -1 : 1, index: i });
    }
    planters.sort((a, b) => a.depth - b.depth);
    for (const planter of planters) {
      const eased = planter.depth ** 1.18;
      if (eased > 0.72) continue;
      const y = road.horizonY + (road.nearY - road.horizonY) * eased;
      const roadW = roadWidthAtDepth(eased);
      const scale = (mobile ? 0.34 : 0.38) + eased * (mobile ? 0.72 : 0.9);
      const roadEdge = road.centerX + planter.side * roadW * 0.5;
      const x = roadEdge + planter.side * (mobile ? 34 + eased * 12 : 44 + eased * 18);
      ctx.save();
      ctx.globalAlpha *= clamp(0.52 + eased * 0.5, 0.52, 1);
      drawRoadsideStandalonePlanter(x, y + 70 * scale, scale, planter.side, planter.index);
      ctx.restore();
    }
  }

  function drawRoadsideStandalonePlanter(x, groundY, scale, side, index) {
    const flowerColors = ["#f19aa0", "#f4d16f", "#7fc3de", "#b44966", "#ef8b53"];
    drawQuad(
      x - 44 * scale,
      groundY + 3 * scale,
      x + 44 * scale,
      groundY + 3 * scale,
      x + 56 * scale,
      groundY + 20 * scale,
      x - 56 * scale,
      groundY + 20 * scale,
      "rgba(255,244,220,.78)"
    );
    strokePerspectiveLine(x - 40 * scale, groundY + 5 * scale, x + 40 * scale, groundY + 5 * scale, "rgba(101,168,95,.42)", Math.max(1, 2 * scale));
    for (let i = 0; i < 3; i += 1) {
      const tx = x + side * (i - 1) * 21 * scale;
      fillRect(tx - 5 * scale, groundY - 28 * scale, 10 * scale, 34 * scale, "#9b7b50");
      drawCircle(tx - 8 * scale, groundY - 32 * scale, 15 * scale, i % 2 ? "#89b381" : "#65a85f");
      drawCircle(tx + 7 * scale, groundY - 37 * scale, 17 * scale, "#6fb56a");
      drawCircle(tx, groundY - 47 * scale, 12 * scale, "#8ec47d");
    }
    for (let i = 0; i < 7; i += 1) {
      const fx = x + (i - 3) * 12 * scale;
      const fy = groundY + (i % 2 ? 2 : -2) * scale;
      drawCircle(fx, fy, 5 * scale, i % 2 ? "#65a85f" : "#89b381");
      drawCircle(fx + 3 * scale, fy - 5 * scale, 3 * scale, flowerColors[(index + i) % flowerColors.length]);
    }
  }

  function drawRoadsideGarden(x, groundY, modelW, scale, side, index, roadEdge) {
    const innerX = side < 0 ? x + modelW + 7 * scale : x - 7 * scale;
    const flowerColors = ["#f19aa0", "#f4d16f", "#7fc3de", "#b44966"];
    ctx.save();
    for (let i = 0; i < 4; i += 1) {
      const bx = innerX + side * (8 + i * 12) * scale;
      const by = groundY - (10 + (i % 2) * 7) * scale;
      drawCircle(bx, by, (7 + i % 2 * 2) * scale, i % 2 ? "#89b381" : "#65a85f");
      fillRect(bx - 2 * scale, by + 5 * scale, 4 * scale, 16 * scale, "#8b6b4e");
      drawCircle(bx + side * 4 * scale, by - 3 * scale, 3 * scale, flowerColors[(index + i) % flowerColors.length]);
    }
    if (index % 3 === 0) {
      const palmX = innerX + side * 34 * scale;
      fillRect(palmX - 4 * scale, groundY - 58 * scale, 8 * scale, 58 * scale, "#9b7b50");
      for (let i = 0; i < 5; i += 1) {
        const a = -Math.PI / 2 + (i - 2) * 0.5;
        drawQuad(
          palmX,
          groundY - 58 * scale,
          palmX + Math.cos(a) * 36 * scale,
          groundY - 58 * scale + Math.sin(a) * 18 * scale,
          palmX + Math.cos(a + 0.18) * 24 * scale,
          groundY - 58 * scale + Math.sin(a + 0.18) * 14 * scale,
          palmX,
          groundY - 52 * scale,
          "#65a85f"
        );
      }
    }
    drawQuad(innerX, groundY + 2 * scale, roadEdge, groundY + 7 * scale, roadEdge, groundY + 16 * scale, innerX + side * 28 * scale, groundY + 14 * scale, "rgba(255,255,255,.34)");
    ctx.restore();
  }

  function drawRoadsidePlantCluster(groundY, scale, side, index, roadEdge) {
    const flowerColors = ["#f19aa0", "#f4d16f", "#7fc3de", "#b44966", "#ef8b53"];
    const innerDir = -side;
    const baseX = roadEdge + side * (34 + (index % 3) * 16) * scale;
    ctx.save();
    ctx.globalAlpha *= 0.96;

    drawQuad(
      baseX - 52 * scale,
      groundY + 5 * scale,
      baseX + 52 * scale,
      groundY + 5 * scale,
      baseX + 66 * scale,
      groundY + 23 * scale,
      baseX - 66 * scale,
      groundY + 23 * scale,
      "rgba(255,244,220,.66)"
    );
    strokePerspectiveLine(baseX - 48 * scale, groundY + 7 * scale, baseX + 48 * scale, groundY + 7 * scale, "rgba(101,168,95,.38)", Math.max(1, 2 * scale));

    for (let i = 0; i < 3; i += 1) {
      const x = baseX + side * (i * 18) * scale;
      const y = groundY - (2 + (i % 2) * 5) * scale;
      fillRect(x - 6 * scale, y - 24 * scale, 12 * scale, 28 * scale, "#9b7b50");
      drawCircle(x - 10 * scale, y - 27 * scale, 16 * scale, i % 2 ? "#8ec47d" : "#65a85f");
      drawCircle(x + 8 * scale, y - 30 * scale, 17 * scale, "#6fb56a");
      drawCircle(x, y - 42 * scale, 14 * scale, "#89b381");
      drawCircle(x + innerDir * 9 * scale, y - 30 * scale, 4.5 * scale, flowerColors[(index + i) % flowerColors.length]);
    }

    if (index % 2 === 0) {
      const palmX = baseX + side * 64 * scale;
      fillRect(palmX - 4 * scale, groundY - 64 * scale, 8 * scale, 66 * scale, "#9b7b50");
      for (let i = 0; i < 6; i += 1) {
        const angle = -Math.PI / 2 + (i - 2.5) * 0.38;
        drawQuad(
          palmX,
          groundY - 64 * scale,
          palmX + Math.cos(angle) * 42 * scale,
          groundY - 64 * scale + Math.sin(angle) * 20 * scale,
          palmX + Math.cos(angle + 0.2) * 26 * scale,
          groundY - 58 * scale + Math.sin(angle + 0.2) * 15 * scale,
          palmX,
          groundY - 56 * scale,
          "#65a85f"
        );
      }
    } else {
      const potX = baseX + side * 54 * scale;
      fillRect(potX - 17 * scale, groundY - 18 * scale, 34 * scale, 20 * scale, "#d99b72");
      strokeRect(potX - 17 * scale, groundY - 18 * scale, 34 * scale, 20 * scale, "rgba(36,50,58,.34)", Math.max(1, 2 * scale));
      for (let i = 0; i < 5; i += 1) {
        drawCircle(potX + (i - 2) * 7 * scale, groundY - (24 + Math.abs(i - 2) * 4) * scale, 7 * scale, i % 2 ? "#8ec47d" : "#65a85f");
        drawCircle(potX + (i - 2) * 7 * scale, groundY - 31 * scale, 2.8 * scale, flowerColors[(index + i + 2) % flowerColors.length]);
      }
    }

    ctx.globalAlpha *= 0.82;
    for (let i = 0; i < 5; i += 1) {
      const x = baseX + side * (12 + i * 15) * scale;
      const y = groundY + (5 + (i % 2) * 2) * scale;
      drawCircle(x, y, 7 * scale, i % 2 ? "#89b381" : "#65a85f");
      drawCircle(x + innerDir * 4 * scale, y - 4 * scale, 3.2 * scale, flowerColors[(index + i + 1) % flowerColors.length]);
    }
    ctx.restore();
  }

  function getRoadsideModelSize(landmark) {
    const model = landmark.model || landmark.kind;
    const sizes = {
      ugoodaysStore: { w: 214, h: 154 },
      tainanStation: { w: 168, h: 124 },
      nanfangMall: { w: 190, h: 150 },
      shanhuaStation: { w: 160, h: 104 },
      chihkanTower: { w: 162, h: 126 },
      helePlaza: { w: 166, h: 82 },
      bigFish: { w: 132, h: 112 },
      anpingFort: { w: 156, h: 116 },
      eternalCastle: { w: 172, h: 106 },
      taitMerchant: { w: 166, h: 112 },
      judicialMuseum: { w: 174, h: 124 },
      governorResidence: { w: 164, h: 104 },
      shuixianMarket: { w: 162, h: 102 },
      guohuaStreet: { w: 168, h: 104 },
      funongStreet: { w: 166, h: 104 },
      shennongStreet: { w: 166, h: 106 },
      sicaoTunnel: { w: 176, h: 106 },
      yuguangIsland: { w: 166, h: 98 },
      hayashi: { w: 136, h: 140 },
      mazuTemple: { w: 166, h: 126 },
      chimeiMuseum: { w: 184, h: 118 },
      tainanArtMuseum: { w: 168, h: 116 },
      gardenNightMarket: { w: 166, h: 100 },
      confuciusTemple: { w: 176, h: 120 },
      blueprintPark: { w: 168, h: 112 },
      tenDrum: { w: 178, h: 132 },
      guanzilingHotSpring: { w: 174, h: 116 },
      xinhuaOldStreet: { w: 172, h: 112 },
      anpingOldStreet: { w: 174, h: 108 },
      anpingTreeHouse: { w: 156, h: 116 },
      anpingBattery: { w: 166, h: 96 },
      koxingaShrine: { w: 180, h: 124 },
      wuGarden: { w: 172, h: 114 },
      westMarket: { w: 178, h: 118 },
      haiAnArtStreet: { w: 184, h: 112 },
      baoAnRoad: { w: 172, h: 106 },
      taijiangPark: { w: 182, h: 116 },
      yuejinHarbor: { w: 178, h: 108 },
      tainanLibrary: { w: 176, h: 132 },
      waterworksMuseum: { w: 178, h: 126 },
      qiguSaltMountain: { w: 174, h: 110 },
      taiwanHistoryMuseum: { w: 190, h: 128 },
      beimenCrystalChurch: { w: 166, h: 132 },
      jingzaijiaoSaltFields: { w: 186, h: 104 },
      madouDaitianTemple: { w: 188, h: 134 },
      hutoupi: { w: 190, h: 112 },
      soulanghCulturalPark: { w: 188, h: 124 },
      flameTree: { w: 164, h: 138 },
      banyanShade: { w: 176, h: 142 },
      mangrove: { w: 170, h: 124 },
      bougainvillea: { w: 166, h: 126 },
      mangoGrove: { w: 168, h: 132 },
      lotusPond: { w: 170, h: 118 },
    };
    return sizes[model] || { w: landmark.kind === "mall" ? 158 : landmark.kind === "fish" ? 126 : 138, h: landmark.kind === "temple" ? 118 : 108 };
  }

  function drawRoadsideFloraModel(landmark, x, groundY, scale, side, index, roadEdge) {
    const size = getRoadsideModelSize(landmark);
    const w = size.w * scale;
    const h = size.h * scale;
    const model = landmark.model || "flora";
    const mood = getWorldMood();
    const accent = landmark.accent || mood.seasonLeaf || COLORS.leaf;
    const road = getRoadMetrics();
    const farY = groundY - h * 0.9;
    const nearOuter = roadEdge + side * Math.min(72 * scale, w * 0.48);
    const farDepth = roadDepthAtY(farY);
    const farRoadEdge = road.centerX + side * roadWidthAtDepth(farDepth) * 0.5;
    const farOuter = farRoadEdge + side * Math.min(54 * scale, w * 0.42);

    ctx.save();
    drawQuad(roadEdge + side * 2 * scale, groundY + 12 * scale, nearOuter, groundY + 12 * scale, farOuter, farY, farRoadEdge + side * 2 * scale, farY, model === "lotusPond" ? "rgba(127,195,222,.5)" : mixColor(mood.seasonLeaf, "#ffffff", 0.48));
    drawQuad(roadEdge + side * 2 * scale, groundY + 16 * scale, nearOuter, groundY + 16 * scale, nearOuter + side * 14 * scale, groundY + 28 * scale, roadEdge + side * 2 * scale, groundY + 27 * scale, "rgba(36,50,58,.18)");
    strokePerspectiveLine(roadEdge + side * 4 * scale, groundY - 4 * scale, farRoadEdge + side * 4 * scale, farY, "rgba(36,50,58,.24)", Math.max(1, 2 * scale));
    strokePerspectiveLine(nearOuter, groundY - 2 * scale, farOuter, farY, "rgba(36,50,58,.2)", Math.max(1, 2 * scale));

    const rows = model === "lotusPond" ? 6 : 5;
    for (let i = 0; i < rows; i += 1) {
      const t = i / Math.max(1, rows - 1);
      const y = groundY - 2 * scale - t * (h * 0.82);
      const rowDepth = roadDepthAtY(y);
      const rowEdge = road.centerX + side * roadWidthAtDepth(rowDepth) * 0.5;
      const rowScale = scale * (1.06 - t * 0.24);
      const laneOffset = (24 + (model === "lotusPond" ? 7 : 0)) * scale;
      const centerX = rowEdge + side * laneOffset;
      drawRoadsideFloraPatch(model, centerX, y, rowScale, accent, i);
    }

    const tagW = Math.min(w - 12 * scale, 104 * scale);
    const tagX = side < 0 ? roadEdge - tagW - 10 * scale : roadEdge + 10 * scale;
    fillRect(tagX, groundY - 38 * scale, tagW, 25 * scale, "rgba(255,255,255,.88)");
    strokeRect(tagX, groundY - 38 * scale, tagW, 25 * scale, accent, Math.max(1, 2.5 * scale));
    drawText(landmark.name, tagX + tagW / 2, groundY - 19 * scale, Math.max(9, 13 * scale), accent, "center");
    ctx.restore();
  }

  function drawRoadsideFloraPatch(model, x, y, scale, accent, index) {
    const mood = getWorldMood();
    const leaf = mood.seasonLeaf;
    const leafLight = mixColor(leaf, "#ffffff", 0.18);
    const leafDark = mixColor(leaf, "#2f6f49", 0.2);
    if (model === "lotusPond") {
      drawCircle(x - 16 * scale, y + 6 * scale, 13 * scale, leafLight);
      drawCircle(x + 14 * scale, y + 3 * scale, 12 * scale, leaf);
      drawCircle(x, y - 8 * scale, 11 * scale, index % 2 ? "#ffffff" : mood.seasonFlower);
      fillRect(x - 2 * scale, y - 2 * scale, 4 * scale, 19 * scale, "#65a85f");
      return;
    }
    if (model === "mangrove") {
      fillRect(x - 6 * scale, y - 60 * scale, 12 * scale, 64 * scale, "#8b6b4e");
      strokePerspectiveLine(x, y - 4 * scale, x - 18 * scale, y + 18 * scale, "#8b6b4e", Math.max(1, 3 * scale));
      strokePerspectiveLine(x, y - 4 * scale, x + 18 * scale, y + 18 * scale, "#8b6b4e", Math.max(1, 3 * scale));
      drawCircle(x - 8 * scale, y - 72 * scale, 23 * scale, leafDark);
      drawCircle(x + 9 * scale, y - 80 * scale, 25 * scale, leaf);
      drawCircle(x + 1 * scale, y - 96 * scale, 22 * scale, leafLight);
      return;
    }
    const flower = model === "flameTree" ? "#ef6f53" : model === "bougainvillea" ? "#b44966" : model === "mangoGrove" ? "#f4b84f" : mood.seasonFlower || accent;
    fillRect(x - 6 * scale, y - 78 * scale, 12 * scale, 81 * scale, "#8b6b4e");
    drawCircle(x - 12 * scale, y - 91 * scale, 24 * scale, leaf);
    drawCircle(x + 12 * scale, y - 98 * scale, 26 * scale, leafLight);
    drawCircle(x, y - 118 * scale, 23 * scale, model === "bougainvillea" ? "#f19aa0" : leafLight);
    drawCircle(x + 8 * scale, y - 91 * scale, 5 * scale, flower);
    drawCircle(x - 9 * scale, y - 108 * scale, 4.5 * scale, flower);
    drawCircle(x + 3 * scale, y - 122 * scale, 4 * scale, flower);
  }

  function drawRoadsideModel(landmark, x, groundY, scale, side, index, roadEdge) {
    if (landmark.kind === "flora") {
      drawRoadsideFloraModel(landmark, x, groundY, scale, side, index, roadEdge);
      return;
    }
    const size = getRoadsideModelSize(landmark);
    const baseW = size.w;
    const baseH = size.h;
    const w = baseW * scale;
    const h = baseH * scale;
    const depth = (68 + (index % 3) * 12) * scale;
    const backX = side * depth;
    const backY = -depth * 0.54;
    const roadFaceDepth = side * depth * 0.58;
    const topColor = landmark.accent || "#7fc3de";
    const sideColor = index % 2 ? "#e6d1bc" : "#cfe5ea";
    const roadFaceColor = index % 2 ? "#f1dfca" : "#dff2f6";
    const frontY = groundY - h;
    const innerEdgeX = side < 0 ? x + w : x;

    ctx.save();
    drawRoadsideBuildingFooting(x, groundY, w, scale, side, roadEdge, landmark);
    const shadowInnerX = side < 0 ? x + w : x;
    const shadowOuterX = side < 0 ? x - 42 * scale : x + w + 42 * scale;
    drawQuad(
      shadowInnerX,
      groundY + 6 * scale,
      shadowOuterX,
      groundY + 6 * scale,
      shadowOuterX + side * 16 * scale,
      groundY + 24 * scale,
      shadowInnerX,
      groundY + 22 * scale,
      "rgba(36,50,58,.22)"
    );
    if (drawDistinctiveRoadsideModel(landmark, x, frontY, groundY, w, h, scale, side, index)) {
      ctx.restore();
      return;
    }
    const roofOuterFrontX = side < 0 ? x - 8 * scale : x + w + 8 * scale;
    const roofInnerFrontX = side < 0 ? x + w : x;
    drawQuad(
      roofOuterFrontX,
      frontY - 4 * scale,
      roofOuterFrontX + backX,
      frontY + backY - 11 * scale,
      roofInnerFrontX + backX,
      frontY + backY - 11 * scale,
      roofInnerFrontX,
      frontY - 4 * scale,
      "rgba(36,50,58,.16)"
    );
    drawQuad(x, frontY, x + backX, frontY + backY, x + w + backX, frontY + backY, x + w, frontY, topColor);
    drawQuad(x + 7 * scale, frontY + 5 * scale, x + backX + 7 * scale, frontY + backY + 4 * scale, x + w + backX - 7 * scale, frontY + backY + 4 * scale, x + w - 7 * scale, frontY + 5 * scale, "rgba(255,255,255,.28)");
    if (side < 0) {
      drawQuad(x, frontY, x + backX, frontY + backY, x + backX, groundY + backY, x, groundY, sideColor);
      drawSideWindows(x + backX, frontY + backY, depth, h, scale, side, topColor);
    } else {
      drawQuad(x + w, frontY, x + w + backX, frontY + backY, x + w + backX, groundY + backY, x + w, groundY, sideColor);
      drawSideWindows(x + w + backX - depth, frontY + backY, depth, h, scale, side, topColor);
    }
    fillRect(x, frontY, w, h, landmark.color || "#ffffff");
    strokeRect(x, frontY, w, h, COLORS.ink, Math.max(2, 3 * scale));
    drawQuad(
      innerEdgeX,
      frontY + 8 * scale,
      innerEdgeX + roadFaceDepth,
      frontY + backY * 0.38 + 10 * scale,
      innerEdgeX + roadFaceDepth,
      groundY + backY * 0.38,
      innerEdgeX,
      groundY,
      roadFaceColor
    );
    strokePerspectiveLine(innerEdgeX, frontY + 8 * scale, innerEdgeX + roadFaceDepth, frontY + backY * 0.38 + 10 * scale, "rgba(36,50,58,.34)", Math.max(1, 2 * scale));
    strokePerspectiveLine(innerEdgeX, groundY, innerEdgeX + roadFaceDepth, groundY + backY * 0.38, "rgba(36,50,58,.28)", Math.max(1, 2 * scale));
    fillRect(x + 8 * scale, frontY + 10 * scale, w - 16 * scale, 22 * scale, "rgba(255,255,255,.72)");
    for (let i = 0; i < 4; i += 1) {
      const bandX = x + (18 + i * (baseW / 4)) * scale;
      fillRect(bandX, frontY + 44 * scale, Math.max(2, 4 * scale), h - 58 * scale, "rgba(255,255,255,.16)");
    }
    drawRoadsideFeature(landmark, x, frontY, w, h, scale, side);
    drawRoadsideLandmarkSilhouette(landmark, x, frontY, w, h, scale, side);
    drawRoadsideSign(landmark, x, frontY, w, scale);
    const baseOuterX = side < 0 ? x - 12 * scale : x + w + 12 * scale;
    drawQuad(innerEdgeX, groundY - 1 * scale, baseOuterX, groundY - 1 * scale, baseOuterX + side * 12 * scale, groundY + 9 * scale, innerEdgeX, groundY + 9 * scale, "rgba(36,50,58,.16)");
    ctx.restore();
  }

  function drawRoadsideBuildingFooting(x, groundY, w, scale, side, roadEdge, landmark) {
    const innerX = side < 0 ? x + w : x;
    const outerX = side < 0 ? x - 14 * scale : x + w + 14 * scale;
    const edgeX = roadEdge + side * 3 * scale;
    const baseColor = mixColor(landmark.color || "#fff4dc", "#d7e6bf", 0.28);
    ctx.save();
    ctx.globalAlpha *= 0.92;
    drawQuad(
      edgeX,
      groundY - 3 * scale,
      outerX,
      groundY - 3 * scale,
      outerX + side * 22 * scale,
      groundY + 15 * scale,
      edgeX + side * 20 * scale,
      groundY + 15 * scale,
      baseColor
    );
    ctx.globalAlpha *= 0.75;
    drawQuad(
      innerX,
      groundY + 1 * scale,
      outerX + side * 8 * scale,
      groundY + 1 * scale,
      outerX + side * 28 * scale,
      groundY + 20 * scale,
      innerX + side * 8 * scale,
      groundY + 20 * scale,
      "rgba(36,50,58,.18)"
    );
    strokePerspectiveLine(edgeX, groundY - 3 * scale, outerX, groundY - 3 * scale, "rgba(36,50,58,.16)", Math.max(1, 1.5 * scale));
    ctx.restore();
  }

  function drawDistinctiveRoadsideModel(landmark, x, y, groundY, w, h, scale, side, index) {
    const model = landmark.model || landmark.kind;
    const accent = landmark.accent || COLORS.aquaDeep;
    const ink = COLORS.ink;
    const sideShade = side < 0 ? "rgba(80,105,114,.22)" : "rgba(36,50,58,.18)";
    const embeddedSignModels = new Set(["ugoodaysStore", "tainanStation", "shanhuaStation", "nanfangMall", "chihkanTower", "mazuTemple", "confuciusTemple"]);
    const drawBasePlate = () => {
      drawQuad(x + w * 0.08, groundY - 3 * scale, x + w * 0.92, groundY - 3 * scale, x + w * 0.98 + side * 14 * scale, groundY + 11 * scale, x + w * 0.02 + side * 14 * scale, groundY + 11 * scale, "rgba(36,50,58,.16)");
    };
    const drawSmallName = () => {
      if (embeddedSignModels.has(model)) return;
      const tagW = Math.min(w * 0.86, Math.max(72 * scale, landmark.name.length * 12 * scale));
      const tagH = 19 * scale;
      const tagX = x + w / 2 - tagW / 2;
      const tagY = groundY + 3 * scale;
      fillRect(tagX + 3 * scale, tagY + 3 * scale, tagW, tagH, "rgba(36,50,58,.12)");
      fillRect(tagX, tagY, tagW, tagH, "rgba(255,255,255,.9)");
      strokeRect(tagX, tagY, tagW, tagH, accent, Math.max(1, 2 * scale));
      drawText(landmark.name, x + w / 2, tagY + tagH * 0.64, Math.max(8, 12 * scale), accent, "center");
    };
    const drawSideDepth = (left, top, width, height, color = sideShade) => {
      const sideX = side * Math.min(36 * scale, width * 0.22);
      const sideY = -Math.min(24 * scale, height * 0.2);
      if (side < 0) {
        drawQuad(left, top, left + sideX, top + sideY, left + sideX, top + height + sideY, left, top + height, color);
      } else {
        drawQuad(left + width, top, left + width + sideX, top + sideY, left + width + sideX, top + height + sideY, left + width, top + height, color);
      }
    };
    const drawPillar = (px, py, height, color = "#fff8dc") => {
      fillRect(px - 5 * scale, py, 10 * scale, height, color);
      fillRect(px - 8 * scale, py - 3 * scale, 16 * scale, 4 * scale, color);
      fillRect(px - 8 * scale, py + height, 16 * scale, 5 * scale, color);
      strokeRect(px - 5 * scale, py, 10 * scale, height, "rgba(36,50,58,.16)", Math.max(1, 1.5 * scale));
    };
    const drawArcade = (px, py, width, height, color = "#fff1cf") => {
      drawCircle(px + width / 2, py, width / 2, color);
      fillRect(px, py, width, height, color);
      strokeRect(px, py, width, height, "rgba(36,50,58,.16)", Math.max(1, 1.5 * scale));
    };
    const drawLayeredRoof = (cx, top, width, tiers, roofColor) => {
      for (let tier = 0; tier < tiers; tier += 1) {
        const yy = top + tier * 22 * scale;
        const roofW = width - tier * 30 * scale;
        const roofH = (17 + tier * 2) * scale;
        drawQuad(cx - roofW / 2, yy + roofH, cx, yy, cx + roofW / 2, yy + roofH, cx + roofW / 2 - 18 * scale, yy + roofH + 9 * scale, roofColor);
        fillRect(cx - roofW * 0.36, yy + roofH + 10 * scale, roofW * 0.72, 7 * scale, "#f4d16f");
      }
    };
    const drawShopRow = (awningColor, count = 4) => {
      drawBasePlate();
      for (let i = 0; i < count; i += 1) {
        const gap = 5 * scale;
        const shopW = (w - gap * (count + 1)) / count;
        const sx = x + gap + i * (shopW + gap);
        const top = y + (26 + (i % 2) * 6) * scale;
        drawSideDepth(sx, top, shopW, groundY - top, i % 2 ? "rgba(200,95,69,.22)" : "rgba(38,138,161,.16)");
        fillRect(sx, top, shopW, groundY - top, i % 2 ? "#fff4dc" : "#f7fdff");
        drawQuad(sx - 3 * scale, top - 14 * scale, sx + shopW / 2, top - 25 * scale, sx + shopW + 3 * scale, top - 14 * scale, sx + shopW - 4 * scale, top - 4 * scale, i % 2 ? awningColor : accent);
        fillRect(sx + 7 * scale, top + 22 * scale, shopW - 14 * scale, 16 * scale, i % 2 ? "#dff6ff" : "#fff1cf");
        fillRect(sx + shopW * 0.32, groundY - 31 * scale, shopW * 0.36, 31 * scale, "#8fcfe0");
        if (i % 2 === 0) drawCircle(sx + shopW * 0.5, top + 8 * scale, 5 * scale, "#f4d16f");
      }
      drawSmallName();
    };

    ctx.save();
    if (model === "ugoodaysStore") {
      drawBasePlate();
      drawSideDepth(x + 12 * scale, y + 44 * scale, w - 24 * scale, h - 38 * scale, "rgba(127,195,222,.18)");
      fillRect(x + 10 * scale, y + 53 * scale, w - 20 * scale, h - 45 * scale, "#f7fdff");
      drawQuad(x + 6 * scale, y + 8 * scale, x + 22 * scale, y - 8 * scale, x + w - 7 * scale, y - 8 * scale, x + w - 2 * scale, y + 48 * scale, "#ffffff");
      for (let i = 0; i < 17; i += 1) fillRect(x + (18 + i * 11) * scale, y + 11 * scale, 3 * scale, 44 * scale, "rgba(36,50,58,.12)");
      fillRect(x + 13 * scale, y + 56 * scale, w - 26 * scale, 11 * scale, "#8fcfe0");
      fillRect(x + 16 * scale, y + 72 * scale, 72 * scale, 43 * scale, "#5e554d");
      for (let i = 0; i < 6; i += 1) fillRect(x + 20 * scale, y + (79 + i * 6) * scale, 64 * scale, 3 * scale, "#2f2c29");
      strokeRect(x + 98 * scale, y + 74 * scale, 43 * scale, 59 * scale, COLORS.aquaDeep, Math.max(2, 3 * scale));
      fillRect(x + 101 * scale, y + 77 * scale, 37 * scale, 53 * scale, "#eefcff");
      strokeRect(x + 148 * scale, y + 78 * scale, 56 * scale, 52 * scale, COLORS.aqua, Math.max(1, 2 * scale));
      drawCircle(x + 86 * scale, y + 31 * scale, 22 * scale, COLORS.aqua);
      drawCircle(x + 76 * scale, y + 36 * scale, 5 * scale, "#ffffff");
      drawCircle(x + 94 * scale, y + 37 * scale, 5 * scale, "#ffffff");
      fillRect(x + 81 * scale, y + 44 * scale, 18 * scale, 4 * scale, "#ffffff");
      drawText("純粹好食", x + w * 0.66, y + 33 * scale, Math.max(13, 21 * scale), COLORS.aquaDeep, "center");
      drawText("UGOODAYS", x + w * 0.66, y + 49 * scale, Math.max(6, 9 * scale), COLORS.aqua, "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "tainanStation" || model === "shanhuaStation") {
      drawBasePlate();
      const roof = model === "tainanStation" ? "#8f3550" : "#6f9fb0";
      const body = model === "tainanStation" ? "#fff1cf" : "#f7fdff";
      const towerW = (model === "tainanStation" ? 40 : 34) * scale;
      drawSideDepth(x + 10 * scale, y + 42 * scale, w - 20 * scale, h - 38 * scale, "rgba(143,53,80,.18)");
      fillRect(x + 13 * scale, y + 50 * scale, w - 26 * scale, groundY - y - 50 * scale, body);
      drawQuad(x + 7 * scale, y + 39 * scale, x + w * 0.5, y + 17 * scale, x + w - 7 * scale, y + 39 * scale, x + w - 20 * scale, y + 49 * scale, roof);
      fillRect(x + w / 2 - towerW / 2, y + 2 * scale, towerW, 62 * scale, body);
      drawQuad(x + w / 2 - 26 * scale, y + 2 * scale, x + w / 2, y - 20 * scale, x + w / 2 + 26 * scale, y + 2 * scale, x + w / 2 + 16 * scale, y + 10 * scale, roof);
      drawCircle(x + w / 2, y + 28 * scale, 10 * scale, "#ffffff");
      strokeCircle(x + w / 2, y + 28 * scale, 10 * scale, accent, Math.max(1, 2 * scale));
      for (let i = 0; i < 5; i += 1) {
        const archX = x + (20 + i * (w / scale - 40) / 4) * scale;
        drawArcade(archX - 11 * scale, groundY - 36 * scale, 22 * scale, 24 * scale);
      }
      fillRect(x + w / 2 - 19 * scale, groundY - 35 * scale, 38 * scale, 35 * scale, "#8fcfe0");
      drawText(model === "tainanStation" ? "臺南車站" : "善化車站", x + w / 2, y + 76 * scale, Math.max(8, 13 * scale), accent, "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "nanfangMall") {
      drawBasePlate();
      drawSideDepth(x + 10 * scale, y + 42 * scale, w * 0.58, h - 34 * scale, "rgba(130,198,216,.22)");
      fillRect(x + 10 * scale, y + 44 * scale, w * 0.58, h - 42 * scale, "#f7fdff");
      drawQuad(x + w * 0.52, y + 17 * scale, x + w * 0.89, y - 8 * scale, x + w * 0.94, y + 102 * scale, x + w * 0.6, y + 118 * scale, "#bfeef8");
      drawQuad(x + 22 * scale, y + 32 * scale, x + w * 0.54, y + 17 * scale, x + w * 0.58, y + 104 * scale, x + 32 * scale, y + 118 * scale, "rgba(130,198,216,.36)");
      for (let row = 0; row < 3; row += 1) for (let col = 0; col < 4; col += 1) fillRect(x + (28 + col * 28) * scale, y + (58 + row * 24) * scale, 16 * scale, 12 * scale, row % 2 ? "#fff4dc" : "#dff6ff");
      fillRect(x + w * 0.66, y + 17 * scale, 48 * scale, 15 * scale, "#ffffff");
      drawText("南紡", x + w * 0.66 + 24 * scale, y + 28 * scale, Math.max(8, 13 * scale), accent, "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "chihkanTower" || model === "mazuTemple" || model === "confuciusTemple") {
      drawBasePlate();
      const roof = model === "mazuTemple" ? "#d8243c" : model === "confuciusTemple" ? "#8f3550" : "#b44966";
      const body = model === "confuciusTemple" ? "#b44966" : "#fff1cf";
      fillRect(x + 18 * scale, y + 54 * scale, w - 36 * scale, groundY - y - 54 * scale, body);
      drawLayeredRoof(x + w / 2, y - 5 * scale, w * 0.98, model === "chihkanTower" ? 3 : 2, roof);
      for (let i = 0; i < 4; i += 1) {
        const px = x + (34 + i * (w / scale - 68) / 3) * scale;
        drawPillar(px, y + 72 * scale, groundY - y - 76 * scale, model === "confuciusTemple" ? "#f4d16f" : "#a85d3b");
      }
      if (model === "chihkanTower") drawBrickPattern(x + 24 * scale, y + 60 * scale, w - 48 * scale, 42 * scale, "#d7a66e");
      drawText(model === "chihkanTower" ? "赤崁樓" : model === "mazuTemple" ? "大天后宮" : "台南孔廟", x + w / 2, y + 48 * scale, Math.max(8, 13 * scale), model === "confuciusTemple" ? "#fff1cf" : roof, "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "chimeiMuseum" || model === "judicialMuseum" || model === "tainanArtMuseum") {
      drawBasePlate();
      if (model === "tainanArtMuseum") {
        drawQuad(x + 10 * scale, y + 52 * scale, x + w * 0.62, y + 18 * scale, x + w - 6 * scale, y + 52 * scale, x + w - 22 * scale, groundY, "#f3f5f0");
        drawQuad(x + 36 * scale, y + 72 * scale, x + w * 0.64, y + 38 * scale, x + w - 28 * scale, y + 78 * scale, x + w - 44 * scale, groundY - 10 * scale, "#d9c3a7");
        strokePerspectiveLine(x + 18 * scale, y + 58 * scale, x + w - 18 * scale, y + 58 * scale, accent, Math.max(1, 2 * scale));
      } else {
        const domeY = y + 22 * scale;
        fillRect(x + 14 * scale, y + 58 * scale, w - 28 * scale, groundY - y - 58 * scale, model === "judicialMuseum" ? "#e7c0a7" : "#f7fdff");
        drawCircle(x + w / 2, domeY, 31 * scale, "#ffffff");
        fillRect(x + w / 2 - 36 * scale, domeY, 72 * scale, 30 * scale, "#ffffff");
        if (model === "judicialMuseum") drawBrickPattern(x + 18 * scale, y + 62 * scale, w - 36 * scale, groundY - y - 68 * scale, "#8f4d3c");
        for (let i = 0; i < 6; i += 1) drawPillar(x + (32 + i * (w / scale - 64) / 5) * scale, y + 72 * scale, groundY - y - 76 * scale, "#eef5f8");
      }
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "anpingFort" || model === "eternalCastle" || model === "anpingBattery") {
      drawBasePlate();
      const brickColor = model === "eternalCastle" ? "#b55f44" : "#c57563";
      fillRect(x + 10 * scale, y + 62 * scale, w - 20 * scale, groundY - y - 62 * scale, brickColor);
      drawBrickPattern(x + 10 * scale, y + 62 * scale, w - 20 * scale, groundY - y - 64 * scale, "#6e3b32");
      for (let i = 0; i < 5; i += 1) fillRect(x + (12 + i * (w / scale - 24) / 4) * scale, y + 49 * scale, 16 * scale, 18 * scale, brickColor);
      if (model === "anpingFort") {
        fillRect(x + w * 0.42, y + 5 * scale, 44 * scale, 65 * scale, "#fff1cf");
        fillRect(x + w * 0.42 - 6 * scale, y - 6 * scale, 56 * scale, 10 * scale, "#b44966");
      } else if (model === "eternalCastle") {
        fillRect(x + 14 * scale, y + 36 * scale, 42 * scale, 34 * scale, "#a74d3c");
        fillRect(x + w - 56 * scale, y + 36 * scale, 42 * scale, 34 * scale, "#a74d3c");
        fillRect(x + w * 0.62, y + 54 * scale, 38 * scale, 9 * scale, "#3d4b53");
        fillRect(x + w * 0.81, y + 56 * scale, 24 * scale, 5 * scale, "#3d4b53");
      }
      fillRect(x + w * 0.42, groundY - 34 * scale, w * 0.16, 34 * scale, "#7b3f35");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "bigFish") {
      drawBasePlate();
      drawFishSculpture(x + w / 2, y + h * 0.5, 1.02 * scale, accent);
      fillRect(x + 18 * scale, groundY - 16 * scale, w - 36 * scale, 8 * scale, "#9ccfd8");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "helePlaza" || model === "yuguangIsland") {
      drawBasePlate();
      if (model === "helePlaza") {
        for (let i = 0; i < 5; i += 1) fillRect(x + (12 + i * 12) * scale, groundY - (22 + i * 13) * scale, w - (24 + i * 24) * scale, 12 * scale, i % 2 ? "#ffffff" : "#dff6ff");
        fillRect(x + 42 * scale, groundY - 28 * scale, w - 84 * scale, 16 * scale, "#8fcfe0");
      } else {
        fillRect(x + 6 * scale, groundY - 31 * scale, w - 12 * scale, 28 * scale, "#f7e2bd");
        fillRect(x + 22 * scale, groundY - 42 * scale, w - 44 * scale, 12 * scale, COLORS.aqua);
        drawCircle(x + w * 0.72, groundY - 62 * scale, 24 * scale, COLORS.yellow);
      }
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "sicaoTunnel" || model === "anpingTreeHouse") {
      drawBasePlate();
      fillRect(x + 5 * scale, groundY - 30 * scale, w - 10 * scale, 26 * scale, model === "sicaoTunnel" ? "#8fcfe0" : "#d8c1a2");
      const road = getRoadMetrics();
      for (let i = 0; i < 5; i += 1) {
        const t = i / 4;
        const yy = groundY - 10 * scale - t * 92 * scale;
        const depth = roadDepthAtY(yy);
        const edge = road.centerX + side * roadWidthAtDepth(depth) * 0.5;
        const tx = edge + side * (24 + t * 5) * scale;
        const treeScale = scale * (1.05 - t * 0.22);
        fillRect(tx - 5 * treeScale, yy - 62 * treeScale, 10 * treeScale, 66 * treeScale, "#5f7a45");
        strokePerspectiveLine(tx, yy - 8 * treeScale, tx + side * 15 * treeScale, yy + 12 * treeScale, "#8b6b4e", Math.max(1, 3 * treeScale));
        drawCircle(tx - side * 4 * treeScale, yy - 74 * treeScale, 22 * treeScale, i % 2 ? "#76b96c" : "#4a9f72");
        drawCircle(tx + side * 10 * treeScale, yy - 86 * treeScale, 19 * treeScale, "#8ac277");
      }
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "hayashi" || model === "taitMerchant" || model === "governorResidence") {
      drawBasePlate();
      const body = model === "hayashi" ? "#e9e1cf" : model === "taitMerchant" ? "#f5f0df" : "#f3e6c4";
      fillRect(x + 16 * scale, y + 42 * scale, w - 32 * scale, groundY - y - 42 * scale, body);
      drawQuad(x + 8 * scale, y + 32 * scale, x + w / 2, y + 14 * scale, x + w - 8 * scale, y + 32 * scale, x + w - 24 * scale, y + 44 * scale, model === "governorResidence" ? "#4a5b62" : "#8f5f42");
      if (model === "hayashi") {
        fillRect(x + w * 0.58, y + 2 * scale, 32 * scale, 48 * scale, "#c8945e");
        fillRect(x + w * 0.58 + 7 * scale, y - 12 * scale, 18 * scale, 14 * scale, "#8a9aa1");
      }
      for (let i = 0; i < 4; i += 1) drawArcade(x + (25 + i * 30) * scale, groundY - 38 * scale, 20 * scale, 25 * scale);
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "blueprintPark") {
      drawBasePlate();
      fillRect(x + 10 * scale, y + 36 * scale, w - 20 * scale, groundY - y - 39 * scale, "#4b91b6");
      strokeRect(x + 28 * scale, y + 50 * scale, w - 56 * scale, 46 * scale, "#ffffff", Math.max(1, 2 * scale));
      strokePerspectiveLine(x + 36 * scale, y + 84 * scale, x + w - 42 * scale, y + 60 * scale, "#ffffff", Math.max(1, 2 * scale));
      strokePerspectiveLine(x + 46 * scale, y + 54 * scale, x + 46 * scale, y + 98 * scale, "#ffffff", Math.max(1, 2 * scale));
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "tenDrum") {
      drawBasePlate();
      drawBrickPattern(x + 10 * scale, y + 45 * scale, w * 0.62, groundY - y - 48 * scale, "#9b5844");
      fillRect(x + w * 0.68, y - 20 * scale, 24 * scale, groundY - y - 18 * scale, "#9b5844");
      fillRect(x + w * 0.68 - 5 * scale, y - 29 * scale, 34 * scale, 9 * scale, "#6e3b32");
      for (let i = 0; i < 3; i += 1) {
        const drumX = x + (30 + i * 40) * scale;
        drawCircle(drumX, groundY - 38 * scale, 19 * scale, "#d99b72");
        strokeCircle(drumX, groundY - 38 * scale, 19 * scale, "#6e3b32", Math.max(1, 2 * scale));
      }
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "guanzilingHotSpring") {
      drawBasePlate();
      drawQuad(x + 18 * scale, y + 50 * scale, x + w / 2, y + 18 * scale, x + w - 18 * scale, y + 50 * scale, x + w - 32 * scale, y + 62 * scale, "#7aa9b6");
      fillRect(x + 26 * scale, y + 62 * scale, w - 52 * scale, groundY - y - 62 * scale, "#f3e6c4");
      for (let i = 0; i < 3; i += 1) {
        const sx = x + (48 + i * 36) * scale;
        strokeCircle(sx, y + 34 * scale - i * 5 * scale, 10 * scale, "rgba(255,255,255,.72)", Math.max(1, 2 * scale));
        strokePerspectiveLine(sx, y + 48 * scale, sx + 8 * scale, y + 28 * scale, "rgba(255,255,255,.7)", Math.max(1, 2 * scale));
      }
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "koxingaShrine") {
      drawBasePlate();
      fillRect(x + 18 * scale, y + 55 * scale, w - 36 * scale, groundY - y - 55 * scale, "#f6ddc3");
      drawQuad(x + 5 * scale, y + 48 * scale, x + w / 2, y + 18 * scale, x + w - 5 * scale, y + 48 * scale, x + w - 24 * scale, y + 60 * scale, "#b84238");
      drawQuad(x + 38 * scale, y + 28 * scale, x + w / 2, y + 6 * scale, x + w - 38 * scale, y + 28 * scale, x + w - 52 * scale, y + 38 * scale, "#d85a47");
      fillRect(x + 30 * scale, groundY - 44 * scale, w - 60 * scale, 14 * scale, "#f4d16f");
      for (let i = 0; i < 5; i += 1) drawPillar(x + (35 + i * 27) * scale, groundY - 72 * scale, 58 * scale, "#fff1cf");
      fillRect(x + w / 2 - 18 * scale, groundY - 43 * scale, 36 * scale, 43 * scale, "#8f3550");
      drawText("郡王祠", x + w / 2, y + 79 * scale, Math.max(8, 13 * scale), "#8f3550", "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "wuGarden") {
      drawBasePlate();
      fillRect(x + 8 * scale, groundY - 34 * scale, w - 16 * scale, 28 * scale, "#cde8dc");
      strokePerspectiveLine(x + 18 * scale, groundY - 33 * scale, x + w - 18 * scale, groundY - 33 * scale, "#7fc3de", Math.max(2, 3 * scale));
      drawQuad(x + 38 * scale, y + 45 * scale, x + w / 2, y + 20 * scale, x + w - 38 * scale, y + 45 * scale, x + w - 53 * scale, y + 55 * scale, "#8f5f42");
      fillRect(x + 50 * scale, y + 55 * scale, w - 100 * scale, groundY - y - 56 * scale, "#fff1cf");
      for (let i = 0; i < 3; i += 1) drawPillar(x + (66 + i * 23) * scale, y + 60 * scale, groundY - y - 62 * scale, "#f7fdff");
      for (let i = 0; i < 4; i += 1) drawCircle(x + (22 + i * 40) * scale, groundY - (24 + i % 2 * 10) * scale, 16 * scale, i % 2 ? "#89b381" : "#65a85f");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "westMarket") {
      drawBasePlate();
      fillRect(x + 12 * scale, y + 48 * scale, w - 24 * scale, groundY - y - 48 * scale, "#f1d2bd");
      drawQuad(x + 10 * scale, y + 42 * scale, x + w / 2, y + 15 * scale, x + w - 10 * scale, y + 42 * scale, x + w - 27 * scale, y + 53 * scale, "#934b42");
      drawCircle(x + w / 2, y + 71 * scale, 34 * scale, "#fff4dc");
      fillRect(x + w / 2 - 35 * scale, y + 72 * scale, 70 * scale, groundY - y - 72 * scale, "#fff4dc");
      strokeCircle(x + w / 2, y + 71 * scale, 34 * scale, "#b44966", Math.max(2, 3 * scale));
      for (let i = 0; i < 4; i += 1) fillRect(x + (24 + i * 34) * scale, groundY - 42 * scale, 18 * scale, 33 * scale, i % 2 ? "#dff6ff" : "#fff1cf");
      drawText("西市場", x + w / 2, y + 55 * scale, Math.max(8, 13 * scale), "#b44966", "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "haiAnArtStreet") {
      drawBasePlate();
      fillRect(x + 10 * scale, y + 42 * scale, w - 20 * scale, groundY - y - 42 * scale, "#f7fdff");
      drawQuad(x + 8 * scale, y + 35 * scale, x + w * 0.5, y + 20 * scale, x + w - 8 * scale, y + 35 * scale, x + w - 20 * scale, y + 47 * scale, "#7d5ba6");
      const murals = ["#7fc3de", "#f19aa0", "#f4d16f", "#65a85f", "#ef8b53"];
      for (let i = 0; i < 5; i += 1) {
        const mx = x + (18 + i * 30) * scale;
        fillRect(mx, y + (57 + i % 2 * 8) * scale, 24 * scale, 36 * scale, murals[i]);
        strokeRect(mx, y + (57 + i % 2 * 8) * scale, 24 * scale, 36 * scale, "#ffffff", Math.max(1, 2 * scale));
      }
      strokePerspectiveLine(x + 24 * scale, groundY - 24 * scale, x + w - 26 * scale, y + 55 * scale, "#ffffff", Math.max(1, 2 * scale));
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "taijiangPark") {
      drawBasePlate();
      fillRect(x + 8 * scale, groundY - 30 * scale, w - 16 * scale, 24 * scale, "#b9dccd");
      fillRect(x + 24 * scale, y + 58 * scale, w - 48 * scale, groundY - y - 58 * scale, "#f7fdff");
      drawQuad(x + 18 * scale, y + 45 * scale, x + w * 0.55, y + 20 * scale, x + w - 10 * scale, y + 45 * scale, x + w - 32 * scale, y + 57 * scale, "#4a9f72");
      for (let i = 0; i < 6; i += 1) {
        const rx = x + (18 + i * 24) * scale;
        fillRect(rx, groundY - 50 * scale, 4 * scale, 42 * scale, "#7b6f44");
        drawCircle(rx + 7 * scale, groundY - 62 * scale, 10 * scale, i % 2 ? "#65a85f" : "#89b381");
      }
      for (let i = 0; i < 3; i += 1) {
        const bx = x + (52 + i * 36) * scale;
        drawQuad(bx, y + 38 * scale, bx + 12 * scale, y + 31 * scale, bx + 23 * scale, y + 38 * scale, bx + 12 * scale, y + 35 * scale, "#ffffff");
      }
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "yuejinHarbor") {
      drawBasePlate();
      fillRect(x + 6 * scale, groundY - 36 * scale, w - 12 * scale, 30 * scale, "#bfeef8");
      strokePerspectiveLine(x + 14 * scale, groundY - 29 * scale, x + w - 14 * scale, groundY - 29 * scale, "#7fc3de", Math.max(2, 3 * scale));
      for (let i = 0; i < 5; i += 1) {
        const lx = x + (24 + i * 31) * scale;
        fillRect(lx - 2 * scale, groundY - 78 * scale, 4 * scale, 55 * scale, "#8f5f42");
        drawCircle(lx, groundY - 84 * scale, 11 * scale, i % 2 ? "#f4d16f" : "#f19aa0");
        fillRect(lx - 7 * scale, groundY - 84 * scale, 14 * scale, 5 * scale, "#ffffff");
      }
      drawQuad(x + 22 * scale, groundY - 42 * scale, x + w / 2, groundY - 62 * scale, x + w - 22 * scale, groundY - 42 * scale, x + w - 36 * scale, groundY - 36 * scale, "#fff4dc");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "tainanLibrary") {
      drawBasePlate();
      drawSideDepth(x + 20 * scale, y + 28 * scale, w - 40 * scale, groundY - y - 28 * scale, "rgba(80,105,114,.16)");
      fillRect(x + 20 * scale, y + 28 * scale, w - 40 * scale, groundY - y - 28 * scale, "#eef4f4");
      for (let i = 0; i < 8; i += 1) fillRect(x + (30 + i * 14) * scale, y + 34 * scale, 5 * scale, groundY - y - 42 * scale, i % 2 ? "#cbd6d6" : "#ffffff");
      drawQuad(x + 7 * scale, y + 20 * scale, x + w - 7 * scale, y + 20 * scale, x + w - 26 * scale, y + 37 * scale, x + 24 * scale, y + 37 * scale, "#8a9aa1");
      fillRect(x + 40 * scale, y + 72 * scale, w - 80 * scale, 22 * scale, "#dff6ff");
      drawText("市圖", x + w / 2, y + 90 * scale, Math.max(10, 15 * scale), "#4b5960", "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "waterworksMuseum") {
      drawBasePlate();
      drawBrickPattern(x + 14 * scale, y + 58 * scale, w - 28 * scale, groundY - y - 58 * scale, "#9b5844");
      fillRect(x + w * 0.62, y - 8 * scale, 34 * scale, groundY - y - 8 * scale, "#9b5844");
      drawCircle(x + w * 0.62 + 17 * scale, y - 16 * scale, 23 * scale, "#d99b72");
      strokeCircle(x + w * 0.62 + 17 * scale, y - 16 * scale, 23 * scale, "#6e3b32", Math.max(2, 3 * scale));
      for (let i = 0; i < 4; i += 1) drawArcade(x + (26 + i * 28) * scale, groundY - 44 * scale, 20 * scale, 30 * scale, "#fff1cf");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "qiguSaltMountain") {
      drawBasePlate();
      fillRect(x + 10 * scale, groundY - 28 * scale, w - 20 * scale, 22 * scale, "#dff6ff");
      for (let i = 0; i < 4; i += 1) {
        const mx = x + (20 + i * 34) * scale;
        drawQuad(mx - 28 * scale, groundY - 26 * scale, mx, groundY - (76 + i % 2 * 13) * scale, mx + 31 * scale, groundY - 26 * scale, mx + 22 * scale, groundY - 13 * scale, "#ffffff");
        strokePerspectiveLine(mx - 20 * scale, groundY - 26 * scale, mx, groundY - (66 + i % 2 * 12) * scale, "rgba(127,195,222,.42)", Math.max(1, 2 * scale));
      }
      drawCircle(x + w * 0.72, groundY - 86 * scale, 17 * scale, "#f4d16f");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "taiwanHistoryMuseum") {
      drawBasePlate();
      drawSideDepth(x + 14 * scale, y + 40 * scale, w - 28 * scale, groundY - y - 40 * scale, "rgba(80,105,114,.18)");
      fillRect(x + 18 * scale, y + 48 * scale, w - 36 * scale, groundY - y - 48 * scale, "#e8f0ee");
      drawQuad(x + 10 * scale, y + 40 * scale, x + w * 0.34, y + 15 * scale, x + w - 12 * scale, y + 30 * scale, x + w - 28 * scale, y + 52 * scale, "#8a9aa1");
      drawQuad(x + 28 * scale, y + 58 * scale, x + w * 0.44, y + 43 * scale, x + w - 30 * scale, y + 55 * scale, x + w - 48 * scale, groundY - 18 * scale, "rgba(127,195,222,.42)");
      for (let i = 0; i < 5; i += 1) {
        const px = x + (34 + i * 28) * scale;
        fillRect(px, y + 76 * scale, 15 * scale, 28 * scale, i % 2 ? "#fff4dc" : "#dff6ff");
      }
      fillRect(x + 44 * scale, groundY - 38 * scale, w - 88 * scale, 18 * scale, "#ffffff");
      drawText("臺史博", x + w / 2, groundY - 24 * scale, Math.max(8, 13 * scale), accent, "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "beimenCrystalChurch") {
      drawBasePlate();
      fillRect(x + 8 * scale, groundY - 30 * scale, w - 16 * scale, 24 * scale, "#bfeef8");
      drawQuad(x + w * 0.18, groundY - 24 * scale, x + w * 0.5, y + 2 * scale, x + w * 0.82, groundY - 24 * scale, x + w * 0.7, groundY - 8 * scale, "#ffffff");
      drawQuad(x + w * 0.25, groundY - 28 * scale, x + w * 0.5, y + 20 * scale, x + w * 0.75, groundY - 28 * scale, x + w * 0.63, groundY - 12 * scale, "rgba(191,238,248,.74)");
      strokePerspectiveLine(x + w * 0.5, y + 4 * scale, x + w * 0.5, groundY - 20 * scale, accent, Math.max(2, 3 * scale));
      strokePerspectiveLine(x + w * 0.31, groundY - 31 * scale, x + w * 0.5, y + 4 * scale, accent, Math.max(2, 3 * scale));
      strokePerspectiveLine(x + w * 0.69, groundY - 31 * scale, x + w * 0.5, y + 4 * scale, accent, Math.max(2, 3 * scale));
      for (let i = 0; i < 4; i += 1) drawCircle(x + (20 + i * 38) * scale, groundY - 14 * scale, 5 * scale, "#ffffff");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "jingzaijiaoSaltFields") {
      drawBasePlate();
      fillRect(x + 6 * scale, groundY - 52 * scale, w - 12 * scale, 44 * scale, "#bfeef8");
      for (let i = 0; i <= 5; i += 1) {
        const gx = x + (12 + i * (w / scale - 24) / 5) * scale;
        strokePerspectiveLine(gx, groundY - 51 * scale, gx - side * 8 * scale, groundY - 9 * scale, "rgba(143,95,66,.42)", Math.max(1, 2 * scale));
      }
      for (let i = 0; i <= 3; i += 1) {
        const gy = groundY - (48 - i * 12) * scale;
        strokePerspectiveLine(x + 8 * scale, gy, x + w - 10 * scale, gy - 3 * scale, "rgba(143,95,66,.42)", Math.max(1, 2 * scale));
      }
      drawQuad(x + 24 * scale, groundY - 54 * scale, x + 45 * scale, groundY - 83 * scale, x + 67 * scale, groundY - 54 * scale, x + 58 * scale, groundY - 43 * scale, "#ffffff");
      drawQuad(x + w - 68 * scale, groundY - 47 * scale, x + w - 49 * scale, groundY - 70 * scale, x + w - 27 * scale, groundY - 47 * scale, x + w - 36 * scale, groundY - 37 * scale, "#ffffff");
      drawCircle(x + w * 0.78, y + 24 * scale, 18 * scale, "#f4d16f");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "madouDaitianTemple") {
      drawBasePlate();
      fillRect(x + 14 * scale, y + 58 * scale, w - 28 * scale, groundY - y - 58 * scale, "#f5d4b2");
      drawLayeredRoof(x + w / 2, y - 6 * scale, w * 1.03, 3, "#d8243c");
      drawQuad(x + 8 * scale, y + 63 * scale, x + w / 2, y + 33 * scale, x + w - 8 * scale, y + 63 * scale, x + w - 30 * scale, y + 75 * scale, "#b44966");
      for (let i = 0; i < 6; i += 1) drawPillar(x + (28 + i * (w / scale - 56) / 5) * scale, groundY - 64 * scale, 56 * scale, i % 2 ? "#d8243c" : "#fff1cf");
      drawCircle(x + 34 * scale, y + 45 * scale, 10 * scale, "#f4d16f");
      drawCircle(x + w - 34 * scale, y + 45 * scale, 10 * scale, "#f4d16f");
      fillRect(x + w / 2 - 20 * scale, groundY - 42 * scale, 40 * scale, 42 * scale, "#8f3550");
      drawText("代天府", x + w / 2, y + 56 * scale, Math.max(8, 13 * scale), "#fff1cf", "center");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "hutoupi") {
      drawBasePlate();
      fillRect(x + 8 * scale, groundY - 38 * scale, w - 16 * scale, 30 * scale, "#8fcfe0");
      strokePerspectiveLine(x + 18 * scale, groundY - 29 * scale, x + w - 20 * scale, groundY - 32 * scale, "#dff6ff", Math.max(2, 3 * scale));
      drawCircle(x + 34 * scale, groundY - 55 * scale, 24 * scale, "#65a85f");
      drawCircle(x + 58 * scale, groundY - 64 * scale, 27 * scale, "#89b381");
      drawCircle(x + w - 44 * scale, groundY - 60 * scale, 26 * scale, "#4a9f72");
      drawQuad(x + 72 * scale, groundY - 38 * scale, x + w * 0.5, groundY - 62 * scale, x + w - 72 * scale, groundY - 38 * scale, x + w - 82 * scale, groundY - 30 * scale, "#fff4dc");
      strokePerspectiveLine(x + 82 * scale, groundY - 39 * scale, x + w - 82 * scale, groundY - 39 * scale, "#8f5f42", Math.max(2, 3 * scale));
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "soulanghCulturalPark") {
      drawBasePlate();
      fillRect(x + 10 * scale, y + 58 * scale, w - 20 * scale, groundY - y - 58 * scale, "#e8d0b8");
      drawBrickPattern(x + 10 * scale, y + 58 * scale, w - 20 * scale, groundY - y - 60 * scale, "#9b5844");
      for (let i = 0; i < 4; i += 1) {
        const sx = x + (12 + i * (w / scale - 24) / 4) * scale;
        drawQuad(sx, y + 55 * scale, sx + 20 * scale, y + 34 * scale, sx + 42 * scale, y + 55 * scale, sx + 32 * scale, y + 64 * scale, i % 2 ? "#a85f4f" : "#c57563");
      }
      fillRect(x + w * 0.68, y + 19 * scale, 24 * scale, groundY - y - 19 * scale, "#9b5844");
      fillRect(x + w * 0.68 - 5 * scale, y + 10 * scale, 34 * scale, 9 * scale, "#6e3b32");
      for (let i = 0; i < 4; i += 1) drawArcade(x + (25 + i * 34) * scale, groundY - 43 * scale, 22 * scale, 29 * scale, "#fff1cf");
      drawSmallName();
      ctx.restore();
      return true;
    }

    if (model === "baoAnRoad") {
      drawShopRow("#d48c32", 4);
      ctx.restore();
      return true;
    }

    if (model === "shuixianMarket" || model === "guohuaStreet" || model === "funongStreet" || model === "shennongStreet" || model === "gardenNightMarket" || model === "xinhuaOldStreet" || model === "anpingOldStreet") {
      const awning = model === "gardenNightMarket" ? "#d8484f" : model === "funongStreet" ? "#c85f45" : model === "shennongStreet" ? "#8f5f42" : model === "xinhuaOldStreet" ? "#934b42" : "#ef8b53";
      drawShopRow(awning, model === "gardenNightMarket" ? 5 : 4);
      ctx.restore();
      return true;
    }

    ctx.restore();
    return false;
  }

  function drawSideWindows(x, y, depth, h, scale, side, color) {
    ctx.save();
    ctx.globalAlpha *= 0.78;
    for (let i = 0; i < 3; i += 1) {
      const wx = x + side * (10 + i * 8) * scale;
      const wy = y + (32 + i * 18) * scale;
      drawQuad(wx, wy, wx + side * 13 * scale, wy - 3 * scale, wx + side * 13 * scale, wy + 14 * scale, wx, wy + 17 * scale, "rgba(255,255,255,.58)");
      drawQuad(wx + side * 2 * scale, wy + 2 * scale, wx + side * 10 * scale, wy, wx + side * 10 * scale, wy + 11 * scale, wx + side * 2 * scale, wy + 13 * scale, color);
    }
    ctx.globalAlpha *= 0.72;
    for (let yLine = y + 20 * scale; yLine < y + h - 14 * scale; yLine += 22 * scale) {
      strokePerspectiveLine(x, yLine, x + side * Math.min(depth * 0.72, 34 * scale), yLine - 5 * scale, "rgba(36,50,58,.13)", Math.max(1, 1.5 * scale));
    }
    ctx.restore();
  }

  function drawRoadsideSign(landmark, x, y, w, scale) {
    const signX = x + 8 * scale;
    const signY = y + 7 * scale;
    const signW = w - 16 * scale;
    const signH = 30 * scale;
    const fontSize = clamp(signW / Math.max(5.7, landmark.name.length * 1.22), 10, 17 * scale);
    fillRect(signX + 4 * scale, signY + 5 * scale, signW, signH, "rgba(36,50,58,.14)");
    fillRect(signX, signY, signW, signH, "rgba(255,255,255,.94)");
    strokeRect(signX, signY, signW, signH, landmark.accent || COLORS.aquaDeep, Math.max(2, 3 * scale));
    drawText(landmark.name, x + w / 2, signY + signH * 0.68, fontSize, landmark.accent || COLORS.aquaDeep, "center");
  }

  function drawRoadsideLandmarkSilhouette(landmark, x, y, w, h, scale, side) {
    const model = landmark.model || landmark.kind;
    const accent = landmark.accent || COLORS.aquaDeep;
    const shade = "rgba(36,50,58,.28)";

    if (model === "ugoodaysStore") {
      drawQuad(x + 10 * scale, y - 16 * scale, x + w - 18 * scale, y - 24 * scale, x + w - 4 * scale, y + 6 * scale, x + 22 * scale, y + 10 * scale, "#ffffff");
      strokePerspectiveLine(x + 18 * scale, y + 4 * scale, x + w - 8 * scale, y - 4 * scale, COLORS.aquaDeep, Math.max(2, 3 * scale));
      drawCircle(x + 72 * scale, y - 1 * scale, 23 * scale, COLORS.aqua);
      drawCircle(x + 62 * scale, y + 6 * scale, 5 * scale, "#ffffff");
      drawCircle(x + 83 * scale, y + 7 * scale, 5 * scale, "#ffffff");
      fillRect(x + 67 * scale, y + 15 * scale, 20 * scale, 4 * scale, "#ffffff");
      drawText("UGOODAYS", x + w * 0.62, y + 7 * scale, Math.max(7, 10 * scale), COLORS.aquaDeep, "center");
      return;
    }

    if (model === "tainanStation" || model === "shanhuaStation") {
      const towerX = x + w * 0.5;
      fillRect(towerX - 18 * scale, y - 46 * scale, 36 * scale, 50 * scale, "#fff4dc");
      drawQuad(towerX - 25 * scale, y - 46 * scale, towerX, y - 64 * scale, towerX + 25 * scale, y - 46 * scale, towerX + 18 * scale, y - 38 * scale, "#8f3550");
      drawCircle(towerX, y - 25 * scale, 10 * scale, "#ffffff");
      strokeCircle(towerX, y - 25 * scale, 10 * scale, accent, Math.max(1, 2 * scale));
      for (let i = 0; i < 5; i += 1) {
        const archX = x + (18 + i * (w / scale - 36) / 4) * scale;
        drawCircle(archX, y + h - 39 * scale, 10 * scale, "#f8ead0");
        fillRect(archX - 10 * scale, y + h - 39 * scale, 20 * scale, 24 * scale, "#f8ead0");
      }
      return;
    }

    if (model === "nanfangMall") {
      drawQuad(x + w * 0.58, y - 32 * scale, x + w * 0.9, y - 44 * scale, x + w * 0.92, y + 74 * scale, x + w * 0.62, y + 82 * scale, "#bfeef8");
      strokePerspectiveLine(x + w * 0.6, y - 23 * scale, x + w * 0.9, y - 34 * scale, accent, Math.max(2, 3 * scale));
      for (let i = 0; i < 5; i += 1) fillRect(x + w * 0.65, y + (i * 20 - 12) * scale, w * 0.2, 7 * scale, "rgba(255,255,255,.56)");
      drawQuad(x + 15 * scale, y + 35 * scale, x + w * 0.53, y + 18 * scale, x + w * 0.57, y + 111 * scale, x + 28 * scale, y + 125 * scale, "rgba(130,198,216,.30)");
      return;
    }

    if (model === "chihkanTower" || model === "mazuTemple") {
      const roofColor = model === "mazuTemple" ? "#d8243c" : "#8f3550";
      for (let tier = 0; tier < 3; tier += 1) {
        const yy = y + (18 + tier * 24) * scale;
        const inset = (tier * 16 + 3) * scale;
        drawQuad(x + inset, yy, x + w / 2, yy - (18 + tier * 3) * scale, x + w - inset, yy, x + w - inset - 16 * scale, yy + 10 * scale, roofColor);
        fillRect(x + inset + 22 * scale, yy + 12 * scale, w - inset * 2 - 44 * scale, 7 * scale, "#f4d16f");
      }
      return;
    }

    if (model === "chimeiMuseum" || model === "judicialMuseum") {
      drawCircle(x + w / 2, y + 20 * scale, 28 * scale, "#ffffff");
      fillRect(x + w / 2 - 33 * scale, y + 19 * scale, 66 * scale, 28 * scale, "#ffffff");
      strokePerspectiveLine(x + w / 2 - 27 * scale, y + 19 * scale, x + w / 2 + 27 * scale, y + 19 * scale, shade, Math.max(1, 2 * scale));
      for (let i = 0; i < 6; i += 1) {
        const colX = x + (34 + i * (w / scale - 68) / 5) * scale;
        fillRect(colX - 5 * scale, y + 58 * scale, 10 * scale, 68 * scale, "#eef5f8");
        strokeRect(colX - 5 * scale, y + 58 * scale, 10 * scale, 68 * scale, "rgba(36,50,58,.12)", Math.max(1, 1.5 * scale));
      }
      return;
    }

    if (model === "hayashi") {
      fillRect(x + w * 0.56, y - 28 * scale, 34 * scale, 44 * scale, "#c8945e");
      fillRect(x + w * 0.56 + 7 * scale, y - 39 * scale, 20 * scale, 12 * scale, "#8a9aa1");
      for (let i = 0; i < 4; i += 1) fillRect(x + (24 + i * 28) * scale, y + 47 * scale, 14 * scale, 14 * scale, "#fff6d8");
      return;
    }

    if (model === "sicaoTunnel" || model === "anpingTreeHouse") {
      for (let i = 0; i < 7; i += 1) {
        const tx = x + (14 + i * (w / scale - 28) / 6) * scale;
        fillRect(tx - 4 * scale, y + 18 * scale, 8 * scale, h - 14 * scale, "#5f7a45");
        drawCircle(tx, y + 14 * scale, 24 * scale, i % 2 ? "#76b96c" : "#4a9f72");
      }
      return;
    }

    if (model === "confuciusTemple") {
      fillRect(x + 8 * scale, y + 56 * scale, w - 16 * scale, 38 * scale, "#b44966");
      drawQuad(x + 2 * scale, y + 43 * scale, x + w / 2, y + 17 * scale, x + w - 2 * scale, y + 43 * scale, x + w - 22 * scale, y + 54 * scale, "#8f3550");
      drawQuad(x + 34 * scale, y + 26 * scale, x + w / 2, y + 4 * scale, x + w - 34 * scale, y + 26 * scale, x + w - 48 * scale, y + 35 * scale, "#c85f45");
      fillRect(x + 22 * scale, y + 82 * scale, w - 44 * scale, 14 * scale, "#f4d16f");
      return;
    }

    if (model === "blueprintPark") {
      fillRect(x + 12 * scale, y + 31 * scale, w - 24 * scale, 76 * scale, "#4b91b6");
      strokeRect(x + 24 * scale, y + 43 * scale, w - 48 * scale, 42 * scale, "#ffffff", Math.max(1, 2 * scale));
      strokePerspectiveLine(x + 32 * scale, y + 75 * scale, x + w - 42 * scale, y + 52 * scale, "#ffffff", Math.max(1, 2 * scale));
      strokePerspectiveLine(x + 42 * scale, y + 47 * scale, x + 42 * scale, y + 88 * scale, "#ffffff", Math.max(1, 2 * scale));
      fillRect(x + 18 * scale, y + 106 * scale, w - 36 * scale, 9 * scale, "#2f5f8f");
      return;
    }

    if (model === "tenDrum") {
      fillRect(x + w * 0.66, y - 28 * scale, 22 * scale, 105 * scale, "#9b5844");
      fillRect(x + w * 0.66 - 4 * scale, y - 36 * scale, 30 * scale, 8 * scale, "#6e3b32");
      for (let i = 0; i < 3; i += 1) {
        const drumX = x + (28 + i * 38) * scale;
        drawCircle(drumX, y + 70 * scale, 19 * scale, "#d99b72");
        strokeCircle(drumX, y + 70 * scale, 19 * scale, "#6e3b32", Math.max(1, 2 * scale));
      }
      drawBrickPattern(x + 8 * scale, y + 35 * scale, w * 0.62, 72 * scale, "#9b5844");
      return;
    }

    if (model === "guanzilingHotSpring") {
      drawQuad(x + 18 * scale, y + 44 * scale, x + w / 2, y + 18 * scale, x + w - 18 * scale, y + 44 * scale, x + w - 32 * scale, y + 54 * scale, "#7aa9b6");
      fillRect(x + 24 * scale, y + 54 * scale, w - 48 * scale, 56 * scale, "#f3e6c4");
      for (let i = 0; i < 3; i += 1) {
        const sx = x + (44 + i * 34) * scale;
        strokeCircle(sx, y + 24 * scale - i * 5 * scale, 10 * scale, "rgba(255,255,255,.72)", Math.max(1, 2 * scale));
        strokePerspectiveLine(sx, y + 38 * scale, sx + 8 * scale, y + 20 * scale, "rgba(255,255,255,.7)", Math.max(1, 2 * scale));
      }
      return;
    }

    if (model === "xinhuaOldStreet" || model === "anpingOldStreet") {
      const roof = model === "xinhuaOldStreet" ? "#934b42" : "#c85f45";
      for (let i = 0; i < 4; i += 1) {
        const sx = x + (10 + i * 40) * scale;
        drawQuad(sx, y + 34 * scale, sx + 18 * scale, y + 21 * scale, sx + 39 * scale, y + 34 * scale, sx + 31 * scale, y + 43 * scale, roof);
        drawCircle(sx + 19 * scale, y + 72 * scale, 11 * scale, "#fff1cf");
        fillRect(sx + 8 * scale, y + 72 * scale, 22 * scale, 35 * scale, "#fff1cf");
      }
      return;
    }

    if (model === "bigFish") {
      drawFishSculpture(x + w / 2, y + h * 0.45, 1.02 * scale, accent);
      return;
    }
  }

  function drawRoadsideFeature(landmark, x, y, w, h, scale, side) {
    const accent = landmark.accent || COLORS.aquaDeep;
    const doorW = 26 * scale;
    const doorH = 34 * scale;
    const doorX = side < 0 ? x + w - doorW - 18 * scale : x + 18 * scale;
    fillRect(doorX, y + h - doorH, doorW, doorH, "#dceffc");
    strokeRect(doorX, y + h - doorH, doorW, doorH, accent, Math.max(1, 2 * scale));
    fillRect(doorX + doorW * 0.42, y + h - doorH + 4 * scale, 3 * scale, doorH - 8 * scale, accent);

    const model = landmark.model || landmark.kind;
    const glass = "#dff6ff";
    const shade = "rgba(36,50,58,.18)";
    const brick = "#8f4d3c";

    if (model === "ugoodaysStore") {
      fillRect(x + 8 * scale, y + 8 * scale, w - 16 * scale, 48 * scale, "#ffffff");
      fillRect(x + 11 * scale, y + 53 * scale, w - 22 * scale, 8 * scale, "rgba(36,50,58,.16)");
      for (let i = 0; i < 15; i += 1) fillRect(x + (15 + i * 13) * scale, y + 9 * scale, 3 * scale, 47 * scale, "rgba(36,50,58,.13)");
      fillRect(x + 16 * scale, y + 16 * scale, 48 * scale, 24 * scale, "#bfeef8");
      strokeRect(x + 16 * scale, y + 16 * scale, 48 * scale, 24 * scale, "#7fc3de", Math.max(1, 2 * scale));
      drawText("優格", x + 40 * scale, y + 31 * scale, Math.max(8, 13 * scale), "#ffffff", "center");
      drawText("專賣", x + 40 * scale, y + 43 * scale, Math.max(7, 11 * scale), "#ffffff", "center");
      drawCircle(x + 84 * scale, y + 32 * scale, 20 * scale, COLORS.aqua);
      drawCircle(x + 73 * scale, y + 37 * scale, 5 * scale, "#ffffff");
      drawCircle(x + 91 * scale, y + 39 * scale, 5 * scale, "#ffffff");
      fillRect(x + 79 * scale, y + 45 * scale, 18 * scale, 4 * scale, "#ffffff");
      drawText("純粹好食", x + w * 0.66, y + 36 * scale, Math.max(13, 22 * scale), COLORS.aquaDeep, "center");
      drawText("UGOODAYS", x + w * 0.66, y + 50 * scale, Math.max(6, 9 * scale), COLORS.aqua, "center");
      fillRect(x, y + 65 * scale, w, 18 * scale, "#8fcfe0");
      fillRect(x, y + 81 * scale, w, 7 * scale, "#6ab7c9");
      fillRect(x + 15 * scale, y + 92 * scale, 72 * scale, 46 * scale, "#5e554d");
      for (let i = 0; i < 7; i += 1) fillRect(x + 18 * scale, y + (99 + i * 6) * scale, 66 * scale, 3 * scale, "#2f2c29");
      fillRect(x + 96 * scale, y + 85 * scale, 42 * scale, 58 * scale, "#eefcff");
      strokeRect(x + 96 * scale, y + 85 * scale, 42 * scale, 58 * scale, COLORS.aquaDeep, Math.max(2, 3 * scale));
      fillRect(x + 116 * scale, y + 90 * scale, 3 * scale, 47 * scale, COLORS.aquaDeep);
      fillRect(x + 146 * scale, y + 89 * scale, 56 * scale, 54 * scale, "#dff6ff");
      strokeRect(x + 146 * scale, y + 89 * scale, 56 * scale, 54 * scale, COLORS.aqua, Math.max(1, 2 * scale));
      fillRect(x + 153 * scale, y + 95 * scale, 42 * scale, 13 * scale, "#f19aa0");
      drawText("徵求", x + 174 * scale, y + 105 * scale, Math.max(6, 9 * scale), "#ffffff", "center");
      drawCircle(x + 174 * scale, y + 123 * scale, 12 * scale, "#ffffff");
      drawCircle(x + 170 * scale, y + 126 * scale, 3 * scale, COLORS.aqua);
      drawCircle(x + 179 * scale, y + 126 * scale, 3 * scale, COLORS.aqua);
      fillRect(x + 168 * scale, y + 133 * scale, 16 * scale, 3 * scale, COLORS.aqua);
      fillRect(x + 35 * scale, y + 145 * scale, 130 * scale, 5 * scale, "rgba(36,50,58,.22)");
      return;
    }

    if (model === "tainanStation") {
      fillRect(x + 17 * scale, y + 22 * scale, w - 34 * scale, 20 * scale, "#8f3550");
      fillRect(x + 48 * scale, y - 7 * scale, 62 * scale, 31 * scale, "#c85f45");
      fillRect(x + 65 * scale, y - 29 * scale, 29 * scale, 31 * scale, "#fff4dc");
      fillRect(x + 72 * scale, y - 43 * scale, 15 * scale, 15 * scale, "#8f3550");
      drawCircle(x + 79 * scale, y - 17 * scale, 10 * scale, "#f7fdff");
      strokeCircle(x + 79 * scale, y - 17 * scale, 10 * scale, accent, Math.max(1, 2 * scale));
      for (let i = 0; i < 5; i += 1) {
        fillRect(x + (23 + i * 26) * scale, y + 60 * scale, 15 * scale, 24 * scale, glass);
        strokeRect(x + (23 + i * 26) * scale, y + 60 * scale, 15 * scale, 24 * scale, shade, Math.max(1, 2 * scale));
      }
      fillRect(x + 63 * scale, y + 88 * scale, 38 * scale, 36 * scale, "#8fcfe0");
      fillRect(x + 6 * scale, y + 102 * scale, w - 12 * scale, 8 * scale, "#8f3550");
      for (let i = 0; i < 4; i += 1) {
        const ax = x + (20 + i * 32) * scale;
        drawCircle(ax + 9 * scale, y + 91 * scale, 9 * scale, "#f8ead0");
        fillRect(ax, y + 91 * scale, 18 * scale, 22 * scale, "#f8ead0");
      }
      drawText("臺南車站", x + w / 2, y + 50 * scale, Math.max(8, 12 * scale), "#8f3550", "center");
      return;
    }

    if (model === "nanfangMall") {
      fillRect(x + 9 * scale, y + 34 * scale, w - 18 * scale, 70 * scale, "#f7fdff");
      fillRect(x + 14 * scale, y + 18 * scale, 76 * scale, 25 * scale, "#82c6d8");
      fillRect(x + 98 * scale, y - 6 * scale, 58 * scale, 52 * scale, "#bfeef8");
      strokeRect(x + 98 * scale, y - 6 * scale, 58 * scale, 52 * scale, shade, Math.max(1, 2 * scale));
      for (let row = 0; row < 2; row += 1) {
        for (let col = 0; col < 5; col += 1) {
          fillRect(x + (25 + col * 27) * scale, y + (57 + row * 24) * scale, 16 * scale, 14 * scale, col % 2 ? "#fff4dc" : glass);
        }
      }
      fillRect(x + 67 * scale, y + 104 * scale, 48 * scale, 30 * scale, "#86c6d6");
      fillRect(x + 116 * scale, y + 10 * scale, 44 * scale, 14 * scale, "#ffffff");
      drawText("南紡", x + 138 * scale, y + 21 * scale, Math.max(8, 12 * scale), "#82c6d8", "center");
      drawQuad(x + 18 * scale, y + 110 * scale, x + 167 * scale, y + 110 * scale, x + 156 * scale, y + 132 * scale, x + 30 * scale, y + 132 * scale, "rgba(130,198,216,.34)");
      for (let i = 0; i < 4; i += 1) fillRect(x + (32 + i * 32) * scale, y + 115 * scale, 17 * scale, 9 * scale, "#ffffff");
      return;
    }

    if (model === "shanhuaStation") {
      fillRect(x, y + 24 * scale, w, 14 * scale, "#6f9fb0");
      fillRect(x + 21 * scale, y + 2 * scale, w - 42 * scale, 22 * scale, "#dff6ff");
      strokeRect(x + 21 * scale, y + 2 * scale, w - 42 * scale, 22 * scale, shade, Math.max(1, 2 * scale));
      drawText("善化", x + w / 2, y + 15 * scale, Math.max(10, 16 * scale), COLORS.aquaDeep, "center");
      drawCircle(x + w / 2, y + 58 * scale, 13 * scale, "#fff4dc");
      strokeCircle(x + w / 2, y + 58 * scale, 13 * scale, "#6f9fb0", Math.max(1, 2 * scale));
      for (let i = 0; i < 3; i += 1) fillRect(x + (18 + i * 43) * scale, y + 84 * scale, 27 * scale, 20 * scale, glass);
      fillRect(x - 10 * scale, y + 113 * scale, w + 20 * scale, 6 * scale, "#4a5b62");
      fillRect(x + 16 * scale, y + 39 * scale, w - 32 * scale, 9 * scale, "#8cb8c7");
      fillRect(x + 42 * scale, y + 49 * scale, w - 84 * scale, 8 * scale, "#ffffff");
      drawText("SHANHUA", x + w / 2, y + 74 * scale, Math.max(6, 9 * scale), "#6f9fb0", "center");
      return;
    }

    if (model === "chihkanTower") {
      fillRect(x + 10 * scale, y + 41 * scale, w - 20 * scale, 74 * scale, "#fff4dc");
      drawBrickPattern(x + 13 * scale, y + 49 * scale, w - 26 * scale, 66 * scale, brick);
      drawQuad(x, y + 30 * scale, x + w / 2, y + 8 * scale, x + w, y + 30 * scale, x + w - 16 * scale, y + 38 * scale, "#b44966");
      drawQuad(x + 22 * scale, y + 16 * scale, x + w / 2, y - 2 * scale, x + w - 22 * scale, y + 16 * scale, x + w - 35 * scale, y + 24 * scale, "#d97a57");
      drawQuad(x + 45 * scale, y + 3 * scale, x + w / 2, y - 14 * scale, x + w - 45 * scale, y + 3 * scale, x + w - 54 * scale, y + 11 * scale, "#8f3550");
      for (let i = 0; i < 4; i += 1) fillRect(x + (30 + i * 31) * scale, y + 68 * scale, 13 * scale, 47 * scale, "#a85d3b");
      fillRect(x + 25 * scale, y + 95 * scale, w - 50 * scale, 8 * scale, "#b44966");
      for (let i = 0; i < 5; i += 1) fillRect(x + (22 + i * 28) * scale, y + 54 * scale, 12 * scale, 8 * scale, "#fff1cf");
      drawText("赤崁樓", x + w / 2, y + 43 * scale, Math.max(8, 12 * scale), "#fff1cf", "center");
      return;
    }

    if (model === "helePlaza") {
      for (let i = 0; i < 4; i += 1) fillRect(x + (12 + i * 18) * scale, y + (64 - i * 12) * scale, (w / scale - 24 - i * 36) * scale, 12 * scale, i % 2 ? "#ffffff" : "#dff6ff");
      fillRect(x + 36 * scale, y + 76 * scale, w - 72 * scale, 28 * scale, "#8fcfe0");
      fillRect(x + 50 * scale, y + 85 * scale, w - 100 * scale, 10 * scale, "#bfeef8");
      drawCircle(x + 25 * scale, y + 92 * scale, 8 * scale, "rgba(255,255,255,.72)");
      drawCircle(x + w - 25 * scale, y + 73 * scale, 10 * scale, "rgba(255,255,255,.72)");
      return;
    }

    if (model === "bigFish") {
      drawFishSculpture(x + w / 2, y + h * 0.55, 0.82 * scale, accent);
      fillRect(x + 26 * scale, y + h - 20 * scale, w - 52 * scale, 8 * scale, "#9ccfd8");
      return;
    }

    if (model === "anpingFort") {
      fillRect(x + 8 * scale, y + 62 * scale, w - 16 * scale, 52 * scale, "#c57563");
      drawBrickPattern(x + 8 * scale, y + 62 * scale, w - 16 * scale, 52 * scale, brick);
      fillRect(x + 57 * scale, y + 8 * scale, 45 * scale, 60 * scale, "#fff1cf");
      fillRect(x + 52 * scale, y - 2 * scale, 55 * scale, 10 * scale, "#b44966");
      fillRect(x + 68 * scale, y - 18 * scale, 25 * scale, 18 * scale, "#d97a57");
      fillRect(x + 65 * scale, y + 30 * scale, 24 * scale, 11 * scale, glass);
      fillRect(x + 25 * scale, y + 82 * scale, w - 50 * scale, 12 * scale, "#934b42");
      drawText("安平古堡", x + w / 2, y + 107 * scale, Math.max(8, 12 * scale), "#fff1cf", "center");
      return;
    }

    if (model === "eternalCastle") {
      fillRect(x + 22 * scale, y + 42 * scale, w - 44 * scale, 76 * scale, "#b55f44");
      fillRect(x, y + 22 * scale, 44 * scale, 38 * scale, "#a74d3c");
      fillRect(x + w - 44 * scale, y + 22 * scale, 44 * scale, 38 * scale, "#a74d3c");
      drawBrickPattern(x + 4 * scale, y + 26 * scale, w - 8 * scale, 88 * scale, "#6e3b32");
      fillRect(x + 68 * scale, y + 72 * scale, 42 * scale, 46 * scale, "#7b3f35");
      fillRect(x + 119 * scale, y + 58 * scale, 28 * scale, 8 * scale, "#3d4b53");
      fillRect(x + 143 * scale, y + 60 * scale, 20 * scale, 4 * scale, "#3d4b53");
      return;
    }

    if (model === "taitMerchant") {
      fillRect(x + 4 * scale, y + 31 * scale, w - 8 * scale, 18 * scale, "#8f5f42");
      fillRect(x + 21 * scale, y + 12 * scale, w - 42 * scale, 19 * scale, "#c85f45");
      for (let i = 0; i < 4; i += 1) {
        const ax = x + (24 + i * 32) * scale;
        drawCircle(ax + 12 * scale, y + 68 * scale, 13 * scale, "#f1dcc2");
        fillRect(ax, y + 68 * scale, 24 * scale, 45 * scale, "#f1dcc2");
        fillRect(ax + 7 * scale, y + 86 * scale, 10 * scale, 29 * scale, glass);
      }
      return;
    }

    if (model === "judicialMuseum") {
      drawBrickPattern(x + 6 * scale, y + 33 * scale, w - 12 * scale, 86 * scale, "#743a32");
      fillRect(x + 18 * scale, y + 14 * scale, w - 36 * scale, 22 * scale, "#8f3550");
      drawCircle(x + w / 2, y + 13 * scale, 22 * scale, "#f3e0bd");
      fillRect(x + w / 2 - 23 * scale, y + 14 * scale, 46 * scale, 24 * scale, "#f3e0bd");
      for (let i = 0; i < 5; i += 1) {
        const wx = x + (23 + i * 29) * scale;
        drawCircle(wx + 9 * scale, y + 68 * scale, 9 * scale, "#fff1cf");
        fillRect(wx, y + 68 * scale, 18 * scale, 30 * scale, "#fff1cf");
      }
      return;
    }

    if (model === "governorResidence") {
      fillRect(x + 6 * scale, y + 28 * scale, w - 12 * scale, 20 * scale, "#4a5b62");
      fillRect(x + 36 * scale, y + 8 * scale, w - 72 * scale, 22 * scale, "#5e554d");
      fillRect(x + 24 * scale, y + 54 * scale, 22 * scale, 59 * scale, "#d7a66e");
      fillRect(x + w - 46 * scale, y + 54 * scale, 22 * scale, 59 * scale, "#d7a66e");
      for (let i = 0; i < 3; i += 1) fillRect(x + (58 + i * 23) * scale, y + 66 * scale, 14 * scale, 20 * scale, glass);
      return;
    }

    if (model === "shuixianMarket" || model === "guohuaStreet" || model === "funongStreet" || model === "shennongStreet") {
      const awning = model === "shuixianMarket" ? "#2f9b8c" : model === "funongStreet" ? "#c85f45" : model === "shennongStreet" ? "#8f5f42" : "#ef8b53";
      const shopCount = model === "shuixianMarket" ? 2 : 4;
      for (let i = 0; i < shopCount; i += 1) {
        const shopW = (w - 14 * scale) / shopCount;
        const sx = x + 7 * scale + i * shopW;
        fillRect(sx, y + 46 * scale + (i % 2) * 5 * scale, shopW - 4 * scale, 68 * scale, i % 2 ? "#dff6ff" : "#fff4dc");
        fillRect(sx - 2 * scale, y + 34 * scale + (i % 2) * 5 * scale, shopW, 14 * scale, i % 2 ? accent : awning);
        fillRect(sx + 8 * scale, y + 70 * scale, 20 * scale, 14 * scale, "#f7fdff");
        fillRect(sx + 11 * scale, y + 94 * scale, 16 * scale, 20 * scale, "#8fcfe0");
      }
      if (model === "shuixianMarket") {
        for (let i = 0; i < 8; i += 1) fillRect(x + i * 20 * scale, y + 28 * scale, 10 * scale, 18 * scale, i % 2 ? "#f6d27a" : "#2f9b8c");
      } else {
        for (let i = 0; i < 6; i += 1) drawCircle(x + (16 + i * 24) * scale, y + 25 * scale, 6 * scale, i % 2 ? "#f4d16f" : "#d8484f");
      }
      return;
    }

    if (model === "sicaoTunnel") {
      fillRect(x, y + 87 * scale, w, 28 * scale, "#8fcfe0");
      for (let i = 0; i < 7; i += 1) {
        const bx = x + (12 + i * 24) * scale;
        fillRect(bx, y + 22 * scale, 10 * scale, 84 * scale, "#5f7a45");
        drawCircle(bx + 5 * scale, y + 21 * scale, 22 * scale, "rgba(77,138,76,.82)");
        drawCircle(bx + 18 * scale, y + 38 * scale, 18 * scale, "rgba(101,168,95,.68)");
      }
      fillRect(x + 58 * scale, y + 94 * scale, 54 * scale, 10 * scale, "#8b5d3c");
      return;
    }

    if (model === "yuguangIsland") {
      fillRect(x, y + 82 * scale, w, 35 * scale, "#f2d4a8");
      fillRect(x, y + 61 * scale, w, 22 * scale, "#8fcfe0");
      drawCircle(x + 34 * scale, y + 45 * scale, 16 * scale, COLORS.yellow);
      fillRect(x + 111 * scale, y + 10 * scale, 15 * scale, 54 * scale, "#f7fdff");
      fillRect(x + 106 * scale, y + 3 * scale, 25 * scale, 8 * scale, "#d8484f");
      fillRect(x + 112 * scale, y + 31 * scale, 13 * scale, 8 * scale, "#d8484f");
      return;
    }

    if (model === "hayashi") {
      fillRect(x + 14 * scale, y + 37 * scale, w - 28 * scale, 82 * scale, "#e9d8bd");
      fillRect(x + 27 * scale, y + 21 * scale, w - 54 * scale, 18 * scale, "#c8945e");
      fillRect(x + 42 * scale, y + 2 * scale, w - 84 * scale, 28 * scale, "#fff4dc");
      fillRect(x + 54 * scale, y - 16 * scale, w - 108 * scale, 22 * scale, "#c8945e");
      for (let row = 0; row < 3; row += 1) for (let col = 0; col < 3; col += 1) fillRect(x + (30 + col * 28) * scale, y + (60 + row * 22) * scale, 14 * scale, 10 * scale, "#fff6d8");
      fillRect(x + 50 * scale, y + 24 * scale, 12 * scale, 12 * scale, "#8a9aa1");
      fillRect(x + 76 * scale, y + 24 * scale, 12 * scale, 12 * scale, "#8a9aa1");
      drawText("林", x + w / 2, y + 7 * scale, Math.max(10, 16 * scale), "#8a6d50", "center");
      return;
    }

    if (model === "mazuTemple") {
      drawQuad(x, y + 32 * scale, x + w / 2, y + 8 * scale, x + w, y + 32 * scale, x + w - 18 * scale, y + 42 * scale, "#8f3550");
      drawQuad(x + 14 * scale, y + 15 * scale, x + w / 2, y - 3 * scale, x + w - 14 * scale, y + 15 * scale, x + w - 28 * scale, y + 26 * scale, "#d97a57");
      fillRect(x + 16 * scale, y + 45 * scale, w - 32 * scale, 70 * scale, "#ffe3ad");
      fillRect(x + 26 * scale, y + 60 * scale, 21 * scale, 55 * scale, "#a85d3b");
      fillRect(x + w - 47 * scale, y + 60 * scale, 21 * scale, 55 * scale, "#a85d3b");
      drawCircle(x + w / 2, y + 65 * scale, 15 * scale, "#f4d16f");
      return;
    }

    if (model === "chimeiMuseum") {
      drawCircle(x + w / 2, y + 27 * scale, 26 * scale, "#f7fdff");
      fillRect(x + w / 2 - 28 * scale, y + 26 * scale, 56 * scale, 27 * scale, "#f7fdff");
      fillRect(x + 17 * scale, y + 53 * scale, w - 34 * scale, 65 * scale, "#f7fdff");
      for (let i = 0; i < 5; i += 1) fillRect(x + (39 + i * 25) * scale, y + 62 * scale, 11 * scale, 56 * scale, "#e5edf1");
      fillRect(x, y + 114 * scale, w, 8 * scale, "#d9c19a");
      fillRect(x + 12 * scale, y + 104 * scale, w - 24 * scale, 8 * scale, "#ffffff");
      drawText("奇美博物館", x + w / 2, y + 50 * scale, Math.max(8, 12 * scale), "#7aa9b6", "center");
      return;
    }

    if (model === "tainanArtMuseum") {
      fillRect(x + 10 * scale, y + 31 * scale, w - 20 * scale, 85 * scale, "#f7fdff");
      drawQuad(x + 2 * scale, y + 18 * scale, x + w - 5 * scale, y + 4 * scale, x + w - 18 * scale, y + 28 * scale, x + 16 * scale, y + 36 * scale, "#ffffff");
      strokePerspectiveLine(x + 8 * scale, y + 19 * scale, x + w - 14 * scale, y + 10 * scale, "rgba(36,50,58,.18)", Math.max(1, 2 * scale));
      for (let i = 0; i < 4; i += 1) {
        fillRect(x + (25 + i * 29) * scale, y + 61 * scale, 18 * scale, 18 * scale, i % 2 ? "#fff4dc" : glass);
        fillRect(x + (25 + i * 29) * scale, y + 90 * scale, 18 * scale, 16 * scale, i % 2 ? glass : "#fff4dc");
      }
      return;
    }

    if (model === "gardenNightMarket") {
      fillRect(x, y + 47 * scale, w, 65 * scale, "#fff4dc");
      fillRect(x - 5 * scale, y + 32 * scale, w + 10 * scale, 15 * scale, "#d8484f");
      for (let i = 0; i < 9; i += 1) fillRect(x + i * 18 * scale, y + 32 * scale, 9 * scale, 15 * scale, i % 2 ? "#fff4dc" : "#d8484f");
      for (let i = 0; i < 3; i += 1) {
        fillRect(x + (14 + i * 43) * scale, y + 67 * scale, 30 * scale, 28 * scale, i % 2 ? glass : "#ffe2b8");
        drawCircle(x + (29 + i * 43) * scale, y + 80 * scale, 8 * scale, i % 2 ? COLORS.yellow : COLORS.orange);
      }
      return;
    }

    if (model === "anpingTreeHouse") {
      fillRect(x + 9 * scale, y + 42 * scale, w - 18 * scale, 75 * scale, "#d7a66e");
      drawBrickPattern(x + 9 * scale, y + 42 * scale, w - 18 * scale, 75 * scale, brick);
      fillRect(x + 1 * scale, y + 31 * scale, w - 2 * scale, 12 * scale, "#8f5f42");
      for (let i = 0; i < 7; i += 1) {
        const rootX = x + (15 + i * 19) * scale;
        fillRect(rootX, y + (22 + (i % 2) * 7) * scale, 7 * scale, 95 * scale, "#5f7a45");
        drawCircle(rootX + 4 * scale, y + (17 + (i % 3) * 6) * scale, 11 * scale, "rgba(101,168,95,.82)");
      }
      return;
    }

    if (model === "anpingBattery") {
      fillRect(x + 10 * scale, y + 51 * scale, w - 20 * scale, 62 * scale, "#a85d3b");
      drawBrickPattern(x + 10 * scale, y + 51 * scale, w - 20 * scale, 62 * scale, "#6e3b32");
      fillRect(x, y + 39 * scale, w, 14 * scale, "#8f4d3c");
      for (let i = 0; i < 5; i += 1) fillRect(x + (14 + i * 30) * scale, y + 31 * scale, 17 * scale, 10 * scale, "#8f4d3c");
      fillRect(x + 111 * scale, y + 72 * scale, 28 * scale, 8 * scale, "#3d4b53");
      fillRect(x + 135 * scale, y + 74 * scale, 27 * scale, 4 * scale, "#3d4b53");
      drawCircle(x + 111 * scale, y + 82 * scale, 10 * scale, "#3d4b53");
      return;
    }

    if (landmark.kind === "ugoodays") {
      fillRect(x + 10 * scale, y + 12 * scale, w - 20 * scale, 26 * scale, "#f7fdff");
      drawCircle(x + 31 * scale, y + 25 * scale, 13 * scale, COLORS.aqua);
      drawText("UG", x + 31 * scale, y + 30 * scale, Math.max(8, 12 * scale), "#ffffff", "center");
      drawText("純粹好食", x + w * 0.63, y + 30 * scale, Math.max(9, 15 * scale), COLORS.aquaDeep, "center");
      fillRect(x + 12 * scale, y + h - 48 * scale, 32 * scale, 28 * scale, "#c9b79d");
    } else if (landmark.kind === "station") {
      fillRect(x + 12 * scale, y + 22 * scale, w - 24 * scale, 10 * scale, accent);
      drawCircle(x + w / 2, y + 47 * scale, 13 * scale, "#ffffff");
      strokeCircle(x + w / 2, y + 47 * scale, 13 * scale, accent, Math.max(1, 2 * scale));
      for (let i = 0; i < 3; i += 1) fillRect(x + 16 * scale + i * 34 * scale, y + h - 62 * scale, 20 * scale, 22 * scale, "#ffffff");
    } else if (landmark.kind === "mall") {
      for (let i = 0; i < 4; i += 1) fillRect(x + 14 * scale + i * 33 * scale, y + 42 * scale, 20 * scale, 16 * scale, i % 2 ? "#fff4dc" : "#dff6ff");
      fillRect(x + w - 46 * scale, y - 28 * scale, 36 * scale, 48 * scale, "#bfeef8");
      strokeRect(x + w - 46 * scale, y - 28 * scale, 36 * scale, 48 * scale, accent, Math.max(1, 2 * scale));
    } else if (landmark.kind === "fort") {
      for (let i = 0; i < 5; i += 1) fillRect(x + 10 * scale + i * 24 * scale, y - 12 * scale, 16 * scale, 22 * scale, accent);
      for (let i = 0; i < 6; i += 1) fillRect(x + 12 * scale + i * 20 * scale, y + 42 * scale, 12 * scale, 8 * scale, "rgba(120,49,46,.35)");
    } else if (landmark.kind === "fish") {
      drawFishSculpture(x + w / 2, y + 55 * scale, 0.62 * scale, accent);
    } else if (landmark.kind === "museum") {
      fillRect(x + 8 * scale, y + 38 * scale, w - 16 * scale, 8 * scale, accent);
      for (let i = 0; i < 5; i += 1) fillRect(x + 16 * scale + i * 22 * scale, y + 46 * scale, 9 * scale, h - 58 * scale, "#ffffff");
    } else if (landmark.kind === "market" || landmark.kind === "street") {
      for (let i = 0; i < 5; i += 1) fillRect(x + 10 * scale + i * 22 * scale, y + 28 * scale, 18 * scale, 12 * scale, i % 2 ? "#ffffff" : accent);
      fillRect(x + 9 * scale, y + 40 * scale, w - 18 * scale, 10 * scale, accent);
    } else if (landmark.kind === "tunnel" || landmark.kind === "treehouse") {
      for (let i = 0; i < 5; i += 1) drawCircle(x + 18 * scale + i * 24 * scale, y + 36 * scale, 16 * scale, i % 2 ? "#8ec47d" : "#65a85f");
      fillRect(x + 14 * scale, y + 58 * scale, w - 28 * scale, 12 * scale, "#8b6b4e");
    } else if (landmark.kind === "island") {
      drawCircle(x + w * 0.72, y + 32 * scale, 20 * scale, COLORS.yellow);
      fillRect(x + 24 * scale, y + 44 * scale, w - 48 * scale, 12 * scale, COLORS.aqua);
      fillRect(x + w * 0.28, y + 18 * scale, 12 * scale, 48 * scale, "#ffffff");
      fillRect(x + w * 0.25, y + 13 * scale, 18 * scale, 8 * scale, accent);
    } else if (landmark.kind === "temple") {
      drawQuad(x + 8 * scale, y + 22 * scale, x + w / 2, y - 10 * scale, x + w - 8 * scale, y + 22 * scale, x + w - 20 * scale, y + 30 * scale, accent);
      drawQuad(x + 8 * scale, y + 22 * scale, x + 20 * scale, y + 30 * scale, x + w - 20 * scale, y + 30 * scale, x + w - 8 * scale, y + 22 * scale, COLORS.orange);
    } else if (landmark.kind === "deco") {
      for (let floor = 0; floor < 3; floor += 1) {
        for (let i = 0; i < 4; i += 1) fillRect(x + 16 * scale + i * 24 * scale, y + 38 * scale + floor * 18 * scale, 12 * scale, 9 * scale, "#ffffff");
      }
      fillRect(x + w - 24 * scale, y + 18 * scale, 14 * scale, 36 * scale, accent);
    } else {
      for (let i = 0; i < 3; i += 1) fillRect(x + 18 * scale + i * 34 * scale, y + 48 * scale, 19 * scale, 16 * scale, "#ffffff");
    }
  }

  function drawFishSculpture(cx, cy, scale, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    drawCircle(0, 0, 34, "rgba(255,255,255,.72)");
    strokeCircle(0, 0, 34, color, 4);
    drawTriangle(-40, -4, -62, -20, -58, 18, color);
    drawTriangle(28, -8, 54, -26, 48, 4, color);
    fillRect(-18, -12, 34, 7, color);
    fillRect(-22, 5, 40, 7, color);
    drawCircle(13, -11, 5, COLORS.ink);
    fillRect(-25, 30, 50, 8, color);
    ctx.restore();
  }

  function drawRoadsideDepthBlock(x, y, scale, side, index) {
    const w = (158 + (index % 4) * 18) * scale;
    const h = (104 + (index % 3) * 18) * scale;
    const skew = side * (24 + (index % 2) * 7) * scale;
    const baseX = side < 0 ? x + 22 * scale : x + 10 * scale;
    const baseY = y + 9 * scale;
    ctx.save();
    ctx.globalAlpha *= 0.58;
    drawQuad(
      baseX + skew,
      baseY - h - 18 * scale,
      baseX + w + skew,
      baseY - h - 10 * scale,
      baseX + w,
      baseY + 8 * scale,
      baseX,
      baseY,
      index % 2 ? "#e7cdb4" : "#d9eef2"
    );
    ctx.globalAlpha *= 0.72;
    drawQuad(
      baseX,
      baseY,
      baseX + w,
      baseY + 8 * scale,
      baseX + w + 34 * scale,
      baseY + 24 * scale,
      baseX - 28 * scale,
      baseY + 17 * scale,
      "rgba(36, 50, 58, 0.18)"
    );
    ctx.globalAlpha *= 0.7;
    fillRect(baseX + 8 * scale, baseY - h, w * 0.82, h * 0.86, "rgba(255,255,255,.22)");
    ctx.restore();
  }

  function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawTainanBackdrop(w, h, wallTop, t) {
    const mobile = isMobileLayout();
    const landmarkScale = mobile ? 0.68 : w < 920 ? 0.82 : 1;
    const scenicBandBottom = mobile ? state.lanes[0] - 150 / getSceneScale() : state.lanes[0] - 94;
    const baseY = wallTop + Math.min(mobile ? 282 : w < 920 ? 276 : 214, h * (mobile ? 0.29 : w < 920 ? 0.32 : 0.25));
    const y = mobile ? Math.min(baseY, scenicBandBottom) : baseY;
    const cycle = 5380 * landmarkScale;
    const offset = positiveModulo(state.sceneryOffset, cycle);
    const start = -120 * landmarkScale;
    const anchors = [start - offset, cycle + start - offset, cycle * 2 + start - offset];
    const landmarks = [
      [20, 2, drawChihkanTower],
      [176, 18, drawBlueprintWall],
      [332, 24, drawUgoodaysStore],
      [590, 16, drawNanfangMall],
      [784, 18, drawShanhuaStation],
      [960, 26, drawFunongStreet],
      [1138, 18, drawTainanStation],
      [1320, 30, drawHelePlaza],
      [1498, 28, drawBigFishBlessing],
      [1672, 8, drawAnpingFort],
      [1840, 20, drawEternalGoldenCastle],
      [2028, 24, drawTaitMerchantHouse],
      [2210, 18, drawHayashiDepartment],
      [2378, 18, drawJudicialMuseum],
      [2560, 12, drawTempleGate],
      [2728, 24, drawGovernorResidence],
      [2902, 28, drawShennongStreet],
      [3072, 28, drawShuixianMarket],
      [3242, 18, drawMazuTemple],
      [3416, 30, drawGuohuaStreet],
      [3592, 24, drawChimeiMuseum],
      [3784, 26, drawSicaoTunnel],
      [3966, 24, drawTainanArtMuseum],
      [4148, 28, drawYuguangIsland],
      [4318, 30, drawGardenNightMarket],
      [4496, 24, drawAnpingBattery],
      [4666, 28, drawAnpingTreeHouse],
      [4840, 28, drawTainanFoodStall, "牛肉湯"],
      [4944, 30, drawTainanFoodStall, "蝦捲"],
      [5048, 30, drawTainanFoodStall, "碗粿"],
      [5152, 30, drawTainanFoodStall, "虱目魚粥"],
    ];
    ctx.save();
    ctx.globalAlpha = 0.98;
    drawTainanSkyline(w, wallTop, y, t, offset);
    for (const base of anchors) {
      for (const [x, dy, drawer, label] of landmarks) {
        drawLandmark(drawer, base + x * landmarkScale, y + dy * landmarkScale, landmarkScale, label);
      }
    }
    drawLanternString(w, wallTop + 54, t);
    ctx.restore();
  }

  function drawLandmark(drawer, x, y, scale, label) {
    if (scale === 1) {
      drawer(x, y, label);
      return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    drawer(0, 0, label);
    ctx.restore();
  }

  function drawTainanSkyline(w, wallTop, y, t, offset = 0) {
    fillRect(0, wallTop + 26, w, 7, "rgba(180,73,102,.22)");
    fillRect(0, y + 46, w, 5, "rgba(38,138,161,.20)");
    for (let x = -120 - positiveModulo(t * 2.5 + offset * 0.18, 180); x < w + 160; x += 180) {
      drawCircle(x + 38, wallTop + 48, 8, "rgba(244,209,111,.38)");
      drawCircle(x + 62, wallTop + 66, 5, "rgba(255,255,255,.58)");
      fillRect(x + 86, y + 12, 42, 38, "rgba(255,247,222,.52)");
      fillRect(x + 96, y + 2, 25, 12, "rgba(200,95,69,.45)");
      fillRect(x + 130, y + 20, 66, 30, "rgba(127,195,222,.26)");
    }
  }

  function drawChihkanTower(x, y) {
    fillRect(x + 8, y - 62, 168, 90, "#ffe9bd");
    fillRect(x + 18, y - 48, 148, 75, "#fff4dc");
    fillRect(x - 2, y - 69, 188, 12, "#8f3550");
    fillRect(x + 8, y - 82, 168, 15, "#c85f45");
    fillRect(x + 25, y - 96, 134, 16, "#e0794f");
    fillRect(x + 47, y - 110, 90, 17, "#b44966");
    fillRect(x + 68, y - 123, 48, 15, "#c85f45");
    for (let i = 0; i < 4; i += 1) {
      const px = x + 30 + i * 36;
      fillRect(px, y - 38, 15, 66, "#a85d3b");
      fillRect(px + 6, y - 54, 5, 16, "#d6a845");
    }
    fillRect(x + 78, y - 35, 35, 63, "#d99b5c");
    fillRect(x + 84, y - 25, 23, 45, "#f4c37c");
    drawBrickPattern(x + 18, y - 48, 148, 74, "#d7a66e");
    strokeRect(x + 8, y - 62, 168, 90, "rgba(36,50,58,.42)", 3);
    drawText("赤崁樓", x + 92, y - 7, 18, "#8b3c3d", "center");
  }

  function drawAnpingFort(x, y) {
    fillRect(x + 0, y - 44, 152, 72, "#b55f44");
    fillRect(x + 8, y - 36, 136, 64, "#d07a50");
    drawBrickPattern(x + 8, y - 36, 136, 64, "#8f4d3c");
    fillRect(x + 52, y - 105, 50, 76, "#f4e0bf");
    fillRect(x + 58, y - 99, 38, 64, "#fff1cf");
    fillRect(x + 48, y - 112, 58, 11, "#b44966");
    fillRect(x + 62, y - 126, 30, 15, "#d97a57");
    fillRect(x + 69, y - 142, 16, 18, "#8f3550");
    fillRect(x + 65, y - 77, 25, 12, "#8fcfe0");
    fillRect(x + 65, y - 55, 25, 12, "#8fcfe0");
    strokeRect(x + 52, y - 105, 50, 76, "rgba(36,50,58,.42)", 3);
    strokeRect(x + 0, y - 44, 152, 72, "rgba(36,50,58,.38)", 3);
    drawText("安平古堡", x + 76, y + 4, 17, "#fff4dc", "center");
  }

  function drawBlueprintWall(x, y) {
    fillRect(x + 0, y - 78, 126, 105, "#197fa5");
    fillRect(x + 8, y - 70, 110, 90, "#2499c0");
    strokeRect(x + 17, y - 58, 78, 62, "#dff6ff", 4);
    strokeRect(x + 30, y - 45, 34, 36, "#dff6ff", 3);
    fillRect(x + 71, y - 43, 25, 5, "#dff6ff");
    fillRect(x + 88, y - 58, 5, 54, "#dff6ff");
    fillRect(x + 32, y - 30, 30, 4, "#dff6ff");
    fillRect(x + 48, y - 45, 4, 36, "#dff6ff");
    drawCircle(x + 102, y - 54, 6, "#dff6ff");
    drawCircle(x + 103, y - 36, 4, "#dff6ff");
    strokeRect(x + 0, y - 78, 126, 105, "rgba(36,50,58,.32)", 3);
    drawText("藍晒圖", x + 63, y + 4, 18, "#ffffff", "center");
  }

  function drawUgoodaysStore(x, y) {
    fillRect(x + 0, y - 132, 228, 38, "#f7fdff");
    fillRect(x + 0, y - 94, 228, 122, "#f2eadf");
    fillRect(x + 0, y - 74, 228, 18, "#8fcfe0");
    fillRect(x + 0, y - 58, 228, 8, "#6caec0");
    for (let i = 0; i < 11; i += 1) {
      fillRect(x + 8 + i * 20, y - 132, 4, 38, "rgba(36,50,58,.18)");
      fillRect(x + 4 + i * 22, y - 136, 15, 5, i % 2 ? "#ffffff" : "#d8e9ef");
    }

    fillRect(x + 10, y - 121, 208, 50, "#ffffff");
    strokeRect(x + 10, y - 121, 208, 50, "rgba(36,50,58,.22)", 3);
    fillRect(x + 24, y - 113, 48, 34, "#d8f2fb");
    strokeRect(x + 24, y - 113, 48, 34, COLORS.aquaDeep, 2);
    drawText("優格", x + 48, y - 103, 16, COLORS.aquaDeep, "center");
    drawText("專賣", x + 48, y - 88, 16, COLORS.aquaDeep, "center");
    drawCircle(x + 96, y - 96, 24, "#7fc3de");
    drawCircle(x + 89, y - 91, 6, "#f7fdff");
    drawCircle(x + 106, y - 91, 6, "#f7fdff");
    fillRect(x + 107, y - 112, 44, 9, "#7fc3de");
    drawText("純粹好食", x + 167, y - 94, 24, COLORS.aquaDeep, "center");
    drawText("UGOODAYS", x + 167, y - 76, 10, COLORS.aquaDeep, "center");

    fillRect(x + 12, y - 49, 86, 70, "#5e554d");
    for (let i = 0; i < 7; i += 1) fillRect(x + 16, y - 43 + i * 9, 78, 3, "#2f2c29");
    fillRect(x + 103, y - 50, 46, 76, "#e9fbff");
    fillRect(x + 110, y - 43, 32, 53, "#bfeef8");
    strokeRect(x + 103, y - 50, 46, 76, "rgba(36,50,58,.32)", 3);
    fillRect(x + 155, y - 55, 50, 82, "#dff6ff");
    fillRect(x + 161, y - 48, 38, 66, "#ffffff");
    drawCircle(x + 180, y - 18, 18, "#f19aa0");
    drawText("徵求", x + 180, y - 37, 10, COLORS.berry, "center");
    drawText("294", x + 213, y - 49, 10, "#ffffff", "center");
    fillRect(x + 205, y - 56, 19, 17, "#268aa1");

    fillRect(x + 182, y + 9, 36, 17, "#3d4b53");
    fillRect(x + 174, y - 3, 42, 19, "#e86b89");
    fillRect(x + 205, y - 5, 13, 31, "#3d4b53");
    drawCircle(x + 181, y + 25, 8, "#3d4b53");
    drawCircle(x + 211, y + 25, 8, "#3d4b53");
    drawText("純粹好食門市", x + 114, y + 13, 18, COLORS.aquaDeep, "center");
    strokeRect(x + 0, y - 132, 228, 160, "rgba(36,50,58,.24)", 3);
  }

  function drawHayashiDepartment(x, y) {
    fillRect(x + 12, y - 96, 116, 124, "#e9d8bd");
    fillRect(x + 24, y - 110, 90, 18, "#c8945e");
    fillRect(x + 42, y - 132, 54, 28, "#fff4dc");
    fillRect(x + 54, y - 151, 30, 22, "#c8945e");
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        fillRect(x + 28 + i * 32, y - 70 + j * 28, 16, 14, "#fff6d8");
        strokeRect(x + 28 + i * 32, y - 70 + j * 28, 16, 14, "rgba(36,50,58,.18)", 2);
      }
    }
    fillRect(x + 58, y - 12, 26, 40, "#9ec7d4");
    strokeRect(x + 12, y - 96, 116, 124, "rgba(36,50,58,.32)", 3);
    drawText("林百貨", x + 70, y + 6, 18, "#8b5d3c", "center");
  }

  function drawTempleGate(x, y) {
    fillRect(x + 8, y - 64, 130, 90, "#ffe6b3");
    fillRect(x - 2, y - 74, 150, 13, "#b44966");
    fillRect(x + 12, y - 88, 122, 15, "#d97a57");
    fillRect(x + 32, y - 101, 82, 15, "#8f3550");
    fillRect(x + 16, y - 46, 18, 72, "#a85d3b");
    fillRect(x + 104, y - 46, 18, 72, "#a85d3b");
    fillRect(x + 45, y - 34, 48, 60, "#f7c678");
    strokeRect(x + 8, y - 64, 130, 90, "rgba(36,50,58,.36)", 3);
    drawText("孔廟", x + 73, y - 1, 18, "#8b3c3d", "center");
  }

  function drawShennongStreet(x, y) {
    const colors = ["#f1d0ad", "#d9ebee", "#f7dfc2", "#d8c1a3"];
    for (let i = 0; i < 4; i += 1) {
      const bx = x + i * 35;
      fillRect(bx, y - 66 - (i % 2) * 10, 36, 92 + (i % 2) * 10, colors[i]);
      fillRect(bx - 2, y - 72 - (i % 2) * 10, 40, 9, i % 2 ? "#b44966" : "#8f5f42");
      fillRect(bx + 8, y - 44, 18, 18, "#fff4dc");
      fillRect(bx + 10, y - 12, 15, 38, "#8fcfe0");
      strokeRect(bx, y - 66 - (i % 2) * 10, 36, 92 + (i % 2) * 10, "rgba(36,50,58,.22)", 2);
    }
    for (let i = 0; i < 5; i += 1) {
      drawCircle(x + 14 + i * 25, y - 78 + (i % 2) * 7, 7, i % 2 ? "#f4d16f" : "#d8484f");
    }
    drawText("神農街", x + 70, y + 8, 17, "#8b3c3d", "center");
  }

  function drawMazuTemple(x, y) {
    fillRect(x + 12, y - 70, 140, 98, "#ffe3ad");
    fillRect(x - 2, y - 78, 168, 12, "#8f3550");
    fillRect(x + 15, y - 95, 138, 18, "#d97a57");
    fillRect(x + 38, y - 110, 90, 17, "#b44966");
    fillRect(x + 18, y - 52, 22, 80, "#a85d3b");
    fillRect(x + 124, y - 52, 22, 80, "#a85d3b");
    fillRect(x + 56, y - 33, 50, 61, "#f4c37c");
    drawCircle(x + 81, y - 47, 17, "#f4d16f");
    strokeRect(x + 12, y - 70, 140, 98, "rgba(36,50,58,.30)", 3);
    drawText("大天后宮", x + 82, y + 2, 17, "#8b3c3d", "center");
  }

  function drawNanfangMall(x, y) {
    fillRect(x + 0, y - 96, 166, 124, "#e9f6f8");
    fillRect(x + 10, y - 108, 72, 28, "#82c6d8");
    fillRect(x + 88, y - 122, 62, 42, "#bfeef8");
    fillRect(x + 18, y - 78, 132, 78, "#f7fdff");
    for (let i = 0; i < 4; i += 1) {
      fillRect(x + 28 + i * 29, y - 63, 17, 18, i % 2 ? "#f4d16f" : "#8fcfe0");
      fillRect(x + 28 + i * 29, y - 34, 17, 18, i % 2 ? "#8fcfe0" : "#f4d16f");
    }
    fillRect(x + 58, y - 7, 48, 35, "#86c6d6");
    strokeRect(x + 0, y - 96, 166, 124, "rgba(36,50,58,.30)", 3);
    strokeRect(x + 88, y - 122, 62, 42, "rgba(36,50,58,.22)", 2);
    drawText("南紡購物中心", x + 83, y + 7, 15, COLORS.aquaDeep, "center");
  }

  function drawShanhuaStation(x, y) {
    fillRect(x + 0, y - 72, 156, 100, "#f3e0bd");
    fillRect(x - 6, y - 84, 168, 16, "#6f9fb0");
    fillRect(x + 18, y - 108, 120, 24, "#dff6ff");
    strokeRect(x + 18, y - 108, 120, 24, "rgba(36,50,58,.28)", 3);
    drawText("善化", x + 78, y - 96, 18, COLORS.aquaDeep, "center");
    drawCircle(x + 78, y - 53, 15, "#fff4dc");
    strokeCircle(x + 78, y - 53, 15, "#6f9fb0", 3);
    fillRect(x + 77, y - 64, 3, 11, "#6f9fb0");
    fillRect(x + 78, y - 53, 9, 3, "#6f9fb0");
    for (let i = 0; i < 3; i += 1) {
      fillRect(x + 17 + i * 45, y - 30, 28, 22, "#dff6ff");
      strokeRect(x + 17 + i * 45, y - 30, 28, 22, "rgba(36,50,58,.20)", 2);
    }
    fillRect(x - 14, y + 18, 184, 8, "#4a5b62");
    for (let i = 0; i < 5; i += 1) fillRect(x - 4 + i * 38, y + 20, 18, 4, "#d7edf4");
    strokeRect(x + 0, y - 72, 156, 100, "rgba(36,50,58,.30)", 3);
    drawText("善化車站", x + 78, y + 7, 17, "#4a5b62", "center");
  }

  function drawFunongStreet(x, y) {
    const fronts = ["#ffe2b8", "#d8f1f2", "#f4d7df", "#fff4dc", "#dbe8c9"];
    for (let i = 0; i < 5; i += 1) {
      const bx = x + i * 31;
      fillRect(bx, y - 62 - (i % 2) * 8, 32, 90 + (i % 2) * 8, fronts[i]);
      fillRect(bx - 2, y - 72 - (i % 2) * 8, 36, 12, i % 2 ? "#268aa1" : "#c85f45");
      fillRect(bx + 5, y - 42, 21, 14, "#f7fdff");
      fillRect(bx + 9, y - 8, 15, 36, i % 2 ? "#a47b42" : "#8fcfe0");
      strokeRect(bx, y - 62 - (i % 2) * 8, 32, 90 + (i % 2) * 8, "rgba(36,50,58,.20)", 2);
    }
    fillRect(x + 5, y - 85, 132, 4, "rgba(36,50,58,.26)");
    for (let i = 0; i < 6; i += 1) drawCircle(x + 12 + i * 24, y - 82, 6, i % 2 ? "#f4d16f" : "#d8484f");
    drawText("富農街", x + 76, y + 9, 18, "#8b3c3d", "center");
  }

  function drawChimeiMuseum(x, y) {
    fillRect(x + 16, y - 70, 158, 98, "#f7fdff");
    fillRect(x + 30, y - 90, 130, 24, "#e8f2f6");
    drawCircle(x + 95, y - 96, 29, "#f7fdff");
    fillRect(x + 66, y - 98, 58, 32, "#f7fdff");
    for (let i = 0; i < 5; i += 1) {
      const px = x + 38 + i * 24;
      fillRect(px, y - 58, 12, 86, "#e5edf1");
      strokeRect(px, y - 58, 12, 86, "rgba(36,50,58,.16)", 2);
    }
    fillRect(x + 0, y + 25, 190, 8, "#d9c19a");
    drawCircle(x + 18, y + 18, 13, "#8fcfe0");
    drawCircle(x + 172, y + 18, 13, "#8fcfe0");
    strokeRect(x + 16, y - 70, 158, 98, "rgba(36,50,58,.26)", 3);
    drawText("奇美博物館", x + 95, y + 5, 17, "#4a5b62", "center");
  }

  function drawTainanArtMuseum(x, y) {
    fillRect(x + 8, y - 88, 142, 116, "#f7fdff");
    fillRect(x + 8, y - 88, 142, 24, "#dfe8ea");
    for (let i = 0; i < 4; i += 1) {
      fillRect(x + 22 + i * 28, y - 52, 18, 20, "#dff6ff");
      fillRect(x + 22 + i * 28, y - 21, 18, 20, "#fff4dc");
    }
    fillRect(x + 52, y - 4, 48, 32, "#bfeef8");
    strokeRect(x + 8, y - 88, 142, 116, "rgba(36,50,58,.28)", 3);
    fillRect(x - 4, y - 105, 166, 12, "#ffffff");
    strokeRect(x - 4, y - 105, 166, 12, "rgba(36,50,58,.18)", 2);
    drawText("臺南美術館", x + 79, y + 8, 16, "#4a5b62", "center");
  }

  function drawGardenNightMarket(x, y) {
    fillRect(x + 0, y - 58, 154, 86, "#fff4dc");
    fillRect(x - 6, y - 72, 166, 16, "#d8484f");
    for (let i = 0; i < 9; i += 1) {
      fillRect(x + i * 18, y - 72, 9, 16, i % 2 ? "#fff4dc" : "#d8484f");
    }
    for (let i = 0; i < 3; i += 1) {
      fillRect(x + 12 + i * 45, y - 36, 32, 34, i % 2 ? "#dff6ff" : "#ffe2b8");
      drawCircle(x + 28 + i * 45, y - 19, 9, i % 2 ? "#f4d16f" : "#ef8b53");
    }
    fillRect(x + 10, y + 14, 134, 9, "#a85d3b");
    strokeRect(x + 0, y - 58, 154, 86, "rgba(36,50,58,.26)", 3);
    drawText("花園夜市", x + 77, y + 3, 18, "#8b3c3d", "center");
  }

  function drawAnpingTreeHouse(x, y) {
    fillRect(x + 8, y - 66, 138, 94, "#d7a66e");
    drawBrickPattern(x + 8, y - 66, 138, 94, "#8f4d3c");
    fillRect(x + 22, y - 40, 28, 24, "#5e554d");
    fillRect(x + 82, y - 40, 28, 24, "#5e554d");
    fillRect(x + 0, y - 78, 154, 13, "#8f5f42");
    for (let i = 0; i < 7; i += 1) {
      const rootX = x + 14 + i * 19;
      fillRect(rootX, y - 83 + (i % 2) * 8, 8, 111 - (i % 2) * 10, "#5f7a45");
      drawCircle(rootX + 4, y - 88 + (i % 3) * 6, 12, "rgba(101,168,95,.82)");
    }
    strokeRect(x + 8, y - 66, 138, 94, "rgba(36,50,58,.30)", 3);
    drawText("安平樹屋", x + 77, y + 5, 17, "#5f7a45", "center");
  }

  function drawTainanFoodStall(x, y, label) {
    fillRect(x + 0, y - 48, 88, 75, "#fff4dc");
    fillRect(x - 4, y - 58, 96, 15, "#d8484f");
    for (let i = 0; i < 5; i += 1) {
      fillRect(x + i * 18, y - 58, 9, 15, i % 2 ? "#fff4dc" : "#d8484f");
    }
    fillRect(x + 10, y - 31, 68, 28, "#e8fbff");
    fillRect(x + 15, y - 26, 22, 17, "#f4d16f");
    fillRect(x + 46, y - 26, 22, 17, "#7fc3de");
    fillRect(x + 12, y + 9, 62, 8, "#a85d3b");
    strokeRect(x + 0, y - 48, 88, 75, "rgba(36,50,58,.30)", 3);
    drawText(label, x + 44, y + 4, 15, "#8b3c3d", "center");
  }

  function drawTainanStation(x, y) {
    fillRect(x + 8, y - 76, 154, 104, "#f1dcc2");
    fillRect(x + 18, y - 88, 134, 18, "#8f3550");
    fillRect(x + 52, y - 108, 68, 24, "#c85f45");
    fillRect(x + 70, y - 129, 32, 26, "#fff4dc");
    fillRect(x + 77, y - 143, 18, 16, "#8f3550");
    drawCircle(x + 86, y - 118, 11, "#f7fdff");
    strokeCircle(x + 86, y - 118, 11, "#6f9fb0", 3);
    fillRect(x + 85, y - 126, 3, 9, "#6f9fb0");
    fillRect(x + 86, y - 117, 8, 3, "#6f9fb0");
    for (let i = 0; i < 5; i += 1) {
      const wx = x + 22 + i * 28;
      fillRect(wx, y - 48, 16, 22, "#dff6ff");
      strokeRect(wx, y - 48, 16, 22, "rgba(36,50,58,.18)", 2);
    }
    fillRect(x + 65, y - 14, 42, 42, "#8fcfe0");
    strokeRect(x + 8, y - 76, 154, 104, "rgba(36,50,58,.32)", 3);
    drawText("臺南車站", x + 85, y + 6, 17, "#8b3c3d", "center");
  }

  function drawHelePlaza(x, y) {
    fillRect(x + 2, y - 30, 170, 58, "#dff6ff");
    fillRect(x + 14, y - 42, 146, 12, "#ffffff");
    fillRect(x + 22, y - 58, 130, 17, "#eef8fa");
    fillRect(x + 36, y - 76, 102, 18, "#ffffff");
    fillRect(x + 48, y - 20, 78, 32, "#8fcfe0");
    fillRect(x + 59, y - 12, 56, 18, "#bfeef8");
    for (let i = 0; i < 5; i += 1) {
      fillRect(x + 18 + i * 28, y - 52 + i % 2 * 7, 19, 5, "#9ccfd8");
    }
    drawCircle(x + 28, y + 8, 10, "rgba(255,255,255,.70)");
    drawCircle(x + 144, y - 7, 12, "rgba(255,255,255,.70)");
    strokeRect(x + 2, y - 30, 170, 58, "rgba(38,138,161,.26)", 3);
    drawText("河樂廣場", x + 87, y + 8, 17, COLORS.aquaDeep, "center");
  }

  function drawBigFishBlessing(x, y) {
    drawCircle(x + 82, y - 44, 48, "rgba(127,195,222,.22)");
    strokeCircle(x + 82, y - 44, 48, "#7fc3de", 5);
    fillRect(x + 40, y - 48, 80, 10, "#7fc3de");
    fillRect(x + 54, y - 68, 58, 9, "#7fc3de");
    fillRect(x + 55, y - 28, 54, 9, "#7fc3de");
    drawTriangle(x + 124, y - 44, x + 162, y - 72, x + 158, y - 20, "#7fc3de");
    drawTriangle(x + 26, y - 44, x + 0, y - 63, x + 4, y - 28, "#7fc3de");
    for (let i = 0; i < 8; i += 1) {
      drawCircle(x + 47 + i * 9, y - 45 + (i % 2) * 11, 5, i % 2 ? "#f4d16f" : "#f19aa0");
    }
    fillRect(x + 48, y + 4, 80, 7, "#9ccfd8");
    drawText("大魚的祝福", x + 82, y + 8, 15, COLORS.aquaDeep, "center");
  }

  function drawEternalGoldenCastle(x, y) {
    fillRect(x + 22, y - 62, 134, 90, "#b55f44");
    fillRect(x + 0, y - 80, 48, 42, "#a74d3c");
    fillRect(x + 132, y - 80, 48, 42, "#a74d3c");
    fillRect(x + 0, y - 18, 48, 46, "#a74d3c");
    fillRect(x + 132, y - 18, 48, 46, "#a74d3c");
    drawBrickPattern(x + 4, y - 76, 172, 100, "#6e3b32");
    fillRect(x + 66, y - 38, 48, 66, "#7b3f35");
    fillRect(x + 74, y - 29, 32, 42, "#f4c37c");
    fillRect(x + 124, y - 52, 30, 10, "#3d4b53");
    fillRect(x + 145, y - 49, 18, 5, "#3d4b53");
    strokeRect(x + 22, y - 62, 134, 90, "rgba(36,50,58,.34)", 3);
    drawText("億載金城", x + 90, y + 4, 17, "#fff4dc", "center");
  }

  function drawTaitMerchantHouse(x, y) {
    fillRect(x + 8, y - 78, 156, 106, "#f7fdff");
    fillRect(x + 0, y - 91, 172, 16, "#8f5f42");
    fillRect(x + 22, y - 108, 128, 18, "#c85f45");
    for (let i = 0; i < 4; i += 1) {
      const ax = x + 22 + i * 33;
      fillRect(ax, y - 48, 24, 52, "#f1dcc2");
      drawCircle(ax + 12, y - 49, 13, "#f1dcc2");
      strokeRect(ax, y - 48, 24, 52, "rgba(36,50,58,.18)", 2);
      fillRect(ax + 8, y - 22, 8, 28, "#8fcfe0");
    }
    fillRect(x + 128, y - 54, 9, 82, "#5f7a45");
    for (let i = 0; i < 5; i += 1) drawCircle(x + 117 + i * 10, y - 63 + (i % 2) * 9, 14, "rgba(101,168,95,.78)");
    strokeRect(x + 8, y - 78, 156, 106, "rgba(36,50,58,.26)", 3);
    drawText("德記洋行", x + 86, y + 7, 17, "#8b5d3c", "center");
  }

  function drawJudicialMuseum(x, y) {
    fillRect(x + 4, y - 78, 172, 106, "#b65f4b");
    drawBrickPattern(x + 4, y - 78, 172, 106, "#743a32");
    fillRect(x + 20, y - 98, 136, 22, "#8f3550");
    drawCircle(x + 88, y - 104, 24, "#f3e0bd");
    fillRect(x + 64, y - 104, 48, 30, "#f3e0bd");
    for (let i = 0; i < 5; i += 1) {
      const wx = x + 23 + i * 30;
      drawCircle(wx + 9, y - 43, 9, "#fff1cf");
      fillRect(wx, y - 43, 18, 34, "#fff1cf");
      strokeRect(wx, y - 43, 18, 34, "rgba(36,50,58,.18)", 2);
    }
    fillRect(x + 73, y - 15, 30, 43, "#8fcfe0");
    strokeRect(x + 4, y - 78, 172, 106, "rgba(36,50,58,.30)", 3);
    drawText("司法博物館", x + 90, y + 6, 16, "#fff4dc", "center");
  }

  function drawGovernorResidence(x, y) {
    fillRect(x + 12, y - 62, 150, 90, "#f3e4c8");
    fillRect(x + 2, y - 78, 170, 20, "#4a5b62");
    fillRect(x + 36, y - 96, 98, 22, "#5e554d");
    fillRect(x + 26, y - 44, 24, 72, "#d7a66e");
    fillRect(x + 122, y - 44, 24, 72, "#d7a66e");
    for (let i = 0; i < 3; i += 1) {
      fillRect(x + 57 + i * 23, y - 33, 14, 20, "#dff6ff");
      strokeRect(x + 57 + i * 23, y - 33, 14, 20, "rgba(36,50,58,.16)", 2);
    }
    fillRect(x + 0, y + 18, 176, 10, "#7aa15f");
    drawCircle(x + 21, y + 7, 13, "#6aa55e");
    drawCircle(x + 151, y + 7, 13, "#6aa55e");
    strokeRect(x + 12, y - 62, 150, 90, "rgba(36,50,58,.28)", 3);
    drawText("知事官邸", x + 87, y + 7, 17, "#5e554d", "center");
  }

  function drawShuixianMarket(x, y) {
    fillRect(x + 4, y - 66, 154, 94, "#fff4dc");
    fillRect(x - 2, y - 84, 166, 20, "#2f9b8c");
    for (let i = 0; i < 8; i += 1) {
      fillRect(x + i * 20, y - 84, 10, 20, i % 2 ? "#f6d27a" : "#2f9b8c");
    }
    fillRect(x + 15, y - 47, 54, 28, "#e86b89");
    fillRect(x + 84, y - 47, 54, 28, "#8fcfe0");
    for (let i = 0; i < 5; i += 1) drawCircle(x + 24 + i * 24, y - 18, 8, i % 2 ? "#65a85f" : "#f4d16f");
    fillRect(x + 21, y + 8, 122, 11, "#a85d3b");
    strokeRect(x + 4, y - 66, 154, 94, "rgba(36,50,58,.28)", 3);
    drawText("水仙宮市場", x + 81, y + 5, 16, "#2f7e73", "center");
  }

  function drawGuohuaStreet(x, y) {
    const stalls = ["#ffe2b8", "#dff6ff", "#f4d7df", "#fff4dc"];
    for (let i = 0; i < 4; i += 1) {
      const bx = x + i * 38;
      fillRect(bx, y - 58 - (i % 2) * 8, 40, 86 + (i % 2) * 8, stalls[i]);
      fillRect(bx - 2, y - 72 - (i % 2) * 8, 44, 14, i % 2 ? "#b44966" : "#ef8b53");
      fillRect(bx + 9, y - 36, 22, 16, "#f7fdff");
      fillRect(bx + 12, y - 5, 16, 33, "#8fcfe0");
      strokeRect(bx, y - 58 - (i % 2) * 8, 40, 86 + (i % 2) * 8, "rgba(36,50,58,.20)", 2);
    }
    fillRect(x + 144, y - 78, 22, 60, "#d8484f");
    drawText("吃", x + 155, y - 51, 18, "#fff4dc", "center");
    fillRect(x + 12, y + 17, 138, 8, "#a85d3b");
    drawText("國華街", x + 82, y + 8, 18, "#8b3c3d", "center");
  }

  function drawSicaoTunnel(x, y) {
    fillRect(x + 0, y - 20, 178, 48, "#8fcfe0");
    for (let i = 0; i < 7; i += 1) {
      const bx = x + 10 + i * 24;
      fillRect(bx, y - 84 + (i % 2) * 8, 12, 104 - (i % 2) * 9, "#5f7a45");
      drawCircle(bx + 6, y - 88 + (i % 3) * 7, 24, "rgba(77,138,76,.82)");
      drawCircle(bx + 18, y - 70 + (i % 2) * 7, 19, "rgba(101,168,95,.68)");
    }
    fillRect(x + 53, y + 1, 72, 12, "#8b5d3c");
    fillRect(x + 68, y - 8, 42, 10, "#fff4dc");
    drawCircle(x + 47, y + 6, 6, "#8b5d3c");
    drawCircle(x + 131, y + 6, 6, "#8b5d3c");
    strokeRect(x + 0, y - 20, 178, 48, "rgba(38,138,161,.24)", 3);
    drawText("四草綠隧", x + 89, y + 8, 16, "#4d8a4c", "center");
  }

  function drawYuguangIsland(x, y) {
    fillRect(x + 0, y - 26, 172, 54, "#f2d4a8");
    fillRect(x + 0, y - 50, 172, 25, "#8fcfe0");
    for (let i = 0; i < 4; i += 1) fillRect(x + 16 + i * 39, y - 39 + (i % 2) * 5, 26, 5, "#dff6ff");
    drawCircle(x + 34, y - 67, 18, "#f4d16f");
    fillRect(x + 112, y - 84, 16, 58, "#f7fdff");
    fillRect(x + 107, y - 91, 26, 8, "#d8484f");
    fillRect(x + 113, y - 69, 14, 9, "#d8484f");
    drawCircle(x + 125, y - 12, 16, "#7aa15f");
    drawCircle(x + 141, y - 15, 14, "#7aa15f");
    strokeRect(x + 0, y - 26, 172, 54, "rgba(36,50,58,.18)", 3);
    drawText("漁光島", x + 86, y + 8, 17, "#2d879d", "center");
  }

  function drawAnpingBattery(x, y) {
    fillRect(x + 10, y - 46, 150, 74, "#a85d3b");
    drawBrickPattern(x + 10, y - 46, 150, 74, "#6e3b32");
    fillRect(x + 0, y - 58, 170, 16, "#8f4d3c");
    for (let i = 0; i < 5; i += 1) fillRect(x + 14 + i * 30, y - 66, 18, 12, "#8f4d3c");
    fillRect(x + 51, y - 16, 48, 44, "#fff4dc");
    fillRect(x + 109, y - 29, 28, 10, "#3d4b53");
    fillRect(x + 130, y - 26, 28, 5, "#3d4b53");
    drawCircle(x + 109, y - 16, 11, "#3d4b53");
    strokeRect(x + 10, y - 46, 150, 74, "rgba(36,50,58,.32)", 3);
    drawText("安平小砲臺", x + 85, y + 6, 16, "#fff4dc", "center");
  }

  function drawBrickPattern(x, y, w, h, color) {
    ctx.save();
    ctx.globalAlpha *= 0.28;
    for (let row = 0; row < h; row += 12) {
      for (let col = (row / 12) % 2 ? 8 : 0; col < w; col += 24) {
        fillRect(x + col, y + row, 17, 3, color);
      }
    }
    ctx.restore();
  }

  function drawLanternString(w, y, t) {
    fillRect(0, y, w, 4, "rgba(180,73,102,.46)");
    for (let i = 0; i < 14; i += 1) {
      const x = ((i * 78 - t * 14) % (w + 120)) - 60;
      fillRect(x + 7, y + 2, 3, 7, "#8f3550");
      fillRect(x, y + 9, 19, 22, "#d8484f");
      fillRect(x + 4, y + 11, 11, 18, "#f6a96d");
      fillRect(x + 7, y + 31, 5, 7, "#b44966");
      if (i % 3 === 0) drawText("福", x + 10, y + 25, 10, "#fff4dc", "center");
    }
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
    const scale = getSceneScale();
    const y = h - (isMobileLayout() ? 74 / scale : 44);
    if (isMobileLayout()) {
      const padY = h - 146 / scale;
      fillRect(0, padY, w, 72 / scale, "rgba(127,195,222,.16)");
      fillRect(0, padY, w, 4, "rgba(38,138,161,.34)");
      for (let x = -60; x < w + 80; x += 74) {
        fillRect(x + 10, padY + 28, 26, 5, "rgba(255,255,255,.42)");
        fillRect(x + 22, padY + 20, 5, 21, "rgba(255,255,255,.28)");
      }
    }
    fillRect(0, y, w, 34, "#334852");
    fillRect(0, y, w, 5, "#8fcfe0");
    for (let x = -80 - (t * state.speed * 0.85) % 72; x < w + 80; x += 72) {
      fillRect(x, y + 7, 34, 20, "#d7edf4");
    }
  }

  function drawHitZone() {
    if (state.phase !== "playing") return;
    const x = Math.round(player.x);
    const y = player.y;
    const pulse = 0.55 + Math.sin(state.time * 9) * 0.22;
    fillRect(x - 44, y - 104, 88, 122, `rgba(180,73,102,${0.05 + pulse * 0.03})`);
    strokeRect(x - 44, y - 104, 88, 122, "rgba(180,73,102,.38)", 3);
    strokeCircle(x, y - 46, 44 + pulse * 6, "rgba(255,255,255,.62)", 2);
    strokeCircle(x, y - 46, 28 + pulse * 4, "rgba(38,138,161,.50)", 3);
    drawText("吃好料", x, y - 119, isMobileLayout() ? 12 : 14, COLORS.berry, "center");
    const activeMult = state.multiplier * (state.flavorRushTime > 0 ? state.flavorMultiplier : 1);
    if (activeMult > 1) {
      drawText(`x${activeMult.toFixed(1)}`, x, y + 43, 18, COLORS.aquaDeep, "center");
    }
  }

  function drawEntity(entity) {
    const scale = entity.depthScale || roadEntityScale(entity.y);
    const cx = entity.x + entity.w / 2;
    const cy = entity.y - entity.h * 0.55;
    if (entity.type === "hazard" && !entity.done) drawHazardLaneWarning(entity);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
    if (entity.type === "station") drawStation(entity);
    else if (entity.type === "hazard") drawHazard(entity);
    else drawItem(entity);
    ctx.restore();
  }

  function drawItem(entity) {
    const x = Math.round(entity.x);
    const y = Math.round(entity.y - 76 + Math.sin(entity.anim * 7) * 5);
    const color = entity.color;
    const target = isNextTargetEntity(entity);
    ctx.save();
    ctx.translate(x + 34, y + 34);
    ctx.scale(entity.type === "bonus" ? 0.96 : 0.9, entity.type === "bonus" ? 0.96 : 0.9);
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

  function drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
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
    const cx = x + 34;
    const cy = y + 38;
    ctx.save();
    const radius = 31 + pulse * 10;
    ctx.globalAlpha = 0.32;
    drawCircle(cx + 6, cy + 9, radius + 2, COLORS.ink);
    ctx.globalAlpha = 0.9;
    drawCircle(cx + 4, cy + 6, radius, def.color || COLORS.aquaDeep);
    ctx.globalAlpha = 0.94;
    drawCircle(cx, cy, radius, def.bg || "#fff4dc");
    ctx.globalAlpha = 0.72;
    drawCircle(cx - 9, cy - 10, 15, "#ffffff");
    drawCircle(cx + 13, cy + 10, 12, "#ffffff");
    ctx.globalAlpha = 0.38;
    fillRect(cx - radius * 0.48, cy + radius * 0.46, radius * 0.96, 7, def.color || COLORS.aquaDeep);
    ctx.globalAlpha = required ? 0.98 : 0.68;
    strokeCircle(cx, cy, radius, def.color, required ? 5 : 3);
    strokeCircle(cx + 4, cy + 6, radius, "rgba(36,50,58,.24)", 2);
    if (required) {
      fillRect(cx - 28, cy - 32, 10, 10, def.color);
      fillRect(cx + 18, cy - 32, 10, 10, def.color);
      fillRect(cx - 28, cy + 22, 10, 10, def.color);
      fillRect(cx + 18, cy + 22, 10, 10, def.color);
    }
    ctx.restore();
  }

  function drawTargetPips(x, y, color) {
    const cx = x + 34;
    const cy = y + 38;
    const pulse = Math.sin(state.time * 18) * 3;
    ctx.save();
    ctx.globalAlpha = 0.88;
    strokeCircle(cx, cy, 42 + pulse * 0.5, color, 3);
    ctx.globalAlpha = 0.46;
    strokeCircle(cx, cy, 49 + Math.abs(pulse), "#ffffff", 2);
    ctx.globalAlpha = 0.78;
    for (let i = 0; i < 6; i += 1) {
      const a = state.time * 4.8 + i * Math.PI / 3;
      const r = 47 + Math.sin(state.time * 9 + i) * 3;
      drawCircle(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.74, i % 2 ? 4 : 5, i % 2 ? "#ffffff" : color);
    }
    ctx.restore();
  }

  function drawIngredientObjectShadow(key, x, y, def) {
    const cx = x + 34;
    const cy = y + 38;
    const color = def.color || COLORS.aquaDeep;
    ctx.save();
    ctx.globalAlpha = 0.22;
    fillRect(cx - 25, cy + 27, 50, 7, "rgba(36,50,58,.34)");
    ctx.globalAlpha = 0.16;
    if (key === "milk") {
      drawQuad(cx - 20, cy + 22, cx + 13, cy + 24, cx + 21, cy + 31, cx - 18, cy + 31, color);
    } else if (key === "culture") {
      strokeCircle(cx, cy + 2, 31, color, 4);
      strokeCircle(cx + 4, cy + 6, 25, "#ffffff", 2);
    } else if (key === "calcium") {
      strokeRect(cx - 28, cy - 20, 56, 43, color, 4);
    } else {
      drawCircle(cx + 3, cy + 4, 29, color);
    }
    ctx.restore();
  }

  function drawIngredientDepthCue(key, x, y, def) {
    const cx = x + 34;
    const cy = y + 38;
    ctx.save();
    ctx.globalAlpha = 0.62;
    if (["milk", "culture", "calcium"].includes(key)) {
      for (let i = 0; i < 3; i += 1) {
        strokeCircle(cx - 10 + i * 10, cy + 2 - i * 3, 11 + i * 3, i % 2 ? "#ffffff" : def.color, 2);
      }
    } else if (["fruit", "honey", "oat", "matcha", "cocoa", "salt", "crunch"].includes(key)) {
      for (let i = 0; i < 5; i += 1) {
        const a = -Math.PI / 2 + i * 0.78;
        fillRect(cx + Math.cos(a) * 22 - 4, cy + Math.sin(a) * 17 - 4, 8, 8, i % 2 ? "#ffffff" : def.color);
      }
    } else {
      strokeRect(cx - 24, cy - 21, 48, 42, def.color, 2);
      fillRect(cx - 19, cy - 15, 38, 6, "#ffffff");
      fillRect(cx - 19, cy + 9, 38, 6, def.color);
    }
    ctx.globalAlpha = 0.5;
    fillRect(cx + 19, cy - 18, 5, 34, "rgba(36,50,58,.22)");
    fillRect(cx - 17, cy + 20, 34, 5, "rgba(36,50,58,.18)");
    ctx.restore();
  }

  function drawIngredientIcon(key, x, y, required) {
    const def = TYPES[key];
    if (required) {
      drawTargetPips(x, y, def.color);
      drawStickerBase(x, y, def, required);
      drawIngredientDepthCue(key, x, y, def);
    } else {
      drawIngredientObjectShadow(key, x, y, def);
    }
    const iconScale = required ? 1.06 : 1.22;
    ctx.save();
    ctx.translate(x + 34, y + 38);
    ctx.scale(iconScale, iconScale);
    ctx.translate(-(x + 34), -(y + 38));
    if (key === "milk") {
      drawQuad(x + 22, y + 18, x + 31, y + 10, x + 48, y + 17, x + 39, y + 27, "#ffffff");
      fillRect(x + 20, y + 24, 30, 39, "#f7fdff");
      fillRect(x + 25, y + 33, 20, 18, "#dff6ff");
      fillRect(x + 23, y + 54, 24, 6, COLORS.aqua);
      drawCircle(x + 31, y + 45, 6, "#ffffff");
      drawCircle(x + 39, y + 45, 4, "#ffffff");
      strokeRect(x + 20, y + 24, 30, 39, COLORS.aquaDeep, 3);
      strokePerspectiveLine(x + 22, y + 18, x + 31, y + 10, COLORS.aquaDeep, 3);
      strokePerspectiveLine(x + 31, y + 10, x + 48, y + 17, COLORS.aquaDeep, 3);
      strokePerspectiveLine(x + 48, y + 17, x + 50, y + 63, COLORS.aquaDeep, 3);
    } else if (key === "culture") {
      drawCircle(x + 34, y + 38, 24, "#e9fbff");
      drawCircle(x + 34, y + 38, 18, "#caeef6");
      strokeCircle(x + 34, y + 38, 24, COLORS.aquaDeep, 4);
      strokeCircle(x + 34, y + 38, 18, "#ffffff", 2);
      for (let i = 0; i < 10; i += 1) {
        const a = i * 0.78 + state.time * 0.8;
        const bx = x + 34 + Math.cos(a) * (7 + i % 3 * 4);
        const by = y + 38 + Math.sin(a) * (5 + i % 2 * 5);
        drawCircle(bx, by, i % 3 === 0 ? 4 : 3, i % 2 ? COLORS.aquaDeep : COLORS.leaf);
        fillRect(bx + 3, by - 1, 5, 2, i % 2 ? COLORS.aquaDeep : COLORS.leaf);
      }
    } else if (key === "protein") {
      fillRect(x + 17, y + 24, 34, 36, "#fff5eb");
      fillRect(x + 22, y + 16, 24, 10, COLORS.orange);
      drawCircle(x + 34, y + 41, 13, "#ffd2b4");
      fillRect(x + 24, y + 38, 20, 7, COLORS.orange);
      drawText("P", x + 34, y + 48, 16, "#ffffff", "center");
      strokeRect(x + 17, y + 24, 34, 36, COLORS.ink, 3);
      strokeRect(x + 22, y + 16, 24, 10, COLORS.ink, 2);
    } else if (key === "calcium") {
      drawCircle(x + 22, y + 29, 9, "#ffffff");
      drawCircle(x + 22, y + 47, 9, "#ffffff");
      drawCircle(x + 47, y + 29, 9, "#ffffff");
      drawCircle(x + 47, y + 47, 9, "#ffffff");
      fillRect(x + 22, y + 29, 25, 18, "#dceffc");
      fillRect(x + 19, y + 35, 31, 7, "#f7fdff");
      strokeCircle(x + 22, y + 29, 9, "#4b91b6", 3);
      strokeCircle(x + 22, y + 47, 9, "#4b91b6", 3);
      strokeCircle(x + 47, y + 29, 9, "#4b91b6", 3);
      strokeCircle(x + 47, y + 47, 9, "#4b91b6", 3);
      strokeRect(x + 22, y + 29, 25, 18, "#4b91b6", 3);
      drawText("Ca", x + 34, y + 43, 13, "#4b91b6", "center");
    } else if (key === "fruit") {
      drawCircle(x + 24, y + 45, 13, COLORS.berry);
      drawCircle(x + 44, y + 45, 12, COLORS.orange);
      drawCircle(x + 35, y + 31, 10, COLORS.leaf);
      drawCircle(x + 33, y + 42, 7, "#f4d16f");
      strokeCircle(x + 24, y + 45, 13, COLORS.ink, 2);
      strokeCircle(x + 44, y + 45, 12, COLORS.ink, 2);
      fillRect(x + 31, y + 25, 14, 5, "#ffffff");
      drawTriangle(x + 36, y + 29, x + 48, y + 23, x + 43, y + 34, COLORS.leaf);
    } else if (key === "honey") {
      fillRect(x + 16, y + 25, 34, 34, COLORS.yellow);
      fillRect(x + 21, y + 16, 24, 10, "#fff8c6");
      drawCircle(x + 33, y + 40, 12, "#fff8c6");
      fillRect(x + 25, y + 38, 18, 8, COLORS.yellow);
      fillRect(x + 50, y + 18, 5, 33, "#7a5123");
      fillRect(x + 45, y + 26, 15, 5, "#7a5123");
      fillRect(x + 46, y + 34, 13, 5, "#7a5123");
      fillRect(x + 54, y + 43, 6, 10, COLORS.yellow);
      strokeRect(x + 16, y + 25, 34, 34, COLORS.ink, 3);
      strokeRect(x + 21, y + 16, 24, 10, COLORS.ink, 2);
    } else if (key === "oat") {
      for (let i = 0; i < 5; i += 1) {
        const ox = x + 16 + i * 8;
        const oy = y + 27 + (i % 2) * 7;
        fillRect(ox, oy, 9, 21, "#f4e3bf");
        fillRect(ox + 3, oy + 3, 4, 14, "#fff7da");
        strokeRect(ox, oy, 9, 21, "#a47b42", 2);
        strokePerspectiveLine(ox + 4, oy + 19, x + 34, y + 57, "#a47b42", 2);
      }
      fillRect(x + 17, y + 52, 36, 6, "#a47b42");
      drawCircle(x + 35, y + 55, 12, "#fff7da");
    } else if (key === "matcha") {
      drawCircle(x + 35, y + 48, 21, "#dff0d5");
      fillRect(x + 16, y + 40, 38, 16, "#dff0d5");
      fillRect(x + 21, y + 32, 29, 12, "#83c46a");
      for (let i = 0; i < 4; i += 1) {
        fillRect(x + 24 + i * 7, y + 23 + (i % 2) * 3, 4, 24, "#4f9a4b");
      }
      strokeCircle(x + 35, y + 48, 21, "#4f9a4b", 3);
      strokeRect(x + 21, y + 32, 29, 12, COLORS.ink, 2);
    } else if (key === "cocoa") {
      drawQuad(x + 18, y + 21, x + 51, y + 25, x + 48, y + 60, x + 15, y + 56, "#7a4b35");
      for (let row = 0; row < 2; row += 1) {
        for (let col = 0; col < 3; col += 1) {
          fillRect(x + 21 + col * 9, y + 30 + row * 13, 7, 10, "#9b644a");
          strokeRect(x + 21 + col * 9, y + 30 + row * 13, 7, 10, "#4f3025", 1);
        }
      }
      fillRect(x + 13, y + 16, 41, 7, "#efd5c6");
      strokeRect(x + 17, y + 24, 34, 34, COLORS.ink, 3);
    } else if (key === "salt") {
      fillRect(x + 19, y + 24, 30, 34, "#d9f0fb");
      fillRect(x + 22, y + 15, 24, 10, "#ffffff");
      fillRect(x + 24, y + 34, 20, 9, "#ffffff");
      strokeRect(x + 19, y + 24, 30, 34, "#5aa4c8", 3);
      strokeRect(x + 22, y + 15, 24, 10, COLORS.ink, 2);
      for (let i = 0; i < 8; i += 1) fillRect(x + 12 + i * 7, y + 55 + (i % 2) * 3, 4, 4, i % 2 ? "#5aa4c8" : "#ffffff");
    } else if (key === "crunch") {
      fillRect(x + 17, y + 47, 37, 10, "#fff8c6");
      for (let i = 0; i < 8; i += 1) {
        const cx = x + 13 + (i % 4) * 11;
        const cy = y + 26 + Math.floor(i / 4) * 15;
        fillRect(cx, cy, 11 + (i % 2) * 4, 10 + (i % 3), i % 2 ? COLORS.yellow : "#d48c32");
        strokeRect(cx, cy, 11 + (i % 2) * 4, 10 + (i % 3), COLORS.ink, 1);
      }
    } else {
      drawCircle(x + 34, y + 38, 17, def.color);
      strokeCircle(x + 34, y + 38, 17, COLORS.ink, 2);
    }
    ctx.restore();
  }

  function drawStation(entity) {
    const x = Math.round(entity.x);
    const y = Math.round(entity.y - 88);
    const def = TYPES[entity.key];
    const target = isNextTargetEntity(entity);
    ctx.save();
    ctx.translate(x + 52, y + 48);
    ctx.scale(0.94, 0.94);
    ctx.translate(-(x + 52), -(y + 48));
    drawPixelShadow(x + 16, entity.y - 12, entity.w + 20);
    if (target) drawBlinkFrame(x - 8, y - 12, 120, 104, def.color);
    drawQuad(x + 8, y + 18, x + 19, y + 8, x + 106, y + 8, x + 96, y + 18, "#ffffff");
    drawQuad(x + 96, y + 18, x + 106, y + 8, x + 106, y + 66, x + 96, y + 86, "rgba(36,50,58,.14)");
    fillRect(x + 5, y + 82, 104, 9, "rgba(36,50,58,.18)");
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
    ctx.save();
    ctx.translate(x + 36, y + 36);
    ctx.scale(1.0, 1.0);
    ctx.translate(-(x + 36), -(y + 36));
    if (!entity.done) drawHazardAlert(entity, x, y);
    drawPixelShadow(x + 10, entity.y - 9, entity.w + 10);
    const pulse = 0.55 + Math.sin(entity.anim * 10) * 0.22;
    fillRect(x - 8, y - 3, 88, 82, `rgba(216,36,60,${0.12 + pulse * 0.08})`);
    drawNegativeElement3D(entity, x + 1, y + 6, 70, 62);
    drawHazardSymbol(entity, x, y);
    drawText("避開", x + 36, y - 8, 15, entity.color, "center");
    drawText(entity.short, x + 36, y + 75, 15, entity.color, "center");
    drawEntityLabel(entity, x + 36, y + 90, "danger");
    drawHazardPostAction(entity, x, y);
    ctx.restore();
  }

  function drawNegativeElement3D(entity, x, y, w, h) {
    const color = entity.color || COLORS.berry;
    const side = "#8f1425";
    const top = "#ffccd3";
    const face = "#ffe8ed";
    ctx.save();
    drawQuad(x + 9, y - 9, x + w + 9, y - 9, x + w, y, x, y, top);
    drawQuad(x + w, y, x + w + 9, y - 9, x + w + 9, y + h - 9, x + w, y + h, side);
    fillRect(x, y, w, h, face);
    fillRect(x + 7, y + 8, w - 14, 10, "rgba(216,36,60,.2)");
    fillRect(x + 8, y + h - 14, w - 16, 6, "rgba(36,50,58,.12)");
    strokeRect(x, y, w, h, COLORS.ink, 3);
    strokeRect(x, y, w, h, color, 5);
    fillRect(x - 5, y - 5, 12, 12, color);
    fillRect(x + w - 7, y - 5, 12, 12, color);
    fillRect(x - 5, y + h - 7, 12, 12, color);
    fillRect(x + w - 7, y + h - 7, 12, 12, color);
    drawText("!", x + w * 0.5, y + h * 0.66, Math.max(24, h * 0.55), "#ffffff", "center");
    ctx.restore();
  }

  function drawHazardBlock3D(x, y, w, h, color, label = "!") {
    const dx = Math.max(8, w * 0.16);
    const dy = Math.max(7, h * 0.18);
    ctx.save();
    drawQuad(x - 7, y + h + 4, x + w + 8, y + h + 4, x + w + dx + 4, y + h - dy + 8, x + dx - 7, y + h - dy + 8, "rgba(36,50,58,.22)");
    drawQuad(x + dx, y - dy, x + w + dx, y - dy, x + w, y, x, y, "#ffd5dc");
    drawQuad(x + w, y, x + w + dx, y - dy, x + w + dx, y + h - dy, x + w, y + h, "#8f1425");
    drawQuad(x, y, x + dx, y - dy, x + dx, y + h - dy, x, y + h, "#ffb9c4");
    fillRect(x, y, w, h, "#ffe8ed");
    fillRect(x + 7, y + 8, w - 14, Math.max(7, h * 0.18), "rgba(216,36,60,.2)");
    fillRect(x + 8, y + h - Math.max(16, h * 0.22), w - 16, 7, "rgba(36,50,58,.12)");
    strokeRect(x, y, w, h, COLORS.ink, 3);
    strokeRect(x, y, w, h, color, 5);
    strokePerspectiveLine(x + dx, y - dy, x + w + dx, y - dy, "rgba(36,50,58,.32)", 2);
    strokePerspectiveLine(x + w + dx, y - dy, x + w, y, "rgba(36,50,58,.32)", 2);
    drawText(label, x + w / 2, y + h * 0.62, Math.max(24, h * 0.55), color, "center");
    ctx.restore();
  }

  function drawLaneGapHazard(entity, x, y) {
    const scale = entity.depthScale || roadEntityScale(entity.y);
    const gapLane = entity.gapLane;
    const pulse = 0.55 + Math.sin(entity.anim * 10) * 0.22;
    const blockW = 42 * scale;
    const blockH = 58 * scale;
    const topY = entity.y - blockH - 16 * scale;
    ctx.save();
    ctx.globalAlpha *= 0.98;
    drawText(entity.dodge === "left" ? "往左缺口" : "往右缺口", roadLaneCenter(gapLane, entity.y), topY - 12 * scale, Math.max(12, 15 * scale), entity.color, "center");
    for (let lane = 0; lane < 3; lane += 1) {
      const laneX = roadLaneCenter(lane, entity.y);
      if (lane === gapLane) {
        ctx.globalAlpha *= 0.9;
        strokeRect(laneX - blockW * 0.5, topY + 8 * scale, blockW, blockH - 10 * scale, COLORS.leaf, Math.max(2, 3 * scale));
        fillRect(laneX - 5 * scale, topY + blockH * 0.43, 10 * scale, 22 * scale, COLORS.leaf);
        fillRect(laneX - 16 * scale, topY + blockH * 0.56, 32 * scale, 7 * scale, COLORS.leaf);
        ctx.globalAlpha /= 0.9;
        continue;
      }
      fillRect(laneX - blockW * 0.5 - 4 * scale, topY + 3 * scale, blockW + 8 * scale, blockH, `rgba(216,36,60,${0.18 + pulse * 0.08})`);
      drawHazardBlock3D(laneX - blockW * 0.5, topY + 9 * scale, blockW, blockH - 10 * scale, entity.color, "!");
      for (let i = 0; i < 4; i += 1) {
        fillRect(laneX - blockW * 0.34 + i * blockW * 0.22, topY + 16 * scale + (i % 2) * 7 * scale, 6 * scale, blockH - 24 * scale, i % 2 ? "#ffffff" : entity.color);
      }
      drawHazardSymbol(entity, laneX - 36, topY + 10 * scale);
    }
    drawText(entity.short, roadLaneCenter(gapLane, entity.y), topY + blockH + 16 * scale, Math.max(11, 14 * scale), entity.color, "center");
    ctx.restore();
  }

  function drawJumpHazard(entity, x, y) {
    const pulse = 0.55 + Math.sin(entity.anim * 10) * 0.22;
    fillRect(x - 5, y + 34, 82, 30, `rgba(216,36,60,${0.18 + pulse * 0.08})`);
    drawHazardBlock3D(x + 4, y + 42, 66, 18, entity.color, "!");
    for (let i = 0; i < 4; i += 1) {
      fillRect(x + 9 + i * 16, y + 45, 8, 12, i % 2 ? "#ffffff" : entity.color);
    }
    fillRect(x + 1, y + 29, 8, 35, entity.color);
    fillRect(x + 66, y + 29, 8, 35, entity.color);
    fillRect(x + 8, y + 25, 62, 8, "#ffccd3");
    drawText("避紅色", x + 36, y + 28, 15, entity.color, "center");
    drawText(entity.short, x + 36, y + 75, 14, entity.color, "center");
    drawEntityLabel(entity, x + 36, y + 90, "danger");
  }

  function drawSlideHazard(entity, x, y) {
    const pulse = 0.55 + Math.sin(entity.anim * 10) * 0.22;
    fillRect(x - 6, y + 2, 84, 55, `rgba(216,36,60,${0.14 + pulse * 0.08})`);
    fillRect(x + 2, y + 7, 10, 58, entity.color);
    fillRect(x + 62, y + 7, 10, 58, entity.color);
    drawHazardBlock3D(x + 2, y + 10, 70, 18, entity.color, "!");
    fillRect(x + 14, y + 50, 46, 8, "rgba(255,255,255,.84)");
    for (let i = 0; i < 5; i += 1) {
      fillRect(x + 8 + i * 13, y + 14, 7, 10, i % 2 ? "#ffffff" : entity.color);
    }
    drawText("避紅色", x + 36, y + 43, 15, entity.color, "center");
    drawText(entity.short, x + 36, y + 75, 14, entity.color, "center");
    drawEntityLabel(entity, x + 36, y + 90, "danger");
  }

  function drawHazardPostAction(entity, x, y) {
    if (!entity.resolved || entity.resolveTimer <= 0) return;
    const alpha = clamp(entity.resolveTimer / (entity.resolved === "impact" ? 1.05 : 0.95), 0, 1);
    const color = entity.resolved === "impact" ? entity.color : COLORS.leaf;
    const cx = x + 36;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (entity.resolved === "impact") {
      const shake = Math.sin(state.time * 34) * 5;
      strokeRect(x - 7 + shake, y - 4, 84, 78, entity.color, 4);
      for (let i = 0; i < 6; i += 1) {
        const sx = x + 10 + i * 11;
        strokePerspectiveLine(sx, y + 20 + (i % 2) * 7, sx + (i % 2 ? -12 : 12), y + 34 + i * 3, entity.color, 3);
      }
      drawCircle(cx + 24, y + 12, 8, "#ffffff");
      drawCircle(cx + 24, y + 12, 4, entity.color);
      ctx.restore();
      return;
    }
    if (entity.resolved === "clear") {
      ctx.globalAlpha = alpha * 0.55;
      for (let i = 0; i < 3; i += 1) fillRect(cx - 32 + i * 28, y + 82 + i * 4, 20, 5, COLORS.leaf);
      ctx.restore();
      return;
    }
    const dodge = entity.resolveDodge || entity.dodge;
    if (dodge === "jump") {
      for (let i = 0; i < 6; i += 1) {
        const t = i / 5;
        const px = cx - 42 + t * 84;
        const py = y + 20 - Math.sin(t * Math.PI) * 58;
        drawCircle(px, py, i === 2 || i === 3 ? 6 : 4, i % 2 ? "#ffffff" : color);
      }
      strokeRect(cx - 30, y - 52, 60, 28, color, 3);
      fillRect(cx - 8, y - 62, 16, 34, color);
    } else if (dodge === "slide") {
      for (let i = 0; i < 5; i += 1) fillRect(cx - 56 + i * 25, y + 61 + i % 2 * 7, 34, 5, i % 2 ? "#ffffff" : color);
      strokeRect(cx - 48, y + 50, 96, 26, color, 3);
      fillRect(cx - 22, y + 61, 44, 7, color);
    } else {
      const laneX = roadLaneCenter(entity.gapLane ?? playerEffectiveLane(), entity.y);
      strokeRect(laneX - 35, y + 7, 70, 64, color, 4);
      fillRect(laneX - 5, y + 25, 10, 34, color);
      fillRect(laneX - 23, y + 43, 46, 8, color);
    }
    ctx.restore();
  }

  function drawHazardSymbol(entity, x, y) {
    const c = entity.color;
    ctx.save();
    ctx.translate(x + 36, y + 39);
    ctx.scale(1.16, 1.16);
    ctx.translate(-(x + 36), -(y + 39));
    fillRect(x + 16, y + 18, 40, 7, c);
    fillRect(x + 16, y + 49, 40, 7, c);
    if (entity.key === "flavor") {
      drawQuad(x + 24, y + 21, x + 43, y + 18, x + 47, y + 52, x + 27, y + 56, "#ffffff");
      fillRect(x + 29, y + 16, 13, 8, c);
      fillRect(x + 32, y + 31, 12, 8, c);
      strokePerspectiveLine(x + 45, y + 24, x + 56, y + 18, c, 3);
      strokePerspectiveLine(x + 46, y + 31, x + 58, y + 31, c, 3);
      strokeRect(x + 26, y + 23, 20, 30, c, 2);
    } else if (entity.key === "coloring") {
      drawCircle(x + 36, y + 39, 18, "#ffffff");
      drawQuad(x + 36, y + 17, x + 48, y + 37, x + 36, y + 57, x + 24, y + 37, c);
      drawCircle(x + 36, y + 40, 8, "#ffffff");
      fillRect(x + 31, y + 17, 10, 9, "#ffffff");
      strokeCircle(x + 36, y + 39, 18, c, 2);
    } else if (entity.key === "dirty") {
      fillRect(x + 22, y + 24, 29, 33, "#fff1cf");
      strokeRect(x + 22, y + 24, 29, 33, c, 3);
      for (let i = 0; i < 6; i += 1) {
        const dx = x + 18 + (i % 3) * 14;
        const dy = y + 28 + Math.floor(i / 3) * 12;
        fillRect(dx, dy, 9, 9, i % 2 ? "#6f1020" : c);
        fillRect(dx - 2, dy + 3, 13, 3, i % 2 ? "#6f1020" : c);
      }
    } else if (entity.key === "sugar") {
      drawQuad(x + 18, y + 33, x + 35, y + 27, x + 45, y + 39, x + 27, y + 47, "#ffffff");
      drawQuad(x + 35, y + 27, x + 53, y + 31, x + 61, y + 43, x + 45, y + 39, "#ffd9df");
      drawQuad(x + 27, y + 47, x + 45, y + 39, x + 61, y + 43, x + 42, y + 55, "#ffe8ed");
      strokePerspectiveLine(x + 18, y + 33, x + 35, y + 27, c, 2);
      strokePerspectiveLine(x + 35, y + 27, x + 53, y + 31, c, 2);
      strokePerspectiveLine(x + 42, y + 55, x + 61, y + 43, c, 2);
    } else if (entity.key === "sour") {
      drawCircle(x + 36, y + 40, 20, "#fff6d8");
      drawCircle(x + 28, y + 34, 5, c);
      drawCircle(x + 43, y + 31, 5, c);
      drawCircle(x + 49, y + 44, 5, c);
      drawText("酸", x + 36, y + 47, 22, c, "center");
      strokeCircle(x + 36, y + 40, 20, c, 3);
    } else if (entity.key === "ice") {
      drawCircle(x + 36, y + 42, 21, "#ffffff");
      drawCircle(x + 29, y + 35, 13, "#fff4dc");
      drawCircle(x + 44, y + 34, 12, "#fff4dc");
      fillRect(x + 21, y + 45, 31, 12, "#ffd9df");
      strokeCircle(x + 36, y + 42, 21, c, 3);
      fillRect(x + 34, y + 22, 4, 38, c);
    } else if (entity.key === "sticky") {
      fillRect(x + 18, y + 24, 36, 20, c);
      fillRect(x + 23, y + 44, 7, 18, c);
      fillRect(x + 36, y + 44, 7, 21, c);
      fillRect(x + 49, y + 44, 6, 15, c);
      fillRect(x + 23, y + 18, 25, 9, "#ffffff");
      drawText("黏", x + 36, y + 40, 18, "#ffffff", "center");
    } else {
      drawText("!", x + 36, y + 39, 30, c, "center");
    }
    ctx.restore();
  }

  function drawFeatureChip(entity, cx, y) {
    const def = entity.bonus || entity.hazard || TYPES[entity.key];
    if (!def?.effect) return;
    const text = def.effect;
    const compact = isMobileLayout();
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
      drawQuad(cx - 24, cy + 5, cx + 2, cy - 10, cx + 22, cy - 1, cx - 3, cy + 16, COLORS.orange);
      fillRect(cx - 6, cy - 19, 18, 18, COLORS.yellow);
      fillRect(cx + 11, cy - 1, 18, 8, COLORS.yellow);
      strokePerspectiveLine(cx - 22, cy + 9, cx + 26, cy + 5, COLORS.ink, 3);
      strokePerspectiveLine(cx - 16, cy + 15, cx + 5, cy + 18, COLORS.ink, 3);
      for (let i = 0; i < 3; i += 1) {
        fillRect(cx - 34 - i * 7, cy - 8 + i * 7, 12, 4, i % 2 ? COLORS.yellow : "#ffffff");
      }
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
    } else if (bonus.key === "roadSweep") {
      fillRect(cx - 24, cy - 5, 42, 10, COLORS.aquaDeep);
      fillRect(cx + 10, cy - 15, 10, 30, COLORS.aquaDeep);
      for (let i = 0; i < 4; i += 1) {
        fillRect(cx - 22 + i * 12, cy + 13 + i % 2 * 3, 8, 9, COLORS.yellow);
      }
      strokeRect(cx - 28, cy - 18, 56, 38, color, 3);
    } else if (bonus.key === "streetGuard") {
      strokeRect(cx - 23, cy - 18, 46, 36, COLORS.leaf, 4);
      fillRect(cx - 16, cy - 10, 8, 20, "#ffffff");
      fillRect(cx + 8, cy - 10, 8, 20, "#ffffff");
      fillRect(cx - 23, cy - 3, 46, 6, COLORS.leaf);
    } else if (bonus.key === "yogurtMagnet") {
      strokeCircle(cx, cy, 22, COLORS.orange, 4);
      fillRect(cx - 20, cy - 18, 13, 30, COLORS.orange);
      fillRect(cx + 7, cy - 18, 13, 30, COLORS.orange);
      drawCapsule(cx - 13, cy + 7, 26, 10, "#ffffff", COLORS.aqua, COLORS.orange);
    } else if (bonus.key === "pureWave") {
      for (let i = 0; i < 3; i += 1) {
        strokeCircle(cx, cy, 12 + i * 8 + Math.sin(entity.anim * 8) * 2, i % 2 ? "#ffffff" : COLORS.aquaDeep, 2);
      }
      fillRect(cx - 6, cy - 22, 12, 44, color);
      fillRect(cx - 22, cy - 6, 44, 12, color);
    } else {
      drawPixelStar(cx, cy, color);
    }
  }

  function drawHazardAlert(entity, x, y) {
    const close = Math.abs(entity.x + entity.w / 2 - player.x) < 56 && entity.y < player.y && player.y - entity.y < Math.min(430, state.height * 0.48);
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
    const close = Math.abs(entity.x + entity.w / 2 - player.x) < 70 && entity.y < player.y && player.y - entity.y < Math.min(310, state.height * 0.38);
    if (state.phase !== "playing" || !close) return;
    const laneX = roadLaneCenter(entity.lane, entity.y);
    const pulse = 0.45 + Math.sin(state.time * 18) * 0.25;
    ctx.save();
    ctx.globalAlpha = 0.06 + pulse * 0.05;
    fillRect(laneX - 42, entity.y - 34, 84, Math.min(250, player.y - entity.y + 44), entity.color);
    ctx.globalAlpha = 0.28 + pulse * 0.18;
    for (let y = entity.y + 6; y < Math.min(player.y + 18, entity.y + 260); y += 54) {
      const x = roadLaneCenter(entity.lane, y);
      fillRect(x - 18, y - 4, 36, 7, entity.color);
    }
    ctx.restore();
  }

  function drawEntityLabel(entity, cx, y, mode = "plain") {
    const text = entity.label || entity.short;
    const compact = isMobileLayout();
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
      roadSweep: { kind: "boost", dx: wobble * 4, dy: -Math.abs(wobble) * 5, rot: wobble * 0.07, sx: 1.16, sy: 0.86 },
      streetGuard: { kind: "shield", dx: 0, dy: -2, rot: 0, sx: 1.08, sy: 0.94 },
      yogurtMagnet: { kind: "float", dx: wobble * 1.8, dy: -Math.abs(wobble) * 6, rot: wobble * 0.02, sx: 1.06, sy: 0.96 },
      pureWave: { kind: "crystal", dx: wobble * 2, dy: -Math.abs(wobble) * 4, rot: wobble * 0.04, sx: 1.08, sy: 0.94 },
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
    const jumpLift = getJumpLift();
    const sliding = player.slideTimer > 0;
    const jumpProgress = player.jumpTimer > 0 ? clamp(1 - player.jumpTimer / JUMP_DODGE_SECONDS, 0, 1) : 0;
    const jumpPose = Math.sin(jumpProgress * Math.PI);
    const crouchPose = sliding ? clamp(player.slideTimer / SLIDE_DODGE_SECONDS, 0.35, 1) : 0;
    const x = Math.round(player.x + (reaction?.dx || 0));
    const y = Math.round(player.y - 76 + Math.sin(player.stepBob) * 3 + (reaction?.dy || 0) - jumpLift + (sliding ? 18 : 0));
    const flash = player.invuln > 0 && Math.floor(state.time * 16) % 2 === 0;
    if (flash) return;
    const work = player.actionTimer > 0;
    const armLift = work ? -13 : Math.sin(player.stepBob) * 3;
    const hair = "#342529";
    const hairLight = "#5a3f45";
    const skin = "#ffd9bd";
    const blush = "#f19aa0";
    const silver = "#d9e4ea";
    const weightStage = getWeightStage();
    const weightStageLevel = weightStage === "danger" ? 3 : weightStage === "heavy" ? 2 : weightStage === "warning" ? 1 : 0;
    const sweater = weightStage === "danger" ? "#fff0ef" : weightStage === "heavy" ? "#fff3e4" : "#fff7ed";
    const sweaterShadow = weightStage === "danger" ? "#eec2bf" : weightStage === "heavy" ? "#ead1bd" : "#eadfd3";
    const weightScale = getPlayerWeightScale();
    const bodyW = 46 + Math.round((weightScale - 1) * 74) + weightStageLevel * 6;
    const bodyX = x - bodyW / 2;
    const bellyDrop = Math.round((weightScale - 1) * 28 + state.weightPulse * 2 + weightStageLevel * 7);

    ctx.save();
    ctx.translate(x, y + 99);
    ctx.rotate((reaction?.rot || 0) + Math.sin(jumpProgress * Math.PI * 2) * jumpPose * 0.04);
    ctx.scale(
      PLAYER_VISUAL_SCALE * (reaction?.sx || 1) * (1 + crouchPose * 0.16 + jumpPose * 0.04),
      PLAYER_VISUAL_SCALE * (reaction?.sy || 1) * (1 - crouchPose * 0.24 - jumpPose * 0.03) * (1 + Math.min(0.08, (weightScale - 1) * 0.28))
    );
    ctx.translate(-x, -(y + 99));

    drawPixelShadow(x - 2, player.y - 10, 58 + (weightScale - 1) * 58);

    // Oversized white knit sweater silhouette.
    fillRect(bodyX, y + 32, bodyW, 40 + bellyDrop, sweater);
    fillRect(x - 18 - (bodyW - 46) * 0.18, y + 69 + bellyDrop, 36 + (bodyW - 46) * 0.36, 8, sweaterShadow);
    strokeRect(bodyX, y + 32, bodyW, 40 + bellyDrop, COLORS.ink, 3);
    for (let i = 0; i < 4; i += 1) {
      fillRect(bodyX + 6 + i * (bodyW - 12) / 4, y + 38, 4, 26 + bellyDrop, "rgba(213,199,186,.42)");
    }
    if (weightStageLevel > 0) {
      const warnColor = weightStage === "danger" ? "#d8243c" : weightStage === "heavy" ? COLORS.orange : COLORS.yellow;
      fillRect(bodyX + 5, y + 58 + Math.floor(bellyDrop * 0.44), bodyW - 10, 5 + weightStageLevel, warnColor);
      fillRect(bodyX + 9, y + 65 + Math.floor(bellyDrop * 0.52), bodyW - 18, 3, "rgba(36,50,58,.22)");
      for (let i = 0; i < weightStageLevel + 1; i += 1) {
        fillRect(bodyX - 8 - i * 5, y + 49 + i * 10, 5, 12, warnColor);
        fillRect(bodyX + bodyW + 3 + i * 5, y + 49 + i * 10, 5, 12, warnColor);
      }
    }

    // Small UGOODAYS apron over the sweater.
    fillRect(x - 14, y + 43, 28, 26, COLORS.aqua);
    fillRect(x - 9, y + 51, 18, 8, "#dff6ff");
    drawText("UG", x, y + 58, 8, COLORS.aquaDeep, "center");

    fillRect(x - 12, y + 75 + bellyDrop, 10, 15, "#3e6676");
    fillRect(x + 6, y + 75 + bellyDrop, 10, 15, "#3e6676");
    fillRect(x - 16, y + 89 + bellyDrop, 18, 8, COLORS.ink);
    fillRect(x + 4, y + 89 + bellyDrop, 18, 8, COLORS.ink);
    if (jumpPose > 0.08) {
      fillRect(x - 22, y + 69 + bellyDrop - jumpPose * 10, 16, 9, "#3e6676");
      fillRect(x + 8, y + 69 + bellyDrop - jumpPose * 8, 16, 9, "#3e6676");
      fillRect(x - 27, y + 65 + bellyDrop - jumpPose * 11, 15, 7, COLORS.ink);
      fillRect(x + 15, y + 65 + bellyDrop - jumpPose * 9, 15, 7, COLORS.ink);
      fillRect(x - 42, y + 25 - jumpPose * 12, 12, 26, sweater);
      fillRect(x + 30, y + 25 - jumpPose * 12, 12, 26, sweater);
      strokeRect(x - 42, y + 25 - jumpPose * 12, 12, 26, COLORS.ink, 2);
      strokeRect(x + 30, y + 25 - jumpPose * 12, 12, 26, COLORS.ink, 2);
    }
    if (crouchPose > 0) {
      fillRect(x - 25, y + 83 + bellyDrop, 26, 9, "#3e6676");
      fillRect(x + 5, y + 82 + bellyDrop, 28, 9, "#3e6676");
      fillRect(x - 31, y + 89 + bellyDrop, 20, 7, COLORS.ink);
      fillRect(x + 23, y + 88 + bellyDrop, 20, 7, COLORS.ink);
      fillRect(x - 45, y + 53, 25, 8, sweater);
      fillRect(x + 21, y + 53, 28, 8, sweater);
    }

    // Rounded short bob, side part, and visible gold hair clip.
    fillRect(x - 22, y + 1, 44, 18, hair);
    fillRect(x - 26, y + 13, 13, 29, hair);
    fillRect(x + 12, y + 13, 13, 26, hair);
    fillRect(x - 17, y - 3, 24, 9, hairLight);
    fillRect(x - 9, y + 1, 18, 7, hair);
    fillRect(x - 20, y + 18, 7, 12, hairLight);
    fillRect(x - 10, y - 12, 8, 8, COLORS.berry);
    fillRect(x + 2, y - 12, 8, 8, COLORS.berry);
    fillRect(x - 3, y - 8, 8, 8, "#f19aa0");
    fillRect(x + 13, y + 8, 17, 5, "#d6a845");
    fillRect(x + 18, y + 3, 5, 15, "#f2d37a");
    fillRect(x + 24, y + 7, 5, 8, "#f8e3a6");

    fillRect(x - 18, y + 14, 36, 28, skin);
    fillRect(x - 14, y + 41, 28, 5, "#f1c0aa");
    fillRect(x - 13, y + 22, 8, 8, "#ffffff");
    fillRect(x + 6, y + 22, 8, 8, "#ffffff");
    fillRect(x - 10, y + 24, 4, 5, COLORS.ink);
    fillRect(x + 9, y + 24, 4, 5, COLORS.ink);
    fillRect(x - 8, y + 23, 2, 2, "#ffffff");
    fillRect(x + 11, y + 23, 2, 2, "#ffffff");
    if (reaction?.hazard) {
      fillRect(x - 14, y + 22, 12, 3, COLORS.berry);
      fillRect(x - 12, y + 18, 3, 12, COLORS.berry);
      fillRect(x + 4, y + 22, 12, 3, COLORS.berry);
      fillRect(x + 13, y + 18, 3, 12, COLORS.berry);
    } else if (reaction) {
      fillRect(x - 13, y + 25, 8, 3, player.reactionColor);
      fillRect(x + 6, y + 25, 8, 3, player.reactionColor);
    }
    const cheekSize = 9 + Math.min(5, Math.round((weightScale - 1) * 18));
    fillRect(x - 20, y + 31, cheekSize, 5, blush);
    fillRect(x + 20 - cheekSize, y + 31, cheekSize, 5, blush);
    fillRect(x - 5, y + 34, 4, 4, COLORS.berry);
    fillRect(x + 1, y + 36, 8, 4, COLORS.berry);
    fillRect(x + 3, y + 40, 7, 6, "#e66f82");
    fillRect(x + 5, y + 43, 4, 2, "#ffd1d7");
    if (weightStageLevel > 0) {
      fillRect(x + 22, y + 20, 5, 9 + weightStageLevel * 2, "#7fc3de");
      fillRect(x + 20, y + 29 + weightStageLevel * 2, 9, 5, "#7fc3de");
    }
    if (weightStage === "danger") {
      drawText("!", x + 30, y - 10, 18, "#d8243c", "center");
      drawText("!", x - 30, y - 7, 14, "#d8243c", "center");
    }

    // Relaxed left hand with tiny ring highlights.
    const leftHandY = y + 45 - armLift * 0.3;
    fillRect(x - 38, leftHandY, 19, 10, sweater);
    fillRect(x - 49, leftHandY - 1, 15, 12, skin);
    fillRect(x - 48, leftHandY - 6, 5, 10, skin);
    fillRect(x - 40, leftHandY - 6, 5, 10, skin);
    fillRect(x - 48, leftHandY - 2, 5, 3, silver);
    fillRect(x - 40, leftHandY - 2, 5, 3, silver);
    fillRect(x - 47, leftHandY - 2, 3, 1, "#ffffff");
    fillRect(x - 39, leftHandY - 2, 3, 1, "#ffffff");

    // Right-handed tool arm: thick sweater sleeve, covered hand, and spoon.
    fillRect(x + 21, y + 43 + armLift, 24, 12, sweater);
    fillRect(x + 39, y + 38 + armLift, 16, 17, sweater);
    fillRect(x + 42, y + 51 + armLift, 12, 4, sweaterShadow);
    strokeRect(x + 21, y + 43 + armLift, 24, 12, COLORS.ink, 2);
    fillRect(x + 42, y + 40 + armLift, 22, 5, "#cbd8dd");
    fillRect(x + 63, y + 35 + armLift, 11, 11, "#e8f4f7");

    if (work) {
      drawActionSlash(x + 76, y + 43 + armLift);
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

  function getJumpLift() {
    if (player.jumpTimer <= 0) return 0;
    const progress = 1 - player.jumpTimer / JUMP_DODGE_SECONDS;
    return Math.sin(clamp(progress, 0, 1) * Math.PI) * 54;
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
      const road = getRoadMetrics();
      ctx.globalAlpha = alpha * 0.12;
      for (let i = 0; i < 7; i += 1) {
        const depth = i / 6;
        const y = road.horizonY + (road.nearY - road.horizonY) * depth ** 1.14;
        const x = roadLaneCenter(burst.lane, y);
        const width = 10 + depth * 44;
        const height = 5 + depth * 8;
        fillRect(x - width / 2, y - height / 2, width, height, burst.color);
      }
      ctx.globalAlpha = alpha * 0.42;
      strokePerspectiveLine(roadLaneCenter(burst.lane, road.horizonY), road.horizonY, roadLaneCenter(burst.lane, road.nearY), road.nearY + 24, "#ffffff", 2);
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

  function drawBrandBurst(burst) {
    const alpha = clamp(burst.life / burst.maxLife, 0, 1);
    const progress = 1 - alpha;
    const easeOut = 1 - (1 - progress) * (1 - progress);
    const pulse = 0.5 + Math.sin(state.time * 14 + burst.angle) * 0.5;
    const power = burst.power || 1;
    const scale = 0.82 + easeOut * 0.18 + pulse * 0.04 + Math.min(0.14, Math.max(0, power - 1) * 0.08);
    const x = burst.x;
    const y = burst.y - easeOut * 18;
    const color = burst.color || COLORS.aquaDeep;
    const cardW = clamp(160 + (burst.label || "").length * 9, 188, isMobileLayout() ? 238 : 310) * scale;
    const cardH = (isMobileLayout() ? 76 : 88) * scale;
    const logoW = Math.min(cardW * 0.56, 148 * scale);
    const logoH = logoW * 0.42;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(Math.sin(burst.angle + state.time * 2) * 0.025);

    const glow = 20 + pulse * 12;
    ctx.globalAlpha = alpha * 0.22;
    fillRect(-cardW / 2 - glow, -cardH / 2 - glow * 0.6, cardW + glow * 2, cardH + glow * 1.2, color);
    ctx.globalAlpha = alpha * 0.92;
    fillRect(-cardW / 2 + 6 * scale, -cardH / 2 + 7 * scale, cardW, cardH, "rgba(36,50,58,.18)");
    fillRect(-cardW / 2, -cardH / 2, cardW, cardH, "rgba(255,255,255,.94)");
    strokeRect(-cardW / 2, -cardH / 2, cardW, cardH, COLORS.ink, Math.max(2, 4 * scale));
    strokeRect(-cardW / 2 + 6 * scale, -cardH / 2 + 6 * scale, cardW - 12 * scale, cardH - 12 * scale, color, Math.max(2, 3 * scale));

    ctx.globalAlpha = alpha * (0.55 + pulse * 0.35);
    for (let i = 0; i < 10; i += 1) {
      const a = burst.angle + state.time * (burst.style === "rush" ? 3.2 : 1.9) + i * Math.PI * 2 / 10;
      const rX = cardW * (0.46 + (i % 2) * 0.08);
      const rY = cardH * (0.48 + (i % 3) * 0.06);
      fillRect(Math.cos(a) * rX - 4 * scale, Math.sin(a) * rY - 4 * scale, 8 * scale, 8 * scale, i % 2 ? "#ffffff" : color);
    }

    ctx.globalAlpha = alpha;
    drawBrandLogo(-logoW / 2, -cardH * 0.32, logoW, logoH, color);
    drawText(burst.label || "純淨達成", 0, cardH * 0.18, Math.max(16, 22 * scale), color, "center");
    drawText(burst.sub || "純粹優格多一點", 0, cardH * 0.38, Math.max(9, 12 * scale), COLORS.ink, "center");

    if (burst.style === "rush") {
      ctx.globalAlpha = alpha * 0.78;
      for (let i = 0; i < 5; i += 1) {
        fillRect(-cardW * 0.56 - i * 12 * scale, -cardH * 0.12 + i * 9 * scale, cardW * 0.36, 5 * scale, i % 2 ? "#ffffff" : color);
        fillRect(cardW * 0.2 + i * 14 * scale, -cardH * 0.26 + i * 8 * scale, cardW * 0.28, 5 * scale, i % 2 ? COLORS.yellow : color);
      }
    } else if (burst.style === "shield") {
      ctx.globalAlpha = alpha * 0.6;
      strokeRect(-cardW * 0.56, -cardH * 0.62, cardW * 1.12, cardH * 1.24, COLORS.leaf, Math.max(2, 4 * scale));
    }
    ctx.restore();
  }

  function drawBrandLogo(x, y, w, h, color) {
    if (logo.complete && logo.naturalWidth > 0) {
      ctx.drawImage(logo, x, y, w, h);
      return;
    }
    drawCircle(x + h * 0.55, y + h * 0.52, h * 0.42, COLORS.aqua);
    drawCircle(x + h * 0.38, y + h * 0.62, h * 0.09, "#ffffff");
    drawCircle(x + h * 0.72, y + h * 0.62, h * 0.09, "#ffffff");
    fillRect(x + h * 0.47, y + h * 0.78, h * 0.32, h * 0.06, "#ffffff");
    drawText("純粹好食", x + h * 1.12, y + h * 0.65, h * 0.38, color, "left");
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
    const top = isMobileLayout() ? 300 / getSceneScale() : 138;
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
    const baseY = player.y - 150;
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
    const y = player.y;
    const pulse = 0.5 + Math.sin(state.time * 16) * 0.28;
    ctx.save();
    if (isMobileLayout()) {
      const scale = getSceneScale();
      const touchWorldX = screenToWorldX(touch.lastX);
      ctx.globalAlpha = 0.44 + pulse * 0.18;
      strokeCircle(x, y - 42, 34 + pulse * 6, COLORS.aquaDeep, 3);
      strokeCircle(x, y - 42, 20 + pulse * 4, "#ffffff", 2);
      fillRect(x - 4, y - 86, 8, 18, "#ffffff");
      fillRect(x - 4, y - 18, 8, 18, "#ffffff");
      ctx.globalAlpha = 0.24;
      fillRect(0, state.height - 126 / scale, state.width, 2 / scale, COLORS.aquaDeep);
      fillRect(touchWorldX - 22 / scale, state.height - 56 / scale, 44 / scale, 6 / scale, COLORS.aquaDeep);
      ctx.restore();
      return;
    }
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
    const style = key === "cleanBoost" || key === "streetGuard" ? "shield" : key === "probioticBoost" || key === "yogurtMagnet" ? "magnet" : key === "rushBoost" || key === "roadSweep" ? "speed" : key === "comboBoost" ? "confetti" : key === "timeBurst" || key === "pureWave" ? "stamp" : "slow";
    emitImpactBurst(x, y, color, style, 1.25);
    emitImpactParticles(x, y, [color, "#ffffff", COLORS.yellow], 24, { spread: Math.PI * 2, speedMin: 100, speedMax: 280, friction: 0.95, spin: 10, shape: key === "calciumBoost" || key === "pureWave" ? "diamond" : "spark" });
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
    if (!Number.isFinite(lane)) return;
    state.bursts.push({
      type: "lane",
      lane,
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

  function canEntityCollideWithPlayer(entity) {
    if (!Number.isFinite(entity.lane)) return true;
    if (isLaneGapHazard(entity)) return true;
    const currentLane = entity.type === "hazard" ? playerEffectiveLane() : player.lane;
    if (entity.lane !== (currentLane ?? player.lane)) {
      if (state.magnetTime > 0 && entity.type !== "hazard") {
        const laneCenter = roadLaneCenter(entity.lane, entity.y);
        const itemCenter = Number.isFinite(entity.x) ? entity.x + entity.w / 2 : laneCenter;
        return Math.abs(itemCenter - player.x) <= Math.max(16, 22 * (entity.depthScale || 1));
      }
      return false;
    }
    return entity.lane === (currentLane ?? player.lane);
  }

  function playerRect() {
    const arcadeReach = (state.width < 620 ? 3 : 0) + Math.min(5, Math.floor(state.combo / 10) * 1.2);
    const weightScale = getPlayerWeightScale();
    const weightReach = Math.max(0, (weightScale - 1) * 10);
    const width = 46 + arcadeReach * 2 + weightReach;
    const height = 76 + Math.max(0, (weightScale - 1) * 12);
    return { x: player.x - width / 2, y: player.y - 76, w: width, h: height };
  }

  function entityRect(entity) {
    const scale = entity.depthScale || roadEntityScale(entity.y);
    if (isLaneGapHazard(entity)) {
      const road = getRoadMetrics();
      const depth = roadDepthAtY(entity.y);
      const width = roadWidthAtDepth(depth) * 0.9;
      const height = (entity.h + 42) * scale;
      return { x: road.centerX - width / 2, y: entity.y - height + 10, w: width, h: height };
    }
    const typeScale = entity.type === "hazard" ? 0.72 : entity.type === "station" ? 0.64 : entity.type === "bonus" ? 0.62 : 0.54;
    const heightScale = entity.type === "hazard" ? 0.82 : entity.type === "station" ? 0.74 : 0.66;
    const width = entity.w * typeScale * scale;
    const height = (entity.h * heightScale + 8) * scale;
    const laneCx = Number.isFinite(entity.lane) ? roadLaneCenter(entity.lane, entity.y) : entity.x + entity.w / 2;
    const cx = state.magnetTime > 0 && entity.type !== "hazard" ? entity.x + entity.w / 2 : laneCx;
    return { x: cx - width / 2, y: entity.y - height + 10, w: width, h: height };
  }

  function overlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function formatMissingNeeds(missing, limit = 4) {
    if (!missing.length) return "材料已齊";
    return missing
      .slice(0, limit)
      .map((item) => `${(TYPES[item.key] || {}).label || item.key}x${item.count}`)
      .join("、");
  }

  function renderNeedChips(hint) {
    const items = (hint.needs || []).slice().sort((a, b) => {
      if (a.ready !== b.ready) return a.ready ? 1 : -1;
      if (a.missing !== b.missing) return b.missing - a.missing;
      return laneForKey(a.key) - laneForKey(b.key);
    });
    return items
      .map((item) => {
        const def = TYPES[item.key] || {};
        const label = def.label || item.key;
        const short = def.short || label.slice(0, 1);
        const color = def.color || hint.recipe.color;
        const countText = item.missing > 1 ? `x${item.missing}` : "";
        const statusText = item.ready ? "✓" : countText || "缺";
        return `
          <span class="recipe-need-chip ${item.ready ? "is-ready" : "is-missing"}" aria-label="${escapeHtml(label)}${item.ready ? "已收集" : `缺 ${item.missing}`}">
            <span class="recipe-need-icon" style="--need-color:${escapeHtml(color)}">${escapeHtml(short)}</span>
            <span class="recipe-need-status">${escapeHtml(statusText)}</span>
            <span class="recipe-need-text">${escapeHtml(label)}${escapeHtml(countText)}</span>
          </span>
        `;
      })
      .join("");
  }

  function renderRecipe() {
    const hint = getRecipeHint();
    if (!hint) {
      dom.orderName.textContent = `已做 ${state.totalYogurts} 杯優格`;
      dom.recipeList.innerHTML = "";
      return;
    }
    const progress = hint.totalUnits > 0 ? hint.ownedUnits / hint.totalUnits : 0;
    const readyText = hint.ready ? "材料齊" : `缺 ${hint.missingUnits}`;
    dom.orderName.textContent = `下一杯：${hint.recipe.label}`;
    dom.recipeList.innerHTML = `
      <div class="recipe-hint ${hint.ready ? "is-ready" : ""}">
        <div class="recipe-hint-top">
          <strong>${escapeHtml(hint.recipe.label)}</strong>
          <span>${escapeHtml(readyText)}</span>
        </div>
        <div class="recipe-progress" aria-hidden="true"><span style="width:${Math.round(progress * 100)}%"></span></div>
        <div class="recipe-need-list">${renderNeedChips(hint)}</div>
      </div>
    `;
  }

  function updateHud() {
    const diff = getDifficulty();
    const weightStage = getWeightStage();
    dom.level.textContent = state.weightDisplayKg.toFixed(1);
    dom.level.parentElement?.classList.toggle("weight-warning", weightStage === "warning" || weightStage === "heavy" || weightStage === "danger");
    dom.level.parentElement?.classList.toggle("weight-heavy", weightStage === "heavy" || weightStage === "danger");
    dom.level.parentElement?.classList.toggle("weight-danger", weightStage === "danger");
    dom.score.textContent = formatNumber(state.score);
    dom.combo.textContent = String(state.combo);
    dom.time.textContent = String(Math.max(0, Math.ceil(state.timeRemaining)));
    dom.highScore.textContent = formatNumber(Math.max(state.highScore, state.score));
    dom.purityText.textContent = `${Math.round(state.purity)}%`;
    dom.purityFill.style.width = `${clamp(state.purity, 0, 100)}%`;
    dom.purityFill.classList.toggle("is-danger", state.purity <= PURITY_ALERT_PERCENT);
    dom.feverText.textContent = state.feverTime > 0 ? "PURE" : `${Math.round(state.fever)}%`;
    dom.feverFill.style.width = `${state.feverTime > 0 ? 100 : clamp(state.fever, 0, 100)}%`;
    dom.carry.textContent = buildCarryText();
    dom.playerName.textContent = state.playerName;
    const rushNeed = 15 + state.customFlavors * 3.5 + Math.min(8, state.level * 0.45);
    const rushPct = Math.round(clamp(state.flavorCharge / rushNeed, 0, 1) * 100);
    const hint = getRecipeHint();
    const hintText = hint
      ? `${hint.recipe.label}${hint.ready ? "材料齊" : `缺${formatMissingNeeds(hint.missing, 2)}`}`
      : "先收鮮奶與益菌";
    const idleText = weightStage === "danger"
      ? "體型警戒，下一個紅色可能直接爆掉"
      : weightStage === "heavy"
        ? "體型明顯變重，優先做官方純粹優格"
        : weightStage === "warning"
          ? "開始變重，少碰風味加料"
          : state.idleTime > 1 ? "紅色危險物正在追線，滑動躲開" : "純粹優格不增重，紅色全躲";
    dom.fact.textContent = `${diff.name} / 節奏 ${state.level} / 體重 ${state.weightDisplayKg.toFixed(1)}kg / ${idleText} / 下一杯 ${hintText} / RUSH ${rushPct}%`;
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
    state.paused = false;
    state.pauseLandmark = null;
    hidePauseDomOverlay();
    updatePauseUi();
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
      yogurts: state.totalYogurts,
      orders: state.totalYogurts,
      level: state.level,
      weight: Number(state.weightKg.toFixed(1)),
      gameOverKind: state.gameOverKind,
      date: new Date().toISOString(),
    });
    renderLeaderboard();
    updateHud();
    dom.resultTitle.textContent = state.gameOverKind === "weight" ? "70kg 警戒！換吃純粹好食" : `做出 ${state.totalYogurts} 杯優格`;
    dom.resultCopy.innerHTML = buildSettlementHtml(reason);
    dom.finalScore.textContent = formatNumber(state.score);
    dom.finalCombo.textContent = String(state.maxCombo);
    dom.finalLevel.textContent = `${state.weightKg.toFixed(1)}kg`;
    dom.gameOverOverlay.classList.remove("hidden");
  }

  function copyResult() {
    const text = `我在純粹好食多一點健康優格快線做出 ${state.totalYogurts} 杯優格，積分 ${formatNumber(state.score)}，最高連吃 ${state.maxCombo}。`;
    const shareText = state.gameOverKind === "weight"
      ? `${text} 紅色添加物讓體重衝到 70kg，下一把改吃純粹好食官方優格。`
      : `${text} 最後體重 ${state.weightKg.toFixed(1)}kg`;
    navigator.clipboard?.writeText(shareText).then(
      () => showToast("戰績已複製"),
      () => showToast(shareText)
    );
  }

  function buildSettlementHtml(reason) {
    const rows = YOGURT_RECIPES
      .map((recipe, index) => {
        const count = state.yogurts[recipe.id] || 0;
        const subtotal = count * recipe.points;
        const nutrition = RECIPE_NUTRITION[recipe.id] || {};
        const netKcal = (nutrition.kcal || 0) - (nutrition.credit || 0);
        const kcalText = netKcal <= 0 ? `淨 ${netKcal} kcal` : `淨 +${netKcal} kcal`;
        return `
          <div class="settlement-row" style="--row-delay:${index * 70}ms;--recipe-color:${recipe.color}">
            <span class="settlement-dot"></span>
            <strong><span>${escapeHtml(recipe.label)}</span><small>${escapeHtml(nutrition.craft || "精心調配每一杯優格。")}</small></strong>
            <em>${count} 杯</em>
            <b>${recipe.points} 分/杯</b>
            <u>${kcalText}</u>
            <i>${subtotal} 分</i>
          </div>
        `;
      })
      .join("");
    const weightHtml = buildWeightGainHtml();
    const lead = state.totalYogurts > 0
      ? `${escapeHtml(reason)}。這次一共做出 ${state.totalYogurts} 杯，最高連吃 ${state.maxCombo}。`
      : `${escapeHtml(reason)}。這次還沒合成優格，先收鮮奶和益菌，再衝風味與工序。`;
    if (state.gameOverKind === "weight") {
      return `<span class="weight-fail-card">
        <span class="weight-fail-avatar" aria-hidden="true">
          <span class="avatar-head"></span>
          <span class="avatar-body"></span>
          <span class="avatar-belly"></span>
          <span class="avatar-label">70kg</span>
          <span class="avatar-alert alert-a"></span>
          <span class="avatar-alert alert-b"></span>
        </span>
        <span class="weight-fail-copy">
          <b>紅色添加物和重口味讓體重衝破警戒線。</b>
          <span>改吃純粹好食在售的鮮奶優格、希臘優格與原味優格飲：官方純粹優格不增重，連續吃滿 3 杯會啟動減重獎勵。</span>
        </span>
      </span><span class="settlement-lead"><b class="weight-result">最後體重 70.0kg</b>${lead}</span>${weightHtml}<span class="settlement-list">${rows}</span>`;
    }
    return `<span class="settlement-lead"><b class="weight-result">最後體重 ${state.weightKg.toFixed(1)}kg</b>${lead}</span>${weightHtml}<span class="settlement-list">${rows}</span>`;
  }

  function buildWeightGainHtml() {
    const sources = Object.values(state.weightGainSources || {}).sort((a, b) => b.amount - a.amount);
    const rows = sources.length
      ? sources
          .slice(0, 8)
          .map(
            (source, index) => `
              <span class="weight-gain-row" style="--row-delay:${index * 50}ms;--gain-color:${source.color}">
                <i></i>
                <strong>${escapeHtml(source.label)}</strong>
                <em>${escapeHtml(source.kind)}</em>
                <b>${source.count} 次</b>
                <u>+${Math.round(source.kcal)} kcal</u>
                <mark>+${source.amount.toFixed(1)}kg</mark>
              </span>
            `
          )
          .join("")
      : `<span class="weight-gain-row empty"><strong>沒有增重來源</strong><em>純粹好食節奏保持得很穩</em><mark>+0.0kg</mark></span>`;
    const netKcal = state.calorieIntakeKcal - state.calorieBurnKcal;
    const loss = state.weightLossTotal > 0 ? ` / 消耗換算 -${state.weightLossTotal.toFixed(1)}kg` : "";
    return `
      <span class="weight-gain-block">
        <span class="weight-gain-title">
          <strong>體重來源</strong>
          <em>攝取 ${Math.round(state.calorieIntakeKcal)} kcal / 日常消耗 ${Math.round(state.calorieBurnKcal)} kcal / 淨 ${netKcal >= 0 ? "+" : ""}${Math.round(netKcal)} kcal${loss}</em>
        </span>
        <span class="weight-gain-list">${rows}</span>
      </span>
    `;
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
      audio.bgmGain.gain.linearRampToValueAtTime(audio.muted ? 0 : getBgmVolume(), audio.context.currentTime + 0.18);
    }
    if (!audio.muted) {
      ensureAudio();
      if (state.phase === "playing" && !state.paused) startBgm(false);
      beep(520, 0.05, "square", 0.025);
    } else {
      stopBgm(0.18);
    }
  }

  function togglePause() {
    if (state.phase !== "playing") return;
    state.paused = !state.paused;
    controls.left = false;
    controls.right = false;
    controls.up = false;
    controls.down = false;
    controls.action = false;
    resetPointerControl();
    updatePauseUi();
    if (state.paused) {
      state.pauseLandmark = pickPauseLandmark(state.pauseLandmark?.model);
      renderPauseDomOverlay();
      stopBgm(0.12);
      showToast("已暫停");
    } else {
      state.pauseLandmark = null;
      hidePauseDomOverlay();
      showToast("繼續遊戲");
      startBgm(false);
    }
  }

  function updatePauseUi() {
    dom.root?.classList.toggle("is-game-paused", state.paused && state.phase === "playing");
    if (!dom.pauseButton || !dom.pauseIcon) return;
    dom.pauseIcon.textContent = state.paused ? "▶" : "Ⅱ";
    dom.pauseButton.setAttribute("aria-label", state.paused ? "繼續遊戲" : "暫停遊戲");
    dom.pauseButton.classList.toggle("is-paused", state.paused);
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
    audio.bgmCompressor = audio.context.createDynamicsCompressor();
    audio.bgmDelay = audio.context.createDelay(0.5);
    audio.bgmDelayGain = audio.context.createGain();
    audio.sfxGain.gain.value = 0.64;
    audio.bgmGain.gain.value = 0;
    audio.bgmCompressor.threshold.value = -24;
    audio.bgmCompressor.knee.value = 18;
    audio.bgmCompressor.ratio.value = 3;
    audio.bgmCompressor.attack.value = 0.025;
    audio.bgmCompressor.release.value = 0.26;
    audio.bgmDelay.delayTime.value = 0.245;
    audio.bgmDelayGain.gain.value = 0.16;
    audio.sfxGain.connect(audio.context.destination);
    audio.bgmGain.connect(audio.bgmCompressor);
    audio.bgmGain.connect(audio.bgmDelay);
    audio.bgmDelay.connect(audio.bgmDelayGain);
    audio.bgmDelayGain.connect(audio.bgmCompressor);
    audio.bgmCompressor.connect(audio.context.destination);
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
        if (!audio.muted && state.phase === "playing" && !state.paused) startBgm(reset);
      });
      return;
    }
    if (reset || !audio.bgmTimer) {
      audio.bgmStep = 0;
      audio.bgmNextTime = audio.context.currentTime + 0.05;
    }
    const now = audio.context.currentTime;
    const volume = getBgmVolume();
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
    if (audio.muted || !audio.context || !audio.bgmGain || state.phase !== "playing" || state.paused) return;
    const tempo = BGM.bpm + Math.min(12, Math.max(0, state.level - 1) * 0.32) + (state.flavorRushTime > 0 ? 5 : 0) + (state.feverTime > 0 ? 3 : 0);
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
    const phraseStep = step % BGM.melody.length;
    const fever = state.feverTime > 0;
    const rush = state.flavorRushTime > 0;
    const chord = BGM.chords[Math.floor(step / 8) % BGM.chords.length];
    if (barStep === 0 || barStep === 8) {
      playMusicChord(chord, time, stepSeconds * 8.7, rush ? 0.033 : 0.028);
    }
    if (beat === 0) playPerc(time, fever ? 0.014 : 0.009, 76, 0.052);
    if (barStep === 6 || barStep === 14 || rush && barStep === 10) playPerc(time + stepSeconds * 0.48, rush ? 0.007 : 0.0045, 520, 0.018);

    const bass = BGM.bass[phraseStep];
    if (bass) playTone(noteToFrequency(bass), time, stepSeconds * 3.5, "sine", rush ? 0.082 : 0.07, 0.05, 720);

    const arpeggio = BGM.arpeggio[phraseStep];
    if (arpeggio && (phraseStep % 4 === 0 || phraseStep % 4 === 2 || rush)) {
      playBell(noteToFrequency(arpeggio), time + stepSeconds * 0.15, stepSeconds * 1.7, rush ? 0.052 : 0.036, 3000);
    }

    const melody = BGM.melody[phraseStep];
    if (melody) {
      playBell(noteToFrequency(melody), time, stepSeconds * 2.8, fever || rush ? 0.112 : 0.094, 2600);
      const harmony = BGM.harmony[phraseStep];
      if (harmony && (fever || rush || state.combo >= 8)) {
        playBell(noteToFrequency(harmony), time + stepSeconds * 0.04, stepSeconds * 2.1, rush ? 0.052 : 0.034, 2400);
      }
    }

    const hook = BGM.hook[phraseStep];
    if (hook && (barStep === 2 || barStep === 6 || barStep === 10 || barStep === 14 || rush)) {
      playBell(noteToFrequency(hook), time + stepSeconds * 0.52, stepSeconds * 1.55, rush ? 0.066 : 0.04, 3600);
    }

    const sparkle = BGM.sparkle[phraseStep];
    if (sparkle && (fever || rush || step % 16 === 7 || state.combo >= 10)) {
      playBell(noteToFrequency(sparkle), time + stepSeconds * 0.25, stepSeconds * 1.2, rush ? 0.058 : 0.034, 4200);
    }
  }

  function getBgmVolume() {
    let volume = state.openingMode ? 0.148 : 0.132;
    if (state.flavorRushTime > 0) volume += 0.014;
    if (state.feverTime > 0) volume += 0.008;
    return volume;
  }

  function playMusicChord(chord, time, duration, volume) {
    chord.forEach((note, index) => {
      const frequency = noteToFrequency(note);
      playTone(frequency, time + index * 0.012, duration, index === 0 ? "sine" : "triangle", volume * (index === 0 ? 0.82 : 1), 0.22, 1500 + index * 220, {
        detune: index % 2 ? 4 : -3,
      });
    });
  }

  function playBell(frequency, time, duration, volume, cutoff) {
    if (!frequency) return;
    playTone(frequency, time, duration, "triangle", volume, 0.022, cutoff, { detune: -2 });
    playTone(frequency * 2, time + 0.006, duration * 0.62, "sine", volume * 0.22, 0.018, cutoff + 700, { detune: 3 });
  }

  function playTone(frequency, time, duration, type, volume, attack, cutoff, options = {}) {
    if (!audio.context || !audio.bgmGain || !frequency) return;
    const oscillator = audio.context.createOscillator();
    const filter = audio.context.createBiquadFilter();
    const gain = audio.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.detune.setValueAtTime(options.detune || 0, time);
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
    oscillator.type = frequency > 200 ? "triangle" : "sine";
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

  function positiveModulo(value, divisor) {
    return ((value % divisor) + divisor) % divisor;
  }

  function hexToRgb(hex) {
    const source = String(hex || "#000000");
    const rgbMatch = source.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
    }
    const clean = source.replace("#", "");
    const full = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean.padEnd(6, "0").slice(0, 6);
    const value = Number.parseInt(full, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
    };
  }

  function mixColor(from, to, amount) {
    const a = hexToRgb(from);
    const b = hexToRgb(to);
    const t = clamp(amount, 0, 1);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const blue = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r},${g},${blue})`;
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
  }
})();
