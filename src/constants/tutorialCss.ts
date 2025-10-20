export const tutorialCss = `
.container {
  width: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
}
section {
  width: 25%;
  height: 100vh;
  transition: 0.5s;
  position: relative;
  padding: 1rem;
  overflow: hidden;
  color: white;
}

section:nth-child(1) {
  background: linear-gradient(
    135deg,
    #8b5cf6 0%,
    #a78bfa 100%
  );
}
section:nth-child(2) {
  background: linear-gradient(
    135deg,
    #ec4899 0%,
    #f472b6 100%
  );
}
section:nth-child(3) {
  background: linear-gradient(
    135deg,
    #3b82f6 0%,
    #60a5fa 100%
  );
}
section:nth-child(4) {
  background: linear-gradient(
    135deg,
    #10b981 0%,
    #34d399 100%
  );
}

p {
  font-size: 24px;
  font-weight: bold;
  opacity: 0;
  transition: 0.5s;
  position: relative;
  top: -5%;
}

h2 {
  transition: 0.8s;
  position: absolute;
  width: fit-content;
  top: 30%;
  left: 50%;
  font-size: 32px;
  white-space: nowrap;
  transform: translate(
      -50%,
      -50%
    )
    rotate(90deg);
  text-shadow: 0 2px 10px
    rgba(0, 0, 0, 0.2);
}

span {
  position: absolute;
  padding: 16px;
  top: 30%;
  font-size: 20px;
  opacity: 0;
  text-shadow: 0 2px 10px
    rgba(0, 0, 0, 0.6);
}

section:hover {
  width: calc(25% + 300px);
}
section:hover h2 {
  left: 10%;
  top: 15%;
  transform: rotate(0deg);
}
section:hover p {
  opacity: 1;
  top: 0%;
}

section:hover span {
  animation: fadeIn 1s 0.4s
    forwards;
}

section::after {
  content: "";
  position: absolute;
  top: 30%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    transparent,
    transparent 30%,
    rgba(255, 255, 255, 0.1)
      70%,
    transparent 60%,
    transparent
  );
  transform: rotate(45deg)
    translateX(-80%);
  transition: all 0.8s ease;
  pointer-events: none;
}

section:hover::after {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

`;
