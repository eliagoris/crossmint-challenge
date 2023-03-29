import { Flex } from "theme-ui"
import { Fragment } from "theme-ui/jsx-runtime"

import {
  CandidateMapContent,
  CandidateMapValue,
  parseCandidateMapValue,
} from "@/services/map"

type Props = {
  /** The map from the map API */
  map: string[][] | CandidateMapContent
  type: "CANDIDATE" | "GOAL"
}

/** Renders a Megaverse */
export function Megaverse({ map, type }: Props) {
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
      {map.map((row, index) => {
        return (
          <Flex key={index}>
            {row.map((value, index) => {
              let elementToReturn: React.ReactNode

              let parsed = value
              if (type === "CANDIDATE") {
                /** Parse the value to render it using the same code */
                parsed = parseCandidateMapValue(value as CandidateMapValue)
              }

              switch (parsed) {
                case "POLYANET":
                  elementToReturn = <span>🪐</span>
                  break

                case "RIGHT_COMETH":
                  elementToReturn = (
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
                  break

                case "UP_COMETH":
                  elementToReturn = (
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
                  break

                case "LEFT_COMETH":
                  elementToReturn = (
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
                  break

                case "DOWN_COMETH":
                  elementToReturn = (
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
                  break

                case "BLUE_SOLOON":
                  elementToReturn = (
                    <span
                      sx={{
                        filter:
                          "grayscale(100%) brightness(30%) sepia(100%) hue-rotate(-180deg) saturate(700%) contrast(0.8)",
                      }}
                    >
                      🌕
                    </span>
                  )
                  break

                case "RED_SOLOON":
                  elementToReturn = (
                    <span
                      sx={{
                        filter:
                          "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)",
                      }}
                    >
                      🌕
                    </span>
                  )
                  break

                case "WHITE_SOLOON":
                  elementToReturn = (
                    <span
                      sx={{
                        filter: "grayscale(100%)",
                      }}
                    >
                      🌕
                    </span>
                  )
                  break

                case "PURPLE_SOLOON":
                  elementToReturn = (
                    <span
                      sx={{
                        filter:
                          "grayscale(100%) brightness(70%) sepia(50%) hue-rotate(-100deg) saturate(500%) contrast(1)",
                      }}
                    >
                      🌕
                    </span>
                  )
                  break

                default:
                  elementToReturn = <span>🌌</span>
                  break
              }

              return <Fragment key={index}>{elementToReturn}</Fragment>
            })}
          </Flex>
        )
      })}
    </Flex>
  )
}
