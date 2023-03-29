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

      ":disabled": {
        opacity: 0.7,
        cursor: "progress",
      },
    },

    special: {
      transition: "all .225s linear",
      background: "linear-gradient(90deg,#6c6af6,#00ff85)",
      color: "#333",
      overflow: "hidden",
      position: "relative",
      cursor: "pointer",

      span: {
        zIndex: 1,
      },

      ":hover": {
        transform: "scale(1.05)",

        ":after": {
          left: "120%",
          transition: "all 550ms cubic-bezier(0.19, 1, 0.22, 1)",
        },
      },

      ":after": {
        background: "#fff",
        content: '""',
        height: "155px",
        left: "-75px",
        opacity: ".2",
        position: "absolute",
        top: "-50px",
        transform: "rotate(35deg)",
        transition: "all 550ms cubic-bezier(0.19, 1, 0.22, 1)",
        width: "50px",
        zIndex: "-10",
      },

      ":disabled": {
        opacity: 0.7,
        cursor: "progress",
      },
    },
  },

  styles: {
    root: {
      fontFamily: "body",
      background: "background",
    },
  },
}
