module.exports = {
  theme: {
    fontFamily: {
      heading: ["Noto Serif"],
      body: ["Source Sans Pro"],
    },
    extend: {
      screens: {
        xl: "1440px",
      },
      colors: {
        beige: "#FBFAF3",
        "light-black": "#222222",
      },
      spacing: {
        "25vw": "25vw",
        "80vh": "80vh",
        "60vh": "60vh",
        "40vh": "40vh",
        "7": "1.75rem",
      },
      minHeight: {
        "80vh": "80vh",
        "70vh": "70vh",
        "60vh": "60vh",
        "50vh": "50vh",
        "40vh": "40vh",
      },
      maxHeight: {
        "50vh": "50vh",
      },
      inset: {
        "2rem": "2rem",
        "2.75rem": "2.75rem",
      },
      fontSize: {
        "8xl": "5.33rem",
        "12xl": "8rem",
      },
    },
  },
  variants: {
    opacity: ["responsive", "hover"],
    backgroundColor: ["responsive", "hover", "active"],
  },
  plugins: [],
}
