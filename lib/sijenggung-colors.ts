/**
 * Sijenggung Village Official Color Palette
 * Updated based on color2.csv (Modern energetic theme)
 */

export const sijenggungColors = {
    // Primary colors - Orange Energetik (Main Brand, CTA)
    primary: {
        DEFAULT: "#FF8A00",
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

    // Secondary colors - Turquoise Segar (Supportive, Interactive)
    secondary: {
        DEFAULT: "#4ECDC4",
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

    // Accent colors - Purple Modern (Lifestyle, Unique Elements)
    accent: {
        DEFAULT: "#6C5CE7",
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

    // Base colors
    background: "#F9F9F9", // Off-White Netral
    surface: "#FFFFFF",    // Putih Murni
    textDark: "#2D3436",   // Charcoal Gelap
    textLight: "#FFFFFF",  // Putih Murni

    // Status colors
    success: "#2ECC71", // Emerald Hijau
    warning: "#FDBB30", // Sunshine Kuning
    danger: "#E74C3C",  // Crimson Merah
    info: "#3498DB",    // Sky Biru

    // Additional village theme colors (Mapped to new palette for compatibility)
    villageGreen: {
        DEFAULT: "#FF8A00", // Mapped to primary
        dark: "#E65100",
        darker: "#BF360C",
    },
    villageBlue: "#4ECDC4", // Mapped to secondary
} as const;

/**
 * Utility function to get Tailwind class names for Sijenggung colors
 */
export const getSijenggungClass = {
    // Background classes
    bg: {
        primary: "bg-[#FF8A00]",
        primaryLight: "bg-[#FFF3E0]",
        secondary: "bg-[#4ECDC4]",
        tertiary: "bg-[#6C5CE7]",
        accent: "bg-[#FF6B6B]",
        surface: "bg-[#FFFFFF]",
        success: "bg-[#2ECC71]",
        warning: "bg-[#FDBB30]",
        danger: "bg-[#E74C3C]",
        info: "bg-[#3498DB]",
    },

    // Text classes
    text: {
        primary: "text-[#FF8A00]",
        primaryLight: "text-[#FFB74D]",
        secondary: "text-[#4ECDC4]",
        tertiary: "text-[#6C5CE7]",
        accent: "text-[#FF6B6B]",
        dark: "text-[#2D3436]",
        light: "text-[#FFFFFF]",
        success: "text-[#2ECC71]",
        warning: "text-[#FDBB30]",
        danger: "text-[#E74C3C]",
        info: "text-[#3498DB]",
    },

    // Border classes
    border: {
        primary: "border-[#FF8A00]",
        primaryLight: "border-[#FFE0B2]",
        secondary: "border-[#4ECDC4]",
        accent: "border-[#6C5CE7]",
        success: "border-[#2ECC71]",
        warning: "border-[#FDBB30]",
        danger: "border-[#E74C3C]",
        info: "border-[#3498DB]",
    },

    // Hover states
    hover: {
        bgPrimary: "hover:bg-[#E65100]",
        bgSecondary: "hover:bg-[#0097A7]",
        bgAccent: "hover:bg-[#512DA8]",
        textPrimary: "hover:text-[#E65100]",
        textSecondary: "hover:text-[#0097A7]",
        textAccent: "hover:text-[#512DA8]",
    },
};

/**
 * CSS custom properties for use in component styles
 */
export const pondokrejoCSSVars = {
    "--village-primary": sijenggungColors.primary.DEFAULT,
    "--village-secondary": sijenggungColors.secondary.DEFAULT,
    "--village-accent": sijenggungColors.accent.DEFAULT,
    "--village-background": sijenggungColors.background,
    "--village-surface": sijenggungColors.surface,
    "--village-text-dark": sijenggungColors.textDark,
    "--village-text-light": sijenggungColors.textLight,
    "--village-success": sijenggungColors.success,
    "--village-warning": sijenggungColors.warning,
    "--village-danger": sijenggungColors.danger,
    "--village-info": sijenggungColors.info,
} as const;
