/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#4D4DE6',
        customLight1: '#B2B2F9',
        customLight2: '#8080F0',
        customLight3: '#1A1A4D',
        customLight4: '#0F0F26',
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
