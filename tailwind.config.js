/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        'sf-pro-display': ['SF Pro Display'], 
      },
      screens: {
        'xs': '480px',  // Extra small devices (portrait phones, less than 640px)
        'sm': '640px',  // Small devices (landscape phones, 640px and up)
        'md': '768px',  // Medium devices (tablets, 768px and up)
        'lg': '1024px', // Large devices (desktops, 1024px and up)
        'xl': '1280px', // Extra large devices (large desktops, 1280px and up)
        '2xl': '1536px', // 2X large devices (larger desktops, 1536px and up)
        '3xl': '1920px', // 3X large devices (very large desktops, 1920px and up)
      },
    },

  },
  plugins: [],
}


