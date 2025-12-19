// 게시글 관련 검증 상수
export const POST_VALIDATION = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    MESSAGE: '제목은 1자 이상 100자 이하여야 합니다.',
  },
  CONTENT: {
    MAX_LENGTH: 10000,
    MESSAGE: '내용은 최대 10,000자까지 입력 가능합니다.',
  },
} as const;

// 댓글 관련 검증 상수
export const COMMENT_VALIDATION = {
  CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
    MESSAGE: '댓글은 1자 이상 1,000자 이하여야 합니다.',
  },
} as const;

// 사용자 관련 검증 상수
export const USER_VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 15,
    MESSAGE: '이름은 2자 이상 15자 이하여야 합니다.',
  },
  EMAIL: {
    MAX_LENGTH: 50,
    MESSAGE: '이메일은 최대 50자까지 입력 가능합니다.',
  },
} as const;

// 공통 검증 상수
export const COMMON_VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 15,
    MESSAGE: '비밀번호는 8자 이상 15자 이하여야 합니다.',
  },
} as const;
