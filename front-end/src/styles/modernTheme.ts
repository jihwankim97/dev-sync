/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const modernStyle = {
  sectionTitle: css`
    font-size: 18px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
  `,

  sectionContent: css`
    font-size: 15px;
    white-space: pre-wrap;
    line-height: 1.6;
  `,

  previewContainer: css`
    min-height: 600px;
    background-color: #fdfdfd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 40px 50px;
    font-family: Arial, sans-serif;
    color: #333;
  `,

  chipList: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  `,

  chip: css`
    padding: 4px 12px;
    background-color: #eeeeee;
    color: #434343;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.5;
  `,

  careerLeft: css`
    width: 20%;
    font-size: 14px;
    color: #232323;
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
    color: #e2e2e2;
  `,

  profileStyle: css`
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #cbd5e1;
    font-size: 14px;
    color: #474b51;
  `,

  profileName: css`
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    color: #0e0f0f;
    text-align: left;
  `,

  profileSide: css`
    display: flex;
    gap: 20px;
    margin-top: 20px;
    justify-content: flex-end;
    color: #474747;
    font-size: 14px;

    span {
      color: #585858;
      min-width: 50px;
    }
  `,

  fontColor: css`
    color: #383838;
  `,

  career: css`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #2c2d2e;

    span {
      font-size: 14px;
      color: #434343;
      font-weight: 400;
    }
  `,

  careerSkills: css`
    margin-top: 6px;
    font-size: 13px;
    color: #525558;
  `,

  careerDescription: css`
    font-size: 14px;
    color: #3e3e3e;
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
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  `,
};
