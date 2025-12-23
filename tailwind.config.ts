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
        // Swap roles: Primary -> Turquoise, Secondary -> Orange
        primary: {
          DEFAULT: "#4ECDC4", // Turquoise Segar (Main Brand, CTA)
          50: "#E0F7FA",
          100: "#B2EBF2",
          200: "#80DEEA",
          300: "#4DD0E1",
          400: "#26C6DA",
          500: "#4ECDC4",
          600: "#00ACC1",
          700: "#0097A7",
          800: "#00838F",
          900: "#006064",
          950: "#00363A",
        },
        secondary: {
          DEFAULT: "#E65100", // Even darker Orange for better contrast
          50: "#FFF3E0",
          100: "#FFE0B2",
          200: "#FFCC80",
          300: "#FFB74D",
          400: "#FFA726",
          500: "#FF8A00",
          600: "#FB8C00",
          700: "#F57C00",
          800: "#EF6C00",
          900: "#E65100",
          950: "#BF360C",
        },
        tertiary: {
          DEFAULT: "#6C5CE7", // Purple Modern (Lifestyle, Unique Elements)
          50: "#EDE7F6",
          100: "#D1C4E9",
          200: "#B39DDB",
          300: "#9575CD",
          400: "#7E57C2",
          500: "#6C5CE7",
          600: "#5E35B1",
          700: "#512DA8",
          800: "#4527A0",
          900: "#311B92",
          950: "#200E65",
        },
        accent: {
          DEFAULT: "#FF6B6B", // Coral Hangat (Notifications, Status, Attention)
          50: "#FFF5F5",
          100: "#FFE6E6",
          200: "#FFC9C9",
          300: "#FFABAB",
          400: "#FF8D8D",
          500: "#FF6B6B",
          600: "#E66060",
          700: "#CC5656",
          800: "#B34B4B",
          900: "#994040",
          950: "#803636",
        },
        background: "#F9F9F9", // Off-White Netral
        surface: "#FFFFFF", // Putih Murni
        "text-dark": "#2D3436", // Charcoal Gelap
        "text-light": "#FFFFFF", // Putih Murni
        "text-light-hover": "#FFE0B2", // Orange light for hover on dark bg
        success: "#2ECC71", // Emerald Hijau
        warning: "#FDBB30", // Sunshine Kuning
        danger: "#E74C3C", // Crimson Merah
        info: "#3498DB", // Sky Biru
        // Additional village theme colors
        "village-green": {
          DEFAULT: "#4ECDC4", // Mapped to primary for compatibility
          dark: "#006064",
          darker: "#00363A",
        },
        "village-blue": "#FF8A00", // Mapped to secondary for compatibility
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
