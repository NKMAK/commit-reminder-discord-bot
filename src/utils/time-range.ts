export type TimeRange = {
  from: string;
  to: string;
};

export function getLocalTimeRange(timezoneOffset: number): TimeRange {
  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const offsetInMs = timezoneOffset * 60 * 60 * 1000;

  const localNow = new Date(now.getTime() + offsetInMs);

  const localMidnight = new Date(localNow);
  localMidnight.setUTCHours(0, 0, 0, 0);

  const utcMidnight = new Date(localMidnight.getTime() - offsetInMs);

  return {
    from: new Date(utcMidnight.getTime() + oneDayInMs).toISOString(),
    to: new Date(now.getTime() + oneDayInMs).toISOString(),
  };
}
