module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ['IBM Plex Sans'],
    },
    extend: {
      colors: {
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
        gray:{
          100:'#d4d4d4',
          200:'#a9a9a9',
          300:'#7d7d7f',
          400:'#525254',
          500:'#272729',
          600:'#1f1f21',
          700:'#1f1f21',
          800:'#101010',
          900:'#080808',
        },
      },
      spacing: {
        70: '17.5rem',
        160: '40rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}