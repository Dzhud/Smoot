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
        brightYellow: '#FFD700',
        brightOrange: '#FFA500',
        softBeige: '#F8E69A',
        lightPurple: '#9370DB',
        whiteSmoke: '#F5F5F5',
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
        flyInFromLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        flyInFromRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        flyInFromTop: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        flyInFromBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      fontFamily: {
        //amanda: ['Amanda Rose', 'cursive'], // Add Amanda Rose font
        montserrat: ['Montserrat', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        fadeOut: "fadeOut 0.5s ease-out",
        flyInFromLeft: "flyInFromLeft 1s ease-out",
        flyInFromRight: "flyInFromRight 1s ease-out",
        flyInFromTop: "flyInFromTop 1s ease-out",
        flyInFromBottom: "flyInFromBottom 1s ease-out",
      },
    },
  },
  plugins: [],
};
