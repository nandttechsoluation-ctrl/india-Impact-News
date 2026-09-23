export type SocialPlatform = 'twitter' | 'google' | 'youtube' | 'facebook' | 'instagram';

export type ImpactLevel = 'CRITICAL' | 'HIGH' | 'MODERATE';

export type Language = 'en' | 'hi';

export type Category = 
  | 'Geopolitics & Defense'
  | 'Trade & Economy'
  | 'Oil & Energy'
  | 'Technology & Supply Chain'
  | 'Diaspora & Visas'
  | 'Maritime & Logistics';

export interface BlogArticleSection {
  id: string;
  heading: string;
  subheading?: string;
  tag?: string;
  summaryBulletPoints: string[];
  detailedNarrative: string;
  highlightStat?: {
    label: string;
    value: string;
    sublabel?: string;
  };
}

export interface PublicFAQ {
  question: string;
  answer: string;
}

export interface JargonExplainer {
  term: string;
  meaning: string;
}

export interface BlogArticle {
  readingTimeMinutes: number;
  deskName: string;
  editorialSubtitle: string;
  quickTakeaways: string[];
  sections: BlogArticleSection[];
  publicFaqs: PublicFAQ[];
  jargonList: JargonExplainer[];
  editorialVerdict: string;
}

export interface LocalizedNewsContent {
  title: string;
  summary: string;
  whatHappened: string;
  whyHappening: string;
  pastActionTitle: string;
  pastActionDetails: string;
  strategicSummary: string;
  economicImpact: string;
  securityImpact: string;
  diasporaOrTradeImpact?: string;
  impactOnWorld?: string;
  whatNext?: string;
  primaryAction: string;
  strategicOptions: string[];
  diplomaticPosturing?: string;
  blogArticle?: {
    deskName: string;
    editorialSubtitle: string;
    quickTakeaways: string[];
    sections: {
      id: string;
      heading: string;
      subheading?: string;
      tag?: string;
      summaryBulletPoints: string[];
      detailedNarrative: string;
      highlightStat?: {
        label: string;
        value: string;
        sublabel?: string;
      };
    }[];
    publicFaqs: PublicFAQ[];
    jargonList: JargonExplainer[];
    editorialVerdict: string;
  };
}

export interface NewsSource {
  title: string;
  platform: SocialPlatform;
  url: string;
  publisher: string;
  handleOrChannel?: string;
  verified?: boolean;
}

export interface PastActionOrigin {
  hasPastAction: boolean;
  actionTitle: string;
  actionYearOrPeriod?: string;
  details: string;
}

export interface ImpactOnIndiaBreakdown {
  strategicSummary: string;
  economicImpact: string;
  securityImpact: string;
  diasporaOrTradeImpact: string;
}

export interface NextPossibleMove {
  primaryAction: string;
  strategicOptions: string[];
  diplomaticPosturing: string;
}

export interface SocialMetrics {
  twitterMentions?: string;
  youtubeVideosCount?: string;
  googleTrendsScore?: number;
  topPostSnippet?: string;
}

export interface DimensionScoreItem {
  key: 'nationalSecurity' | 'economicStability' | 'foreignPolicy' | 'domesticSentiment';
  label: string;
  hindiLabel: string;
  score: number; // 0 - 100
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  rationale: string;
  hindiRationale: string;
  iconName: string;
}

export interface IndiaImpactDimensions {
  nationalSecurity: number;
  economicStability: number;
  foreignPolicy: number;
  domesticSentiment: number;
  dominantDimension?: string;
  threatLevel?: 'HIGH' | 'MODERATE' | 'LOW';
  breakdown?: DimensionScoreItem[];
}

export type OriginVerificationStatus = 'VERIFIED_FRESH_24H' | 'RE_UPLOAD_OLDER_THAN_24H' | 'HISTORICAL_ARCHIVED';

export interface NewsOriginAudit {
  originTimestamp: string; // ISO string of when original event/wire occurred
  originDateFormatted: string; // e.g. "Today, 06:30 AM IST"
  originHoursAgo: number; // Exact hours elapsed from event origin
  isReUpload: boolean; // Detected as recycled / republished older content
  isVerifiedWithin24h: boolean; // Strictly true only if originHoursAgo <= 24
  status: OriginVerificationStatus;
  originalEventSummary: string; // Brief description of what was the underlying event
  primaryPublisherOrWire: string; // Official wire or source where it first originated
  auditVerdictNote: string; // Transparent explanation for users
  reUploadDetectedDate?: string; // If re-uploaded, date when blog/aggregator re-posted it
}

export interface NewsVisualItem {
  id: string;
  url: string;
  label: string;
  labelHi?: string;
  description?: string;
  source?: string;
  isPrimary?: boolean;
  isUserAdded?: boolean;
  isCustom?: boolean;
}

export interface DirectWireSource {
  id: string;
  name: string;
  category: 'GOVERNMENT' | 'DIPLOMATIC' | 'INTERNATIONAL_WIRE' | 'DEDUPLICATION_API';
  status: 'ONLINE' | 'STANDBY' | 'SYNCING' | 'CONFIGURED';
  lastSyncedAt?: string;
  itemCount: number;
  description: string;
  url?: string;
}

export interface RawWireDispatch {
  id: string;
  title: string;
  wireSource: string;
  sourceUrl: string;
  pubDate: string;
  hoursAgo: number;
  isWithin24h: boolean;
  contentSnippet: string;
  category?: string;
}

export interface WireOriginInfo {
  sourceName: string;
  wirePubDate: string;
  wireUrl: string;
  isDirectWire: boolean;
}

export interface ImpactNewsItem {
  id: string;
  title: string;
  impactRank: number;
  impactScore: number;
  impactLevel: ImpactLevel;
  category: Category;
  timestamp: string;
  timeAgo: string;
  publishedWithin24h: boolean;
  originTimestamp?: string;
  originDateFormatted?: string;
  originHoursAgo?: number;
  isReUpload?: boolean;
  originVerificationStatus?: OriginVerificationStatus;
  originAudit?: NewsOriginAudit;
  wireOrigin?: WireOriginInfo;
  platforms: SocialPlatform[];
  summary: string;
  whatHappened: string;
  whyHappening: string;
  pastActionOrigin: PastActionOrigin;
  impactOnIndia: ImpactOnIndiaBreakdown;
  impactOnWorld?: {
    summary: string;
    geopoliticalImpact?: string;
    marketImpact?: string;
  };
  whatNext?: {
    action: string;
    outlook?: string;
  };
  nextPossibleMoveForIndia: NextPossibleMove;
  sources: NewsSource[];
  socialMetrics: SocialMetrics;
  sentimentForIndia: 'FAVORABLE' | 'ADVERSE' | 'NEUTRAL' | 'COMPLEX';
  visuals?: NewsVisualItem[];
  customVisuals?: NewsVisualItem[];
  hi?: LocalizedNewsContent;
  blogArticle?: BlogArticle;
  youtubeScript?: YouTubeScript;
  factCheckFlags?: FactCheckFlags;
  impactDimensions?: IndiaImpactDimensions;
}

export interface DailyBriefing {
  id: string;
  date: string;
  generatedAt: string;
  headline: string;
  executiveSummary: string;
  keyTakeaways: string[];
  strategicThreatIndex: number; // 0 - 100
  threatIndex?: number;
  opportunityIndex: number; // 0 - 100
  indiaStrategicStance?: string;
  audioScript: string;
  pushAlert: {
    title: string;
    body: string;
    impactTag: string;
    deliveredAt: string;
  };
  hi?: {
    date: string;
    headline: string;
    executiveSummary: string;
    keyTakeaways: string[];
    audioScript: string;
    pushAlertTitle: string;
    pushAlertBody: string;
  };
}

export interface YouTubeScriptChapter {
  timestamp: string;
  sectionTitle: string;
  scriptText: string;
  visualDirectorCue?: string;
}

export interface FactCheckFlags {
  hardRuleCompliance: string; // 'When evidence is insufficient, OMIT the claim rather than complete it using inference.'
  verificationStatus: 'STRICTLY_VERIFIED' | 'EVIDENCE_BASED_ANALYSIS';
  verifiedFactsCount: number;
  verifiedFacts: string[];
  evidenceAnalysis: string[];
  indiaImpactPotential: string[];
  plausibleScenarios: string[];
  omittedClaims: string[];
  bannedWordsFiltered: string[];
  disclaimer: string;
}

export interface YouTubeThumbnailConcept {
  mainVisual: string;
  boldTextOverlay: string;
  accentColors: string;
}

export interface YouTubeScript {
  id: string;
  newsId: string;
  newsTitle: string;
  tone: 'hinglish-viral' | 'hindi' | 'english';
  duration: 'standard' | 'short' | 'quick';
  generatedAt: string;
  estimatedMinutes: number;
  wordCount: number;
  suggestedTitles: string[];
  thumbnailConcept: YouTubeThumbnailConcept;
  fullScript: string;
  chapters: YouTubeScriptChapter[];
  seoTags: string[];
  youtubeDescription: string;
  // Rigorous Fact/Analysis separation & hard rule audit
  whatHappenedFacts?: string[];
  whyItMattersExplanation?: string;
  impactOnIndiaPotential?: string;
  whatCouldHappenNextScenarios?: string[];
  factCheckFlags?: FactCheckFlags;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  impactLevel: ImpactLevel;
  newsId?: string;
  isRead: boolean;
  category: string;
  platform?: SocialPlatform;
}

export interface ShortReelScene {
  id: string;
  sceneIndex: number; // 0 (Hook), 1-5 (News stories), 6 (Outro CTA)
  type: 'hook' | 'news' | 'outro';
  newsId?: string;
  rankNumber?: number; // 1, 2, 3, 4, 5
  category?: string;
  headlineHindi: string;
  headlineEnglish: string;
  spokenHindiScript: string;
  durationSeconds: number;
  kineticCaptions: string[]; // High-retention short subtitle chunks
  onScreenOverlayText: string;
  visualConceptDescription: string;
  googleSearchQuery: string;
  googleTrendingVolume?: string;
  sourceAttribution: {
    publisher: string;
    platform: string;
    verified: boolean;
    headline: string;
  };
  visualImageUrl: string;
  indiaImpactPoint: string;
}

export interface ShortReelData {
  id: string;
  editionDate: string;
  durationMode?: '1min' | '2min';
  totalDurationSeconds: number; // ~60s or ~120s
  scenes: ShortReelScene[];
  viralTitles: string[];
  youtubeShortsDescription: string;
  instagramCaption: string;
  hashtags: string[];
  fullSpokenTextHindi: string;
}

export interface UserAuthSession {
  email: string;
  name?: string;
  apiKey: string;
  connectedAt: string;
  tier: string;
  status: 'ACTIVE_CONNECTED' | 'DISCONNECTED';
  rateLimit: string;
  sourcesConnected: string[];
}

