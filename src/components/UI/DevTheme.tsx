import React from 'react';
import '../../styles/theme.css';

type Props = { children: React.ReactNode };

export default function DevTheme({ children }: Props) {
  return <div className="dev-theme">{children}</div>;
}
