/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar'

export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './modules/y0f-terminal/src/**/*.{js,jsx,ts,tsx}'],
  plugins: [scrollbar({ nocompatible: true })],
}
