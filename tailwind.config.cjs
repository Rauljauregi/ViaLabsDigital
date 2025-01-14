const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
module.exports = {
content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
theme: {
extend: {
fontFamily: {
sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
body: ['Montserrat', ...defaultTheme.fontFamily.sans]
},
colors: {
white: '#f8f9fa',
primary: '#64D2E6',
secondary: '#399AAC',
gray: colors.neutral,
},
},
},
plugins: [
require('@tailwindcss/typography'),
require('@tailwindcss/forms'),
require('@tailwindcss/aspect-ratio'),
require('@tailwindcss/line-clamp'),
],
darkMode: 'class',
typography: {
DEFAULT: {
css: {
a: {
color: '#3182ce',
'&:hover': {
color: '#2c5282',
},
},
h1: {
color: '#64D2E6',
fontWeight: '700',
},
h2: {
color: '#399AAC',
fontWeight: '600',
},
h3: {
color: '#399AAC',
fontWeight: '500',
},
h4: {
color: '#399AAC',
fontWeight: '500',
},
'.dark h1, .dark h2, .dark h3, .dark h4': {
color: '#f8f9fa',
},
},
},
},
};