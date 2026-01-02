/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-dark': '#0b0f19',
                'brand-purple': '#2d1b4e',
                'neon-cyan': '#22d3ee',
                'neon-purple': '#c084fc',
                'glass-bg': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'pulse-glow': 'pulseGlow 2s infinite',
                'sbmi-pulse': 'sbmiFadeInPulse 1.2s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 20px #22d3ee' },
                    '50%': { opacity: '0.7', boxShadow: '0 0 10px #22d3ee' },
                },
                sbmiFadeInPulse: {
                    '0%': { opacity: '0', transform: 'translateY(8px) scale(0.96)' },
                    '60%': { opacity: '1', transform: 'translateY(0) scale(1.02)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
