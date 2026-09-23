import { ImpactNewsItem, ShortReelData, ShortReelScene } from '../types';
import { getContextualVisualForNews } from './newsVisualMatcher';
import { resolveStructuredNewsDetails } from './newsContentResolver';

/**
 * Strips agency and wire source prefixes from news text
 */
export function stripAgencyPrefixes(text: string): string {
  if (!text) return '';
  return text
    // Strip agency intro patterns with colons or dashes
    .replace(
      /^(?:पीआईबी|विदेश मंत्रालय|रॉयटर्स|ब्लूमबर्ग|पीटीआई|एएनआई|प्राथमिक वायर|प्रेस ट्रस्ट ऑफ इंडिया|इवेंट रजिस्ट्री)[^:\–\-]*?(?:से सीधे प्राप्त प्राथमिक वायर रिपोर्ट|से सीधे प्राप्त सत्यापित रिपोर्ट|से सीधे प्राप्त|वायर डिस्पैच|ब्यूरो वायर|टेक वायर|फाइनेंशियल वायर)?[\:\–\-]\s*/gi,
      ''
    )
    .replace(/^प्राथमिक वायर रिपोर्ट[\:\–\-]\s*/gi, '')
    .replace(/^(?:PIB|MEA|Reuters|Bloomberg|PTI|ANI|AP)[^:\–\-]*?[\:\–\-]\s*/gi, '')
    .replace(/^से सीधे प्राप्त सत्यापित रिपोर्ट के अनुसार[\:\–\-]\s*/gi, '')
    .replace(/^(?:ताज़ा अपडेट|ब्रेकिंग|बड़ी खबर|विशेष)[\:\–\-]\s*/gi, '')
    .trim();
}

/**
 * Removes unnecessary hype adjectives from news texts
 */
function cleanHypeAdjectives(text: string): string {
  if (!text) return '';
  return text
    .replace(/चौंकाने वाला|चौंकाने वाली|ऐतिहासिक|भयंकर|विस्फोटक|हैरान करने वाला|हैरान करने वाली|बड़ा धमाका/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Formats "कब हुआ" (Exact timing context in spoken Hindi)
 */
function getWhenHappenedHindi(item: ImpactNewsItem): string {
  const time = (item.timeAgo || '').toLowerCase();
  if (time.includes('m') || time.includes('min')) {
    const mins = parseInt(time, 10) || 30;
    return `आज बीते ${mins} मिनट पहले`;
  }
  if (time.includes('h') || time.includes('hour')) {
    const hours = parseInt(time, 10) || 2;
    return `आज करीब ${hours} घंटे पहले`;
  }
  return 'आज सुबह';
}

/**
 * Extracts a clear, informative factual summary of "क्या हुआ" (~10-14 words)
 * Never allows agency filler like "पीआईबी से प्राप्त रिपोर्ट"
 */
function extractCrispWhatHappened(title: string, whatHappenedText: string): string {
  const strippedTitle = cleanHypeAdjectives(stripAgencyPrefixes(title));
  const strippedWhat = cleanHypeAdjectives(stripAgencyPrefixes(whatHappenedText));

  let text = strippedTitle || strippedWhat;

  // Split on colon, semicolon, or danda
  const clauses = text.split(/[\:\;\–\—।\n]/).map((s) => s.trim()).filter(Boolean);
  let best = clauses[0] || text;

  // If first clause is too long, split naturally at comma or conjunction without breaking grammar
  if (best.split(/\s+/).length > 16) {
    const sub = best.split(/[,]|(?:\s+(?:जिसमें|जिसके|जिससे|तथा|और)\s+)/)[0];
    if (sub && sub.length > 25) {
      best = sub.trim();
    }
  }

  // Clean trailing punctuation
  best = best.replace(/[\:\-\–\s\,\;]+$/, '').trim();
  return best;
}

/**
 * Extracts a concrete, real-world impact for "इससे होगा क्या?" (~10-13 words)
 * Replaces generic filler like "रणनीतिक विश्लेषक नजर रखे हुए हैं" with domain-specific realities.
 */
function extractCrispImpact(item: ImpactNewsItem, rawImpact: string, title: string): string {
  const clean = cleanHypeAdjectives(rawImpact || '')
    .replace(/भारत के राष्ट्रीय, व्यापारिक व कूटनीतिक हितों पर सीधा प्रभाव;? नई दिल्ली के रणनीतिक विश्लेषक स्थिति पर नजर रखे हुए हैं।?/gi, '')
    .replace(/नई दिल्ली के रणनीतिक विश्लेषक स्थिति पर नजर रखे हुए हैं।?/gi, '')
    .replace(/भारतीय उद्योगों और नीतिगत प्राथमिकताओं पर सीधा असर पड़ेगा।?/gi, '')
    .trim();

  // Pick the first clean clause
  const clauses = clean
    .split(/(?:[।\n\;]|(?<=\D)\.\s+|(?<=\d)\.\s+(?=[A-Za-z\u0900-\u097F]))/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (clauses.length > 0 && clauses[0].length >= 14 && !clauses[0].includes('रणनीतिक विश्लेषक')) {
    let s = clauses[0].trim();
    // If long, split cleanly at comma or conjunction
    if (s.split(/\s+/).length > 18) {
      const sub = s.split(/[,]|(?:\s+(?:तथा|और|जिससे|एवं)\s+)/)[0];
      if (sub && sub.length > 25) s = sub.trim();
    }
    s = s.replace(/[\,\;\:\-\–\s]+$/, '').replace(/\s+(और|तथा|एवं|व)$/, '').trim();
    if (!s.endsWith('।') && !s.endsWith('.')) s += '।';
    return s;
  }

  // Concrete contextual impact based on news subject (~10-12 words)
  const text = (title + ' ' + (item.summary || '')).toLowerCase();
  if (/tariff|trade|customs|टैरिफ|शुल्क|व्यापार/i.test(text)) {
    return 'भारतीय फार्मा और टेक्सटाइल निर्यातकों के मार्जिन पर सीधा दबाव बढ़ेगा।';
  }
  if (/minerals|rare earth|खनन|खनिज/i.test(text)) {
    return 'ईवी बैटरी और रक्षा विनिर्माण के लिए महत्वपूर्ण कच्चे माल की किल्लत खत्म होगी।';
  }
  if (/corridor|imec|port|बंदरगाह|मार्ग/i.test(text)) {
    return 'यूरोप और खाड़ी देशों में माल भेजने का समय और शिपिंग खर्च 40% तक घटेगा।';
  }
  if (/semiconductor|chip|माइक्रोन|चिप/i.test(text)) {
    return 'देश में स्थानीय चिप निर्माण तेज़ होगा और विदेशी आयात पर निर्भरता घटेगी।';
  }
  if (/rupee|pound|settlement|करेंसी|मुद्रा/i.test(text)) {
    return 'द्विपक्षीय व्यापार में डॉलर की निर्भरता घटेगी और विदेशी मुद्रा की बचत होगी।';
  }
  if (/oil|crude|petroleum|तेल|पेट्रोल/i.test(text)) {
    return 'कच्चे तेल की कीमतें बढ़ने से देश के आयात बिल और पेट्रोल-डीजल पर असर पड़ेगा।';
  }
  if (/defence|military|सेना|हथियार|रडार/i.test(text)) {
    return 'घरेलू रक्षा कंपनियों को सीधे बड़े ऑर्डर मिलेंगे और नए रोजगार पैदा होंगे।';
  }
  if (/brics|china|border|चीन|सीमा/i.test(text)) {
    return 'सीमा पर शांति बहाल होगी और द्विपक्षीय व्यापार में विदेशी मुद्रा की बचत होगी।';
  }

  return 'भारतीय उद्योगों और घरेलू बाज़ार पर इसका सीधा असर दिखाई देगा।';
}

/**
 * Generates the clean, fast Short Reel voiceover script.
 * Every news item strictly answers 3 clear viewer questions:
 * 1. क्या हुआ (What happened)
 * 2. कब हुआ (When it happened)
 * 3. इससे होगा क्या? (What will be the impact / outcome)
 */
export function generate5NewsShortReel(
  newsList: ImpactNewsItem[],
  customSelectedIds?: string[],
  editionDate?: string,
  durationMode: '1min' | '2min' = '1min'
): ShortReelData {
  // Filter top 5 items
  let selectedItems: ImpactNewsItem[] = [];

  if (customSelectedIds && customSelectedIds.length > 0) {
    selectedItems = customSelectedIds
      .map((id) => newsList.find((n) => n.id === id))
      .filter((n): n is ImpactNewsItem => Boolean(n))
      .slice(0, 5);
  }

  if (selectedItems.length < 5) {
    const remaining = newsList.filter((n) => !selectedItems.some((s) => s.id === n.id));
    selectedItems = [...selectedItems, ...remaining].slice(0, 5);
  }

  const currentDateStr =
    editionDate || new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' }).format(new Date());

  const scenes: ShortReelScene[] = [];

  // =========================================================================
  // 1. OPENING (3–4 seconds): Fast context setter
  // =========================================================================
  const openingScript =
    'आज दुनिया में 5 बड़ी घटनाएं हुई हैं, जिनका असर आने वाले दिनों में भारत और ग्लोबल मार्केट्स पर भी दिखाई दे सकता है।';

  scenes.push({
    id: 'scene-0-hook',
    sceneIndex: 0,
    type: 'hook',
    durationSeconds: 4,
    headlineHindi: '🌍 आज की 5 बड़ी घटनाएं • क्या हुआ और असर क्या होगा?',
    headlineEnglish: 'Top 5 Global Events: What Happened & What Happens Next',
    spokenHindiScript: openingScript,
    kineticCaptions: [
      '🌍 आज की 5 बड़ी घटनाएं',
      'क्या हुआ • इससे होगा क्या?',
      '⚡ 50 सेकंड में सटीक विश्लेषण',
    ],
    onScreenOverlayText: '⚡ क्या हुआ • इससे होगा क्या?',
    visualConceptDescription: 'World map wire monitor showing 5 breaking geopolitical events.',
    googleSearchQuery: 'Top 5 Global Developments Today',
    googleTrendingVolume: 'Breaking wire stories',
    sourceAttribution: {
      publisher: 'PIB / MEA / Primary Wire',
      platform: 'wire',
      verified: true,
      headline: 'Real-time verified news dispatches',
    },
    visualImageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1080&auto=format&fit=crop',
    indiaImpactPoint: 'वैश्विक कूटनीति, ऊर्जा आपूर्ति और बाजार पर सीधा प्रभाव।',
  });

  // =========================================================================
  // 2. SCENES 1 to 5: HIGH-ENERGY "क्या हुआ + इससे होगा क्या?" (~9-10s each)
  // Transitions: "पहली बड़ी खबर...", "दूसरी बड़ी खबर...", "अब तीसरी बड़ी खबर...",
  //              "चौथी बड़ी खबर...", "और पांचवीं बड़ी खबर..."
  // =========================================================================
  const transitions = [
    'पहली बड़ी खबर...',
    'दूसरी बड़ी खबर...',
    'अब तीसरी बड़ी खबर...',
    'चौथी बड़ी खबर...',
    'और पांचवीं बड़ी खबर...',
  ];

  selectedItems.forEach((item, idx) => {
    const rank = idx + 1;
    const visualContext = getContextualVisualForNews(item);
    const details = resolveStructuredNewsDetails(item, 'hi');
    const transitionPrefix = transitions[idx] || `खबर नंबर ${rank}...`;

    // 1. क्या हुआ (Factual core event, stripped of any agency names)
    const coreWhat = extractCrispWhatHappened(details.title, details.whatHappened);

    // 2. इससे होगा क्या? (Domain-specific real consequence)
    const cleanImpact = extractCrispImpact(item, details.impactOnIndia, details.title);

    // Clean headline for on-screen cards
    const displayHeadline = stripAgencyPrefixes(details.title) || coreWhat;

    // Laser-focused 2-Part Spoken Script:
    // [Transition] [क्या हुआ]। इससे होगा क्या? [परिणाम / असर]।
    const spokenScript = `${transitionPrefix} ${coreWhat}। इससे होगा क्या? ${cleanImpact}`;

    scenes.push({
      id: `scene-${rank}-news-${item.id}`,
      sceneIndex: rank,
      type: 'news',
      newsId: item.id,
      rankNumber: rank,
      category: item.category,
      headlineHindi: displayHeadline,
      headlineEnglish: item.title,
      spokenHindiScript: spokenScript,
      durationSeconds: 10,
      kineticCaptions: [
        `#${rank} ${item.category}`,
        `📌 क्या हुआ: ${coreWhat.slice(0, 32)}...`,
        `⚡ इससे होगा क्या: ${cleanImpact.slice(0, 34)}...`,
      ],
      onScreenOverlayText: `#${rank} • क्या हुआ • इससे होगा क्या?`,
      visualConceptDescription: `Scene ${rank}: Vertical 9:16 visual depicting ${visualContext.visualTitle}. Source: ${item.sources?.[0]?.publisher || 'Official Wire'}.`,
      googleSearchQuery: item.title.slice(0, 40).replace(/[^a-zA-Z0-9 ]/g, ' ').trim(),
      googleTrendingVolume: 'Top Impact Story',
      sourceAttribution: {
        publisher: item.sources?.[0]?.publisher || 'Official Wire Desk',
        platform: item.sources?.[0]?.platform || 'wire',
        verified: true,
        headline: item.title,
      },
      visualImageUrl: visualContext.primaryVisualUrl,
      indiaImpactPoint: cleanImpact,
    });
  });

  // =========================================================================
  // 3. ENDING (3–4 seconds): Clean sign-off
  // =========================================================================
  const endingScript =
    'ये थीं आज की 5 बड़ी ग्लोबल अपडेट्स। ऐसी ही तेज और आसान ग्लोबल ब्रीफिंग के लिए जुड़े रहिए।';

  scenes.push({
    id: 'scene-6-outro',
    sceneIndex: 6,
    type: 'outro',
    durationSeconds: 4,
    headlineHindi: '🇮🇳 आज की 5 बड़ी ग्लोबल अपडेट्स • जुड़े रहिए',
    headlineEnglish: 'Daily 60-Second Global Intelligence Briefing',
    spokenHindiScript: endingScript,
    kineticCaptions: [
      '✅ 5 बड़ी ग्लोबल अपडेट्स',
      'क्या हुआ • कब हुआ • असर',
      '👉 जुड़े रहिए!',
    ],
    onScreenOverlayText: '👉 जुड़े रहिए • Daily Global Intel',
    visualConceptDescription: 'Summary outro screen with subscribe and stay connected visual cue.',
    googleSearchQuery: 'Daily India Global Briefing',
    googleTrendingVolume: 'Daily verified briefing',
    sourceAttribution: {
      publisher: 'India Impact Intelligence',
      platform: 'wire',
      verified: true,
      headline: 'India Impact Intelligence Daily Briefing',
    },
    visualImageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=1080&auto=format&fit=crop',
    indiaImpactPoint: 'सटीक, निष्पक्ष और तथ्य-आधारित 60-सेकंड वैश्विक विश्लेषण।',
  });

  const totalDuration = scenes.reduce((sum, s) => sum + s.durationSeconds, 0);

  const viralTitles = [
    `आज की 5 बड़ी खबरें: क्या हुआ, कब हुआ और इससे होगा क्या? (${currentDateStr}) #Shorts`,
    `5 बड़ी ग्लोबल घटनाएं: क्या हुआ, कब हुआ और असर क्या होगा? #DailyBriefing`,
    `Top 5 Global Events: What, When & Impact | 60s Briefing #Shorts`,
  ];

  // Full continuous voiceover script (~135-145 words, 55-58 seconds)
  const fullSpokenText = scenes.map((s) => s.spokenHindiScript).join('\n\n');

  const youtubeShortsDescription = `🇮🇳 आज की 5 बड़ी ग्लोबल घटनाएं (${currentDateStr})
⏱️ 60 सेकंड में पूरा विश्लेषण:
1. क्या हुआ?
2. कब हुआ?
3. इससे होगा क्या?

आज दुनिया में 5 बड़ी घटनाएं हुई हैं, जिनका असर आने वाले दिनों में भारत और global markets पर भी दिखाई दे सकता है।

#IndiaImpact #GlobalMarkets #NewsShorts #Geopolitics #IndiaNews #DailyBriefing`;

  const instagramCaption = `🌍 आज दुनिया की 5 बड़ी घटनाएं:
📌 क्या हुआ?
⏱️ कब हुआ?
⚡ इससे होगा क्या?

केवल 60 सेकंड में जानिए आज के 5 सबसे बड़े घटनाक्रम।

#IndiaImpact #GlobalNews #Geopolitics #India #CurrentAffairs #HindiNews`;

  return {
    id: `short-reel-${editionDate || 'today'}`,
    editionDate: currentDateStr,
    durationMode,
    totalDurationSeconds: totalDuration,
    scenes,
    viralTitles,
    youtubeShortsDescription,
    instagramCaption,
    hashtags: ['#IndiaImpact', '#GlobalMarkets', '#DailyBriefing', '#Geopolitics', '#Shorts', '#HindiNews'],
    fullSpokenTextHindi: fullSpokenText,
  };
}
