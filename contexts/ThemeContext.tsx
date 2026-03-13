import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
export type AccentColor = 'original' | 'titan' | 'night-blue' | 'union-orange' | 'union-colors' | 'verdone-scuro' | 'white-glass';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isDarkMode: boolean;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) return savedTheme;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    });

    const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
        const savedColor = localStorage.getItem('accentColor') as AccentColor;
        // Migration from old colors to new themes if necessary
        if (savedColor === ('orange' as any)) return 'union-orange';
        if (savedColor === ('blue' as any)) return 'night-blue';
        return savedColor || 'original';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove old classes
        root.classList.remove('theme-orange', 'theme-blue', 'theme-green', 'theme-purple', 'theme-original', 'theme-titan', 'theme-night-blue', 'theme-union-orange', 'theme-union-colors', 'theme-verdone-scuro', 'theme-white-glass');
        // Add new class
        root.classList.add(`theme-${accentColor}`);
        localStorage.setItem('accentColor', accentColor);
    }, [accentColor]);

    const toggleTheme = () => {
        setThemeState(prev => prev === 'light' ? 'dark' : 'light');
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    const setAccentColor = (color: AccentColor) => {
        setAccentColorState(color);
    };

    const isDarkMode = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDarkMode, accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
