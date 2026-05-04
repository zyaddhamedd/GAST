import { ReactNode } from 'react';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `header, footer { display: none !important; }` }} />
      {children}
    </>
  );
}
