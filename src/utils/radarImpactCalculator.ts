import { ImpactNewsItem, DimensionScoreItem, Language } from '../types';

export interface RadarDataPoint {
  dimension: string;
  hiDimension: string;
  score: number;
  fullMark: number;
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  rationale: string;
  hiRationale: string;
  icon: string;
}

/**
 * Calculates dynamic, nuanced impact dimension scores for India based on the news item.
 * Supports: 'National Security', 'Economic Stability', 'Foreign Policy', and 'Domestic Sentiment'.
 */
export function calculateIndiaImpactDimensions(news: ImpactNewsItem): {
  dataPoints: RadarDataPoint[];
  dominantDimension: { name: string; hiName: string; score: number };
  averageScore: number;
} {
  // If explicitly pre-calculated on the news item, use it as baseline
  const explicit = news.impactDimensions;

  const baseScore = Math.min(100, Math.max(20, news.impactScore || 80));
  const category = news.category;
  const isCritical = news.impactLevel === 'CRITICAL';
  const isHigh = news.impactLevel === 'HIGH';

  // Category weight multipliers
  let natSecWeight = 0.7;
  let econWeight = 0.7;
  let foreignWeight = 0.7;
  let domesticWeight = 0.7;

  switch (category) {
    case 'Geopolitics & Defense':
      natSecWeight = 1.05;
      foreignWeight = 1.0;
      econWeight = 0.65;
      domesticWeight = 0.8;
      break;
    case 'Trade & Economy':
      econWeight = 1.05;
      foreignWeight = 0.85;
      natSecWeight = 0.55;
      domesticWeight = 0.75;
      break;
    case 'Oil & Energy':
      econWeight = 1.02;
      natSecWeight = 0.75;
      foreignWeight = 0.88;
      domesticWeight = 0.92; // Petrol/LPG directly impacts domestic sentiment
      break;
    case 'Technology & Supply Chain':
      econWeight = 0.9;
      natSecWeight = 0.85;
      foreignWeight = 0.75;
      domesticWeight = 0.65;
      break;
    case 'Maritime & Logistics':
      natSecWeight = 0.95;
      econWeight = 0.88;
      foreignWeight = 0.8;
      domesticWeight = 0.6;
      break;
    case 'Diaspora & Visas':
      domesticWeight = 1.02;
      foreignWeight = 0.92;
      econWeight = 0.7;
      natSecWeight = 0.45;
      break;
    default:
      natSecWeight = 0.8;
      econWeight = 0.8;
      foreignWeight = 0.85;
      domesticWeight = 0.75;
  }

  // Level bonus
  const levelBonus = isCritical ? 6 : isHigh ? 2 : -5;

  const clamp = (val: number) => Math.round(Math.min(99, Math.max(25, val)));

  const natSecScore = explicit?.nationalSecurity ?? clamp(baseScore * natSecWeight + levelBonus);
  const econScore = explicit?.economicStability ?? clamp(baseScore * econWeight + levelBonus);
  const foreignScore = explicit?.foreignPolicy ?? clamp(baseScore * foreignWeight + levelBonus);
  const domesticScore = explicit?.domesticSentiment ?? clamp(baseScore * domesticWeight + levelBonus - 2);

  const getLevel = (score: number): 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' => {
    if (score >= 88) return 'CRITICAL';
    if (score >= 70) return 'HIGH';
    if (score >= 50) return 'MODERATE';
    return 'LOW';
  };

  // Derive contextual rationales directly from the story's own verified analysis
  const natSecRationale =
    news.impactOnIndia?.securityImpact ||
    'Border posturing, defense preparedness, frontline monitoring, and asymmetric deterrence.';
  const hiNatSecRationale =
    news.hi?.securityImpact ||
    'सीमा सुरक्षा, अग्रिम सैन्य तैयारी, रणनीतिक निगरानी और संप्रभुता की रक्षा।';

  const econRationale =
    news.impactOnIndia?.economicImpact ||
    'Fiscal trade balance, inflation pressure, energy import expenditure, and foreign exchange reserves.';
  const hiEconRationale =
    news.hi?.economicImpact ||
    'राजकोषीय संतुलन, मुद्रास्फीति जोखिम, तेल आयात बिल और विदेशी मुद्रा भंडार पर प्रभाव।';

  const foreignRationale =
    news.impactOnIndia?.strategicSummary ||
    'Bilateral leverage, multilateral diplomacy, strategic autonomy, and regional equilibrium.';
  const hiForeignRationale =
    news.hi?.strategicSummary ||
    'द्विपक्षीय कूटनीतिक संबंध, बहुपक्षीय वार्ताएं, रणनीतिक स्वायत्तता और वैश्विक साख।';

  const domesticRationale =
    news.socialMetrics?.topPostSnippet ||
    `Public sentiment across Indian social channels, diaspora concern, and consumer market confidence (${news.socialMetrics?.twitterMentions || 'trending discussions'}).`;
  const hiDomesticRationale =
    `भारतीय जनमानस में चर्चा, प्रवासियों की सुरक्षा तथा बाजार व उपभोक्ता धारणा (${news.socialMetrics?.twitterMentions || 'शीर्ष ट्रेंड्स'})।`;

  const dataPoints: RadarDataPoint[] = [
    {
      dimension: 'National Security',
      hiDimension: 'राष्ट्रीय सुरक्षा',
      score: natSecScore,
      fullMark: 100,
      level: getLevel(natSecScore),
      rationale: natSecRationale,
      hiRationale: hiNatSecRationale,
      icon: 'Shield',
    },
    {
      dimension: 'Economic Stability',
      hiDimension: 'आर्थिक स्थिरता',
      score: econScore,
      fullMark: 100,
      level: getLevel(econScore),
      rationale: econRationale,
      hiRationale: hiEconRationale,
      icon: 'TrendingUp',
    },
    {
      dimension: 'Foreign Policy',
      hiDimension: 'विदेश नीति',
      score: foreignScore,
      fullMark: 100,
      level: getLevel(foreignScore),
      rationale: foreignRationale,
      hiRationale: hiForeignRationale,
      icon: 'Globe',
    },
    {
      dimension: 'Domestic Sentiment',
      hiDimension: 'घरेलू जनभावना',
      score: domesticScore,
      fullMark: 100,
      level: getLevel(domesticScore),
      rationale: domesticRationale,
      hiRationale: hiDomesticRationale,
      icon: 'Users',
    },
  ];

  // Find dominant dimension
  let highest = dataPoints[0];
  for (const dp of dataPoints) {
    if (dp.score > highest.score) {
      highest = dp;
    }
  }

  const avg = Math.round((natSecScore + econScore + foreignScore + domesticScore) / 4);

  return {
    dataPoints,
    dominantDimension: {
      name: highest.dimension,
      hiName: highest.hiDimension,
      score: highest.score,
    },
    averageScore: avg,
  };
}
