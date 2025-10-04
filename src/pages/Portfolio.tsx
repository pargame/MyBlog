import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../ThemeProvider';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  colors: [string, string]; // [start color, end color]
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'Intelligent Mechatronics Engineer',
    subtitle: 'Sejong University · TOEIC 740 · 정보처리기사',
    description:
      '소프트웨어부터 자동제어, 전자회로까지 하드웨어와 소프트웨어를 아우르는 융합 기술 엔지니어가 되고 싶습니다. 지능기전공학심화를 전공하며 AI, 임베디드 시스템, 웹 개발 등 다양한 분야를 접해보고 학습하는 중입니다. (상세 내용 준비중)',
    colors: ['#e8eaf6', '#f3e5f5'], // Very light lavender to pale purple
  },
  {
    id: 2,
    title: 'AI-Driven Personal Blog',
    subtitle: 'React · TypeScript · Interactive Visualization',
    description:
      'AI를 활용한 콘텐츠 생성과 인터랙티브 시각화 기능을 갖춘 개인 블로그를 만들어보았습니다. React와 TypeScript를 학습하며 개발했고, 사용자 경험과 성능 최적화를 고민하며 제작했습니다. 특히 Graph 페이지에서는 학습 내용을 시각적으로 표현하며, AI API를 통한 마인드맵 자동 생성 기능을 기획하고 있습니다.',
    colors: ['#fce4ec', '#f8e1e8'], // Very light pink to pale rose
  },
  {
    id: 3,
    title: 'Python & AI Development',
    subtitle: 'Machine Learning · Deep Learning · Data Science',
    description:
      'TensorFlow와 PyTorch를 활용하여 AI 모델 개발을 학습하고 있습니다. 데이터 분석, 예측 모델링, 자연어 처리, 컴퓨터 비전 등의 기술을 접해보며 기초를 다지고 있으며, 새로운 기술을 배우고 적용하는 것에 흥미를 느낍니다.',
    colors: ['#e1f5fe', '#e0f7fa'], // Very light sky blue to pale cyan
  },
  {
    id: 4,
    title: 'C++ & Game Development',
    subtitle: 'Algorithm · Graphics · Unreal Engine',
    description:
      'C++ STL을 활용하여 알고리즘 공부를 꾸준히 하고 있습니다. DirectX를 통한 그래픽스 프로그래밍을 학습해보았으며, Unreal Engine 기반 게임 개발에도 관심을 가지고 공부 중입니다.',
    colors: ['#e8f5e9', '#e0f2f1'], // Very light mint to pale aqua
  },
];

export default function Portfolio() {
  const { theme } = useTheme();
  const [visibleSlides, setVisibleSlides] = useState<Set<number>>(new Set([1]));
  const observerRef = useRef<IntersectionObserver | null>(null);
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Get text color based on theme
  const textColor = theme === 'dark' ? '#f8f8f2' : '#2d3748';
  const textShadow =
    theme === 'dark' ? '0 2px 10px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(255, 255, 255, 0.5)';

  useEffect(() => {
    // Intersection Observer to detect visibility ratios and active slide
    // Disconnect any existing observer first (useful for HMR / dynamic slides)
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slideId = parseInt(entry.target.getAttribute('data-slide-id') || '0');

          setVisibleSlides((prev) => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(slideId);
            } else {
              newSet.delete(slideId);
            }
            return newSet;
          });
        });
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    // Observe all slide elements
    slideRefs.current.forEach((element) => {
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
    // slides is a static array in this file; effect doesn't need reactive deps
  }, []);

  const setSlideRef = React.useCallback((id: number) => {
    return (element: HTMLDivElement | null) => {
      if (element) {
        slideRefs.current.set(id, element);
      } else {
        slideRefs.current.delete(id);
      }
    };
  }, []);

  // No background colors - removed for cleaner look

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        // Hide scrollbar
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE and Edge
        position: 'relative',
      }}
      className="portfolio-container"
    >
      {slides.map((slide, index) => {
        const isVisible = visibleSlides.has(slide.id);
        // per-slide layout; container handles the gradient background now

        // per-slide layout; container handles the gradient background now

        return (
          <div
            key={slide.id}
            ref={setSlideRef(slide.id)}
            data-slide-id={slide.id}
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '2rem',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              background: 'transparent',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                maxWidth: '800px',
                textAlign: 'center',
                color: textColor,
                textShadow: textShadow,
              }}
            >
              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: 800,
                  marginBottom: '1rem',
                  lineHeight: 1.2,
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: '0.1s',
                }}
              >
                {slide.title}
              </h1>
              <p
                style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                  fontWeight: 600,
                  marginBottom: '2rem',
                  opacity: 0.85,
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: '0.2s',
                }}
              >
                {slide.subtitle}
              </p>
              <p
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                  lineHeight: 1.8,
                  opacity: 0.75,
                  maxWidth: '600px',
                  margin: '0 auto',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: '0.3s',
                }}
              >
                {slide.description}
              </p>

              {/* Slide indicator */}
              <div
                style={{
                  marginTop: '3rem',
                  fontSize: '0.9rem',
                  opacity: 0.6,
                  color: textColor,
                  fontWeight: 600,
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: '0.4s',
                }}
              >
                {index + 1} / {slides.length}
              </div>
            </div>

            {/* Scroll indicator (only on first slide) */}
            {slide.id === 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  animation: 'bounce 2s infinite',
                  opacity: isVisible ? 0.7 : 0,
                  transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <span style={{ color: textColor, fontSize: '0.9rem', fontWeight: 600 }}>
                  Scroll Down
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: textColor }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            )}
          </div>
        );
      })}

      {/* Global styles for animations and scrollbar hiding */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          /* Hide scrollbar for Chrome, Safari and Opera */
          .portfolio-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}
