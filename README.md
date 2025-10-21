# SnapUI

브라우저에서 바로 실행 가능한 CSS 스냅샷 에디터입니다. HTML/CSS 코드를 작성하고 실시간으로 프리뷰하며, 스타일을 하이라이트하고 배경색을 커스터마이징할 수 있습니다. URL 파라미터 기반 상태 관리로 코드를 쉽게 공유할 수 있습니다.

---

## 🔗 배포 링크

- [링크](https://snap-ui-react.vercel.app/?html=tutorial)

---

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:5173 에서 확인 가능합니다.

### 빌드

```bash
npm run build
npm run preview
```

---

## ✨ 주요 기능

- 🎨 실시간 HTML/CSS 에디터 및 프리뷰
- 🖱️ 하이라이트 모드로 스타일 탐색
- 🎨 커스텀 배경색 선택
- 📋 코드 복사 및 공유
- 🔗 URL 파라미터 기반 상태 저장
- 💾 LZ-String 압축으로 긴 코드 URL 공유

---

## 🛠️ 기술 스택

| Category  | Tech                                                  |
| --------- | ----------------------------------------------------- |
| Frontend  | React, TypeScript, Vite                               |
| Editor    | Monaco Editor                                         |
| Libraries | react-router, react-colorful, lz-string, dompurify 등 |

---

## 📝 구현 기능

### 🎨 코드 에디터

- `Monaco Editor`를 활용한 HTML/CSS 에디터
- Prettier 자동 포매팅 (Ctrl/Cmd + S)
- 탭 전환으로 HTML/CSS 편집

### 🖼️ 실시간 렌더링

- `DOMPurify`로 XSS 공격 방지
- CSS 스코핑으로 외부 스타일 간섭 방지

### 🖱️ 하이라이트 모드

- 마우스 호버 시 요소별 스타일 강조
- 해당 요소에 적용된 CSS 규칙만 하이라이트

### 🎨 UI 커스터마이징

- 배경색 커스텀 피커
- 대시보드 및 뷰어 섹션 너비 조절

### 📋 코드 공유

- URL 파라미터로 HTML/CSS 상태 저장
- LZ-String 압축으로 URL 길이 최적화
- 클립보드 복사 기능

---

## 📚 문제 해결

### **CSS 스타일 격리**

에디터에서 작성한 CSS가 애플리케이션 전체에 영향을 미치는 문제가 있었습니다.

이를 해결하기 사용자 작성 CSS에 고유한 css 속성을 붙혀 UI 간섭을 제한할 수 있었습니다.

### **URL 파라미터 기반 상태 관리**

작성한 코드의 간편한 공유를 위해 URL 쿼리 파라미터에 상태를 저장하는 방식을 도입했습니다.

HTML/CSS 코드가 길어질 경우 URL이 지나치게 길어지는 문제가 있어, `LZ-String` 라이브러리를 사용해해 압축하여 URL 길이를 **20% 이상** 단축했습니다. (긴 URL에 한함)

### **하이라이트 모드 성능 최적화**

초기 하이라이트 모드는 모든 CSS 규칙을 매번 파싱하여 성능 문제가 있었습니다.

CSS 파싱 로직을 지속적으로 개선하고, 클릭한 요소에 적용된 규칙만을 필터링하도록 최적화했습니다.

또한 불필요한 리렌더링을 방지하기 위해 디바운싱 및 메모이제이션을 적용했습니다.

---

해당 프로젝트는 초기에 Next.js로 진행되었습니다.
[초기 Next.js 버전 코드 보기](https://github.com/thdrudtp15/SnapUI)

---
