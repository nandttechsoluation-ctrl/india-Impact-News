// Helper to generate dynamic timestamps strictly within the last 24 hours
export function getRecentTimestamp(hoursAgo: number): { iso: string; timeAgo: string } {
  const now = new Date();
  const past = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
  return {
    iso: past.toISOString(),
    timeAgo: hoursAgo < 1 ? 'Just now' : `${Math.floor(hoursAgo)}h ago`
  };
}
