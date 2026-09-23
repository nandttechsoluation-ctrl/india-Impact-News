import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  radarActive: string;
  rankedByImpact: string;
  refreshBtn: string;
  searchPlaceholder: string;
  allSources: string;
  allImpact: string;
  critical: string;
  high: string;
  moderate: string;
  itemsWithin24h: string;
  viewAnalysis: string;
  score: string;
  sourcesLabel: string;
  precursorAction: string;
  impactOnIndia: string;
  navFeed: string;
  navBriefing: string;
  navAnalyzer: string;
  navAlerts: string;
  tabOverview: string;
  tabCausality: string;
  tabIndiaImpact: string;
  tabNextMoves: string;
  tabSources: string;
  listenAudio: string;
  pauseAudio: string;
  listenInLang: string;
  playVoiceAI: string;
  morningBriefingTitle: string;
  opportunityIndexLabel: string;
  threatIndexLabel: string;
  keyTakeawaysTitle: string;
  coveredItemsTitle: string;
  analyzerTitle: string;
  analyzerSubtitle: string;
  analyzerLabel: string;
  analyzerPlaceholder: string;
  focusPlatform: string;
  runAnalysisBtn: string;
  analyzingPulse: string;
  trendingInquiries: string;
  openFullDossier: string;
  notificationHubTitle: string;
  notificationHubSubtitle: string;
  systemNotifStatus: string;
  enabled: string;
  enablePushBtn: string;
  testInstantDelivery: string;
  simulateCriticalAlert: string;
  simulateMorningBriefing: string;
  alertChannelsTitle: string;
  morningAlertLabel: string;
  morningAlertDesc: string;
  criticalAlertLabel: string;
  criticalAlertDesc: string;
  soundAlertLabel: string;
  soundAlertDesc: string;
  trayHistoryTitle: string;
  clearHistoryBtn: string;
  noNotifications: string;
  shareIntel: string;
  copied: string;
  simulatePush: string;
  whatHappenedTitle: string;
  whyHappeningTitle: string;
  pastActionTitle: string;
  strategicMoveTitle: string;
  tacticalOptionsTitle: string;
  diplomaticStanceTitle: string;
  crossPlatformDiscourse: string;
  twitterVolume: string;
  youtubeDeepDives: string;
  searchInterest: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'India Impact AI',
    appSubtitle: 'Global News & Social Media Monitor',
    radarActive: '24H Radar Live',
    rankedByImpact: 'Ranked by Impact on India',
    refreshBtn: 'Refresh',
    searchPlaceholder: 'Search news, crude oil, semiconductors, border pacts...',
    allSources: 'All Sources',
    allImpact: 'All Impact',
    critical: 'Critical',
    high: 'High',
    moderate: 'Moderate',
    itemsWithin24h: 'items <24h',
    viewAnalysis: 'View Analysis',
    score: 'Score',
    sourcesLabel: 'Sources',
    precursorAction: 'Precursor Action',
    impactOnIndia: 'Impact on India',
    navFeed: 'Impact News',
    navBriefing: 'Daily Briefing',
    navAnalyzer: 'AI Analyzer',
    navAlerts: 'Push Alerts',
    tabOverview: '1. Event & Drivers',
    tabCausality: '2. Past Action Origin',
    tabIndiaImpact: '3. Impact on India',
    tabNextMoves: '4. Next Move for India',
    tabSources: '5. Sources',
    listenAudio: 'Listen to Briefing',
    pauseAudio: 'Pause Audio Briefing',
    listenInLang: 'Listen in English',
    playVoiceAI: 'Play Audio Briefing (Voice AI)',
    morningBriefingTitle: 'Executive Strategic Readout',
    opportunityIndexLabel: 'Strategic & Economic Opportunity Index',
    threatIndexLabel: 'Regional Volatility & Chokepoint Risk',
    keyTakeawaysTitle: 'Key Strategic Takeaways',
    coveredItemsTitle: 'Top 24h Items Covered in Today\'s Briefing',
    analyzerTitle: 'Analyze Any Global Event for India Impact',
    analyzerSubtitle: 'Checks real-time discourse across X/Twitter, Google News, YouTube & social media within the last 24h, ranking strategic impact on India with causal past-action tracing.',
    analyzerLabel: 'Event, Topic, or Social Trend',
    analyzerPlaceholder: 'e.g. Strait of Hormuz tanker alerts, US semiconductor sanctions...',
    focusPlatform: 'Focus Platform (Optional)',
    runAnalysisBtn: 'Run Strategic Impact Analysis',
    analyzingPulse: 'Scanning 24h Global Feeds & Grounding AI...',
    trendingInquiries: 'Trending 24H Geopolitical Inquiries',
    openFullDossier: 'Open Comprehensive 5-Pillar Dossier',
    notificationHubTitle: 'Daily Briefing & Flash Alerts',
    notificationHubSubtitle: 'Configure real-time push alerts for high-impact geopolitical movements, energy corridor disruptions, and scheduled 08:00 IST morning briefings.',
    systemNotifStatus: 'System Notification Status',
    enabled: 'Enabled',
    enablePushBtn: 'Enable Push Notifications',
    testInstantDelivery: 'Test Instant Push Delivery',
    simulateCriticalAlert: 'Simulate Critical Alert',
    simulateMorningBriefing: 'Simulate Morning Briefing',
    alertChannelsTitle: 'Alert Channels & Thresholds',
    morningAlertLabel: 'Daily Morning Briefing (08:00 AM IST)',
    morningAlertDesc: 'AI synthesis of all top global events impacting India in past 24h',
    criticalAlertLabel: 'Critical Flash Alerts (Rank #1 & #2)',
    criticalAlertDesc: 'Instant alert for chokepoint blockades, energy crises & tech sanctions',
    soundAlertLabel: 'Haptic & Sound Notification Feedback',
    soundAlertDesc: 'Android device audio chime and tactile pulse on delivery',
    trayHistoryTitle: 'Notification Tray History',
    clearHistoryBtn: 'Clear History',
    noNotifications: 'No notifications in tray yet. Tap "Test Instant Push Delivery" above to generate one.',
    shareIntel: 'Share Intel',
    copied: 'Copied Link!',
    simulatePush: 'Simulate Push Alert',
    whatHappenedTitle: 'What Happened (< 24 Hours)',
    whyHappeningTitle: 'Why It Is Happening (Underlying Drivers)',
    pastActionTitle: 'Past Action Origin: Is this a result of any past action?',
    strategicMoveTitle: 'Recommended Primary Strategic Move',
    tacticalOptionsTitle: 'Tactical Policy Options & Levers',
    diplomaticStanceTitle: 'Diplomatic Posturing Stance',
    crossPlatformDiscourse: 'Cross-Platform Social Discourse',
    twitterVolume: 'X / Twitter Volume',
    youtubeDeepDives: 'YouTube Deep-Dives',
    searchInterest: 'Search Interest Index',
  },
  hi: {
    appName: 'भारत इम्पैक्ट AI',
    appSubtitle: 'वैश्विक समाचार एवं सोशल मीडिया मॉनिटर',
    radarActive: '24 घंटे लाइव रडार सक्रिय',
    rankedByImpact: 'भारत पर प्रभाव के आधार पर रैंक',
    refreshBtn: 'ताज़ा करें',
    searchPlaceholder: 'समाचार, कच्चा तेल, सेमीकंडक्टर, सीमा समझौते खोजें...',
    allSources: 'सभी स्रोत',
    allImpact: 'सभी प्रभाव स्तर',
    critical: 'अति गंभीर',
    high: 'उच्च प्रभाव',
    moderate: 'मध्यम प्रभाव',
    itemsWithin24h: 'खबरें <24 घंटे',
    viewAnalysis: 'विश्लेषण देखें',
    score: 'स्कोर',
    sourcesLabel: 'स्रोत',
    precursorAction: 'पूर्व कार्रवाई की जड़',
    impactOnIndia: 'भारत पर प्रभाव',
    navFeed: 'मुख्य समाचार',
    navBriefing: 'दैनिक ब्रीफिंग',
    navAnalyzer: 'AI विश्लेषक',
    navAlerts: 'पुश अलर्ट',
    tabOverview: '1. घटना और कारण',
    tabCausality: '2. पिछली कार्रवाई की जड़',
    tabIndiaImpact: '3. भारत पर प्रभाव',
    tabNextMoves: '4. भारत का अगला कदम',
    tabSources: '5. प्रामाणिक स्रोत',
    listenAudio: 'दैनिक ब्रीफिंग सुनें',
    pauseAudio: 'ऑडियो रोकें',
    listenInLang: 'हिन्दी में सुनें',
    playVoiceAI: 'ऑडियो ब्रीफिंग सुनें (वॉइस AI)',
    morningBriefingTitle: 'दैनिक रणनीतिक समीक्षा',
    opportunityIndexLabel: 'रणनीतिक एवं आर्थिक अवसर सूचकांक',
    threatIndexLabel: 'क्षेत्रीय अस्थिरता एवं ऊर्जा मार्ग जोखिम',
    keyTakeawaysTitle: 'प्रमुख रणनीतिक निष्कर्ष',
    coveredItemsTitle: 'आज की ब्रीफिंग में शामिल शीर्ष 24 घंटे की घटनाएं',
    analyzerTitle: 'भारत पर किसी भी वैश्विक घटना के प्रभाव का विश्लेषण करें',
    analyzerSubtitle: 'पिछले 24 घंटों में X/ट्विटर, गूगल न्यूज़, यूट्यूब और सोशल मीडिया की खबरों की जांच कर भारत पर रणनीतिक प्रभाव और पूर्व कार्रवाई की पड़ताल करता है।',
    analyzerLabel: 'घटना, विषय या सोशल मीडिया ट्रेंड दर्ज करें',
    analyzerPlaceholder: 'उदा. होर्मुज जलडमरूमध्य अलर्ट, अमेरिकी चिप प्रतिबंध...',
    focusPlatform: 'फोकस प्लेटफॉर्म (वैकल्पिक)',
    runAnalysisBtn: 'रणनीतिक प्रभाव विश्लेषण चलाएं',
    analyzingPulse: '24 घंटे के वैश्विक स्रोतों की स्कैनिंग जारी...',
    trendingInquiries: '24 घंटे के चर्चित भू-राजनीतिक प्रश्न',
    openFullDossier: 'विस्तृत 5-स्तंभीय रणनीतिक दस्तावेज़ खोलें',
    notificationHubTitle: 'दैनिक ब्रीफिंग एवं फ्लैश अलर्ट',
    notificationHubSubtitle: 'महत्वपूर्ण भू-राजनीतिक गतिविधियों, तेल आपूर्ति संकट और सुबह 8:00 बजे की दैनिक ब्रीफिंग के लिए रियल-टाइम पुश सूचनाएं सेट करें।',
    systemNotifStatus: 'सिस्टम नोटिफिकेशन स्थिति',
    enabled: 'सक्रिय है',
    enablePushBtn: 'पुश नोटिफिकेशन चालू करें',
    testInstantDelivery: 'त्वरित पुश डिलीवरी का परीक्षण करें',
    simulateCriticalAlert: 'अति गंभीर अलर्ट भेजें',
    simulateMorningBriefing: 'दैनिक ब्रीफिंग अलर्ट भेजें',
    alertChannelsTitle: 'अलर्ट चैनल और प्राथमिकताएं',
    morningAlertLabel: 'दैनिक प्रातःकालीन ब्रीफिंग (सुबह 08:00)',
    morningAlertDesc: 'पिछले 24 घंटों में भारत को प्रभावित करने वाली सभी बड़ी वैश्विक घटनाओं का AI सारांश',
    criticalAlertLabel: 'अति गंभीर फ्लैश अलर्ट (रैंक #1 और #2)',
    criticalAlertDesc: 'समुद्री मार्ग नाकेबंदी, ऊर्जा संकट और तकनीक प्रतिबंधों का त्वरित अलर्ट',
    soundAlertLabel: 'हैप्टिक वाइब्रेशन और ध्वनि संदेश',
    soundAlertDesc: 'नोटिफिकेशन आने पर एंड्रॉइड ऑडियो टोन और वाइब्रेशन संकेत',
    trayHistoryTitle: 'नोटिफिकेशन ट्रे इतिहास',
    clearHistoryBtn: 'इतिहास साफ़ करें',
    noNotifications: 'ट्रे में अभी कोई नोटिफिकेशन नहीं है। ऊपर दिए गए बटन से परीक्षण करें।',
    shareIntel: 'साझा करें',
    copied: 'लिंक कॉपी हो गया!',
    simulatePush: 'पुश अलर्ट सिमुलेट करें',
    whatHappenedTitle: 'क्या हुआ (< 24 घंटे में)',
    whyHappeningTitle: 'यह क्यों हो रहा है (मूल कारण)',
    pastActionTitle: 'पिछली कार्रवाई की जड़: क्या यह किसी पूर्व कदम का परिणाम है?',
    strategicMoveTitle: 'भारत के लिए अनुशंसित मुख्य रणनीतिक कदम',
    tacticalOptionsTitle: 'रणनीतिक विकल्प और नीतिगत उपाय',
    diplomaticStanceTitle: 'राजनयिक रुख और अंतरराष्ट्रीय स्थिति',
    crossPlatformDiscourse: 'सोशल मीडिया पर वैश्विक चर्चा',
    twitterVolume: 'X / ट्विटर पर चर्चा',
    youtubeDeepDives: 'यूट्यूब विश्लेषण',
    searchInterest: 'सर्च ट्रेंड्स इंडेक्स',
  },
};
