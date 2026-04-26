import type { Locale } from './locale';
import type { Personality, Question, TestMeta, TestPack } from './types';

type QuestionTranslation = {
  context?: string;
  prompt: string;
  options: Record<string, { label: string; hint?: string }>;
};

type PersonalityTranslation = Pick<
  Personality,
  'group' | 'name' | 'badge' | 'vibe' | 'summary' | 'whyItHits' | 'dimensionRead' | 'sweetSpot' | 'stressSignal' | 'repairTip'
>;

const groupEn: Record<string, string> = {
  '开机过热组': 'Overheated Startup Set',
  '关系运营组': 'Relationship Ops Set',
  '正面处理组': 'Direct Repair Set',
  '撤退保护组': 'Retreat Protection Set',
};

export const lbtiQuestionEn: Record<string, QuestionTranslation> = {
  'lbti-q1': {
    context:
      'Response sensitivity model · Last night at 23:17 you texted, "Got home?" He was online, his avatar lit up, he liked a post, but he did not reply. At 09:04 the next morning, he crawls back with "I fell asleep."',
    prompt: 'Which reaction sounds most like you?',
    options: {
      a: { label: 'Ask what happened last night. I need to confirm he did not vanish from Earth.' },
      b: { label: 'Keep today’s topic going on the surface, so I do not look too invested.' },
      c: { label: 'Say nothing, but my inner notebook has already recorded this incident.' },
    },
  },
  'lbti-q2': {
    context: 'Response sensitivity model',
    prompt: 'When the connection drops, I cannot stop imagining the worst version.',
    options: {
      a: { label: 'Disagree' },
      b: { label: 'Neutral' },
      c: { label: 'Agree' },
    },
  },
  'lbti-q3': {
    context:
      'Response sensitivity model · You have chatted for two weeks, gone out alone twice, and friends already assume there is "something there", but neither of you has defined it.',
    prompt: 'How do you usually judge which level this relationship has reached?',
    options: {
      a: { label: 'Find a chance to ask directly. I refuse to turn liking someone into a reading exam.' },
      b: { label: 'Keep reading the details: initiative, tone, and whether the pace of meeting has changed.' },
      c: { label: 'Let it flow. If the feeling is real, I will know. No need to stamp it immediately.' },
    },
  },
  'lbti-q4': {
    context:
      'Response sensitivity model · It is 1 AM after work. You are waiting for a ride alone, makeup ruined, mood collapsing, wind blowing through you. Then they text: "Want me to pick you up?"',
    prompt: 'What follow-up would you most want?',
    options: {
      a: { label: 'Show up quickly, so I know this relationship does not disappear at critical moments.' },
      b: { label: 'Give me a little space to breathe, but do not vanish like air.' },
      c: { label: 'Talk through the situation and feelings clearly. That grounds me more than silent company.' },
    },
  },
  'lbti-q5': {
    context:
      'Response sensitivity model · This week he replied with emojis three times, kept saying "another day" for meeting, and the chat feels like a tide going out. You know something is off, but do not want to look clingy.',
    prompt: 'Which next step sounds most like you?',
    options: {
      a: { label: 'Bring it up and confirm what is going on with the relationship lately.' },
      b: { label: 'Say "let it be", while scrolling through recent chat logs like a crime scene.' },
      c: { label: 'Pull myself back a little so I do not look too urgent or chasing.' },
    },
  },
  'lbti-q6': {
    context: 'Expression and vulnerability model',
    prompt: 'If I really like someone, I will find a way to let them know instead of acting out an entire romance drama only in my head.',
    options: {
      a: { label: 'Disagree' },
      b: { label: 'Neutral' },
      c: { label: 'Agree' },
    },
  },
  'lbti-q7': {
    context:
      'Expression and vulnerability model · You found a place they would definitely like. The chat is open, your finger is hovering over send. Logic says "do not look too active", but the little monster in your heart is already planning the next date.',
    prompt: 'What would you most likely do?',
    options: {
      a: { label: 'Send it directly and add "I will take you there next time" to make the signal clear.' },
      b: { label: 'Save it first and bring them there naturally in person, so it feels less deliberate.' },
      c: { label: 'Hold back, afraid that sending it makes me look like I already imagined the date.' },
    },
  },
  'lbti-q8': {
    context:
      'Expression and vulnerability model · At a friend gathering, someone teases, "Is something going on between you two?" Everyone looks over. In that second, your brain calculates whether to catch the ball.',
    prompt: 'What is your comfort zone with semi-public intimacy?',
    options: {
      a: { label: 'If I have decided, a little public expression is fine. I will not hide too much.' },
      b: { label: 'A little is fine, but do not put me on stage for a live performance.' },
      c: { label: 'I prefer intimacy in private. Too much public attention makes me freeze.' },
    },
  },
  'lbti-q9': {
    context:
      'Expression and vulnerability model · You are not official yet, but the chat has clearly crossed into flirtation. One day they casually say, "I am so tired today." You stare at the input box. Each possible reply reveals how you love.',
    prompt: 'How do you usually send care outward?',
    options: {
      a: { label: 'Say the care clearly, so my sincerity does not become their reading assignment.' },
      b: { label: 'Remember the details and take care of them through actions.' },
      c: { label: 'Use jokes, memes, and soft signals so they can slowly figure it out.' },
    },
  },
  'lbti-q10': {
    context: 'Expression and vulnerability model',
    prompt: 'Compared with forcing a direct talk on the spot, I am better at offering a step down and slowly reconnecting.',
    options: {
      a: { label: 'Disagree' },
      b: { label: 'Neutral' },
      c: { label: 'Agree' },
    },
  },
  'lbti-q11': {
    context:
      'Conflict repair model · A weekend date starts fine, then lateness, plan changes, and tone issues keep hitting nerves. One second you are holding hands, the next both faces are dark. If nobody handles it, the rest of the date is probably dead.',
    prompt: 'When the atmosphere starts freezing, what are you most likely to do?',
    options: {
      a: { label: 'Talk it through that day. I do not want date problems turning into aftereffects.' },
      b: { label: 'Step back first, because my next sentence might come out too harsh.' },
      c: { label: 'Translate both emotions into human language before discussing who did what.' },
    },
  },
  'lbti-q12': {
    context: 'Conflict repair model',
    prompt: 'As long as the relationship is not completely broken, I basically cannot accept a cold war lasting past the day.',
    options: {
      a: { label: 'Disagree' },
      b: { label: 'Neutral' },
      c: { label: 'Agree' },
    },
  },
  'lbti-q13': {
    context:
      'Conflict repair model · You only wanted to express hurt, like "I felt a bit sad yesterday", but they hear it as accusation and immediately get defensive. The scene turns into a debate in one second.',
    prompt: 'When this kind of misread appears, what is your first reaction?',
    options: {
      a: { label: 'Explain immediately. I do not want misunderstanding to snowball between us.' },
      b: { label: 'Change to a less defensive wording and say it again.' },
      c: { label: 'Go quiet first and wait until they are less explosive.' },
    },
  },
  'lbti-q14': {
    context: 'Conflict repair model',
    prompt: 'Making up is not a losing contest for me. Whoever understands first can speak first.',
    options: {
      a: { label: 'Disagree' },
      b: { label: 'Neutral' },
      c: { label: 'Agree' },
    },
  },
  'lbti-q15': {
    context:
      'Conflict repair model · On the surface you made up, memes are back, and you can even eat together. But you know the root of this conflict is still buried. Do you reopen it calmly to clean it up?',
    prompt: 'After something is "over", do you find a chance to sort out the root cause?',
    options: {
      a: { label: 'Yes. I want to know how not to step into the same pit next time.' },
      b: { label: 'If we are fine, that is enough. I do not want every friction to become a review meeting.' },
      c: { label: 'Not really. If it is over, I want it to sink completely.' },
    },
  },
  'lbti-q16': {
    context:
      'Autonomy boundary model · In the first week after becoming official, chat and meeting frequency start taking shape. It is sweet, but the rhythm also reveals its true nature.',
    prompt: 'Which rhythm feels safest without suffocating you?',
    options: {
      a: { label: 'High-frequency contact makes me feel secure. Early love should be a little sticky.' },
      b: { label: 'Planned meetings plus personal time for both sides. That lasts better.' },
      c: { label: 'I need a fairly intact personal rhythm. Dating should not mean constant binding.' },
    },
  },
  'lbti-q17': {
    context:
      'Autonomy boundary model · They are drinking with friends tonight, and you also have your own plans. Neither of you is just sitting there waiting to report in.',
    prompt: 'How do you feel about check-ins like "tell me when you get home" or "who are you with"?',
    options: {
      a: { label: 'Natural sharing makes me feel safe. I read it as being held in mind.' },
      b: { label: 'Important moments are enough. A full-day livestream is unnecessary.' },
      c: { label: 'Once it becomes mandatory reporting, I start wanting to step back.' },
    },
  },
  'lbti-q18': {
    context:
      'Autonomy boundary model · They suggest sharing location because "it makes me feel safer", but you are already asking whether this is care or patrol.',
    prompt: 'How accepting are you of location checking and patrol-like behavior?',
    options: {
      a: { label: 'Understandable in special situations, but it must not become daily default.' },
      b: { label: 'Occasional curiosity is fine, but love should not become patrol management.' },
      c: { label: 'I dislike it. It feels like the relationship is taking over my life.' },
    },
  },
  'lbti-q19': {
    context:
      'Autonomy boundary model · A short holiday is coming. You both want to meet, but each side has plans too. Nobody wants the holiday to become military scheduling.',
    prompt: 'What holiday arrangement feels most comfortable?',
    options: {
      a: { label: 'Set the rhythm early. I feel more grounded and included.' },
      b: { label: 'Take turns deciding. It should not always be one person running the love itinerary.' },
      c: { label: 'Keep room for both sides to move. Do not lock the holiday like a project plan.' },
    },
  },
  'lbti-q20': {
    context:
      'Autonomy boundary model · They come to you almost every free moment these days. It is sweet, but you are starting to run out of oxygen, like being wrapped in fragrant cotton.',
    prompt: 'How do you usually handle that level of stickiness?',
    options: {
      a: { label: 'Say directly that I need air, not disconnection. I just need breathing rights.' },
      b: { label: 'Say "it is fine, go do your thing", while secretly hoping they come closer.' },
      c: { label: 'Pull away noticeably and decide how to come back after I feel comfortable.' },
    },
  },
  'lbti-q21': {
    context:
      'Commitment clarity model · They fail another promise: forgetting to pick you up, forgetting something you cared about, or even repairing too slowly.',
    prompt: 'When this happens, how does your inner score usually change?',
    options: {
      a: { label: 'A lot. This directly rewrites my overall score for the relationship.' },
      b: { label: 'I remember it, but I also check whether it was a mistake or a lack of care.' },
      c: { label: 'I care more about the present feeling and overall vibe than immediate fulfillment.' },
    },
  },
  'lbti-q22': {
    context:
      'Commitment clarity model · You are basically exclusive and increasingly couple-like, but nobody has said it out loud. It feels one official announcement away.',
    prompt: 'If this state continues, which feeling is closest?',
    options: {
      a: { label: 'If there is feeling, I want to know where we stand. I do not date in thin air.' },
      b: { label: 'I say I am not rushed, but without direction my mind starts spinning.' },
      c: { label: 'Labels can come late. Comfort comes first. I do not want to pin it down too fast.' },
    },
  },
  'lbti-q23': {
    context:
      'Commitment clarity model · Three weeks ago you casually mentioned your stomach felt bad and that you hate cilantro. Later at dinner, they say, "No cold drinks for you, and no cilantro."',
    prompt: 'How do you most easily interpret that moment?',
    options: {
      a: { label: 'This matters. I immediately feel the relationship is being taken seriously.' },
      b: { label: 'It adds points, but I still care more about long-term action than one highlight.' },
      c: { label: 'I am happy, but I do not want remembering details to become a love KPI.' },
    },
  },
  'lbti-q24': {
    context:
      'Commitment clarity model · Their tone is colder, initiative is lower, and even the usual goodnight has disappeared. You can smell the cooling down.',
    prompt: 'What do you usually do first?',
    options: {
      a: { label: 'Ask directly. I do not want to date someone alone inside my imagination.' },
      b: { label: 'Observe for two more days to see whether this is temporary or a real retreat.' },
      c: { label: 'Hold myself down, afraid that speaking up makes me look too urgent.' },
    },
  },
  'lbti-q25': {
    context:
      'Commitment clarity model · You are basically exclusive, talking almost daily, and friends nearly treat them as your partner, but the definition is still floating.',
    prompt: 'How do you feel about making it official?',
    options: {
      a: { label: 'I want the relationship to land. Staying blurry for too long drains me.' },
      b: { label: 'I say "let it be", but inside I am waiting for them to give a clear answer first.' },
      c: { label: 'Comfort matters more for now. I do not want love to become contract signing.' },
    },
  },
  'lbti-q26': {
    context:
      'Withdrawal defense model · You have confirmed the relationship is dropping: fewer messages, fewer meetings, and less investment.',
    prompt: 'After you confirm it is not an illusion, what is your first move?',
    options: {
      a: { label: 'Have one serious talk and confirm whether this relationship can still be saved.' },
      b: { label: 'Pull myself back a little and see whether they will come fill the gap.' },
      c: { label: 'Quietly leave. I do not want to burn my dignity in a tug-of-war.' },
    },
  },
  'lbti-q27': {
    context:
      'Withdrawal defense model · After a relationship pauses or ends, the chat box, delivery address, playlists, and shared entrances are all still there.',
    prompt: 'When these traces sit in front of you, which sounds most like you?',
    options: {
      a: { label: 'I look back, like reviewing an accident to find where it started going wrong.' },
      b: { label: 'Sometimes I open them, more out of habit than heavy nostalgia.' },
      c: { label: 'I clear entrances and mute reminders quickly, so I do not fall back in.' },
    },
  },
  'lbti-q28': {
    context:
      'Withdrawal defense model · Someone who once hurt you suddenly texts, "How have you been?" The chat lights up.',
    prompt: 'What is your inner gatekeeper’s first reaction?',
    options: {
      a: { label: 'Ask why they are back. Without a reason, I will not reopen the game.' },
      b: { label: 'Look at who they are now, and whether I still have space inside.' },
      c: { label: 'Probably close the door. I do not easily give old plots a sequel.' },
    },
  },
  'lbti-q29': {
    context:
      'Withdrawal defense model · Photos, gifts, saved folders, pinned chats, shared playlists: a whole room of emotions that never moved out.',
    prompt: 'How do you usually handle old traces?',
    options: {
      a: { label: 'Keep some of them, like putting the remains into a buffer zone first.' },
      b: { label: 'Archive them together, then decide what to keep or delete after emotions log off.' },
      c: { label: 'Clean them up thoroughly, so I do not doom-scroll back at midnight.' },
    },
  },
  'lbti-q30': {
    context:
      'Withdrawal defense model · You have decided this relationship should not continue. Only the final closing action remains.',
    prompt: 'When pressing the end key, how are you most likely to exit?',
    options: {
      a: { label: 'Say it clearly. Even if it is hard, I want the ending to be complete.' },
      b: { label: 'Lower the frequency slowly and let the relationship go out by itself.' },
      c: { label: 'Be decisive. I would rather hurt for a while than keep returning to the scene.' },
    },
  },
};

export const lbtiPersonalityEn: Record<string, PersonalityTranslation> = {
  'lbti-reply-phantom': {
    group: groupEn['开机过热组'],
    name: 'Do Not Disturb Type',
    badge: '99+ / self-mock default profile',
    vibe: 'The moment a message is read, your inner drama updates straight to the finale.',
    summary:
      'You do not merely care. When a chat goes quiet, your brain starts asking whether everything is over. Reply speed, tone, punctuation, and closeness all become relationship thermometers.',
    whyItHits:
      'You are not asking for a 24-hour check-in. You just do not want to guess inside empty air. For you, love needs echo, landing, and one sentence that stops the heart meeting.',
    dimensionRead: [
      'You notice response speed before assuming everything is naturally fine.',
      'Your tolerance for vague status is low; the more you like them, the more you want to read the temperature.',
      'Once the relationship drops offline, your mind runs ahead of reality.',
    ],
    sweetSpot: 'You make care concrete, so the other person rarely doubts whether they matter.',
    stressSignal: 'When the chat goes cold or the tone fades, you first complete the worst version in your head.',
    repairTip: 'Stable responses and clear rhythm work better for you than "do not overthink".',
  },
  'lbti-sweet-guard': {
    group: groupEn['开机过热组'],
    name: 'Devotion Refiller',
    badge: 'TIAN-G / self-mock default profile',
    vibe: 'When the mood cools, you immediately want to add fire back into the relationship.',
    summary:
      'You are the auto-refill machine in a relationship. When the mood cools, you instinctively add words, sweetness, and emotional fuel before intimacy turns into plain water.',
    whyItHits:
      'You do not only want to be loved; you also keep love warm. Other people date by fate. You date like maintaining a tiny heater that must not lose power.',
    dimensionRead: [
      'You keep supplying energy instead of waiting for the other person to light the match.',
      'Cooling down hurts you more than arguing because you fear the relationship losing its voice.',
      'You prefer steady flowing intimacy over hot-and-cold excitement.',
    ],
    sweetSpot: 'You are good at turning abstract affection into felt companionship and repair.',
    stressSignal: 'If you are the only one warming things up for too long, tenderness turns into exhaustion.',
    repairTip: 'The best relationship for you is maintained together, not powered only by you.',
  },
  'lbti-flirt-archaeologist': {
    group: groupEn['开机过热组'],
    name: 'Self-Strategy Archaeologist',
    badge: 'SB-lv / self-mock default profile',
    vibe: 'One period, half a tilde, or one deleted message is enough for you to open a case overnight.',
    summary:
      'You can read three layers of emotion from half a tilde. It is not drama; you genuinely believe details are more honest than "I am fine".',
    whyItHits:
      'You want to understand the relationship without looking too active, so you evolved into a flirtation detective. Others read chat logs. You read the method.',
    dimensionRead: [
      'You are sensitive to language details and interaction changes.',
      'You want to read the relationship, but may not want to put the issue on the table first.',
      'You are not simply insecure; you use evidence to settle yourself.',
    ],
    sweetSpot: 'You can detect many temperature shifts others miss, and your intuition is often not wrong.',
    stressSignal: 'Without clear response, you replay and interpret details repeatedly.',
    repairTip: 'Do not only be the evidence collector. Speaking directly sometimes ends the archaeology faster.',
  },
  'lbti-reverse-clinger': {
    group: groupEn['开机过热组'],
    name: 'Whatever-But-Not-Really Type',
    badge: 'OJBK-er / self-mock default profile',
    vibe: 'You say "whatever", but inside you have replayed "why are you not comforting me" three times.',
    summary:
      'On the surface you look like "leave me alone"; inside it is "you better not actually leave me alone". You are good at acting tough and packaging the wish to be comforted as indifference.',
    whyItHits:
      'You want closeness and fear being too readable, so you bounce between "come hug me" and "who cares". That is your classic love skin.',
    dimensionRead: [
      'You hope others read you first instead of exposing your cards first.',
      'Your spoken independence and inner expectation are often out of sync.',
      'The hardest part is not liking someone, but admitting you also want to be held.',
    ],
    sweetSpot: 'You have strong personal boundaries while keeping sensitivity and heat when moved.',
    stressSignal: 'The more you fear losing control, the more you hide closeness behind coldness.',
    repairTip: 'Saying "I need space, not disconnection" can prevent many accidental wounds.',
  },
  'lbti-romance-auditor': {
    group: groupEn['关系运营组'],
    name: 'Invalid ATM',
    badge: 'ATM-404 / self-mock default profile',
    vibe: 'Falling hard is allowed, but commitment, action, and logic need a three-way audit.',
    summary:
      'You are not heartless; you just hold an internal audit before going all in. Can promises cash out, can heat continue, do words match actions? You want to see it clearly.',
    whyItHits:
      'You know feelings alone can crash, so you do relationship due diligence first. Others date first and review later; you review before deciding whether to date.',
    dimensionRead: [
      'You naturally compare consistency rather than surviving on emotion.',
      'You want something sustainable, not only dramatic.',
      'You do not fear slow; you fear noise without landing.',
    ],
    sweetSpot: 'You can pull a relationship back from intoxication to reality and reduce blind overinvestment.',
    stressSignal: 'Once words and actions do not match, you cool down and keep a backup quickly.',
    repairTip: 'Not every relationship needs a spreadsheet, but the other person must not treat you like a fool.',
  },
  'lbti-love-pm': {
    group: groupEn['关系运营组'],
    name: 'Probation Lover',
    badge: 'BETA-01 / self-mock default profile',
    vibe: 'Ambiguity is only warm-up. A real relationship needs someone to manage the launch.',
    summary:
      'You fear relationships stuck at "if you know, you know" with nobody moving forward. You confirm, push, and upgrade flirtation from draft to official version.',
    whyItHits:
      'You have a natural project-management brain for relationships. Blur drains you; progress calms you. You often carry the question: when does this love go live?',
    dimensionRead: [
      'You naturally prefer solving problems when they appear.',
      'Guess-based relationships consume too much battery for you.',
      'You struggle when both people clearly care but neither takes one step forward.',
    ],
    sweetSpot: 'You remove a lot of unnecessary delay and misunderstanding from relationships.',
    stressSignal: 'If you are the only one pushing, you start feeling like a one-person project team.',
    repairTip: 'The right person for you will not take your initiative for granted.',
  },
  'lbti-script-immune': {
    group: groupEn['关系运营组'],
    name: 'Background Character Lover',
    badge: 'NPC / self-mock default profile',
    vibe: 'Cheesy lines can be heard, but truth still needs verification.',
    summary:
      'You can listen to sweet talk, but two intense sentences will not make you surrender your heart. You trust actions, rhythm, and delivery rate, like an anti-scam center for romance.',
    whyItHits:
      'You are not cold; you are good at identifying low-cost passion. While others are swept up by mood, you check whether this is real care or prepackaged sweetness.',
    dimensionRead: [
      'Your judgment relies more on behavior evidence than verbal intensity.',
      'You are attracted to stability more than tricks.',
      'You are not difficult; you are hard to fool with cheap effort.',
    ],
    sweetSpot: 'You filter out many relationships with sugar coating but no structure.',
    stressSignal: 'Once you sense someone only talks and does not do, you pull your heart back fast.',
    repairTip: 'The right person may not speak the most, but cannot keep breaking promises.',
  },
  'lbti-weather-station': {
    group: groupEn['关系运营组'],
    name: 'Drama Fracture Type',
    badge: 'EMO-ji / self-mock default profile',
    vibe: 'While others are still under the romance filter, you already smell the weather changing.',
    summary:
      'You are like a love weather plugin. While others are sunbathing, you already smell the cloudy front. You sense cooling, imbalance, and perfunctory care half a step early.',
    whyItHits:
      'You are not trying to ruin the mood; you detect wind direction early. By the time others ask "are we weird?", your inner weather station has usually issued a yellow warning.',
    dimensionRead: [
      'You instinctively monitor temperature before problems fully happen.',
      'The more you care, the earlier you see risk.',
      'Your defense is accumulated from warnings, not sudden mood.',
    ],
    sweetSpot: 'You are good at seeing where a relationship may break before the pot needs repair.',
    stressSignal: 'If warnings are ignored for too long, you turn from reminding into quietly leaving.',
    repairTip: 'You do not need "stop overthinking"; you need someone willing to look at the weather map with you.',
  },
  'lbti-open-mic': {
    group: groupEn['正面处理组'],
    name: 'Pure Love Warrior',
    badge: 'SIMP / self-mock default profile',
    vibe: 'If speaking works, why hold an internal overthinking meeting?',
    summary:
      'You really dislike acting. If one sentence can clarify it, you do not want three days of ellipses. If it can be discussed today, you do not want to drag it into weekend anxiety.',
    whyItHits:
      'Your default relationship setting is open mic, not inner monologue. Say the liking, talk through the weirdness, dismantle the problem. Your directness makes you look like a romance loudspeaker.',
    dimensionRead: [
      'You have a natural preference for clarity; dragging things out makes you more anxious.',
      'You are willing to put emotions on the table instead of hiding them between words.',
      'You may not have a big temper, but it is hard for you to pretend nothing happened.',
    ],
    sweetSpot: 'You keep relationships flowing honestly instead of rotting in silence.',
    stressSignal: 'If the other person keeps dodging, you become harder, louder, and more tired.',
    repairTip: 'You need someone who can catch direct balls, not leave you performing solo.',
  },
  'lbti-emotion-translator': {
    group: groupEn['正面处理组'],
    name: 'Backup Tire',
    badge: 'BEI-T / self-mock default profile',
    vibe: 'Even at peak conflict, you can ship the relationship a step down.',
    summary:
      'When two people are about to explode, you can offer steps, translate emotions, and rewrite harsh words into something still catchable. You are not weak; you are preserving the bridge.',
    whyItHits:
      'Your gift is not winning the fight, but dragging the relationship back from the battlefield. When others want victory, you still ask how to say this without burning the bridge.',
    dimensionRead: [
      'You can move conflict from battlefield back to negotiation table.',
      'You care more about whether both people can keep talking than who softened first.',
      'You naturally take on the lubricant role in relationships.',
    ],
    sweetSpot: 'You turn many explosive moments into moments where closeness can still continue.',
    stressSignal: 'If you are always the translator, you may feel like the relationship’s live interpreter.',
    repairTip: 'Do not explain everyone else so much that your own hurt disappears from the sentence.',
  },
  'lbti-coldwar-bomb': {
    group: groupEn['正面处理组'],
    name: 'Boulder Monkey',
    badge: 'MAMO / self-mock default profile',
    vibe: 'When the relationship goes silent, you want to push the wall down immediately.',
    summary:
      'What you cannot stand most is not arguing, but coldness. When the relationship goes silent, you want to knock the wall down because you know silence grows misunderstandings and ghosts.',
    whyItHits:
      'Your tolerance for cold war is almost zero. Others want to wait; you think waiting turns it into ruins, so you often rush in to dig up every mine.',
    dimensionRead: [
      'You actively chase problems instead of burying mines in the relationship.',
      'You do not fear hard conversations; you fear nobody talking.',
      'You would rather face real repair than wait passively.',
    ],
    sweetSpot: 'You have strong relationship rescue instincts and rarely let misunderstandings rot structurally.',
    stressSignal: 'If the other person keeps not responding, you shift from bomb disposal to bare-handed mine clearing.',
    repairTip: 'You fit people with response ability, not people who use silence as a defense system.',
  },
  'lbti-breakup-buffer': {
    group: groupEn['正面处理组'],
    name: 'Cyber Widow',
    badge: 'GHOST / self-mock default profile',
    vibe: 'Even saying goodbye needs one layer of cushioning.',
    summary:
      'You are not unable to leave; you just want to cushion the ending. Even if the relationship must end, you hope it does not fall too loud, too shattered, or too ugly.',
    whyItHits:
      'You can leave, but you have a heavy sense of dignity. Others unplug; you would rather place a buffer under both people so the scene does not crash straight down.',
    dimensionRead: [
      'You dislike sudden cutting and prefer letting the relationship land slowly.',
      'Before leaving, you try to make emotions less uncontrolled.',
      'You fear not the end itself, but an ending that is too ugly.',
    ],
    sweetSpot: 'You know how to leave dignity in a relationship and rarely turn endings into disaster films.',
    stressSignal: 'If you keep caring only about the other person’s feelings, you may delay your real decision.',
    repairTip: 'Gentleness is not an excuse for delay. Saying it clearly at the right time is more responsible.',
  },
  'lbti-graceful-ghost': {
    group: groupEn['撤退保护组'],
    name: 'Hollow One',
    badge: 'GUA / self-mock default profile',
    vibe: 'When something is truly wrong, you do not fight. You quietly set yourself offline.',
    summary:
      'It is not that you feel nothing. You are used to leaving yourself an exit key. When things are wrong, you pack your emotions, cancel expectations, and slowly withdraw.',
    whyItHits:
      'You are very good at protecting yourself, so people think you do not care. Actually, compared with being seen vulnerable, you are used to closing the door before going offline.',
    dimensionRead: [
      'When uncertainty rises, you withdraw first instead of risking exposure.',
      'You are not cold; you know the cost of being messy.',
      'You are good at calm exit, not loud pleading.',
    ],
    sweetSpot: 'You have strong self-protection and dignity, so you rarely burn yourself to collapse.',
    stressSignal: 'A lot of real care gets packaged by you as "I am fine".',
    repairTip: 'If you still want the relationship, give the other person a chance to know you care.',
  },
  'lbti-heart-escape': {
    group: groupEn['撤退保护组'],
    name: 'Signal Lost Type',
    badge: 'WiFi-0 / self-mock default profile',
    vibe: 'You do have feelings; every serious moment just makes you keep one exit open.',
    summary:
      'It is not that you never fall. It is that the moment you fall, you want to hit Esc. The more serious and out of control it feels, the more likely you are to crash out.',
    whyItHits:
      'What you fear is not love itself, but losing control after becoming serious. When heartbeat gets close, your brain pops up: exit current page now?',
    dimensionRead: [
      'You become more alert when you start taking someone seriously.',
      'Being held, surrounded, or defined too quickly triggers your alarm.',
      'You do not avoid love; you avoid losing the way out.',
    ],
    sweetSpot: 'You keep a strong sense of self and do not hand over your whole life just because you are dating.',
    stressSignal: 'If closeness moves faster than your comfort zone, you brake hard or flee.',
    repairTip: 'Slow is fine, but do not let "protecting myself" become never reaching intimacy.',
  },
  'lbti-watchtower': {
    group: groupEn['撤退保护组'],
    name: 'Love Test Fool',
    badge: 'SBTI-LOVE / self-mock default profile',
    vibe: 'Check the wind, eat some popcorn, then decide whether to enter the scene.',
    summary:
      'You are a high-quality spectator at the love scene. You watch, analyze, and empathize seriously, but whether you personally enter depends on seeing the wind direction and emergency exits.',
    whyItHits:
      'You are not indifferent; you simply understand what investment means. Others rush first and think later. You watch two episodes and confirm it is not a bad ending before buying the membership.',
    dimensionRead: [
      'You build judgment before deciding the depth of emotional investment.',
      'You do not like blind rushing and trust conclusions after long observation.',
      'You are like a small station near the relationship, always checking pressure.',
    ],
    sweetSpot: 'You have judgment and avoid many disasters caused by blind infatuation.',
    stressSignal: 'Watching too long without entering can let real chances slide away.',
    repairTip: 'Observation is not wrong, but at some point the telescope has to come down.',
  },
  'lbti-slow-teaser': {
    group: groupEn['撤退保护组'],
    name: 'Passive Connector',
    badge: 'WiFi-er / self-mock default profile',
    vibe: 'Outside you are buffering; inside you have secretly loaded to 67%.',
    summary:
      'You look like buffering, but your inner system has long been loading. Others think you have no reaction, while you have rehearsed closeness, testing, and confirmation several times.',
    whyItHits:
      'Your feelings often happen in the kernel first while the public version updates slowly. You look slow to warm up, but emotion is running quietly in the background.',
    dimensionRead: [
      'Your inner temperature may not rise slowly; it just looks slow outside.',
      'You need time to confirm the feeling and time to say it out loud.',
      'Once serious, you tend to become deeper and deeper.',
    ],
    sweetSpot: 'You do not hand yourself over easily, but once you do, it is usually serious.',
    stressSignal: 'If the other person only reads the surface, your real feelings may never be spoken in time.',
    repairTip: 'Giving a little visible signal helps others know you are not indifferent.',
  },
};

const metaEn: Partial<TestMeta> = {
  title: 'LBTI Love Behavior Type Indicator',
  hook: 'Use real relationship scenarios to see whether you are more like TIAN-G, 99+, BETA-01, or another love role.',
  summary:
    'Starting from response, expression, repair, boundaries, commitment, and retreat defense, LBTI turns relationship habits into a shareable love label.',
  seoTitle: 'LBTI Love Behavior Type Indicator',
  seoDescription:
    'A love personality test based on six continuous relationship dimensions and vector matching. Results support poster export and mobile sharing.',
  accentLabel: 'Rose Channel Edition 01',
  durationLabel: 'about 6 minutes',
};

const dimensionEn: Record<string, { title: string; leftLabel: string; rightLabel: string; coverage?: string }> = {
  attunement: {
    title: 'Response Sensitivity',
    leftLabel: 'Self-Steady',
    rightLabel: 'High Response Need',
    coverage: 'Covers attachment security, feeling understood, and whether daily bids are received.',
  },
  signal: {
    title: 'Expression & Vulnerability',
    leftLabel: 'Indirect Probe',
    rightLabel: 'Direct Signal',
    coverage: 'Covers love signals, initiative, public expression, and vulnerable disclosure.',
  },
  repair: {
    title: 'Conflict Repair',
    leftLabel: 'Silent Cooldown',
    rightLabel: 'Direct Repair',
    coverage: 'Covers post-conflict repair, dyadic coping, offering steps down, and review habits.',
  },
  boundary: {
    title: 'Autonomy Boundary',
    leftLabel: 'Relationship Fusion',
    rightLabel: 'Autonomy First',
    coverage: 'Covers check-ins, contact frequency, personal space, and control sensitivity.',
  },
  certainty: {
    title: 'Commitment Clarity',
    leftLabel: 'Can Live in Blur',
    rightLabel: 'Needs Definition',
    coverage: 'Covers relationship definition, exclusivity, stable expectations, and fulfillment.',
  },
  retreat: {
    title: 'Withdrawal Defense',
    leftLabel: 'Stay and Carry',
    rightLabel: 'Retreat to Protect',
    coverage: 'Covers cold treatment, avoidance, dignified exit, and reconnection strategies.',
  },
};

const methodologyEn: TestMeta['methodology'] = {
  inspiration: [
    'Adult attachment and partner responsiveness explain stable differences in closeness and withdrawal.',
    'Gottman research on bids and repair shows that relationship quality depends on receiving connection attempts and repair attempts.',
    'Investment and commitment models explain why people need definition, exclusivity, and fulfillment.',
    'Autonomy and boundary negotiation show that intimacy is an ongoing rhythm of space, transparency, and control.',
    'Dyadic coping shows that many relationship problems appear when partners cannot handle pressure together.',
  ],
  scoring:
    'The question set records six relationship dimensions, then matches your vector to 16 core roles by cosine similarity. The same result is rendered as a self-mock face, animal face, and sweet face.',
  disclaimer:
    'This is an entertainment-oriented relationship behavior test, not a clinical diagnosis. Use it to describe recent interaction patterns, not to decide your permanent identity.',
  questionPrinciples: [
    {
      key: 'attunement',
      title: 'Response Questions',
      text: 'Reads your need for stable response and safety through read receipts, contact rhythm, and emotional low points.',
      sourceIds: ['fraley-2019', 'reis-2023', 'gottman-bids'],
    },
    {
      key: 'signal',
      title: 'Expression Questions',
      text: 'Reads whether you send needs outward through love signals, public expression, vulnerability, and reconnection style.',
      sourceIds: ['reis-2023', 'gottman-bids'],
    },
    {
      key: 'repair',
      title: 'Repair Questions',
      text: 'Reads whether you cool down and wait or use repair to pull the relationship back.',
      sourceIds: ['gottman-repair', 'hilpert-2016'],
    },
    {
      key: 'boundary',
      title: 'Boundary Questions',
      text: 'Reads how you tune intimacy and autonomy through check-ins, location sharing, frequency, and space.',
      sourceIds: ['reis-2023', 'fraley-2019'],
    },
    {
      key: 'certainty',
      title: 'Commitment Questions',
      text: 'Reads how much you need definition, exclusivity, fulfilled promises, and future direction.',
      sourceIds: ['le-agnew-2003'],
    },
    {
      key: 'retreat',
      title: 'Retreat Questions',
      text: 'Reads whether you keep carrying the relationship or protect yourself first when instability appears.',
      sourceIds: ['fraley-2019', 'gottman-repair'],
    },
  ],
  sources: [],
};

function localizeQuestion(question: Question): Question {
  const translation = lbtiQuestionEn[question.id];
  if (!translation) return question;

  return {
    ...question,
    context: translation.context ?? question.context,
    prompt: translation.prompt,
    options: question.options.map((option) => ({
      ...option,
      ...(translation.options[option.id] ?? {}),
    })),
  };
}

export function localizePersonality(personality: Personality, locale: Locale): Personality {
  if (locale !== 'en') return personality;
  const translation = lbtiPersonalityEn[personality.id];
  if (!translation) return personality;
  return {
    ...personality,
    ...translation,
  };
}

function localizeMeta(meta: TestMeta): TestMeta {
  return {
    ...meta,
    ...metaEn,
    dimensionDetails: meta.dimensionDetails.map((detail) => ({
      ...detail,
      ...(dimensionEn[detail.key] ?? {}),
    })),
    methodology: {
      ...meta.methodology,
      ...methodologyEn,
      sources: (meta.methodology.sources ?? []).map((source) => ({
        ...source,
        takeaway:
          source.id === 'fraley-2019'
            ? 'Adult attachment explains stable differences in response needs, closeness, and withdrawal.'
            : source.id === 'reis-2023'
              ? 'Feeling understood, respected, and cared for is central to relationship satisfaction and safety.'
              : source.id === 'gottman-bids'
                ? 'Many couple interactions are small bids for connection that either get received or missed.'
                : source.id === 'gottman-repair'
                  ? 'Stable relationships depend not only on conflict intensity, but on whether repair attempts are received.'
                  : source.id === 'le-agnew-2003'
                    ? 'Commitment is shaped by satisfaction, alternatives, and investment, explaining the need for definition and fulfillment.'
                    : source.id === 'hilpert-2016'
                      ? 'How partners cope with stress together is consistently related to relationship satisfaction.'
                      : source.takeaway,
      })),
    },
  };
}

export function localizePack(pack: TestPack, locale: Locale): TestPack {
  if (locale !== 'en' || pack.meta.slug !== 'lbti') {
    return pack;
  }

  return {
    ...pack,
    meta: localizeMeta(pack.meta),
    questions: pack.questions.map(localizeQuestion),
    personalities: pack.personalities.map((personality) => localizePersonality(personality, locale)),
  };
}
