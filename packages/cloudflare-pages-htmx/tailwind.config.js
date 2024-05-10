/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './{src,functions,lib}/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
