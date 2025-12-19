import type { User } from '../types/env';
import type { UserContribution } from '../services/github';

export function createNoContributionMessage(
  usersWithoutContribution: UserContribution[],
  allUsers: User[]
): string {
  const mentions = usersWithoutContribution.map((result) => {
    const user = allUsers.find((u) => u.github === result.username);
    return `<@${user?.discord}>`;
  });

  const mentionText =
    mentions.length === 1 ? mentions[0] : mentions.join(' と ');
  return `${mentionText} は今日まだコントリビューションしてないよ`;
}

export function createErrorMessage(errorMessage: string): string {
  return `GitHub APIエラー\nコントリビューション状況を取得できませんでした\n\nError: ${errorMessage}`;
}
