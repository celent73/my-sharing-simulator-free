import React from 'react';

interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

export const ClientModeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "shrink-0 w-6 h-6"} style={style}>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="currentColor" />
        <path d="M6 21V19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 5L17.5 8H14.5L16 5Z" fill="currentColor" className="opacity-50" />
    </svg>
);

export const FamilyModeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "shrink-0 w-6 h-6"} style={style}>
        <circle cx="12" cy="7" r="3" fill="currentColor" />
        <path d="M12 11C9.23858 11 7 13.2386 7 16V17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17V16C17 13.2386 14.7614 11 12 11Z" fill="currentColor" />
        <circle cx="18.5" cy="9.5" r="2.5" fill="currentColor" className="opacity-50" />
        <path d="M18.5 13C16.567 13 15 14.567 15 16.5V17C15 17.5523 15.4477 18 16 18H21C21.5523 18 22 17.5523 22 17V16.5C22 14.567 20.433 13 18.5 13Z" fill="currentColor" className="opacity-50" />
        <circle cx="5.5" cy="9.5" r="2.5" fill="currentColor" className="opacity-50" />
        <path d="M5.5 13C3.567 13 2 14.567 2 16.5V17C2 17.5523 2.44772 18 3 18H8C8.55228 18 9 17.5523 9 17V16.5C9 14.567 7.433 13 5.5 13Z" fill="currentColor" className="opacity-50" />
    </svg>
);

export const CondoModeIcon: React.FC<IconProps> = ({ className, style }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className || "shrink-0 w-6 h-6"} style={style}>
        <path d="M4 21H10V8C10 7.44772 9.55228 7 9 7H5C4.44772 7 4 7.44772 4 8V21Z" fill="currentColor" className="opacity-50" />
        <path d="M14 21H20V4C20 3.44772 19.5523 3 19 3H15C14.4477 3 14 3.44772 14 4V21Z" fill="currentColor" />
        <rect x="6" y="9" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" />
        <rect x="6" y="13" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" />
        <rect x="6" y="17" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" />
        <rect x="16" y="6" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" />
        <rect x="16" y="10" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" />
        <rect x="16" y="14" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" />
        <rect x="16" y="18" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" />
        <path d="M2 21H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);
