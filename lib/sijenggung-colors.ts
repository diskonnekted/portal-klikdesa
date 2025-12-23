/**
 * Sijenggung Village Official Color Palette
 * Based on docs/sijenggung.md theme specification
 */

export const sijenggungColors = {
    // Primary colors - Biru utama resmi
    primary: {
        DEFAULT: "#39a2cf",
        50: "#e6eaf3",
        100: "#c2c9df",
        200: "#9ba8c7",
        300: "#7487af",
        400: "#5d719d",
        500: "#4a5f8c",
        600: "#3a4d74",
        700: "#2f3f62",
        800: "#283755",
        900: "#1f2b44",
        950: "#39a2cf",
    },

    // Secondary colors - Biru kebiruan pendukung
    secondary: {
        DEFAULT: "#10264f",
        50: "#e6eaf3",
        100: "#c2c9df",
        200: "#9ba8c7",
        300: "#7487af",
        400: "#5d719d",
        500: "#4a5f8c",
        600: "#3a4d74",
        700: "#2f3f62",
        800: "#283755",
        900: "#1f2b44",
        950: "#10264f",
    },

    // Accent colors - Warna aksen/CTA - Biru terang
    accent: {
        DEFAULT: "#3a4d74",
        50: "#e6eaf3",
        100: "#c2c9df",
        200: "#9ba8c7",
        300: "#7487af",
        400: "#5d719d",
        500: "#4a5f8c",
        600: "#3a4d74",
        700: "#2f3f62",
        800: "#283755",
        900: "#1f2b44",
    },

    // Base colors
    background: "#f8f9fc", // Dasar halaman bersih
    surface: "#e6eaf3", // Latar kartu/komponen
    textDark: "#000000", // Teks utama
    textLight: "#ffffff", // Teks di atas latar gelap

    // Status colors
    success: "#22c55e", // Status sukses
    warning: "#fbbf24", // Peringatan
    danger: "#f87171", // Kesalahan
    info: "#60a5fa", // Informasi

    // Additional village theme colors
    villageGreen: {
        DEFAULT: "#39a2cf",
        dark: "#10264f",
        darker: "#0a1a36",
    },
    villageBlue: "#7487af", // Untuk dekorasi
} as const;

/**
 * Utility function to get Tailwind class names for Sijenggung colors
 */
export const getSijenggungClass = {
    // Background classes
    bg: {
        primary: "bg-[#39a2cf]",
        primaryLight: "bg-[#e6eaf3]",
        secondary: "bg-[#10264f]",
        accent: "bg-[#3a4d74]",
        surface: "bg-[#e6eaf3]",
        success: "bg-[#22c55e]",
        warning: "bg-[#fbbf24]",
        danger: "bg-[#f87171]",
        info: "bg-[#60a5fa]",
    },

    // Text classes
    text: {
        primary: "text-[#39a2cf]",
        primaryLight: "text-[#7487af]",
        secondary: "text-[#10264f]",
        accent: "text-[#3a4d74]",
        dark: "text-[#000000]",
        light: "text-[#ffffff]",
        success: "text-[#22c55e]",
        warning: "text-[#fbbf24]",
        danger: "text-[#f87171]",
        info: "text-[#60a5fa]",
    },

    // Border classes
    border: {
        primary: "border-[#39a2cf]",
        primaryLight: "border-[#9ba8c7]",
        secondary: "border-[#10264f]",
        accent: "border-[#3a4d74]",
        success: "border-[#22c55e]",
        warning: "border-[#fbbf24]",
        danger: "border-[#f87171]",
        info: "border-[#60a5fa]",
    },

    // Hover states
    hover: {
        bgPrimary: "hover:bg-[#10244f]",
        bgSecondary: "hover:bg-[#283755]",
        bgAccent: "hover:bg-[#2f3f62]",
        textPrimary: "hover:text-[#10244f]",
        textSecondary: "hover:text-[#283755]",
        textAccent: "hover:text-[#2f3f62]",
    },
};

/**
 * CSS custom properties for use in component styles
 */
export const pondokrejoCSSVars = {
    "--village-primary": pondokrejoColors.primary.DEFAULT,
    "--village-secondary": pondokrejoColors.secondary.DEFAULT,
    "--village-accent": pondokrejoColors.accent.DEFAULT,
    "--village-background": pondokrejoColors.background,
    "--village-surface": pondokrejoColors.surface,
    "--village-text-dark": pondokrejoColors.textDark,
    "--village-text-light": pondokrejoColors.textLight,
    "--village-success": pondokrejoColors.success,
    "--village-warning": pondokrejoColors.warning,
    "--village-danger": pondokrejoColors.danger,
    "--village-info": pondokrejoColors.info,
} as const;
