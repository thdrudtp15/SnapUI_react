---
title: 'SnapUI'
description: '브라우저에서 바로 실행 가능한 CSS 스냅샷 에디터'
period: {start: '2024', end: '2025'}
tech: ['React', 'TypeScript', 'Vite', 'Monaco Editor', 'PostCSS', 'LZ-String', 'DOMPurify', 'react-router']
thumbnail: /projects/thumbnail/snapui.jpg
type: '개인 프로젝트'
url: 'https://snap-ui-react.vercel.app/'
github: 'https://github.com/thdrudtp15/snap_ui_react'
---

# 🚩 프로젝트 개요

React + Vite 기반 브라우저 내장 CSS 스냅샷 에디터

-   **실시간 HTML/CSS 에디터** 및 프리뷰
-   **하이라이트 모드**로 요소별 스타일 탐색
-   **CSS 규칙 추출** 기능
-   **URL 파라미터 기반 코드 공유** (LZ-String 압축)

---

# 📝 주요 기능

**실시간 코드 에디터**

-   **Monaco Editor** 기반 HTML/CSS 에디터
-   Prettier 자동 포매팅 (Ctrl/Cmd + S)
-   탭 전환으로 HTML/CSS 편집

**실시간 렌더링 및 프리뷰**

-   **DOMPurify**로 XSS 공격 방지
-   **CSS 스코핑**으로 외부 스타일 간섭 방지
-   커스텀 배경색 선택

**하이라이트 모드**

-   마우스 호버 시 요소별 스타일 강조
-   클릭한 요소에 적용된 **CSS 규칙만 추출**하여 표시
-   요소별 CSS 편집 기능

**코드 공유 시스템**

-   URL 파라미터로 HTML/CSS 상태 저장
-   **LZ-String 압축**으로 URL 길이 최적화
-   클립보드 복사 기능

---

### 기술적 해결

✅ **PostCSS 기반 CSS 스코핑**으로 스타일 격리

-   문제: 에디터에서 작성한 CSS가 애플리케이션 전체에 영향을 미치는 문제

-   해결: PostCSS AST를 활용하여 모든 CSS 선택자에 고유 스코프 셀렉터(`#preview_wrap__x9zq8_vn3l0`)를 자동으로 추가

-   성과: 사용자 작성 CSS가 프리뷰 영역에만 적용되도록 **완전한 스타일 격리** 구현

        ```14:66:src/utils/scopeCss.ts
        export const scopeCSS = (css: string, scopeSelector = '.preview') => {
            if (!css || !css.trim()) return css;

            try {
                const root = postcss.parse(css);

                root.walkRules((rule) => {
                    if (rule.parent?.type === 'atrule') {
                        const atRule = rule.parent as postcss.AtRule;

                        // @keyframes, @font-face 등은 스코프 추가 불가
                        if (
                            atRule.name === 'keyframes' ||
                            atRule.name === 'font-face' ||
                            atRule.name === '-webkit-keyframes' ||
                            atRule.name === '-moz-keyframes'
                        ) {
                            return;
                        }
                    }

                    const selectors = rule.selector.split(',').map((sel) => sel.trim());
                    const scopedSelectors = selectors.map((sel) => {
                        if (sel.startsWith(scopeSelector)) {
                            return sel;
                        }
                        return `${scopeSelector} ${sel}`;
                    });

                    rule.selector = scopedSelectors.join(', ');
                });

                return root.toString();
            } catch (error) {
                console.error('scopeCSS 파싱 오류:', error);
                return `/* ⚠️ CSS 파싱 오류: 스타일을 적용할 수 없습니다. */`;
            }
        };
        ```

✅ **LZ-String 압축**으로 URL 길이 최적화

-   문제: HTML/CSS 코드가 길어질 경우 URL이 지나치게 길어지는 문제

-   해결: `LZ-String` 라이브러리를 사용하여 URL 쿼리 파라미터에 저장되는 코드를 압축 인코딩

-   성과: 긴 코드의 경우 URL 길이 **20% 이상 단축**, 코드 공유 용이성 향상

        ```4:15:src/hooks/useUpdateQueryParams.ts
        const useUpdateQueryParams = () => {
            const [_, setSearchParams] = useSearchParams();

            // LZString 압축 인코딩
            const update = ({ key, value }: { key: string; value: string }) => {
                const encodedValue = LzString.compressToEncodedURIComponent(value);
                setSearchParams((prev) => ({ ...Object.fromEntries(prev), [key]: encodedValue }), { replace: true });
            };

            return {
                update,
            };
        };
        ```

✅ **PostCSS 기반 CSS 규칙 추출**로 하이라이트 모드 성능 최적화

-   문제: 하이라이트 모드에서 모든 CSS 규칙을 매번 파싱하여 성능 문제 발생

-   해결: PostCSS를 활용하여 클릭한 요소에 적용된 CSS 규칙만 추출하는 `extractCSSRules` 함수 구현

-   성과: 불필요한 CSS 파싱 제거, **하이라이트 모드 성능 개선**

        ```17:118:src/utils/extractCssRules.ts
        export function extractCSSRules(cssString: string, selectors: string[]): string {
            try {
                if (!cssString || !cssString.trim() || selectors.length === 0) {
                    return cssString || '';
                }

                const root = postcss.parse(cssString);

                const usedVariables = new Set<string>();
                const usedAnimations = new Set<string>();

                const isMatchingSelector = (ruleSelector: string, targetSelector: string): boolean => {
                    // 정확히 일치, 의사 클래스, 의사 요소, 속성 선택자, 후손/자식/형제 선택자 등
                    // 다양한 선택자 패턴 매칭 로직
                };

                const processRule = (rule: postcss.Rule): boolean => {
                    const selList = rule.selector.split(',').map((s) => s.replace(/\/\*[\s\S]*?\*\//g, '').trim());

                    const keep = selList.some((ruleSelector) => {
                        return selectors.some((targetSelector) => {
                            return isMatchingSelector(ruleSelector, targetSelector);
                        });
                    });

                    // 매칭된 규칙에서 사용하는 CSS 변수와 애니메이션 수집
                    if (keep) {
                        rule.walkDecls((decl) => {
                            // CSS 변수 및 애니메이션 추출 로직
                        });
                    }

                    return keep;
                };

                // 최상위 CSS 규칙 및 @media 쿼리 내부 규칙 처리
                // 사용된 CSS 변수 및 @keyframes 애니메이션 추출
                // ...

                return root.toString();
            } catch (error) {
                console.error('CSS 파싱 중 오류 발생:', error);
                return `/* CSS 파싱 오류 발생 */\n${cssString}`;
            }
        }
        ```

✅ **디바운싱 및 메모이제이션**으로 불필요한 리렌더링 방지

-   문제: 에디터 입력 시마다 URL 파라미터 업데이트로 인한 성능 저하

-   해결: 500ms 디바운싱 적용 및 React.memo를 활용한 컴포넌트 메모이제이션

-   성과: **불필요한 리렌더링 최소화**, 사용자 경험 개선

✅ **Monaco Editor 코드 스플리팅**으로 초기 로딩 속도 개선

-   문제: Monaco Editor가 큰 번들 크기로 인한 초기 로딩 지연

-   해결: Vite 빌드 설정에서 Monaco Editor를 언어별, 워커별로 수동 청크 분리

-   성과: **초기 번들 크기 감소**, 필요한 에디터 기능만 로드

        ```8:59:vite.config.ts
        build: {
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        // Monaco Editor 관련 파일들을 세분화하여 분리
                        if (id.includes('monaco-editor')) {
                            // Workers를 별도 청크로
                            if (id.includes('editor.worker')) return 'monaco-worker-editor';
                            if (id.includes('json.worker')) return 'monaco-worker-json';
                            if (id.includes('css.worker')) return 'monaco-worker-css';
                            if (id.includes('html.worker')) return 'monaco-worker-html';
                            if (id.includes('ts.worker')) return 'monaco-worker-ts';

                            // 언어별 기능을 별도 청크로
                            if (id.includes('/esm/vs/language/')) return 'monaco-languages';
                            if (id.includes('/esm/vs/basic-languages/')) return 'monaco-basic-langs';

                            // 나머지 Monaco 코어
                            return 'monaco-core';
                        }

                        // @monaco-editor/react wrapper
                        if (id.includes('@monaco-editor/react')) {
                            return 'monaco-react';
                        }

                        // React 관련
                        if (
                            id.includes('node_modules/react/') ||
                            id.includes('node_modules/react-dom/') ||
                            id.includes('node_modules/react-router')
                        ) {
                            return 'react-vendor';
                        }

                        // 유틸리티 라이브러리들
                        if (
                            id.includes('node_modules/lz-string') ||
                            id.includes('node_modules/dompurify') ||
                            id.includes('node_modules/react-colorful') ||
                            id.includes('node_modules/prettier')
                        ) {
                            return 'utils';
                        }

                        // react-icons는 별도로
                        if (id.includes('node_modules/react-icons')) {
                            return 'icons';
                        }
                    },
                },
            },
            chunkSizeWarningLimit: 600,
        }
        ```

---

## 기술 스택 및 도구

-   **TypeScript**: 정적 타입을 통한 타입 안정성 확보 및 유지보수성 향상

-   **React 19**: 최신 React 기능을 활용한 컴포넌트 기반 UI 구현

-   **Vite**: 빠른 개발 서버 및 최적화된 프로덕션 빌드

-   **Monaco Editor**: VS Code와 동일한 코드 에디터 경험 제공

-   **PostCSS**: CSS 파싱 및 변환을 통한 스코핑 및 규칙 추출

-   **LZ-String**: URL 파라미터 압축을 통한 코드 공유 최적화

-   **DOMPurify**: XSS 공격 방지를 위한 HTML 정제

-   **react-router**: URL 파라미터 기반 상태 관리

-   **Prettier**: 코드 자동 포매팅

-   **react-colorful**: 배경색 커스터마이징을 위한 컬러 피커



