import { ReactNode } from 'react';

export function generateStaticParams() {
  return [
    { id: 'project-1' },
    { id: 'project-2' },
  ];
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return children;
}
