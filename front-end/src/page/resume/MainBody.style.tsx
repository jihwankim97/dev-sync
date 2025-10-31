import styled from "@emotion/styled";

export const MainContainer = styled.div`
  font-family: "Inter", sans-serif;
  background-color: #f8fafc;
`;

export const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  background: linear-gradient(to right, #105ecb 20%, #61c0ff 65%, #fffafa 100%);
  color: #ffffff;
  height: 100%;
`;

export const HeroContent = styled.div`
  flex: 1 1 auto;
  width: clamp(400px, 60vw, 1000px);
  height: 100%;
  padding: clamp(16px, 2.5vw, 64px);

  h1 {
    font-size: clamp(1.6rem, 3vw, 3rem);
    font-weight: 800;
    margin-bottom: 3rem;
    line-height: 1.3;
  }

  p {
    font-size: 1.3rem;
    color: #e0f2fe;
  }

  span {
    background: linear-gradient(to right, #7d7fff, #6cfff3);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
`;

export const ImgMain = styled.div`
  flex: 1 1 auto;
  width: clamp(300px, 45vw, 800px);

  img {
    display: block;
    margin: 0 auto;
    width: 85%;
    max-width: 100%;
    height: auto;
  }
`;

const SectionBase = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: var(--section-height, 560px);
  box-sizing: border-box;
`;

export const TargetUsersSection = styled(SectionBase)`
  padding: 30px 0 30px 0;
  background: #f8fbff;
  --section-height: 560px;
`;

export const SectionTitle = styled.h2`
  text-align: center;
  font-weight: 700;
  font-size: clamp(2rem, 3vw, 4rem);
  margin-bottom: 40px;
`;

export const Cards = styled.div`
  display: flex;
  justify-content: center;
  gap: 36px;
  padding: 5rem;
  flex-wrap: wrap;
`;

export const UserCard = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px 0 rgba(79, 141, 255, 0.133);
  padding: 32px;
  min-width: 260px;
  max-width: 320px;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  text-align: left;

  img {
    border-radius: 16px;
    margin-bottom: 18px;
    max-width: 100%;
    height: auto;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  h3 {
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 8px;
    color: #4f8cff;
  }

  p {
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 6px;
  }

  span {
    color: #888;
    font-size: 15px;
  }
`;

export const InfoSection = styled(SectionBase)`
  padding: 5rem 0;
  background-color: #fff;
`;

export const InfoBox = styled.div`
  max-width: 800px;
  margin: 0 1rem;
  text-align: center;
`;

export const StepList = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
`;

export const StepItem = styled.div`
  text-align: center;
  max-width: 220px;

  .number {
    font-size: 40px;
    font-weight: 700;
    color: #4f8cff;
    margin-bottom: 8px;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .desc {
    color: #888;
    font-size: 15px;
  }
`;

export const CommunitySection = styled(SectionBase)`
  background: #f4f8ff;
  padding: 100px 1rem 130px 1rem;
  box-shadow: 0 2px 24px 0 rgba(79, 140, 255, 0.1);
`;

export const CommunityDesc = styled.div`
  font-size: 25px;
  color: #222;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const CommunityDetail = styled.div`
  color: #666;
  font-size: 18px;
  margin-bottom: 18px;
`;

export const Features = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 60px;
  flex-wrap: wrap;
`;

export const Feature = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(79, 140, 255, 0.08);
  padding: 18px 32px;
  font-weight: 600;
  color: #3578e5;
  font-size: 17px;
  display: flex;
  align-items: center;
`;

export const CTASection = styled(SectionBase)`
  background: linear-gradient(90deg, #4f8cff 0%, #6ad1ff 100%);
  padding: 100px 1rem;
  text-align: center;
  box-shadow: 0 4px 32px 0 rgba(79, 140, 255, 0.13);

  h2 {
    color: #fff;
    font-weight: 800;
    font-size: 2.5rem;
    margin-bottom: 18px;
    letter-spacing: -1px;
  }

  p {
    color: #eaf3ff;
    font-size: 18px;
    margin-bottom: 60px;
    font-weight: 500;
  }
`;

export const StartButton = styled.button`
  color: #fff;
  background-color: #153d93;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0f2fe;
  }
`;

export const Responsive = styled.div`
  @media (max-width: 768px) {
    html,
    body {
      height: 100%;
      margin: 0;
    }

    .main-container & {
      height: 100svh;
    }

    ${HeroSection} {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      min-height: 90svh;
      height: auto;
      flex-grow: 1;
      text-align: center;
      background: linear-gradient(
        to bottom,
        #105ecb 20%,
        #61c0ff 60%,
        #fff7f7 100%
      );
      box-sizing: border-box;
    }

    ${HeroContent} {
      padding: 1.5rem;
      min-height: 280px;
      height: auto;
    }

    ${StartButton} {
      margin-top: 3rem;
    }

    ${HeroContent} h1 {
      font-size: 2rem;
      padding-top: 3rem;
    }

    ${HeroContent} p {
      font-size: 1.1rem;
    }

    ${ImgMain} {
      margin: 0 auto;
      width: 80%;
    }
  }
`;
