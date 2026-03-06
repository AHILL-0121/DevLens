import axios from "axios";
import { GitHubRepo, GitHubUser } from "@/types/profile";

const BASE_URL = "https://api.github.com";

// Create axios instance with default config
const githubApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  try {
    const response = await githubApi.get(`/users/${username}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`GitHub user '${username}' not found`);
    }
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await githubApi.get(`/users/${username}/repos`, {
        params: {
          per_page: perPage,
          page,
          sort: "updated",
          type: "owner", // Only repos owned by the user
        },
      });

      const repos = response.data;
      allRepos.push(...repos);

      // Break if we got less than perPage repos (last page)
      if (repos.length < perPage) {
        break;
      }
      page++;
    }

    return allRepos;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`No repositories found for user '${username}'`);
    }
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
}

export async function fetchRepoLanguages(username: string, repoName: string): Promise<Record<string, number>> {
  try {
    const response = await githubApi.get(`/repos/${username}/${repoName}/languages`);
    return response.data;
  } catch (error) {
    // If we can't fetch languages, return empty object
    return {};
  }
}

export async function checkRateLimit(): Promise<{
  remaining: number;
  limit: number;
  resetTime: Date;
}> {
  try {
    const response = await githubApi.get("/rate_limit");
    const { remaining, limit } = response.data.rate;
    const resetTime = new Date(response.data.rate.reset * 1000);
    
    return { remaining, limit, resetTime };
  } catch (error) {
    // If no token, return unauthenticated limits
    return { remaining: 60, limit: 60, resetTime: new Date() };
  }
}