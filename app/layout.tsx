import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const sans = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans' });
const serif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: { default: 'recipe book.', template: '%s · recipe book.' },
  description: 'A personal recipe book.',
  robots: { index: false, follow: false }
};

export const viewport: Viewport = { themeColor: '#2f2f2e' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <svg className="grain" aria-hidden="true">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
