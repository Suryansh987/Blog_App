/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    backgroundImage : {
      'default-image' : "url('https://res.cloudinary.com/dybwlpu9u/image/upload/v1706519441/Avatar/h2w4cdnhxo5opzpnyydq.png')"
    },
    extend : {
      colors : {
        "body-color" : "#F4F3E8",
        "text-color" : "#24582A",
        "card" : "#d0e4cb"
      },
      fontFamily : {
        "Marmelad" : "marmelad"
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}