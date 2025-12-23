import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sijenggung Village Official Colors
        primary: {
          DEFAULT: "#39a2cf", // Header BG
          50: "#e6f0fa",
          100: "#cce0f5",
          200: "#99c2eb",
          300: "#66a3e0",
          400: "#3385d6",
          500: "#3eafdf", // Hero BG
          600: "#39a2cf", // Main primary color (Header)
          700: "#0a4766",
          800: "#08374c",
          900: "#052632",
          950: "#03161d",
        },
        secondary: {
          DEFAULT: "#3eafdf", // Hero BG
          50: "#e6f2fa",
          100: "#cce5f5",
          200: "#99cceb",
          300: "#66b2e0",
          400: "#3399d6",
          500: "#3eafdf", // Main secondary color (Hero)
          600: "#39a2cf",
          700: "#0a4766",
          800: "#08374c",
          900: "#052632",
          950: "#03161d",
        },
        accent: {
          DEFAULT: "#0a4661", // Footer BG
          50: "#e6f0f5",
          100: "#cce0eb",
          200: "#99c2d7",
          300: "#66a3c2",
          400: "#3385ae",
          500: "#0a4661", // Main accent color (Footer)
          600: "#062942",
          700: "#041d2f",
          800: "#03121c",
          900: "#010609",
          950: "#000000",
        },
        background: "#f8f9fc", // Dasar halaman bersih - Wordpress background
        surface: "#e6eaf3", // Latar kartu/komponen - Wordpress surface
        "text-dark": "#000000", // Teks utama
        "text-light": "#ffffff", // Teks di atas latar gelap
        "text-light-hover": "#ddf0ff", // Teks hover di atas latar gelap
        success: "#22c55e", // Status sukses
        warning: "#fbbf24", // Peringatan
        danger: "#f87171", // Kesalahan
        info: "#60a5fa", // Informasi
        // Additional village theme colors
        "village-green": {
          DEFAULT: "#39a2cf",
          dark: "#3eafdf",
          darker: "#0a4661",
        },
        "village-blue": "#3eafdf", // Untuk dekorasi (Hero blue)
        // Override default colors for consistency
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "bounce-gentle": "bounceGentle 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
