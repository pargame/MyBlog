import React from 'react';
import MarkdownViewer from '../../pages/MarkdownViewer';

type Props = {
  folder: string;
  slug: string | null;
  closing?: boolean;
  onRequestClose?: () => void;
  onClose: () => void;
};

export default function ArchiveSidebar({ folder, slug: initialSlug, onClose }: Props) {
  const [localSlug, setLocalSlug] = React.useState<string | null>(initialSlug);
  React.useEffect(() => setLocalSlug(initialSlug), [initialSlug]);
  if (!localSlug) return null;

  // visible state handles enter/exit CSS transitions
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => setVisible(!false), []);

  return (
    <aside
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
        width: 520,
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
          style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
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
