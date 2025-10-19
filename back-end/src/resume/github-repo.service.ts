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
    const userinfo = [];

    const user = await this.userService.findByEmail(email);

    const username = user.githubUrl.split('/').pop();

    // 모든 레포지토리 가져오기
    const repositories = await this.getUserRepositories(username);

    // 레포지토리를 크기순으로 내림차순 정렬 후 최대 7개 선택
    const topRepositories = repositories
      .sort((a, b) => b.size - a.size)
      .slice(0, 7);

    // 상위 7개의 레포지토리에 대해 정보 수집
    for (const repository of topRepositories) {
      const repoInfo = {
        name: repository.name,
        description: repository.description,
        language: repository.language,
        size: repository.size,
        stargazers_count: repository.stargazers_count,
        forks_count: repository.forks_count,
        html_url: repository.html_url,
        readme_content:
          !repository.description &&
          (await this.getReadmeContent(username, repository.name)),
      };

      const additionalData = await this.getAdditionalRepositoryData(
        username,
        repository.name,
      );
      userinfo.push({ ...repoInfo, ...additionalData });
    }

    if (userinfo.length === 0) {
      throw new NotFoundException('사용자의 레포지토리를 찾을 수 없습니다.');
    }

    return userinfo;
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

  async getAdditionalRepositoryData(username: string, repositoryName: string) {
    const pp: any = {};

    try {
      const commitMessages = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/commits`,
        {
          headers: this.getAuthHeaders(),
        },
      );

      // username에 해당하는 사용자의 커밋만 필터링
      pp.recent_commit_messages = commitMessages.data
        .filter((commit) => commit.author && commit.author.login === username) // username 필터링
        .map((commit) => {
          let message = commit.commit.message;
          message = message.replace(/\n\s*\+/g, '');
          message = message.replace(/\s+/g, ' ');
          message = message.replace(/\n+/g, '\n');
          return message.trim();
        })
        .filter((message, index, self) => {
          // 불필요한 메시지를 제거
          const ignorePattern =
            /^(merge( branch)?|update|initial commit|release|resolve|bump|create readme|fix conflicts)/i;
          if (ignorePattern.test(message)) return false;

          // 중복 메시지 제거
          return self.indexOf(message) === index;
        })
        .filter((message) => {
          // 의미 없는 커밋 메시지 제거 (너무 짧은 메시지)
          return message.length > 10;
        });

      // 기여자 정보
      const contributorsData = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/contributors`,
        {
          headers: this.getAuthHeaders(),
        },
      );
      const userContributions = contributorsData.data.find(
        (contributor) => contributor.login === username,
      );
      pp.contributions = userContributions
        ? userContributions.contributions
        : 0;

      // 풀 리퀘스트
      const pullRequests = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/pulls`,
        {
          headers: this.getAuthHeaders(),
        },
      );
      pp.recent_pull_requests = pullRequests.data.slice(0, 3).map((pr) => ({
        title: pr.title,
        created_at: pr.created_at,
        status: pr.state,
      }));

      // 릴리즈 정보
      const releasesData = await axios.get(
        `https://api.github.com/repos/${username}/${repositoryName}/releases`,
        {
          headers: this.getAuthHeaders(),
        },
      );
      pp.latest_release =
        releasesData.data.length > 0 ? releasesData.data[0].name : 'No release';
    } catch {
      throw new BadRequestException('레포지토리 데이터 조회에 실패했습니다.');
    }

    return pp;
  }
}
