export type TimeRange = {
  from: string;
  to: string;
};

export function getLocalTimeRange(timezoneOffset: number): TimeRange {
  const now = new Date();
  const nowUTC = now.getTime();
  const localHour = now.getUTCHours() + timezoneOffset;
  const hoursSinceMidnight = ((localHour % 24) + 24) % 24;
  const midnightUTC = new Date(nowUTC - hoursSinceMidnight * 60 * 60 * 1000);

  return {
    from: midnightUTC.toISOString(),
    to: now.toISOString(),
  };
}
