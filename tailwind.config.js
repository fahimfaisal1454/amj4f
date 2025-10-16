/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pactBg: "#f4f3f1",
        pactPurple: "#8c0067",
        pactPurpleHover: "#a10379",
      },
      height: { nav: "72px" },
      maxWidth: { container: "72rem" },
    },
  },
  plugins: [],
};
