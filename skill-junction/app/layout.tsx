import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skill Junction | Academic Modernism in Learning",
  description:
    "A curated learning ecosystem designed for modern professionals. Master complex subjects through our authoritative information architecture and world-class tutoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Tailwind CDN with Stitch design config */}
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" async={false} />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            .glass-card {
              background: rgba(255, 255, 255, 0.7);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.4);
            }
            .glass-nav {
              background: rgba(247, 249, 251, 0.8);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
            }
            .zebra-row:nth-child(even) {
              background-color: #f1f5f9;
            }
            .course-card-hover {
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .course-card-hover:hover {
              transform: translateY(-6px);
              box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02);
            }
            .premium-shadow {
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(255,255,255,0.5);
            }
            .sidebar-link {
              transition: all 0.2s ease;
            }
            .sidebar-link:hover, .sidebar-link.active {
              background: rgba(30, 64, 175, 0.08);
              color: #1e40af;
            }
          `
        }} />
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    colors: {
                      "on-secondary-fixed": "#0b1c30",
                      "surface-tint": "#3b4fd2",
                      "on-surface": "#191c1e",
                      "tertiary-container": "#006794",
                      "error-container": "#ffdad6",
                      "on-tertiary": "#ffffff",
                      "inverse-primary": "#bbc3ff",
                      "inverse-surface": "#2d3133",
                      "surface-container-highest": "#e0e3e5",
                      "primary-container": "#3e52d5",
                      "error": "#ba1a1a",
                      "surface-container-low": "#f2f4f6",
                      "primary": "#2036bd",
                      "secondary": "#505f76",
                      "surface-variant": "#e0e3e5",
                      "secondary-fixed": "#d3e4fe",
                      "on-secondary-fixed-variant": "#38485d",
                      "inverse-on-surface": "#eff1f3",
                      "secondary-container": "#d0e1fb",
                      "on-primary": "#ffffff",
                      "on-surface-variant": "#454654",
                      "tertiary-fixed-dim": "#89ceff",
                      "on-tertiary-fixed-variant": "#004c6e",
                      "surface-container": "#eceef0",
                      "tertiary": "#004e71",
                      "on-primary-container": "#d7daff",
                      "on-error-container": "#93000a",
                      "on-tertiary-container": "#bbe1ff",
                      "surface-bright": "#f7f9fb",
                      "on-secondary": "#ffffff",
                      "surface-container-high": "#e6e8ea",
                      "on-error": "#ffffff",
                      "tertiary-fixed": "#c9e6ff",
                      "surface-container-lowest": "#ffffff",
                      "primary-fixed-dim": "#bbc3ff",
                      "outline-variant": "#c5c5d7",
                      "on-secondary-container": "#54647a",
                      "surface-dim": "#d8dadc",
                      "surface": "#f7f9fb",
                      "on-tertiary-fixed": "#001e2f",
                      "background": "#f7f9fb",
                      "on-background": "#191c1e",
                      "on-primary-fixed": "#000d60",
                      "on-primary-fixed-variant": "#1d34ba",
                      "outline": "#757686",
                      "secondary-fixed-dim": "#b7c8e1",
                      "primary-fixed": "#dfe0ff",
                      "teal": "#0d9488",
                      "orange-cta": "#f59e0b",
                    },
                    borderRadius: {
                      DEFAULT: "0.5rem",
                      lg: "0.75rem",
                      xl: "1.25rem",
                      "2xl": "1rem",
                      full: "9999px",
                    },
                    spacing: {
                      "container-max": "1280px",
                      "stack-md": "16px",
                      "stack-lg": "32px",
                      gutter: "24px",
                      "stack-sm": "8px",
                      "margin-mobile": "16px",
                      "section-gap": "80px",
                      "margin-desktop": "40px",
                    },
                     fontFamily: {
                      sans: ["Inter", "sans-serif"],
                      "headline-md": ["Inter"],
                      "display-lg": ["Inter"],
                      "label-sm": ["Inter"],
                      "body-lg": ["Inter"],
                      "headline-lg-mobile": ["Inter"],
                      "headline-lg": ["Inter"],
                      "body-md": ["Inter"],
                      "label-md": ["Inter"],
                      "label-lg": ["Inter"],
                    },
                    fontSize: {
                      "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
                      "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
                      "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
                      "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
                      "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0em", fontWeight: "400" }],
                      "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "600" }],
                      "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
                      "body-md": ["16px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "400" }],
                      "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }],
                      "label-lg": ["16px", { lineHeight: "24px", letterSpacing: "0.015em", fontWeight: "600" }],
                      "headline-sm": ["20px", { lineHeight: "28px", letterSpacing: "-0.005em", fontWeight: "600" }],
                      "body-sm": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
                    },
                  },
                },
              };
            `,
          }}
        />
      </head>
      <body className="bg-background text-on-surface font-sans overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
