export const tutorialCss = `
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  animation: fadeInUp 0.8s
    ease-out;
}

h1 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(
    45deg,
    #ff6b6b,
    #4ecdc4,
    #45b7d1,
    #96ceb4,
    #feca57,
    #ff9ff3,
    #54a0ff
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  text-shadow: 0 0 30px
    rgba(255, 255, 255, 0.3);
  letter-spacing: -1px;
}

.description {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(
    255,
    255,
    255,
    0.9
  );
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  text-shadow: 1px 1px 2px
    rgba(0, 0, 0, 0.2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(
    2,
    minmax(280px, 1fr)
  );
  gap: 30px;
  margin-top: 40px;
}

.grid-item {
  background: rgba(
    45,
    45,
    45,
    0.9
  );
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px
    rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid
    rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.grid-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    #667eea,
    #764ba2
  );
  transform: scaleX(0);
  transition: transform 0.3s
    ease;
  transform-origin: left;
}

.grid-item:hover::before {
  transform: scaleX(1);
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px
    rgba(0, 0, 0, 0.15);
}

.grid-item__title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.grid-item__title::before {
  content: "";
  width: 8px;
  height: 8px;
  background: linear-gradient(
    135deg,
    #667eea,
    #764ba2
  );
  border-radius: 50%;
  flex-shrink: 0;
}

.grid-item__description {
  color: #cccccc;
  line-height: 1.7;
  font-size: 0.95rem;
}

`;
