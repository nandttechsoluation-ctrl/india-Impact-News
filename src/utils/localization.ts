import { ImpactNewsItem, DailyBriefing, Language, ImpactLevel, Category } from '../types';
import { translations } from '../data/translations';
import { translateWireHeadline, translateWireSnippet, stripWireSourcePrefix } from './wireHeadlineTranslator';

function ensureHindiText(text: string | undefined, fallback: string): string {
  if (!text) return translateWireHeadline(fallback);

  // Strip any prepended wire source names like "रॉयटर्स वर्ल्ड व जियोपॉलिटिक्स वायर: "
  const cleaned = stripWireSourcePrefix(text);

  // Count Devanagari characters vs total letters
  const devanagariCount = (cleaned.match(/[\u0900-\u097F]/g) || []).length;
  const latinCount = (cleaned.match(/[a-zA-Z]/g) || []).length;

  // If mostly English or has prominent English wire headline, translate it
  if (latinCount > 10 && devanagariCount < latinCount * 0.4) {
    return translateWireHeadline(cleaned);
  }

  // If it starts with wire source in English like "Reuters Washington Bureau Wire: ..."
  if (/^(?:Reuters|PIB|MEA|Bloomberg|PTI|ANI|AP)\b/i.test(cleaned)) {
    return translateWireHeadline(cleaned);
  }

  return cleaned;
}

function ensureHindiSnippet(text: string | undefined, fallback: string): string {
  if (!text) return translateWireSnippet(fallback);

  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;

  if (latinCount > 20 && devanagariCount < latinCount * 0.3) {
    return translateWireSnippet(text);
  }

  return text;
}

export function getLocalizedNews(news: ImpactNewsItem, lang: Language) {
  if (lang === 'hi') {
    if (news.hi) {
      const finalTitle = ensureHindiText(news.hi.title, news.title);
      const finalSummary = ensureHindiSnippet(news.hi.summary, news.summary);
      const finalWhatHappened = ensureHindiSnippet(news.hi.whatHappened, news.whatHappened);

      return {
        title: finalTitle,
        summary: finalSummary,
        whatHappened: finalWhatHappened,
        whyHappening: news.hi.whyHappening || 'अंतरराष्ट्रीय आर्थिक नीतियों और द्विपक्षीय रणनीतिक प्राथमिकताओं में आए बदलावों के कारण यह घटनाक्रम हुआ है।',
        pastActionTitle: news.hi.pastActionTitle || 'प्राथमिक ब्रेकिंग वायर सूचना',
        pastActionDetails: news.hi.pastActionDetails || 'आधिकारिक वायर एजेंसी द्वारा बिना किसी सोशल मीडिया देरी के सीधे जारी सूचना।',
        strategicSummary: news.hi.strategicSummary || 'भारत के राष्ट्रीय व व्यापारिक हितों पर सीधा प्रभाव; नई दिल्ली के रणनीतिक विश्लेषक स्थिति पर नजर रखे हुए हैं।',
        economicImpact: news.hi.economicImpact || 'द्विपक्षीय व्यापार, आयात-निर्यात शुल्क और आपूर्ति श्रृंखलाओं पर संभावित प्रभाव।',
        securityImpact: news.hi.securityImpact || 'सुरक्षा और वाणिज्यिक दृष्टिकोण से महत्वपूर्ण मंत्रालयों द्वारा निरंतर समीक्षा।',
        diasporaOrTradeImpact: news.hi.diasporaOrTradeImpact,
        primaryAction: news.hi.primaryAction || 'संबंधित मंत्रालयों और उद्योग संघों के साथ त्वरित रणनीतिक समीक्षा बैठक।',
        strategicOptions: news.hi.strategicOptions || [
          'विदेश मंत्रालय के जरिए आधिकारिक स्पष्टीकरण जारी करना',
          'व्यापारिक साझेदारों के साथ उच्चस्तरीय परामर्श शुरू करना',
        ],
        diplomaticPosturing: news.hi.diplomaticPosturing || 'राष्ट्रीय स्वायत्तता और आर्थिक संप्रभुता की सुरक्षा को सर्वोच्च प्राथमिकता देना।',
      };
    }

    // If news.hi was not supplied (e.g. dynamic wire items), auto-translate into Hindi
    return {
      title: translateWireHeadline(news.title),
      summary: translateWireSnippet(news.summary),
      whatHappened: `प्राथमिक वायर रिपोर्ट: ${translateWireSnippet(news.whatHappened || news.summary)}`,
      whyHappening: 'अंतरराष्ट्रीय आर्थिक नीतियों और द्विपक्षीय रणनीतिक प्राथमिकताओं में आए ताजा बदलावों के कारण यह घटनाक्रम हुआ है।',
      pastActionTitle: 'प्राथमिक ब्रेकिंग वायर सूचना',
      pastActionDetails: `${news.wireOrigin?.sourceName || 'वायर एजेंसी'} द्वारा बिना किसी सोशल मीडिया देरी के सीधे जारी आधिकारिक सूचना।`,
      strategicSummary: `भारत के राष्ट्रीय व व्यापारिक हितों पर सीधा प्रभाव; नई दिल्ली के रणनीतिक विश्लेषक स्थिति पर नजर रखे हुए हैं।`,
      economicImpact: 'द्विपक्षीय व्यापार, आयात-निर्यात शुल्क और आपूर्ति श्रृंखलाओं पर संभावित प्रभाव।',
      securityImpact: 'सुरक्षा और वाणिज्यिक दृष्टिकोण से महत्वपूर्ण मंत्रालयों द्वारा निरंतर समीक्षा।',
      diasporaOrTradeImpact: 'संबंधित उद्योग हितधारकों और व्यापार परिषदों को स्थिति की निगरानी करने की सलाह।',
      primaryAction: 'संबंधित मंत्रालयों और उद्योग संघों के साथ त्वरित रणनीतिक समीक्षा बैठक।',
      strategicOptions: [
        'विदेश मंत्रालय के जरिए आधिकारिक स्पष्टीकरण जारी करना',
        'व्यापारिक साझेदारों के साथ उच्चस्तरीय परामर्श शुरू करना',
      ],
      diplomaticPosturing: 'राष्ट्रीय स्वायत्तता और आर्थिक संप्रभुता की सुरक्षा को सर्वोच्च प्राथमिकता देना।',
    };
  }

  return {
    title: stripWireSourcePrefix(news.title),
    summary: news.summary,
    whatHappened: news.whatHappened,
    whyHappening: news.whyHappening,
    pastActionTitle: news.pastActionOrigin?.actionTitle || '',
    pastActionDetails: news.pastActionOrigin?.details || '',
    strategicSummary: news.impactOnIndia?.strategicSummary || '',
    economicImpact: news.impactOnIndia?.economicImpact || '',
    securityImpact: news.impactOnIndia?.securityImpact || '',
    diasporaOrTradeImpact: news.impactOnIndia?.diasporaOrTradeImpact || '',
    primaryAction: news.nextPossibleMoveForIndia?.primaryAction || '',
    strategicOptions: news.nextPossibleMoveForIndia?.strategicOptions || [],
    diplomaticPosturing: news.nextPossibleMoveForIndia?.diplomaticPosturing || '',
  };
}

export function getLocalizedBriefing(briefing: DailyBriefing, lang: Language) {
  if (lang === 'hi') {
    let headlineHi = briefing.hi?.headline;
    if (!headlineHi || /Direct Wire Flash:/i.test(headlineHi)) {
      const wireTitleMatch = (headlineHi || briefing.headline).replace(/^(?:Direct Wire Flash:\s*|डायरेक्ट वायर फ्लैश:\s*)/i, '');
      headlineHi = `डायरेक्ट वायर फ्लैश: ${translateWireHeadline(wireTitleMatch)}`;
    }

    return {
      date: briefing.hi?.date || briefing.date,
      headline: headlineHi,
      executiveSummary: briefing.hi?.executiveSummary || translateWireSnippet(briefing.executiveSummary),
      keyTakeaways: (briefing.hi?.keyTakeaways && briefing.hi.keyTakeaways.length > 0)
        ? briefing.hi.keyTakeaways.map((t) => ensureHindiText(t, t))
        : briefing.keyTakeaways.map((t) => translateWireHeadline(t)),
      audioScript: briefing.hi?.audioScript || briefing.audioScript,
      pushAlertTitle: briefing.hi?.pushAlertTitle || ensureHindiText(briefing.pushAlert.title, briefing.pushAlert.title),
      pushAlertBody: briefing.hi?.pushAlertBody || ensureHindiSnippet(briefing.pushAlert.body, briefing.pushAlert.body),
    };
  }

  return {
    date: briefing.date,
    headline: briefing.headline,
    executiveSummary: briefing.executiveSummary,
    keyTakeaways: briefing.keyTakeaways,
    audioScript: briefing.audioScript,
    pushAlertTitle: briefing.pushAlert.title,
    pushAlertBody: briefing.pushAlert.body,
  };
}

export function getLocalizedImpactLevel(level: ImpactLevel, lang: Language): string {
  const t = translations[lang];
  switch (level) {
    case 'CRITICAL':
      return t.critical;
    case 'HIGH':
      return t.high;
    case 'MODERATE':
      return t.moderate;
    default:
      return level;
  }
}

export function getLocalizedCategory(category: Category, lang: Language): string {
  if (lang !== 'hi') return category;
  switch (category) {
    case 'Geopolitics & Defense':
      return 'भू-राजनीति एवं रक्षा';
    case 'Oil & Energy':
      return 'तेल एवं ऊर्जा';
    case 'Technology & Supply Chain':
      return 'प्रौद्योगिकी एवं चिप्स';
    case 'Trade & Economy':
      return 'व्यापार एवं अर्थव्यवस्था';
    case 'Diaspora & Visas':
      return 'प्रवासी भारतीय एवं वीजा';
    case 'Maritime & Logistics':
      return 'समुद्री मार्ग एवं रसद';
    default:
      return category;
  }
}
