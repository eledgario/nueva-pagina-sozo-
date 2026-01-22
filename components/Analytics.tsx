'use client';

import Script from 'next/script';

// Microsoft Clarity Analytics Component
// Get your project ID from: https://clarity.microsoft.com/

interface AnalyticsProps {
  clarityId?: string;
}

export function MicrosoftClarity({ clarityId }: AnalyticsProps) {
  // Use environment variable or prop
  const projectId = clarityId || process.env.NEXT_PUBLIC_CLARITY_ID;

  // Don't render if no project ID
  if (!projectId) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}

// Google Analytics Component (optional, for future use)
export function GoogleAnalytics({ gaId }: { gaId?: string }) {
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_ID;

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  );
}

// Combined Analytics Provider
export default function Analytics() {
  return (
    <>
      <MicrosoftClarity />
      <GoogleAnalytics />
    </>
  );
}
