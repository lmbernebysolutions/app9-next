import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Grundlagen der Professionalisierung und Berufsethik – Präsentation",
  description: "Standalone Präsentation (App9) als Next.js-Seite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <Script
          id="tailwind-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    animation: {
                      'fade-in': 'fade-in 0.9s ease both',
                      'fade-in-up': 'fade-in-up 0.9s ease both',
                      'slide-in': 'slide-in 0.6s ease both',
                      'slide-in-left': 'slide-in-left 0.7s ease both',
                      'zoom-in': 'zoom-in 0.5s ease both'
                    },
                    keyframes: {
                      'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                      'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                      'slide-in': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                      'slide-in-left': { '0%': { opacity: '0', transform: 'translateX(-24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
                      'zoom-in': { '0%': { opacity: '0', transform: 'scale(0.96)' }, '100%': { opacity: '1', transform: 'scale(1)' } }
                    }
                  }
                }
              };
            `,
          }}
        />
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="bg-slate-900 text-slate-50">{children}</body>
    </html>
  );
}
