import type { Env, User } from '../types/env';
import { getUserContributions } from '../services/github';
import { sendDiscordMessage } from '../services/discord';

export async function checkContributions(env: Env): Promise<void> {
  const users: User[] = JSON.parse(env.USERS);
  const timezoneOffset = parseInt(env.TIMEZONE_OFFSET, 10);
  const now = new Date();

  const nowUTC = now.getTime();
  const localHour = now.getUTCHours() + timezoneOffset;
  const hoursSinceMidnight = ((localHour % 24) + 24) % 24;
  const midnightUTC = new Date(nowUTC - hoursSinceMidnight * 60 * 60 * 1000);

  const from = midnightUTC.toISOString();
  const to = now.toISOString();

  try {
    const results = await Promise.all(
      users.map((user) =>
        getUserContributions(user.github, env.GITHUB_TOKEN, from, to)
      )
    );

    const usersWithoutContribution = results.filter(
      (result) => !result.hasCommit
    );

    if (usersWithoutContribution.length === 0) {
      return;
    }

    const mentions = usersWithoutContribution.map((result) => {
      const user = users.find((u) => u.github === result.username);
      return `<@${user?.discord}>`;
    });

    const mentionText =
      mentions.length === 1 ? mentions[0] : mentions.join(' と ');
    const message = `${mentionText} は今日まだコントリビューションしてないよ`;

    await sendDiscordMessage(env.DISCORD_WEBHOOK_URL, message);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    await sendDiscordMessage(
      env.DISCORD_WEBHOOK_URL,
      `GitHub APIエラー\nコントリビューション状況を取得できませんでした\n\nError: ${errorMessage}`
    );
    throw error;
  }
}