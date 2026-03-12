import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { modernLightTheme, classicLightTheme, darkTheme, COLORS, SHADOWS, RADIUS, SPACING, Z_INDEX, BREAKPOINTS } from '../constants/theme';

const THEME_STORAGE_KEY = '@app_theme';

// Create Context
const ThemeContext = createContext(null);

// Provider Component
export const ThemeProvider = ({ children }) => {
    const [themeId, setThemeId] = useState('light'); // default to light (modern)
    const [isLoading, setIsLoading] = useState(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'classic')) {
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
             // Clean up subscription if method exists (older RN versions might differ)
             if (subscription && subscription.remove) {
                 subscription.remove();
             } else if (AccessibilityInfo.removeEventListener) {
                 AccessibilityInfo.removeEventListener('reduceMotionChanged', setPrefersReducedMotion);
             }
        };
    }, []);

    // Toggle theme function - Cycles through Light -> Classic -> Dark
    const toggleTheme = async () => {
        let newTheme;
        if (themeId === 'light') newTheme = 'classic';
        else if (themeId === 'classic') newTheme = 'dark';
        else newTheme = 'light';

        setThemeId(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (e) {
            console.warn('Failed to save theme preference');
        }
    };

    // Set specific theme
    const setTheme = async (newThemeId) => {
        if (['light', 'classic', 'dark'].includes(newThemeId)) {
            setThemeId(newThemeId);
            try {
                await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeId);
            } catch (e) {
                console.warn('Failed to save theme preference');
            }
        }
    };

    // Get current theme object, now including constants
    const theme = useMemo(() => {
        let baseTheme;
        if (themeId === 'dark') baseTheme = darkTheme;
        else if (themeId === 'classic') baseTheme = classicLightTheme;
        else baseTheme = modernLightTheme;

        return {
            ...baseTheme,
            shadows: SHADOWS,
            radius: RADIUS,
            spacing: SPACING,
            zIndex: Z_INDEX,
            breakpoints: BREAKPOINTS,
            // Expose COLORS directly under theme for convenience if needed, though primary use is theme.colors
            colors: {
                ...baseTheme.colors,
                ...COLORS // Merge COLORS constants directly for easier access if preferred
            }
        };
    }, [themeId]);

    // Context value
    const value = useMemo(() => ({
        theme,
        themeId,
        isDark: themeId === 'dark',
        isLight: themeId === 'light' || themeId === 'classic',
        isModern: themeId === 'light',
        isClassic: themeId === 'classic',
        toggleTheme,
        setTheme,
        isLoading,
        prefersReducedMotion,
        // Expose shared constants explicitly as well, for direct access where theme.xxx is not desired
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
