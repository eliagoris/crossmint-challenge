import { Flex } from "theme-ui"

type Props = {
  /** The map from the map API */
  map: string[][]
}

/** Renders a Megaverse */
export function Megaverse({ map }: Props) {
  return (
    <Flex
      sx={{
        flexDirection: "column",
        letterSpacing: "1em",
        gap: "4px",
        span: {
          width: "32px",
          height: "19px",
        },
      }}
    >
      {map.map((row) => {
        return (
          <Flex key={row[0]} sx={{}}>
            {row.map((value) => {
              switch (value) {
                case "POLYANET":
                  return <span>🪐</span>

                case "RIGHT_COMETH":
                  return (
                    <span
                      sx={{
                        position: "relative",
                        rotate: "140deg",
                        top: ".25rem",
                        right: ".75rem",
                      }}
                    >
                      ☄️
                    </span>
                  )

                case "UP_COMETH":
                  return (
                    <span
                      sx={{
                        position: "relative",
                        rotate: "48deg",
                        top: ".5rem",
                        right: ".25rem",
                      }}
                    >
                      ☄️
                    </span>
                  )

                case "LEFT_COMETH":
                  return (
                    <span
                      sx={{
                        position: "relative",
                        rotate: "330deg",
                        bottom: ".25rem",
                        left: ".25rem",
                      }}
                    >
                      ☄️
                    </span>
                  )

                case "DOWN_COMETH":
                  return (
                    <span
                      sx={{
                        position: "relative",
                        rotate: "230deg",
                        right: ".75rem",
                        bottom: ".5rem",
                      }}
                    >
                      ☄️
                    </span>
                  )

                case "BLUE_SOLOON":
                  return (
                    <span
                      sx={{
                        filter:
                          "grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8)",
                      }}
                    >
                      🌕
                    </span>
                  )

                case "RED_SOLOON":
                  return (
                    <span
                      sx={{
                        filter:
                          "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)",
                      }}
                    >
                      🌕
                    </span>
                  )

                case "WHITE_SOLOON":
                  return (
                    <span
                      sx={{
                        filter: "grayscale(100%)",
                      }}
                    >
                      🌕
                    </span>
                  )

                case "PURPLE_SOLOON":
                  return (
                    <span
                      sx={{
                        filter:
                          "grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)",
                      }}
                    >
                      🌕
                    </span>
                  )

                default:
                  return <span>🌌</span>
              }
            })}
          </Flex>
        )
      })}
    </Flex>
  )
}
