import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class githubRepoService {
  constructor(
    private readonly userService: UserService,

    private readonly configService: ConfigService,
  ) {}

  // GITHUB 인증 헤더 생성 함수
  private getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.configService.get<string>('GITHUB_TOKEN')}`,
      Accept: 'application/vnd.github.v3+json',
    };
  }

  async getGitHubData(name: string, email: string) {
    const user = await this.userService.findByEmail(email);
    const username = user.githubUrl.split('/').pop();

    const repositories = await this.getUserRepositories(username);

    const topRepositories = repositories
      .sort((a, b) => b.size - a.size)
      .slice(0, 7);

    const curatedRepositories = [];

    for (const repository of topRepositories) {
      const owner = repository.owner?.login ?? username;
      const languages = await this.getRepositoryLanguages(
        owner,
        repository.name,
      );

      const additionalData = await this.getAdditionalRepositoryData(
        owner,
        repository.name,
        username,
      );

      const readmeContent = repository.description
        ? null
        : await this.getReadmeContent(owner, repository.name);

      const curated = this.composeResumeRepository(
        repository,
        owner,
        username,
        languages,
        additionalData,
        readmeContent,
      );

      if (curated) {
        curatedRepositories.push(curated);
      }
    }

    if (curatedRepositories.length === 0) {
      throw new NotFoundException('사용자의 레포지토리를 찾을 수 없습니다.');
    }

    return curatedRepositories
      .sort(
        (a, b) =>
          (b.resume_relevance_score ?? 0) - (a.resume_relevance_score ?? 0),
      )
      .slice(0, 6);
  }

  async getUserRepositories(username: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('GITHUB_TOKEN')}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching GitHub repositories:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('GitHub 레포지토리 조회에 실패했습니다.');
    }
  }

  // README 파일을 가져오는 함수
  async getReadmeContent(username: string, repoName: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}/contents/README.md`,
        {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('GITHUB_TOKEN')}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      );

      const content = Buffer.from(response.data.content, 'base64').toString(
        'utf-8',
      );

      let cleanedText = content.replace(/<\/?[^>]+(>|$)/g, '\n');

      cleanedText = cleanedText.replace(/!\[.*?\]\(.*?\)/g, '');

      cleanedText = cleanedText.replace(/\\n\s*\+/g, '');

      cleanedText = cleanedText.replace(/\s+/g, ' ');

      cleanedText = cleanedText.replace(/\n+/g, '\n');

      return cleanedText.trim();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return 'README not available';
      } else {
        return 'Error fetching README';
      }
    }
  }

  async getAdditionalRepositoryData(
    owner: string,
    repositoryName: string,
    contributorLogin: string,
  ) {
    const pp: any = {};

    try {
      const commitMessages = await axios.get(
        `https://api.github.com/repos/${owner}/${repositoryName}/commits`,
        {
          headers: this.getAuthHeaders(),
          params: {
            per_page: 30,
          },
        },
      );

      // username에 해당하는 사용자의 커밋만 필터링
      const recentCommits = commitMessages.data
        .filter((commit) => this.isCommitByUser(commit, contributorLogin))
        .map((commit) => this.formatCommitSummary(commit))
        .filter((commit, index, self) => {
          const ignorePattern =
            /^(merge( branch)?|update|initial commit|release|resolve|bump|create readme|fix conflicts)/i;
          if (ignorePattern.test(commit.message)) return false;

          return (
            self.findIndex(
              (item) =>
                item.message === commit.message && item.sha === commit.sha,
            ) === index
          );
        })
        .filter((commit) => commit.message.length > 10)
        .slice(0, 10);
      pp.recent_commits = recentCommits;
      pp.recent_commit_messages = recentCommits.map((commit) => commit.message);

      // 기여자 정보
      const contributorsData = await axios.get(
        `https://api.github.com/repos/${owner}/${repositoryName}/contributors`,
        {
          headers: this.getAuthHeaders(),
          params: { per_page: 30 },
        },
      );
      const userContributions = contributorsData.data.find(
        (contributor) => contributor.login === contributorLogin,
      );
      pp.contributions = userContributions
        ? userContributions.contributions
        : 0;
      pp.contributors_summary = {
        total: contributorsData.data.length,
        top_contributors: contributorsData.data
          .slice(0, 5)
          .map((contributor) => ({
            login: contributor.login,
            contributions: contributor.contributions,
            html_url: contributor.html_url,
          })),
      };

      // 풀 리퀘스트
      const pullRequests = await axios.get(
        `https://api.github.com/repos/${owner}/${repositoryName}/pulls`,
        {
          headers: this.getAuthHeaders(),
          params: {
            state: 'all',
            per_page: 40,
          },
        },
      );

      const userPullRequests = pullRequests.data.filter(
        (pr) => pr.user?.login === contributorLogin,
      );

      const detailedPullRequests = await Promise.all(
        userPullRequests
          .slice(0, 10)
          .map((pr) =>
            this.getPullRequestDetails(owner, repositoryName, pr.number),
          ),
      );

      pp.recent_pull_requests = detailedPullRequests.map((pr) => ({
        title: pr.title,
        created_at: pr.created_at,
        merged_at: pr.merged_at,
        state: pr.state,
        html_url: pr.html_url,
        body_preview: pr.body_preview,
      }));
      pp.pull_request_summary = {
        total: userPullRequests.length,
        merged: userPullRequests.filter((pr) => Boolean(pr.merged_at)).length,
        open: userPullRequests.filter((pr) => pr.state === 'open').length,
      };

      // 릴리즈 정보
      const releasesData = await axios.get(
        `https://api.github.com/repos/${owner}/${repositoryName}/releases`,
        {
          headers: this.getAuthHeaders(),
        },
      );
      pp.latest_release =
        releasesData.data.length > 0
          ? {
              name: releasesData.data[0].name ?? releasesData.data[0].tag_name,
              published_at: releasesData.data[0].published_at,
              html_url: releasesData.data[0].html_url,
            }
          : null;
      pp.release_summary = {
        total: releasesData.data.length,
      };
    } catch (error) {
      console.error(
        'Error fetching additional repository data:',
        error.response?.data || error.message,
      );
      throw new BadRequestException('레포지토리 데이터 조회에 실패했습니다.');
    }

    return pp;
  }

  private async getRepositoryLanguages(owner: string, repoName: string) {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/languages`,
        {
          headers: this.getAuthHeaders(),
        },
      );

      const entries = Object.entries(response.data);
      const totalBytes = entries.reduce(
        (sum, [, bytes]) => sum + (bytes as number),
        0,
      );

      return entries
        .sort(
          ([, aBytes], [, bBytes]) => (bBytes as number) - (aBytes as number),
        )
        .map(([language, bytes]) => ({
          language,
          bytes,
          ratio: totalBytes
            ? Number(((bytes as number) / totalBytes).toFixed(3))
            : 0,
        }));
    } catch (error) {
      console.error(
        'Error fetching repository languages:',
        error.response?.data || error.message,
      );
      return [];
    }
  }

  private isCommitByUser(commit: any, login: string) {
    const loginMatches = commit.author && commit.author.login === login;
    const committerMatches =
      commit.commit?.author?.name === login ||
      commit.commit?.committer?.name === login;
    return loginMatches || committerMatches;
  }

  private formatCommitSummary(commit: any) {
    const rawMessage = commit.commit?.message ?? '';
    const cleanedMessage = rawMessage
      .replace(/\n\s*\+/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

    return {
      sha: commit.sha,
      message: cleanedMessage,
      html_url: commit.html_url,
      authored_date: commit.commit?.author?.date,
      committed_date: commit.commit?.committer?.date,
    };
  }

  private async getPullRequestDetails(
    owner: string,
    repositoryName: string,
    pullNumber: number,
  ) {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repositoryName}/pulls/${pullNumber}`,
      {
        headers: this.getAuthHeaders(),
      },
    );

    const pr = response.data;

    return {
      title: pr.title,
      created_at: pr.created_at,
      merged_at: pr.merged_at,
      state: pr.state,
      html_url: pr.html_url,
      body_preview: this.truncateBody(pr.body),
    };
  }

  private truncateBody(body: string | null | undefined, maxLength = 600) {
    if (!body) {
      return null;
    }

    const cleaned = body
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (cleaned.length <= maxLength) {
      return cleaned;
    }

    return `${cleaned.slice(0, maxLength)}...`;
  }

  private formatDateString(date: string | null | undefined) {
    if (!date) {
      return '';
    }

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }

    return parsed.toISOString().slice(0, 10);
  }

  private composeResumeRepository(
    repository: any,
    owner: string,
    username: string,
    languages: Array<{ language: string; ratio: number }>,
    additionalData: any,
    readmeContent: string | null,
  ) {
    const metrics = {
      size: repository.size,
      stargazers_count: repository.stargazers_count,
      forks_count: repository.forks_count,
      open_issues_count: repository.open_issues_count,
      watchers_count: repository.watchers_count,
    };

    const recentCommits: any[] = Array.isArray(additionalData.recent_commits)
      ? additionalData.recent_commits.slice(0, 8)
      : [];
    const recentPullRequests: any[] = Array.isArray(
      additionalData.recent_pull_requests,
    )
      ? additionalData.recent_pull_requests.slice(0, 5)
      : [];

    const contributions = additionalData.contributions ?? 0;
    const score = this.computeRelevanceScore(
      metrics,
      contributions,
      recentCommits.length,
      recentPullRequests.length,
    );

    const primaryLanguages = this.extractPrimaryLanguages(languages);
    const topics = Array.isArray(repository.topics)
      ? repository.topics.slice(0, 8)
      : [];

    const readmeExcerpt = readmeContent
      ? this.truncateText(readmeContent, 800)
      : null;

    const metricsSummary = this.buildMetricsSummary(
      metrics,
      contributions,
      recentPullRequests.length,
      additionalData.latest_release,
    );

    const highlights = this.buildHighlights(
      metricsSummary,
      primaryLanguages,
      topics,
      recentCommits,
      additionalData.pull_request_summary,
      additionalData.release_summary,
    );

    return {
      name: repository.name,
      html_url: repository.html_url,
      homepage: repository.homepage,
      description: repository.description,
      timeline: {
        created_at: repository.created_at,
        updated_at: repository.updated_at,
        pushed_at: repository.pushed_at,
        startDate: this.formatDateString(repository.created_at),
        endDate: this.formatDateString(repository.pushed_at),
      },
      metrics,
      topics,
      languages: {
        primary: primaryLanguages,
        detailed: languages,
      },
      ownership: {
        owner_login: owner,
        is_owner: owner === username,
        contributions,
      },
      metrics_summary: metricsSummary,
      highlights,
      activity: {
        commits: recentCommits,
        pull_requests: recentPullRequests,
        contributors_summary: additionalData.contributors_summary,
        pull_request_summary: additionalData.pull_request_summary,
        latest_release: additionalData.latest_release,
        release_summary: additionalData.release_summary,
      },
      evidence: {
        commit_messages:
          additionalData.recent_commit_messages?.slice(0, 15) ?? [],
        readme_excerpt: readmeExcerpt,
      },
      resume_relevance_score: score,
    };
  }

  private computeRelevanceScore(
    metrics: {
      size: number;
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
      watchers_count: number;
    },
    contributions: number,
    commitCount: number,
    pullRequestCount: number,
  ) {
    const starScore = (metrics.stargazers_count || 0) * 3;
    const forkScore = (metrics.forks_count || 0) * 2;
    const watcherScore = metrics.watchers_count || 0;
    const issueScore = (metrics.open_issues_count || 0) * 0.5;
    const contributionScore = contributions * 1.5;
    const commitScore = commitCount;
    const pullRequestScore = pullRequestCount * 2;
    const sizeScore = Math.min(metrics.size / 200, 5);

    return Math.round(
      starScore +
        forkScore +
        watcherScore +
        issueScore +
        contributionScore +
        commitScore +
        pullRequestScore +
        sizeScore,
    );
  }

  private extractPrimaryLanguages(
    languages: Array<{ language: string; ratio: number }>,
  ) {
    if (!Array.isArray(languages)) {
      return [];
    }

    return languages
      .filter(
        (entry) =>
          entry.language &&
          typeof entry.language === 'string' &&
          typeof entry.ratio === 'number',
      )
      .slice(0, 5)
      .map((entry) => entry.language);
  }

  private buildMetricsSummary(
    metrics: {
      stargazers_count: number;
      forks_count: number;
      open_issues_count: number;
      watchers_count: number;
    },
    contributions: number,
    pullRequestCount: number,
    latestRelease: { name?: string; published_at?: string } | null,
  ) {
    const summary: string[] = [];

    if (metrics.stargazers_count > 0) {
      summary.push(`${metrics.stargazers_count}개 스타 획득`);
    }
    if (metrics.forks_count > 0) {
      summary.push(`포크 ${metrics.forks_count}회`);
    }
    if (metrics.watchers_count > 0) {
      summary.push(`워처 ${metrics.watchers_count}명`);
    }
    if (contributions > 0) {
      summary.push(`기여 ${contributions}회`);
    }
    if (pullRequestCount > 0) {
      summary.push(`PR ${pullRequestCount}건 참여`);
    }
    if (latestRelease?.published_at) {
      summary.push(
        `최근 릴리스 ${this.formatDateString(latestRelease.published_at)}`,
      );
    }

    return summary;
  }

  private buildHighlights(
    metricsSummary: string[],
    primaryLanguages: string[],
    topics: string[],
    recentCommits: Array<{ message: string }>,
    pullRequestSummary: { total?: number; merged?: number; open?: number },
    releaseSummary: { total?: number },
  ) {
    const highlights = [...metricsSummary];

    if (primaryLanguages.length > 0) {
      highlights.push(`주요 스택: ${primaryLanguages.slice(0, 3).join(', ')}`);
    }

    const notableTopic = topics.find(
      (topic) => typeof topic === 'string' && topic.length > 0,
    );
    if (notableTopic) {
      highlights.push(`#${notableTopic} 관련 프로젝트`);
    }

    const commitWithMetric = recentCommits.find((commit) =>
      /(\d+%|\d+\s?(배|만|천|억)|비용|속도|지연|성능|증가|감소)/i.test(
        commit.message ?? '',
      ),
    );
    if (commitWithMetric) {
      highlights.push(`주요 커밋: ${commitWithMetric.message}`);
    }

    if (pullRequestSummary?.merged) {
      highlights.push(`병합된 PR ${pullRequestSummary.merged}건`);
    }

    if (releaseSummary?.total) {
      highlights.push(`릴리스 ${releaseSummary.total}회`);
    }

    return Array.from(new Set(highlights)).slice(0, 6);
  }

  private truncateText(value: unknown, length: number) {
    if (!value || typeof value !== 'string') {
      return '';
    }

    return value.length <= length
      ? value
      : `${value.slice(0, Math.max(0, length - 3))}...`;
  }
}
