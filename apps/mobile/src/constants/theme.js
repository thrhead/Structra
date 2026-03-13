export const COLORS = {
    // Core Palette
    primary: "#CCFF04",
    backgroundLight: "#f8f8f5",
    backgroundDark: "#010100",
    cardDark: "#111827",
    cardBorder: "#1f2937",
    textLight: "#f8fafc",
    textGray: "#94a3b8",
    neonGreen: "#CCFF04",
    textDark: "#1e293b",

    // Slate
    slate400: "#94a3b8",
    slate500: "#64748b",
    slate600: "#475569",
    slate700: "#334155",
    slate800: "#1e293b",
    slate900: "#0f172a",

    // Semantics
    white: "#ffffff",
    black: "#000000",
    amber500: "#f59e0b",
    red500: "#ef4444",
    red900: "#7f1d1d",
    green500: "#22c55e",
    blue500: "#3b82f6",
    purple500: "#a855f7",
    cyan500: "#06b6d4",
    pink500: "#ec4899",
    indigo500: "#6366f1",
    orange500: "#f97316",
    teal500: "#14b8a6",

    // Theme Colors
    modernBg: "#F8F9FA",
    electricBlue: "#2D5BFF",
    emeraldStatus: "#10B981",
    amberStatus: "#F59E0B",
    glassCardLight: "rgba(255, 255, 255, 0.9)",
    glassBorderLight: "rgba(255, 255, 255, 0.4)",
    shadowLight: "rgba(31, 38, 135, 0.07)",
};

// 1. MODERN NEON (Yeni Tip - Neon Yeşil)
export const modernNeonTheme = {
    id: 'modern_neon',
    name: 'Modern Neon',
    colors: {
        background: COLORS.modernBg,
        text: COLORS.slate900,
        subText: COLORS.slate500,
        primary: COLORS.neonGreen,
        secondary: COLORS.emeraldStatus,
        tertiary: COLORS.amberStatus,
        card: COLORS.glassCardLight,
        cardBorder: COLORS.glassBorderLight,
        border: COLORS.glassBorderLight,
        icon: COLORS.neonGreen,
        tab: COLORS.white,
        tabActive: COLORS.neonGreen,
        headerBg: "rgba(248, 249, 250, 0.9)",
        gradient: [COLORS.modernBg, COLORS.modernBg],
        gradientStart: { x: 0, y: 0 },
        gradientEnd: { x: 0, y: 0 },
        textInverse: COLORS.black,
        error: COLORS.red500,
        success: COLORS.green500,
        warning: COLORS.amber500,
        surface: COLORS.white,
        primaryBg: "rgba(204, 255, 4, 0.1)",
        warningBg: "rgba(245, 158, 11, 0.1)",
        cyanBg: "rgba(6, 182, 212, 0.1)",
        pinkBg: "rgba(236, 72, 153, 0.1)",
        tealBg: "rgba(20, 184, 166, 0.1)"
    },
    fonts: {
        regular: { fontFamily: 'System', fontWeight: 'normal' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: 'bold' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    }
};

// 2. CLASSIC NEON (Yeni Tip - Neon Yeşil - Fildişi Arkaplan)
export const classicNeonTheme = {
    id: 'classic_neon',
    name: 'Classic Neon',
    colors: {
        background: "#f8f8f5",
        text: COLORS.textDark,
        subText: COLORS.textGray,
        primary: COLORS.neonGreen,
        secondary: COLORS.green500,
        tertiary: COLORS.amber500,
        card: COLORS.white,
        cardBorder: "#e2e8f0",
        border: "#e2e8f0",
        icon: COLORS.neonGreen,
        tab: COLORS.white,
        tabActive: COLORS.neonGreen,
        headerBg: COLORS.white,
        gradient: ["#f8f8f5", "#f8f8f5"],
        gradientStart: { x: 0, y: 0 },
        gradientEnd: { x: 0, y: 0 },
        textInverse: COLORS.black,
        error: COLORS.red500,
        success: COLORS.green500,
        warning: COLORS.amber500,
        surface: COLORS.white,
        primaryBg: "rgba(204, 255, 4, 0.1)",
        warningBg: "rgba(245, 158, 11, 0.1)",
        cyanBg: "rgba(6, 182, 212, 0.1)",
        pinkBg: "rgba(236, 72, 153, 0.1)",
        tealBg: "rgba(20, 184, 166, 0.1)"
    },
    fonts: {
        regular: { fontFamily: 'System', fontWeight: 'normal' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: 'bold' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    }
};

// 3. LIGHT THEME (From External)
export const lightTheme = {
    id: 'light',
    name: 'Light',
    colors: {
        background: COLORS.modernBg,
        text: COLORS.slate900,
        subText: COLORS.slate500,
        primary: COLORS.electricBlue,
        secondary: COLORS.emeraldStatus,
        tertiary: COLORS.amberStatus,
        card: COLORS.glassCardLight,
        cardBorder: COLORS.glassBorderLight,
        border: COLORS.glassBorderLight,
        icon: COLORS.electricBlue,
        tab: COLORS.white,
        tabActive: COLORS.electricBlue,
        headerBg: "rgba(248, 249, 250, 0.9)",
        gradient: [COLORS.modernBg, COLORS.modernBg],
        gradientStart: { x: 0, y: 0 },
        gradientEnd: { x: 0, y: 0 },
        textInverse: COLORS.white,
        error: COLORS.red500,
        success: COLORS.green500,
        warning: COLORS.amber500,
        surface: COLORS.white,
        primaryBg: "rgba(45, 91, 255, 0.1)",
        warningBg: "rgba(245, 158, 11, 0.1)",
        cyanBg: "rgba(6, 182, 212, 0.1)",
        pinkBg: "rgba(236, 72, 153, 0.1)",
        tealBg: "rgba(20, 184, 166, 0.1)"
    },
    fonts: {
        regular: { fontFamily: 'System', fontWeight: 'normal' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: 'bold' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    }
};

// 4. DARK THEME (From External)
export const darkTheme = {
    id: 'dark',
    name: 'Dark',
    colors: {
        background: COLORS.backgroundDark,
        text: COLORS.white,
        subText: COLORS.slate400,
        primary: COLORS.electricBlue,
        secondary: COLORS.emeraldStatus,
        tertiary: COLORS.amber500,
        card: "rgba(255, 255, 255, 0.05)",
        cardBorder: "rgba(255, 255, 255, 0.1)",
        border: "rgba(255, 255, 255, 0.1)",
        icon: COLORS.white,
        tab: "rgba(255,255,255,0.05)",
        tabActive: COLORS.electricBlue,
        headerBg: "transparent",
        gradient: [COLORS.backgroundDark, '#1e1b4b'],
        gradientStart: { x: 0.5, y: 0 },
        gradientEnd: { x: 0.5, y: 1 },
        textInverse: COLORS.black,
        error: COLORS.red500,
        success: COLORS.green500,
        warning: COLORS.amber500,
        surface: COLORS.slate900,
        primaryBg: "rgba(204, 255, 4, 0.1)",
        warningBg: "rgba(245, 158, 11, 0.1)",
        cyanBg: "rgba(6, 182, 212, 0.1)",
        pinkBg: "rgba(236, 72, 153, 0.1)",
        tealBg: "rgba(20, 184, 166, 0.1)"
    },
    fonts: {
        regular: { fontFamily: 'System', fontWeight: 'normal' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: 'bold' },
        heavy: { fontFamily: 'System', fontWeight: '900' },
    }
};

export const SHADOWS = {
    light: {
        shadowColor: COLORS.electricBlue,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 32,
        elevation: 4,
    },
    dark: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
};

export const RADIUS = {
    s: 8,
    m: 12,
    l: 22,
    xl: 32,
};

export const SPACING = {
    xs: 4,
    s: 8,
    sm: 12,
    m: 16,
    ml: 20,
    l: 24,
    xl: 32,
};

export const Z_INDEX = {
    base: 0,
    elevated: 10,
    dropdown: 50,
    sticky: 100,
    overlay: 200,
    modal: 300,
    toast: 1000,
};

export const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
};
