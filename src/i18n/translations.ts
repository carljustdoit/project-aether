export type Lang = "en" | "zh";

export const translations = {
    // ─── Navbar ───
    nav: {
        brand: { en: "PROJECT AETHER", zh: "天穹计划" },
        theProblem: { en: "THE PROBLEM", zh: "行业痛点" },
        theInnovation: { en: "THE INNOVATION", zh: "技术创新" },
        howItWorks: { en: "HOW IT WORKS", zh: "运行原理" },
        online: { en: "ONLINE", zh: "在线" },
        fleetOnline: { en: "FLEET ONLINE", zh: "机队在线" },
    },

    // ─── Hero ───
    hero: {
        overline: { en: "AETHER SYSTEM", zh: "天穹系统" },
        headline1: { en: "Planetary Heavy", zh: "全球重型" },
        headline2: { en: "Lift", zh: "运输" },
        headlineAccent: { en: "Network.", zh: "网络。" },
        sub: {
            en: "Utilizing century-old buoyancy technology to meet our future need for heavy infrastructure delivery — anywhere on Earth.",
            zh: "利用百年浮力技术，满足未来重型基础设施的全球运输需求——无论地球的任何角落。",
        },
        tagline: { en: "BUOYANCY, NOT THRUST.", zh: "浮力驱动，非推力。" },
        cta: { en: "EXPLORE THE SYSTEM", zh: "探索系统" },
        badge: { en: "ZERO INFRASTRUCTURE REQUIRED", zh: "零基础设施需求" },
        status: { en: "SYSTEM STATUS: OPERATIONAL", zh: "系统状态：运行中" },
    },

    // ─── Problem ───
    problem: {
        overline: { en: "THE PROBLEM", zh: "行业痛点" },
        headline1: { en: "The world builds", zh: "全世界都在用" },
        headline2: { en: "infrastructure", zh: "最艰难的方式" },
        headlineAccent: { en: "the hard way.", zh: "建设基础设施。" },
        body: {
            roadsCost: { en: "millions per mile", zh: "每英里造价数百万" },
            helicopters: { en: "expensive and limited", zh: "昂贵且运力有限" },
            remoteRegions: { en: "locked out", zh: "被拒之门外" },
            roadsPre: { en: "Roads cost ", zh: "道路造价" },
            roadsSuf: { en: ". ", zh: "。" },
            heliPre: { en: "Helicopters are ", zh: "直升机" },
            heliSuf: { en: ". ", zh: "。" },
            remotePre: { en: "Remote regions remain ", zh: "偏远地区依然" },
            remoteSuf: { en: ".", zh: "。" },
        },
        stats: [
            {
                value: "$2.3M",
                label: { en: "Average cost to build 1 mile of road in mountainous terrain", zh: "山区每英里道路的平均建设成本" },
            },
            {
                value: "4.2B",
                label: { en: "People live beyond reliable road networks worldwide", zh: "全球42亿人生活在可靠公路网络之外" },
            },
            {
                value: "72%",
                label: { en: "Of renewable energy projects delayed by transport logistics", zh: "可再生能源项目因运输物流而延误的比例" },
            },
            {
                value: "$44B",
                label: { en: "Annual cost of infrastructure delivery bottlenecks globally", zh: "全球基础设施运输瓶颈的年度成本" },
            },
        ],
        painPoints: [
            {
                title: { en: "WIND TURBINES STUCK AT PORTS", zh: "风力涡轮机滞留港口" },
                body: {
                    en: "A single turbine blade is 300 feet long. Moving one requires road closures, specialized trailers, and months of permitting. Many wind farm sites are simply unreachable.",
                    zh: "单个涡轮叶片长达300英尺。运输需要封路、特种拖车和数月的许可审批。许多风电场选址根本无法到达。",
                },
            },
            {
                title: { en: "ROADS CUT INTO MOUNTAINS", zh: "劈山开路" },
                body: {
                    en: "To deliver a single transformer to a remote village, entire mountainsides are dynamited. The access road costs more than the equipment it carries.",
                    zh: "为向偏远村庄运送一台变压器，需要炸开整座山体。修建的进山公路比设备本身还要昂贵。",
                },
            },
            {
                title: { en: "HELICOPTERS ARE LIMITED", zh: "直升机运力有限" },
                body: {
                    en: "The world's largest heavy-lift helicopter can carry only 20 tons. A single wind turbine nacelle weighs 80+. Most infrastructure simply can't fly.",
                    zh: "世界上最大的重型直升机仅能承载20吨。而单个风力机舱就重达80吨以上。大多数基础设施根本无法空运。",
                },
            },
            {
                title: { en: "DISASTER ZONES CUT OFF", zh: "灾区交通中断" },
                body: {
                    en: "When earthquakes destroy roads and floods wash out bridges, millions are stranded. Heavy equipment can't reach them for weeks or months.",
                    zh: "当地震摧毁道路、洪水冲毁桥梁，数百万人陷入困境。重型设备数周甚至数月都无法抵达。",
                },
            },
        ],
        pivot1: { en: "The problem isn't engineering.", zh: "问题不在于工程技术。" },
        pivot2: { en: "It's access.", zh: "而在于可达性。" },
    },

    // ─── Network Map ───
    networkMap: {
        overline: { en: "WHERE ROADS END", zh: "公路尽头" },
        headline1: { en: "The World's", zh: "全球最" },
        headlineAccent: { en: "Hardest", zh: "坎坷" },
        headline2: { en: "Routes", zh: "的航线" },
        sub: {
            en: "These are the corridors where conventional logistics fail. Every arc represents a real-world infrastructure bottleneck that only buoyant heavy lift can solve.",
            zh: "这些是传统物流束手无策的运输走廊。每条弧线都代表一个真实的基础设施运输瓶颈，唯有浮力重型运输方能解决。",
        },
        criticalCorridors: { en: "CRITICAL CORRIDORS", zh: "关键走廊" },
        payload: { en: "PAYLOAD", zh: "有效载荷" },
        fleetStatus: { en: "FLEET STATUS", zh: "机队状态" },
        carriersActive: { en: "5 CARRIERS ACTIVE", zh: "5艘运载器在线" },
        routesMonitored: { en: "8 ROUTES MONITORED", zh: "8条航线监控中" },
        initializing: { en: "INITIALIZING NETWORK...", zh: "网络初始化中..." },
    },

    // ─── Innovation Teaser (homepage) ───
    innovationTeaser: {
        overline: { en: "OUR ANSWER", zh: "我们的答案" },
        body: {
            pre: { en: "We are building a ", zh: "我们正在建造" },
            skyCarrier: { en: "buoyant long-range sky carrier", zh: "浮力远程天空运载器" },
            mid: { en: " paired with ", zh: "，配合" },
            drones: { en: "autonomous heavy-lift drone modules", zh: "自主重型无人机模块" },
            suf: {
                en: " to deliver large-scale infrastructure anywhere on Earth — without roads, runways, or helicopters.",
                zh: "，将大型基础设施运输到地球上任何地方——无需道路、跑道或直升机。",
            },
        },
        tagline: { en: "BUOYANCY, NOT THRUST.", zh: "浮力驱动，非推力。" },
        cta: { en: "DIVE INTO THE SYSTEM", zh: "深入了解系统" },
    },

    // ─── Innovation Hero ───
    innovationHero: {
        overline: { en: "THE INNOVATION", zh: "技术创新" },
        headline1: { en: "The Sky", zh: "天空" },
        headlineAccent: { en: "Carrier.", zh: "运载器。" },
        sub: {
            en: "A buoyant mothership and autonomous drone fleet — delivering 200+ tons anywhere on Earth without roads, runways, or ports.",
            zh: "浮力母船与自主无人机编队——在无需道路、跑道或港口的情况下，向地球任何角落运输200吨以上货物。",
        },
        scrollToExplore: { en: "SCROLL TO EXPLORE", zh: "向下滚动探索" },
    },

    // ─── Innovation Page ───
    innovation: {
        overline: { en: "OUR ANSWER", zh: "我们的答案" },
        body: {
            pre: { en: "We are building a ", zh: "我们正在建造" },
            skyCarrier: { en: "buoyant long-range sky carrier", zh: "浮力远程天空运载器" },
            mid: { en: " paired with ", zh: "，配合" },
            drones: { en: "autonomous heavy-lift drone modules", zh: "自主重型无人机模块" },
            suf: {
                en: " to deliver large-scale infrastructure anywhere on Earth — without roads, runways, or helicopters.",
                zh: "，将大型基础设施运输到地球上任何地方——无需道路、跑道或直升机。",
            },
        },
        tagline: { en: "BUOYANCY, NOT THRUST.", zh: "浮力驱动，非推力。" },
        systemOverline: { en: "THE SYSTEM", zh: "系统架构" },
        systemHeadline: { en: "Three Integrated", zh: "三大集成" },
        systemAccent: { en: "Subsystems", zh: "子系统" },
        systemSub: {
            en: "Working in concert to deliver infrastructure where roads, runways, and ports don't exist.",
            zh: "协同运作，将基础设施运送到没有道路、跑道和港口的地方。",
        },
        skyCarrierTitle: { en: "THE SKY CARRIER", zh: "天空运载器" },
        skyCarrierDesc: {
            en: "The buoyant long-range mothership. Hydrogen-helium hybrid lift in a composite envelope that never needs to touch the ground.",
            zh: "浮力远程母船。氢氦混合升力系统结合复合材料外壳，永不需要着陆。",
        },
        skyCarrierSpecs: [
            { en: "200+ ton payload capacity", zh: "200吨以上有效载荷" },
            { en: "Zero-fuel buoyant lift", zh: "零燃料浮力升空" },
            { en: "Intercontinental range", zh: "洲际航程" },
            { en: "No landing infrastructure required", zh: "无需着陆基础设施" },
        ],
        droneTitle: { en: "DRONE MODULES", zh: "无人机模块" },
        droneDesc: {
            en: "Autonomous heavy-lift systems that detach from the carrier, descend with payload, place with sub-centimeter precision, and return.",
            zh: "自主重型系统，从运载器脱离后携带货物下降，以亚厘米精度放置，然后返回。",
        },
        droneSpecs: [
            { en: "8-12 synchronized lift units", zh: "8-12个同步升力单元" },
            { en: "Force-feedback winches", zh: "力反馈绞盘" },
            { en: "Terrain-adaptive landing", zh: "地形自适应着陆" },
            { en: "Autonomous return & redock", zh: "自主返航与对接" },
        ],
        aiTitle: { en: "ORCHESTRATION AI", zh: "协调AI" },
        aiDesc: {
            en: "The mission brain that coordinates every operation — from weather-optimal routing to centimeter-level payload placement.",
            zh: "任务大脑，协调每项操作——从天气最优航线到厘米级货物放置。",
        },
        aiSpecs: [
            { en: "Real-time weather modeling", zh: "实时天气建模" },
            { en: "AI route optimization", zh: "AI航线优化" },
            { en: "Fleet management at scale", zh: "大规模机队管理" },
            { en: "Precision deployment algorithms", zh: "精准部署算法" },
        ],
        evolutionOverline: { en: "100 YEARS OF EVOLUTION", zh: "百年进化史" },
        evolutionHeadline1: { en: "The Airship Never", zh: "飞艇从未" },
        evolutionAccent: { en: "Disappeared.", zh: "消失。" },
        evolutionHeadline2: { en: " It Evolved.", zh: "它在进化。" },
        era1930s: { en: "1930s", zh: "1930年代" },
        era1930sText: {
            en: "Airships filled with pure hydrogen carried passengers across oceans. They were massive — 800 feet of structured buoyancy. But hydrogen was volatile, and landing required hundreds of ground crew and purpose-built mooring masts that cost millions.",
            zh: "充满纯氢气的飞艇载客横渡大洋。它们体型庞大——800英尺的结构化浮力体。但氢气易燃易爆，着陆需要数百名地勤人员和造价数百万的专用系泊塔。",
        },
        eraToday: { en: "Today", zh: "今天" },
        eraTodayText: {
            en: "We've solved both problems. Renewable hydrogen combined with helium in a composite-reinforced envelope creates a stable, non-flammable lifting gas at a fraction of the cost. Advanced carbon-fiber composite structures replace aluminum and fabric with materials 10x stronger at half the weight.",
            zh: "我们已解决了这两个问题。可再生氢气与氦气在复合增强外壳中结合，以极低成本产生稳定的不可燃升力气体。先进的碳纤维复合结构以强度10倍、重量减半的材料替代了铝和织物。",
        },
        eraFuture: { en: "Future", zh: "未来" },
        eraFutureText: {
            en: "And the biggest breakthrough? The carrier never needs to land. It hovers as a mothership at altitude while autonomous drone modules descend to load and unload extra-heavy cargo with sub-centimeter precision. No runway. No port. No roads. Just physics.",
            zh: "最大的突破？运载器永远不需要着陆。它在高空作为母船悬停，而自主无人机模块下降装卸超重货物，精度达亚厘米级。无需跑道、港口或道路。只需物理学。",
        },
    },

    // ─── How It Works ───
    howItWorks: {
        overline: { en: "OPERATIONAL SEQUENCE", zh: "作业流程" },
        headline: { en: "How It", zh: "运行" },
        headlineAccent: { en: "Works", zh: "原理" },
        sub: {
            en: "Four precision-engineered phases from origin to placement. Zero ground infrastructure required.",
            zh: "从起点到放置的四个精密工程阶段。零地面基础设施需求。",
        },
        steps: [
            {
                title: { en: "LOAD & LIFT", zh: "装载与升空" },
                desc: {
                    en: "Heavy infrastructure payload is secured into a modular cradle at the staging facility. The hydrogen-helium hybrid lift system achieves buoyancy — 200+ tons rising on physics alone. No runway, no fuel burn for lift.",
                    zh: "重型基础设施货物被固定在集结设施的模块化支架中。氢氦混合升力系统实现浮力——仅凭物理原理即可升起200吨以上。无需跑道，升空零燃料消耗。",
                },
                spec: { en: "H₂/He HYBRID LIFT · ZERO-FUEL ASCENT", zh: "氢/氦混合升力 · 零燃料升空" },
            },
            {
                title: { en: "CRUISE", zh: "巡航" },
                desc: {
                    en: "Solar-electric hybrid motors drive the carrier across continents while the Orchestration AI plots real-time weather-optimal routes. Intercontinental range with near-zero emissions.",
                    zh: "太阳能电动混合动力推进运载器跨越大洲，协调AI实时规划天气最优航线。洲际航程，近零排放。",
                },
                spec: { en: "SOLAR-ELECTRIC · INTERCONTINENTAL RANGE", zh: "太阳能电动 · 洲际航程" },
            },
            {
                title: { en: "HOVER & DEPLOY", zh: "悬停与部署" },
                desc: {
                    en: "At the deployment zone, the Sky Carrier enters precision hover. Dynamic ballast holds position within ±0.5m. 8-12 autonomous drone modules detach, descending in coordinated formation with the payload.",
                    zh: "在部署区域，天空运载器进入精确悬停。动态压舱系统将位置保持在±0.5米以内。8-12个自主无人机模块脱离，携带货物协同编队下降。",
                },
                spec: { en: "DYNAMIC BALLAST · ±0.5M TOLERANCE", zh: "动态压载 · ±0.5米公差" },
            },
            {
                title: { en: "PLACE & DEPART", zh: "投放与离场" },
                desc: {
                    en: "The drone swarm lowers cargo onto prepared foundations with sub-centimeter accuracy via LIDAR terrain mapping. Drones autonomously redock. The carrier departs. Total ground-contact footprint: zero.",
                    zh: "无人机群通过激光雷达地形测绘，以亚厘米精度将货物放置在预设基础上。无人机自主返回对接。运载器离场。地面接触面积：零。",
                },
                spec: { en: "SUB-CM ACCURACY · ZERO GROUND FOOTPRINT", zh: "亚厘米精度 · 零地面印迹" },
            },
        ],
        tagline1: { en: "Floating is free. ", zh: "漂浮是免费的。" },
        taglineAccent: { en: "Precision is engineered.", zh: "精度靠工程实现。" },
    },

    // ─── Economics / ROI Calculator ───
    economics: {
        overline: { en: "ECONOMICS", zh: "经济性分析" },
        headline: { en: "The Math Changes", zh: "算一笔账" },
        headlineAccent: { en: "Everything", zh: "改变一切" },
        sub: {
            en: "When you remove roads, runways, and ports from the equation, the economics of heavy-lift delivery transform entirely.",
            zh: "当你从等式中去掉道路、跑道和港口，重型运输的经济模型将彻底改变。",
        },
        missionParams: { en: "Mission Parameters", zh: "任务参数" },
        geography: { en: "Geography", zh: "地形" },
        flat: { en: "Developed / Flat", zh: "平坦 / 发达地区" },
        mountain: { en: "Mountainous / No Roads", zh: "山区 / 无公路" },
        water: { en: "Open Water", zh: "开阔水域" },
        payloadWeight: { en: "Payload Weight", zh: "有效载荷" },
        tons: { en: "Tons", zh: "吨" },
        distance: { en: "Distance", zh: "距离" },
        projectAether: { en: "Project Aether", zh: "天穹计划" },
        heavyTrucking: { en: "Heavy Trucking", zh: "重型卡车运输" },
        heavyLiftHeli: { en: "Heavy-Lift Helicopter", zh: "重型直升机" },
        estCost: { en: "Est. Cost", zh: "预估成本" },
        delivery: { en: "Delivery", zh: "交付时间" },
        co2: { en: "CO₂", zh: "碳排放" },
        infraBlocked: { en: "INFRASTRUCTURE BLOCKED", zh: "基础设施不可达" },
        keyInsight: { en: "KEY INSIGHT:", zh: "核心洞察：" },
        singleSortie: { en: "Single sortie, any terrain", zh: "单次飞行，任意地形" },
        trucksRequired: { en: "trucks required", zh: "辆卡车" },
        truckRequired: { en: "truck required", zh: "辆卡车" },
        sortiesAt: { en: "sorties at", zh: "架次，每次" },
        sortieAt: { en: "sortie at", zh: "架次，每次" },
        max: { en: "max", zh: "上限" },
        noRoadAccess: {
            en: "No road access — requires road construction ($2.3M/mile)",
            zh: "无道路通达——需修建道路（每英里230万美元）",
        },
        noWaterRoute: {
            en: "No route — requires bridge or ferry infrastructure",
            zh: "无可用航线——需要桥梁或渡轮基础设施",
        },
        insightMountain: {
            en: "Mountainous terrain eliminates trucking entirely. Helicopter would need {sorties} sequential sorties at $22k/flight-hour. Aether handles all {weight}T in one trip.",
            zh: "山区地形完全排除了卡车运输。直升机需要{sorties}次连续飞行，每飞行小时$22k。天穹计划一次飞行即可运输全部{weight}吨。",
        },
        insightFlat: {
            en: "At {weight}T, trucking requires {trucks} separate vehicles with permits and escort. Aether delivers in a single sortie — {aetherTime} vs {truckTime} for trucks.",
            zh: "运输{weight}吨货物，卡车需要{trucks}辆车和相关许可及护送。天穹计划单次飞行即可完成——{aetherTime}对比卡车的{truckTime}。",
        },
        insightWater: {
            en: "Open water crossings eliminate all ground transport. Aether crosses oceans at cruise altitude — no cargo ships, no port infrastructure, no customs delays.",
            zh: "开阔水域完全排除地面运输。天穹计划在巡航高度跨越海洋——无需货船、港口设施或海关延误。",
        },
    },

    // ─── Terrain Comparison ───
    terrain: {
        overline: { en: "TERRAIN CAPABILITY", zh: "地形能力" },
        headline: { en: "Every Landscape.", zh: "任何地形。" },
        headlineAccent: { en: "One System.", zh: "一套系统。" },
    },
} as const;

// Helper type
export type Translations = typeof translations;
