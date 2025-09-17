export const tutorialCss = `
.container {
  width: 100%;
  padding: 1px 2rem;
  text-align: center;
  background: #282c34;
  height: calc(
    100vh - 107.38px
  );
}

/* Logo */
.logo {
  font-size: 6rem;
  font-weight: bold;
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #4ecdc4,
    #45b7d1,
    #96ceb4,
    #ffecd2,
    #fcb69f,
    #a8edea,
    #fed6e3
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 3rem;
  text-shadow: 0 4px 20px
    rgba(255, 107, 107, 0.3);
}

/* Features Grid */

.features {
  display: grid;
  grid-template-columns: repeat(
    2,
    1fr
  );
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.feature {
  padding: 2rem;
  border-radius: 16px;
  color: white;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

/* 각 카드마다 다른 색상 */

.feature:nth-child(1) {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  box-shadow: 0 10px 30px
    rgba(102, 126, 234, 0.3);
}

.feature:nth-child(2) {
  background: linear-gradient(
    135deg,
    #f093fb 0%,
    #f5576c 100%
  );
  box-shadow: 0 10px 30px
    rgba(240, 147, 251, 0.3);
}

.feature:nth-child(3) {
  background: linear-gradient(
    135deg,
    #4facfe 0%,
    #00f2fe 100%
  );
  box-shadow: 0 10px 30px
    rgba(79, 172, 254, 0.3);
}

.feature:nth-child(4) {
  background: linear-gradient(
    135deg,
    #43e97b 0%,
    #38f9d7 100%
  );
  box-shadow: 0 10px 30px
    rgba(67, 233, 123, 0.3);
}

/* 호버 효과 */

.feature:hover {
  transform: translateY(-5px);
}

.feature:nth-child(1):hover {
  box-shadow: 0 15px 40px
    rgba(102, 126, 234, 0.5);
}

.feature:nth-child(2):hover {
  box-shadow: 0 15px 40px
    rgba(240, 147, 251, 0.5);
}

.feature:nth-child(3):hover {
  box-shadow: 0 15px 40px
    rgba(79, 172, 254, 0.5);
}

.feature:nth-child(4):hover {
  box-shadow: 0 15px 40px
    rgba(67, 233, 123, 0.5);
}

/* 색상 포인트 효과 */

.feature::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
}

.feature:nth-child(
    1
  )::before {
  background: linear-gradient(
    90deg,
    #ff6b6b,
    #ffd93d,
    #6bcf7f,
    #4d9de0
  );
}

.feature:nth-child(
    2
  )::before {
  background: linear-gradient(
    90deg,
    #ff9a9e,
    #fecfef,
    #fecfef,
    #ff9a9e
  );
}

.feature:nth-child(
    3
  )::before {
  background: linear-gradient(
    90deg,
    #a8edea,
    #fed6e3,
    #d299c2,
    #fef9d7
  );
}

.feature:nth-child(
    4
  )::before {
  background: linear-gradient(
    90deg,
    #ff9a8b,
    #a8e6cf,
    #ffd3a5,
    #fd9853
  );
}

/* 트랜지션 */

.feature {
  transition: all 0.3s ease;
}

`;
