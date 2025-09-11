import React from 'react';
import MarkdownViewer from '../../pages/MarkdownViewer';
import { useTheme } from '../../ThemeProvider';

type Props = {
  folder: string;
  slug: string | null;
  closing?: boolean;
  onRequestClose?: () => void;
  onClose: () => void;
};

export default function ArchiveSidebar({ folder, slug: initialSlug, onClose }: Props) {
  const { theme } = useTheme();
  const [localSlug, setLocalSlug] = React.useState<string | null>(initialSlug);
  React.useEffect(() => setLocalSlug(initialSlug), [initialSlug]);
  if (!localSlug) return null;

  // Controls CSS enter/exit transitions
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => setVisible(true), []);

  // Sidebar ref: intercept wheel events to keep scrolling inside
  const asideRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    const el = asideRef.current;
    if (!el) return;

    const onWheel = (ev: WheelEvent) => {
      // Prevent page scroll and scroll the aside element instead
      ev.preventDefault();
      ev.stopPropagation();
      const delta = ev.deltaY;
      const next = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, el.scrollTop + delta));
      el.scrollTop = next;
    };

    el.addEventListener('wheel', onWheel as EventListener, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel as EventListener);
    };
  }, []);

  // Intercept touch events on mobile so panning the sidebar doesn't scroll the
  // underlying page. We implement a touch-based scroll handler similar to the
  // wheel handler: track the initial touch Y and adjust aside.scrollTop while
  // preventing default behavior on touchmove.
  React.useEffect(() => {
    const el = asideRef.current;
    if (!el) return;

    let touchStartY = 0;
    let startScrollTop = 0;

    const onTouchStart = (ev: TouchEvent) => {
      if (!ev.touches || ev.touches.length === 0) return;
      touchStartY = ev.touches[0].clientY;
      startScrollTop = el.scrollTop;
    };

    const onTouchMove = (ev: TouchEvent) => {
      if (!ev.touches || ev.touches.length === 0) return;
      const currentY = ev.touches[0].clientY;
      const delta = touchStartY - currentY;
      const next = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, startScrollTop + delta));
      el.scrollTop = next;
      // Prevent the touch from scrolling the body underneath.
      ev.preventDefault();
      ev.stopPropagation();
    };

    const onTouchEnd = () => {
      touchStartY = 0;
      startScrollTop = 0;
    };

    // touchmove must be non-passive to allow preventDefault
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove as EventListener, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart as EventListener);
      el.removeEventListener('touchmove', onTouchMove as EventListener);
      el.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, []);

  // Close when clicking outside; uses a document listener to avoid a backdrop
  React.useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    const onDocClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      // If click was on an element that should be ignored (like the theme toggle), don't close
      try {
        let cur: HTMLElement | null = target;
        while (cur) {
          if (cur.getAttribute && cur.getAttribute('data-ignore-sidebar-close') === 'true') return;
          cur = cur.parentElement;
        }
      } catch (e) {
        // ignore
      }
      // If click was inside the aside, ignore
      if (el.contains(target)) return;
      // If a vis-network node was clicked very recently, don't close the
      // sidebar — the Archive page marks such clicks by setting
      // window.__archiveNodeClick for a short window. This compensates for
      // event ordering differences where the network's stopPropagation may
      // not prevent the document listener from firing.
      try {
        if ((window as any).__archiveNodeClick) return;
      } catch (e) {
        // ignore
      }
      // Previously clicks anywhere in the graph container were ignored which
      // prevented background canvas clicks from closing the sidebar. We only
      // want to keep the sidebar open for node clicks; those node clicks
      // already stop propagation inside the Archive page's network click
      // handler. So do not special-case the whole container here — let node
      // clicks (which call stopPropagation) naturally be ignored, while
      // background clicks on the canvas will bubble here and close the
      // sidebar.
      // otherwise start exit transition; onTransitionEnd will call onClose
      setVisible(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  return (
    <aside
      ref={asideRef}
      role="dialog"
      aria-label="문서 미리보기"
      className={visible ? 'sidebar-enter' : 'sidebar-exit'}
      onTransitionEnd={(e) => {
        // when exit transition ends, call onClose to unmount
        if ((e.target as HTMLElement).classList.contains('sidebar-exit')) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '50vw',
        maxWidth: '100%',
        background: 'var(--panel)',
        boxShadow: 'rgba(2,6,23,0.4) 0px 12px 40px',
        padding: '1rem 1.25rem',
        overflow: 'auto',
        zIndex: 80,
        transition: 'transform 260ms ease, opacity 200ms ease',
        transform: visible ? 'translateX(0%)' : 'translateX(110%)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        <div />
        <button
          onClick={() => {
            setVisible(false);
          }}
          aria-label="닫기"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: theme === 'dark' ? 'rgba(255,255,255,0.92)' : 'var(--muted-text)',
            fontSize: 18,
            lineHeight: '18px',
            padding: 6,
            borderRadius: 8,
            transition: 'background 150ms ease, transform 120ms ease',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
            btn.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'transparent';
            btn.style.transform = 'none';
          }}
        >
          ✕
        </button>
      </div>
      {/* reuse MarkdownViewer to render the document; pass base=archives and folder */}
      <MarkdownViewer
        slugProp={localSlug ?? undefined}
        base="archives"
        folder={folder}
        onWikiLinkClick={(s) => setLocalSlug(s)}
      />
    </aside>
  );
}
