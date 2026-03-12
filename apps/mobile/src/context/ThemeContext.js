import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { modernNeonTheme, classicNeonTheme, retroBlueTheme, retroDarkTheme, COLORS, SHADOWS, RADIUS, SPACING, Z_INDEX, BREAKPOINTS } from '../constants/theme';

const THEME_STORAGE_KEY = '@app_theme_v2';

// Create Context
const ThemeContext = createContext(null);

// Provider Component
export const ThemeProvider = ({ children }) => {
    const [themeId, setThemeId] = useState('modern_neon'); // default to modern neon
    const [isLoading, setIsLoading] = useState(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                const validThemes = ['modern_neon', 'classic_neon', 'retro_blue', 'retro_dark'];
                if (savedTheme && validThemes.includes(savedTheme)) {
                    setThemeId(savedTheme);
                }
            } catch (e) {
                console.warn('Failed to load theme preference');
            } finally {
                setIsLoading(false);
            }
        };
        loadTheme();
    }, []);

    // Listen for Motion Preference
    useEffect(() => {
        const checkMotionPreference = async () => {
            if (AccessibilityInfo.isReduceMotionEnabled) {
                const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
                setPrefersReducedMotion(isEnabled);
            }
        };

        checkMotionPreference();

        const subscription = AccessibilityInfo.addEventListener(
            'reduceMotionChanged',
            (isEnabled) => {
                setPrefersReducedMotion(isEnabled);
            }
        );

        return () => {
             if (subscription && subscription.remove) {
                 subscription.remove();
             } else if (AccessibilityInfo.removeEventListener) {
                 AccessibilityInfo.removeEventListener('reduceMotionChanged', setPrefersReducedMotion);
             }
        };
    }, []);

    // Toggle theme function - Cycles through 4 themes
    const toggleTheme = async () => {
        let newTheme;
        if (themeId === 'modern_neon') newTheme = 'classic_neon';
        else if (themeId === 'classic_neon') newTheme = 'retro_blue';
        else if (themeId === 'retro_blue') newTheme = 'retro_dark';
        else newTheme = 'modern_neon';

        setThemeId(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (e) {
            console.warn('Failed to save theme preference');
        }
    };

    // Set specific theme
    const setTheme = async (newThemeId) => {
        const validThemes = ['modern_neon', 'classic_neon', 'retro_blue', 'retro_dark'];
        if (validThemes.includes(newThemeId)) {
            setThemeId(newThemeId);
            try {
                await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeId);
            } catch (e) {
                console.warn('Failed to save theme preference');
            }
        }
    };

    // Get current theme object
    const theme = useMemo(() => {
        let baseTheme;
        if (themeId === 'classic_neon') baseTheme = classicNeonTheme;
        else if (themeId === 'retro_blue') baseTheme = retroBlueTheme;
        else if (themeId === 'retro_dark') baseTheme = retroDarkTheme;
        else baseTheme = modernNeonTheme;

        return {
            ...baseTheme,
            shadows: SHADOWS,
            radius: RADIUS,
            spacing: SPACING,
            zIndex: Z_INDEX,
            breakpoints: BREAKPOINTS,
            colors: {
                ...baseTheme.colors,
                ...COLORS
            }
        };
    }, [themeId]);

    // Context value
    const value = useMemo(() => ({
        theme,
        themeId,
        isDark: themeId === 'retro_dark',
        isLight: themeId !== 'retro_dark',
        isModern: themeId === 'modern_neon' || themeId === 'retro_blue',
        isClassic: themeId === 'classic_neon',
        isRetro: themeId === 'retro_blue' || themeId === 'retro_dark',
        toggleTheme,
        setTheme,
        isLoading,
        prefersReducedMotion,
        COLORS,
        SHADOWS,
        RADIUS,
        SPACING,
        Z_INDEX,
        BREAKPOINTS
    }), [theme, themeId, isLoading, prefersReducedMotion]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom Hook
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
