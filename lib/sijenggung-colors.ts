/**
 * Sijenggung Village Official Color Palette
 * Updated based on Pastel Theme Request
 */

export const sijenggungColors = {
    // User Requested Pastel Palette
    powderBlush: "#ffadad",
    apricotCream: "#ffd6a5",
    cream: "#fdffb6",
    teaGreen: "#caffbf",
    electricAqua: "#9bf6ff",
    babyBlueIce: "#a0c4ff",
    periwinkle: "#bdb2ff",
    mauve: "#ffc6ff",
    porcelain: "#fffffc",

    // Primary colors - Baby Blue Ice (Main Brand, Soft & Trustworthy)
    primary: {
        DEFAULT: "#A0C4FF",
        50: "#F5F9FF",
        100: "#E6F0FF",
        200: "#CCE0FF",
        300: "#B3D1FF",
        400: "#A0C4FF",
        500: "#80ABFF",
        600: "#6092FF",
        700: "#4079FF",
        800: "#205FFF",
        900: "#0046E6",
        950: "#0030B3",
    },

    // Secondary colors - Tea Green (Nature, Freshness)
    secondary: {
        DEFAULT: "#CAFFBF",
        50: "#F9FFF7",
        100: "#F0FFEB",
        200: "#E0FFD6",
        300: "#D6FFC9",
        400: "#CAFFBF",
        500: "#A8F598",
        600: "#86EB71",
        700: "#64E04A",
        800: "#42D623",
        900: "#2B9E15",
        950: "#1A660D",
    },

    // Accent colors - Powder Blush (Warmth, Highlights)
    accent: {
        DEFAULT: "#FFADAD",
        50: "#FFF5F5",
        100: "#FFE6E6",
        200: "#FFD1D1",
        300: "#FFBCBC",
        400: "#FFADAD",
        500: "#FF8585",
        600: "#FF5C5C",
        700: "#FF3333",
        800: "#D60000",
        900: "#AD0000",
        950: "#850000",
    },

    // Tertiary - Periwinkle (Creative, Unique)
    tertiary: {
        DEFAULT: "#BDB2FF",
        50: "#F7F5FF",
        100: "#EBE6FF",
        200: "#DCD4FF",
        300: "#CDC2FF",
        400: "#BDB2FF",
        500: "#9F8FFF",
        600: "#816BFF",
        700: "#6347FF",
        800: "#4524FF",
        900: "#2700FF",
        950: "#1A00AB",
    },

    // Base colors
    background: "#FFFFFC", // Porcelain
    surface: "#FFFFFF",    // White
    textDark: "#1F2933",   // Charcoal (Readable)
    textLight: "#1F2933",  // Dark text on pastel! (Except on dark mode/dark overlays)

    // Status colors (kept standard but soft)
    success: "#CAFFBF", // Mapped to Tea Green
    warning: "#FFD6A5", // Apricot Cream
    danger: "#FFADAD",  // Powder Blush
    info: "#9BF6FF",    // Electric Aqua

    // Additional village theme colors
    villageGreen: {
        DEFAULT: "#CAFFBF",
        dark: "#A8F598",
        darker: "#1A660D",
    },
    villageBlue: {
        DEFAULT: "#A0C4FF",
        dark: "#80ABFF",
        darker: "#0030B3",
    }
} as const;

/**
 * Utility function to get Tailwind class names for Sijenggung colors
 */
export const getSijenggungClass = {
    bg: {
        primary: "bg-[#A0C4FF]",
        primaryLight: "bg-[#E6F0FF]",
        secondary: "bg-[#CAFFBF]",
        accent: "bg-[#FFADAD]",
        powderBlush: "bg-powder-blush",
        apricotCream: "bg-apricot-cream",
        cream: "bg-cream",
        teaGreen: "bg-tea-green",
        electricAqua: "bg-electric-aqua",
        babyBlueIce: "bg-baby-blue-ice",
        periwinkle: "bg-periwinkle",
        mauve: "bg-mauve",
        porcelain: "bg-porcelain",
    },
    text: {
        primary: "text-[#205FFF]",
        secondary: "text-[#2B9E15]",
        accent: "text-[#D60000]",
        dark: "text-[#1F2933]",
    },
};
