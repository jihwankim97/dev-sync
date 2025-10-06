import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import homepage from "../assets/homepage.png";
import findImg1 from "../assets/section2_1.jpg";
import findImg2 from "../assets/section2_2.jpg";
import findImg3 from "../assets/section2_3.jpg";
import "./Main.body.css";

export const MainBodyPage = () => {
  // const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="main-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            코드를 기록했다면,
            <br />
            이젠 보여줄 차례
            <br />
            자동생성 <span>AI 포트폴리오</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            더 이상 이력서와 포트폴리오 작성에 시간을 낭비하지 마세요.
            <br />
            AI가 당신의 개발 커리어를 기록해드립니다.
          </motion.p>
          <motion.button
            className="start-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            지금 시작하기 →
          </motion.button>
        </div>
        <motion.div>
          <motion.div className="img-main">
            <img src={homepage} alt="코딩하는 이미지" loading="lazy" decoding="async" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2 */}
      <section ref={ref2} className="target-users-section">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={inView2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          이런 분들께 추천드려요!
        </motion.h2>
        <div className="cards">
          <motion.div
            className="user-card"
            // whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <img src={findImg3} className="card_img" loading="lazy" decoding="async" />
            <h3>이직러</h3>
            <p>코딩은 자신 있지만, 이력서 작성이 막막하셨나요?</p>
            <span>AI가 GitHub를 분석해 이력서를 빠르게 자동 생성합니다.</span>
          </motion.div>
          <motion.div
            className="user-card"
            initial={{ opacity: 0, y: 50 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <img src={findImg1} className="card_img" loading="lazy" decoding="async" />
            <h3>졸업 예정자</h3>
            <p>학교 프로젝트를 어떻게 정리해야 할지 모르겠다면?</p>
            <span>포트폴리오용 정리된 프로젝트 요약을 제공합니다.</span>
          </motion.div>
          <motion.div
            className="user-card"
            initial={{ opacity: 0, y: 50 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <img src={findImg2} className="card_img" loading="lazy" decoding="async" />
            <h3>주니어 개발자</h3>
            <p>블로그는 많은데 이력서에 쓸 말이 없다면?</p>
            <span>블로그 기반 성장기 자동 분석 & 정리!</span>
          </motion.div>
        </div>
      </section>

      {/* Section 3 */}
      <section ref={ref3} className="info-section">
        <motion.div
          className="info-box"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView3 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2 }}
        >
          <h2>커뮤니티에서 공유하고 피드백 받기</h2>
          <p>
            다른 개발자와 포트폴리오를 공유하고, 댓글과 피드백을 받아보세요.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>지금 바로 Dev-Sync를 시작해보세요.</h2>
        <button className="start-button">무료로 시작하기</button>
      </section>
    </div>
  );
};
