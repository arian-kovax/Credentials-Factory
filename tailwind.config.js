export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
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
