/** @type {import('tailwindcss').Config} */

import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  darkMode: 'class',
  content: [
    "./node_modules/flowbite/**/*.js"  ,
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      }     
    },
  },
  plugins: [PrimeUI,
    require('flowbite/plugin')

  ],

}

