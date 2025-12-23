import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  MainContainer,
  HeroSection,
  HeroContent,
  ImgMain,
  TargetUsersSection,
  SectionTitle,
  Cards,
  UserCard,
  InfoSection,
  InfoBox,
  StepList,
  StepItem,
  CommunitySection,
  CTASection,
  StartButton,
  Responsive,
  CommunityDesc,
  CommunityDetail,
  Features,
  Feature,
} from "./resume/MainBody.style";
import styled from "@emotion/styled";

export const ScrollingSection = styled.section`
  position: relative;
  overflow: hidden;
  padding: 100px 0;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 120px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #f9fbff 0%, transparent 100%);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #f9fbff 0%, transparent 100%);
  }
`;

export const ScrollingRow = styled(motion.div)`
  display: flex;
  gap: 30px;
  width: max-content;
  margin-bottom: 20px;
`;

export const Bubble = styled.div`
  background: #2f6bff;
  color: white;
  padding: clamp(10px, 2vw, 25px) clamp(16px, 4vw, 40px);
  border-radius: 999px;
  font-size: clamp(14px, 2.4vw, 24px);
  font-weight: 500;
  white-space: nowrap;
`;

export const MainBodyPage = () => {
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.2 });

  const MotionUserCard = motion.create(UserCard);
  const MotionStartButton = motion.create(StartButton);
  const row1 = [
    "하… 취업 어렵다…",
    "면접 준비는 어떡하지..",
    "다른 지원자들은 어떤 자격증이 있으려나?",
  ];

  const row2 = [
    "자소서 첫 문장 뭘로 시작하지?",
    "프로젝트가 부족한가…",
    "이력서 또 고쳐야 하나",
    "나만 뒤처진 느낌...",
  ];
  return (
    <Responsive>
      <MainContainer>
        <HeroSection>
          <HeroContent>
            <motion.h1
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              개발자의 성장을,
              <br />
              데이터로 증명하세요
              <br />
              <span>AI 기반 포트폴리오</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              GitHub 활동을 분석해 전문적인 이력서와 포트폴리오를 자동으로
              생성합니다.
              <br />
              개발에 집중하고, 나머지는 AI에게 맡기세요.
            </motion.p>
            <MotionStartButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              지금 시작하기 →
            </MotionStartButton>
          </HeroContent>
          <ImgMain>
            <img
              src="/homepage_resume.png"
              alt="코딩하는 메인 이미지"
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
            />
          </ImgMain>
        </HeroSection>

        {/* Section 2 */}
        <TargetUsersSection ref={ref2}>
          <ScrollingSection>
            <ScrollingRow
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...row1, ...row1].map((text, i) => (
                <Bubble key={`row1-${i}`}>{text}</Bubble>
              ))}
            </ScrollingRow>

            <ScrollingRow
              animate={{ x: ["-20%", "0%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...row2, ...row2].map((text, i) => (
                <Bubble key={`row2-${i}`}>{text}</Bubble>
              ))}
            </ScrollingRow>
          </ScrollingSection>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle>
              이런 분들께 <span style={{ color: "#4f8cff" }}>추천드려요!</span>
            </SectionTitle>
          </motion.div>
          <Cards>
            <MotionUserCard
              initial={{ opacity: 0, y: 50 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0 }}
              whileHover={{ scale: 1.04 }}
            >
              <img
                src="/section2_3.webp"
                alt="이직러 관련 이미지"
                width="200"
                height="140"
                loading="lazy"
                decoding="async"
              />
              <h3>이직러</h3>
              <p>코딩은 자신 있지만, 이력서 작성이 막막하셨나요?</p>
              <span>AI가 GitHub를 분석해 이력서를 빠르게 자동 생성합니다.</span>
            </MotionUserCard>
            <MotionUserCard
              initial={{ opacity: 0, y: 50 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.04 }}
            >
              <img
                src="/section2_1.webp"
                alt="졸업 예정자 관련 이미지"
                width="200"
                height="140"
                loading="lazy"
                decoding="async"
              />
              <h3>졸업 예정자</h3>
              <p>학교 프로젝트를 어떻게 정리해야 할지 모르겠다면?</p>
              <span>포트폴리오용 정리된 프로젝트 요약을 제공합니다.</span>
            </MotionUserCard>
            <MotionUserCard
              initial={{ opacity: 0, y: 50 }}
              animate={inView2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.04 }}
            >
              <img
                src="/section2_2.avif"
                alt="주니어 개발자 관련 이미지"
                width="200"
                height="140"
                loading="lazy"
                decoding="async"
              />
              <h3>주니어 개발자</h3>
              <p>블로그는 많은데 이력서에 쓸 말이 없다면?</p>
              <span>블로그 기반 성장기 자동 분석 & 정리!</span>
            </MotionUserCard>
          </Cards>
        </TargetUsersSection>
        {/* Section 3 */}
        <InfoSection ref={ref3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView3 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2 }}
          >
            <InfoBox>
              <SectionTitle>
                3단계로 완성하는{" "}
                <span style={{ color: "#4f8cff" }}>AI 이력서</span>
              </SectionTitle>
              <StepList>
                <StepItem>
                  <div className="number">1</div>
                  <div className="title">GitHub 아이디 입력</div>
                  <div className="desc">
                    내 깃허브 주소만 입력하면
                    <br />
                    AI가 자동 분석 시작!
                  </div>
                </StepItem>
                <StepItem>
                  <div className="number">2</div>
                  <div className="title">이력서 생성 & 편집</div>
                  <div className="desc">
                    AI가 만든 이력서를
                    <br />
                    직관적으로 편집
                  </div>
                </StepItem>
                <StepItem>
                  <div className="number">3</div>
                  <div className="title">저장 & 공유</div>
                  <div className="desc">
                    완성된 이력서를
                    <br />
                    링크로 공유하고 피드백 받기
                  </div>
                </StepItem>
              </StepList>
              <div style={{ marginTop: 80, textAlign: "center" }}>
                <span
                  style={{
                    background: "#eaf3ff",
                    color: "#4f8cff",
                    padding: "16px 24px",
                    borderRadius: 20,
                    fontWeight: 600,
                    fontSize: 20,
                  }}
                >
                  지금 바로 시작해보세요!
                </span>
              </div>
            </InfoBox>
          </motion.div>
        </InfoSection>

        {/* section4*/}
        <CommunitySection>
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={inView3 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2 }}
          >
            <SectionTitle>
              <span className="community-icon">💬</span>커뮤니티에서 함께
              성장하세요
            </SectionTitle>
            <CommunityDesc>
              내 이력서를 <span style={{ color: "#4f8cff" }}>공유</span>하고,{" "}
              <span style={{ color: "#4f8cff" }}>다른 개발자</span>와 소통하며
              피드백을 받아보세요.
            </CommunityDesc>
            <CommunityDetail>
              Dev-Sync 커뮤니티에서 다양한 개발자들과 경험을 나누고, <br />
              서로의 포트폴리오를 보며 성장할 수 있습니다.
            </CommunityDetail>
            <Features>
              <Feature>
                <span>🔗</span>&nbsp;이력서 링크 공유
              </Feature>
              <Feature>
                <span>📝</span>&nbsp;댓글 &amp; 피드백
              </Feature>
              <Feature>
                <span>🤝</span>&nbsp;개발자 네트워킹
              </Feature>
            </Features>
          </motion.div>
        </CommunitySection>
      </MainContainer>
    </Responsive>
  );
};
