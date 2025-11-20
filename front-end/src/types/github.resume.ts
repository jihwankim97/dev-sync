// GitHub Repository 관련 타입 정의

export type GitHubRepoData = {
  activity: GitHubActivity;
  description: string | null;
  evidence: GitHubEvidence;
  highlights: string[];
  homepage: string;
  html_url: string;
  languages: GitHubLanguages;
  metrics: GitHubMetrics;
  metrics_summary: string[];
  name: string;
  ownership: GitHubOwnership;
  resume_relevance_score: number;
  timeline: GitHubTimeline;
  topics: string[];
};

export type GitHubActivity = {
  commits: GitHubCommit[];
  pull_requests: GitHubPullRequest[];
  contributors_summary: Record<string, any>; // 구조에 맞게 세분화 가능
  pull_request_summary: Record<string, any>; // 구조에 맞게 세분화 가능
  latest_release: GitHubRelease | null;
};

export type GitHubCommit = {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
};

export type GitHubPullRequest = {
  number: number;
  title: string;
  state: "open" | "closed" | "merged";
  created_at: string;
  updated_at: string;
  merged_at?: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
};

export type GitHubRelease = {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body?: string;
};

export type GitHubEvidence = {
  commit_messages: string[];
  readme_excerpt: string;
};

export type GitHubLanguages = {
  primary: string[];
  detailed: LanguageDetail[];
};

export type LanguageDetail = {
  name: string;
  percentage: number;
  bytes: number;
};

export type GitHubMetrics = {
  size: number;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
};

export type GitHubOwnership = {
  owner_login: string;
  is_owner: boolean;
  contributions: number;
};

export type GitHubTimeline = {
  created_at: string;
  updated_at: string;
  pushed_at: string;
  startDate: string; // YYYY-MM-DD 형식
  endDate: string; // YYYY-MM-DD 형식
};