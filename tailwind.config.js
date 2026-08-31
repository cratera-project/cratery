/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        code: [
          'ui-monospace',
          '"Cascadia Code"',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark base surfaces
        night: {
          DEFAULT: '#16171b',
          panel: '#1f2126',
          raised: '#2a2d34',
          edge: '#3a3e47',
        },
        ink: {
          DEFAULT: '#e8e9ec',
          dim: '#a8adb8',
          faint: '#6b707c',
        },
        stone: {
          darkest: '#1a1a1a',
          dark: '#3c3c3c',
          medium: '#7c7c7c',
          light: '#c6c6c6',
          lightest: '#ebebeb',
        },
        rust: {
          orange: '#ce422b',
          dark: '#a0321f',
        },
        inventory: 'var(--inventory-bg)',
        slot: '#373737',
        tooltip: '#100010',
        grass: '#7cb342',
        redstone: '#e05545',
        diamond: '#42a5f5',
        gold: '#ffa000',
        emerald: '#00c853',
        obsidian: '#7b1fa2',
      },
      spacing: {
        'g1': '8px',
        'g2': '16px',
        'g3': '24px',
        'g4': '32px',
        'g6': '48px',
        'g8': '64px',
      },
      borderWidth: {
        3: '3px',
        4: '4px',
        5: '5px',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '2px',
      },
      boxShadow: {
        pixel: '4px 4px 0px rgba(0, 0, 0, 0.45)',
        'pixel-lg': '6px 6px 0px rgba(0, 0, 0, 0.5)',
        glow: '0 0 24px rgba(206, 66, 43, 0.25)',
      },
    },
  },
  plugins: [],
}
