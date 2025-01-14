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
gray: colors.neutral,
},
},
},
plugins: [
require('@tailwindcss/typography'),
],
darkMode: 'class',
};