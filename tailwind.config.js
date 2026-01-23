/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        surface: "#141A22",
        surface2: "#0F141B",
        border: "#1F2933",
        text: "#FFFFFF",
        textMuted: "#A1A7B3",
        accent: "#58E000",
        accent2: "#79FF1A",
        danger: "#FF4D4D",
      },
      boxShadow: {
        panel: "0 12px 30px rgba(0,0,0,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
