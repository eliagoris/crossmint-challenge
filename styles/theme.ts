import type { Theme } from "theme-ui"

export const theme: Theme = {
  fonts: {
    body: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",
    heading: "Inter,sans-serif",
  },
  colors: {
    text: "#fff",
    background: "#20272a",
    primary: "#02aa82",
  },
  text: {
    heading: {
      display: "inline",
      backgroundImage: "linear-gradient(90deg,#6c6af6,#00ff85)",
      backgroundClip: "text",
      textFillColor: "transparent",
    },
  },

  buttons: {
    primary: {
      cursor: "pointer",
    },
  },

  styles: {
    root: {
      fontFamily: "body",
      background: "background",
    },
  },
}
