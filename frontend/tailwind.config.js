/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: "#6F879E",
        card: "#FFFFFF",
        textPrimary: "#222126",
        textMuted: "#7A8CA3",
        link: "#13387b",
        inputBg: "#F3F8FC",
        divider: "#1d2329",
        stepActive: "#67809A",
        stepInactive: "#AAC9EA",
      },
      borderRadius: {
        card: "20px",
        field: "5px",
      },
      maxWidth: {
        auth: "1440px",
        form: "390px",
      },
      minHeight: {
        auth: "700px",
      },
      fontSize: {
        title: ["36px", "36px"],
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
