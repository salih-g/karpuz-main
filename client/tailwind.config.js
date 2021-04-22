module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily:{
      body:['IBM Plex Sans']
    },
  
    },
    extend: {
      colors:{
        pink:{
          100:'#fff0f3',
          200:'#ffe2e6',
          300:'#ffd3da',
          400:'#ffc5cd',
          500:'#ffb6c1',
          600:'#cc929a',
          700:'#996d74',
          800:'#66494d',
          900:'#332427',
        },
      spacing:{
        70: '17.5rem'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
    },
  },
  plugins: [],
}
