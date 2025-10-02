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
    title: 'Welcome to My Portfolio',
    subtitle: 'Scroll down to explore',
    description:
      'This portfolio showcases my journey as a developer, featuring projects that demonstrate my skills in modern web technologies and creative problem-solving.',
    colors: ['#e8eaf6', '#f3e5f5'], // Very light lavender to pale purple
  },
  {
    id: 2,
    title: 'Full-Stack Development',
    subtitle: 'Building scalable applications',
    description:
      'Experienced in developing end-to-end solutions using React, TypeScript, Node.js, and modern cloud infrastructure. Focus on clean code, performance optimization, and user experience.',
    colors: ['#fce4ec', '#f8e1e8'], // Very light pink to pale rose
  },
  {
    id: 3,
    title: 'WebAssembly & Performance',
    subtitle: 'Pushing browser boundaries',
    description:
      'Specialized in WebAssembly integration, browser-based Python execution with Pyodide, and performance optimization techniques to deliver smooth, responsive web applications.',
    colors: ['#e1f5fe', '#e0f7fa'], // Very light sky blue to pale cyan
  },
  {
    id: 4,
    title: 'Data Visualization',
    subtitle: 'Making data beautiful',
    description:
      'Creating interactive visualizations and graph networks using libraries like vis-network, D3.js, and custom rendering solutions to help users understand complex relationships.',
    colors: ['#e8f5e9', '#e0f2f1'], // Very light mint to pale aqua
  },
  {
    id: 5,
    title: "Let's Connect",
    subtitle: 'Open to opportunities',
    description:
      'Always interested in challenging projects and collaboration opportunities. Feel free to reach out if you want to discuss technology, share ideas, or work together.',
    colors: ['#fff3e0', '#fffde7'], // Very light peach to pale yellow
  },
];

export default function Portfolio() {
  const { theme } = useTheme();
  const [visibleSlides, setVisibleSlides] = useState<Set<number>>(new Set([1]));
  const observerRef = useRef<IntersectionObserver | null>(null);
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Get background color based on theme
  const bgColor = theme === 'dark' ? '#0b1220' : '#ffffff';
  // Get text color based on theme
  const textColor = theme === 'dark' ? '#f8f8f2' : '#2d3748';
  const textShadow =
    theme === 'dark' ? '0 2px 10px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(255, 255, 255, 0.5)';

  useEffect(() => {
    // Intersection Observer to detect when slides enter/exit viewport
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
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
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
      }}
      className="portfolio-container"
    >
      {slides.map((slide, index) => {
        const isVisible = visibleSlides.has(slide.id);
        const nextSlide = slides[index + 1];
        const isFirstSlide = index === 0;
        const isLastSlide = index === slides.length - 1;

        // Create smooth gradient transition between slides with theme-aware edge blending
        const createBackground = () => {
          const gradients: string[] = [];

          // Edge gradients only (no corner radial gradients to avoid harsh boundaries)
          // Left edge gradient (blend to bg color)
          gradients.push(`linear-gradient(to right, ${bgColor} 0%, transparent 10%)`);

          // Right edge gradient (blend to bg color)
          gradients.push(`linear-gradient(to left, ${bgColor} 0%, transparent 10%)`);

          // Top edge gradient (only for first slide)
          if (isFirstSlide) {
            gradients.push(`linear-gradient(to bottom, ${bgColor} 0%, transparent 10%)`);
          }

          // Bottom edge gradient (only for last slide)
          if (isLastSlide) {
            gradients.push(`linear-gradient(to top, ${bgColor} 0%, transparent 10%)`);
          }

          // Main slide gradient
          if (nextSlide) {
            // Blend current slide's end color with next slide's start color at the bottom
            gradients.push(
              `linear-gradient(to bottom, 
                ${slide.colors[0]} 0%, 
                ${slide.colors[1]} 60%, 
                ${nextSlide.colors[0]} 100%)`
            );
          } else {
            // Last slide: simple gradient from start to end color
            gradients.push(
              `linear-gradient(to bottom, 
                ${slide.colors[0]} 0%, 
                ${slide.colors[1]} 100%)`
            );
          }

          return gradients.join(', ');
        };

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
              background: createBackground(),
              position: 'relative',
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
                {slide.id} / {slides.length}
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
