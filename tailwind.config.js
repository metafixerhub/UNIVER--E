/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            DEFAULT: '#082B59',
            dark: '#051C3A',
            light: '#0D3E7E',
            50: '#F0F4FA',
            100: '#D9E3F1',
            900: '#082B59',
          },
          gold: {
            DEFAULT: '#F5A900',
            hover: '#D99500',
            light: '#FFF8E6',
            50: '#FEF9EC',
          },
          blue: {
            DEFAULT: '#13A8E8',
            hover: '#0D8EC7',
            light: '#E8F7FD',
            50: '#F0FAFF',
          },
          green: {
            DEFAULT: '#28A745',
            hover: '#218838',
            light: '#EAF7ED',
            50: '#F0FBF3',
          },
          bgLight: '#F5F8FC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
