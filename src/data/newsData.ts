import { ImpactNewsItem, DailyBriefing } from '../types';
import { getDailyNewsForDate, DailyEditionData } from './dailyIntelligenceArchive';
export { getRecentTimestamp } from './timestampHelper';
export { getDailyNewsForDate, type DailyEditionData } from './dailyIntelligenceArchive';

/**
 * Returns the current day's high-impact news items.
 * Guaranteed to provide fresh, non-stale news specific to today's date.
 */
export function getInitialNewsItems(): ImpactNewsItem[] {
  return getDailyNewsForDate().items;
}

/**
 * Returns the current day's executive strategic briefing.
 * Guaranteed to match today's date and today's top intelligence priorities.
 */
export function getInitialDailyBriefing(): DailyBriefing {
  return getDailyNewsForDate().briefing;
}
