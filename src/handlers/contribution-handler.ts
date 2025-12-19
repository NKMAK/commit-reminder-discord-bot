import type { Env, User } from '../types/env';
import type { UserContribution } from '../services/github';
import { getUserContributions } from '../services/github';
import { sendDiscordMessage } from '../services/discord';
import { getLocalTimeRange } from '../utils/time-range';
import {
  createNoContributionMessage,
  createErrorMessage,
} from '../utils/notification-message';

type ContributionCheckResult = {
  users: UserContribution[];
  notified: boolean;
};

export async function checkAndNotify(
  env: Env
): Promise<ContributionCheckResult> {
  const users: User[] = JSON.parse(env.USERS);
  const timezoneOffset = parseInt(env.TIMEZONE_OFFSET, 10);
  const { from, to } = getLocalTimeRange(timezoneOffset);

  try {
    const results = await Promise.all(
      users.map((user) =>
        getUserContributions(user.github, env.GITHUB_TOKEN, from, to)
      )
    );

    const usersWithoutContribution = results.filter(
      (result) => !result.hasCommit
    );

    if (usersWithoutContribution.length > 0) {
      const message = createNoContributionMessage(
        usersWithoutContribution,
        users
      );
      await sendDiscordMessage(env.DISCORD_WEBHOOK_URL, message);
      return { users: results, notified: true };
    }

    return { users: results, notified: false };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const message = createErrorMessage(errorMessage);
    await sendDiscordMessage(env.DISCORD_WEBHOOK_URL, message);
    throw error;
  }
}
