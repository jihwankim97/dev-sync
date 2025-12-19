/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const blueGrayStyle = {
  sectionTitle: css`
    font-size: 18px;
    margin-bottom: 10px;
    border-bottom: 1px solid #6e7f88;
    padding-bottom: 4px;
    color: #37474f;
  `,

  sectionContent: css`
    font-size: 15px;
    white-space: pre-wrap;
    line-height: 1.6;
    color: #455a64;
  `,

  previewContainer: css`
    min-height: 600px;
    background-color: #f5f8fa;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
    padding: 40px 50px;
    font-family: "Noto Sans KR", "Segoe UI", sans-serif, Roboto;
    color: #263238;
  `,

  chipList: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  `,

  chip: css`
    padding: 4px 12px;
    background-color: #e1e8f0;
    color: #334e68;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.5;
  `,

  careerLeft: css`
    width: 20%;
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    padding-right: 12px;
    box-sizing: border-box;
  `,

  careerRight: css`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e293b;
  `,

  profileStyle: css`
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #cbd5e1;
    font-size: 14px;
    color: #6782a7;
  `,

  profileName: css`
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: #0f172a;
    text-align: left;
  `,

  profileSide: css`
    display: flex;
    gap: 20px;
    margin-top: 20px;
    justify-content: flex-end;
    color: #38414f;
    font-size: 14px;

    span {
      color: #64748b;
      min-width: 50px;
    }
  `,

  fontColor: css`
    color: #64748b;
  `,

  career: css`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e293b;

    span {
      font-size: 14px;
      color: #94a3b8;
      font-weight: 400;
    }
  `,

  careerSkills: css`
    margin-top: 6px;
    font-size: 13px;
    color: #64748b;
  `,

  careerDescription: css`
    font-size: 14px;
    color: #475569;
  `,

  skillTitle: css`
    font-size: 15px;
    font-weight: bold;
  `,

  skillGroup: css`
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  `,

  firstSkillGroup: css`
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #cbd5e1;
    color: #37474f;
  `,
};
