// Reuse daisyUI's public Tailwind design tokens without its browser component CSS.
const plugin = require('tailwindcss/plugin');
const variables = require('daisyui/functions/variables').default;

module.exports = plugin(() => {}, { theme: { extend: variables } });
