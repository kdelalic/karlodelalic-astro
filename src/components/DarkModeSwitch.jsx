import React, { useCallback, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

const StyledIconButton = styled(IconButton)(() => ({
  width: 44,
  height: 44,
  padding: 10,
  borderRadius: '50%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: 'rgba(103, 114, 229, 0.1)',
    transform: 'scale(1.1)',
  },
  '& .icon': {
    width: 24,
    height: 24,
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-block',
  },
  '&.rotate .icon': {
    transform: 'rotate(180deg) scale(1.1)',
  },
}));

// Sun SVG Icon
const SunIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FDB813"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" fill="#FDB813" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

// Moon SVG Icon
const MoonIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94A3B8"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: 'scaleX(-1)' }}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#94A3B8" />
  </svg>
);

const DarkModeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read theme immediately
    const currentTheme = window.__theme === 'dark';
    setIsDark(currentTheme);
    setMounted(true);
  }, []);

  const handleClick = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    window.__setPreferredTheme(newTheme ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div style={{ width: 44, height: 44, position: 'relative' }}>
      <StyledIconButton
        onClick={handleClick}
        className={isDark ? 'rotate' : ''}
        aria-label="Toggle dark mode"
        style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.15s ease-in'
        }}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </StyledIconButton>
    </div>
  );
};

export default DarkModeSwitch;