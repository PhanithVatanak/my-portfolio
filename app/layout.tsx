import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/ToastContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageLoader } from '@/components/PageLoader';
import { developerProfile } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sun Phanith Vatanak – Senior Frontend Developer & Systems Architect',
  description: 'Production-ready portfolio and engineering research vault of Sun Phanith Vatanak. Next.js 15, TypeScript, WebGL, and scalable cloud systems based in Phnom Penh.',
  keywords: [
    'Sun Phanith Vatanak',
    'Frontend Developer Phnom Penh',
    'Next.js 15',
    'React 19',
    'TypeScript Developer',
    'Systems Architect',
    'Web Performance',
    'Cambodia Software Engineer'
  ],
  authors: [{ name: 'Sun Phanith Vatanak', url: 'https://github.com' }],
  creator: 'Sun Phanith Vatanak',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.APP_URL || 'https://ais-dev-itkqnl7dajpuwg2bqx4z5w-209947677923.asia-east1.run.app',
    title: 'Sun Phanith Vatanak – Senior Frontend Developer & Systems Architect',
    description: 'Explore pixel-perfect web experiences, high-throughput streaming architectures, and open-source projects crafted by Sun Phanith Vatanak.',
    siteName: 'Sun Phanith Vatanak Portfolio',
    images: [
      {
        url: developerProfile.avatarUrl,
        width: 800,
        height: 800,
        alt: 'Portrait of Sun Phanith Vatanak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sun Phanith Vatanak – Senior Frontend Developer & Systems Architect',
    description: 'Explore pixel-perfect web experiences, high-throughput streaming architectures, and open-source projects.',
    images: [developerProfile.avatarUrl],
  },
};

import { PortfolioDataProvider } from '@/components/PortfolioDataContext';

import { PageTransition } from '@/components/PageTransition';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured JSON-LD data for rich search engine snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: developerProfile.name,
    jobTitle: developerProfile.role,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Phnom Penh',
      addressCountry: 'Cambodia',
    },
    email: developerProfile.email,
    sameAs: [
      developerProfile.socials.github,
      developerProfile.socials.linkedin,
      developerProfile.socials.twitter,
    ],
    knowsAbout: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Distributed Systems',
      'Web Performance',
      'WebGPU',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Tech Solutions Cambodia',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('spv_portfolio_theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-gradient-to-b from-sky-100/70 via-sky-50/40 to-white dark:from-slate-950 dark:via-slate-900 dark:to-[#020617] text-slate-800 dark:text-slate-100 antialiased selection:bg-sky-200 dark:selection:bg-sky-500/30 selection:text-sky-900 dark:selection:text-sky-200 transition-colors duration-300">
        <ThemeProvider>
          <PortfolioDataProvider>
            <ToastProvider>
              <PageLoader />
              <Navbar />
              <main className="flex-1 flex flex-col">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </ToastProvider>
          </PortfolioDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
