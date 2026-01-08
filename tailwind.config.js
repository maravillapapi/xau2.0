/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Backgrounds
                'bg-primary': '#F8F9FA',
                'bg-secondary': '#FFFFFF',
                'bg-tertiary': '#F1F3F5',

                // Text
                'txt-primary': '#1A1A1A',
                'txt-secondary': '#6B7280',
                'txt-tertiary': '#9CA3AF',

                // Accents
                'accent-blue': '#3B82F6',
                'accent-gold': '#F59E0B',
                'accent-green': '#10B981',
                'accent-red': '#EF4444',
                'accent-orange': '#F97316',
                'accent-purple': '#8B5CF6',
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'SF Pro Display',
                    'SF Pro Text',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif'
                ],
            },
            fontSize: {
                'xs': ['11px', { lineHeight: '1.4' }],
                'sm': ['13px', { lineHeight: '1.5' }],
                'base': ['14px', { lineHeight: '1.5' }],
                'md': ['15px', { lineHeight: '1.4', fontWeight: '500' }],
                'lg': ['17px', { lineHeight: '1.3', fontWeight: '600' }],
                'xl': ['20px', { lineHeight: '1.2', fontWeight: '600' }],
                '2xl': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
                '3xl': ['32px', { lineHeight: '1.1', fontWeight: '700' }],
                '4xl': ['48px', { lineHeight: '1.0', fontWeight: '700' }],
            },
            borderRadius: {
                'sm': '8px',
                'md': '12px',
                'lg': '16px',
                'xl': '20px',
                '2xl': '24px',
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                'lg': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
                'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
            },
            spacing: {
                '1': '4px',
                '2': '8px',
                '3': '12px',
                '4': '16px',
                '5': '20px',
                '6': '24px',
                '8': '32px',
                '10': '40px',
            },
            animation: {
                'modal-slide-up': 'modalSlideUp 200ms ease-out',
                'drawer-slide-in': 'drawerSlideIn 300ms ease-out',
                'fade-in': 'fadeIn 150ms ease-out',
            },
            keyframes: {
                modalSlideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                drawerSlideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
