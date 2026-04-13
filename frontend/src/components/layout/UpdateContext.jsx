import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { COLOR_THEMES } from '../../config/themes.js';

const UpdateContext = createContext(null);

export function UpdateProvider({ children }) {
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [darkMode, setDarkMode] = useState(false);
  const [themeKey, setThemeKey] = useState(() => {
    const stored = localStorage.getItem('theme_key');
    return stored && COLOR_THEMES[stored] ? stored : 'slate';
  });

  const theme = COLOR_THEMES[themeKey];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme_key', themeKey);
    
    // Apply CSS variables for theme colors
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-warning', theme.warning);
    root.style.setProperty('--color-success', theme.success);
    root.style.setProperty('--color-danger', theme.danger);
  }, [darkMode, themeKey, theme]);

  const value = useMemo(
    () => ({
      lastUpdated,
      setLastUpdated,
      darkMode,
      toggleDark: () => setDarkMode((value) => !value),
      theme,
      themeKey,
      setThemeKey,
      availableThemes: COLOR_THEMES,
    }),
    [lastUpdated, darkMode, theme, themeKey]
  );

  return <UpdateContext.Provider value={value}>{children}</UpdateContext.Provider>;
}

export function useLastUpdated() {
  const context = useContext(UpdateContext);
  if (!context) {
    throw new Error('useLastUpdated must be used within an UpdateProvider');
  }
  return context;
}

