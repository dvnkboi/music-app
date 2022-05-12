module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray': {
          DEFAULT: '#777F88',
          '50': '#CDCFD3',
          '100': '#C0C4C8',
          '200': '#A8ADB3',
          '300': '#8F969E',
          '400': '#777F88',
          '500': '#5C636A',
          '600': '#42474C',
          '700': '#282B2E',
          '800': '#0E0F10',
          '900': '#050505'
        },
      }
    },
  },
  plugins: [],
};
