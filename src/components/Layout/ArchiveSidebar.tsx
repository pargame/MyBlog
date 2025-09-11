import React from 'react';
import MarkdownViewer from '../../pages/MarkdownViewer';

type Props = {
  folder: string;
  slug: string | null;
  onClose: () => void;
};

export default function ArchiveSidebar({ folder, slug: initialSlug, onClose }: Props) {
  const [localSlug, setLocalSlug] = React.useState<string | null>(initialSlug);
  React.useEffect(() => setLocalSlug(initialSlug), [initialSlug]);
  if (!localSlug) return null;
  return (
    <aside
      role="dialog"
      aria-label="문서 미리보기"
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
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
      >
        <div />
        <button
          onClick={onClose}
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
