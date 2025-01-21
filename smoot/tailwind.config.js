/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#4D4DE6',
      },
      '.react-player': {
        borderRadius: '10px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        fadeOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.9)" },
        },
      },
      animation: {
        fadeOut: "fadeOut 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
