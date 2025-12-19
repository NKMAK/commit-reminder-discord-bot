export type UserContribution = {
  username: string;
  hasCommit: boolean;
  contributionCount: number;
};

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
};

export async function getUserContributions(
  username: string,
  token: string,
  from: string,
  to: string
): Promise<UserContribution> {
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'commit-reminder-discord-bot',
    },
    body: JSON.stringify({
      query,
      variables: { username, from, to },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  const result: GraphQLResponse = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(`GitHub API error: ${result.errors[0].message}`);
  }

  const contributionCount =
    result.data?.user?.contributionsCollection.contributionCalendar
      .totalContributions ?? 0;

  return {
    username,
    hasCommit: contributionCount > 0,
    contributionCount,
  };
}
