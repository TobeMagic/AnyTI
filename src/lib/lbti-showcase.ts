import type { Personality } from './types';
import { buildSiteHref } from './routes';

export type LoveFaceKey = 'selfMock' | 'animal' | 'sweet';

export type LoveFaceMeta = {
  key: LoveFaceKey;
  label: string;
  icon: string;
  code: string;
  name: string;
  quote: string;
};

type LoveRoleMeta = {
  heat: number;
  heatTag: string;
  routeSlug: string;
  preview: string;
  faces: Record<LoveFaceKey, Omit<LoveFaceMeta, 'key' | 'label' | 'icon'>>;
};

type LeaderboardEntry = {
  id: string;
  share: string;
  note: string;
};

type OfficialNoteEntry = {
  eyebrow: string;
  title: string;
  body: string;
};

type LoveArchiveReading = {
  overview: string[];
  scenario: string[];
};

export type MbtiProfile = {
  code: string;
  zhName: string;
  summary: string;
};

export const loveFaceTabs: LoveFaceMeta[] = [
  {
    key: 'selfMock',
    label: '自嘲面',
    icon: '🖤',
    code: '',
    name: '',
    quote: '',
  },
  {
    key: 'animal',
    label: '动物面',
    icon: '🐾',
    code: '',
    name: '',
    quote: '',
  },
  {
    key: 'sweet',
    label: '甜心面',
    icon: '🌸',
    code: '',
    name: '',
    quote: '',
  },
];

const loveFaceOrder: LoveFaceKey[] = ['selfMock', 'animal', 'sweet'];

const loveRoleMeta: Record<string, LoveRoleMeta> = {
  'lbti-reply-phantom': {
    heat: 1,
    heatTag: '静音震动体',
    routeSlug: 'seen-r',
    preview: '手机常年静音，心常年震动。',
    faces: {
      selfMock: {
        code: '99+',
        name: '消息免打扰体',
        quote: '手机常年静音，心常年震动。唯一置顶的对话框，最后一条是我发的：“晚安，睡了？”',
      },
      animal: {
        code: 'MUTED',
        name: '静音豚',
        quote: '你把一生的期待都活成了静音模式下的震动，只有你自己知道，你从未真正平静过。',
      },
      sweet: {
        code: 'MUTE',
        name: '静音心动者',
        quote: '你把期待调成静音，不是不想被找到，是想被那个愿意仔细听的人发现。',
      },
    },
  },
  'lbti-sweet-guard': {
    heat: 3,
    heatTag: '骨头犬体质',
    routeSlug: 'sweet-r',
    preview: '付出满分，署名权却常常轮不到你。',
    faces: {
      selfMock: {
        code: 'TIAN-G',
        name: '舔者',
        quote: '付出满分，对方通讯录里你排第几自己都不知道。',
      },
      animal: {
        code: 'BONE',
        name: '骨头犬',
        quote: '你给的骨头都是最好的，可惜它想要的从来不是骨头。',
      },
      sweet: {
        code: 'DEAR',
        name: '偏爱独奏者',
        quote: '你给的喜欢，是只对一个人开放的独奏会。他不入场，你就一直弹。',
      },
    },
  },
  'lbti-flirt-archaeologist': {
    heat: 7,
    heatTag: '脑补开花体',
    routeSlug: 'clue-r',
    preview: '一个眼神，就能让你把后半生排到幼儿园。',
    faces: {
      selfMock: {
        code: 'SB-lv',
        name: '自我攻略者',
        quote: '对方只是多看你一眼，你连孩子在哪上幼儿园都想好了。不是我恋爱脑，是那个眼神太复杂。',
      },
      animal: {
        code: 'FROG',
        name: '导演蛙',
        quote: '你在脑子里和他过完了一生，他说早啊，你觉得那是白头偕老的问候。',
      },
      sweet: {
        code: 'MUSE',
        name: '幻想成诗者',
        quote: '你把他一个眼神，活成了一首诗。不是你想太多，是你的喜欢太丰盛，总要找个地方开花。',
      },
    },
  },
  'lbti-reverse-clinger': {
    heat: 9,
    heatTag: '都行嘴硬体',
    routeSlug: 'tsun-r',
    preview: '嘴上说都行，心里其实什么都想要。',
    faces: {
      selfMock: {
        code: 'OJBK-er',
        name: '都行无所谓者',
        quote: '“吃啥？”“都行。”“爱不爱我？”“……嗯。” 爱意过于庞大，庞大到只剩沉默。',
      },
      animal: {
        code: 'SLIME',
        name: '史莱姆',
        quote: '“随便”是你为自己修筑的堡垒，里面困着一个其实什么都想要的小孩。',
      },
      sweet: {
        code: 'SOFT',
        name: '柔软回声者',
        quote: '你说“都行”，是因为你把所有想要的东西，都让给了他先选。温柔是你爱人的语法。',
      },
    },
  },
  'lbti-romance-auditor': {
    heat: 5,
    heatTag: '爱情验钞机',
    routeSlug: 'check-r',
    preview: '你核对的不止账本，还有一段关系到底值不值得继续投。',
    faces: {
      selfMock: {
        code: 'ATM-404',
        name: '无效提款机',
        quote: '以为只要转账足够快，爱情就能到账。后来发现，对方只把我当银行，从来没想过存款。',
      },
      animal: {
        code: 'ATM-DUCK',
        name: '吐钞鸭',
        quote: '你不停地往一段关系里存钱，后来发现那张卡从来不属于你。',
      },
      sweet: {
        code: 'GIFT',
        name: '礼物馈赠者',
        quote: '你不停给予，不是因为想换什么，是因为你的爱太多了，给出去才舒服。',
      },
    },
  },
  'lbti-love-pm': {
    heat: 2,
    heatTag: '述职推进体',
    routeSlug: 'plan-r',
    preview: '每段感情都像一个想转正却总在试用期的项目。',
    faces: {
      selfMock: {
        code: 'BETA-01',
        name: '试用期人',
        quote: '每一段感情都做得像一份完美的述职报告。试用期一过就被辞退，理由永远是：“你很好，但我没想转正。”',
      },
      animal: {
        code: 'TRIAL-FOX',
        name: '述职狐',
        quote: '你收到过很多“你很好”，但从来没等到过“我就要你”。',
      },
      sweet: {
        code: 'TRUST',
        name: '认真见习者',
        quote: '你把每段感情都当成唯一去对待。不是你不够好，是他还没学会珍惜认真的人。',
      },
    },
  },
  'lbti-script-immune': {
    heat: 6,
    heatTag: '背景板人格',
    routeSlug: 'proof-r',
    preview: '总在别人的故事里很清醒，却很少把自己写进主角栏。',
    faces: {
      selfMock: {
        code: 'NPC',
        name: '路人甲型恋人',
        quote: '在别人的爱情故事里跑龙套，台词只有一句：“你俩真般配。” 戏份不多，入戏挺深。',
      },
      animal: {
        code: 'NPC-BEAR',
        name: '观众熊',
        quote: '你在别人的爱情里当了太久的背景，久到忘了自己也可以走到光里。',
      },
      sweet: {
        code: 'WISH',
        name: '角落许愿者',
        quote: '你在别人的故事里当背景，但你的祝福干净又虔诚。总有一天，会有人走到角落，只为你而来。',
      },
    },
  },
  'lbti-weather-station': {
    heat: 10,
    heatTag: '内耗写作体',
    routeSlug: 'temp-r',
    preview: '眼泪在心里排练过很多轮，别人看见的只是你突然安静了一点。',
    faces: {
      selfMock: {
        code: 'EMO-ji',
        name: '戏精破碎者',
        quote: '眼泪在眼眶里写了一部《红楼梦》，结果对方只是路过问我要不要拼单奶茶。',
      },
      animal: {
        code: 'DRAMA',
        name: '编剧羊',
        quote: '你哭着问他为什么这么对你，后来想起来，那些伤人的话，都是你自己替他说的。',
      },
      sweet: {
        code: 'TEAR',
        name: '眼泪收藏家',
        quote: '你收集所有没流出来的眼泪，把它们酿成温柔。能哭出来的人很勇敢，能藏起来的人很善良。',
      },
    },
  },
  'lbti-open-mic': {
    heat: 4,
    heatTag: '纯爱直给体',
    routeSlug: 'loud-r',
    preview: '这个时代都在快进，你还想认真给出一句完整的人话。',
    faces: {
      selfMock: {
        code: 'SIMP',
        name: '纯爱战神',
        quote: '在这个快餐时代，依然试图用一封手写信去打动一个连微信都不爱回的人。',
      },
      animal: {
        code: 'SIMP-DOVE',
        name: '信鸽',
        quote: '他们笑你傻，但只有你知道，你守住的到底是什么。',
      },
      sweet: {
        code: 'TRUE',
        name: '真心手写者',
        quote: '在这个爱意泛滥又廉价的时代，你还在用最笨的方式爱人。那不是傻，那是稀世珍宝。',
      },
    },
  },
  'lbti-emotion-translator': {
    heat: 8,
    heatTag: '替补守夜体',
    routeSlug: 'step-r',
    preview: '总是准时递出台阶，也总是最后一个等到真正的站位。',
    faces: {
      selfMock: {
        code: 'BEI-T',
        name: '备胎',
        quote: '永远准时出现，永远没有署名权。',
      },
      animal: {
        code: 'PUZZLE',
        name: '拼图猬',
        quote: '每次被需要都以为终于完整了，后来发现你只是一块可替换的零件。',
      },
      sweet: {
        code: 'MOON',
        name: '月光守夜人',
        quote: '你从不争抢白昼，只在夜深时温柔地亮着。能被你这样爱过，是他一生月光最好的时候。',
      },
    },
  },
  'lbti-coldwar-bomb': {
    heat: 11,
    heatTag: '推石修复体',
    routeSlug: 'truce-x',
    preview: '你不是不累，只是总觉得这段关系还能再被你推一程。',
    faces: {
      selfMock: {
        code: 'MAMO',
        name: '巨石吗喽',
        quote: '爱像一块巨石，每天推上去一点，晚上又滚下来。不是我没用力，是山太陡了。',
      },
      animal: {
        code: 'SISYPHUS',
        name: '西西弗猿',
        quote: '你爱的或许不是那个人，你爱的是推石头上山时，那种筋疲力尽的踏实感。',
      },
      sweet: {
        code: 'HILL',
        name: '日升推石者',
        quote: '你每天把喜欢推上山，不是为了结果，是因为推动本身，就是你对爱的信仰。',
      },
    },
  },
  'lbti-breakup-buffer': {
    heat: 12,
    heatTag: '回忆守灵体',
    routeSlug: 'buffer-r',
    preview: '关系都散了，你还会替它收尸、守夜、把最后一点体面摆正。',
    faces: {
      selfMock: {
        code: 'GHOST',
        name: '赛博守寡者',
        quote: '身体已经分手了，灵魂还在对方的网易云年度报告里定居。不点赞不评论，比鬼还敬业。',
      },
      animal: {
        code: 'ETERNAL',
        name: '守灵鹤',
        quote: '那不是念旧，那是流放。你把自己永远地流放在了一个回不去的昨天。',
      },
      sweet: {
        code: 'ECHO',
        name: '念念回响者',
        quote: '你不是走不出来，你只是太擅长记得。被你爱过的人，会永远活在你记忆最柔软的版本里。',
      },
    },
  },
  'lbti-graceful-ghost': {
    heat: 6,
    heatTag: '空洞静退体',
    routeSlug: 'exit-p',
    preview: '风一吹就响，但别人总以为你只是安静。',
    faces: {
      selfMock: {
        code: 'GUA',
        name: '寡者',
        quote: '我的心里有一个巨大的洞。风吹过的时候，会有回声。他们以为是情话，其实是孤独的轰鸣。',
      },
      animal: {
        code: 'HOLLOW',
        name: '空心水母',
        quote: '有人把你的透明当成了轻盈，只有你知道，那里面什么也没有。',
      },
      sweet: {
        code: 'SNOW',
        name: '初雪未落者',
        quote: '你的爱还没下过，所以干干净净。那不是空白，是留给最值得的人的一整片原野。',
      },
    },
  },
  'lbti-heart-escape': {
    heat: 13,
    heatTag: '靠近掉线体',
    routeSlug: 'dodge-r',
    preview: '刚确立关系爱意满格，只要对方前进一步，你就会想先把自己撤回来。',
    faces: {
      selfMock: {
        code: 'WiFi-0',
        name: '信号丢失体',
        quote: '刚确立关系爱意满格。对方前进一步，我就开始掉线。不是我渣，是基站早就坏了。',
      },
      animal: {
        code: 'OFFLINE',
        name: '断电章鱼',
        quote: '不是不想被拥抱，是每次被抱住的瞬间，身体比心先做出逃跑的决定。',
      },
      sweet: {
        code: 'HUSH',
        name: '心跳静默者',
        quote: '你靠近的时候，世界太吵了，于是你选择把喜欢调成了只有自己能听见的频率。',
      },
    },
  },
  'lbti-watchtower': {
    heat: 14,
    heatTag: '爱情围观体',
    routeSlug: 'watch-r',
    preview: '测了又测，不是为了结论，是想给自己一个还相信爱的理由。',
    faces: {
      selfMock: {
        code: 'SBTI-LOVE',
        name: '傻逼爱情测试者',
        quote: '测了这么半天，无非是想给那个放不下的自己，找一个听起来比较酷的名字。恭喜您，您测出了全中国最稀有的纯爱废柴人格。',
      },
      animal: {
        code: 'MEER',
        name: '旁观獴',
        quote: '你分析了每一种爱的可能性，唯独不敢分析自己。因为一旦承认想被爱，就等于承认了会受伤。',
      },
      sweet: {
        code: 'HOPE',
        name: '爱情相信者',
        quote: '你测了又测，是因为你还在相信。相信本身就是一种了不起的浪漫。',
      },
    },
  },
  'lbti-slow-teaser': {
    heat: 8,
    heatTag: '缓冲等待体',
    routeSlug: 'load-r',
    preview: '绝不会主动发第一条消息，但每隔三秒都会刷新一次聊天框。',
    faces: {
      selfMock: {
        code: 'WiFi-er',
        name: '被动连接人',
        quote: '绝对不会主动发第一条消息，但每隔三秒刷新一次对话框。信号满格，只是从不按发送键。',
      },
      animal: {
        code: 'SNAIL',
        name: '慢热蜗',
        quote: '你从来不是不想出发，只是你相信，真的有人会为你停下来敲门。',
      },
      sweet: {
        code: 'WAIT',
        name: '原地开花者',
        quote: '你不是被动，你只是相信：该来的人，会认出你的频率。等待是你最安静的浪漫。',
      },
    },
  },
};

export const mbtiProfiles: MbtiProfile[] = [
  { code: 'INTJ', zhName: '建筑师', summary: '擅长从长期结构和底层逻辑看问题。' },
  { code: 'INTP', zhName: '逻辑学家', summary: '喜欢拆解概念、质疑默认答案。' },
  { code: 'ENTJ', zhName: '指挥官', summary: '偏好目标导向、系统推进和资源调度。' },
  { code: 'ENTP', zhName: '辩论家', summary: '反应快、点子多，擅长打开新可能。' },
  { code: 'INFJ', zhName: '提倡者', summary: '看重意义、洞察动机，也在意长期关系质量。' },
  { code: 'INFP', zhName: '调停者', summary: '重价值感和真实感，表达更柔和但内核明确。' },
  { code: 'ENFJ', zhName: '主人公', summary: '擅长鼓舞他人，并把关系与目标连接起来。' },
  { code: 'ENFP', zhName: '竞选者', summary: '外放、有感染力，善于用热情打开氛围。' },
  { code: 'ISTJ', zhName: '物流师', summary: '务实、有秩序，重责任和可执行性。' },
  { code: 'ISFJ', zhName: '守卫者', summary: '细致、稳定，对熟人关系有持续投入。' },
  { code: 'ESTJ', zhName: '总经理', summary: '擅长把事落地，对效率和秩序敏感。' },
  { code: 'ESFJ', zhName: '执政官', summary: '注重关系氛围，也擅长让群体运转起来。' },
  { code: 'ISTP', zhName: '鉴赏家', summary: '偏临场反应和独立处理，做事讲究手感。' },
  { code: 'ISFP', zhName: '探险家', summary: '重体验和真实感，表达不吵但很有个人审美。' },
  { code: 'ESTP', zhName: '企业家', summary: '行动快、临场强，擅长把局面带动起来。' },
  { code: 'ESFP', zhName: '表演者', summary: '重现场感和情绪互动，容易成为人群焦点。' },
];

export const loveLeaderboard: LeaderboardEntry[] = [
  { id: 'lbti-reply-phantom', share: '14.7%', note: '手机静音，心里震动，最容易在聊天框里自我开会。' },
  { id: 'lbti-love-pm', share: '12.9%', note: '每一段关系都做得像想转正的述职项目。' },
  { id: 'lbti-sweet-guard', share: '11.4%', note: '付出满分，最后却常常连署名都轮不到。' },
  { id: 'lbti-open-mic', share: '9.6%', note: '这个时代都爱试探，你偏要认真把话说满。' },
  { id: 'lbti-script-immune', share: '8.8%', note: '在别人的爱情里看得最清楚，写到自己时却总往角落退。' },
  { id: 'lbti-graceful-ghost', share: '7.9%', note: '风一吹就响，但你通常只把空洞感留给自己听。' },
  { id: 'lbti-flirt-archaeologist', share: '7.4%', note: '一个眼神能让你把后半生和幼儿园同时想好。' },
  { id: 'lbti-slow-teaser', share: '6.8%', note: '不主动开口，但刷新对话框的手速从来不慢。' },
];

export const loveOfficialNotes: OfficialNoteEntry[] = [
  {
    eyebrow: '01 / TEST POSITION',
    title: '测试定位',
    body:
      'LBTI 当前版本用一组现实关系场景题，观察回应敏感、表达与脆弱、冲突修复、自主边界、承诺清晰与撤离防御这 6 个连续维度。题量不是固定教条，只要覆盖证明还不够，就继续扩展。',
  },
  {
    eyebrow: '02 / RESULT READING',
    title: '结果解释',
    body:
      '测试完成后，系统会把你的作答向量与 16 个核心角色进行匹配。每个角色在前台会被翻译成自嘲面、动物面和甜心面三种展示，但它们始终是同一个结果，不是三套独立人格。',
  },
  {
    eyebrow: '03 / USE BOUNDARY',
    title: '适用边界',
    body:
      '本测试不用于心理诊断、医疗判断、招聘筛选、婚恋背调或任何替代专业评估的场景。结果更适合作为关系风格的娱乐化档案，而不是对人格价值的最终判定。',
  },
  {
    eyebrow: '04 / SCORING LOGIC',
    title: '计分方式',
    body:
      'LBTI 采用加权连续谱计分，不使用简单二选一标签法。每道题的选项都携带多维权重，最终通过向量相似度匹配核心角色，再把同一结果翻译成三种可读、可截图、可传播的展示面。',
  },
];

function withFace(personalityId: string, faceKey: LoveFaceKey) {
  const role = loveRoleMeta[personalityId];
  if (!role) return undefined;
  const tab = loveFaceTabs.find((item) => item.key === faceKey);
  const face = role.faces[faceKey];
  if (!tab) return undefined;
  return {
    heat: role.heat,
    heatTag: role.heatTag,
    routeSlug: role.routeSlug,
    preview: role.preview,
    faceKey,
    faceLabel: tab.label,
    emoji: tab.icon,
    icon: tab.icon,
    code: face.code,
    name: face.name,
    alias: `${role.faces.animal.code} · ${role.faces.animal.name}`,
    quote: face.quote,
    faces: {
      selfMock: { ...loveFaceTabs[0], ...role.faces.selfMock },
      animal: { ...loveFaceTabs[1], ...role.faces.animal },
      sweet: { ...loveFaceTabs[2], ...role.faces.sweet },
    },
  };
}

export function getLoveMeta(personalityId: string, faceKey: LoveFaceKey = 'selfMock') {
  return withFace(personalityId, faceKey);
}

export function getLoveFace(personalityId: string, faceKey: LoveFaceKey) {
  return withFace(personalityId, faceKey);
}

export function getLoveRole(personalityId: string) {
  const role = loveRoleMeta[personalityId];
  if (!role) return undefined;
  return {
    ...role,
    faces: {
      selfMock: { ...loveFaceTabs[0], ...role.faces.selfMock },
      animal: { ...loveFaceTabs[1], ...role.faces.animal },
      sweet: { ...loveFaceTabs[2], ...role.faces.sweet },
    },
  };
}

export function getAdjacentLoveFace(faceKey: LoveFaceKey, direction: 'next' | 'prev') {
  const currentIndex = loveFaceOrder.indexOf(faceKey);
  if (currentIndex < 0) return faceKey;
  const delta = direction === 'next' ? 1 : -1;
  const nextIndex = (currentIndex + delta + loveFaceOrder.length) % loveFaceOrder.length;
  return loveFaceOrder[nextIndex];
}

/**
 * Image path mapping: personalityId → faceKey → filename slug (without extension).
 * Each personality has exactly one self-mock, one animal, and one sweet image.
 * File lives at: /images/lbti/individual/{self,animal,sweet}/{slug}.png
 */
const loveFaceImageMap: Record<string, Record<LoveFaceKey, string>> = {
  'lbti-reply-phantom':         { selfMock: '99plus',    animal: 'muted',      sweet: 'mute'    },
  'lbti-sweet-guard':          { selfMock: 'tian-g',    animal: 'bone',       sweet: 'dear'    },
  'lbti-flirt-archaeologist':  { selfMock: 'sb-lv',     animal: 'frog',        sweet: 'muse'    },
  'lbti-reverse-clinger':      { selfMock: 'ojbk-er',   animal: 'slime',       sweet: 'soft'    },
  'lbti-romance-auditor':      { selfMock: 'atm-404',   animal: 'atm-duck',    sweet: 'gift'    },
  'lbti-love-pm':              { selfMock: 'beta-01',   animal: 'trial-fox',   sweet: 'trust'   },
  'lbti-script-immune':         { selfMock: 'npc',       animal: 'npc-bear',    sweet: 'wish'    },
  'lbti-weather-station':       { selfMock: 'emo-ji',    animal: 'drama',       sweet: 'tear'    },
  'lbti-open-mic':             { selfMock: 'simp',       animal: 'simp-dove',   sweet: 'true'    },
  'lbti-emotion-translator':   { selfMock: 'bei-t',     animal: 'puzzle',      sweet: 'moon'    },
  'lbti-coldwar-bomb':         { selfMock: 'mamo',      animal: 'sisyphus',    sweet: 'hill'    },
  'lbti-breakup-buffer':       { selfMock: 'ghost',     animal: 'eternal',     sweet: 'echo'    },
  'lbti-graceful-ghost':       { selfMock: 'gua',       animal: 'hollow',      sweet: 'snow'    },
  'lbti-heart-escape':         { selfMock: 'wifi-0',    animal: 'offline',     sweet: 'hush'    },
  'lbti-watchtower':           { selfMock: 'sbti-love', animal: 'meer',        sweet: 'hope'    },
  'lbti-slow-teaser':          { selfMock: 'wifi-er',   animal: 'snail',       sweet: 'wait'    },
};

/**
 * Returns the public image path for a given personality + face key, or undefined
 * if no image is registered.
 */
export function getLoveFaceImagePath(personalityId: string, faceKey: LoveFaceKey): string | undefined {
  const faceImages = loveFaceImageMap[personalityId];
  if (!faceImages) return undefined;
  const filename = faceImages[faceKey];
  if (!filename) return undefined;
  const folder = faceKey === 'selfMock' ? 'self' : faceKey;
  return buildSiteHref(`images/lbti/individual/${folder}/${filename}.png`);
}

export function getLoveArchiveReading(personality: Personality, faceKey: LoveFaceKey): LoveArchiveReading | undefined {
  const face = getLoveFace(personality.id, faceKey);
  if (!face) return undefined;

  if (faceKey === 'animal') {
    return {
      overview: [
        `${face.quote} ${personality.summary}`,
        `${personality.stressSignal ?? personality.whyItHits} ${personality.repairTip ?? ''}`.trim(),
      ],
      scenario: [
        `把 ${face.name} 放回聊天、靠近和后撤这些真实场景里看，它更像是一种本能反应：${personality.vibe}`,
        `${personality.whyItHits} ${personality.repairTip ?? ''}`.trim(),
      ],
    };
  }

  if (faceKey === 'sweet') {
    return {
      overview: [
        `${face.quote} ${personality.sweetSpot ?? personality.summary}`,
        `${personality.whyItHits} ${personality.repairTip ?? ''}`.trim(),
      ],
      scenario: [
        `甜心面里的 ${face.name} 会把同一份关系需求翻成更柔软的语言：${personality.vibe}`,
        `${personality.sweetSpot ?? personality.summary} ${personality.repairTip ?? ''}`.trim(),
      ],
    };
  }

  return {
    overview: [
      `${face.quote} ${personality.summary}`,
      `${personality.whyItHits} ${personality.stressSignal ?? ''}`.trim(),
    ],
    scenario: [
      `把 ${face.name} 放回真实恋爱现场里看，最常见的样子通常是这样：${personality.vibe}`,
      `${personality.whyItHits} ${personality.repairTip ?? ''}`.trim(),
    ],
  };
}

export function getLoveMetaByRouteSlug(routeSlug: string) {
  const entry = Object.entries(loveRoleMeta).find(([, role]) => role.routeSlug === routeSlug);
  if (!entry) return undefined;
  return getLoveMeta(entry[0]);
}

export function findLovePersonalityByRouteSlug(personalities: Personality[], routeSlug: string) {
  const metaEntry = Object.entries(loveRoleMeta).find(([, role]) => role.routeSlug === routeSlug);
  if (!metaEntry) return undefined;
  return personalities.find((personality) => personality.id === metaEntry[0]);
}

export function findLovePersonality(personalities: Personality[], id: string) {
  return personalities.find((personality) => personality.id === id);
}
