/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{astro,html,js,md,mdx,ts}'],
    theme: {
        extend: {
            colors: {
                white: '#f8f9fa'
            },
            fontFamily: {
                body: ['Manrope', ...defaultTheme.fontFamily.sans]
            },
            gridTemplateColumns: {
                list: 'repeat(auto-fill, minmax(400px, max-content))'
            },
            typography: {
                DEFAULT: {
                    css: {
                        'math-display': {
                            margin: '1em 0',
                        },
                        '.katex': {
                            color: 'inherit',
                            fontFamily: 'KaTeX_Main, serif',
                        },
                        '.katex-display': {
                            margin: '1.5em 0',
                            overflow: 'auto hidden',
                            padding: '0.5em 0',
                        },
                        // Estilos para modo oscuro
                        '.dark .katex': {
                            color: '#f8f9fa',
                        },
                        // Ajustes para fórmulas inline
                        '.math-inline': {
                            display: 'inline-flex',
                            alignItems: 'center',
                        },
                        // Ajustes para scroll en fórmulas largas
                        '.katex-display > .katex': {
                            whiteSpace: 'nowrap',
                        },
                        // Estilos para elementos específicos de KaTeX
                        '.katex .mord': {
                            color: 'inherit',
                        },
                        '.katex .mrel': {
                            color: 'inherit',
                        },
                        '.katex .mbin': {
                            color: 'inherit',
                        },
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
}