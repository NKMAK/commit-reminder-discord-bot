export type User = {
  github: string;
  discord: string;
};

export type Env = {
  GITHUB_TOKEN: string;
  USERS: string;
  DISCORD_WEBHOOK_URL: string;
  API_KEY: string;
  CRON_HOUR: string;
  TIMEZONE_OFFSET: string;
};
