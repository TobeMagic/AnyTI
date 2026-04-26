import { localizePersonality, lbtiPersonalityEn } from './content-localization';
import type { Locale } from './locale';
import {
  getLoveArchiveReading,
  getLoveFace,
  getLoveMeta,
  loveFaceTabs,
  loveLeaderboard,
  loveOfficialNotes,
  mbtiProfiles,
} from './lbti-showcase';
import type { LoveFaceKey } from './lbti-showcase';
import type { Personality } from './types';

type FaceTranslation = {
  name: string;
  quote: string;
};

const faceLabelEn: Record<LoveFaceKey, string> = {
  selfMock: 'Self-Mock Face',
  animal: 'Animal Face',
  sweet: 'Sweet Face',
};

const faceEn: Record<string, Record<LoveFaceKey, FaceTranslation>> = {
  'lbti-reply-phantom': {
    selfMock: { name: 'Do Not Disturb Type', quote: 'Phone on silent, heart on vibration. The pinned chat ended with your "good night?" and then disappeared.' },
    animal: { name: 'Silent Porpoise', quote: 'You set expectation to silent mode, but only you know you were never truly calm.' },
    sweet: { name: 'Quiet Heart Holder', quote: 'You mute your hope not because you do not want to be found, but because you want someone who listens carefully.' },
  },
  'lbti-sweet-guard': {
    selfMock: { name: 'Devotion Refiller', quote: 'You give full marks of effort, while not even knowing where you rank in their contacts.' },
    animal: { name: 'Bone Dog', quote: 'You offer the best bones you have, only to find out they never wanted bones.' },
    sweet: { name: 'Private Devotion Soloist', quote: 'Your affection is a private concert for one person. If they never enter, you keep playing.' },
  },
  'lbti-flirt-archaeologist': {
    selfMock: { name: 'Self-Strategy Archaeologist', quote: 'One extra glance and you have already planned the kindergarten. It is not delusion; that glance was too complex.' },
    animal: { name: 'Director Frog', quote: 'You lived an entire lifetime together in your head. They said good morning; you heard a lifelong vow.' },
    sweet: { name: 'Fantasy Poet', quote: 'You turn one glance into a poem. Your affection is too abundant, so it has to bloom somewhere.' },
  },
  'lbti-reverse-clinger': {
    selfMock: { name: 'Whatever-But-Not-Really Type', quote: '"What do you want to eat?" "Whatever." "Do you love me?" "...yeah." The feeling is huge enough to become silence.' },
    animal: { name: 'Slime', quote: '"Whatever" is the fortress you built, and inside it is a child who actually wants everything.' },
    sweet: { name: 'Soft Echo', quote: 'You say "anything" because you let the other person choose first. Tenderness is your grammar of love.' },
  },
  'lbti-romance-auditor': {
    selfMock: { name: 'Invalid ATM', quote: 'You thought fast transfers could make love arrive, then learned they saw you as a bank, not a home.' },
    animal: { name: 'Cash-Out Duck', quote: 'You kept depositing into a relationship, then discovered the card was never yours.' },
    sweet: { name: 'Gift Giver', quote: 'You keep giving not to trade for something, but because love overflows and feels better when released.' },
  },
  'lbti-love-pm': {
    selfMock: { name: 'Probation Lover', quote: 'Every relationship is a perfect probation report. The trial ends, and the reason is always: "you are great, but I am not ready."' },
    animal: { name: 'Performance Review Fox', quote: 'You have heard "you are great" many times, but rarely "I choose you".' },
    sweet: { name: 'Serious Trainee', quote: 'You treat each relationship as the only one. It is not that you are not good enough; some people have not learned to value sincerity.' },
  },
  'lbti-script-immune': {
    selfMock: { name: 'Background Character Lover', quote: 'You play a side role in other people’s love stories, with one line: "you two look perfect." Small role, deep immersion.' },
    animal: { name: 'Audience Bear', quote: 'You stayed in the background of other people’s love for so long that you forgot you can step into the light too.' },
    sweet: { name: 'Corner Wisher', quote: 'You bless from the corner, cleanly and sincerely. One day someone will walk to that corner for you.' },
  },
  'lbti-weather-station': {
    selfMock: { name: 'Drama Fracture Type', quote: 'Tears wrote a whole novel behind your eyes, while the other person only asked whether you wanted milk tea.' },
    animal: { name: 'Screenwriter Sheep', quote: 'You cried asking why they treated you that way, then realized many hurtful lines were written by you for them.' },
    sweet: { name: 'Tear Collector', quote: 'You collect all the tears that never fell and brew them into tenderness.' },
  },
  'lbti-open-mic': {
    selfMock: { name: 'Pure Love Warrior', quote: 'In a fast-food love era, you still try to move someone with a handwritten letter who may not even reply.' },
    animal: { name: 'Messenger Dove', quote: 'They laugh at you for being foolish, but only you know what you are protecting.' },
    sweet: { name: 'Handwritten Heart', quote: 'In a cheap and overflowing age of affection, you still love in the clumsiest way. That is not stupid; it is rare.' },
  },
  'lbti-emotion-translator': {
    selfMock: { name: 'Backup Tire', quote: 'Always showing up on time, never getting the signature line.' },
    animal: { name: 'Puzzle Hedgehog', quote: 'Every time you are needed, you think you are finally complete, then learn you were replaceable.' },
    sweet: { name: 'Moonlight Watcher', quote: 'You do not fight for daylight. You shine gently at night, and being loved by you is a person’s best moonlight.' },
  },
  'lbti-coldwar-bomb': {
    selfMock: { name: 'Boulder Monkey', quote: 'Love is a boulder: you push it uphill daily, and it rolls down by night. It is not that you did not try; the mountain is too steep.' },
    animal: { name: 'Sisyphus Ape', quote: 'Maybe you do not love the person as much as the exhausted certainty of pushing the stone uphill.' },
    sweet: { name: 'Sunrise Stone Pusher', quote: 'You push love uphill every day not only for the result, but because pushing itself is your faith in love.' },
  },
  'lbti-breakup-buffer': {
    selfMock: { name: 'Cyber Widow', quote: 'The body has broken up, but the soul still lives in their annual music report. No likes, no comments, more dedicated than a ghost.' },
    animal: { name: 'Mourning Crane', quote: 'That is not nostalgia; it is exile. You exiled yourself into a yesterday you cannot return to.' },
    sweet: { name: 'Echo Keeper', quote: 'You are not unable to move on; you are simply very good at remembering. People loved by you live in your softest version of memory.' },
  },
  'lbti-graceful-ghost': {
    selfMock: { name: 'Hollow One', quote: 'There is a huge hole in your heart. When wind passes through, people mistake the echo for romance.' },
    animal: { name: 'Hollow Jellyfish', quote: 'Some people mistake your transparency for lightness. Only you know there is nothing inside.' },
    sweet: { name: 'Unfallen Snow', quote: 'Your love has not fallen yet, so it remains clean. That blankness is a whole field reserved for someone worthy.' },
  },
  'lbti-heart-escape': {
    selfMock: { name: 'Signal Lost Type', quote: 'Love is full at the start. The moment they step closer, you start losing signal. Not cruel; the base station was broken long ago.' },
    animal: { name: 'Power-Out Octopus', quote: 'It is not that you do not want a hug. The moment you are held, your body decides to run before your heart does.' },
    sweet: { name: 'Silent Heartbeat', quote: 'When you come close, the world is too loud, so you tune love to a frequency only you can hear.' },
  },
  'lbti-watchtower': {
    selfMock: { name: 'Love Test Fool', quote: 'After all this testing, you only wanted a cooler name for the part of you that cannot let go.' },
    animal: { name: 'Watching Meerkat', quote: 'You analyze every possibility of love except yourself, because admitting you want love means admitting you can be hurt.' },
    sweet: { name: 'Love Believer', quote: 'You keep testing because you still believe. Believing itself is a brave kind of romance.' },
  },
  'lbti-slow-teaser': {
    selfMock: { name: 'Passive Connector', quote: 'You never send the first message, but refresh the chat every three seconds. Full signal, never pressing send.' },
    animal: { name: 'Slow Snail', quote: 'You are not unwilling to leave; you believe someone real will stop and knock for you.' },
    sweet: { name: 'Waiting Bloom', quote: 'You are not passive. You believe the right person will recognize your frequency. Waiting is your quiet romance.' },
  },
};

const leaderboardNoteEn: Record<string, string> = {
  'lbti-reply-phantom': 'Phone on silent, heart vibrating, most likely to hold meetings inside a chat box.',
  'lbti-love-pm': 'Every relationship becomes a probation project trying to go official.',
  'lbti-sweet-guard': 'Full-score effort, but often not even credited in the signature line.',
  'lbti-open-mic': 'In an era of testing, you still insist on speaking in full human sentences.',
  'lbti-script-immune': 'Clearest in other people’s love stories, but often writes yourself into the corner.',
  'lbti-graceful-ghost': 'The wind makes you echo, though most people only think you are quiet.',
  'lbti-flirt-archaeologist': 'One glance can make you plan the next half of life and kindergarten.',
  'lbti-slow-teaser': 'Never starts the chat, but refreshes the input box at top speed.',
};

export function getLocalizedLoveFace(personalityId: string, faceKey: LoveFaceKey, locale: Locale) {
  const face = getLoveFace(personalityId, faceKey);
  if (!face || locale !== 'en') return face;
  const translated = faceEn[personalityId]?.[faceKey];
  return {
    ...face,
    faceLabel: faceLabelEn[faceKey],
    label: faceLabelEn[faceKey],
    name: translated?.name ?? face.name,
    quote: translated?.quote ?? face.quote,
  };
}

export function getLocalizedLoveMeta(personalityId: string, locale: Locale, faceKey: LoveFaceKey = 'selfMock') {
  const meta = getLoveMeta(personalityId, faceKey);
  if (!meta || locale !== 'en') return meta;
  const translated = getLocalizedLoveFace(personalityId, faceKey, locale);
  const animal = getLocalizedLoveFace(personalityId, 'animal', locale);
  return {
    ...meta,
    code: translated?.code ?? meta.code,
    name: translated?.name ?? meta.name,
    quote: translated?.quote ?? meta.quote,
    faceLabel: translated?.faceLabel ?? meta.faceLabel,
    alias: animal ? `${animal.code} · ${animal.name}` : meta.alias,
    heatTag: lbtiPersonalityEn[personalityId]?.group ?? meta.heatTag,
    preview: lbtiPersonalityEn[personalityId]?.vibe ?? meta.preview,
    faces: {
      selfMock: getLocalizedLoveFace(personalityId, 'selfMock', locale),
      animal: getLocalizedLoveFace(personalityId, 'animal', locale),
      sweet: getLocalizedLoveFace(personalityId, 'sweet', locale),
    },
  };
}

export function getLocalizedLoveFaceTabs(locale: Locale) {
  if (locale !== 'en') return loveFaceTabs;
  return loveFaceTabs.map((tab) => ({
    ...tab,
    label: faceLabelEn[tab.key],
  }));
}

export function getLocalizedLoveArchiveReading(personality: Personality, faceKey: LoveFaceKey, locale: Locale) {
  if (locale !== 'en') return getLoveArchiveReading(personality, faceKey);
  const localized = localizePersonality(personality, locale);
  const face = getLocalizedLoveFace(personality.id, faceKey, locale);
  return {
    overview: [face?.quote ?? localized.vibe, localized.summary, localized.whyItHits].filter(Boolean),
    scenario: [localized.vibe, localized.sweetSpot, localized.repairTip].filter(Boolean),
  };
}

export function getLocalizedLoveLeaderboard(locale: Locale) {
  if (locale !== 'en') return loveLeaderboard;
  return loveLeaderboard.map((entry) => ({
    ...entry,
    note: leaderboardNoteEn[entry.id] ?? entry.note,
  }));
}

export function getLocalizedLoveOfficialNotes(locale: Locale) {
  if (locale !== 'en') return loveOfficialNotes;
  return [
    {
      eyebrow: '01 / TEST POSITION',
      title: 'Test Positioning',
      body:
        'LBTI observes six continuous dimensions through realistic relationship scenarios: response sensitivity, expression, repair, autonomy, commitment clarity, and withdrawal defense.',
    },
    {
      eyebrow: '02 / RESULT READING',
      title: 'Result Reading',
      body:
        'After the test, your answer vector is matched to one of 16 core roles. Each role appears through three display faces, but they are the same result.',
    },
    {
      eyebrow: '03 / USE BOUNDARY',
      title: 'Use Boundary',
      body:
        'This test is not for diagnosis, hiring, background checks, or professional assessment. It is a playful profile for relationship habits.',
    },
    {
      eyebrow: '04 / SCORING LOGIC',
      title: 'Scoring Logic',
      body:
        'LBTI uses weighted continuous scoring rather than simple binary labels. Answers carry multi-dimensional weights and are matched by vector similarity.',
    },
  ];
}

export function getLocalizedMbtiProfiles(locale: Locale) {
  if (locale !== 'en') return mbtiProfiles;
  return mbtiProfiles.map((profile) => ({
    ...profile,
    summary:
      profile.code === 'INTJ'
        ? 'Strategic, long-range, and systems-oriented.'
        : profile.code === 'INTP'
          ? 'Analytical, conceptual, and question-driven.'
          : profile.code === 'ENTJ'
            ? 'Goal-driven, structured, and decisive.'
            : profile.code === 'ENTP'
              ? 'Fast, inventive, and possibility-oriented.'
              : profile.code === 'INFJ'
                ? 'Meaning-driven, insightful, and relationship-aware.'
                : profile.code === 'INFP'
                  ? 'Value-centered, authentic, and emotionally nuanced.'
                  : profile.code === 'ENFJ'
                    ? 'Encouraging, connective, and people-oriented.'
                    : profile.code === 'ENFP'
                      ? 'Expressive, energetic, and possibility-led.'
                      : profile.code === 'ISTJ'
                        ? 'Practical, orderly, and responsibility-focused.'
                        : profile.code === 'ISFJ'
                          ? 'Careful, steady, and supportive.'
                          : profile.code === 'ESTJ'
                            ? 'Efficient, concrete, and organizing.'
                            : profile.code === 'ESFJ'
                              ? 'Warm, social, and group-attentive.'
                              : profile.code === 'ISTP'
                                ? 'Independent, hands-on, and adaptive.'
                                : profile.code === 'ISFP'
                                  ? 'Experiential, sincere, and quietly aesthetic.'
                                  : profile.code === 'ESTP'
                                    ? 'Action-focused, responsive, and bold.'
                                    : 'Expressive, present-focused, and socially vivid.',
  }));
}
